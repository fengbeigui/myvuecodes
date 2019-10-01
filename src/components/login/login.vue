<template>
  <div class="login-wrap">
    <el-form
      ref="form"
      :label-position="labelPosition"
     
      label-width="100px"
      class="login-from"
    >
      <h2>用户登录</h2>
      <el-form-item label="用户名" prop="pass">
        <el-input type="text" v-model="username"></el-input>
      </el-form-item>
      <el-form-item label-position="top" label="密码">
        <el-input type="passwd" v-model="userpwd"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" class="login-btn">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
        //绑定的属性储存
      labelPosition: "top",      
        username:"",
        userpwd:""
    };
  },
  methods: {
    //事件属性onSubmit,登录按钮事件
    onSubmit() {
       // console.log(this.username,this.userpwd);

        // 使用axios自己封装的axios的$myHttp,发送post 请求，传入data中的数据,注意写法
        // this.$myHttp.post(
        // "http://localhost:8888/api/private/v1/login",
        // {username:this.username,userpwd:this.userpwd},        
        // ).then((back_data)=>{
        //     console.log(back_data);           
        // })

        // 使用axios，写法二,自己封装的axios的$myHttp
        //method 属性设置的方法将表单中的数据传送给服务器进行处理
        this.$myHttp({
            method:"post",
            url:'http://localhost:8888/api/private/v1/login',
            username:this.username,
            userpwd:this.userpwd
        }).then((back_data)=>{
            console.log(back_data);
            
        })
    }
  }
};
</script>

<style>
.login-wrap {
  background-color: #324152;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-wrap .login-from {
  background-color: #fff;
  width: 400px;
  padding: 30px;
  border-radius: 5px;
}

.login-wrap .login-from .login-btn {
  width: 100%;
}
</style>