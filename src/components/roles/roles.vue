<template>
  <div>
    <!-- 添加按钮 -->
    <el-button type="primary">主要按钮</el-button>
    <!--  :data 整个表格中所有数据的数据源 -->
    <el-table :data="roleLists" style="width: 100%">
      <!-- 折叠数据 -->
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="商品名称">
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label="所属店铺">
              <span>{{ props.row.shop }}</span>
            </el-form-item>
          </el-form>
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
</style>