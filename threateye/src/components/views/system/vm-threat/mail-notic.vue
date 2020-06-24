<template>
  <div id="mail_notic">
    <div class="left">
      <p class="title">Mail Server Settings</p>
      <div class="left_item">
        <p>SMTP Server
          <span class="red_necessary">*</span>
        </p>
        <el-input class="select_box"
                  placeholder="Please enter SMTP server"
                  v-model="mail.host"
                  clearable>
        </el-input>
      </div>
      <div class="left_item">
        <p>SMTP Port
          <span class="red_necessary">*</span>
        </p>
        <el-input class="select_box"
                  placeholder="Please enter SMTP port"
                  v-model="mail.port"
                  clearable>
        </el-input>
      </div>
      <p class="title">
        Enable SSL
        <el-switch v-model="mail.ssl_switch">
        </el-switch>
      </p>
      <div class="left_item">
        <p>Email Address
          <span class="red_necessary">*</span>
        </p>
        <el-input class="select_box"
                  placeholder="Please enter your email address"
                  v-model="mail.username"
                  clearable>
        </el-input>
      </div>
      <div class="left_item">
        <p>Email Password
          <span class="red_necessary">*</span>
        </p>
        <el-input class="select_box"
                  placeholder="Please enter your email password"
                  v-model="mail.password"
                  show-password>
        </el-input>
      </div>
      <div class="left_item">
        <el-button type="primary"
                   class="save_btn"
                   @click="send_save">Save</el-button>
        <el-button type="primary"
                   class="test_btn"
                   @click='send_test'>Test</el-button>
      </div>
    </div>
    <div class="mid">
      <p class="title">Recipient Email</p>
      <div class="mid_item">
        <p>Email Address
          <span class="red_necessary">*</span>
        </p>
        <div class="item_addrs"
             v-for="(item,index) in mail.alertEmail_list">
          <el-input class="select_box"
                    placeholder="Please enter email addresses and up to 5 mail accounts can be set"
                    v-model="item.name"
                    clearable>
          </el-input>
          <img src="@/assets/images/common/add.png"
               alt=""
               class="img_box"
               v-if="item.icon"
               @click="add_addr">
          <img src="@/assets/images/common/del.png"
               alt=""
               class="img_box"
               @click="del_addr(item,index)"
               v-if="!item.icon">
        </div>
      </div>
      <div class="mid_item">
        <p>Content</p>
        <div style="display:flex">
          <el-input class="select_box"
                    type="textarea"
                    :rows="10"
                    autosize
                    maxlength="500"
                    show-word-limit
                    resize='none'
                    placeholder="Please enter the content to be sent"
                    v-model="mail.content"
                    clearable>
          </el-input>
          <span style="width: 16px;"></span>
        </div>
      </div>
      <p class="title">
        Mail notification upon new alerts
        <el-switch v-model="mail.send">
        </el-switch>
      </p>
      <div class="mid_item">
        <p>
          Threat Level
          <span class="red_necessary">*</span>
        </p>
        <p style="margin-top: 10px;">
          <el-checkbox-group v-model="checkList"
                             @change="handleCheckedCitiesChange">
            <el-checkbox label="High"></el-checkbox>
            <el-checkbox label="Midium"></el-checkbox>
            <el-checkbox label="Low"></el-checkbox>
          </el-checkbox-group>
        </p>
      </div>
    </div>
    <div class="right"></div>
  </div>
</template>

<script type="text/ecmascript-6">
import { eventBus } from '@/components/common/eventBus.js';
export default {
  name: "mail-notic",
  data () {
    return {
      checkList: ['High'],
      mail: {
        alertEmail_list: [{
          name: "",
          icon: true
        }],
        content: "",
        ssl_switch: false,
        host: "",
        info: "",
        password: "",
        port: '',
        send: false,
        user: "",
        username: "",
      },
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
    get_data () {
      this.$axios.get('/yiiapi/email/get')
        .then(response => {
          let { status, data } = response.data;
          console.log(data);
          this.mail.port = data.port
          this.mail.content = data.content
          this.mail.host = data.host
          this.mail.username = data.username
          this.mail.send = data.send
          console.log(status);
          if (status == 602) {
            console.log('1111');
            return false
          }
          if (data.encryption == 'ssl') {
            this.mail.ssl_switch = true
          } else {
            this.mail.ssl_switch = false
          }
          if (data.alertEmail && data.alertEmail.length == 0) {
            this.mail.alertEmail_list = []
            this.mail.alertEmail_list.push(
              {
                name: '',
                icon: true,
              }
            )
          } else {
            this.mail.alertEmail_list = []
            data.alertEmail.forEach(element => {
              var obj = {
                name: element,
                icon: false,
              }
              this.mail.alertEmail_list.push(obj)
            });
            this.mail.alertEmail_list[this.mail.alertEmail_list.length - 1].icon = true
          }
        })
        .catch(error => {
          console.log(error);
        })
    },
    handleCheckedCitiesChange (value) {
      console.log(value);
      if (value.length == 0) {
        this.$message(
          {
            message: 'Please select at least one threat level to set alert mail notifications',
            type: 'warning',
          }
        );
      }
    },
    // 发送测试
    send_test () {
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
            var encryption = ''
            var alertEmail = []
            this.mail.alertEmail_list.forEach(element => {
              if (element.name != '') {
                alertEmail.push(element.name)
              }
            });
            if (alertEmail.length == 0) {
              this.$message(
                {
                  message: 'Please enter your email address',
                  type: 'warning',
                }
              );
              return false;
            }
            if (this.mail.password == '') {
              this.$message(
                {
                  message: 'Please enter your email password',
                  type: 'warning',
                }
              );
              return false;
            }
            if (this.mail.ssl_switch) {
              encryption = 'ssl'
            } else {
              encryption = ''
            }
            var degree_list = []
            this.checkList.forEach(element => {
              switch (element) {
                case 'High':
                  degree_list.push('high')
                  break;
                case 'Midium':
                  degree_list.push('midium')
                  break;
                case 'Low':
                  degree_list.push('low')
                  break;
                default:
                  break;
              }
            });
            this.$axios.post('/yiiapi/email/test', {
              encryption: encryption,
              host: this.mail.host,
              port: this.mail.port,
              username: this.mail.username,
              password: this.mail.password,
              send: this.mail.send,
              content: this.mail.content,
              alertEmail: alertEmail,
              degree: degree_list
            })
              .then(response => {
                let { status, data } = response.data;
                console.log(status);
                console.log(data);
                if (status == 0) {
                  // this.get_data()
                  this.$message(
                    {
                      message: 'Send test mail notification successfully',
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
            console.log(this.mail);
          }
        })
    },
    // 保存配置
    send_save () {
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
            var encryption = ''
            var alertEmail = []
            console.log(this.mail.alertEmail_list);
            this.mail.alertEmail_list.forEach(element => {
              if (element.name != '') {
                alertEmail.push(element.name)
              }
            });
            if (alertEmail.length == 0) {
              this.$message(
                {
                  message: 'Please enter your email address',
                  type: 'warning',
                }
              );
              return false;
            }
            if (this.mail.password == '') {
              this.$message(
                {
                  message: 'Please enter your email password',
                  type: 'warning',
                }
              );
              return false;
            }
            if (this.mail.ssl_switch) {
              encryption = 'ssl'
            } else {
              encryption = ''
            }
            var degree_list = []
            this.checkList.forEach(element => {
              switch (element) {
                case 'High':
                  degree_list.push('high')
                  break;
                case 'Midium':
                  degree_list.push('midium')
                  break;
                case 'Low':
                  degree_list.push('low')
                  break;
                default:
                  break;
              }
            });
            this.$axios.post('/yiiapi/email/save', {
              encryption: encryption,
              host: this.mail.host,
              port: this.mail.port,
              username: this.mail.username,
              password: this.mail.password,
              send: this.mail.send,
              content: this.mail.content,
              alertEmail: alertEmail,
              degree: degree_list
            })
              .then(response => {
                let { status, data } = response.data;
                console.log(status);
                console.log(data);
                if (status == 0) {
                  this.get_data()
                  this.$message(
                    {
                      message: 'Mail notifications setting success',
                      type: 'success',
                    }
                  );
                }
              })
              .catch(error => {
                console.log(error);
              })
          }
        })
    },
    //  添加邮箱
    add_addr () {
      if (this.mail.alertEmail_list.length < 5) {
        this.mail.alertEmail_list.forEach(item => {
          item.icon = false;
        });
        this.mail.alertEmail_list.push({ name: '', icon: true })
      } else {
        this.$message.warning(
          {
            message: 'You can set up to 5 recipient email addresses',
            offset: 50
          })
      }



    },
    del_addr (item, index) {
      this.mail.alertEmail_list.splice(index, 1);
    },

  }
};
</script>

<style scoped lang="less">
#mail_notic {
  display: flex;
  text-align: left;
  .left {
    flex: 1;
    margin-right: 100px;
    .title {
      margin-bottom: 24px;
      font-size: 16px;
      color: #333;
    }
    .left_item {
      margin-bottom: 24px;
      p {
        font-size: 12px;
        color: #999999;
      }
      .select_box {
        width: 100%;
        height: 38px;
        margin-top: 6px;
        input {
          background: #f8f8f8 !important;
        }
      }
      .save_btn {
        width: 136px;
        height: 42px;
      }
      .test_btn {
        width: 136px;
        height: 42px;
        background: #fff;
        border-color: #0070ff;
        color: #0070ff;
      }
    }
  }
  .mid {
    flex: 1;
    .title {
      margin-bottom: 24px;
      font-size: 16px;
      color: #333;
    }
    .mid_item {
      margin-bottom: 24px;
      p {
        font-size: 12px;
        color: #999999;
      }
      .item_addrs {
        display: flex;
        margin-bottom: 12px;
        .select_box {
          flex: 1;
          height: 38px;
          margin-top: 6px;
          input {
            background: #f8f8f8 !important;
          }
        }
        .img_box {
          width: 16px;
          height: 16px;
          margin-left: 10px;
          margin-top: 14px;
          cursor: pointer;
        }
      }
    }
  }
  .right {
    width: 500px;
  }
}
</style>
<style lang='less'>
#mail_notic {
  .el-input__inner {
    background: #f8f8f8;
    border: 0;
  }
  .el-switch__core {
    width: 40px !important;
  }
  .el-textarea__inner {
    margin-top: 8px;
    background: #f8f8f8;
    border: 0;
    min-height: 30px !important;
    line-height: 30px;
  }
  .el-textarea {
    min-height: 30px !important;
  }
  textarea {
    min-height: 30px !important;
  }
}
</style>
