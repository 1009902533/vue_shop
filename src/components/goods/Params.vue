<template>
  <div>
      <Breadcrumb :navFaName="'商品管理'" :navSonName="'分类参数'"></Breadcrumb>
      <el-card class="box-card">
          <el-alert
          title="注意：只允许为第三级分类设置相关参数！"
          :closable="false"
          show-icon
          type="warning">
          </el-alert>
          <el-row>
              选择商品分类：
              <el-cascader 
              v-model="slectedList"
              :options="cateOptions"
              :props="cascaderProps"
              @change="handleChange"></el-cascader>
          </el-row>
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="动态参数" name="many">
                <el-button @click="dialogVisible = true" type="primary" size="mini" :disabled="isDisable">添加参数</el-button>
                <el-table
                :data="manyData"
                border
                style="width: 100%">
                    <el-table-column type="expand" prop="attr_vals">
                        <template slot-scope="scope">
                            <el-tag
                            :key="tag"
                            v-for="(tag, i) in scope.row.attr_vals"
                            closable
                            :disable-transitions="false"
                            @close="handleClose(scope.row, i)">
                            {{tag}}
                            </el-tag>
                            <el-input
                            class="input-new-tag"
                            v-if="scope.row.inputVisible"
                            v-model="scope.row.inputValue"
                            ref="saveTagInput"
                            size="small"
                            @keyup.enter.native="handleInputConfirm(scope.row)"
                            @blur="handleInputConfirm(scope.row)"
                            >
                            </el-input>
                            <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column type="index" label="#"></el-table-column>
                    <el-table-column
                    prop="attr_name"
                    label="参数名称">
                    </el-table-column>
                    <el-table-column
                    label="操作">
                        <template slot-scope="scope">
                            <el-tooltip content="编辑" placement="top" :enterable="false">
                                <el-button @click="ediParams(scope.row)" type="primary" icon="el-icon-edit" size="mini"></el-button>
                            </el-tooltip>
                            <el-tooltip content="删除" placement="top" :enterable="false">
                                <el-button @click="delParams(scope.row.attr_id)" type="danger" icon="el-icon-delete" size="mini"></el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="静态属性" name="only">
                <el-button @click="dialogVisible = true" type="primary" size="mini" :disabled="isDisable">添加属性</el-button>
                <el-table
                :data="onlyData"
                border
                style="width: 100%">
                    <el-table-column type="expand" prop="attr_vals">
                        <template slot-scope="scope">
                            <el-tag
                            :key="tag"
                            v-for="(tag ,i) in scope.row.attr_vals"
                            closable
                            :disable-transitions="false"
                            @close="handleClose(scope.row, i)">
                            {{tag}}
                            </el-tag>
                            <el-input
                            class="input-new-tag"
                            v-if="scope.row.inputVisible"
                            v-model="scope.row.inputValue"
                            ref="saveTagInput"
                            size="small"
                            @keyup.enter.native="handleInputConfirm(scope.row)"
                            @blur="handleInputConfirm(scope.row)"
                            >
                            </el-input>
                            <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column type="index" label="#"></el-table-column>
                    <el-table-column
                    prop="attr_name"
                    label="属性名称">
                    </el-table-column>
                    <el-table-column
                    label="操作">
                        <template slot-scope="scope">
                            <el-tooltip content="编辑" placement="top" :enterable="false">
                                <el-button @click="ediParams(scope.row)" type="primary" icon="el-icon-edit" size="mini"></el-button>
                            </el-tooltip>
                            <el-tooltip content="删除" placement="top" :enterable="false">
                                <el-button @click="delParams(scope.row.attr_id)" type="danger" icon="el-icon-delete" size="mini"></el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
          </el-tabs>
      </el-card>
      <!-- 添加参数/属性对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      @close="closeDialog"
      :visible.sync="dialogVisible"
      width="50%">
      <el-form ref="formParams" :rules="formParamsRules" :model="formParams" label-width="80px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="formParams.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="AddsubmitForm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数/属性对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      @close="closeDialogEdi"
      :visible.sync="dialogVisibleEdi"
      width="50%">
      <el-form ref="formParamsEdi" :rules="formParamsRules" :model="formParamsEdi" label-width="80px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="formParamsEdi.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleEdi = false">取 消</el-button>
        <el-button type="primary" @click="EdisubmitForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      cateOptions: [],
      slectedList: [],
      onlyData: [],
      manyData: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      activeName: 'many',
      attrValsList: [],
      cateId: 0,
      dialogVisible: false,
      formParamsRules: {
        attr_name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      },
      formParams: {},
      dialogVisibleEdi: false,
      formParamsEdi: {},
      attrId: 0
    }
  },
  created () {
    this.getCateList()
  },
  computed: {
    isDisable() {
      if (this.slectedList.length !== 3) return true
      return false
    },
    titleText() {
      if (this.activeName === 'many') return '动态参数'
      return '静态属性'
    }
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      this.cateOptions = res.data
    },
    // 获取分类参数
    async handleChange() {
      if (this.slectedList.length !== 3) {
        this.slectedList = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      this.cateId = this.slectedList[2]
      const { data: res } = await this.$http.get(`categories/${this.slectedList[2]}/attributes`, { params: { sel: this.activeName } })  
      if (res.meta.status !== 200) return this.$message.error('获取分类参数失败')
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      if (this.activeName === 'many') {
        this.manyData = res.data
      } else {
        this.onlyData = res.data
      }
    },
    async handleClick() {
      this.handleChange()
    },
    // 编辑
    async ediParams(row) {
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${row.attr_id}`, { params: { attr_sel: this.activeName, attr_vals: row.attr_vals.join(' ') } })
      if (res.meta.status !== 200) return this.$message.error('查询失败')
      this.formParamsEdi = res.data
      this.attr_id = res.data.attr_id
      console.log(this.attr_id)
      this.dialogVisibleEdi = true
    },
    // 确定编辑按钮
    EdisubmitForm() {
      this.$refs.formParamsEdi.validate(async (valid) => {
        if (!valid) return false
        const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.attr_id}`, {
          attr_name: this.formParamsEdi.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 200) return this.$message.error('编辑失败')
        this.$message.success('编辑成功')
        this.handleChange()
        this.dialogVisibleEdi = false
      })
    },
    // 关闭编辑面板触发
    closeDialogEdi() {
      this.$refs.formParamsEdi.resetFields()
    },
    // 删除
    async delParams(attrId) {
      const result = await this.$confirm('此操作将永久删除该项, 是否继续??', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (result !== 'confirm') {
        return this.$message.info('已经取消删除')
      }
      const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${attrId}`)
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      this.handleChange()
    },
    // 确定添加
    AddsubmitForm() {
      this.$refs.formParams.validate(async (valid) => {
        if (!valid) return false
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.formParams.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 201) return this.$message.error('添加失败')
        this.$message.success('添加成功')
        this.handleChange()
        this.dialogVisible = false
      })
    },
    // 关闭添加面板触发
    closeDialog() {
      this.$refs.formParams.resetFields()
    },
    // 删除tag标签
    handleClose(row, i) {
      row.attr_vals.splice(i, 1)
      this.upData(row)
    },
    // 文本框出现
    showInput(row) {
      console.log(row)
      row.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 更改文本框内容
    handleInputConfirm(row) {
      if (row.inputValue) {
        row.attr_vals.push(row.inputValue)
        this.upData(row)
      }
      row.inputVisible = false
      row.inputValue = ''
    },
    // 更新分类属性
    async upData(row) {
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, 
        { 
          attr_name: row.attr_name, 
          attr_sel: row.attr_sel, 
          attr_vals: row.attr_vals.join(' ') 
        })
      if (res.meta.status !== 200) return this.$message.error('更新失败')
      this.$message.success('更新成功')
    }
  }
}
</script>

<style lang="less" scoped>
.el-alert {
    margin-bottom: 20px;
}
.el-tabs {
    margin-top: 15px;
}
.el-table {
    margin-top: 15px;
}
.el-tag + .el-tag {
    margin-left: 10px;
}
.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}
.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}
</style>    
