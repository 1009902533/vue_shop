<template>
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{navFaName}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{navSonName}}</el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
export default {
  props: ['navFaName', 'navSonName'],
  data () {
    return {

    }
  },
  created () {

  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
</style>
