<template>
  <div id="system_control_electric"
       class="container">
    <div class="content_box">
      <div class="network_tab">
        <el-tabs v-model="activeName"
                 @tab-click="handleClick"
                 class="reset_tab">
          <el-tab-pane label="Network Configuration"
                       class="tabs-item"
                       name="first">
            <network-card v-if="tab_show.first"></network-card>
          </el-tab-pane>
          <el-tab-pane label="Proxy Setting"
                       class="tabs-item"
                       name="second">
            <proxy-server v-if="tab_show.second"></proxy-server>
          </el-tab-pane>
          <el-tab-pane label="Routing Setting"
                       class="tabs-item"
                       name="third">
            <router-set v-if="tab_show.third"></router-set>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import networkCard from "@/components/views/system/vm-electric/network-card";
import proxyServer from "@/components/views/system/vm-electric/proxy-server";
import routerSet from "@/components/views/system/vm-electric/router-set";
export default {
  components: {
    networkCard,
    proxyServer,
    routerSet
  },
  name: "system_control_electric",
  data () {
    return {
      activeName: "first",
      tab_show: {
        first: true,
        second: false,
        third: false,
      }
    };
  },
  mounted () {
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab);
      switch (tab.name) {
        case "first":
          this.tab_show.first = true;
          this.tab_show.second = false;
          this.tab_show.third = false;
          break;
        case "second":
          this.tab_show.first = false;
          this.tab_show.second = true;
          this.tab_show.third = false;
          break;
        case "third":
          this.tab_show.first = false;
          this.tab_show.second = false;
          this.tab_show.third = true;
          break;
        default:
          break;
      }

    }

  }
};
</script>
<style lang='less'>
@import '../../../assets/css/less/reset_css/reset_tab.less';
</style>
<style scoped lang='less'>
@import '../../../assets/css/less/system/setting/common_box.less';
</style>


