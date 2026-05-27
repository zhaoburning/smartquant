import { useEffect, useRef } from 'react'
import { View } from '@tarojs/components'

interface ChartProps {
  option: any
  style?: any
}

export function LineChart({ option, style }: ChartProps) {
  const canvasRef = useRef<any>(null)

  useEffect(() => {
    if (canvasRef.current && option) {
      drawLineChart(option)
    }
  }, [option])

  const drawLineChart = (opt: any) => {
    const { series, grid, xAxis, yAxis } = opt
    const data = series[0].data
    const minVal = Math.min(...data)
    const maxVal = Math.max(...data)
    const range = maxVal - minVal

    console.log('Line chart data:', data)
  }

  return (
    <View style={style}>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%' }}
        type='2d'
      />
    </View>
  )
}

export function PieChart({ option, style }: ChartProps) {
  const canvasRef = useRef<any>(null)

  useEffect(() => {
    if (canvasRef.current && option) {
      drawPieChart(option)
    }
  }, [option])

  const drawPieChart = (opt: any) => {
    const { series } = opt
    const data = series[0].data

    console.log('Pie chart data:', data)
  }

  return (
    <View style={style}>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%' }}
        type='2d'
      />
    </View>
  )
}
