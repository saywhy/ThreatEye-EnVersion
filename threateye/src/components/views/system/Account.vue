<template>
  <div id="system_control_account"
       class="container">
    <div class="content_box">
      <el-tabs v-model="activeName"
               @tab-click="handleClick"
               class="reset_tab">
        <el-tab-pane label="User Management"
                     class="tabs-item"
                     name="first">
          <user-management v-if="tab_show.first"></user-management>
        </el-tab-pane>
        <el-tab-pane label="Role Management"
                     class="tabs-item"
                     name="second">
          <role-management v-if="tab_show.second"></role-management>
        </el-tab-pane>
        <el-tab-pane label="Security Policies"
                     class="tabs-item"
                     name="third">
          <security-policy v-if="tab_show.third"></security-policy>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import userManagement from "@/components/views/system/vm-account/user-management";
import roleManagement from "@/components/views/system/vm-account/role-management";
import securityPolicy from "@/components/views/system/vm-account/security-policy";
export default {
  components: {
    userManagement,
    roleManagement,
    securityPolicy
  },
  name: "system_control_account",
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

