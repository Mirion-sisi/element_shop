<template>
  <div class="roles-container">
    <!-- 1.面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/users' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 2.cart区域 -->
    <el-card class="box-card">
      <!-- 添加角色列表区域 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
    </el-card>
    <!-- 角色列表区域 -->
    <el-table :data="roleList" border stripe>
      <!-- 展开列 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row
            :class="['bdbottom','vcenter',index1===0?'bdtop':'']"
            v-for="(item1,index1) in scope.row.children"
            :key="item1.id"
          >
            <!-- 渲染一级权限 -->
            <el-col :span="5">
              <el-tag @close="removeRightById(scope.row,item1.id)" closable>{{item1.authName}}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <!-- 渲染二级菜单 -->
            <el-col :span="19">
              <el-row
                :class="['vcenter',index2===0 ?'':'bdtop']"
                v-for="(item2,index2) in item1.children"
                :key="item2.id"
              >
                <el-col :span="6">
                  <el-tag
                    @close="removeRightById(scope.row,item2.id)"
                    closable
                    type="success"
                  >{{item2.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 渲染三级菜单 -->
                <el-col :span="18">
                  <el-tag
                    @close="removeRightById(scope.row,item3.id)"
                    closable
                    v-for="item3 in item2.children"
                    :key="item3.id"
                  >{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <!-- 索引列 -->
      <el-table-column type="index"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column width="300px" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
          <el-button
            @click="getRightsList(scope.row)"
            size="mini"
            type="warning"
            icon="el-icon-setting"
          >分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="30%"
      @close="setRightDialogClose"
    >
      <el-tree
        ref="treeRef"
        :data="rightsList"
        :props="rightsDefaultProps"
        default-expand-all
        show-checkbox
        node-key="id"
        :default-checked-keys="defKeys"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getRolesList,
  removeRightById,
  setRoleRights
} from "../../network/roles";
import { getRightsList } from "../../network/rights";
export default {
  name: "Roles",
  data() {
    return {
      roleList: [],
      //   分配权限的dialog显示与否
      setRightDialogVisible: false,
      // 权限列表
      rightsList: [],
      // 树形结构的分配规则
      rightsDefaultProps: {
        children: "children",
        label: "authName"
      },
      //   默认选中的树形结构中的节点
      defKeys: [],
      //   当前即将分配权限的角色的id
      roleId: "",
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    //   获取角色列表
    async getRolesList() {
      const data = await getRolesList();
      if (data.meta.status !== 200)
        return this.$message.error("角色权限列表获取失败");
      this.roleList = data.data;
      console.log(this.roleList);
    },
    // 通过id删除用户的权限
    async removeRightById(role, rightId) {
      const result = await this.$confirm(
        "此操作将永久删除该权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(error => error);
      if (result !== "confirm") {
        return this.$message.error("删除失败");
      }
      const res = await removeRightById(role.id, rightId);
      if (res.meta.status !== 200) return this.$message.error("删除权限失败");
      //   this.getRolesList();会刷新页面，发生页面的全部渲染，不建议用
      // 因为返回的res的data中是更新后的权限列表，可以直接赋值给
      console.log(role.children);
      //   避免刷新，使用以下方法
      role.children = res.data;
    },
    // 展示分配权限的对话框
    async getRightsList(role) {
      this.roleId = role.id;
      const res = await getRightsList("tree");
      if (res.meta.status !== 200)
        return this.$message.error("获取权限列表失败");
      this.rightsList = res.data;
      // 递归函数三级节点的id
      this.getLeafKeys(role, this.defKeys);
      this.setRightDialogVisible = true;
    },
    // 通过递归的形式，获取角色下的所有三级权限的id,
    // 并保存到 defKeys数组中
    getLeafKeys(node, arr) {
      if (!node.children) return arr.push(node.id);
      node.children.forEach(item => {
        this.getLeafKeys(item, arr);
      });
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClose() {
      this.defKeys = [];
    },
    // 点击为角色分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ];
      const idStr = keys.join(",");
      console.log(this.roleId,idStr)
      const res = await setRoleRights(this.roleId,idStr);
      if(res.meta.status!==200) return this.$message.error('分配权限失败')
      this.$message.success('分配权限成功')
      this.getRolesList()
      this.setRightDialogVisible=false
    }
  }
};
</script>
<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #ccc;
}
.bdbottom {
  border-bottom: 1px solid #ccc;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>