<template>
  <div id="router_set"
       v-loading.fullscreen.lock="router_data.loading">
    <div class="router_top">
      <el-button type="primary"
                 class="btn_i"
                 @click="add_box">Add</el-button>
      <el-button type="primary"
                 class="btn_i"
                 @click="del_router">Delete</el-button>
      <el-button type="primary"
                 class="btn_o"
                 @click="get_data('refresh')">Refresh</el-button>
    </div>
    <div class="router_table">
      <el-table ref="multipleTable"
                class="reset_table"
                align="center"
                border
                :data="router_list.data"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                @row-click="alert_detail">
        <el-table-column type="selection"
                         width="50">
        </el-table-column>
        <el-table-column label="Item"
                         width="50"
                         show-overflow-tooltip>
          <template slot-scope="scope">
            {{(router_data.page-1)*(router_data.rows) + scope.row.index_cn}}
          </template>
        </el-table-column>
        <el-table-column prop="ip"
                         label="Destination IP"
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="net_mask"
                         label="Subnet Mask"
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="next_step"
                         label="Next Hop Address"
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="Action">
          <template slot-scope="scope">
            <el-button type="primary"
                       class="btn_edit"
                       @click.stop='edit_box(scope.row)'>Edit</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="pagination_box"
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="router_list.pageNow"
                     :page-sizes="[10,20,50,100]"
                     :page-size="10"
                     layout="total, sizes, prev, pager, next"
                     :total="router_list.count">
      </el-pagination>
    </div>
    <!-- 新增 -->
    <el-dialog class="add_box pop_box"
               :close-on-click-modal="false"
               :modal-append-to-body="false"
               :visible.sync="router_state.add">
      <img src="@/assets/images/emerge/closed.png"
           @click="closed_add_box"
           class="closed_img"
           alt="">
      <div class="title">
        <div class="mask"></div>
        <span class="title_name">Add</span>
      </div>
      <div class="content">
        <div class="content_item">
          <p>
            <span class="title">Destination IP</span>
            <span class="red_necessary">*</span>
          </p>
          <el-input class="select_box"
                    placeholder="Please enter the destination ip"
                    v-model="router_add.ip"
                    clearable>
          </el-input>
        </div>
        <div class="content_item">
          <p>
            <span class="title">Subnet Mask</span>
            <span class="red_necessary">*</span>
          </p>
          <el-input class="select_box"
                    placeholder="Please enter a subnet mask"
                    v-model="router_add.net_mask"
                    clearable>
          </el-input>
        </div>
        <div class="content_item">
          <p>
            <span class="title">Next Hop Address</span>
            <span class="red_necessary">*</span>
          </p>
          <el-input class="select_box"
                    placeholder="Please enter the next hop address"
                    v-model="router_add.next_step"
                    clearable>
          </el-input>
        </div>
      </div>
      <div class="btn_box">
        <el-button @click="closed_add_box"
                   class="cancel_btn">Cancel</el-button>
        <el-button class="ok_btn"
                   @click="add_router">Confirm</el-button>
      </div>
    </el-dialog>
    <!-- 编辑 -->
    <el-dialog class="add_box pop_box"
               :close-on-click-modal="false"
               :modal-append-to-body="false"
               :visible.sync="router_state.edit">
      <img src="@/assets/images/emerge/closed.png"
           @click="closed_edit_box"
           class="closed_img"
           alt="">
      <div class="title">
        <div class="mask"></div>
        <span class="title_name">Edit</span>
      </div>
      <div class="content">
        <div class="content_item">
          <p>
            <span class="title">Destination IP</span>
            <span class="red_necessary">*</span>
          </p>
          <el-input class="select_box"
                    placeholder="Please enter the destination ip"
                    v-model="router_edit.ip"
                    clearable>
          </el-input>
        </div>
        <div class="content_item">
          <p>
            <span class="title">Subnet Mask</span>
            <span class="red_necessary">*</span>
          </p>
          <el-input class="select_box"
                    placeholder="Please enter a subnet mask"
                    v-model="router_edit.net_mask"
                    clearable>
          </el-input>
        </div>
        <div class="content_item">
          <p>
            <span class="title">Next Hop Address</span>
            <span class="red_necessary">*</span>
          </p>
          <el-input class="select_box"
                    placeholder="Please enter the next hop address"
                    v-model="router_edit.next_step"
                    clearable>
          </el-input>
        </div>
      </div>
      <div class="btn_box">
        <el-button @click="closed_edit_box"
                   class="cancel_btn">Cancel</el-button>
        <el-button class="ok_btn"
                   @click="edit_router">Confirm</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script type="text/ecmascript-6">
import { eventBus } from '@/components/common/eventBus.js';
export default {
  name: "router_set",
  data () {
    return {
      router_data: {
        page: 1,
        rows: 10,
        loading: false
      },
      router_list: {},
      router_state: {
        add: false,
        edit: false,
        import: false
      },
      router_add: {
        ip: "",
        net_mask: "",
        next_step: ""
      },
      router_edit: {
        id: '',
        ip: "",
        net_mask: "",
        next_step: ""
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
    this.check_passwd();
    this.get_data();
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
    get_data (name) {
      this.router_data.loading = true
      this.$axios.get('/yiiapi/seting/route-list', {
        params: {
          page: this.router_data.page,
          rows: this.router_data.rows,
        }
      })
        .then(response => {
          console.log(response);
          this.router_data.loading = false
          this.router_list = response.data.data
          this.router_list.data.forEach((item, index) => {
            item.index_cn = index + 1
          });
          if (name == "refresh") {
            this.$message(
              {
                message: 'Refreshed successfully',
                type: 'success',
              }
            );
          }
        })
        .catch(error => {
          console.log(error);
        })
    },

    // 添加
    add_box () {
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
          } else {
            this.router_state.add = true;
            this.router_add.ip = '';
            this.router_add.net_mask = '';
            this.router_add.next_step = '';
          }
        })
    },
    add_router () {
      this.$axios.post('/yiiapi/seting/route-add', {
        ip: this.router_add.ip,
        net_mask: this.router_add.net_mask,
        next_step: this.router_add.next_step
      })
        .then(response => {
          console.log(response);
          if (response.data.status == 1) {
            this.$message(
              {
                message: response.data.msg,
                type: 'error',
              }
            );
          } else if (response.data.status == 0) {
            this.get_data();
            this.router_state.add = false;
            this.$message(
              {
                message: 'Route added successfully',
                type: 'success',
              }
            );
          }
        })
        .catch(error => {
          console.log(error);
        })
    },
    edit_box (row) {
      this.router_state.edit = true;
      console.log(row);
      var edit_str = JSON.stringify(row)
      var edit_obj = JSON.parse(edit_str)
      this.router_edit.ip = edit_obj.ip
      this.router_edit.id = edit_obj.id
      this.router_edit.net_mask = edit_obj.net_mask
      this.router_edit.next_step = edit_obj.next_step
    },
    // 编辑
    edit_router () {
      this.$axios.put('/yiiapi//seting/route-edit', {
        id: this.router_edit.id,
        ip: this.router_edit.ip,
        net_mask: this.router_edit.net_mask,
        next_step: this.router_edit.next_step
      })
        .then(response => {
          if (response.data.status == 0) {
            this.router_state.edit = false;
            this.get_data();
            this.$message({
              message: 'Route updated successfully',
              type: 'success'
            });
          } else {
            this.$message(
              {
                message: response.data.msg,
                type: 'error',
              }
            );
          }
        })
        .catch(error => {
          console.log(error);
        })

    },
    // 删除
    del_router () {
      console.log(this.select_list);
      if (this.select_list.length == 0) {
        this.$message(
          {
            message: 'Please select the route to delete',
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
        this.$axios.delete('/yiiapi/seting/del', {
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


    alert_detail () { },

    handleSelectionChange () { },
    // 分页
    handleSizeChange (val) {
      this.router_data.rows = val;
      this.router_data.page = 1
      this.get_data();
    },
    handleCurrentChange (val) {
      this.router_data.page = val
      this.get_data();
    },
    // 全选择
    handleSelectionChange (val) {
      this.select_list = val
    },

    closed_add_box () {
      this.router_state.add = false;
    },
    closed_edit_box () {
      this.router_state.edit = false;
    }
  }
};
</script>
<style lang='less'>
@import '../../../../assets/css/less/reset_css/reset_table.less';
@import '../../../../assets/css/less/reset_css/reset_pop.less';
#router_set {
  .el-dialog {
    width: 440px !important;
    .el-dialog__body {
      width: 440px;
      .content {
        padding: 24px 0;
        .content_item {
          margin-bottom: 24px;
          .title {
            font-size: 12px;
            color: #999999;
          }
          .select_box {
            width: 100%;
            height: 38px;
            margin-top: 6px;
            .el-input__inner {
              background: #f8f8f8;
              border: 0;
            }
          }
        }
      }
    }
  }
}
</style>

<style scoped lang="less">
#router_set {
  padding-right: 24px;
  .router_top {
    .btn_i {
      padding: 0;
      background: #0070ff;
      color: #fff;
      width: 148px;
      height: 42px;
    }

    .btn_o {
      padding: 0;
      background: #fff;
      border-color: #0070ff;
      color: #0070ff;
      width: 148px;
      height: 42px;
    }
  }
  .router_table {
    margin-top: 24px;
    .btn_edit {
      padding: 0;
      background: #5389e0;
      border-radius: 2px;
      width: 72px;
      height: 30px;
    }
    .pagination_box {
      margin-top: 24px;
      text-align: center;
    }
  }
}
</style>
