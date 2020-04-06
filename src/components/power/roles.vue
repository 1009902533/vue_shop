<template>
  <div>
    <Breadcrumb :navFaName="'权限管理'" :navSonName="'角色列表'"></Breadcrumb>
    <el-card class="box-card">
        <el-button type="primary" @click="addRoles()">添加角色</el-button>
        <el-table :data="rolesList" border stripe>
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <el-row :class="['bdbottom', i1 === 0 ? 'bdtop' : '']" :key="item1.id" v-for="(item1, i1) in scope.row.children">
                        <el-col :span="5">
                            <el-tag :disable-transitions="false" closable @close="closeRoles(scope.row, item1.id)">{{ item1.authName }}</el-tag>
                            <i class="el-icon-caret-right"></i>
                        </el-col>
                        <el-col :span="19">
                            <el-row :class="[i2 === 0 ? '' : 'bdtop']" :key="item2.id" v-for="(item2, i2) in item1.children">
                                <el-col :span="6">
                                    <el-tag :disable-transitions="false" closable @close="closeRoles(scope.row, item2.id)" type="success">{{ item2.authName }}</el-tag>
                                    <i class="el-icon-caret-right"></i>
                                </el-col>
                                <el-col :span="18">
                                    <el-tag :disable-transitions="false" closable @close="closeRoles(scope.row, item3.id)" type="warning" :key="i3" v-for="(item3, i3) in item2.children">{{ item3.authName }}</el-tag>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="角色名称" prop="roleName"></el-table-column>
            <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                <el-tooltip content="修改" placement="top" :enterable="false">
                    <el-button @click="editRoles(scope.row.id)" type="primary" icon="el-icon-edit" size="mini"></el-button>
                </el-tooltip>
                <el-tooltip content="删除" placement="top" :enterable="false">
                    <el-button @click="delRoles(scope.row.id)" type="danger" icon="el-icon-delete" size="mini"></el-button>
                </el-tooltip>
                <el-tooltip content="分配权限" placement="top" :enterable="false">
                    <el-button @click="allotBtn(scope.row)" type="warning" icon="el-icon-setting" size="mini"></el-button>                
                </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      @close="closeRolesDialog"
      :visible.sync="dialogVisibleRoles"
      width="50%">
      <el-form ref="formRoles" :rules="formRolesRules" :model="formRoles" label-width="80px">
        <el-form-item label="用户角色" prop="roleName">
          <el-input v-model="formRoles.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="formRoles.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleRoles = false">取 消</el-button>
        <el-button type="primary" @click="RolesubmitForm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色对话框 -->
    <el-dialog
      title="编辑角色"
      @close="closeEdiRolesDialog"
      :visible.sync="dialogVisibleEdiRoles"
      width="50%">
      <el-form ref="formEdiRoles" :rules="formRolesRules" :model="formEdiRoles" label-width="80px">
        <el-form-item label="用户角色" prop="roleName">
          <el-input v-model="formEdiRoles.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="formEdiRoles.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleEdiRoles = false">取 消</el-button>
        <el-button type="primary" @click="EdiRolesubmitForm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      @close="closeTreeDialog"
      v-if="dialogVisibleTree"
      :visible.sync="dialogVisibleTree"
      width="50%">
      <el-form ref="formTree">
        <el-tree
          ref="treeRef"
          :data="rolesData"
          show-checkbox
          node-key="id"
          :default-checked-keys="defkeys"
          :default-expand-all="true"
          :props="defaultProps">
        </el-tree>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleTree = false">取 消</el-button>
        <el-button type="primary" @click="TreesubmitForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rolesList: [],
      dialogVisibleRoles: false,
      dialogVisibleEdiRoles: false,
      formRoles: {
        roleName: '',
        roleDesc: ''
      },
      formRolesRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
        ]
      },
      formEdiRoles: {},
      rolesData: [],
      dialogVisibleTree: false,
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      defkeys: [],
      roleId: 0
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败')
      this.rolesList = res.data
    },
    // 编辑角色
    async editRoles(id) {
      const { data: res } = await this.$http.get(`roles/${id}`)
      if (res.meta.status !== 200) return this.$message.error('获取角色失败')
      this.formEdiRoles = res.data
      this.dialogVisibleEdiRoles = true
    },
    EdiRolesubmitForm() {
      this.$refs.formEdiRoles.validate(async (valid) => {
        if (!valid) return false
        const { data: res } = await this.$http.put(`roles/${this.formEdiRoles.id}`, this.formEdiRoles)
        if (res.meta.status !== 200) return this.$message.error('编辑角色失败')
        this.$message.success('编辑角色成功')
        this.dialogVisibleEdiRoles = false
        this.formEdiRoles = {}
      })
    },
    closeEdiRolesDialog() {
      this.$refs.formEdiRoles.resetFields()
    },
    // 删除角色
    async delRoles(id) {
      const result = await this.$confirm('此操作将永久删除该角色, 是否继续??', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (result !== 'confirm') {
        return this.$message.info('已经取消删除')
      }
      const { data: res } = await this.$http.delete(`roles/${id}`)
      if (res.meta.status !== 200) return this.$message.error('删除角色失败')
      this.$message.success('删除角色成功')
      this.getRolesList()
    },
    // 删除权限
    async closeRoles(role, rightId) {
      const result = await this.$confirm('此操作将永久删除该权限, 是否继续??', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (result !== 'confirm') {
        return this.$message.info('已经取消删除')
      }
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) return this.$message.error('删除权限失败')
      this.$message.success('删除权限成功')
      role.children = res.data
    },
    // 清空表单
    closeRolesDialog() {
      this.$refs.formRoles.resetFields()
    },
    // 添加角色
    addRoles() {
      this.dialogVisibleRoles = true
    },
    RolesubmitForm() {
      this.$refs.formRoles.validate(async (valid) => {
        if (!valid) return false
        const { data: res } = await this.$http.post('roles', this.formRoles)
        if (res.meta.status !== 201) return this.$message.error('添加角色失败')
        this.$message.success('添加角色成功')
        this.dialogVisibleRoles = false
        this.getRolesList()
      })
    },
    // 分配权限按钮
    async allotBtn(e) {
      this.roleId = e.id
      this.getLeafKeys(e, this.defkeys)
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error('获取权限列表失败')
      this.rolesData = res.data
      this.dialogVisibleTree = true
    },
    // 通过递归的方式获取角色所有三级权限
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(val => this.getLeafKeys(val, arr))
    },
    // 权限框关闭
    closeTreeDialog() {
      this.defkeys = []
    },
    // 确定权限
    async TreesubmitForm() {
      const kes = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const str = kes.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: str })
      if (res.meta.status !== 200) return this.$message.error('更新权限失败')
      this.$message.success('更新权限成功')
      this.getRolesList()
      this.dialogVisibleTree = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-table {
    margin-top: 20px;
    .el-row {
        display: flex;
        align-items: center;
    }
    .el-tag {
        margin: 7px;
    }
    .bdtop {
        border-top: 1px solid #eee;
    }
    .bdbottom {
        border-bottom: 1px solid #eee;
    }
}
</style>    
