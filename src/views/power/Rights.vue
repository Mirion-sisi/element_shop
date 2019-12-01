<template>
  <div class="rights-container">
       <!-- 1.面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/users' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
       <!-- 2.cart区域 -->
    <el-card class="box-card">
        <el-table :data='rightsList' border stripe>
            <el-table-column type='index'></el-table-column>
            <el-table-column prop='authName' label='权限名称'></el-table-column>
            <el-table-column prop='path' label='路径'></el-table-column>
            <el-table-column prop='level' label='权限等级'>
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.level==='0'">一级</el-tag>
                    <el-tag v-else-if="scope.row.level==='1'" type="success">二级</el-tag>
                    <el-tag v-else type="warning">三级</el-tag>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
  </div>
</template>
<script>
import { getRightsList } from "../../network/rights";
export default {
  name: "Rights",
  data() {
    return {
      rightsList: []
    };
  },
  created() {
    this.getRightsList();
  },
  methods: {
    async getRightsList() {
      const data = await getRightsList('list');
      if(data.meta.status!==200) return this.$message.error('获取权限列表失败')
      this.rightsList=data.data
      console.log(data)
    }
  }
};
</script>
<style lang="less" scoped>
</style>