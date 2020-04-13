<template>
  <div id="network-card"
       v-loading.fullscreen.lock="network_loading">
    <div class="left">
      <div class="left_item">
        <p>Network Card</p>
        <el-select class="select_box"
                   v-model="network_model.name"
                   @change='change_name'
                   placeholder="Please select network card">
          <el-option v-for="item in network"
                     :key="item.NAME"
                     :label="item.NAME"
                     :value="item.NAME">
          </el-option>
        </el-select>
      </div>
      <div class="left_item">
        <p>Role</p>
        <el-select class="select_box"
                   @change='change_role'
                   v-model="network_model.role_name"
                   placeholder="Please select a role"
                   clearable>
          <el-option v-for="item in network_model.role"
                     :key="item.name"
                     :label="item.name"
                     :value="item.name">
          </el-option>
        </el-select>
      </div>
      <div class="left_item">
        <p>IP Mode</p>
        <el-select class="select_box"
                   v-model="network_model.obtain"
                   @change='change_obtain'
                   :disabled="network_model.role_name =='Mirror port'"
                   placeholder="请选择获取IP方式">
          <el-option v-for="item in network_model.obtain_list"
                     :key="item.name"
                     :label="item.name"
                     :value="item.name">
          </el-option>
        </el-select>
      </div>
      <div class="left_item"
           v-if="network_model.input_show">
        <p>IP</p>
        <el-input class="select_box"
                  placeholder="Please enter IP"
                  v-model="network_model.IPADDR"
                  clearable>
        </el-input>
      </div>
      <div class="left_item">
        <span>Enable:</span>
        <el-switch v-model="network_model.switch">
        </el-switch>
      </div>
      <div class="left_item">
        <el-button type="primary"
                   class="save_btn"
                   @click="set_network">Save</el-button>
      </div>
    </div>
    <div class="mid">
      <div class="mid_item"
           v-if="network_model.input_show">
        <p>Subnet Mask</p>
        <el-input class="select_box"
                  placeholder="Please enter a subnet mask"
                  v-model="network_model.MASK"
                  clearable>
        </el-input>
      </div>
      <div class="mid_item"
           v-if="network_model.input_show">
        <p>Default Gateway</p>
        <el-input class="select_box"
                  placeholder="Please enter the default gateway"
                  v-model="network_model.GATEWAY"
                  clearable>
        </el-input>
      </div>
      <div class="mid_item"
           v-if="network_model.input_show">
        <p>Preferred DNS Server</p>
        <el-input class="select_box"
                  placeholder="Please enter the preferred DNS server"
                  v-model="network_model.DNS1"
                  clearable>
        </el-input>
      </div>
      <div class="mid_item"
           v-if="network_model.input_show">
        <p>Alternate DNS Server</p>
        <el-input class="select_box"
                  placeholder="Please enter alternate DNS server"
                  v-model="network_model.DNS2"
                  clearable>
        </el-input>
      </div>
    </div>
    <div class="right"></div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "network-card",
  data () {
    return {
      key: "",
      network: [],
      network_model: {
        name: "",
        role_name: "",
        switch: true,
        role: [
          { name: "Management port" },
          { name: "Communication port" },
          { name: "Mirror port" },
          { name: "Sandbox port" }
        ],
        obtain: "",
        obtain_list: [{ name: "Static" }, { name: "DHCP" }],
        input_show: true,
        IPADDR: "",
        GATEWAY: "",
        MASK: "",
        DNS1: "",
        DNS2: ""
      },
      network_loading: false
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
    change_role (item) {
      console.log(item);
      if (item == 'Mirror port') {
        console.log('1212121');

        this.network_model.obtain = 'DHCP'
        this.network_model.input_show = false
      }
    },
    change_name (value) {
      this.network_model.name = value;
      this.network.forEach(item => {
        if (item.NAME == value) {
          switch (item.PORT) {
            case 0:
              this.network_model.role_name = "";
              break;
            case 1:
              this.network_model.role_name = "Management port";
              break;
            case 2:
              this.network_model.role_name = "Communication port";
              break;
            case 3:
              this.network_model.role_name = "Mirror port";
              break;
            case 4:
              this.network_model.role_name = "Sandbox port";
              break;
            default:
              this.network_model.role_name = "";
              break;
          }
          switch (item.BOOTPROTO) {
            case "static":
              this.network_model.obtain = "Static";
              this.network_model.input_show = true;
              break;
            case "none":
              this.network_model.obtain = "DHCP";
              this.network_model.input_show = false;
              break;
            case "dhcp":
              this.network_model.obtain = "DHCP";
              this.network_model.input_show = false;
              break;
            default:
              this.network_model.obtain = "DHCP";
              this.network_model.input_show = false;
              break;
          }
          switch (item.ONBOOT) {
            case "no":
              this.network_model.switch = false;
              break;
            case "yes":
              this.network_model.switch = true;
              break;
            default:
              this.network_model.switch = true;
              break;
          }
          this.network_model.IPADDR = item.IPADDR;
          this.network_model.GATEWAY = item.GATEWAY;
          this.network_model.MASK = item.MASK;
          this.network_model.DNS1 = item.DNS1;
          this.network_model.DNS2 = item.DNS2;
        }
      });
    },
    change_obtain (value) {
      switch (value) {
        case "DHCP":
          this.network_model.input_show = false;
          break;
        case "Static":
          this.network_model.input_show = true;
          break;
        case "":
          this.network_model.input_show = false;
          break;
        default:
          this.network_model.input_show = false;
          break;
      }
    },
    // 获取网卡配置
    get_data () {
      this.network_loading = true
      this.$axios.get('/yiiapi/seting/get-network')
        .then(response => {
          this.network = response.data.data.data;
          this.change_name(this.network[0].NAME)
          this.network_loading = false
        })
        .catch(error => {
          console.log(error);
        })
    },
    // 设置网络
    set_network () {
      var BOOTPROTO = ''
      var ONBOOT = ''
      var PORT = ""
      switch (this.network_model.obtain) {
        case 'Static':
          BOOTPROTO = 'static'
          break;
        case 'DHCP':
          BOOTPROTO = 'dhcp'
          break;
        default:
          BOOTPROTO = 'none'
          break;
      }
      if (this.network_model.switch) {
        ONBOOT = 'yes'
      } else {
        ONBOOT = 'no'
      }
      switch (this.network_model.role_name) {
        case '':
          PORT = 0;
          break;
        case 'Management port':
          PORT = 1;
          break;
        case 'Communication port':
          PORT = 2;
          break;
        case 'Mirror port':
          PORT = 3;
          break;
        case 'Sandbox port':
          PORT = 4;
          break;
        default:
          break;
      }
      this.network_loading = true
      this.$axios.put('/yiiapi/seting/set-network', {
        NAME: this.network_model.name,
        ONBOOT: ONBOOT,
        BOOTPROTO: BOOTPROTO,
        IPADDR: this.network_model.IPADDR,
        MASK: this.network_model.MASK,
        GATEWAY: this.network_model.GATEWAY,
        DNS1: this.network_model.DNS1,
        DNS2: this.network_model.DNS2,
        PORT: PORT,
      })
        .then(response => {
          this.network_loading = false
          if (response.data.status == 0) {
            this.get_data()
            this.$message(
              {
                message: 'Configuration modified successfully',
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
    }
  }
};
</script>

<style scoped lang="less">
#network-card {
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
#network-card {
  .el-input__inner {
    background: #f8f8f8;
    border: 0;
  }
  .el-switch__core {
    width: 40px !important;
  }
}
</style>
