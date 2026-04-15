declare module 'react-calendar-heatmap' {
  import * as React from 'react'

  export interface HeatmapValue {
    date: string
    count?: number
    [key: string]: any
  }

  export interface CalendarHeatmapProps {
    startDate?: Date
    endDate?: Date
    values?: HeatmapValue[]
    classForValue?: (value: HeatmapValue | null) => string
    onClick?: (value: HeatmapValue | null) => void
  }

  export default class CalendarHeatmap extends React.Component<CalendarHeatmapProps> {}
}