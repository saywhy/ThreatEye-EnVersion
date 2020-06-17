<template>
  <div id="system_control_threat"
       class="container">
    <div class="content_box">
      <div class="network_tab">
        <el-tabs v-model="activeName"
                 @tab-click="handleClick"
                 class="reset_tab">
          <el-tab-pane label="Mail Notification"
                       class="tabs-item"
                       name="first">
            <mail-notic v-if="tab_show.first"></mail-notic>
          </el-tab-pane>
          <el-tab-pane label="SMS Notification"
                       class="tabs-item"
                       name="second">
            <short-message v-if="tab_show.second"></short-message>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import mailNotic from "@/components/views/system/vm-threat/mail-notic";
import shortMessage from "@/components/views/system/vm-threat/short-message";
export default {
  components: {
    mailNotic,
    shortMessage,
  },
  name: "system_control_electric",
  data () {
    return {
      activeName: "first",
      tab_show: {
        first: true,
        second: false,
      }
    };
  },

  methods: {
    handleClick (tab, event) {
      console.log(tab);
      switch (tab.name) {
        case "first":
          this.tab_show.first = true;
          this.tab_show.second = false;
          break;
        case "second":
          this.tab_show.first = false;
          this.tab_show.second = true;
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

