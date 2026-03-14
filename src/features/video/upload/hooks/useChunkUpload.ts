import { useCallback, useRef } from 'react'
import SparkMD5 from 'spark-md5'
import api, { apiClient } from '@/lib/api'
import { UploadConfig } from '@/lib/constants'
import type { UploadFile } from '../../types'

const { DEFAULT_CHUNK_SIZE, DEFAULT_CHUNK_CONCURRENCY } = UploadConfig

interface ChunkUploadOptions {
  chunkSize?: number
  concurrency?: number
  onProgress?: (id: string, progress: UploadFile['progress']) => void
  onSuccess?: (id: string, data: { url: string; videoId?: string }) => void
  onError?: (id: string, error: string) => void
}

interface InitResponse {
  exists: boolean
  url?: string
  videoId?: string
  uploadId: string
  uploadedChunks: number[]
}

interface MergeResponse {
  url: string
  videoId?: string
}

interface UploadTask {
  id: string
  file: File
  uploadId?: string
  md5?: string
  uploadedChunks: Set<number>
  controller: AbortController
  chunks: {
    total: number
    uploaded: number
  }
  startTime: number
  lastLoaded: number
  lastTime: number
}

export function useChunkUpload(options: ChunkUploadOptions = {}) {
  const {
    chunkSize = DEFAULT_CHUNK_SIZE,
    concurrency = DEFAULT_CHUNK_CONCURRENCY,
    onProgress,
    onSuccess,
    onError,
  } = options

  const tasksRef = useRef<Map<string, UploadTask>>(new Map())

  const calculateMD5 = useCallback(
    async (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const spark = new SparkMD5.ArrayBuffer()
        const reader = new FileReader()
        const chunkCount = Math.ceil(file.size / chunkSize)
        let currentChunk = 0

        reader.onload = e => {
          if (e.target?.result) {
            spark.append(e.target.result as ArrayBuffer)
            currentChunk++

            if (currentChunk < chunkCount) {
              loadNext()
            } else {
              resolve(spark.end())
            }
          }
        }

        reader.onerror = () => {
          reject(new Error('Failed to read file for MD5 calculation'))
        }

        const loadNext = () => {
          const start = currentChunk * chunkSize
          const end = Math.min(start + chunkSize, file.size)
          reader.readAsArrayBuffer(file.slice(start, end))
        }

        loadNext()
      })
    },
    [chunkSize]
  )

  const updateProgress = useCallback(
    (task: UploadTask, loaded: number, total: number) => {
      const now = Date.now()
      const timeDiff = now - task.lastTime
      const loadedDiff = loaded - task.lastLoaded

      let speed: number | undefined
      let remaining: number | undefined

      if (timeDiff > 0 && loadedDiff > 0) {
        speed = (loadedDiff / timeDiff) * 1000
        const remainingBytes = total - loaded
        remaining = remainingBytes / speed
      }

      task.lastTime = now
      task.lastLoaded = loaded

      const progress: UploadFile['progress'] = {
        loaded,
        total,
        percent: Math.round((loaded / total) * 100),
        speed,
        remaining,
      }

      onProgress?.(task.id, progress)
    },
    [onProgress]
  )

  const uploadChunk = useCallback(
    async (
      task: UploadTask,
      chunkIndex: number,
      chunk: Blob,
      signal: AbortSignal
    ): Promise<void> => {
      const formData = new FormData()
      formData.append('file', chunk)
      formData.append('uploadId', task.uploadId!)
      formData.append('chunkNumber', String(chunkIndex + 1))
      formData.append('totalChunks', String(task.chunks.total))
      formData.append('md5', task.md5!)

      const response = await apiClient.post('upload/chunk', {
        body: formData,
        signal,
      })

      if (!response.ok) {
        throw new Error(`Chunk ${chunkIndex + 1} upload failed`)
      }

      task.chunks.uploaded++
      task.uploadedChunks.add(chunkIndex)

      const totalLoaded = task.chunks.uploaded * chunkSize
      const actualLoaded = Math.min(totalLoaded, task.file.size)
      updateProgress(task, actualLoaded, task.file.size)
    },
    [chunkSize, updateProgress]
  )

  const uploadWithConcurrency = useCallback(
    async (task: UploadTask, signal: AbortSignal): Promise<void> => {
      const { file, uploadedChunks } = task
      const totalChunks = Math.ceil(file.size / chunkSize)
      task.chunks = { total: totalChunks, uploaded: uploadedChunks.size }

      const chunks: { index: number; blob: Blob }[] = []
      for (let i = 0; i < totalChunks; i++) {
        if (!uploadedChunks.has(i)) {
          const start = i * chunkSize
          const end = Math.min(start + chunkSize, file.size)
          chunks.push({ index: i, blob: file.slice(start, end) })
        }
      }

      if (uploadedChunks.size > 0) {
        const initialLoaded = Math.min(uploadedChunks.size * chunkSize, file.size)
        updateProgress(task, initialLoaded, file.size)
      }

      const queue = [...chunks]
      const activeChunks = new Map<number, Promise<void>>()
      const failedChunks = new Set<number>()

      while (queue.length > 0 || activeChunks.size > 0) {
        if (signal.aborted) {
          throw new Error('Upload cancelled')
        }

        while (activeChunks.size < concurrency && queue.length > 0) {
          const chunk = queue.shift()!
          const promise = uploadChunk(task, chunk.index, chunk.blob, signal)
            .then(() => {
              activeChunks.delete(chunk.index)
            })
            .catch(() => {
              activeChunks.delete(chunk.index)
              if (!signal.aborted) {
                failedChunks.add(chunk.index)
              }
            })
          activeChunks.set(chunk.index, promise)
        }

        if (activeChunks.size > 0) {
          await Promise.race(activeChunks.values())
        }
      }

      if (failedChunks.size > 0) {
        throw new Error(`${failedChunks.size} 个分片上传失败`)
      }
    },
    [chunkSize, concurrency, uploadChunk, updateProgress]
  )

  const uploadFile = useCallback(
    async (
      uploadFile: UploadFile,
      updateFile: (id: string, updates: Partial<UploadFile>) => void
    ): Promise<void> => {
      const { id, file } = uploadFile

      if (!file) {
        updateFile(id, { status: 'error', error: '文件不存在，请重新选择' })
        onError?.(id, '文件不存在，请重新选择')
        return
      }

      const controller = new AbortController()
      const task: UploadTask = {
        id,
        file,
        uploadedChunks: new Set(),
        controller,
        chunks: { total: 0, uploaded: 0 },
        startTime: Date.now(),
        lastLoaded: 0,
        lastTime: Date.now(),
      }

      tasksRef.current.set(id, task)

      try {
        let md5 = uploadFile.md5

        if (!md5) {
          updateFile(id, { status: 'hashing' })
          md5 = await calculateMD5(file)
        }

        task.md5 = md5
        updateFile(id, { md5 })

        const initResult = await api.post<InitResponse>('upload/init', {
          md5,
          fileName: file.name,
          fileSize: file.size,
          totalChunks: Math.ceil(file.size / chunkSize),
        })

        if (initResult.exists && initResult.url) {
          updateFile(id, {
            status: 'success',
            isInstantUpload: true,
            progress: { loaded: file.size, total: file.size, percent: 100 },
          })
          onSuccess?.(id, { url: initResult.url, videoId: initResult.videoId })
          tasksRef.current.delete(id)
          return
        }

        updateFile(id, { status: 'uploading' })

        const { uploadId, uploadedChunks } = initResult
        task.uploadId = uploadId
        task.uploadedChunks = new Set(uploadedChunks)

        updateFile(id, {
          uploadId,
          uploadedChunks,
          chunks: {
            total: Math.ceil(file.size / chunkSize),
            uploaded: uploadedChunks.length,
          },
        })

        await uploadWithConcurrency(task, controller.signal)

        const mergeResult = await api.post<MergeResponse>('upload/merge', {
          uploadId: task.uploadId,
          md5,
          fileName: file.name,
          totalChunks: task.chunks.total,
        })

        updateFile(id, {
          status: 'success',
          progress: { loaded: file.size, total: file.size, percent: 100 },
        })
        onSuccess?.(id, { url: mergeResult.url, videoId: mergeResult.videoId })
      } catch (error) {
        if (error instanceof Error && error.message === 'Upload cancelled') {
          updateFile(id, {
            status: 'paused',
            uploadId: task.uploadId,
            uploadedChunks: Array.from(task.uploadedChunks),
          })
          return
        }

        const message = error instanceof Error ? error.message : '上传失败'
        updateFile(id, {
          status: 'error',
          error: message,
          uploadId: task.uploadId,
          uploadedChunks: Array.from(task.uploadedChunks),
        })
        onError?.(id, message)
      } finally {
        tasksRef.current.delete(id)
      }
    },
    [calculateMD5, chunkSize, uploadWithConcurrency, onSuccess, onError]
  )

  const cancel = useCallback((id: string) => {
    const task = tasksRef.current.get(id)
    if (task) {
      task.controller.abort()
      tasksRef.current.delete(id)
    }
  }, [])

  return {
    uploadFile,
    cancel,
  }
}
