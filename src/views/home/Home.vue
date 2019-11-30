<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../../assets/img/logo.png" alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse?'64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
        :default-active='$route.path'
          router
          :collapse="isCollapse"
          :collapse-transition="false"
          unique-opened
          background-color="#373d41"
          text-color="#fff"
          active-text-color="#409EFF"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item1.id+''" v-for="item1 in menulist" :key="item1.id">
            <template slot="title">
              <i class="sub-icon" :class="iconMenuObj[item1.id]"></i>
              <span>{{item1.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/'+item2.path" v-for="item2 in item1.children" :key="item2.id">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{item2.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 内容部分 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { getMenuList } from "../../network/home.js";
export default {
  name: "home",
  data() {
    return {
      menulist: [],
      iconMenuObj: {
        "125": "iconfont iconfontuser-group-fill ",
        "103": "iconfont iconfontdatabaseset-fill",
        "101": "iconfont iconfontgoods",
        "102": "iconfont iconfontdatabase-fill ",
        "145": "iconfont iconfontchart-area"
      },
      isCollapse: false
    };
  },
  created() {
    this.getMenuList();
  },
  methods: {
    logout() {
      window.sessionStorage.clear("token");
      this.$router.push("/login");
    },
    async getMenuList() {
      const res = await getMenuList();
      if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      this.menulist = res.data;
      console.log(this.menulist);
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    }
  }
};
</script>
<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-container {
  background-color: red;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;
  padding-left: 0;
  div {
    height: 100%;
    display: flex;
    align-items: center;
  }
  img {
    height: 50px;
    width: 50px;
    border-radius: 50%;
    background-color: #ccc;
    margin-right: 10px;
  }
}
.el-aside {
  background-color: #373d41;
  .el-menu {
    border-right: none;
    .sub-icon {
      margin-right: 10px;
    }
  }
}
.toggle-button {
  background-color: #4a5064;
  font-size: 16px;
  color: #fff;
  text-align: center;
  line-height: 24px;
  letter-spacing: 0.2em;
  cursor: pointer;
}
.el-main {
  background-color: rgb(241, 227, 227);
}
</style>
