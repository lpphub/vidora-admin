import { Film, TrendingUp, Users, Video } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const stats = [
  {
    title: '总视频数',
    value: '1,234',
    change: '+12%',
    changeType: 'increase' as const,
    icon: Video,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
  },
  {
    title: '总内容数',
    value: '5,678',
    change: '+8%',
    changeType: 'increase' as const,
    icon: Film,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    title: '活跃用户',
    value: '892',
    change: '+23%',
    changeType: 'increase' as const,
    icon: Users,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
  },
  {
    title: '播放量',
    value: '45.2K',
    change: '+18%',
    changeType: 'increase' as const,
    icon: TrendingUp,
    color: 'text-orange-500',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
  },
]

const recentActivities = [
  { id: 1, action: '上传视频', user: '张三', time: '5分钟前', type: 'upload' },
  { id: 2, action: '审核通过', user: '李四', time: '15分钟前', type: 'approve' },
  { id: 3, action: '新建分类', user: '王五', time: '1小时前', type: 'category' },
  { id: 4, action: '用户注册', user: '赵六', time: '2小时前', type: 'register' },
]

export default function Dashboard() {
  return (
    <div className='space-y-6'>
      {/* 页面标题 */}
      <div>
        <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>工作台</h1>
        <p className='text-gray-500 dark:text-gray-400 mt-1'>欢迎回来，查看您的数据概览</p>
      </div>

      {/* 统计卡片 */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {stats.map(stat => (
          <Card key={stat.title} className='border-gray-200 dark:border-gray-800'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-gray-900 dark:text-white'>{stat.value}</div>
              <p className='text-xs text-emerald-500 mt-1'>{stat.change} 较上月</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 最近活动 */}
      <div className='grid gap-4 lg:grid-cols-2'>
        <Card className='border-gray-200 dark:border-gray-800'>
          <CardHeader>
            <CardTitle className='text-gray-900 dark:text-white'>最近活动</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {recentActivities.map(activity => (
                <div key={activity.id} className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className='h-2 w-2 rounded-full bg-emerald-500' />
                    <div>
                      <p className='text-sm font-medium text-gray-900 dark:text-white'>
                        {activity.action}
                      </p>
                      <p className='text-xs text-gray-500 dark:text-gray-400'>{activity.user}</p>
                    </div>
                  </div>
                  <span className='text-xs text-gray-400 dark:text-gray-500'>{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className='border-gray-200 dark:border-gray-800'>
          <CardHeader>
            <CardTitle className='text-gray-900 dark:text-white'>快速操作</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-2 gap-3'>
              <button
                type='button'
                className='flex items-center gap-2 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'
              >
                <Video className='h-4 w-4 text-emerald-500' />
                <span className='text-sm text-gray-700 dark:text-gray-300'>上传视频</span>
              </button>
              <button
                type='button'
                className='flex items-center gap-2 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'
              >
                <Film className='h-4 w-4 text-blue-500' />
                <span className='text-sm text-gray-700 dark:text-gray-300'>新建内容</span>
              </button>
              <button
                type='button'
                className='flex items-center gap-2 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'
              >
                <Users className='h-4 w-4 text-purple-500' />
                <span className='text-sm text-gray-700 dark:text-gray-300'>添加用户</span>
              </button>
              <button
                type='button'
                className='flex items-center gap-2 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'
              >
                <TrendingUp className='h-4 w-4 text-orange-500' />
                <span className='text-sm text-gray-700 dark:text-gray-300'>查看报告</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
