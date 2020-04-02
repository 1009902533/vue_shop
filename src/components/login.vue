<template>
  <div class="login-container">
    <div class="login-box">
      <div class="avatar-box">
        <img src="../assets/logo.png" alt>
      </div>
      <el-form class="form-box" :model="loginForm" :rules="loginRules" ref="loginFormRef">
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            prefix-icon="iconfont icon-mima"
            placeholder="密码"
            v-model="loginForm.password"
            show-password
          ></el-input>
        </el-form-item>
        <div class="btn-box">
          <el-button @click="onSubmit" size="medium" type="primary">登录</el-button>
          <el-button size="medium" type="info" @click="resetForm">重置</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginRules: {
        // 验证用户名
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created () {},
  methods: {
    onSubmit() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const { data: result } = await this.$http({
          method: 'post',
          url: 'login',
          data: {
            username: this.loginForm.username,
            password: this.loginForm.password
          }
        })
        if (result.meta.status !== 200) return this.$message.error('登陆失败')
        this.$message.success('登陆成功')
        // 保存token
        window.sessionStorage.setItem('token', result.data.token)
        // 导航至/home
        this.$router.push('/home')
      })
    },
    resetForm () {
      this.$refs.loginFormRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  background: #2b4b6b;
  height: 100%;
  .login-box {
    width: 400px;
    height: 300px;
    border-radius: 10px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    .avatar-box {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      overflow: hidden;
      box-shadow: 0 0 10px #2b4b6b;
      padding: 5px;
      background: #fff;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      img {
        border-radius: 50%;
        background: #ddd;
        width: 100%;
        height: 100%;
      }
    }
    .form-box {
      padding: 0 30px;
      margin-top: 110px;
      .btn-box {
        text-align: right;
      }
    }
  }
}
</style>
