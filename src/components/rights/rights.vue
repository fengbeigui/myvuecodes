<template>
  <el-table
    ref="singleTable"
    :data="tableData"
    highlight-current-row
    
    style="width: 100%"
  >
    <el-table-column type="index" width="50"></el-table-column>
    <el-table-column property="authName" label="权限名称" width="220"></el-table-column>
    <el-table-column property="path" label="路径" width="150"></el-table-column>
    <el-table-column property="level" label="层级">
        <template slot-scope="scope">
            <span v-if="scope.row.level == 0">一级</span>
            <span v-if="scope.row.level == 1">二级</span>
            <span v-if="scope.row.level == 2">三级</span>
        </template>

    </el-table-column>
  </el-table>
</template>

<script>
export default {
    data(){
        return{
            //它的数据
            tableData:[],
        }
    },
    //所需从data中 写一个methods
    methods:{
        //然后给他来一个名字getRightsList来获取list
        //getRightsList这个方法拿数据
        getRightsList(){
            this.$myHttp({
                url:'rights/list',
                method:'get'
            }).then(back=>{
                //先解构一下，
                let {data,meta} = back.data;
               
                console.log(data,meta);
                 //打印显示数据后做判断
                 if(meta.status == 200){
                     this.tableData = data
                 }
                
            })
        }
    },
    //调用
    mounted(){
        this.getRightsList();
    }

};
</script>

<style>
.has-gutter{
    line-height: 15px;
}
</style>