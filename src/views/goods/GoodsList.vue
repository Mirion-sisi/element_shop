<template>
  <div class="googslist-container">
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/user' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- cart区域 -->
    <el-card class="box-cart">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            @clear="getGoodsList"
            clearable
            placeholder="请输入内容"
            v-model="queryInfo.query"
            class="input-with-select"
          >
            <el-button @click="getGoodsList" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button @click="goAddGoods" type="primary">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="goodsList" style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品属性" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="95px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
        <el-table-column label="创建时间" width="200px">
          <template slot-scope="scope">{{scope.row.upd_time | goodsDateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="160px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary">编辑</el-button>
            <el-button @click="deleteById(scope.row.goods_id)" size="mini" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>
<script>
import { dateFormat } from "../../common/util";
import { getGoodsList,deleteById } from "../../network/goodslist";
export default {
  name: "GoodsList",
  data() {
    return {
      // 商品参数
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      //   商品列表
      goodsList: [],
      //   数据总数
      total: 0
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    async getGoodsList() {
      const res = await getGoodsList(this.queryInfo);
      if (res.meta.status !== 200)
        return this.$message.error("商品列表获取失败!");
      this.goodsList = res.data.goods;
      this.total = res.data.total;
      console.log(res);
    },
    // 监听分页size的变化
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodsList();
    },
    // 监听当前页码的变化
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum;
      this.getGoodsList();
      console.log(newNum);
    },
    // 删除商品通过id
    async deleteById(id) {
      const result = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (result !== "confirm") return this.$message.info("已取消删除");
      const res= await deleteById(id)
      if(res.meta.status!==200) return this.$message.error('删除商品失败')
      this.$message.success('删除商品成功')
      this.getGoodsList()
   },
  //  跳转到AddGoods页面
  goAddGoods(){
    this.$router.push('/goods/add')
  }  
  },
  filters: {
    // 日期时间过滤器
    goodsDateFormat(date) {
      return dateFormat(date);
    }
  }
};
</script>
<style lang="less" scoped>
.el-table-column {
  font-size: 12px;
}
</style>