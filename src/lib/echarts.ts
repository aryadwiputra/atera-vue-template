import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import {
  BarChart,
  LineChart,
  PieChart,
  RadarChart,
  ScatterChart,
  TreemapChart,
} from 'echarts/charts'
import {
  GridComponent,
  LegendComponent,
  PolarComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components'

use([
  CanvasRenderer,
  LineChart,
  BarChart,
  PieChart,
  RadarChart,
  ScatterChart,
  TreemapChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  PolarComponent,
  TitleComponent,
])
