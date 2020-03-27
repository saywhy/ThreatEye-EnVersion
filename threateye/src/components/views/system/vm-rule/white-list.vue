<template>
  <div id="white_list"
       v-loading.fullscreen.lock="loading">
    <div class="btn_box">
      <el-button class="btn_i"
                 @click="open_add_box">Add</el-button>
      <el-button class="btn_i"
                 @click="download">Template</el-button>
      <el-upload class="upload-demo"
                 style="display: inline-block;"
                 action="/yiiapi/whitelist/add-import"
                 :on-preview="handlePreview"
                 :on-remove="handleRemove"
                 :before-remove="beforeRemove"
                 :show-file-list='false'
                 :before-upload="onBeforeUpload"
                 :on-change="onChange"
                 multiple
                 :auto-upload='true'
                 :on-success='onsuccess'
                 :on-error='onerror'
                 :on-exceed="handleExceed"
                 :file-list="fileList">
        <el-button class="btn_o"
                   type="primary">Import</el-button>
      </el-upload>
      <el-button class="btn_o"
                 @click="del_white">Delete</el-button>
    </div>
    <div class="user_table">
      <el-table ref="multipleTable"
                class="reset_table"
                align="center"
                :data="white_list.data"
                tooltip-effect="dark"
                @selection-change="handleSelectionChange"
                style="width: 100%">
        <el-table-column type="selection"
                         width="50">
        </el-table-column>
        <el-table-column label="Item"
                         width="80">
          <template slot-scope="scope">
            {{(white_data.page-1)*(white_data.rows) + scope.row.index_cn}}
          </template>
        </el-table-column>
        <el-table-column prop="indicator"
                         label="Indicators"
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="alert_type"
                         label="Type"
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="create_time"
                         label='Created'
                         show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <el-pagination class="pagination_box"
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="white_list.pageNow"
                     :page-sizes="[10,20,50,100]"
                     :page-size="10"
                     layout="total, sizes, prev, pager, next"
                     :total="white_list.count">
      </el-pagination>
    </div>
    <!-- 添加白名单 -->
    <el-dialog class="add_box pop_box"
               :close-on-click-modal="false"
               :modal-append-to-body="false"
               :visible.sync="white_add.add">
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
            <span class="title">Indicators</span>
            <span class="red_necessary">*</span>
          </p>
          <el-input class="select_box"
                    placeholder="Please enter indicators"
                    v-model="white_add.indicator"
                    clearable>
          </el-input>
        </div>
        <div class="content_item">
          <p>
            <span class="title">Type</span>
            <span class="red_necessary">*</span>
          </p>
          <el-select class="select_box"
                     v-model="white_add.type"
                     placeholder="Please select the type">
            <el-option v-for="item in white_add.type_list"
                       :key="item"
                       :label="item"
                       :value="item">
            </el-option>
          </el-select>
        </div>

      </div>
      <div class="btn_box">
        <el-button @click="closed_add_box"
                   class="cancel_btn">Cancel</el-button>
        <el-button class="ok_btn"
                   @click="add_white">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "white_list",
  data () {
    return {
      loading: false,
      white_list: {},
      white_data: {
        page: 1,
        rows: 10,
      },
      white_add: {
        add: false,
        type_list: ["MD5", "IP", "URL", 'Indicator'],
        indicator: '',
        type: 'MD5'
      },
      fileList: [],
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
    this.get_data();
  },
  methods: {
    get_data () {
      this.loading = true;
      this.$axios.get('/yiiapi/whitelist/list', {
        params: {
          page: this.white_data.page,
          rows: this.white_data.rows
        }
      })
        .then(response => {
          this.loading = false;
          this.white_list = response.data.data
          this.white_list.data.forEach((item, index) => {
            item.index_cn = index + 1
          });
        })
        .catch(error => {
          console.log(error);
        })
    },
    open_add_box () {
      this.white_add.add = true;
      this.white_add.indicator = '';
      this.white_add.type = 'MD5';
    },
    // 添加
    add_white () {
      console.log(this.white_add);
      if (this.white_add.indicator == '') {
        this.$message(
          {
            message: 'Please enter indicators',
            type: 'warning',
          }
        );
        return false
      }
      this.$axios.post('/yiiapi/whitelist/add', {
        indicator: this.white_add.indicator,
        alert_type: this.white_add.type
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
            this.$message(
              {
                message: 'Added successfully',
                type: 'success',
              }
            );
            this.white_add.add = false;
          }
        })
        .catch(error => {
          console.log(error);
        })
    },
    closed_add_box () {
      this.white_add.add = false;
    },
    // 分页
    handleSizeChange (val) {
      this.white_data.rows = val;
      this.white_data.page = 1
      this.get_data();
    },
    handleCurrentChange (val) {
      this.white_data.page = val
      this.get_data();
    },
    // 下载模板
    download () {
      var url2 = "/yiiapi/whitelist/download-ioc-template";
      window.location.href = url2;
    },
    // 批量上传
    handlePreview () { },
    handleRemove () { },
    beforeRemove () { },
    onBeforeUpload () { },
    onChange (params) {
      console.log(params);
      if (params.status == 'fail') {
        this.$message(
          {
            message: 'Upload failure',
            type: 'error',
          }
        );
      }
    },
    onsuccess (params) {
      console.log(params);
      if (params.status == 1) {
        this.$message(
          {
            message: params.msg,
            type: 'error',
          }
        );
      } else if (params.status == 0) {
        this.get_data();
        this.$message(
          {
            message: 'Uploaded successfully',
            type: 'success',
          }
        );
      }
    },
    onerror (params) {
      console.log(params);
      if (params.status == 'fail') {
        this.$message(
          {
            message: 'Upload failure',
            type: 'error',
          }
        );
      }

    },
    handleExceed () { },
    handleSelectionChange (val) {
      console.log(val);
      this.select_list = val
    },
    del_white () {
      console.log(this.select_list);
      if (this.select_list.length == 0) {
        this.$message(
          {
            message: 'Please select the whitelist to delete',
            type: 'warning',
          }
        );
        return false
      }
      this.$confirm('This operation deletes the item. Do you want to continue?', 'Message', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        var id_list = []
        this.select_list.forEach(element => {
          id_list.push(element.id)
        });
        this.$axios.delete('/yiiapi/whitelist/del', {
          data: {
            id: id_list
          }
        })
          .then(response => {
            console.log(response.data);
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

  }
};
</script>

<style lang="less">
#white_list {
  padding-right: 24px;
  .btn_box {
    .btn_i {
      width: 148px;
      height: 42px;
      background: #0070ff;
      color: #fff;
      margin: 0;
      padding: 0;
    }
    .btn_o {
      width: 148px;
      height: 42px;
      background: #fff;
      border: 1px solid #0070ff;
      color: #0070ff;
      margin: 0;
      padding: 0;
      margin-left: 2px;
    }
    margin-bottom: 24px;
  }
}
</style>
<style lang='less'>
@import '../../../../assets/css/less/reset_css/reset_table.less';
@import '../../../../assets/css/less/reset_css/reset_pop.less';
#white_list {
  .add_box {
    .el-dialog {
      width: 440px;
      .content_item {
        margin-top: 24px;
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
      .btn_box {
        margin: 0;
        margin-top: 24px;
      }
    }
  }
}
</style>
