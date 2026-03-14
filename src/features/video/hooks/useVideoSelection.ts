import { useCallback, useMemo, useState } from 'react'

export function useVideoSelection() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const isSelected = useCallback((id: string) => selectedIds.has(id), [selectedIds])

  const toggle = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const selectAll = useCallback((ids: string[]) => {
    setSelectedIds(new Set(ids))
  }, [])

  const clearAll = useCallback(() => {
    setSelectedIds(new Set())
  }, [])

  const selectedCount = selectedIds.size

  const selectedIdsArray = useMemo(() => Array.from(selectedIds), [selectedIds])

  return {
    selectedIds,
    selectedIdsArray,
    isSelected,
    toggle,
    selectAll,
    clearAll,
    selectedCount,
  }
}
