import { CloudUpload } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { UploadConfig } from '@/lib/constants'
import { useUploadStore } from '@/shared/stores/upload'
import type { UploadFile } from '../../types'

const { MAX_FILE_SIZE } = UploadConfig

export function UploadDropzone() {
  const addFiles = useUploadStore(s => s.addFiles)

  const handleDrop = (acceptedFiles: File[]) => {
    const uploadFiles: UploadFile[] = acceptedFiles.map(file => ({
      id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file,
      fileName: file.name,
      progress: { loaded: 0, total: file.size, percent: 0 },
      status: 'idle' as const,
    }))
    addFiles(uploadFiles)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: { 'video/*': ['.mp4', '.mov', '.avi', '.mkv', '.webm'] },
    maxSize: MAX_FILE_SIZE,
    multiple: true,
  })

  return (
    <div
      {...getRootProps()}
      className={`
        flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12
        transition-colors cursor-pointer
        ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'}
      `}
    >
      <input {...getInputProps()} />
      <CloudUpload className='mb-4 h-12 w-12 text-muted-foreground' />
      <p className='mb-2 text-lg font-medium'>
        {isDragActive ? '放开以上传文件' : '拖拽文件到此处上传'}
      </p>
      <p className='text-sm text-muted-foreground'>或点击选择文件</p>
      <p className='mt-4 text-xs text-muted-foreground'>
        支持 MP4, MOV, AVI, MKV, WebM · 单文件最大 5GB · 支持断点续传
      </p>
    </div>
  )
}
