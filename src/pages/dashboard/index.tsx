import { ArrowDown, ArrowUp, Film, Plus, TrendingUp, Users, Video } from 'lucide-react'
import { useState } from 'react'
import { Chart, useChart } from '@/components/chart'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

const quickStats = [
  {
    icon: Video,
    label: '总视频数',
    value: '1,234',
    percent: 12.5,
    color: '#10b981',
    chart: [12, 18, 14, 16, 12, 10, 14, 18, 16, 14, 12, 10],
  },
  {
    icon: Film,
    label: '总内容数',
    value: '5,678',
    percent: 8.2,
    color: '#3b82f6',
    chart: [8, 12, 10, 14, 18, 16, 14, 12, 10, 14, 18, 16],
  },
  {
    icon: Users,
    label: '活跃用户',
    value: '892',
    percent: 23.1,
    color: '#8b5cf6',
    chart: [10, 14, 12, 16, 18, 14, 12, 10, 14, 18, 16, 12],
  },
  {
    icon: TrendingUp,
    label: '播放量',
    value: '45.2K',
    percent: -5.6,
    color: '#f59e0b',
    chart: [16, 14, 12, 10, 14, 18, 16, 12, 10, 14, 18, 16],
  },
]

const monthlyRevenue = {
  series: [
    {
      name: '播放量',
      data: [30, 40, 35, 50, 49, 70, 91, 60, 50, 55, 60, 65],
    },
  ],
  categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  percent: 5.44,
}

const projectTasks = [
  { label: '视频转码优化', color: '#3b82f6', progress: 75 },
  { label: '内容审核系统', color: '#10b981', progress: 60 },
  { label: '用户权限重构', color: '#f59e0b', progress: 45 },
  { label: 'API文档更新', color: '#8b5cf6', progress: 90 },
]

const recentTransactions = [
  { icon: Video, name: '视频上传', id: '#T11032', amount: 15, time: '06:30 pm', status: 'up' },
  { icon: Film, name: '内容发布', id: '#T11033', amount: -8, time: '08:30 pm', status: 'down' },
  { icon: Users, name: '新用户注册', id: '#T11034', amount: 32, time: '08:40 pm', status: 'up' },
  {
    icon: TrendingUp,
    name: '播放增长',
    id: '#T11035',
    amount: 128,
    time: '07:40 pm',
    status: 'up',
  },
]

const totalIncome = {
  series: [44, 55, 41, 17],
  labels: ['视频', '内容', '用户', '播放'],
  details: [
    { label: '视频', value: 1234 },
    { label: '内容', value: 5678 },
    { label: '用户', value: 892 },
    { label: '播放', value: 45200 },
  ],
}

function rgbAlpha(color: string, alpha: number): string {
  const hex = color.replace('#', '')
  const r = Number.parseInt(hex.substring(0, 2), 16)
  const g = Number.parseInt(hex.substring(2, 4), 16)
  const b = Number.parseInt(hex.substring(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function SparklineChart({ color, data }: { color: string; data: number[] }) {
  const options = useChart({
    chart: { sparkline: { enabled: true } },
    colors: [color],
    grid: { show: false },
    yaxis: { show: false },
    tooltip: { enabled: false },
    plotOptions: { bar: { borderRadius: 2, columnWidth: '60%' } },
  })

  return <Chart type='bar' height={40} options={options} series={[{ data }]} />
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('全部')

  const areaChartOptions = useChart({
    xaxis: { categories: monthlyRevenue.categories },
    chart: { toolbar: { show: false } },
    grid: { show: false },
    stroke: { curve: 'smooth' },
    dataLabels: { enabled: false },
    yaxis: { show: false },
    legend: { show: false },
    colors: ['#10b981'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0,
        stops: [0, 90, 100],
      },
    },
  })

  const donutChartOptions = useChart({
    labels: totalIncome.labels,
    legend: { show: false },
    dataLabels: { enabled: false },
    plotOptions: { pie: { donut: { size: '70%' } } },
    colors: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'],
  })

  return (
    <div className='flex flex-col gap-4 w-full'>
      {/* 顶部四个统计卡片 */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        {quickStats.map(stat => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className='flex flex-col justify-between h-full'>
              <CardContent className='flex flex-col gap-2 p-4'>
                <div className='flex items-center gap-2'>
                  <div className='rounded-lg p-2' style={{ background: rgbAlpha(stat.color, 0.1) }}>
                    <Icon size={20} color={stat.color} />
                  </div>
                  <span className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                    {stat.label}
                  </span>
                </div>
                <div className='flex items-center gap-2 mt-2'>
                  <span className='text-2xl font-bold text-gray-900 dark:text-white'>
                    {stat.value}
                  </span>
                  <span
                    className={`text-xs flex items-center gap-1 font-bold ${
                      stat.percent > 0 ? 'text-green-500' : stat.percent < 0 ? 'text-red-500' : ''
                    }`}
                  >
                    {stat.percent > 0 ? (
                      <ArrowUp size={14} />
                    ) : stat.percent < 0 ? (
                      <ArrowDown size={14} />
                    ) : null}
                    {Math.abs(stat.percent)}%
                  </span>
                </div>
                <div className='w-full h-10 mt-2'>
                  <SparklineChart color={stat.color} data={stat.chart} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 月度播放量 + 项目进度区块 */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
        <Card className='lg:col-span-2'>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-base font-semibold'>月度播放量趋势</CardTitle>
            <span className='flex items-center gap-1 text-green-500 font-bold text-sm'>
              <ArrowUp size={14} />
              {monthlyRevenue.percent}%
            </span>
          </CardHeader>
          <CardContent className='p-6 pt-0'>
            <Chart
              type='area'
              height={220}
              options={areaChartOptions}
              series={monthlyRevenue.series}
            />
          </CardContent>
        </Card>
        <Card className='flex flex-col gap-4 p-6'>
          <CardTitle className='text-base font-semibold'>项目进度</CardTitle>
          <ul className='flex flex-col gap-4 mt-2'>
            {projectTasks.map(task => (
              <li key={task.label} className='flex flex-col gap-2'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <span
                      className='inline-block w-2 h-2 rounded-full'
                      style={{ background: task.color }}
                    />
                    <span className='text-sm text-gray-700 dark:text-gray-300'>{task.label}</span>
                  </div>
                  <span className='text-xs font-bold' style={{ color: task.color }}>
                    {task.progress}%
                  </span>
                </div>
                <Progress value={task.progress} className='h-1.5' />
              </li>
            ))}
          </ul>
          <Button className='w-full mt-auto' size='sm'>
            <Plus size={16} className='mr-1' /> 添加任务
          </Button>
        </Card>
      </div>

      {/* 最近动态 + 快速操作 */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
        <Card className='lg:col-span-2 flex flex-col p-6'>
          <div className='flex items-center justify-between mb-4'>
            <CardTitle className='text-base font-semibold'>最近动态</CardTitle>
            <div className='flex gap-2'>
              {['全部', '上传', '审核'].map(tab => (
                <Button
                  key={tab}
                  size='sm'
                  variant={activeTab === tab ? 'default' : 'ghost'}
                  onClick={() => setActiveTab(tab)}
                  className='text-xs'
                >
                  {tab}
                </Button>
              ))}
            </div>
          </div>
          <div className='flex-1'>
            <table className='w-full text-sm'>
              <tbody>
                {recentTransactions.map(tx => {
                  const Icon = tx.icon
                  return (
                    <tr
                      key={tx.id}
                      className='border-b last:border-0 border-gray-100 dark:border-gray-800'
                    >
                      <td className='py-3 w-12'>
                        <span className='inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800'>
                          <Icon size={18} className='text-gray-500' />
                        </span>
                      </td>
                      <td className='py-3'>
                        <div className='font-medium text-gray-900 dark:text-white'>{tx.name}</div>
                        <div className='text-xs text-gray-500'>{tx.id}</div>
                      </td>
                      <td className='py-3 text-right font-bold text-gray-900 dark:text-white'>
                        {tx.amount > 0 ? '+' : ''}
                        {tx.amount}
                      </td>
                      <td className='py-3 text-right'>
                        <span
                          className={`text-xs font-bold flex items-center justify-end gap-1 ${
                            tx.status === 'up' ? 'text-green-500' : 'text-red-500'
                          }`}
                        >
                          {tx.status === 'up' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                          10.6%
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className='flex items-center justify-between mt-4 gap-2'>
            <Button variant='outline' className='flex-1'>
              查看全部
            </Button>
            <Button className='flex-1'>创建新任务</Button>
          </div>
        </Card>
        <Card className='flex flex-col p-6'>
          <CardTitle className='text-base font-semibold mb-4'>数据分布</CardTitle>
          <div className='flex-1 flex flex-col items-center justify-center'>
            <Chart
              type='donut'
              height={180}
              options={donutChartOptions}
              series={totalIncome.series}
            />
            <div className='w-full mt-4 space-y-2'>
              {totalIncome.details.map((item, i) => (
                <div key={item.label} className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <span
                      className='inline-block w-3 h-3 rounded-full'
                      style={{
                        background: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'][i],
                      }}
                    />
                    <span className='text-sm text-gray-600 dark:text-gray-400'>{item.label}</span>
                  </div>
                  <span className='font-bold text-gray-900 dark:text-white'>
                    {item.value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* 快速操作区域 */}
      <Card className='p-6'>
        <CardTitle className='text-base font-semibold mb-4'>快速操作</CardTitle>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
          <button
            type='button'
            className='flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left'
          >
            <div className='p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20'>
              <Video className='h-5 w-5 text-emerald-500' />
            </div>
            <div>
              <div className='font-medium text-gray-900 dark:text-white'>上传视频</div>
              <div className='text-xs text-gray-500'>支持多种格式</div>
            </div>
          </button>
          <button
            type='button'
            className='flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left'
          >
            <div className='p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20'>
              <Film className='h-5 w-5 text-blue-500' />
            </div>
            <div>
              <div className='font-medium text-gray-900 dark:text-white'>新建内容</div>
              <div className='text-xs text-gray-500'>创建视频内容</div>
            </div>
          </button>
          <button
            type='button'
            className='flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left'
          >
            <div className='p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20'>
              <Users className='h-5 w-5 text-purple-500' />
            </div>
            <div>
              <div className='font-medium text-gray-900 dark:text-white'>添加用户</div>
              <div className='text-xs text-gray-500'>管理用户权限</div>
            </div>
          </button>
          <button
            type='button'
            className='flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left'
          >
            <div className='p-2 rounded-lg bg-orange-50 dark:bg-orange-900/20'>
              <TrendingUp className='h-5 w-5 text-orange-500' />
            </div>
            <div>
              <div className='font-medium text-gray-900 dark:text-white'>查看报告</div>
              <div className='text-xs text-gray-500'>数据分析报告</div>
            </div>
          </button>
        </div>
      </Card>
    </div>
  )
}
