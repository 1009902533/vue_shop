<template>
  <div>
      <el-button size="medium" type="info" @click="layout">退出</el-button>
  </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  created () {

  },
  methods: {
    layout () {
      this.$confirm('是否确认退出?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        window.sessionStorage.clear()
        this.$router.push('/login')
        this.$message({
          type: 'success',
          message: '退出成功!'
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
