<template>
  <el-col class="vm-move-threat">
    <el-table class="common-table"
              ref="multipleTable"
              @row-click="detail_click"
              :data="tableData">
      <el-table-column prop="index"
                       label="Rank"
                       width="60"
                       align="center"
                       show-overflow-tooltip></el-table-column>
      <el-table-column prop="indicator"
                       label="Indicator"
                       show-overflow-tooltip></el-table-column>
      <el-table-column prop="category"
                       label="Type"
                       show-overflow-tooltip></el-table-column>
    </el-table>
  </el-col>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'bom-left',
  props: {
    bom_left: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    tableData () {
      let tableData = this.bom_left;
     // console.log(this.bom_left);
      let that = this;
      tableData.map(function (v, k) {
        that.$set(v, 'index', k + 1);
      });
      return tableData;
    }
  },
  methods: {
    //进入详情页面
    detail_click (val) {
     // console.log(val);
      this.$router.push({ path: "/detail/network", query: { detail: val.id, type: 'alert' } });
      // this.$router.push({ path: "/handle/risks/outside" });
    },
  }
}
</script>
<style lang="less">
</style>
