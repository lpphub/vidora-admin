export interface DashboardStats {
  totalVideos: number
  totalContents: number
  activeUsers: number
  playCount: number
}

export interface StatItem {
  labelKey: string
  value: string
  percent: number
  color: string
  icon: string
  sparkline: number[]
}

export interface TaskItem {
  labelKey: string
  color: string
  progress: number
}

export interface TransactionItem {
  icon: string
  nameKey: string
  id: string
  amount: number
  status: 'up' | 'down'
}

export interface DashboardData {
  stats: StatItem[]
  tasks: TaskItem[]
  transactions: TransactionItem[]
  monthlyPlay: {
    series: { name: string; data: number[] }[]
    categories: string[]
    percent: number
  }
  totalIncome: {
    series: number[]
    colors: string[]
  }
}

export const MOCK_DASHBOARD_DATA: DashboardData = {
  stats: [
    {
      labelKey: 'stats.totalVideos',
      value: '1,234',
      percent: 12.5,
      color: '#10b981',
      icon: 'Video',
      sparkline: [12, 18, 14, 16, 12, 10, 14, 18, 16, 14, 12, 10],
    },
    {
      labelKey: 'stats.totalContents',
      value: '5,678',
      percent: 8.2,
      color: '#3b82f6',
      icon: 'Film',
      sparkline: [20, 25, 22, 28, 24, 20, 26, 30, 25, 22, 24, 28],
    },
    {
      labelKey: 'stats.activeUsers',
      value: '892',
      percent: 23.1,
      color: '#8b5cf6',
      icon: 'Users',
      sparkline: [30, 35, 40, 38, 42, 50, 48, 55, 60, 58, 62, 65],
    },
    {
      labelKey: 'stats.playCount',
      value: '45.2K',
      percent: -5.6,
      color: '#f59e0b',
      icon: 'TrendingUp',
      sparkline: [45, 42, 40, 38, 42, 38, 36, 40, 38, 35, 32, 30],
    },
  ],
  tasks: [
    { labelKey: 'tasks.videoTranscodeOptimization', color: '#3b82f6', progress: 75 },
    { labelKey: 'tasks.contentReviewSystem', color: '#10b981', progress: 60 },
    { labelKey: 'tasks.userPermissionRefactor', color: '#f59e0b', progress: 45 },
    { labelKey: 'tasks.apiDocUpdate', color: '#8b5cf6', progress: 90 },
  ],
  transactions: [
    { icon: 'Video', nameKey: 'transactions.videoUpload', id: '#T11032', amount: 15, status: 'up' },
    {
      icon: 'Film',
      nameKey: 'transactions.contentPublish',
      id: '#T11033',
      amount: -8,
      status: 'down',
    },
    {
      icon: 'Users',
      nameKey: 'transactions.newUserRegister',
      id: '#T11034',
      amount: 32,
      status: 'up',
    },
    {
      icon: 'TrendingUp',
      nameKey: 'transactions.playGrowth',
      id: '#T11035',
      amount: 128,
      status: 'up',
    },
  ],
  monthlyPlay: {
    series: [{ name: 'play', data: [30, 40, 35, 50, 49, 70, 91, 60, 50, 55, 60, 65] }],
    categories: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    percent: 5.44,
  },
  totalIncome: {
    series: [44, 55, 41, 17],
    colors: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'],
  },
}
