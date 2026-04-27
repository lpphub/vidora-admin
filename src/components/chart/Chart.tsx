import { lazy, Suspense } from 'react'
import type { Props as ApexChartProps } from 'react-apexcharts'
import { Skeleton } from '@/components/ui/skeleton'

const ApexChart = lazy(() => import('react-apexcharts'))

function ChartSkeleton() {
  return <Skeleton className='w-full h-full' />
}

interface ChartProps extends ApexChartProps {
  type: ApexChartProps['type']
}

export function Chart(props: ChartProps) {
  return (
    <div className='apexcharts-wrapper'>
      <Suspense fallback={<ChartSkeleton />}>
        <ApexChart
          {...props}
          options={{
            ...props.options,
            chart: {
              ...props.options?.chart,
              animations: {
                ...props.options?.chart?.animations,
                enabled: true,
                speed: 200,
                animateGradually: {
                  enabled: false,
                },
                dynamicAnimation: {
                  enabled: true,
                  speed: 200,
                },
              },
              redrawOnParentResize: true,
              redrawOnWindowResize: true,
            },
          }}
        />
      </Suspense>
    </div>
  )
}
