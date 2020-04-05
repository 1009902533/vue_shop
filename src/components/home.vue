<template>
  <el-container class="conmain">
    <el-header>
      <div class="header-logo">
        <img src="../assets/heima.png" alt>
        <span>电商后台管理系统</span>
      </div>
      <el-button class="layout" size="medium" type="info" @click="layout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="iscollapse ? '64px' : '200px'">
        <div @click="toggleCollapse" class="toggle-btn">|||</div>
        <el-menu
          :collapse="iscollapse"
          background-color="#373d41"
          text-color="#fff"
          active-text-color="#409eff"
          :unique-opened="true"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <el-submenu v-for="i in itemData" :index="i.id+''" :key="i.id">
            <template slot="title">
              <i :class="iconsObj[i.id]"></i>
              <span>{{i.authName}}</span>
            </template>
            <el-menu-item @click="saveNavState('/' + n.path)" v-for="n in i.children" :index="'/' + n.path" :key="n.id">
              <i class="el-icon-menu"></i>
              <span>{{n.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      iscollapse: false,
      itemData: [],
      activePath: '',
      iconsObj: {
        125: 'iconfont icon-yonghuguanli',
        103: 'iconfont icon-guanli',
        101: 'iconfont icon-goods-copy',
        102: 'iconfont icon-dingdan',
        145: 'iconfont icon-shujutongji'
      }
    }
  },
  created() {
    this.getItem()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    layout() {
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
      }).catch(err => {
        console.log(err)
      })
    },
    async getItem() {
      const { data: res } = await this.$http({
        method: 'get',
        url: 'menus'
      })
      this.itemData = res.data
      console.log(this.itemData)
    },
    toggleCollapse() {
      this.iscollapse = !this.iscollapse
    },
    saveNavState(e) {
      window.sessionStorage.setItem('activePath', e)
      this.activePath = e
    }
  }
}
</script>

<style lang="less" scoped>
.conmain {
  height: 100%;
  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 0;
    .layout {
      height: 35px;
    }
    .header-logo {
      display: flex;
      align-content: center;
      align-items: center;
      span {
        margin-left: 15px;
        color: #fff;
      }
    }
  }
  .el-aside {
    background-color: #373d41;
    text-align: left;
    .toggle-btn {
      text-align: center;
      color: #fff;
      font-size: 10px;
      height: 24px;
      line-height: 24px;
      cursor: pointer;
      background: #41474c;
      letter-spacing: 3px;
    }
    .el-menu {
      border-right: none;
      .iconfont {
        margin-right: 5px;
      }
    }
    .menu-a {
      display: block;
    }
  }

  .el-main {
    text-align: left;
    background-color: #EAEDF1;
  }
}
</style>
