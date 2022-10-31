<template>
  <div class="passenger next">
    <h2>分时OD客流数据</h2>
    <!-- <div class="search">
      <el-button type="primary">客流加载</el-button>
      <p>
        <el-input placeholder="请输入内容" size="small"></el-input>
        <el-button type="success" size="small">搜索</el-button>
      </p>
    </div> -->
    <el-table :data="tableData" border style="width: 100%;margin-top:10px">
      <el-table-column type="index" width="40px" align="center">
        <template slot-scope="scope">
          <el-radio v-model="defaultRadio" :label="scope.$index"> </el-radio>
        </template>
      </el-table-column>

      <el-table-column prop="date" label="日期"> </el-table-column>
      <el-table-column prop="name" label="典型日"> </el-table-column>
      <el-table-column prop="address" label="备注"> </el-table-column>
    </el-table>
    <p class="text_r">
      <el-upload
        accept=".xls,.xlsx"
        :auto-upload="false"
        :on-change="loadFile"
        action=""
        :show-file-list="false"
      >
        <el-button
          icon="el-icon-upload2"
          slot="trigger"
          size="small"
          type="primary"
          style="margin-left: 5px; width: fit-content"
          >上传
        </el-button>
        <el-button
          size="small"
          type="success"
          icon="el-icon-download"
          @click="downLoadData"
          >下载
        </el-button>
        <el-button type="primary" size="small" @click="setCurPasFlow"
          >设置为当前客流</el-button
        >
      </el-upload>
    </p>
    <!-- <el-row>
            <el-col :span="10">
                <div class="yl">
                    <iframe frameborder="0" width="100%" height="300" src="http://172.51.216.61:8011/seabed/preview/70986fa19c404915accccfef982c9ce0"></iframe>
                </div>
            </el-col>
            <el-col :span="7">
                <div class="yl">
                    <iframe frameborder="0" width="100%" height="300" src="http://172.51.216.61:8011/seabed/preview/130263dd57a6419fb41e94a72bc14586"></iframe>
                </div>
            </el-col>
            <el-col :span="7">
                <div class="yl">
                    <iframe frameborder="0" width="100%" height="300" src="http://172.51.216.61:8011/seabed/preview/dc7cc8eeeb3b451293a227733723271e"></iframe>
                </div>
            </el-col>
        </el-row> -->
  </div>
</template>

<script>
import XLSX from "xlsx";

export default {
  name: "passenger",
  data() {
    return {
      SERVER_KEY: "//",
      defaultRadio: -1,
      tableData: [
        {
          date: "2016-05-02",
          name: "工作日",
          address: "历史使用者：张三",
        },
        {
          date: "2016-05-04",
          name: "工作日",
          address: "",
        },
        {
          date: "2016-05-01",
          name: "双休日",
          address: "历史使用者：张三",
        },
        {
          date: "2016-05-03",
          name: "节假日",
          address: "",
        },
      ],
    };
  },
  created() {},
  mounted() {},
  methods: {
    /**
     * 加载文件
     * @param {*} ev 读取的文件事件
     */
    loadFile(ev) {
      var _this = this;
      const file = ev.raw; //读取的文件
      // 判断文件是否为空，若为空则跳转不进行处理
      if (!file) return;
      const reader = new FileReader();
      // 二进制方式读取文件
      reader.readAsBinaryString(file);
      //文件处理流程
      /**
       *
       *
       *
       */
      this.$confirm(`是否上传当前客流数据：${file.name}`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "success",
      }).then(() => {
        this.$message({
          type: "success",
          message: "上传成功",
        });
        _this.tableData.push({
          date: _this.Getdate(),
          name: file.name.replace(".xls", ""),
          address: "",
        });
      });
    },
    /**
     * 下载客流数据
     */
    downLoadData() {
      if (this.defaultRadio == -1) {
        this.$message({ type: "warning", message: "请选择客流数据" });
        return;
      } else {
        const wb = XLSX.utils.book_new(); // 创建工作簿
        let sheetdata = [
          [`${this.tableData[this.defaultRadio].name}`],
          [
            "车站(O\D)",
            "北京西站",
            "湾子",
            "达官营",
            "广安门内",
            "菜市口",
            "虎坊桥",
            "珠市口",
            "桥湾",
            "磁器口",
            "广渠门内",
            "广渠门外",
            "双井",
            "九龙山",
            "大郊亭",
          ],
        ];
        XLSX.utils.book_append_sheet(wb, sheetdata, "客流数据数据");
        XLSX.writeFile(wb, `${this.tableData[this.defaultRadio].name}.xlsx`);
      }
    },

    /**
     * 设置当前客流
     */
    setCurPasFlow() {
      if (this.defaultRadio == -1) {
        this.$message({ type: "warning", message: "请选择客流数据" });
        return;
      } else {
        this.$message({
          type: "success",
          message: "设置成功",
        });
      }
    },
    /**
     * 获得当前时间y-m-d
     * @returns {String} y-m-d
     */
    Getdate() {
      var time = new Date();
      var y = time.getFullYear().toString().padStart(2, 0); // 年
      var m = (time.getMonth() + 1).toString().padStart(2, 0);
      var d = time.getDate().toString().padStart(2, 0);
      // var hh = time.getHours().toString().padStart(2, 0)
      // var mm = time.getUTCMinutes().toString().padStart(2, 0)
      // var ss = time.getSeconds().toString().padStart(2, 0)
      return `${y}-${m}-${d}`;
    },
    /**
     * FTP测试
     */
    FTPTest() {
  
      // const ftp = new jsftp({
      //   host: "localhost",
      //   port: 8080, // defaults to 21
      //   user: "LYF", // defaults to "anonymous"
      //   pass: "1234qwer", // defaults to "@anonymous"
      // });
      // console.log(ftp);
      // ftp.ls('.',(err,res)=>{
      //   res.forEach(element => {
      //     console.log(element.name) 
      //   });
      // })
    },
  },
};
</script>
<style scoped>
.passenger {
  padding: 10px;
}
.passenger .el-col {
  background: #eee;
}
.passenger h2 {
  font-size: 20px;
}
.passenger .search {
  padding: 15px 0;
  height: 40px;
  box-sizing: content-box;
}
.passenger .search p {
  float: right;
}
.passenger .search p .el-input {
  display: inline-block;
  width: auto;
}
.passenger .text_r {
  padding: 15px 0;
  text-align: right;
}
</style>
