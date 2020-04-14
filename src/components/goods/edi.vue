<template>
  <div>
      <Breadcrumb :navFaName="'商品管理'" :navSonName="'修改商品信息'"></Breadcrumb>
      <el-card class="box-card">   
        <el-alert
          title="修改商品信息"
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
          <el-tabs v-loading="loading" tab-position="left" :before-leave="beforeLeave">
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
                disabled
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
                :file-list="pics"
                accept="image/gif, image/jpeg, image/jpg, image/png"
                list-type="picture">
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-tab-pane>
            <el-tab-pane label="商品内容">
              <quill-editor class="editor" v-model="addForm.goods_introduce"></quill-editor>
              <el-button @click="ediGoods" type="primary">修改商品</el-button>
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
      loading: true,
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
  mounted() {
    this.getGoods()
  },
  methods: {
    // 根据ID查询商品
    async getGoods() {
      const { data: res } = await this.$http.get(`goods/${this.$route.params.id}`)
      console.log(res)
      this.addForm.goods_name = res.data.goods_name
      this.addForm.goods_cat = res.data.goods_cat.split(',').map(Number)
      this.addForm.goods_price = res.data.goods_price
      this.addForm.goods_number = res.data.goods_number
      this.addForm.goods_weight = res.data.goods_weight
      this.addForm.goods_introduce = res.data.goods_introduce
      const manyData = res.data.attrs.filter(item => {
        return item.attr_sel === 'many'
      })
      manyData.forEach(item => {
        item.attr_vals = item.attr_value ? item.attr_value.split(' ') : []
      })
      this.manyDataList = manyData
      const onlyData = res.data.attrs.filter(item => {
        return item.attr_sel === 'only'
      })
      onlyData.forEach(item => {
        item.attr_vals = item.attr_value
      })
      this.onlyDataList = onlyData
      console.log(res.data.pics)
      res.data.pics.forEach(item => {
        const obj = {
          name: item.pics_big.slice(23),
          pic: 'tmp_uploads\\' + item.pics_big.slice(23),
          url: item.pics_big_url
        }
        this.pics.push(obj)
      })
      this.loading = false
    },
    // 获取商品分类
    async getCateList() {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取商品分类失败')
      this.cateOptions = res.data
    },
    // tab 切换之前
    beforeLeave(activeName, oldActiveName) {
      if (this.addForm.goods_cat.length !== 3 && oldActiveName === '0') {
        this.$message.error('请先选择商品分类')
        return false
      } 
      this.actives = activeName - 0
    },
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
        this.$message.info('只允许选择第三级分类')
      }
    },
    handleRemove(file, fileList) {
      const tmpath = file.response ? file.response.data.tmp_path : ''
      const index = this.pics.findIndex(e => e.pics === tmpath)
      this.pics.splice(index, 1)
      console.log(this.pics)
    },
    handlePreview(file) {
      this.imageSrc = file.response ? file.response.data.url : file.url
      this.dialogTableVisible = true
    },
    onSuccess(response) {
      console.log(response)
      const pathobj = { 
        name: response.data.tmp_path.slice(12),
        pic: response.data.tmp_path,
        url: response.data.url
      }
      this.pics.push(pathobj)
      console.log(this.pics)
    },
    ediGoods() {
      this.$refs.addForm.validate(async (valid) => {
        if (!valid) return this.$message.error('请完善表单数据后再修改！')
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
        const { data: res } = await this.$http.put(`goods/${this.$route.params.id}`, {
          goods_name: this.addForm.goods_name,
          goods_cat: this.addForm.goods_cat.join(','),
          goods_price: this.addForm.goods_price,
          goods_number: this.addForm.goods_number,
          goods_weight: this.addForm.goods_weight,
          goods_introduce: this.addForm.goods_introduce,
          pics: this.pics,
          attrs: arrs
        })
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error('修改商品失败')
        this.$message.success('修改商品成功')
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
