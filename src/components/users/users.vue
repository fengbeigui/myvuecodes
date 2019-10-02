<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索 -->
    <div style="margin-top: 5px;" class="search">
      <el-input placeholder="请输入内容" v-model="searchData" class="input-with-select">
        <el-button slot="append" @click.stop="searchGet" icon="el-icon-search"></el-button>
      </el-input>
      <el-button type="primary">主要按钮</el-button>
    </div>
    <!-- 表格 -->
    <el-table ref="singleTable" :data="tableData" highlight-current-row style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column property="username" label="姓名" width="180"></el-table-column>
      <el-table-column property="email" label="邮箱" width="220"></el-table-column>
      <el-table-column property="mobile" label="电话"></el-table-column>
      <el-table-column property label="状态">
        <!-- 想在table里面添加需要template 设置slot-scope="scope" -->
        <template slot-scope="scope">
          <el-switch v-model="value" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
      <el-table-column property label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" plain icon="el-icon-edit"></el-button>
          <el-button type="warning" size="mini" plain icon="el-icon-check"></el-button>
          <el-button type="danger" size="mini" plain icon="el-icon-delete"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage4"
      :page-sizes="[100, 200, 300, 400]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //搜索框内容
      searchData: "",
      value: true,
      tableData: []
    };
  },
  methods: {
    //一开始接口发送get请求获取信息，模糊查询也需要获取
    //创建 封装getUserList一个公用的方法
    //传一个参数 query 默认为空
    getUserList(query='') {
        if(query==''){
            var url = "users?pagenum=1&pagesize=20"
        }else{
            //等于加上你传来的query
            var url = "users?pagenum=1&pagesize=20&query="+query;
        }

      //封装了axios请求，名字为$myHttp
      this.$myHttp({
        //由于封装了axios,前面那串固定的链接可省略
        //上面写了判断后赋值，这里就不需写: "users?pagenum=1&pagesize=20"
        url,
        method: "get"
        // `headers` 是即将被发送的自定义请求头，已封装到axios
        //   headers: { "Authorization": window.localStorage.getItem("token") }
      }).then(backdata => {
        // console.log(backdata);
        if (backdata.data.meta.status == 200) {
          this.tableData = backdata.data.data.users;
        } else {
        }
      });
    },
    //模糊查找搜索信息,把searchData值传过来
    searchGet() {
    //   this.$myHttp({
    //     method: "get",
    //     url: "users?"
    //   });
    this.getUserList(this.searchData);
    }
  },
  //利用钩子函数在页面渲染之前获取用户列表数据
  mounted() {
      //调用 获取所有用户的信息，传searchData值过来
      this.getUserList();
  }
};
</script>

<style>
.search {
  line-height: 30px;
  text-align: left;
}
/* 输入框 */
.el-input__inner {
  width: 100%;
}
/* 输入整行 */
.input-with-select {
  width: 30%;
}
/* 日期栏 */
.el-table th {
  line-height: 30px;
}
</style>