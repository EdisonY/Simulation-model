<template>
    <div class="cctv marshalling">
        <el-button type="success" size="small" class="newGroup" @click="showEdit()">新增集群</el-button>
        <el-table
            :data="tableData"
            border
            style="width: 100%">
            <el-table-column
            prop="name"
            align="center"
            label="集群名称">
            </el-table-column>
            <el-table-column
                prop="id"
                align="center"
                label="线路ID">
                <template slot-scope="scope">
                    <el-tag v-for="item in scope.row.id">{{item}} 号线</el-tag>
                </template>
            </el-table-column>
            <el-table-column
            align="center"
            label="操作">
                <template slot-scope="scope">
                    <el-button type="warning" size="small" @click="showEdit()">编辑</el-button>
                    <el-button type="danger" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog
            class="groupDia"
            title="集群编组"
            :visible.sync="dialogVisible"
            width="40%"
            :modal-append-to-body="false"
            :before-close="handleClose">
            <ul>
                <li>
                    <strong>集群名称</strong>
                    <div class="mainDiv">
                        <el-input v-model="input" placeholder="请输入内容" class="shortInput"></el-input>
                    </div>
                </li>
                <br />
                <li>
                    <strong>线路ID</strong>
                    <div class="mainDiv">
                        <el-transfer v-model="value1" :data="data" :titles="['全部', '已选定']"></el-transfer>
                    </div>
                </li>
            </ul>

            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false" size="small">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false" size="small">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>


export default {
    name: 'index',
    components:{
    },
    data () {
        const generateData = _ => {
            const data = [];
            for (let i = 1; i <= 15; i++) {
                data.push({
                    key: i,
                    label: `${ i } 号线`
                });
            }
            return data;
        };
        return {
            data: generateData(),
            value1: [1, 4],
            input:'',
            dialogVisible:false,
            value: '',
            tableData: [{
                name: '集群1',
                id:[1,4,5,6],
            },{
                name: '集群2',
                id:[1,4,5,6],
            },{
                name: '集群3',
                id:[1,4,5,6],
            },{
                name: '集群4',
                id:[1,4,5,6],
            },{
                name: '集群5',
                id:[1,4,5,6],
            },]
        }
    },
    created () {
        
    },
    computed: {
        
    },
    mounted(){
        
    },
    methods:{
         showEdit(){
             this.dialogVisible = true
         }
    },
    destroyed() {
    }
}
</script>

<style>
.cctv{height:calc(100vh - 60px);padding: 20px;}
.cctv h1{margin: 0;padding-bottom: 20px;}
.cctv .newGroup{float: right;margin-bottom: 20px;}
.cctv .search{margin-bottom: 20px;}
.cctv .el-tag{margin: 0 2px;}
.cctv .table{height: calc(100vh - 200px);}
.groupDia ul{padding-bottom: 20px;width: 100%;float: left;}
.groupDia ul li{padding-bottom: 10px;width: 100%;min-height: 32px;box-sizing: content-box;}
.groupDia ul li strong{float: left;line-height: 32px;margin-right: 10px;width: 80px;text-align: right;font-weight: bold;}
.groupDia ul li .mainDiv{float: left;width: 600px;}
.groupDia ul li .mainDiv .shortInput{width: 300px;}
.cctv .el-table__header-wrapper .cell{font-weight: bold;color: #555;}
</style>