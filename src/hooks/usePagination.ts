import { useCallback, useState } from 'react'

export interface PaginationParams {
  page?: number
  pageSize?: number
  total?: number
}

export interface PaginationState {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export function usePagination(initialPageSize: number = 20) {
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(initialPageSize)
  const [total, setTotal] = useState<number>(0)

  const totalPages = Math.ceil(total / pageSize)

  const goToPage = useCallback(
    (newPage: number) => {
      setPage(Math.max(1, Math.min(newPage, totalPages)))
    },
    [totalPages]
  )

  const nextPage = useCallback(() => {
    setPage(current => Math.min(current + 1, totalPages))
  }, [totalPages])

  const prevPage = useCallback(() => {
    setPage(current => Math.max(current - 1, 1))
  }, [])

  const setTotalItems = useCallback((newTotal: number) => {
    setTotal(newTotal)
    setPage(1)
  }, [])

  const changePageSize = useCallback((newPageSize: number) => {
    setPageSize(newPageSize)
    setPage(1)
  }, [])

  const reset = useCallback(() => {
    setPage(1)
    setPageSize(initialPageSize)
    setTotal(0)
  }, [initialPageSize])

  return {
    state: { page, pageSize, total, totalPages },
    goToPage,
    nextPage,
    prevPage,
    setTotalItems,
    changePageSize,
    reset,
  }
}
