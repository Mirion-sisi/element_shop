<template>
  <div class="order-container">
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/user' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- card区域 -->
    <el-card class="box-card">
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price" width="130"></el-table-column>
        <el-table-column label="是否付款" width="130">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pay_status==='0'" type="danger">未付款</el-tag>
            <el-tag v-else type="success">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send" width="130"></el-table-column>
        <el-table-column label="下单时间">
          <template slot-scope="scope">{{scope.row.update_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button @click="showEditOrderDialog" size="mini" type="primary" icon="el-icon-edit"></el-button>
            <el-button
              @click="showProgressDialog"
              size="mini"
              type="primary"
              icon="el-icon-location"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 编辑地址dialog -->
    <el-dialog
      title="修改地址"
      :visible.sync="editDialogVisible"
      @close="addressDialogClosed"
      width="50%"
    >
      <!-- 编辑订单表单区域 -->
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-form-item label="选择地区" prop="address1">
          <el-cascader
            v-model="addressForm.address1"
            :options="cityData"
            :props="cityDataProp"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input placeholder="请输入详细信息"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 展示物流进度的dialog -->
    <el-dialog title="物流进度" :visible.sync="progressDialogVisible" width="50%">
      <!-- 物流进度 TimeLine组件 -->
      <el-timeline>
        <el-timeline-item
        type='primary'
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>
<script>
import { getOrderList } from "../../network/order";
import { formatDate } from "../../common/mixin";
import { getKuaiDiInfo } from "../../network/order";
import cityData from "../../common/citydata.js";
export default {
  name: "Order",
  mixins: [formatDate],
  data() {
    return {
      // 请求参数
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      //   订单列表
      orderList: [],
      //   编辑dialog的显示
      editDialogVisible: false,
      // 编辑地址的表单
      addressForm: {
        // 省市区级联选择器的选择值
        address1: [],
        address2: ""
      },
      // 编辑地址的表验证规则
      addressFormRules: {
        address1: [
          { required: true, message: "请选择省市区", trigger: "blur" }
        ],
        address2: [
          { required: true, message: "请填写详细地址", trigger: "blur" }
        ]
      },
      //   省市区数据
      cityData: cityData,
      // 省市区级联规则
      cityDataProp: {
        label: "label",
        value: "value",
        children: "children",
        expandTrigger: "hover"
      },
      //   物流进度dialog显示与否
      progressDialogVisible: false,
      //   物流进度信息
      progressInfo: []
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    //   获取订单列表
    async getOrderList() {
      const res = await getOrderList(this.queryInfo);
      if (res.meta.status !== 200)
        return this.$message.error("订单列表获取失败");
      this.orderList = res.data.goods;
      this.total = res.data.total;
      console.log(res);
    },
    // 监听分页 页码改变,得到当前页码
    handleCurrentChange(nowNum) {
      this.queryInfo.pagenum = nowNum;
      this.getOrderList();
    },
    // 监听分页  size改变,得到当前size
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrderList();
    },
    // 编辑订单列表
    showEditOrderDialog() {
      this.editDialogVisible = true;
    },
    // 级联选择器的该百年事件
    handleChange() {
      console.log(this.addressForm.address1);
    },
    // 编辑地址的dialog关闭时,重置表单
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields();
    },
    // 物流进度dialog的显示
    showProgressDialog() {
      this.getKuaiDiInfo();
      this.progressDialogVisible = true;
    },
    // 获得物流进度的方法
    async getKuaiDiInfo() {
      const testId = 804909574412544580;
      const res = await getKuaiDiInfo(testId);
      if (res.meta.status !== 200)
        return this.$message.error("获取物流进度失败");
      this.progressInfo = res.data;
      console.log(res);
    }
  }
};
</script>
<style lang="less" scoped>
.el-table {
  margin: 15px 0;
}
.el-cascader {
  width: 100%;
}
</style>