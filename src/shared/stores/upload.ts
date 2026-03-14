import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UploadFile } from '@/features/video/types'
import { StorageKey } from '@/lib/constants'

interface UploadStore {
  files: UploadFile[]
  isUploading: boolean
  addFiles: (files: UploadFile[]) => void
  removeFile: (id: string) => void
  updateFile: (id: string, updates: Partial<UploadFile>) => void
  setUploading: (value: boolean) => void
  clearCompleted: () => void
  clearAll: () => void
}

export const useUploadStore = create<UploadStore>()(
  persist(
    set => ({
      files: [],
      isUploading: false,
      addFiles: newFiles => set(state => ({ files: [...state.files, ...newFiles] })),
      removeFile: id => set(state => ({ files: state.files.filter(f => f.id !== id) })),
      updateFile: (id, updates) =>
        set(state => ({
          files: state.files.map(f => (f.id === id ? { ...f, ...updates } : f)),
        })),
      setUploading: value => set({ isUploading: value }),
      clearCompleted: () =>
        set(state => ({
          files: state.files.filter(f => f.status !== 'success' && f.status !== 'error'),
        })),
      clearAll: () => set({ files: [], isUploading: false }),
    }),
    {
      name: StorageKey.UploadState,
      partialize: state => ({
        files: state.files
          .filter(f => f.status === 'paused' || f.status === 'uploading')
          .map(f => ({
            ...f,
            file: null,
          })),
      }),
      onRehydrateStorage: () => state => {
        if (state?.files) {
          state.files = state.files.filter(f => !!(f.md5 && f.uploadId))
        }
      },
    }
  )
)
