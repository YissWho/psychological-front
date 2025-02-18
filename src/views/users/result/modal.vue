<template>
  <a-modal
    v-model:open="visible"
    title="问卷统计"
    :footer="null"
    width="800px"
  >
    <a-spin :spinning="loading">
      <div class="charts-container">
        <div class="chart-item">
          <h4>{{ chartsData[0]?.title }}</h4>
          <div ref="pieChartRef" class="chart"></div>
        </div>
        <div class="chart-item">
          <h4>{{ chartsData[1]?.title }}</h4>
          <div ref="barChartRef" class="chart"></div>
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick, onUnmounted } from 'vue'
import { useRequest } from 'vue-request'
import { getAssessmentStatistics } from '../../../api/user/assessments'
import * as echarts from 'echarts'

const props = defineProps<{
  id: number
}>()

const visible = defineModel<boolean>('visible', { default: false })
const chartsData = ref<any[]>([])

// ECharts 实例
let pieChart: echarts.ECharts | null = null
let barChart: echarts.ECharts | null = null

// Chart DOM refs
const pieChartRef = ref<HTMLElement>()
const barChartRef = ref<HTMLElement>()

// 获取统计数据
const { loading, runAsync: fetchStatistics } = useRequest(
  () => getAssessmentStatistics(props.id),
  {
    manual: true,
    onSuccess: (res) => {
      chartsData.value = res.data.charts
      nextTick(() => {
        initCharts()
      })
    }
  }
)

// 初始化图表
const initCharts = () => {
  if (!chartsData.value.length) return

  // 初始化饼图
  if (pieChartRef.value && chartsData.value[0]) {
    pieChart = echarts.init(pieChartRef.value)
    const pieOption = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          type: 'pie',
          radius: '70%',
          data: chartsData.value[0].data.map((item: any) => ({
            name: item.label,
            value: item.value
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }
    pieChart.setOption(pieOption)
  }

  // 初始化柱状图
  if (barChartRef.value && chartsData.value[1]) {
    barChart = echarts.init(barChartRef.value)
    const barOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      xAxis: {
        type: 'category',
        data: chartsData.value[1].data.map((item: any) => item.label),
        axisLabel: {
          interval: 0,
          rotate: 30
        }
      },
      yAxis: {
        type: 'value',
        minInterval: 1
      },
      series: [
        {
          data: chartsData.value[1].data.map((item: any) => item.value),
          type: 'bar',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)'
          }
        }
      ]
    }
    barChart.setOption(barOption)
  }
}

// 监听弹窗显示状态
watch(() => visible.value, (newVisible) => {
  if (newVisible && props.id) {
    fetchStatistics()
  }
})

// 监听窗口大小变化
const handleResize = () => {
  pieChart?.resize()
  barChart?.resize()
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  pieChart?.dispose()
  barChart?.dispose()
})
</script>

<style scoped lang="less">
.charts-container {
  display: flex;
  gap: 24px;
  padding: 16px;
  
  .chart-item {
    flex: 1;
    
    h4 {
      text-align: center;
      margin-bottom: 16px;
      color: #333;
    }
    
    .chart {
      height: 300px;
    }
  }
}
</style>
