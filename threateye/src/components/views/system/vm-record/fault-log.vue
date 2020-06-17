<template>
  <div id="fault_log"
       v-loading.fullscreen.lock="loading">
    <div class="fault_top">
      <el-button class="btn_i"
                 @click="faultlog_testing">Fault Detection</el-button>
      <el-button class="btn_i"
                 @click="faultlog_download">Download</el-button>
      <el-button class="btn_o"
                 @click="faultlog_del">Delete</el-button>
    </div>
    <div class="fault_table">
      <el-table ref="multipleTable"
                class="reset_table"
                align="center"
                border
                :data="fault_list.data"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                @row-click="alert_detail">
        <el-table-column type="selection"
                         width="50">
        </el-table-column>
        <el-table-column label="Time"
                         show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.time*1000 |formatDate }}</template>
        </el-table-column>
        <el-table-column prop="file"
                         label="Log Name"
                         show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <el-pagination class="pagination_box"
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="fault_list.pageNow"
                     :page-sizes="[10,20,50,100]"
                     :page-size="10"
                     layout="total, sizes, prev, pager, next"
                     :total="fault_list.count">
      </el-pagination>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import moment from 'moment'
import { eventBus } from '@/components/common/eventBus.js';
export default {
  name: "fault_log",
  data () {
    return {
      loading: false,
      fault_list: {},
      fault_data: {
        page: 1,
        rows: 10
      },
      select_list: []
    };
  },
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  },
  mounted () {
    this.check_passwd()
    this.get_data()
  },

  methods: {
    // 测试密码过期
    check_passwd () {
      this.$axios.get('/yiiapi/site/check-passwd-reset')
        .then((resp) => {
          let {
            status,
            msg,
            data
          } = resp.data;
          if (status == '602') {
            this.$message(
              {
                message: msg,
                type: 'warning',
              }
            );
            eventBus.$emit('reset')
          }
        })
    },
    // 获取列表
    get_data () {
      this.loading = true
      this.$axios.get('/yiiapi/faultlog/list', {
        params: {
          page: this.fault_data.page,
          rows: this.fault_data.rows
        }
      })
        .then(response => {
          console.log(response);
          this.loading = false
          this.fault_list = response.data.data
        })
        .catch(error => {
          console.log(error);
        })
    },
    // 故障检测
    faultlog_testing () {
      this.loading = true
      this.$axios.get('/yiiapi/faultlog/testing')
        .then(response => {
          console.log(response);
          this.loading = false
          if (response.data.status == 0) {
            this.get_data()
            this.$message({
              type: 'success',
              message: 'Detection success'
            });
          } else {
            this.$message({
              type: 'error',
              message: response.data.msg
            });
          }
        })
        .catch(error => {
          console.log(error);
        })
    },
    // 下载
    faultlog_download () {
      console.log(this.select_list);
      if (this.select_list.length == 0) {
        this.$message(
          {
            message: 'Please select the troubleshooting log to download',
            type: 'warning',
          }
        );
        return false
      }
      this.$confirm('This action download the item. Do you want to continue?', 'Message', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.$axios.get('/yiiapi/site/check-auth-exist', {
          params: {
            pathInfo: 'yararule/download',
          }
        })
          .then(response => {
            var id_list = []
            this.select_list.forEach(element => {
              id_list.push(element.id)
            });
            this.select_list = []
            this.$refs.multipleTable.clearSelection()
            console.log(id_list);
            var id_list_str = JSON.stringify(id_list)
            var url2 = "/yiiapi/faultlog/download?id=" + id_list_str;
            window.location.href = url2;
          })
          .catch(error => {
            console.log(error);
          })
      }).catch(() => {
        this.select_list = []
        this.$message({
          type: 'info',
          message: 'Download cancelled'
        });
      });
    },
    // 删除
    faultlog_del () {
      if (this.select_list.length == 0) {
        this.$message(
          {
            message: 'Please select the troubleshooting log to delete',
            type: 'warning',
          }
        );
        return false
      }
      this.$confirm('This action deletes the item. Do you want to continue?', 'Message', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        var id_list = []
        this.select_list.forEach(element => {
          id_list.push(element.id)
        });
        console.log(id_list);
        this.$axios.delete('/yiiapi/faultlog/del', {
          data: {
            id: id_list
          }
        })
          .then(response => {
            console.log(response);
            if (response.data.status == 0) {
              this.get_data();
              this.$message(
                {
                  message: 'Deleted successfully',
                  type: 'success',
                }
              );
            } else {
              this.$message(
                {
                  message: 'Delete Failure',
                  type: 'error',
                }
              );
            }
          })
          .catch(error => {
            console.log(error);
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Delete Cancelled'
        });
      });
    },
    // / faultlog / list
    // 分页
    handleSizeChange (val) {
      this.fault_data.rows = val;
      this.fault_data.page = 1
      this.get_data();
    },
    handleCurrentChange (val) {
      this.fault_data.page = val
      this.get_data();
    },
    // 全选择
    handleSelectionChange (val) {
      this.select_list = val
    },
    add_box () {
    },
    edit_box () {
    },
    alert_detail () { },
    closed_add_box () {
    },
    closed_edit_box () {
    }
  },
  filters: {
    formatDate: function (value) {
      return moment(value).format('YYYY-MM-DD HH:mm:ss')
    }
  },
};
</script>

<style scoped lang="less">
#fault_log {
  text-align: left;
  .fault_top {
    margin-bottom: 24px;
    .btn_i {
      width: 148px;
      height: 42px;
      color: #fff;
      background: #0070ff;
    }
    .btn_o {
      width: 148px;
      height: 42px;
      color: #0070ff;
      border-color: #0070ff;
      background: #fff;
    }
  }
  .fault_table {
    padding-right: 24px;
  }
  .pagination_box {
    text-align: center;
    margin-top: 20px;
  }
}
</style>
<style lang='less'>
@import '../../../../assets/css/less/reset_css/reset_table.less';
@import '../../../../assets/css/less/reset_css/reset_pop.less';
#fault_log {
}
</style>