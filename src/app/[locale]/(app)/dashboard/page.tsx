import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { DashboardClient } from './DashboardClient'
import { getDashboardData } from './data'

export default async function DashboardPage() {
  const t = await getTranslations('dashboard')
  const dashboardData = await getDashboardData()

  if (!dashboardData) {
    redirect('/login')
  }

  const labelTranslations = {
    stats: Object.fromEntries(dashboardData.stats.map(s => [s.labelKey, t(s.labelKey)])),
    tasks: Object.fromEntries(dashboardData.tasks.map(tk => [tk.labelKey, t(tk.labelKey)])),
    transactions: Object.fromEntries(
      dashboardData.transactions.map(tx => [tx.nameKey, t(tx.nameKey)])
    ),
  }

  return (
    <DashboardClient
      stats={dashboardData.stats}
      tasks={dashboardData.tasks}
      transactions={dashboardData.transactions}
      monthlyPlay={dashboardData.monthlyPlay}
      totalIncome={dashboardData.totalIncome}
      labelTranslations={labelTranslations}
    />
  )
}
