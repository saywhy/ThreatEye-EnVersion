<template>
  <el-col class="vm-move-threat">
    <el-table class="common-table"
              align="center"
              border
              ref="multipleTable"
              @row-click="detail_click"
              @mousedown.native="mousedown"
              @mouseup.native="mouseup"
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
    bom_left: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    tableData () {
      let tableData = this.bom_left;

      //console.log(tableData)
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
<style lang="less" scoped>
@import '../../../../assets/css/less/common-table-pattern.less';
</style>