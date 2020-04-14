<template>
  <div>
    <Breadcrumb :navFaName="'用户管理'" :navSonName="'用户列表'"></Breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" 
          clearable 
          @clear="getUserList"
          v-model="queryInfo.query">
            <el-button slot="append" 
            @click="searchBtn"
            icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table border :data="userList" stripe style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="mobile" label="电话" width="120"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="120"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column label="状态" width="80">
          <template slot-scope="scope">
            <el-switch 
            v-model="scope.row.mg_state" 
            @change="statusChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-tooltip content="修改" placement="top" :enterable="false">
                <el-button @click="editUser(scope.row.id)" type="primary" icon="el-icon-edit" size="mini"></el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top" :enterable="false">
                <el-button @click="delUser(scope.row.id)" type="danger" icon="el-icon-delete" size="mini"></el-button>
              </el-tooltip>
              <el-tooltip content="分配角色" placement="top" :enterable="false">
                <el-button @click="setRoles(scope.row)" type="warning" icon="el-icon-setting" size="mini"></el-button>                
              </el-tooltip>
            </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      @close="closeDialog"
      width="50%">
      <el-form ref="formAdd" :rules="formAddRules" :model="formAdd" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formAdd.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="formAdd.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formAdd.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="formAdd.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户"
      @close="closeEdiDialog"
      :visible.sync="dialogVisibleEdi"
      width="50%">
      <el-form ref="formEdi" :rules="formEdiRules" :model="formEdi" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="formEdi.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formEdi.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="formEdi.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleEdi = false">取 消</el-button>
        <el-button type="primary" @click="EdisubmitForm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      @close="closeDialogRoles"
      :visible.sync="dialogVisibleRoles"
      width="50%">
      <el-form ref="RolesForm" label-width="100px">
        <el-form-item label="当前的用户：">
          {{formRoles.username}}
        </el-form-item>
        <el-form-item label="当前的角色：">
          {{formRoles.role_name}}
        </el-form-item>
        <el-form-item label="分配新角色：">
          <el-select v-model="Rolesvalue" placeholder="请选择">
            <el-option
              v-for="item in RolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleRoles = false">取 消</el-button>
        <el-button @click="RoleSubmit" type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    var checkEmail = (rule, value, callback) => {
      if (!value) return callback(new Error('请输入邮箱'))
      const emailReg = /^\w+[@]\w+[.]\w+$/gi
      if (!emailReg.test(value)) return callback(new Error('请输入正确的邮箱地址'))
      callback()
    }
    var checkMobile = (rule, value, callback) => {
      if (!value) return callback(new Error('请输入手机号码'))
      const mobileReg = /^1[3-9]\d{9}$/g
      if (!mobileReg.test(value)) return callback(new Error('请输入正确的手机号码'))
      callback()
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 4
      },
      total: 0,
      userList: [],
      dialogVisible: false,
      dialogVisibleEdi: false,
      formAdd: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      formAddRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { validator: checkEmail, required: true, trigger: 'blur' }
        ],
        mobile: [
          { validator: checkMobile, required: true, trigger: 'blur' }
        ]
      },
      formEdi: {},
      formEdiRules: {
        email: [
          { validator: checkEmail, required: true, trigger: 'blur' }
        ],
        mobile: [
          { validator: checkMobile, required: true, trigger: 'blur' }
        ]
      },
      dialogVisibleRoles: false,
      RolesList: [],
      Rolesvalue: '',
      formRoles: {},
      userId: 0
    }
  },
  created() {
    this.getUserList()
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败')
      this.RolesList = res.data
    },
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$message.error('获取用户列表失败！')
      this.userList = res.data.users
      console.log(this.userList)
      this.total = res.data.total
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.queryInfo.pagesize = val
      this.getUserList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.queryInfo.pagenum = val
      this.getUserList()
    },
    async statusChange(e) {
      const { data: res } = await this.$http.put(`users/${e.id}/state/${e.mg_state}`)
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('更新用户状态失败！')
      this.$message.success('更新用户状态成功！')
    },
    searchBtn() {
      this.queryInfo.pagenum = 1
      this.getUserList()
    },
    closeDialog() {
      this.$refs.formAdd.resetFields()
    },
    // 添加用户
    submitForm() {
      this.$refs.formAdd.validate(async (valid) => {
        if (!valid) return false
        const { data: res } = await this.$http.post('users', this.formAdd)
        console.log(res)
        if (res.meta.status !== 201) return this.$message.error('添加用户失败')
        this.$message.success('添加用户成功')
        this.dialogVisible = false
        this.getUserList()
      })
    },
    // 编辑用户
    async editUser(id) {
      const { data: res } = await this.$http.get(`users/${id}`)
      if (res.meta.status !== 200) return this.$message.error('获取用户失败')
      this.formEdi = res.data
      console.log(this.formEdi)
      this.dialogVisibleEdi = true
    },
    // 清空表单
    closeEdiDialog() {
      this.$refs.formEdi.resetFields()
    },
    EdisubmitForm() {
      this.$refs.formEdi.validate(async (valid) => {
        if (!valid) return false
        const { data: res } = await this.$http.put('users/' + this.formEdi.id, this.formEdi)
        if (res.meta.status !== 200) return this.$message.error('修改用户失败')
        this.$message.success('修改用户成功')
        this.dialogVisibleEdi = false
        this.getUserList()
      })
    },
    // 删除用户
    async delUser(id) {
      const result = await this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (result !== 'confirm') return this.$message.info('已经取消删除')
      const { data: res } = await this.$http.delete(`users/${id}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success('删除成功')
      this.getUserList()
      if (this.userList.length !== 1) {
        if (this.userList.length === 1) {
          this.queryInfo.pagenum--
        }
      }
    },
    // 分配角色
    async setRoles(role) {
      this.userId = role.id
      this.formRoles = role
      this.dialogVisibleRoles = true
    },
    closeDialogRoles() {
      this.Rolesvalue = ''
    },
    // 分配新角色
    async RoleSubmit() {
      const { data: res } = await this.$http.put(`users/${this.userId}/role`, { rid: this.Rolesvalue })
      if (res.meta.status !== 200) return this.$message.error('设置角色失败')
      this.$message.success('设置角色成功')
      this.getUserList()
      this.dialogVisibleRoles = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-table {
  margin: 20px 0;
}
</style>    
