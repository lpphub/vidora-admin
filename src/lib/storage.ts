export const storage = {
  get<T>(key: string): T | null {
    const item = localStorage.getItem(key)
    if (!item) return null
    try {
      return JSON.parse(item) as T
    } catch {
      return item as T
    }
  },

  set<T>(key: string, value: T): void {
    if (typeof value === 'string') {
      localStorage.setItem(key, value)
    } else {
      localStorage.setItem(key, JSON.stringify(value))
    }
  },

  remove(key: string): void {
    localStorage.removeItem(key)
  },

  clear(): void {
    localStorage.clear()
  },
}

export const session = {
  get<T>(key: string): T | null {
    const item = sessionStorage.getItem(key)
    if (!item) return null
    try {
      return JSON.parse(item) as T
    } catch {
      return item as T
    }
  },

  set<T>(key: string, value: T): void {
    if (typeof value === 'string') {
      sessionStorage.setItem(key, value)
    } else {
      sessionStorage.setItem(key, JSON.stringify(value))
    }
  },

  remove(key: string): void {
    sessionStorage.removeItem(key)
  },

  clear(): void {
    sessionStorage.clear()
  },
}
