import type { Props as ApexChartProps } from 'react-apexcharts'
import ApexChart from 'react-apexcharts'

export function Chart(props: ApexChartProps) {
  return (
    <div className='apexcharts-wrapper'>
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
    </div>
  )
}
