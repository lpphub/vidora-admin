export function formatDate(
  date?: string | Date | null,
  format: 'full' | 'date' | 'time' = 'full'
): string {
  if (!date) return '--'

  const d = typeof date === 'string' ? new Date(date) : date

  if (Number.isNaN(d.getTime())) return '--'

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  switch (format) {
    case 'date':
      return `${year}-${month}-${day}`
    case 'time':
      return `${hours}:${minutes}:${seconds}`
    default:
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }
}

export function formatShort(date?: string | Date | null): string {
  if (!date) return '--'

  const d = typeof date === 'string' ? new Date(date) : date

  if (Number.isNaN(d.getTime())) return '--'

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}`
}

export function formatRelative(date?: string | Date | null): string {
  if (!date) return '--'

  const d = typeof date === 'string' ? new Date(date) : date

  if (Number.isNaN(d.getTime())) return '--'

  const now = new Date()
  const diff = now.getTime() - d.getTime()

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 30) {
    return formatDate(d, 'date')
  }
  if (days > 0) {
    return `${days} 天前`
  }
  if (hours > 0) {
    return `${hours} 小时前`
  }
  if (minutes > 0) {
    return `${minutes} 分钟前`
  }
  if (seconds > 0) {
    return `${seconds} 秒前`
  }
  return '刚刚'
}

export function formatDuration(seconds?: number | null): string {
  if (seconds === null || seconds === undefined || Number.isNaN(seconds)) return '--'

  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)

  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }
  return `${m}:${String(s).padStart(2, '0')}`
}

export function formatFileSize(bytes?: number | null): string {
  if (bytes === null || bytes === undefined || Number.isNaN(bytes)) return '--'

  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let unitIndex = 0
  let size = bytes

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  return `${size.toFixed(unitIndex > 0 ? 1 : 0)} ${units[unitIndex]}`
}

export function formatBitrate(bps?: number | null): string {
  if (bps === null || bps === undefined || Number.isNaN(bps)) return '--'

  const mbps = bps / 1_000_000
  return `${mbps.toFixed(1)} Mbps`
}
