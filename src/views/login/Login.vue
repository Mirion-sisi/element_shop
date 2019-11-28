<template>
  <div class="login-container">
    <div class="login-box">
      <!-- 头像区域 -->
      <div class="avatar-box">
        <img src="../../assets/img/logo.png" alt />
      </div>
      <!-- 登陆表单区域 -->
      <el-form ref="loginFormRef" class="login-form" :model='loginForm' :rules='loginFormRules'>
        <!-- 用户名 -->
        <el-form-item prop='username'>
          <el-input v-model="loginForm.username" prefix-icon="iconfont iconfontuser-group-fill"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop='password'>
          <el-input v-model="loginForm.password" 
          prefix-icon="iconfont iconfontlock-fill"
          type='password'></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetloginFrom">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import {login} from '../../network/login'
export default {
  name: "Login",
  data(){
    return {
      loginForm:{
        username:'admin',
        password:'123'
      },
      // 表单验证对象
      loginFormRules:{
        username:[
           { required: true, message: '请输入用户名', trigger: 'blur' },
           { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password:[
           { required: true, message: '请输入密码', trigger: 'blur' },
           { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置表单
    resetloginFrom(){
      this.$refs.loginFormRef.resetFields();
    },
    login(){
      // 表单登录前预验证,回调函数第一参数是布尔值,true为验证成功
      this.$refs.loginFormRef.validate( async valid=>{
        if(!valid) return;
        const result= await login(this.loginForm)
        if(result.meta.status!==200)  return this.$message.error('登录失败');
        this.$message.success('登录成功')
        
        // 1.登录成功后将token保存到sessionStorage中
        window.sessionStorage.setItem('token',result.data.token)
        // 2.跳转到home页面
        this.$router.push('/home')
      })
    }
  },

};
</script>
<style lang="less" scoped>
.login-container {
  background-color: #2b4b6b;
  height: 100%;
}
.login-box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.avatar-box {
  height: 130px;
  width: 130px;
  border-radius: 50%;
  padding: 10px;
  box-sizing: border-box;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  // background-color: #fff;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}
.login-form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>