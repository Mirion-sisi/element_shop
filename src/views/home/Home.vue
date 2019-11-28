<template>
  <div class="home">
    <el-button @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {};
  },
  methods: {
    logout() {
      window.sessionStorage.clear("token");
      this.$router.push("/login");
    }
  }
};
</script>
