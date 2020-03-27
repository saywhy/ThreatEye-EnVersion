<template>
  <div id="rule_base"
       v-loading.fullscreen.lock="loading">
    <p class="title">Live Update</p>
    <p class="item_box"
       v-for="item in rule"
       v-if="item.update_type=='1'">
      <span class="item_name">{{item.key}}</span>
      <span class="item_time">Last update time:
        <span>{{item.time}}</span>
      </span>
      <span class="item_status">{{item.status_cn}}</span>
    </p>
    <el-button type="primary"
               class="update"
               @click="update_online">Update</el-button>
    <p class="title">Offline Update</p>
    <p class="item_box"
       v-for="item in rule"
       v-if="item.update_type=='2'">
      <span class="item_name">{{item.key}}</span>
      <span class="item_time">Last update time:
        <span>{{item.time}}</span>
      </span>
      <span class="item_status">{{item.status_cn}}</span>
    </p>
    <el-button type="primary"
               class="update"
               @click="open_box">Upload</el-button>
    <el-dialog class="import_box pop_box"
               :close-on-click-modal="false"
               :modal-append-to-body="false"
               :visible.sync="rule_data.upload_pop">
      <img src="@/assets/images/emerge/closed.png"
           @click="closed_upload_box"
           class="closed_img"
           alt="">
      <div class="title">
        <div class="mask"></div>
        <span class="title_name">Upload update file</span>
      </div>
      <div class="content">

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
            <span>Please upload files whose name are sdk.tgz, ids.tgz, df.tgz.</span>
          </uploader-drop>
          <uploader-list></uploader-list>
        </uploader>
      </div>
      <div class="btn_box">
        <el-button @click="closed_upload_box"
                   class="cancel_btn">Cancel</el-button>
        <el-button class="ok_btn"
                   @click="closed_upload_box">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "rule_base",
  data () {
    return {
      loading: false,
      options: {
        target: '/yiiapi/rulebase/upload-package',
        chunkSize: '10048000',   //分块大小
        testChunks: false,     //是否开启服务器分片校验
      },
      rule: {},
      rule_data: {
        upload_pop: false,
      },
      timer: null
    };
  },
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  },
  activated () { },
  deactivated () { },
  mounted () {
    this.get_data();
    this.timer = setInterval(() => {
      this.get_data();
    }, 2000)
  },
  beforeDestroy () {
    console.log('2222');
    clearInterval(this.timer); //关闭
  },
  destroyed () {
    console.log('33333');
  },
  beforeRouteLeave (to, from, next) {
    console.log('2132131');

  },
  methods: {
    // 定时更新
    update_status () {
      this.$axios.get('/yiiapi/rulebase/get-update-status')
        .then(response => {
          console.log(response);
          if (response.data.status == 0) {
            this.rule = response.data.data
            this.rule.forEach(item => {
              switch (item.status) {
                case '1':
                  item.status_cn = 'Updating'
                  break;
                case '2':
                  item.status_cn = 'Successfully'
                  break;
                case '3':
                  item.status_cn = 'Failed'
                  break;
                default:
                  break;
              }
            });
          } else if (response.data.status == 1) {

          }
        })
        .catch(error => {
          console.log(error);
        })
    },
    get_data () {
      this.$axios.get('/yiiapi/rulebase/get-update-status')
        .then(response => {
          console.log(response);
          if (response.data.status == 0) {
            this.rule = response.data.data
            this.rule.forEach(item => {
              switch (item.status) {
                case '1':
                  item.status_cn = 'Updating'
                  break;
                case '2':
                  item.status_cn = 'Successfully'
                  break;
                case '3':
                  item.status_cn = 'Failed'
                  break;
                default:
                  break;
              }
            });
          } else if (response.data.status == 1) {

          }
        })
        .catch(error => {
          console.log(error);
        })
    },
    open_box () {
      this.rule_data.upload_pop = true;
    },
    closed_upload_box () {
      this.rule_data.upload_pop = false;
    },
    onBeforeUpload () {

    },
    onChange () {
    },
    uploadSuccess () {
      console.log("1111");
      this.monitor_state.import_loading = false;
    },
    // 在线更新
    update_online () {
      this.$axios.post('/yiiapi/rulebase/realtime-update')
        .then(response => {
          console.log(response);
          let { status, data } = response.data;
          if (status == 0) {
            this.$message({
              type: 'success',
              message: 'Start update'
            });
            setTimeout(() => {
              this.get_data()
            }, 100);
          }
        })
        .catch(error => {
          console.log(error);
        })
    },
    // 离线更新
    // 上传
    onFileAdded (file) {
      console.log(file.name);
      file.pause()
      if (file.name == 'sdk.tgz' || file.name == 'ids.tgz' || file.name == 'df.tgz') {
        setTimeout(() => {
          file.resume();
        }, 100)
      } else {
        this.$message({
          message: 'Please upload files whose name are sdk.tgz, ids.tgz, df.tgz.',
          type: 'warning'
        });
        setTimeout(() => {
          file.cancel()
        }, 100)
      }
    },
    onFileSuccess (rootFile, file, response, chunk) {
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
            }
          })
          .catch(error => {
            console.log(error);
          })

      }
      console.log(chunk);
    },
    onFileProgress (file) { },
    onFileError () { },
  }
};
</script>

<style scoped lang="less">
#rule_base {
  text-align: left;
  .title {
    font-size: 16px;
    font-family: PingFangMedium;
    color: #333333;
    margin-bottom: 24px;
  }
  .item_box {
    margin-bottom: 16px;
    font-size: 14px;
    color: #333333;
    .item_name {
      display: inline-block;
      width: 90px;
    }
    .item_time {
      display: inline-block;
      width: 350px;
    }
  }
  .update {
    width: 136px;
    height: 42px;
    margin: 36px 0px 48px 0;
  }
}
</style>
<style lang='less'>
@import '../../../../assets/css/less/reset_css/reset_pop.less';
#rule_base {
  .el-dialog {
    width: 440px;
    /deep/ .uploader-example {
      width: 100%;
      margin: 0;
      padding: 0;
      border: 0;
      text-align: center;
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
      display: block;
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
}
</style>
