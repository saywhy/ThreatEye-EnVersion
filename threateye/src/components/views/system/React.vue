<template>
  <div id="system_control_react"
       class="container">
    <div class="content_box">
      <el-tabs v-model="activeName"
               @tab-click="handleClick"
               class="reset_tab">
        <el-tab-pane label="Integration Setting"
                     class="tabs-item"
                     name="first">
          <outside-set v-if="tab_show.first"></outside-set>
        </el-tab-pane>
        <el-tab-pane label="Dynamic Lists"
                     class="tabs-item"
                     name="second">
          <outside-list v-if="tab_show.second"></outside-list>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import outsideSet from "@/components/views/system/vm-react/outside-set";
import outsideList from "@/components/views/system/vm-react/outside-list";
export default {
  components: {
    outsideSet,
    outsideList
  },
  name: "system_control_react",
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
