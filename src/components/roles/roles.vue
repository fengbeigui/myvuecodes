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
              <el-tag>{{items.authName}}</el-tag>
              &gt;
            </el-col>
            <!-- 这是另一个小盒子 -->
            <el-col :span="18">
              <!--  小盒子里面的小盒子 -->
              <!-- 里面再循环items的children -->
              <el-row v-for="item2 in items.children" :key="item2.id" closable>
                <!--小盒子里面的小盒子分为两块 -->
                <el-col :span="6">
                  <!-- el-tag标签的样式 -->
                  <el-tag type="success">{{item2.authName}}</el-tag>
                  &gt;
                </el-col>
                <!-- 三级标签 直接横着显示一行,写在el-tag-->
                <el-col :span="18">
                     <!-- (item2,key3)循环三的时候是把二的值传过来 -->
                  <el-tag                
                  @close="deleteTag(item2,key3)"
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
          <el-button type="info" size="mini" icon="el-icon-check" round></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
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
    //删除角色权限标签
    deleteTag(item,key){
    //数组使用引用传递，直接删除父级数组中的第几个就会影响到全局所有数组
    item.children.splice(key,1);
    },
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