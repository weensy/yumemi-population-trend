import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import React, { useEffect, useState } from 'react'

export const PopulationChart = ({ data }: any) => {
  const [options, setOptions] = useState({})

  useEffect(() => {
    if (!data || data.length === 0) return

    const chartOptions = {
      chart: {
        type: 'line',
      },
      title: {
        text: '総人口推移',
      },
      xAxis: {
        title: {
          text: '年度',
        },
        categories: data[0].data.map((item: any) => item.year),
      },
      yAxis: {
        title: {
          text: '人口数',
        },
      },
      series: data.map((series: any) => ({
        name: series.name,
        data: series.data.map((item: any) => item.value),
      })),
    }

    setOptions(chartOptions)
  }, [data])

  return <HighchartsReact highcharts={Highcharts} options={options} />
}
