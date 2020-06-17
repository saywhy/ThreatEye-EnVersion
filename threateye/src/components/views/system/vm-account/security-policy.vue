<template>
  <div id="security_policy"
       v-loading.fullscreen.lock="security_policy_status.loading">
    <div class="top">
      <span>Enable:</span>
      <el-switch v-model="security_policy_status.switch">
      </el-switch>
    </div>
    <div class="mid">
      <div class="mid_item">
        <p class="title item_color">Minimum password length:</p>
        <el-input-number class="input_box"
                         v-model="security_policy.min_passwd_len"
                         @change="handleChange_pswd_min"
                         :min="8"
                         :max="11"
                         label="Please enter the minimum password length"></el-input-number>

        <span class="red">*</span>
        <span class="item_color">The minimum length of password is 8-11, including upper and lower case letters and numbers.</span>
      </div>
      <div class="mid_item">
        <p class="title item_color">Maximum password length:</p>
        <el-input-number class="input_box"
                         v-model="security_policy.max_passwd_len"
                         @change="handleChange_pswd_max"
                         :min="11"
                         :max="30"
                         label="Please enter the maximum password length"></el-input-number>

        <span class="red">*</span>
        <span class="item_color">The maximum length of password is 11-30, including upper and lower case letters and numbers.</span>
      </div>
      <div class="mid_item">
        <p class="title item_color">Password periodical modification time:</p>
        <el-input-number class="input_box"
                         v-model="security_policy.passwd_regular_edit_time"
                         :min="1"
                         :max="90"
                         label="Please enter the time to change the password periodically"></el-input-number>

        <span class="red">*</span>
        <span class="item_color">(1-90)Day</span>
      </div>
      <div class="mid_item">
        <p class="title item_color">Maximum number of login retries:</p>
        <el-input-number class="input_box"
                         v-model="security_policy.admin_faild_logon_time"
                         :min="1"
                         :max="5"
                         label="Please enter the maximum number of login retries"></el-input-number>

        <span class="red">*</span>
        <span class="item_color">(1-5)Times</span>
      </div>
      <div class="mid_item">
        <p class="title item_color">Blocking time after login failure:</p>
        <el-input-number class="input_box"
                         v-model="security_policy.admin_logon_delay_time"
                         :min="1"
                         :max="3600"
                         label="Please enter blocking time after login failure"></el-input-number>

        <span class="red">*</span>
        <span class="item_color">(1-3600)Secs</span>
      </div>
      <div class="mid_item">
        <p class="title item_color">Page timeout time:</p>
        <el-input-number class="input_box"
                         v-model="security_policy.session_timeout"
                         :min="1"
                         :max="480"
                         label="Please enter page timeout time"></el-input-number>
        <span class="red">*</span>
        <span class="item_color">(1-480)Mins</span>
      </div>
      <div class="mid_item">
        <p class="title item_color">Maximum number of logged-in users:</p>
        <el-input-number class="input_box"
                         v-model="security_policy.admin_online_count"
                         :min="1"
                         :max="5"
                         label="Please enter maximum number of logged-in users"></el-input-number>
        <span class="red">*</span>
        <span class="item_color">(1-5)</span>
      </div>
    </div>
    <div class="bottom">
      <el-button type="primary"
                 class="btn_i"
                 @click="set_data">Save</el-button>
      <el-button type="primary"
                 class="btn_o"
                 @click="reset_data">Cancel</el-button>

    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { eventBus } from '@/components/common/eventBus.js';
export default {
  name: "security_policy",
  data () {
    return {
      security_policy: {
      },
      security_policy_status: {
        loading: false,
        switch: true
      }
    };
  },
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  },
  mounted () {
    this.get_data()
    this.check_passwd()
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
      this.security_policy_status.loading = true
      this.$axios.get('/yiiapi/securitypolicy/get-security-policy')
        .then(response => {
          console.log(response);
          this.security_policy = response.data.data;
          if (this.security_policy.status == '1') {
            this.security_policy_status.switch = true;
          } else {
            this.security_policy_status.switch = false;
          }
          this.security_policy_status.loading = false
        })
        .catch(error => {
          console.log(error);
        })
    },
    set_data () {
      if (this.security_policy_status.switch) {
        this.security_policy.status = '1'
      } else {
        this.security_policy.status = '0'
      }
      console.log(this.security_policy);
      this.$axios.put('/yiiapi/securitypolicy/set-security-policy', {
        min_passwd_len: this.security_policy.min_passwd_len,
        max_passwd_len: this.security_policy.max_passwd_len,
        passwd_regular_edit_time: this.security_policy.passwd_regular_edit_time,
        admin_faild_logon_time: this.security_policy.admin_faild_logon_time,
        admin_logon_delay_time: this.security_policy.admin_logon_delay_time,
        session_timeout: this.security_policy.session_timeout,
        admin_online_count: this.security_policy.admin_online_count,
        status: this.security_policy.status,
      })
        .then(response => {
          console.log(response);
          if (response.data.status == 0) {
            this.get_data();
            this.$message({
              message: 'Update successfully',
              type: 'success'
            });
          } else {
            this.$message.error(
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
    reset_data () {
      this.get_data()
    },
    handleChange_pswd_min () { },
    handleChange_pswd_max () { },
  }
};
</script>

<style scoped lang="less">
#security_policy {
  text-align: left;
  .mid {
    .mid_item {
      margin-top: 24px;
      margin-bottom: 48px;
      .title {
        margin-bottom: 6px;
      }
      .item_color {
        font-size: 12px;
        color: #999999;
      }
      .red {
        color: #ff5f5c;
      }
      .input_box {
        width: 200px;
        height: 38px;
      }
    }
  }
  .bottom {
    .btn_i {
      width: 136px;
      height: 42px;
      padding: 0;
      background: #0070ff;
      color: #fff;
      margin-right: 24px;
    }
    .btn_o {
      margin: 0;
      width: 136px;
      height: 42px;
      padding: 0;
      border-color: #0070ff;
      background: #fff;
      color: #0070ff;
    }
  }
}
</style>
<style lang='less'>
#security_policy {
  .el-input__inner {
    background: #f8f8f8;
    border: 0;
  }
  .el-switch__core {
    width: 40px !important;
  }
}
</style>
