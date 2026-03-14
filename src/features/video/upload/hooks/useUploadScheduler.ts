import { useCallback, useEffect, useRef } from 'react'
import { UploadConfig } from '@/lib/constants'
import { useUploadStore } from '@/shared/stores/upload'
import type { UploadFile } from '../../types'
import { useChunkUpload } from './useChunkUpload'

const { MAX_FILE_CONCURRENCY } = UploadConfig

export function useUploadScheduler() {
  const files = useUploadStore(s => s.files)
  const updateFile = useUploadStore(s => s.updateFile)
  const setUploading = useUploadStore(s => s.setUploading)
  const processingRef = useRef<Set<string>>(new Set())

  const { uploadFile, cancel } = useChunkUpload({
    onProgress: (id, progress) => {
      updateFile(id, { progress })
    },
    onSuccess: id => {
      processingRef.current.delete(id)
      checkAllCompleted()
    },
    onError: id => {
      processingRef.current.delete(id)
      checkAllCompleted()
    },
  })

  const checkAllCompleted = useCallback(() => {
    const currentFiles = useUploadStore.getState().files
    const hasActiveUploads = currentFiles.some(
      f => f.status === 'uploading' || f.status === 'hashing'
    )
    if (!hasActiveUploads) {
      setUploading(false)
    }
  }, [setUploading])

  const cancelTask = useCallback(
    (id: string) => {
      cancel(id)
      processingRef.current.delete(id)
    },
    [cancel]
  )

  useEffect(() => {
    const toMarkStale: UploadFile[] = []

    for (const file of files) {
      if (
        (file.status === 'uploading' || file.status === 'paused') &&
        !file.file &&
        file.md5 &&
        file.uploadId
      ) {
        toMarkStale.push(file)
      }
    }

    for (const file of toMarkStale) {
      updateFile(file.id, {
        status: 'error',
        error: '页面已刷新，请重新选择文件续传',
      })
    }
  }, [files, updateFile])

  useEffect(() => {
    const { idleFiles, pausedFiles } = files.reduce(
      (acc, file) => {
        if (file.status === 'idle' && !processingRef.current.has(file.id)) {
          acc.idleFiles.push(file)
        } else if (
          file.status === 'paused' &&
          file.md5 &&
          file.file &&
          !processingRef.current.has(file.id)
        ) {
          acc.pausedFiles.push(file)
        }
        return acc
      },
      { idleFiles: [] as UploadFile[], pausedFiles: [] as UploadFile[] }
    )

    const availableSlots = MAX_FILE_CONCURRENCY - processingRef.current.size
    if (availableSlots <= 0) return

    const toProcess = [...idleFiles, ...pausedFiles].slice(0, availableSlots)

    if (toProcess.length > 0) {
      setUploading(true)
      for (const file of toProcess) {
        processingRef.current.add(file.id)
        uploadFile(file, updateFile)
      }
    }
  }, [files, uploadFile, updateFile, setUploading])

  return { cancelTask }
}
