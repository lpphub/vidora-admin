import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

export interface UploadProgress {
  loaded: number
  total: number
  percent: number
}

export interface UploadFile {
  id: string
  file: File
  progress: UploadProgress
  status: 'idle' | 'uploading' | 'success' | 'error'
  error?: string
  url?: string
}

export function useUpload() {
  const [files, setFiles] = useState<UploadFile[]>([])
  const [isUploading, setIsUploading] = useState<boolean>(false)

  const addFiles = useCallback((newFiles: File[]) => {
    const uploadFiles: UploadFile[] = newFiles.map(file => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      file,
      progress: { loaded: 0, total: file.size, percent: 0 },
      status: 'idle',
    }))
    setFiles(prev => [...prev, ...uploadFiles])
  }, [])

  const removeFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id))
  }, [])

  const clearFiles = useCallback(() => {
    setFiles([])
  }, [])

  const uploadFile = useCallback(async (uploadFile: UploadFile) => {
    setFiles(prev =>
      prev.map(f => (f.id === uploadFile.id ? { ...f, status: 'uploading' as const } : f))
    )

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFile.file,
      })
      const data = await res.json()
      const response: { url: string } = data.data

      setFiles(prev =>
        prev.map(f =>
          f.id === uploadFile.id
            ? {
                ...f,
                status: 'success' as const,
                url: response.url,
              }
            : f
        )
      )

      return response
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : '上传失败'
      setFiles(prev =>
        prev.map(f =>
          f.id === uploadFile.id
            ? {
                ...f,
                status: 'error' as const,
                error: message,
              }
            : f
        )
      )
      throw error
    }
  }, [])

  const uploadAll = useCallback(async () => {
    const idleFiles = files.filter(f => f.status === 'idle')
    if (idleFiles.length === 0) return

    setIsUploading(true)
    try {
      await Promise.all(idleFiles.map(file => uploadFile(file)))
    } finally {
      setIsUploading(false)
    }
  }, [files, uploadFile])

  const dropzone = useDropzone({
    onDrop: addFiles,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.mkv', '.webm'],
    },
    maxSize: 5 * 1024 * 1024 * 1024,
    multiple: true,
  })

  return {
    files,
    isUploading,
    addFiles,
    removeFile,
    clearFiles,
    uploadFile,
    uploadAll,
    dropzone,
  }
}
