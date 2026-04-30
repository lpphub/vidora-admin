'use client'

import { ArrowDown, ArrowUp, Film, Plus, TrendingUp, Users, Video } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Chart, useChart } from '@/components/chart'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export const ICON_MAP = { Video, Film, Users, TrendingUp } as const

function rgbAlpha(color: string, alpha: number): string {
  const hex = color.replace('#', '')
  const r = Number.parseInt(hex.substring(0, 2), 16)
  const g = Number.parseInt(hex.substring(2, 4), 16)
  const b = Number.parseInt(hex.substring(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

type IconComponent = (typeof ICON_MAP)[keyof typeof ICON_MAP]

interface StatItem {
  labelKey: string
  value: string
  percent: number
  color: string
  icon: IconComponent
  sparkline: number[]
}

interface TaskItem {
  labelKey: string
  color: string
  progress: number
}

interface TransactionItem {
  icon: IconComponent
  nameKey: string
  id: string
  amount: number
  status: 'up' | 'down'
}

interface DashboardClientProps {
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
  labelTranslations: Record<string, Record<string, string>>
}

export function DashboardClient({
  stats,
  tasks,
  transactions,
  monthlyPlay,
  totalIncome,
  labelTranslations,
}: DashboardClientProps) {
  const t = useTranslations('dashboard')
  const tc = useTranslations('common')
  const [activeTab, setActiveTab] = useState(t('tabs.all'))
  const tabValues = [t('tabs.all'), t('tabs.upload'), t('tabs.review')]

  const monthlyRevenue = {
    series: [{ name: t('labels.play'), data: monthlyPlay.series[0].data }],
    categories: monthlyPlay.categories,
  }

  const incomeDetails = [
    { label: t('labels.video'), value: 1234 },
    { label: t('labels.content'), value: 5678 },
    { label: t('labels.user'), value: 892 },
    { label: t('labels.play'), value: 45200 },
  ]

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
    labels: [t('labels.video'), t('labels.content'), t('labels.user'), t('labels.play')],
    legend: { show: false },
    dataLabels: { enabled: false },
    plotOptions: { pie: { donut: { size: '70%' } } },
    colors: totalIncome.colors,
  })

  return (
    <div className='flex flex-col gap-4 w-full'>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        {stats.map(stat => {
          const Icon = stat.icon
          return (
            <Card key={stat.labelKey} className='flex flex-col justify-between h-full'>
              <CardContent className='flex flex-col gap-2 p-4'>
                <div className='flex items-center gap-2'>
                  <div className='rounded-lg p-2' style={{ background: rgbAlpha(stat.color, 0.1) }}>
                    <Icon size={20} color={stat.color} />
                  </div>
                  <span className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                    {labelTranslations.stats[stat.labelKey]}
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
                  <SparklineChart data={stat.sparkline} color={stat.color} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
        <Card className='lg:col-span-2'>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-base font-semibold'>
              {t('charts.monthlyPlayTrend')}
            </CardTitle>
            <span className='flex items-center gap-1 text-green-500 font-bold text-sm'>
              <ArrowUp size={14} />
              {monthlyPlay.percent}%
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
          <CardTitle className='text-base font-semibold'>{t('charts.projectProgress')}</CardTitle>
          <ul className='flex flex-col gap-4 mt-2'>
            {tasks.map(task => (
              <li key={task.labelKey} className='flex flex-col gap-2'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <span
                      className='inline-block w-2 h-2 rounded-full'
                      style={{ background: task.color }}
                    />
                    <span className='text-sm text-gray-700 dark:text-gray-300'>
                      {labelTranslations.tasks[task.labelKey]}
                    </span>
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
            <Plus size={16} className='mr-1' /> {t('tasks.addTask')}
          </Button>
        </Card>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
        <Card className='lg:col-span-2 flex flex-col p-6'>
          <div className='flex items-center justify-between mb-4'>
            <CardTitle className='text-base font-semibold'>{t('charts.recentActivity')}</CardTitle>
            <div className='flex gap-2'>
              {tabValues.map(tab => (
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
                {transactions.map(tx => {
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
                        <div className='font-medium text-gray-900 dark:text-white'>
                          {labelTranslations.transactions[tx.nameKey]}
                        </div>
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
              {tc('actions.viewAll')}
            </Button>
            <Button className='flex-1'>{tc('actions.createNew')}</Button>
          </div>
        </Card>
        <Card className='flex flex-col p-6'>
          <CardTitle className='text-base font-semibold mb-4'>
            {t('charts.dataDistribution')}
          </CardTitle>
          <div className='flex-1 flex flex-col items-center justify-center'>
            <Chart
              type='donut'
              height={180}
              options={donutChartOptions}
              series={totalIncome.series}
            />
            <div className='w-full mt-4 space-y-2'>
              {incomeDetails.map((item, i) => (
                <div key={item.label} className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <span
                      className='inline-block w-3 h-3 rounded-full'
                      style={{ background: totalIncome.colors[i] }}
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

      <Card className='p-6'>
        <CardTitle className='text-base font-semibold mb-4'>{t('quickActions.title')}</CardTitle>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
          {(
            [
              { key: 'uploadVideo', color: 'emerald', Icon: Video },
              { key: 'createContent', color: 'blue', Icon: Film },
              { key: 'addUser', color: 'purple', Icon: Users },
              { key: 'viewReport', color: 'orange', Icon: TrendingUp },
            ] as const
          ).map(({ key, color, Icon }) => (
            <button
              key={key}
              type='button'
              className='flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left'
            >
              <div className={`p-2 rounded-lg bg-${color}-50 dark:bg-${color}-900/20`}>
                <Icon className={`h-5 w-5 text-${color}-500`} />
              </div>
              <div>
                <div className='font-medium text-gray-900 dark:text-white'>
                  {t(`quickActions.${key}.title`)}
                </div>
                <div className='text-xs text-gray-500'>{t(`quickActions.${key}.description`)}</div>
              </div>
            </button>
          ))}
        </div>
      </Card>
    </div>
  )
}

function SparklineChart({ data, color }: { data: number[]; color: string }) {
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
