<template>
  <div>
    <!-- 添加按钮 -->
    <el-button type="primary">主要按钮</el-button>
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
          <el-button type="success" size="mini" icon="el-icon-delete" round></el-button>
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
        <el-button type="primary" @click="rightsShow = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
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
.el-button {
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