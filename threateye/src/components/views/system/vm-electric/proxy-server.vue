<template>
  <div id="proxy-server">
    <div class="left">
      <div class="left_item">
        <span>Proxy Start-Stop:</span>
        <el-switch v-model="proxy.proxy_switch">
        </el-switch>
      </div>
      <div class="left_item">
        <p>Proxy Type</p>
        <el-select class="select_box"
                   v-model="proxy.type"
                   placeholder="Please select the proxy type">
          <el-option v-for="item in proxy.type_list"
                     :key="item.name"
                     :label="item.name"
                     :value="item.name">
          </el-option>
        </el-select>
      </div>
      <div class="left_item">
        <p>Proxy Address</p>
        <el-input class="select_box"
                  placeholder="Please enter the proxy address"
                  v-model="proxy.ip"
                  clearable>
        </el-input>
      </div>
      <div class="left_item">
        <p>Port</p>
        <el-input class="select_box"
                  placeholder="Please enter port"
                  v-model="proxy.port"
                  clearable>
        </el-input>
      </div>
      <div class="left_item">
        <el-button type="primary"
                   class="save_btn"
                   @click="set_proxy">Save</el-button>
      </div>
    </div>
    <div class="mid">
      <div class="mid_item">
        <span>Password Verification:</span>
        <el-switch v-model="proxy.verify_passwd"></el-switch>
      </div>
      <div class="mid_item">
        <p>User Name</p>
        <el-input class="select_box"
                  placeholder="Please enter a UserName"
                  v-model="proxy.user"
                  clearable>
        </el-input>
      </div>
      <div class="mid_item">
        <p>User Password</p>
        <el-input class="select_box"
                  placeholder="Please enter the user password"
                  v-model="proxy.password"
                  show-password>
        </el-input>
      </div>
    </div>
    <div class="right"></div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "proxy-server",
  data () {
    return {
      proxy: {
        proxy_switch: false,
        verify_passwd: false,
        type: "",
        ip: "",
        port: "",
        user: "",
        password: "",
        type_list: [
          {
            name: "http"
          },
          {
            name: "https"
          }
        ]
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
  },
  methods: {
    get_data () {
      this.$axios.get('/yiiapi/seting/get-proxy-server')
        .then(response => {
          let { status, data } = response.data;
          console.log(data.data[0].PROXYCONF);
          this.proxy.type = data.data[0].PROXYCONF.type
          this.proxy.ip = data.data[0].PROXYCONF.ip
          this.proxy.port = data.data[0].PROXYCONF.port
          this.proxy.user = data.data[0].PROXYCONF.user
          this.proxy.password = data.data[0].PROXYCONF.password
          if (data.data[0].PROXYCONF.verify_passwd == 'yes') {
            this.proxy.verify_passwd = true
          } else {
            this.proxy.verify_passwd = false
          }
          if (data.data[0].PROXYCONF.proxy_switch == 'yes') {
            this.proxy.proxy_switch = true
          } else {
            this.proxy.proxy_switch = false
          }
        })
        .catch(error => {
          console.log(error);
        })
    },
    set_proxy () {
      var proxy_switch = ''
      var verify_passwd = ''
      if (this.proxy.proxy_switch) {
        proxy_switch = 'yes'
      } else {
        proxy_switch = 'no'
      }
      if (this.proxy.verify_passwd) {
        verify_passwd = 'yes'
      } else {
        verify_passwd = 'no'
      }
      this.$axios.put('/yiiapi/seting/set-proxy-server', {
        proxy_switch: proxy_switch,
        type: this.proxy.type,
        ip: this.proxy.ip,
        port: this.proxy.port,
        verify_passwd: verify_passwd,
        user: this.proxy.user,
        password: this.proxy.password
      })
        .then(response => {
          let { status, data } = response.data;
          if (status == 0) {
            this.get_data();
            this.$message(
              {
                message: 'Proxy updated successfully',
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
          console.log(data.data);
        })
        .catch(error => {
          console.log(error);
        })
    }
  }
};
</script>

<style scoped lang="less">
#proxy-server {
  display: flex;
  text-align: left;
  .left {
    flex: 1;
    margin-right: 100px;
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
    }
  }
  .mid {
    flex: 1;
    .mid_item {
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
    }
  }
  .right {
    width: 500px;
  }
}
</style>
<style lang='less'>
#proxy-server {
  .el-input__inner {
    background: #f8f8f8;
    border: 0;
  }
  .el-switch__core {
    width: 40px !important;
  }
}
</style>
