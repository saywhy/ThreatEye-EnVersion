<template>
  <div id="system_control_record"
       class="container">
    <div class="content_box">
      <el-tabs v-model="activeName"
               @tab-click="handleClick"
               class="reset_tab">
        <el-tab-pane label="Audit Logs"
                     class="tabs-item"
                     name="first">
          <audit-log v-if="tab_show.first"></audit-log>
        </el-tab-pane>
        <el-tab-pane label="SYSLOG"
                     class="tabs-item"
                     name="second">
          <syslog-set v-if="tab_show.second"></syslog-set>
        </el-tab-pane>
        <el-tab-pane label="Troubleshooting"
                     class="tabs-item"
                     name="third">
          <fault-log v-if="tab_show.third"></fault-log>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import auditLog from "@/components/views/system/vm-record/audit-log";
import faultLog from "@/components/views/system/vm-record/fault-log";
import syslogSet from "@/components/views/system/vm-record/syslog-set";
export default {
  components: {
    auditLog,
    faultLog,
    syslogSet
  },
  name: "system_control_record",
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
