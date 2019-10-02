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
      <el-button @click.stop="userShow" type="primary">添加用户</el-button>
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
          <!-- 此时我们通过scope获取状态数据 -->
          <el-switch
            v-model="scope.row.mg_state"
            @change="mgStateChange(scope)"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column property label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="editUser(scope)" size="mini" plain icon="el-icon-edit"></el-button>
          <el-button
            type="warning"
            @click="rolesShowClick(scope)"
            size="mini"
            plain
            icon="el-icon-check"
          ></el-button>
          <el-button
            type="danger"
            @click="deleteUser(scope.row.id)"
            size="mini"
            plain
            icon="el-icon-delete"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <!--    @size-change="sizeChange"
        页面显示条数修改时触发
        :page-sizes="[1, 2, 3, 4, 20]" 条数可选列表
         :page-size="20"默认显示条数
          :total="total"显示总条数
          @current-change = "pageChange"改变页面触发事件
     -->
    <el-pagination
        @size-change="sizeChange"
        @current-change = "pageChange"
      :page-sizes="[1, 2, 3, 4, 20]"
      :page-size="20"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!--  添加用户弹窗 ,不要那个冒号就不绑定了-->
    <!-- visible控制窗口的显示与隐藏 -->
    <el-dialog title="添加用户" :visible.sync="addUserShow">
      <!--  使用双向数据绑定 操作表单数据 -->
      <el-form :model="userAddData" :rules="rules" ref="userAddData">
        <el-form-item label="用户名" label-width="200px" prop="username">
          <el-input v-model="userAddData.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="200px" prop="password">
          <el-input v-model="userAddData.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="200px">
          <el-input v-model="userAddData.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="200px" prop="mobile">
          <el-input v-model="userAddData.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!-- 关闭窗口 -->
        <el-button @click="addUserShow = false">取 消</el-button>
        <!--  绑定确定事件，发送数据到服务器入库 -->
        <el-button type="primary" @click="addUserPost ">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改用户弹窗 -->
    <el-dialog title="修改用户" :visible.sync="editUserShow">
      <!--  使用双向数据绑定 操作表单数据 -->
      <el-form :model="usereditData" :rules="rules" ref="userAddData">
        <el-form-item label="用户名" label-width="200px" prop="username">
          <el-input v-model="usereditData.username" :disabled="true" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" label-width="200px">
          <el-input v-model="usereditData.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="200px" prop="mobile">
          <el-input v-model="usereditData.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!-- 关闭窗口 -->
        <el-button @click="quxiaoxiugai">取 消</el-button>
        <!--  绑定确定事件，发送数据到服务器入库 -->
        <el-button type="primary" @click="editUserPut">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改用户角色的弹窗 -->
    <el-dialog title="修改用户角色" :visible.sync="rolesShow">
      <!--  使用双向数据绑定 操作表单数据 -->
      <el-form>
        <el-form-item label="用户名" label-width="200px">
          <span>{{rolesData.username}}</span>
        </el-form-item>
        <el-form-item label="角色" label-width="200px">
          <el-select v-model="roleId" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.value"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!-- 关闭窗口 -->
        <el-button @click="rolesShow=false">取 消</el-button>
        <!--  绑定确定事件，发送数据到服务器入库 -->
        <el-button type="primary" @click="rolePut">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //修改用户角色
      rolesShow: false,
      //要修改角色的用户信息
      rolesData: {},
      //角色
      roleList: [],
      roleId: "",

    

      //修改用户窗口 隐藏显示
      editUserShow: false,
      usereditData: {
        //给他一个id
        id: "",
        username: "",
        email: "",
        mobile: ""
      },
      //窗口显示控制数据,添加用户
      addUserShow: false,
      //注意这些名字是获取后台数据的名字，需要对应，使用mobile名导致手机并不显示
      userAddData: {
        username: "",
        password: "",
        email: "",
        mobile: ""
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
        ],
        mobile: [
          { required: true, message: "请输入11位数字", trigger: "blur" },
          {
            required: true,
            min: 11,
            max: 11,
            message: "长度请输入11位数字",
            trigger: "blur"
          }
        ]
      },
      //搜索框内容
      searchData: "",
      value: true,
      tableData: [],

      //分页数据
      //显示Invalid prop: type check failed for prop "total"；给他一个默认值0
      total:2, //总条数
      //默认控制显示的条数
      sizepage:20,
      //当前默认页码
      page:1,
    };
  },
  methods: {
      //页码改变时，触发的函数
      pageChange(page){
          //console.log(page);
          this.page = page;
           this.getUserList();
          
      },
      //显示条数被修改后触发
      sizeChange(size){
          //console.log(size);
          this.sizepage = size;
          this.getUserList();
          
      },



    //一开始接口发送get请求获取信息，模糊查询也需要获取
    //创建 封装getUserList一个公用的方法
    //传一个参数 query 默认为空
    getUserList(query = "") {
      if (query == "") {
          //${this.sizepage}获取每页条数
        var url = `users?pagenum=${this.page}&pagesize=${this.sizepage}`;
      } else {
        //等于加上你传来的query
        var url = "users?pagenum=${this.page}&pagesize=${this.sizepage}" + query;
      }

      //封装了axios请求，名字为$myHttp
      this.$myHttp({
        //由于封装了axios,前面那串固定的链接可省略
        //上面写了判断后赋值，这里就不需写: "users?pagenum=1&pagesize=20"
        url,
        method: "get",
        // `headers` 是即将被发送的自定义请求头，(H5新增本地缓存)
        //已封装到axios,但是再次获取的时候不显示,还是得在这里添加请求头
        headers: { Authorization: window.localStorage.getItem("token") }
      }).then(backdata => {
        //解析数据对象
        // console.log(backdata);
            let {data,meta}  =  backdata.data;
        if (meta.status == 200) {
            //console.log(data.total);
            this.total = data.total;
            
         // this.tableData = backdata.data.data.users;
          this.tableData = data.users;
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
    },
    //显示添加用户面板
    userShow() {
      this.addUserShow = true;
    },
    //请求接口，添加用户
    addUserPost() {
      //如果验证信息有错误不提交数据，这里根据上面起名不是form了，是userAddData
      this.$refs.userAddData.validate(res => {
        //如果有错误信息  直接停止代码执行
        if (res) {
          return;
        }
      });

      //console.log(this.userAddData);
      this.$myHttp({
        url: "users",
        method: "post",
        //直接将vue data数据中的userAddData拿过来
        //userAddData就是弹出表单中的数据
        data: this.userAddData
      }).then(backdata => {
        let { data, meta } = backdata.data;
        console.log(data, meta);
        if (meta.status == 201) {
          //提示添加用户成功
          //element插件属性,
          this.$message({
            message: "添加用户成功",
            type: "success"
          });
          //把窗口关掉
          this.addUserShow = false;

          //如果成功，重新获取数据
          this.getUserList();
        }
      });
    },
    //状态改变事件，scope不一般
    mgStateChange(scope) {
      //console.log(scope);
      this.$myHttp({
        //url:'users/:uId/state/:type',
        url: `users/${scope.row.id}/state/${scope.row.mg_state}`,
        method: "put",
        headers: { Authorization: window.localStorage.getItem("token") }
      }).then(backdata => {
        console.log(backdata);
        let { data, meta } = backdata.data;
        if (meta.status == 200) {
          //提示成功
          this.$message({ message: "修改状态成功", tupe: "success" });
        } else {
          //值是tableData控制的,如果修改失败，$index取反
          //实现数据接口请求失败，状态不动
          //1获取点击的元素，scope的#index就是点击的那个元素的数组下标
          //修改状态值 获取修改后的页面的值，然后取反重新赋值
          this.tableData[scope.$index].mg_state = !scope.row.mg_state;
        }
      });
    },
    //删除用户,删除的时候把id传过来
    deleteUser(id) {
      // alert(id)
      //添加确认窗口
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //请求接口，执行删除操作
          //获取要删除的用户id
          this.$myHttp({
            url: `users/${id}`,
            method: "delete"
          }).then(backdata => {
            let { data, meta } = backdata.data;
            //console.log(data,meta);
            this.$message({
              message: "删除成功",
              type: "success"
            });
            //从数据库重新获取
            this.getUserList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //控制修改用户的窗口显示
    editUser(scope) {
      //接收点击事件传入的用户数据
      //将数据修改到中usereditData 使数据展示在表单中
      this.usereditData = scope.row;
      this.editUserShow = true;
    },
    //修改用户数据
    editUserPut() {
      // console.log(this.usereditData);
      let id = this.usereditData.id;
      let email = this.usereditData.email;
      let mobile = this.usereditData.mobile;
      //发送put请求到服务器
      this.$myHttp({
        url: `users/${id}`,
        method: "put",
        data: { email, mobile }
      }).then(backdata => {
        //console.log(backdata);
        //使用对象的解构赋值获取data及mate
        let { data, meta } = backdata.data;
        if (meta.status == 200) {
          this.$message({
            message: "修改成功",
            type: "sucess"
          });
        } else {
          this.$message.error("修改失败");
        }
        //关掉窗口
        this.editUserShow = false;
        //不管修改成功还是失败，都重新加载数据
        this.getUserList();
      });
    },
    //取消修改用户操作
    quxiaoxiugai() {
      //关闭窗口,
      this.editUserShow = false;
      //重新获取数据,因为数据使用双向数据绑定，
      //当点击取消按钮需要重新获取数据
      this.getUserList();
    },
    //修改用户角色窗口展示
    rolesShowClick(scope) {
      //需求获取所有角色的列表
      //然后将角色内容，展示到下拉列表中
      //this.$myHttp({}).then(backdata=>{})
      this.$myHttp({
        url: "roles",
        method: "get"
      }).then(backdata => {
        //console.log(backdata);
        this.roleList = backdata.data.data;
      });
 
      this.rolesData = scope.row;
      this.rolesShow = true;
    },
    rolePut(){ 
        //console.log(this.roleId,this.rolesData.id);
        this.$myHttp({
            url:`users/${this.rolesData.id}/role`,
            method:'put',
            data:{rid:this.roleId},
        }).then(backdata=>{
            //console.log(backdata);
            let {data,meta}=backdata.data;
            if(meta.status==200){
                this.rolesShow = false;
                this.$message({message:'修改角色成功',type:'success'})
            }
            
        })
        
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
.el-pagination{
    float: left;
}
.el-pager {
   padding:0 4px;
   background: #fff;
   font-size:13px;
   min-width: 35.5px;
   height: 28px;
   line-height: 28px;
   -webkit-box-sizing:border-box;
   box-sizing: border-box;
}
.el-main {
  line-height: 30px;
}
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