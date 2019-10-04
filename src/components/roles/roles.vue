<template>
  <div>
    <!-- 添加按钮 -->
    <el-button class="RoleButton" @click="rolesisShow" type="primary">添加角色</el-button>
    <!--  :data 整个表格中所有数据的数据源 -->
    <el-table :data="roleLists" style="width: 100%">
      <!-- 折叠数据 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- el-row是一个大盒子 -->
          <!-- 在el-row里面遍历 -->
          <el-row v-for="items in scope.row.children" :key="items.id" closable>
            <!--   el-col是两个小盒子 -->
            <el-col :span="6">
              <!--  el-tag直接放数据 -->
              <el-tag>{{items.authName}}</el-tag>&gt;
            </el-col>
            <!-- 这是另一个小盒子 -->
            <el-col :span="18">
              <!--  小盒子里面的小盒子 -->
              <!-- 里面再循环items的children -->
              <el-row v-for="item2 in items.children" :key="item2.id" closable>
                <!--小盒子里面的小盒子分为两块 -->
                <el-col :span="6">
                  <!-- el-tag标签的样式 -->
                  <el-tag type="success">{{item2.authName}}</el-tag>&gt;
                </el-col>
                <!-- 三级标签 直接横着显示一行,写在el-tag-->
                <el-col :span="18">
                  <!-- (item2,key3)循环三的时候是把二的值传过来 -->
                  <!-- item2,key3,scope.row.id,item3.id传过来 -->
                  <!-- scope.row.id拿到角色id -->
                  <!--  权限的ID，item3.id -->
                  <el-tag
                    @close="deleteTag(item2,key3,scope.row.id,item3.id)"
                    v-for="(item3,key3) in item2.children"
                    :key="item3.id"
                    closable
                    type="warning"
                  >{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <!-- 表头信息 -->
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作" prop="desc">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" round></el-button>
          <el-button
            @click="roleDelete(scope.row.id)"
            type="success"
            size="mini"
            icon="el-icon-delete"
            round
          ></el-button>
          <el-button
            @click="rightsisShow(scope.row)"
            type="info"
            size="mini"
            icon="el-icon-check"
            round
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="分配权限" :visible.sync="rightsShow">
      <!-- default-expand-all默认全展开节点 -->
      <!-- 是否设置节点为可选节点show-checkbox -->
      <!--  node-key="id"本节点的唯一id -->
      <!-- 设置展示节点 :props="defaultProps" -->

      <el-tree
        ref="tree"
        default-expand-all
        :data="rightsData"
        show-checkbox
        node-key="id"
        :default-expanded-keys="[2, 3]"
        :default-checked-keys="checkedArr"
        :props="defaultProps"
      ></el-tree>

      <div slot="footer" class="dialog-footer">
        <el-button @click="rightsShow = false">取 消</el-button>
        <el-button type="primary" @click="rightsEditPost">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加角色窗口面板 -->
    <el-dialog title="添加角色" :visible.sync="addRolesShow">
      <!--  使用双向数据绑定 操作表单数据 -->
      <el-form :model="addRolesData">
        <el-form-item label="角色名称" label-width="200px" prop="username">
          <el-input v-model="addRolesData.roleName" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="角色描述" label-width="200px" prop="username">
          <el-input v-model="addRolesData.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!-- 关闭窗口 -->
        <el-button @click="addRolesShow = false">取 消</el-button>
        <!--  绑定确定事件，发送数据到服务器入库 -->
        <el-button type="primary" @click="addRolsePost ">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //添加角色
      addRolesShow: false,
      addRolesData: {
        roleName: "",
        roleDesc: ""
      },
      //存起来的角色id
      roleId: 0,
      //所有选中权限的数组集;
      checkedArr: [],
      //权限数据
      rightsData: [],
      //设置展示节点内容
      defaultProps: {
        children: "children", //设置子元素是数据中的children属性
        label: "authName" //设置节点名称为数据中的authName
      },
      //分配权限面板的控制
      rightsShow: false,

      //表格中展示的数据
      roleLists: []
    };
  },
  methods: {
    //删除角色事件：
    roleDelete(roleId) {
      //roleId获取id,可任意定义的名字
      //console.log(roleId);
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //如果点击确定按钮，证明确定要执行删除操作
          //请求接口
          this.$myHttp({
            url: "roles/" + roleId,
            method: "delete"
          }).then(back => {
            let { data, meta } = back.data;
            //console.log(data,meta);
            if (meta.status == 200) {
              this.$message({
                type: "success",
                message: "删除角色成功!"
              });
              //获取数据，重新渲染页面
              this.getRoleLists();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消角色删除"
          });
        });
    },
    //展示添加角色弹窗
    rolesisShow() {
      this.addRolesShow = true;
    },
    //添加角色确定按钮
    addRolsePost() {
      this.$myHttp({
        url: "roles",
        method: "post",
        data: this.addRolesData
      }).then(back => {
        let { data, meta } = back.data;
        //console.log(data,meta);
        if (meta.status == 201) {
          this.$message({ message: meta.msg, type: "success" });
          this.addRolesShow = false; //关闭窗口
          this.getRoleLists(); //重新加载数据
        }
      });
    },
    //给他定义一个方法
    //获取所有信息
    getRoleLists() {
      this.$myHttp({
        url: "roles",
        method: "get"
      }).then(back => {
        let { data, meta } = back.data;
        // console.log(data,meta);
        if (meta.status == 200) {
          this.roleLists = data;
        }
      });
    },
    //删除角色权限标签，
    //上面定义item2,key3,scope.row.id,item3.id后可以把item,key,roleId,rightId拿到
    deleteTag(item, key, roleId, rightId) {
      //需要角色id和权限id
      this.$myHttp({
        //拼接URL
        url: `roles/${roleId}/rights/${rightId}`,
        method: "delete"
      }).then(back => {
        let { data, meta } = back.data;
        //console.log(data,meta);
        //判断是否成功
        if (meta.status == 200) {
          this.$message({ message: meta.msg, type: "success" });
          //数组使用引用传递，直接删除父级数组中的第几个就会影响到全局所有数组
          item.children.splice(key, 1); //删除页面展示权限
        }
      });
    },
    //控制权限面板的显示
    rightsisShow(row) {
      //当获取面板的时候，把id存起来
      this.roleId = row.id;
      //所有权限row
      //获取本角色拥有的所有数据，数据中有权限
      //console.log(row);
      //row.children.children.children.id
      //为了防止其他数据的影响，每次获取权限都要先清空以前的权限数据
      this.checkedArr = [];
      //角色数据中的children就是这个角色所拥有的所有权限
      var arr = row.children;
      arr.forEach(items => {
        items.children.forEach(item2 => {
          item2.children.forEach(item3 => {
            //因为elUI中只要有一个第三级权限被选中，父级也会被半选中
            //所以，我们只需要获取第三季权限，父级及爷爷级权限都会被选中
            this.checkedArr.push(item3.id);
          });
        });
      });

      //获取所有权限
      this.$myHttp({
        //url:`rights/list`
        //获取树状结构的数据更为合适
        url: `rights/tree`,
        method: "get"
      }).then(back => {
        let { data, meta } = back.data;
        //console.log(data);
        if (meta.status == 200) {
          //将获取到的所有权限数据，以树状结构展示到页面中
          this.rightsData = data;
        }
      });
      this.rightsShow = true;
    },

    //修改角色权限的事件
    rightsEditPost() {
      //getCheckedKeys获取所有选中节点的key数组形式返回
      //getHalfCheckedKeys获取所有半选中节点的key数组
      // var a = this.$refs.tree.getCheckedKeys();
      // var b = this.$refs.tree.getHalfCheckedKeys();
      // var c = a.concat(b);
      // console.log(c.join());
      //合并成一句代码的方法
      var rids = this.$refs.tree
        .getCheckedKeys()
        .concat(this.$refs.tree.getHalfCheckedKeys())
        .join();

      this.$myHttp({
        //上面存有id，这里就可以这样写roleId
        url: `roles/${this.roleId}/rights`,
        method: "post",
        data: { rids }
      }).then(back => {
        let { meta } = back.data;
        console.log(meta);

        if (meta.status == 200) {
          this.$message({ message: meta.msg, type: "success" });
          //修改权限后，重新获取数据
          this.getRoleLists();
        }
      });
      this.rightsShow = false;
    }
  },
  //在页面渲染之前获取所有角色数据
  mounted() {
    //获取所有信息的方法
    this.getRoleLists();
  }
};
</script>

<style>
.RoleButton {
  float: left;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.el-main {
  line-height: 20px;
}
.el-tag {
  margin-top: 10px;
}
</style>