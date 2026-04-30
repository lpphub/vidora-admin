import { getTranslations } from 'next-intl/server'
import { DashboardClient, ICON_MAP } from './DashboardClient'
import { getDashboardData } from './data'

export default async function DashboardPage() {
  const t = await getTranslations('dashboard')
  const dashboardData = await getDashboardData()

  const labelTranslations = {
    stats: Object.fromEntries(dashboardData.stats.map(s => [s.labelKey, t(s.labelKey)])),
    tasks: Object.fromEntries(dashboardData.tasks.map(tk => [tk.labelKey, t(tk.labelKey)])),
    transactions: Object.fromEntries(
      dashboardData.transactions.map(tx => [tx.nameKey, t(tx.nameKey)])
    ),
  }

  const statsWithIcons = dashboardData.stats.map(s => ({
    ...s,
    icon: ICON_MAP[s.icon as keyof typeof ICON_MAP],
  }))

  const transactionsWithIcons = dashboardData.transactions.map(tx => ({
    ...tx,
    icon: ICON_MAP[tx.icon as keyof typeof ICON_MAP],
  }))

  return (
    <DashboardClient
      stats={statsWithIcons}
      tasks={dashboardData.tasks}
      transactions={transactionsWithIcons}
      monthlyPlay={dashboardData.monthlyPlay}
      totalIncome={dashboardData.totalIncome}
      labelTranslations={labelTranslations}
    />
  )
}
