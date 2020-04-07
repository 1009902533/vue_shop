<template>
  <div>
      <Breadcrumb :navFaName="'商品管理'" :navSonName="'商品分类'"></Breadcrumb>
      <el-card class="box-card">
          <el-button @click="addCate" type="primary">添加分类</el-button>
          <tree-table 
            class="treetable"
            index-text="#"
            :data="cateList" 
            :columns="columns" 
            :stripe="props.stripe" 
            :border="props.border" 
            :show-header="props.showHeader" 
            :show-summary="props.showSummary"
            :show-row-hover="props.showRowHover"
            :show-index="props.showIndex"
            :tree-type="props.treeType" 
            :is-fold="props.isFold" 
            :expand-type="props.expandType"
            :selection-type="props.selectionType">
            <template slot="isok" slot-scope="scope">
                <i v-if="scope.row.cat_deleted" class="el-icon-error" style="color:#f56c6c"></i>
                <i else class="el-icon-success" style="color:#67c23a"></i>
            </template>
            <template slot="order" slot-scope="scope">
                <el-tag v-if="scope.row.cat_level === 0" size="small">一级</el-tag>
                <el-tag v-else-if="scope.row.cat_level === 1" type="info" size="small">二级</el-tag>
                <el-tag v-else type="warning" size="small">三级</el-tag>
            </template>
            <template slot="opt" slot-scope="scope">
                <el-tooltip content="编辑" placement="top" :enterable="false">
                    <el-button @click="ediCate(scope.row)" type="primary" icon="el-icon-edit" size="mini"></el-button>
                </el-tooltip>
                <el-tooltip content="删除" placement="top" :enterable="false">
                    <el-button @click="delCate(scope.row.cat_id)" type="danger" icon="el-icon-delete" size="mini"></el-button>
                </el-tooltip>
            </template>
        </tree-table>
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-size="queryInfo.pagesize"
        layout="total, prev, pager, next, jumper"
        :total="total">
        </el-pagination>
      </el-card>
      <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      @close="closeAddDialog"
      :visible.sync="dialogVisibleAdd"
      width="50%">
      <el-form ref="formAdd" :rules="formAddRules" :model="formAdd" label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="formAdd.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <el-cascader
           v-model="slectedList"
           :options="cateOptions"
           :props="cascaderProps"
           clearable 
           @change="handleChange">
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="AddsubmitForm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改分类对话框 -->
    <el-dialog
      title="修改分类"
      @close="closeEdiDialog"
      :visible.sync="dialogVisibleEdi"
      width="50%">
      <el-form ref="formEdi" :rules="formAddRules" :model="formEdi" label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="formEdi.cat_name"></el-input>
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
      queryInfo: {
        type: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      cateList: [],
      props: {
        stripe: false, // 是否显示间隔斑马纹
        border: true, // 是否显示纵向边框
        showHeader: true, // 是否显示表头
        showSummary: false, // 是否显示表尾合计行
        showRowHover: true, // 鼠标悬停时，是否高亮当前行
        showIndex: true, // 是否显示数据索引
        treeType: true, // 是否为树形表格
        isFold: true, // 树形表格中父级是否默认折叠
        expandType: false, // 是否为展开行类型表格（为 True 时，需要添加作用域插槽, 它可以获取到 row, rowIndex)
        selectionType: false // 是否显示间隔斑马纹
      },
      // 表格标题数据
      columns: [
        { label: '分类名称', prop: 'cat_name' },
        // type:'template'(将该列设置为模板列)，template:'isok'(设置该列模板的名称为isok)
        { label: '是否有效', prop: '', type: 'template', template: 'isok' },
        { label: '排序', prop: '', type: 'template', template: 'order' },
        { label: '操作', prop: '', headerAlign: 'center', type: 'template', template: 'opt', align: 'center' }
      ],
      formAdd: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      formAddRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
        ]
      },
      dialogVisibleAdd: false,
      cateOptions: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: true
      },
      slectedList: [],
      dialogVisibleEdi: false,
      formEdi: {}
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取商品列表失败')
      this.cateList = res.data.result
      this.total = res.data.total
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.queryInfo.pagesize = val
      this.getCateList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.queryInfo.pagenum = val
      this.getCateList()
    },
    // 获取父级商品分类
    async getParentList() {
      const { data: res } = await this.$http.get('categories', { params: { type: '2' } })
      if (res.meta.status !== 200) return this.$message.error('获取父级商品分类失败')
      this.cateOptions = res.data
    },
    // 提交分类
    AddsubmitForm() {
      this.$refs.formAdd.validate(async (valid) => {
        if (!valid) return false
        const { data: res } = await this.$http.post('categories', this.formAdd)
        if (res.meta.status !== 201) return this.$message.error('添加分类失败')
        this.$message.success('添加分类成功')
        this.dialogVisibleAdd = false
        this.getCateList()
      })
    },
    // 添加分类
    addCate() {
      this.getParentList()
      this.dialogVisibleAdd = true
    },
    handleChange() {
      if (this.slectedList.length > 0) {
        this.formAdd.cat_pid = this.slectedList[this.slectedList.length - 1]
        this.formAdd.cat_level = this.slectedList.length
      } else {
        this.formAdd.cat_pid = 0
        this.formAdd.cat_level = 0
      }
    },
    // 关闭添加面板
    closeAddDialog() {
      this.$refs.formAdd.resetFields()
      this.slectedList = []
      this.formAdd.cat_pid = 0
      this.formAdd.cat_level = 0
    },
    // 编辑分类
    async ediCate(e) {
      const { data: res } = await this.$http.get(`categories/${e.cat_id}`)
      if (res.meta.status !== 200) return this.$message.error('获取分类数据失败')
      this.formEdi = res.data
      this.dialogVisibleEdi = true
    },
    // 确定修改
    EdisubmitForm() {
      this.$refs.formEdi.validate(async (valid) => {
        if (!valid) return false
        const { data: res } = await this.$http.put(`categories/${this.formEdi.cat_id}`, { cat_name: this.formEdi.cat_name })
        if (res.meta.status !== 200) return this.$message.error('修改分类失败')
        this.$message.success('修改分类成功')
        this.dialogVisibleEdi = false
        this.getCateList()
      })
    },
    // 修改框关闭时触发
    closeEdiDialog() {
      this.$refs.formEdi.resetFields()
    },
    // 删除分类
    async delCate(id) {
      const rul = await this.$confirm('此操作将永久删除该项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => err)   
      if (rul !== 'confirm') return this.$message.info('已取消删除') 
      const { data: res } = await this.$http.delete(`categories/${id}`)
      if (res.meta.status !== 200) return this.$message.error('删除分类失败')
      this.$message.success('删除分类成功')
      this.getCateList()
      console.log(this.cateList.length)
      if (this.queryInfo.pagenum > 1) {
        if (this.cateList.length === 1) {
          this.queryInfo.pagenum--
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.treetable {
  margin: 20px 0;
}
.el-cascader {
  width: 100%;
}
</style>
