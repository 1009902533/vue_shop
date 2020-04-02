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
      window.sessionStorage.clear()
      this.$router.push('/login')
      this.$message.success('退出成功')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
