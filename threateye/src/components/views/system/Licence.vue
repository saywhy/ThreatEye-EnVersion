<template>
  <div id="system_control_licence"
       v-loading.fullscreen.lock="loading"
       class="container">
    <div class="content_box">
      <p class="title">System Version:
        <span>{{license_version}}</span>
      </p>
      <el-button class="btn_i"
                 @click="online_active_pop">Activate</el-button>
      <el-upload class="upload-demo"
                 style="display: inline-block;"
                 :http-request="uploadSectionFile"
                 action="sdsdsdsa"
                 accept=".key"
                 :on-preview="handlePreview"
                 :on-remove="handleRemove"
                 :before-remove="beforeRemove"
                 :show-file-list='false'
                 :before-upload="onBeforeUpload"
                 :on-change="onChange"
                 :data='file_data'
                 :auto-upload='true'
                 :on-success='onsuccess'
                 :on-exceed="handleExceed"
                 :file-list="fileList"
                 :multiple="false">
        <el-button class="btn_o"
                   type="primary">Import</el-button>
      </el-upload>
      <div class="licence_table">
        <el-table ref="multipleTable"
                  class="reset_table"
                  align="center"
                  border
                  :data="license_list.list"
                  tooltip-effect="dark"
                  style="width: 100%"
                  @selection-change="handleSelectionChange"
                  @row-click="alert_detail">
          <el-table-column prop="index"
                           label="Item"
                           width="60"
                           show-overflow-tooltip>
            <template slot-scope="scope">
              {{(license_data.page-1)*(license_data.rows) + scope.row.index_cn}}
            </template>
          </el-table-column>
          <el-table-column prop="SN"
                           width="300"
                           label="Serial No."
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="orgName"
                           label="Organization"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column label='Authorization Time'>
            <template slot-scope="scope"
                      show-overflow-tooltip>{{ scope.row.startTime |formatDate }}</template>
          </el-table-column>
          <el-table-column label='Expiration Time'>
            <template slot-scope="scope"
                      show-overflow-tooltip>{{ scope.row.endTime |formatDate }}</template>
          </el-table-column>
          <el-table-column prop="orgName"
                           label='Edition'
                           show-overflow-tooltip>
            <template slot-scope="scope"
                      show-overflow-tooltip>
              {{ scope.row.edition=='1'?'Enterprise Edition':'Advanced Edition'}}
            </template>
          </el-table-column>
          <el-table-column prop="status"
                           label='Status'
                           show-overflow-tooltip>
          </el-table-column>
        </el-table>
        <el-pagination class="pagination_box"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="license_list.pageNow"
                       :page-sizes="[10,20,50,100]"
                       :page-size="10"
                       layout="total, sizes, prev, pager, next"
                       :total="license_list.count">
        </el-pagination>

      </div>
      <!-- 添加licence -->
      <el-dialog class="add_box pop_box"
                 :close-on-click-modal="false"
                 :modal-append-to-body="false"
                 :visible.sync="licence_pop.add">
        <img src="@/assets/images/emerge/closed.png"
             @click="closed_add_box"
             class="closed_img"
             alt="">
        <div class="title">
          <div class="mask"></div>
          <span class="title_name">Online activation</span>
        </div>
        <div class="content">
          <div class="content_item">
            <p>
              <span class="title">Serial No.</span>
              <span class="red_necessary">*</span>
            </p>
            <el-input class="select_box"
                      placeholder="Please enter the serial number"
                      v-model="licence_pop.cdk"
                      clearable>
            </el-input>
          </div>
          <div class="content_item">
            <p>
              <span class="title">Machine code:
                <span>{{licence_pop.key }}</span>
              </span>
            </p>
          </div>
        </div>
        <div class="btn_box">
          <el-button @click="closed_add_box"
                     class="cancel_btn">Cancel</el-button>
          <el-button class="ok_btn"
                     @click="online_active">Confirm</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import moment from 'moment'
import { eventBus } from '@/components/common/eventBus.js';
export default {
  name: "system_control_licence",
  data () {
    return {
      loading: false,
      license_list: {
      },
      license_data: {
        page: 1,
        rows: 10
      },
      licence_pop: {
        add: false,
        key: '',
        cdk: ""
      },
      fileList: [],
      file_data: {
        bin: ''
      },
      uploadList: [],
      license_version: '',
    };
  },
  beforeCreate () {
    // 读取文件
    FileReader.prototype.reading = function ({ encode } = pms) {
      let bytes = new Uint8Array(this.result);    //无符号整型数组
      let text = new TextDecoder(encode || 'UTF-8').decode(bytes);
      return text;
    };
    /* 重写readAsBinaryString函数 */
    FileReader.prototype.readAsBinaryString = function (f) {
      if (!this.onload)       //如果this未重写onload函数，则创建一个公共处理方式
        this.onload = e => {  //在this.onload函数中，完成公共处理
          let rs = this.reading();
          console.log(rs);
        };
      this.readAsArrayBuffer(f);  //内部会回调this.onload方法
    };
  },
  mounted () {
    this.check_passwd();
    this.get_data();
    this.get_license();
    this.get_version();
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
    get_data () {
      this.$axios.get('/yiiapi/license/get', {
        params: {
          page: this.license_data.page,
          rows: this.license_data.rows
        }
      })
        .then(response => {
          if (response.data.status == 602) {
            return false
          }
          this.license_list = response.data.data.license
          this.licence_pop.key = response.data.data.key
          this.license_list.list.forEach((item, index) => {
            item.index_cn = index + 1
          });
        })
        .catch(error => {
          console.log(error);
        })
    },
    // 获取license版本
    get_license () {
      this.$axios.get('/yiiapi/site/version')
        .then(response => {
          let { status, data } = response.data;
          console.log(data);
          if (response.data.status == 602) {
            return false
          }
          this.license_version = data.version
        })
        .catch(error => {
          console.log(error);
        })
    },
    // 获取license版本
    get_version () {
      this.$axios.get('/yiiapi/site/license-version')
        .then(response => {
          let { status, data } = response.data;
          console.log(data);
        })
        .catch(error => {
          console.log(error);
        })
    },
    online_active_pop () {
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
            this.licence_pop.add = true;
            this.licence_pop.cdk = '';
          }
        })
    },
    closed_add_box () {
      this.licence_pop.add = false;
    },
    online_active () {
      if (this.licence_pop.cdk == '') {
        this.$message(
          {
            message: 'Please enter the serial number',
            type: 'warning',
          }
        );
        return false
      }
      this.loading = true
      this.$axios.post('/yiiapi/license/online', {
        SN: this.licence_pop.cdk,
        key: this.licence_pop.key
      })
        .then(response => {
          this.loading = false
          console.log(response);
          if (response.data.status == 'fail') {
            switch (response.data.errorMessage) {
              case 'License does not exist':
                this.$message(
                  {
                    message: 'The serial number check failed, please confirm the serial number you entered!',
                    type: 'error',
                  }
                );
                break;
              case 'Key error':
                this.$message(
                  {
                    message: 'This serial number has been used by other devices, please purchase a new license!',
                    type: 'error',
                  }
                );
                break;
              default:
                this.$message(
                  {
                    message: 'Serial number activated successfully',
                    type: 'success',
                  }
                );
                break;
            }
          } else if (response.data.status == 'success') {
            console.log(response.data.bin);
            this.$axios.post('/yiiapi/license/import', {
              bin: response.data.bin
            })
              .then(response => {
                console.log(response.data);
                if (response.data.status == 1) {
                  this.$message(
                    {
                      message: response.data.msg,
                      type: 'error',
                    }
                  );
                } else {
                  this.$store.dispatch('GetAuth').then(() => {
                    this.$message(
                      {
                        message: 'License imported successfully',
                        type: 'success',
                      }
                    );
                    //location.reload();
                    this.licence_pop.add = false;
                    this.get_data();
                  })
                }

              })
              .catch(error => {
                console.log(error);
              })
          }
        })
        .catch(error => {
          console.log(error);
        })
    },
    uploadSectionFile (params) {
      this.readData(params.file)
      setTimeout(() => {
        this.$axios.post('/yiiapi/license/import', this.file_data)
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
              this.$message(
                {
                  message: 'License imported successfully',
                  type: 'success',
                }
              );
              this.licence_pop.add = false;
              this.get_data();
            } else if (response.data.status == 602) {
              this.$message({
                type: 'warning',
                message: response.data.msg
              });
            } else {
              this.$message(
                {
                  message: response.data.message,
                  type: 'error',
                }
              );
            }

          })
          .catch(error => {
            console.log(error);
          })
      }, 100);
    },

    // 分页
    handleSizeChange (val) {
      this.license_data.rows = val;
      this.license_data.page = 1
      this.get_data();
    },
    handleCurrentChange (val) {
      this.license_data.page = val
      console.log(this.license_data);
      this.get_data();
    },


    handleSelectionChange () {

    },
    alert_detail () {

    },

    // 上传
    handleRemove (file, fileList) {
      console.log(file, fileList);
    },
    handlePreview (file) {
      console.log(file);
    },
    handleExceed (files, fileList) {
      // this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove (file, fileList) {
      // return this.$confirm(`确定移除 ${file.name}？`);
    },
    onsuccess (item) {
      console.log(item);
    },
    onBeforeUpload (file) {
      console.log(file);
      console.log(this.file_data.bin);
    },
    readData (file) {
      let fileName = file.name;
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = e => {
        this.file_data.bin = e.target.result;

        this.uploadList.push({
          name: fileName,
          data: e.target.result
        });
      };
    },
    onChange (item, file) {
    }
  },
  filters: {
    formatDate: function (value) {
      return moment(value).format('YYYY-MM-DD HH:mm:ss')
    }
  },
}
</script>
<style scoped lang='less'>
@import '../../../assets/css/less/system/setting/common_box.less';
#system_control_licence {
  .content_box {
    padding-right: 24px;
    .title {
      font-family: PingFangMedium;
      font-size: 16px;
      color: #333333;
      margin-bottom: 24px;
    }
    .btn_i {
      font-size: 14px;
      width: 148px;
      height: 42px;
      background: #0070ff;
      color: #fff;
      padding: 0;
    }
    .btn_o {
      padding: 0;
      font-size: 14px;
      width: 148px;
      height: 42px;
      background: #fff;
      border-color: #0070ff;
      color: #0070ff;
    }
    .licence_table {
      margin-top: 24px;
    }
    .pagination_box {
      margin-top: 24px;
      text-align: center;
    }
  }
}
</style>
<style lang='less'>
@import '../../../assets/css/less/reset_css/reset_table.less';
@import '../../../assets/css/less/reset_css/reset_pop.less';
#system_control_licence {
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
      .title {
        font-size: 12px;
        color: #999999;
      }
    }
    .btn_box {
      margin-top: 24px;
    }
  }
}
</style>
