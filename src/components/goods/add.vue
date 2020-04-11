<template>
  <div>
      <Breadcrumb :navFaName="'商品管理'" :navSonName="'添加商品'"></Breadcrumb>
      <el-card class="box-card">   
        <el-alert
          title="添加商品信息"
          type="info"
          center
          :closable="false"
          show-icon>
        </el-alert>
        <el-steps :active="actives" align-center finish-status="success">
          <el-step title="基本信息"></el-step>
          <el-step title="商品参数"></el-step>
          <el-step title="商品属性"></el-step>
          <el-step title="商品图片"></el-step>
          <el-step title="商品内容"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>
        <el-form label-position="top" :rules="addRules" ref="addForm" :model="addForm">
          <el-tabs tab-position="left" :before-leave="beforeLeave">
            <el-tab-pane label="基本信息">
              <el-form-item label="商品名称" prop="goods_name">
                <el-input v-model="addForm.goods_name"></el-input>
              </el-form-item>
              <el-form-item label="商品价格" prop="goods_price">
                <el-input type="number" v-model="addForm.goods_price"></el-input>
              </el-form-item>
              <el-form-item label="商品重量" prop="goods_weight">
                <el-input type="number" v-model="addForm.goods_weight"></el-input>
              </el-form-item>
              <el-form-item label="商品数量" prop="goods_number">
                <el-input type="number" v-model="addForm.goods_number"></el-input>
              </el-form-item>
              <el-form-item label="商品分类">
                <el-cascader 
                v-model="addForm.goods_cat"
                :options="cateOptions"
                :props="cascaderProps"
                @change="handleChange"></el-cascader>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品参数">
              <el-form-item v-for="i in this.manyDataList" :label="i.attr_name" :key="i.attr_id">
                <el-checkbox-group v-model="i.attr_vals">
                  <el-checkbox border v-for="(n, index) in i.attr_vals" :label="n" :key="index"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品属性">
              <el-form-item v-for="i in this.onlyDataList" :label="i.attr_name" :key="i.attr_id">
                <el-input v-model="i.attr_vals"></el-input>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品图片">
              <el-upload
                class="upload-demo"
                :action="uploadUrl"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :headers="headers"
                :on-success="onSuccess"
                accept="image/gif, image/jpeg, image/jpg, image/png"
                list-type="picture">
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-tab-pane>
            <el-tab-pane label="商品内容">
              <quill-editor class="editor" v-model="addForm.goods_introduce"></quill-editor>
              <el-button @click="addGoods" type="primary">添加商品</el-button>
            </el-tab-pane>
          </el-tabs>
        </el-form>
      </el-card>
      <!-- 图片预览弹出框 -->
      <el-dialog title="图片预览" :visible.sync="dialogTableVisible">
        <img class="photos" :src="imageSrc" />
      </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      actives: 0,
      addForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_introduce: '',
        goods_cat: []
      },
      addRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ]
      },
      cateOptions: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      manyDataList: [],
      onlyDataList: [],
      pics: [],
      uploadUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
      headers: {
        Authorization: window.sessionStorage.getItem('token')
      },
      dialogTableVisible: false,
      imageSrc: ''
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取商品分类
    async getCateList() {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取商品分类失败')
      this.cateOptions = res.data
      console.log(res)
    },
    // 获取动态参数
    async getMany() {
      const { data: res } = await this.$http.get(`categories/${this.addForm.goods_cat[2]}/attributes`, { params: { sel: 'many' } })
      if (res.meta.status !== 200) return this.$message.error('获取参数失败')
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
      })
      this.manyDataList = res.data
    },
    // 获取静态属性
    async getOnly() {
      const { data: res } = await this.$http.get(`categories/${this.addForm.goods_cat[2]}/attributes`, { params: { sel: 'only' } })
      if (res.meta.status !== 200) return this.$message.error('获取参数失败')
      this.onlyDataList = res.data
    },
    // tab 切换之前
    beforeLeave(activeName, oldActiveName) {
      if (this.addForm.goods_cat.length !== 3 && oldActiveName === '0') {
        this.$message.error('请先选择商品分类')
        return false
      } 
      this.actives = activeName - 0
      if (activeName === '1') {
        this.getMany()
      }
      if (activeName === '2') {
        this.getOnly()
      }
    },
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
        this.$message.info('只允许选择第三级分类')
      }
    },
    handleRemove(file, fileList) {
      const tmpath = file.response.data.tmp_path
      const index = this.pics.findIndex(e => e.pics === tmpath)
      this.pics.splice(index, 1)
    },
    handlePreview(file) {
      this.imageSrc = file.response.data.url
      this.dialogTableVisible = true
    },
    onSuccess(response) {
      const pathobj = { pic: response.data.tmp_path }
      this.pics.push(pathobj)
    },
    addGoods() {
      this.$refs.addForm.validate(async (valid) => {
        if (!valid) return this.$message.error('请完善表单数据后再添加！')
        const arrs = []
        // 处理动态参数
        this.manyDataList.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          arrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyDataList.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          arrs.push(newInfo)
        })
        console.log(arrs)
        const { data: res } = await this.$http.post('goods', {
          goods_name: this.addForm.goods_name,
          goods_cat: this.addForm.goods_cat.join(','),
          goods_price: this.addForm.goods_price,
          goods_number: this.addForm.goods_number,
          goods_weight: this.addForm.goods_weight,
          goods_introduce: this.addForm.goods_introduce,
          pics: this.pics,
          attrs: arrs
        })
        if (res.meta.status !== 201) return this.$message.error('添加商品失败')
        console.log(res)
        this.$message.success('添加商品成功')
        this.$router.push('/goods')
      })
    }
  },
  computed: {

  }
}
</script>

<style lang="less" scoped>
.el-steps {
  margin: 15px 0;
}
.el-checkbox {
  margin-right: 5px;
}
.photos {
  max-width: 100%;
  margin: 0 auto;
  display: block;
}
.editor {
  margin-bottom: 15px;
}
</style>
