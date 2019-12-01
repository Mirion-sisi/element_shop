<template>
  <div class="user-container">
    <!-- 1.面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/users' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 2.cart区域 -->
    <el-card class="box-card">
      <!-- 搜索框区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input v-model="queryInfo.query" clearable @clear="getUserList" placeholder="请输入内容">
            <el-button @click="getUserList" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="userList" stripe border style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              @change="userStateChanged(scope.row)"
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column width="180" label="操作">
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-button
              @click="editUserForm(scope.row.id)"
              type="primary"
              size="mini"
              icon="el-icon-edit"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              @click="deleUserById(scope.row.id)"
              type="danger"
              size="mini"
              icon="el-icon-delete"
            ></el-button>
            <!-- 分配角色 -->
            <el-tooltip :enterable="false" effect="dark" content="分配角色" placement="top">
              <el-button
                @click="setUserRole(scope.row)"
                type="warning"
                size="mini"
                icon="el-icon-setting"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 4,10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 3.添加用户======dialog弹出层区域 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 4.编辑用户======dialog弹出层区域 -->
    <el-dialog title="编辑用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 给用户分配角色 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setUserRoleDialogVisible"
      width="50%"
      @close="setUserRoleDialogClosed"
    >
      <p>当前用户名:{{userInfo.username}}</p>
      <p>当前d的角色:{{userInfo.role_name}}</p>
      <p>分配新角色:
      <el-select v-model="selectedRoleId" placeholder="请选择">
        <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
      </el-select>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setUserRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getUserList,
  userStateChanged,
  addUser,
  getEditUser,
  editUser,
  deleUserById,
  setUserRole
} from "../../../network/user.js";
import { getRolesList } from "../../../network/roles.js";
export default {
  name: "User",
  created() {
    this.getUserList();
  },
  data() {
    //   验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      // 正则验证
      const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value)) {
        // 合法的手机号
        return cb();
      }
      cb(new Error("请输入合法的手机号"));
    };

    return {
      queryInfo: {
        query: "",
        // 当前页码
        pagenum: 1,
        // 每页显示数据条数
        pagesize: 2
      },
      userList: [],
      total: 0,
      //  添加用户弹出层是否关闭
      addDialogVisible: false,
      //  添加用户表单数据
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      //  添加用户部分 添加表单验证规则对象
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "用户名的长度在3-10个字符之间",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "用户名的长度在6-15个字符之间",
            trigger: "blur"
          }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        mobile: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      // 编辑用户弹出层是否关闭
      editDialogVisible: false,
      // 编辑用户表单数据
      editForm: {},
      // 编辑用户部分 验证规则
      editFormRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      //  给用户分配角色 弹出层是否关闭
      setUserRoleDialogVisible: false,
      // 需要分配角色的信息
      userInfo: {},
      // 角色列表
      roleList: [],
      // 已选中的角色ID值
      selectedRoleId: "",
      setUserRoleForm: {}
    };
  },
  methods: {
    async getUserList() {
      const res = await getUserList(this.queryInfo);
      if (res.meta.status !== 200)
        return this.$message.error("获取用户列表失败!");
      this.userList = res.data.users;
      this.total = res.data.total;
      //   console.log(res);
    },
    // 监听pagesize改变的事件
    handleSizeChange(size) {
      this.queryInfo.pagesize = size;
      this.getUserList();
    },
    //监听 页码值(当前页码) 改变事件
    handleCurrentChange(nowPage) {
      this.queryInfo.pagenum = nowPage;
      this.getUserList();
    },
    // 监听switch开关状态的改变
    async userStateChanged(userInfo) {
      const res = await userStateChanged(userInfo);
      if (res.meta.status !== 200) {
        this.userInfo.mg_state = !this.userInfo.mg_state;
        this.$message.error("修改状态失败");
      }
      this.$message.success("修改状态成功");
    },
    // 添加用户==监听dialoge关闭事件的回调函数,重置表单
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 添加用户
    addUser() {
      // 预验证
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return;
        // 发起网络请求,请求接口添加数据
        const res = await addUser(this.addForm);
        if (res.meta.status !== 201) {
          this.$message.error("添加用户失败");
        }
        this.$message.success("添加用户成功!");
        this.addDialogVisible = false;
        this.getUserList();
      });
    },
    // 编辑用户,根据id请求要编辑的用户的数据
    async editUserForm(id) {
      const res = await getEditUser(id);
      if (res.meta.status !== 200) this.$message.error("请求数据失败");
      this.editForm = res.data;
      console.log(this.editForm);
      this.editDialogVisible = true;
    },
    // 编辑用户==监听dialoge关闭事件的回调函数,重置表单
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 编辑用户,发送请求修改数据库中的用户的数据
    editUser() {
      // 预验证
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;
        // 发起修改用户信息的数据请求
        const res = await editUser(this.editForm);
        if (res.meta.status !== 200) return this.$message.error("请求更改失败");
        // 关闭对话框
        this.editDialogVisible = false;
        // 刷新数据列表
        this.getUserList();
        // 提示修改成功
        this.$message.success("请求更改成功");
      });
    },
    // 删除用户
    async deleUserById(id) {
      const result = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(error => error);
      if (result === "cancel") return this.$message.info("已取消删除");
      const data = await deleUserById(id);
      if (data.meta.status !== 200) return this.$message.error("删除用户失败");
      this.$message.success("删除用户成功");
      this.getUserList();
    },
    // 分配角色  dialog弹出
    async setUserRole(userInfo) {
      this.userInfo = userInfo;
      // 在展示对话框之前,获取所有角色的列表
      const res = await getRolesList();
      if (res.meta.status !== 200)
        return this.$message.error("获取角色列表失败!");
      this.roleList = res.data;
      console.log(this.roleList);
      this.setUserRoleDialogVisible = true;
    },
    // 用户分配角色==监听dialoge关闭事件的回调函数,重置表单
    setUserRoleDialogClosed() {
     this.userInfo={}
      this.selectedRoleId=''
    },
    // 点击确定按钮,分配角色
    async saveRoleInfo() {
      if (!this.selectedRoleId) {
        return this.$message.error("请选择要分配的角色对象");
      }
      const res = await setUserRole(this.userInfo.id, this.selectedRoleId);
     if(res.meta.status!==200) return this.$message.error(res.meta.msg)
     this.$message.success('更新角色成功')
     this.getUserList()
      this.setUserRoleDialogVisible = false;
     
    }
  }
};
</script>
<style lang='less' scoped>
.el-table {
  margin-top: 10px;
}
.el-pagination {
  margin-top: 10px;
}
</style>