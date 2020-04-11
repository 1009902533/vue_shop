<template>
  <div>
      <Breadcrumb :navFaName="'订单管理'" :navSonName="'订单列表'"></Breadcrumb>
      <el-card class="box-card">
        <el-row :gutter="20">
            <el-col :span="8">
            <el-input placeholder="请输入内容" 
            clearable 
            @clear="getOrdersList"
            v-model="queryInfo.query">
            <el-button slot="append" 
            @click="searchBtn"
            icon="el-icon-search"></el-button>
            </el-input>
            </el-col>
        </el-row>
        <el-table border :data="ordersList" stripe style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格（元）" width="120"></el-table-column>
        <el-table-column prop="pay_status" label="是否付款" width="100">
            <template slot-scope="scope">
                <el-tag v-if="scope.row.pay_status === '0'" type="danger">未付款</el-tag>
                <el-tag v-else type="success">已付款</el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="80"></el-table-column>
        <el-table-column label="下单时间" width="200">
            <template slot-scope="scope">
                <div>{{scope.row.create_time | dateFormate}}</div>
            </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="120">
            <template slot-scope="scope">
              <el-tooltip content="修改订单地址" placement="top" :enterable="false">
                <el-button @click="ediOrders(scope.row.order_id)" type="primary" icon="el-icon-edit" size="mini"></el-button>
              </el-tooltip>
              <el-tooltip content="物流信息" placement="top" :enterable="false">
                <el-button @click="logIstics(scope.row.order_id)" type="success" icon="el-icon-location" size="mini"></el-button>
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
      <!-- 修改订单地址对话框 -->
    <el-dialog
      title="修改订单地址"
      @close="closeDialog"
      :visible.sync="dialogVisible"
      width="50%">
      <el-form ref="formOrders" :rules="formAddRules" :model="formOrders" label-width="100px">
        <el-form-item label="省市区/县：" prop="slectedList">
          <el-cascader
           v-model="formOrders.slectedList"
           :options="cityData"
           :props="cascaderProps"
           clearable>
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址：" prop="site">
          <el-input v-model="formOrders.site"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 物流信息对话框 -->
    <el-dialog
      title="查看物流进度"
      :visible.sync="dialogVisibleLogistics"
      width="50%">
      <el-timeline :reverse="false">
        <el-timeline-item
        v-for="(activity, index) in activities"
        :key="index"
        :timestamp="activity.ftime">
        {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata.js'
export default {
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      ordersList: [],
      total: 0,
      cascaderProps: {
        value: 'value',
        label: 'label',
        children: 'children'
      },
      formAddRules: {
        slectedList: [
          { required: true, message: '请选择省市区县', trigger: 'blur' }
        ],
        site: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      cityData: cityData,
      formOrders: {
        slectedList: [],
        site: ''
      },
      dialogVisible: false,
      dialogVisibleLogistics: false,
      activities: []
    }
  },
  created () {
    this.getOrdersList()
  },
  methods: {
    // 获取订单列表
    async getOrdersList() {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
      this.ordersList = res.data.goods
      this.total = res.data.total
    },
    // 搜索
    searchBtn() {
      this.queryInfo.pagenum = 1
      this.getOrdersList()
    },
    // 修改订单地址
    async ediOrders(id) {
      const { data: res } = await this.$http.get(`orders/${id}`)
      console.log(res)
      this.dialogVisible = true
    },
    // 物流信息
    async logIstics() {
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      console.log(res)
      this.activities = res.data
      this.dialogVisibleLogistics = true
    },
    // 分页
    handleSizeChange(e) {
      this.queryInfo.pagesize = e
      this.getOrdersList()
    },
    handleCurrentChange(e) {
      this.queryInfo.pagenum = e
      this.getOrdersList()
    },
    // 关闭面板
    closeDialog() {
      this.$refs.formOrders.resetFields()
    },
    // 确定
    submitForm() {
      this.$refs.formOrders.validate(async (valid) => {
        if (!valid) return false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-table {
  margin: 20px 0;
}
.el-cascader {
  width: 100%;
}
</style>
