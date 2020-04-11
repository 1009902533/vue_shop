<template>
  <div>
      <Breadcrumb :navFaName="'商品管理'" :navSonName="'商品列表'"></Breadcrumb>
      <el-card class="box-card">
        <el-row :gutter="20">
            <el-col :span="8">
            <el-input placeholder="请输入内容" 
            clearable 
            @clear="getGoodsList"
            v-model="queryInfo.query">
            <el-button slot="append" 
            @click="searchBtn"
            icon="el-icon-search"></el-button>
            </el-input>
            </el-col>
            <el-col :span="4">
            <el-button @click="addGoods" type="primary">添加商品</el-button>
            </el-col>
        </el-row>
        <el-table border :data="GoodsList" stripe style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格（元）" width="120"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="120"></el-table-column>
        <el-table-column label="创建时间" width="200">
            <template slot-scope="scope">
                <div>{{scope.row.add_time | dateFormate}}</div>
            </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="120">
            <template slot-scope="scope">
              <el-tooltip content="修改" placement="top" :enterable="false">
                <el-button @click="editGoods(scope.row.goods_id)" type="primary" icon="el-icon-edit" size="mini"></el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top" :enterable="false">
                <el-button @click="delGoodsr(scope.row.goods_id)" type="danger" icon="el-icon-delete" size="mini"></el-button>
              </el-tooltip>
            </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
      </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      GoodsList: [],
      total: 0
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    // 搜索按钮
    searchBtn() {
      console.log(this.queryInfo)
      this.queryInfo.pagenum = 1
      this.getGoodsList()
    },
    // 获取商品列表
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取商品列表失败')
      this.GoodsList = res.data.goods
      this.total = res.data.total
      console.log(res)
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getGoodsList()
    },
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getGoodsList()
    },
    // 删除商品
    async delGoodsr(goodsId) {
      const rul = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (rul !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete(`goods/${goodsId}`)
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      this.getGoodsList()
    //   if (this.queryInfo.pagenum !== 1) {
    //     if (this.GoodsList.length === 0) {
    //       this.queryInfo.pagenum--
    //     }
    //   }
    },
    // 添加商品
    addGoods() {
      this.$router.push('/goods/add')
    },
    // 编辑商品
    editGoods(id) {
      this.$router.push(`/goods/edi/${id}`)
    }
  }
}
</script>

<style lang="less" scoped>
.el-table {
  margin: 20px 0;
}
</style>
