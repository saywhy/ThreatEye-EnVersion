<template>
  <div id="sandbox"
       v-loading.fullscreen.lock="loading">
    <div class="container">
      <div class="invest_box">
        <el-tabs v-model="activeName"
                 class="reset_tab">
          <el-tab-pane label="Sandbox"
                       class="tabs-item"
                       name="first">
            <div class="top">
              <uploader :options="options"
                        :autoStart='false'
                        @file-added="onFileAdded"
                        @file-success="onFileSuccess"
                        @file-progress="onFileProgress"
                        @file-error="onFileError"
                        class="uploader-example">
                <uploader-unsupport></uploader-unsupport>
                <img class="upload_img"
                     src="@/assets/images/setting/upload_s.png"
                     alt="">
                <uploader-drop>
                  <uploader-btn class="select_btn">Upload</uploader-btn>
                  <span>Please select files to be scanned (maximum 100M)</span>
                </uploader-drop>
                <uploader-list></uploader-list>
              </uploader>
            </div>
            <div class="sandbox_table">
              <el-table ref="multipleTable"
                        class="reset_table"
                        align="center"
                        border
                        :data="sandbox_list.data"
                        tooltip-effect="dark"
                        style="width: 100%">
                <el-table-column label="Result"
                                 width='160'
                                 show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span :class="scope.row.result==0?'color_red':''">{{scope.row.result_cn}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="Created Time"
                                 width='180'
                                 show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{scope.row.created_at*1000 | formatDate}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="Scanning Status"
                                 width='150'
                                 show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{scope.row.status=='1'?'Scanning':"Scan finished"}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="upload_name"
                                 label='File Name'
                                 show-overflow-tooltip>
                </el-table-column>
                <el-table-column label='Details'
                                 width='100'>
                  <template slot-scope="scope">
                    <img src="@/assets/images/common/download.png"
                         class="img_icon"
                         v-if="scope.row.status!=1 &&scope.row.result==0"
                         alt=""
                         @click.stop='download(scope.row)'>
                  </template>
                </el-table-column>
                <el-table-column label="Action"
                                 width='100'>
                  <template slot-scope="scope">
                    <img src="@/assets/images/common/delete.png"
                         class="img_icon"
                         v-if="scope.row.status!=1"
                         alt=""
                         @click.stop='del_box(scope.row)'>
                  </template>
                </el-table-column>

              </el-table>
              <el-pagination class="pagination_box"
                             @size-change="handleSizeChange"
                             @current-change="handleCurrentChange"
                             :current-page="sandbox_list.pageNow"
                             :page-sizes="[10,20,50,100]"
                             :page-size="10"
                             layout="total, sizes, prev, pager, next"
                             :total="sandbox_list.count">
              </el-pagination>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import moment from 'moment'
import { eventBus } from '@/components/common/eventBus.js';
export default {
  name: "sandbox",
  data () {
    return {
      loading: true,
      activeName: 'first',
      options: {
        target: '/yiiapi/sandbox/upload',
        chunkSize: '10048000',   //分块大小
        testChunks: false,     //是否开启服务器分片校验
      },
      sandbox_list: {
      },
      sandbox_data: {
        page: 1,
        rows: 10
      }
    };
  },
  created () {
    this.get_version()
  },
  mounted () {
    this.get_data();
    this.check_passwd();
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
    //获取当前版本
    get_version () {
      this.$axios.get('/yiiapi/site/license-version')
        .then(response => {
          let { status, data } = response.data;
          console.log(data);
          this.loading = false;
          if (data.edition == 1) {
            this.$router.push({ path: '/401' });
          }
        })
        .catch(error => {
          console.log(error);
        })
    },
    // 上传
    onFileAdded (file) {
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
            file.ignored = true
            file.cancel()
            eventBus.$emit('reset')
          } else {
            file.pause()
            if (file.size > 100 * 1024 * 1024) {
              this.$message({
                message: 'File size cannot exceed 100 MB',
                type: 'warning'
              });
              setTimeout(() => {
                file.cancel()
              }, 100)
            } else {
              setTimeout(() => {
                file.resume();
              }, 100)
            }
          }
        })
      console.log(file);

    },
    onFileSuccess (rootFile, file, response, chunk) {
      this.$axios.get('/yiiapi/site/check-auth-exist', {
        params: {
          pathInfo: 'yararule/download',
        }
      })
        .then(response => {

        })
        .catch(error => {
          console.log(error);
        })
      if (JSON.parse(response).status == 0) {
        console.log(file);
        this.$axios.get('/yiiapi/sandbox/move-file', {
          params: {
            upload_name: file.name,
          }
        })
          .then(response => {
            let { status, data } = response.data;
            if (status == 0) {
              file.cancel()
              this.get_data();
              this.$message(
                {
                  message: 'Uploaded successfully',
                  type: 'success',
                }
              );
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
      } else if (JSON.parse(response).status == 602) {
        this.$message(
          {
            message: JSON.parse(response).msg,
            type: 'warning',
          }
        );
      } else {
        this.$message(
          {
            message: JSON.parse(response).msg,
            type: 'error',
          }
        );
      }
      console.log(chunk);
    },
    onFileProgress (file) {
      this.$axios.get('/yiiapi/site/check-auth-exist', {
        params: {
          pathInfo: 'yararule/download',
        }
      })
        .then(response => {

        })
        .catch(error => {
          console.log(error);
        })
    },
    onFileError () {
      this.$axios.get('/yiiapi/site/check-auth-exist', {
        params: {
          pathInfo: 'yararule/download',
        }
      })
        .then(response => {

        })
        .catch(error => {
          console.log(error);
        })
    },
    // 获取列表
    get_data () {
      this.$axios.get('/yiiapi/sandbox/list', {
        params: {
          page: this.sandbox_data.page,
          rows: this.sandbox_data.rows,
        }
      })
        .then(response => {
          let { status, data } = response.data;
          if (status == 0) {
            this.sandbox_list = data
            this.sandbox_list.data.forEach((item, index) => {
              switch (item.result) {
                case '0':
                  item.result_cn = 'Threat detected'
                  break;
                case '1':
                  item.result_cn = 'No threat'
                  break;
                case '2':
                  item.result_cn = ''
                  break;
                default:
                  break;
              }
            });

          }
          console.log(response);
        })
        .catch(error => {
          console.log(error);
        })
    },
    // 下载
    download (item) {
      console.log(item);
      this.$axios.get('/yiiapi/site/check-auth-exist', {
        params: {
          pathInfo: 'yararule/download',
        }
      })
        .then(response => {
          var url1 = '/yiiapi/sandbox/download-file?id=' + item.id;
          window.location.href = url1;
        })
        .catch(error => {
          console.log(error);
        })

    },
    // 删除
    del_box (item) {
      this.$confirm('This action deletes the item. Do you want to continue?', 'Message', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {

        this.$axios.delete('/yiiapi/sandbox/del', {
          data: {
            id: item.id
          }
        })
          .then(response => {
            let { status, data } = response.data;
            if (status == 0) {
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
    // 分页
    handleSizeChange (val) {
      this.sandbox_data.rows = val;
      this.sandbox_data.page = 1
      this.get_data();
    },
    handleCurrentChange (val) {
      this.sandbox_data.page = val
      this.get_data();
    },
  },
  filters: {
    formatDate: function (value) {
      return moment(value).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>

<style scoped lang="less">
#sandbox {
  padding: 16px 0 16px 16px;
  .container {
    padding: 20px 36px 20px 20px;
    background: #fff;
    border-radius: 2px;
    .top {
      background: #f8f8f8;
      // height: 160px;
      margin-bottom: 16px;
      padding: 10px 500px;
      /deep/ .uploader-example {
        width: 100%;
        margin: 0;
        padding: 0;
        border: 0;
        .uploader-drop {
          border: 0;
          background: none;
        }
        .uploader-list {
          overflow: auto;
          .uploader-file {
            height: 30px;
            line-height: 30px;
            border: 0;
            .uploader-file-icon {
              display: none;
            }
            .uploader-file-actions {
              display: none;
            }
          }
        }
      }

      .select_btn {
        border: 0;
      }
      .uploader-btn {
        border: 0;
        background: none;
        color: #0070ff;
        cursor: pointer;
      }
      .uploader-btn:hover {
        background: none;
        color: #0070ff;
        cursor: pointer;
      }
      .upload_img {
        width: 72px;
        height: 72px;
        margin-top: 35px;
      }
    }
    .color_red {
      color: #ff5f5c;
    }
    .img_icon {
      cursor: pointer;
    }
  }
}
</style>
<style lang="less">
@import '../../../assets/css/less/reset_css/reset_table.less';
@import '../../../assets/css/less/reset_css/reset_tab.less';
.uploader-file-name {
  width: 22% !important;
}
.uploader-file-size {
  width: 25% !important;
}
.uploader-file-meta {
  width: 0% !important;
}
.uploader-file-status {
  width: 50% !important;
}
</style>

