<template>
  <el-col class="vm-move-threat">
    <el-table class="common-table"
              align="center"
              border
              ref="multipleTable"
              @row-click="detail_click"
              :row-style="{cursor:'pointer'}"
              @mousedown.native="mousedown"
              @mouseup.native="mouseup"
              :data="tableData">
      <el-table-column label="Time"
                       show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.alert_time | time}}
        </template>
      </el-table-column>
      <el-table-column prop="category"
                       label="Type"
                       show-overflow-tooltip></el-table-column>
      <el-table-column prop="indicator"
                       label="Indicator"
                       show-overflow-tooltip></el-table-column>
      <el-table-column prop="src_ip"
                       label="Source IP"
                       show-overflow-tooltip></el-table-column>
      <el-table-column prop="dest_ip"
                       label="Destination IP"
                       min-width="100"
                       show-overflow-tooltip></el-table-column>
      <!--<el-table-column prop="application"
                       label="Protocol"
                       width="60"
                       show-overflow-tooltip></el-table-column>-->
      <el-table-column label="Severity"
                       show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="btn_alert_background"
                :class="{'high_background':scope.row.degree =='High risk',
                      'mid_background':scope.row.degree =='Medium risk',
                      'low_background':scope.row.degree =='Low risk'}">
            {{ scope.row.degree | degree_sino }}</span>
        </template>
      </el-table-column>
    </el-table>
  </el-col>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'bom-right',
  data () {
    return {
      detail_click_val: {},
      oldPositon: {
        x: '',
        y: ''
      },
      newPositon: {
        x: '',
        y: ''
      }
    }
  },
  props: {
    bom_right: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    tableData () {
      let tableData = this.bom_right;
      return tableData;
    }
  },
  methods: {
    //进入详情页面
    detail_click (val) {
      this.detail_click_val = val
    },
    mousedown (event) {
      this.oldPositon = {
        x: '',
        y: ''
      }
      this.newPositon = {
        x: '',
        y: ''
      }
      this.oldPositon.x = event.clientX;
      this.oldPositon.y = event.clientY;
    },
    mouseup (event) {
      this.newPositon.x = event.clientX;
      this.newPositon.y = event.clientY;
      if (this.oldPositon.x == this.newPositon.x) {
        setTimeout(() => {
          this.$router.push({ path: "/detail/network", query: { detail: this.detail_click_val.id, type: 'alert' } });
        }, 10);
      } else {
        console.log('复制');
      }
    },
  }
}
</script>
<style scoped lang="less">
.vm-move-threat {
  /deep/ .btn_alert_background {
    line-height: unset;
    height: auto;
  }
}
</style>
<style lang="less" scoped>
@import '../../../../assets/css/less/common-table-pattern.less';
</style>
