<template>
  <div>
    <Breadcrumb :navFaName="'数据统计'" :navSonName="'数据报表'"></Breadcrumb>
    <el-card class="box-card">
      <div class="myChart" ref="myChart"></div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      legend: [],
      yAxis: [],
      xAxis: [],
      series: []
    }
  },
  created() {
  },
  mounted() {
    this.drawLine()
  },
  methods: {
    
    async drawLine() {
      const { data: res } = await this.$http.get('reports/type/1')
      this.legend = res.data.legend
      this.yAxis = res.data.yAxis
      this.xAxis = res.data.xAxis[0].data
      this.series = res.data.series
      console.log(this.yAxis)
      // 初始化myChart实例
      const myChart = this.$echarts.init(this.$refs.myChart)
      // 绘制图表
      myChart.setOption({
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        legend: this.legend,
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: this.xAxis
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: this.series
      })
    }
  }
}
</script>

<style lang="less" scoped>
.myChart {
  width: 100%;
  height: 350px;
}
</style>
