import type { ApexOptions } from 'apexcharts'

export function useChart(options: ApexOptions): ApexOptions {
  const baseOptions = getBaseOptions()

  return {
    ...baseOptions,
    ...options,
    chart: {
      ...baseOptions.chart,
      ...options.chart,
    },
    colors: options.colors || baseOptions.colors,
  }
}

function getBaseOptions(): ApexOptions {
  return {
    colors: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'],

    chart: {
      toolbar: { show: false },
      zoom: { enabled: false },
      parentHeightOffset: 0,
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      animations: {
        enabled: true,
        speed: 360,
        animateGradually: { enabled: true, delay: 120 },
        dynamicAnimation: { enabled: true, speed: 360 },
      },
      redrawOnParentResize: true,
      redrawOnWindowResize: true,
    },

    states: {
      hover: { filter: { type: 'darken' } },
      active: { filter: { type: 'darken' } },
    },

    fill: {
      opacity: 1,
      gradient: {
        type: 'vertical',
        shadeIntensity: 0,
        opacityFrom: 0.4,
        opacityTo: 0,
        stops: [0, 100],
      },
    },

    dataLabels: {
      enabled: false,
    },

    stroke: {
      width: 2.5,
      curve: 'smooth',
      lineCap: 'round',
    },

    grid: {
      strokeDashArray: 3,
      borderColor: 'rgba(0, 0, 0, 0.1)',
      padding: { top: 0, right: 0, bottom: 0 },
      xaxis: { lines: { show: false } },
    },

    xaxis: {
      axisBorder: { show: false },
      axisTicks: { show: false },
    },

    yaxis: { tickAmount: 5 },

    markers: {
      size: 0,
      strokeColors: '#ffffff',
    },

    tooltip: {
      theme: 'light',
      fillSeriesColor: false,
      x: { show: true },
    },

    legend: {
      show: false,
      fontSize: '14px',
      position: 'top',
      horizontalAlign: 'right',
      markers: { shape: 'circle' },
      fontWeight: 500,
      itemMargin: { horizontal: 8, vertical: 8 },
    },

    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '48%',
        borderRadiusApplication: 'end',
      },
      pie: {
        donut: {
          labels: {
            show: true,
            value: {
              offsetY: 8,
              fontSize: '14px',
            },
            total: {
              show: true,
              label: 'Total',
              fontSize: '14px',
            },
          },
        },
      },
      radialBar: {
        hollow: { margin: -8, size: '100%' },
        track: {
          margin: -8,
          strokeWidth: '50%',
          background: 'rgba(0, 0, 0, 0.1)',
        },
        dataLabels: {
          value: { offsetY: 8, fontSize: '14px' },
          total: { show: true, label: 'Total', fontSize: '14px' },
        },
      },
    },
  }
}
