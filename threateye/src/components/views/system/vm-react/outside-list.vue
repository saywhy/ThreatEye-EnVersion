<template>
  <div id="outside_list">
    <div class="outside_content">
      <div class="content_left content_common">
        <p class="title">Malicious IP List:</p>
        <p>
          <span>{{hostip}}/MaliciousIP?uname=account&passwd=password</span>
        </p>
        <div class="list_box">
          <p class="list_title_box">
            <span>IP:</span>
            <el-button class="btn_i"
                       @click="add_ip">Add</el-button>
          </p>
          <div class="item_box"
               v-for="(item,index) in outside_list.ip"
               @mouseenter="enter(index)"
               :class="item.class"
               @mouseleave="leave(index)">
            <span>{{item.addr}}</span>
            <img class="del_img"
                 v-if="item.icon"
                 @click="del_list(item)"
                 src="@/assets/images/common/del.png"
                 alt="">
          </div>
        </div>
      </div>
      <div class="content_right content_common">
        <p class="title">Malicious URl List:</p>
        <p>
          <span>{{hostip}}/MaliciousURL?uname=account&passwd=password</span>
        </p>
        <div class="list_box">
          <p class="list_title_box">
            <span>URL:</span>
            <el-button class="btn_i"
                       @click="add_url">Add</el-button>
          </p>
          <div class="item_box"
               v-for="(item,index) in outside_list.url"
               @mouseenter="enter_url(index)"
               :class="item.class==''?'':item.class"
               @mouseleave="leave_url(index)">
            <span>{{item.addr}}</span>
            <img class="del_img"
                 v-if="item.icon"
                 @click="del_list(item)"
                 src="@/assets/images/common/del.png"
                 alt="">
          </div>
        </div>
      </div>
    </div>
    <!-- 添加IP -->
    <el-dialog class="add_box pop_box"
               :close-on-click-modal="false"
               :modal-append-to-body="false"
               :visible.sync="outside_pop.ip.show">
      <img src="@/assets/images/emerge/closed.png"
           @click="closed_ip_box"
           class="closed_img"
           alt="">
      <div class="title">
        <div class="mask"></div>
        <span class="title_name">Add</span>
      </div>
      <div class="content">
        <div class="content_item">
          <p>
            <span class="title">IP</span>
            <span class="red_necessary">*</span>
          </p>
          <el-input class="select_box"
                    placeholder="Please enter an ip"
                    v-model="outside_pop.ip.ip"
                    clearable>
          </el-input>
        </div>
      </div>
      <div class="btn_box">
        <el-button @click="closed_ip_box"
                   class="cancel_btn">Cancel</el-button>
        <el-button class="ok_btn"
                   @click="add_list('1')">Confirm</el-button>
      </div>
    </el-dialog>
    <!-- 添加url -->
    <el-dialog class="add_box pop_box"
               :close-on-click-modal="false"
               :modal-append-to-body="false"
               :visible.sync="outside_pop.url.show">
      <img src="@/assets/images/emerge/closed.png"
           @click="closed_url_box"
           class="closed_img"
           alt="">
      <div class="title">
        <div class="mask"></div>
        <span class="title_name">Add</span>
      </div>
      <div class="content">
        <div class="content_item">
          <p>
            <span class="title">URL</span>
            <span class="red_necessary">*</span>
          </p>
          <el-input class="select_box"
                    placeholder="Please enter a URL"
                    v-model="outside_pop.url.url"
                    clearable>
          </el-input>
        </div>
      </div>
      <div class="btn_box">
        <el-button @click="closed_url_box"
                   class="cancel_btn">Cancel</el-button>
        <el-button class="ok_btn"
                   @click="add_list('2')">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import { eventBus } from '@/components/common/eventBus.js';
export default {
  name: "outside_list",
  data () {
    return {
      outside_list: {
        ip: [],
        url: []
      },
      outside_pop: {
        ip: {
          show: false,
          ip: ""
        },
        url: {
          show: false,
          url: ""
        },
      },
      hostip: '',
    }
  },
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  },
  mounted () {
    this.get_list('1')
    this.get_list('2')
    this.get_ip()
    this.check_passwd()
    // 必填；只能是1和2；动态类型，1Ip，2url
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
    // 获取当前IP
    get_ip () {
      this.$axios.get('/yiiapi/linkage/get-hostip')
        .then(response => {
          console.log(response.data);
          this.hostip = response.data.data.url

        })
        .catch(error => {
          console.log(error);
        })

    },
    // 获取列表
    get_list (type) {
      this.$axios.get('/yiiapi/linkage/list', {
        params: {
          type: type,
          page: 1,
          rows: 9999
        }
      })
        .then(response => {
          console.log(response);
          if (type == '1') {
            this.outside_list.ip = response.data.data.data
            this.outside_list.ip.forEach(item => {
              this.$set(item, 'icon', false)
              this.$set(item, 'class', '')
            });
          }
          if (type == '2') {
            this.outside_list.url = response.data.data.data
            this.outside_list.url.forEach(item => {
              this.$set(item, 'icon', false)
              this.$set(item, 'class', '')
            })
          }
        })
        .catch(error => {
          console.log(error);
        })
    },
    // 添加ip
    add_ip () {
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
            this.outside_pop.ip.show = true;
            this.outside_pop.ip.ip = ''
          }
        })
    },
    add_list (num) {
      var addr_params = ''
      switch (num) {
        case '1':
          if (this.outside_pop.ip.ip == '') {
            this.$message(
              {
                message: 'Please enter an ip',
                type: 'warning',
              }
            );
            return false
          }
          addr_params = this.outside_pop.ip.ip
          break;
        case '2':
          if (this.outside_pop.url.url == '') {
            this.$message(
              {
                message: 'Please enter a URL',
                type: 'warning',
              }
            );
            return false
          }
          addr_params = this.outside_pop.url.url
          break;
        default:
          break;
      }
      this.$axios.post('/yiiapi/linkage/add', {
        addr: addr_params,
        type: num,
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
            switch (num) {
              case '1':
                this.get_list('1')
                this.outside_pop.ip.show = false;
                this.$message(
                  {
                    message: 'IP added successfully',
                    type: 'success',
                  }
                );
                break;
              case '2':
                this.get_list('2')
                this.outside_pop.url.show = false;
                this.$message(
                  {
                    message: 'URL added successfully',
                    type: 'success',
                  }
                );
                break;
              default:
                break;
            }
          }
        })
        .catch(error => {
          console.log(error);
        })
    },
    add_url () {
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
            this.outside_pop.url.show = true;
            this.outside_pop.url.url = ''
          }
        })

    },
    // 删除ip
    del_list (item) {
      console.log(item);
      this.$confirm('This action deletes the item. Do you want to continue?', 'Message', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        var id_list = []
        id_list.push(item.id)
        this.$axios.delete('/yiiapi/linkage/del', {
          data: {
            id: id_list
          }
        })
          .then(response => {
            console.log(response);
            if (response.data.status == 0) {
              this.get_list('1');
              this.get_list('2');
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
    closed_ip_box () {
      this.outside_pop.ip.show = false;
    },
    closed_url_box () {
      this.outside_pop.url.show = false;
    },
    enter (num) {
      this.outside_list.ip.forEach((item, index) => {
        if (num == index) {
          item.icon = true
          item.class = 'active'
        }
      });
    },
    leave (index) {
      this.outside_list.ip[index].icon = false
      this.outside_list.ip[index].class = ''
    },
    enter_url (index) {
      this.outside_list.url[index].icon = true
      this.outside_list.url[index].class = 'active'
    },
    leave_url (index) {
      this.outside_list.url[index].icon = false
      this.outside_list.url[index].class = ''
    }
  }
};
</script>

<style scoped lang="less">
#outside_list {
  text-align: left;
  .outside_content {
    margin-top: 12px;
    display: flex;
    .content_common {
      width: 580px;
      word-break: break-all;
      white-space: pre-wrap;
      word-wrap: break-word;
      .title {
        padding-bottom: 8px;
        font-family: PingFangMedium;
        font-size: 16px;
        color: #333333;
        border-bottom: 1px solid #ececec;
      }
      .list_box {
        padding: 18px 0 14px 0;
        background: #f8f8f8;
      }
      .list_title_box {
        height: 34px;
        line-height: 34px;
        margin-bottom: 16px;
        padding: 0 26px 0 14px;
        .btn_i {
          width: 124px;
          height: 34px;
          padding: 0;
          background: #0070ff;
          color: #fff;
          float: right;
        }
      }
      .item_box {
        // height: 36px;
        line-height: 36px;
        padding: 0 26px 0 14px;
        position: relative;
        .del_img {
          cursor: pointer;
          width: 14px;
          height: 14px;
          position: absolute;
          top: 50%;
          right: 26px;
          transform: translateY(-50%);
        }
      }
      .active {
        background: #eef6ff;
        cursor: pointer;
      }
    }
    .content_left {
      margin-right: 22px;
    }
  }
}
</style>
<style lang='less'>
@import '../../../../assets/css/less/reset_css/reset_table.less';
@import '../../../../assets/css/less/reset_css/reset_pop.less';
#outside_list {
  .add_box {
    .el-dialog {
      width: 440px;
      .content_item {
        margin-top: 24px;
      }
      .el-input__inner {
        background: #f8f8f8;
        border: 0;
      }
      .btn_box {
        margin-top: 24px;
      }
    }
  }
}
</style>