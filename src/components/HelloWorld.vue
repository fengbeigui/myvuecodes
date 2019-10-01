<template>
  <el-container class="height100">
    <el-header>
      <el-row>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <img src="/static/images/logo.png" alt />
          </div>
        </el-col>
        <el-col :span="10">
          <div class="grid-content bg-purple-light title">
            <h2>电商后台管理系统</h2>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <el-button type="warning" class="text" disabled>退出</el-button>
          </div>
        </el-col>
      </el-row>
    </el-header>

    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <el-col :span="24">
          <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
          >
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>用户管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="1-1"><i class="el-icon-edit"></i>用户列表</el-menu-item>
                <el-menu-item index="1-2"><i class="el-icon-edit"></i>用户列表2</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>

                    <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
          >
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>权限管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="2-1"><i class="el-icon-tickets"></i>角色列表</el-menu-item>
                <el-menu-item index="2-2"><i class="el-icon-tickets"></i>权限列表</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>

        </el-col>
      </el-aside>
      <!-- 显示区 -->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "HelloWorld",
  data() {
    return {
      msg: "Welcome to Your Vue.js App，我是主页"
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >
.title {
  color: red;
}
.text {
  margin-top: 10px;
}
.height100 {
  height: 100%;
}
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #fff;
  /*  //文本居中 */
  text-align: center;
  line-height: 20px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>
