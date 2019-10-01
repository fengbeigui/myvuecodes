<template>
  <div class="login-wrap">
      <!-- :model="form" 绑定元素数据 -->
      <!-- :rules="rules" 设置验证规则 -->
    <el-form
      ref="form"
      :rules="rules"
      :model="form"
      :label-position="labelPosition"
      label-width="100px"
      class="login-from"
    >
      <h2>用户登录</h2>
      <el-form-item label="用户名" prop="username">
        <el-input type="text" v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label-position="top" label="密码" prop="password">
        <el-input type="password" v-model="form.password"></el-input>
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
      form: {
        username: "",
        password: ""
      },

      //保存一个对象,这是验证规则
      rules: {
          //验证用户名，使用prop
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [
            { required: true, message: "请输入密码", trigger: "blur" },
          {
            required: true,
            min: 3,
            max: 8,
            message: "长度在 3 到 8 个数字",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    //事件属性onSubmit,登录按钮事件
    onSubmit() {
        this.$refs.form.validate(res=>{
          //如果有错误信息  直接停止代码执行
          if(res){
              return;
          }
      })
      // console.log(this.username,this.userpwd);

      // 使用axios自己封装的axios的$myHttp,发送post 请求，传入data中的数据,注意写法
      this.$myHttp
        .post("http://localhost:8888/api/private/v1/login", 
        this.form,
        )
        .then(back_data => {
          console.log(back_data);
          //var { data, meta } = back_data.data;
          //判断  如果登录成功，做跳转
          if (back_data.data.meta.status == 200) {
              window.localStorage.setItem('token',back_data.data.data.token);
            //element插件属性
            this.$message({
              message: "恭喜你，登录成功",
              type: "success"
            });
            //登录成功，跳转到主页，编程式导航
            this.$router.push("/");
          }
        });

      // 使用axios，写法二,自己封装的axios的$myHttp
      //method 属性设置的方法将表单中的数据传送给服务器进行处理
      //   this.$myHttp({
      //     method: "post",
      //     url: "http://localhost:8888/api/private/v1/login",
      //     username: this.username,
      //     userpwd: this.userpwd
      //   }).then(back_data => {
      //     console.log(back_data);
      //     //判断  如果登录成功，做跳转
      //     if (back_data.data.meta.status == 200) {
      //       alert("登录成功");
      //       //登录成功，跳转到主页，编程式导航
      //       this.$router.push("/");
      //     }
      //   });
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