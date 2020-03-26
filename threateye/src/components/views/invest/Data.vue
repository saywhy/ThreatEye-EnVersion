
<template>
  <div id="invest_data"
       class="common_invest"
       v-loading.fullscreen.lock="data_search.loading">
    <div class="invest_box">
      <el-tabs v-model="activeName"
               @tab-click="handleClick"
               class="reset_tab">
        <el-tab-pane label="Data Transmission Hunting"
                     class="tabs-item"
                     name="first">
          <div class="invest_top">
            <el-input placeholder="Flow over (B)"
                      class="search_box"
                      v-model="data_search.flow_size"
                      clearable>
            </el-input>
            <el-input placeholder="Link duration over (S)"
                      class="search_box"
                      v-model="data_search.flow_duration"
                      clearable>
            </el-input>
            <el-input placeholder="Host"
                      class="search_box"
                      v-model="data_search.host_ip"
                      clearable>
            </el-input>
            <vm-emerge-picker @changeTime='changeTime'
                              :option='time_list'></vm-emerge-picker>
            <el-button class="btn_i"
                       @click="search">Search</el-button>
            <span class="reset"
                  @click="reset">Reset</span>
            <el-button class="btn_right"
                       @click="download">Download</el-button>
          </div>
          <div class="invest_bom">
            <el-table ref="multipleTable"
                      class="reset_table"
                      align="center"
                      :data="data_list_data.data"
                      tooltip-effect="dark"
                      style="width: 100%">
              <el-table-column label="Item"
                               width="60">
                <template slot-scope="scope">
                  {{(data_search.page-1)*(data_search.rows) + scope.row.index_cn}}
                </template>
              </el-table-column>
              <el-table-column prop="timestamp"
                               width="320"
                               label="Time"
                               show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="host_ip"
                               label="Host"
                               show-overflow-tooltip>
              </el-table-column>
              <el-table-column label="Flow"
                               show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.flow_bytes| filterType }}</span>
                </template>
              </el-table-column>
              <el-table-column label="Link Duration"
                               show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.flow_duration +' S' }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="application"
                               label="Protocol"
                               show-overflow-tooltip>
              </el-table-column>
            </el-table>
            <el-pagination class="pagination_box"
                           @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           :current-page="data_list.pageNow"
                           :page-sizes="[10,20,50,100]"
                           :page-size="10"
                           layout="total, sizes, prev, pager, next"
                           :total="data_list.count">
            </el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import VmEmergePicker from "@/components/common/vm-emerge-picker";
export default {
  name: "invest_data",
  components: {
    VmEmergePicker
  },
  data () {
    return {
      activeName: 'first',
      time_list: {
        time: []
      },
      data_search: {
        loading: false,
        flow_size: '',
        flow_duration: '',
        host_ip: '',
        start_time: "",
        end_time: "",
        page: 1,
        rows: 10
      },
      data_list: {
        count: 0,
        pageNow: 1,
      },
      data_list_data: {
      }
    };
  },
  methods: {
    handleClick () { },
    search () {
      this.get_data();
      this.data_search.page = 1
      this.data_list.pageNow = 1
    },
    get_data () {
      this.data_search.loading = true
      this.$axios.get('/yiiapi/investigate/flowsize-timelength-investigation', {
        params: {
          flow_size: this.data_search.flow_size,
          flow_duration: this.data_search.flow_duration,
          host_ip: this.data_search.host_ip,
          start_time: this.data_search.start_time,
          end_time: this.data_search.end_time,
          current_page: this.data_search.page,
          per_page_count: this.data_search.rows
        }
      })
        .then(response => {
          this.data_search.loading = false
          let { status, data } = response.data;
          if (data.count > 10000) {
            this.$message({
              type: 'warning',
              message: 'Over 10,000 search results returned, please narrow the search conditions.'
            });
            return false
          }
          this.data_list = data
          this.data_list_data = data.data
          this.data_list_data.data.forEach((item, index) => {
            item.index_cn = index + 1
          });
        })
        .catch(error => {
          console.log(error);
        })
    },
    // 重置
    reset () {
      this.data_search.flow_size = ''
      this.data_search.flow_duration = ''
      this.data_search.host_ip = '';
      this.data_search.start_time = '';
      this.data_search.end_time = '';
      $(document.querySelector('.el-button--text')).trigger('click');
    },
    // 下载
    download () {
      if (!this.data_list.data || this.data_list.data.data.length == 0) {
        this.$message({
          type: 'warning',
          message: 'Please search for data before downloading'
        });
        return false
      }
      if (this.data_list.count > 1000) {
        this.$message({
          type: 'warning',
          message: 'Downloaded data cannot exceed 1000 records!'
        });
        return false
      }
      var url1 = "/yiiapi/investigate/flowsize-timelength-investigation-export?flow_size=" + this.data_search.flow_size +
        '&flow_duration=' + this.data_search.flow_duration +
        '&host_ip=' + this.data_search.host_ip +
        '&start_time=' + this.data_search.start_time +
        '&end_time=' + this.data_search.end_time +
        '&current_page=0&per_page_count=0';
      window.location.href = url1;
    },
    // 分页
    handleSizeChange (val) {
      this.data_search.rows = val;
      this.data_search.page = 1
      this.get_data();
    },
    handleCurrentChange (val) {
      console.log(val);
      this.data_search.page = val
      this.get_data();
    },
    changeTime (data) {
      console.log(data);
      if (data) {
        this.data_search.start_time = parseInt(data[0].valueOf() / 1000);
        this.data_search.end_time = parseInt(data[1].valueOf() / 1000)
      } else {
        this.data_search.start_time = ''
        this.data_search.end_time = ''
      }
    }
  },
  filters: {
    filterType: function (val) {
      if (val == '') return;
      if (val == undefined) return;
      if (val == 0) return '0B';
      var k = 1024;
      var size = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(val) / Math.log(k));
      return (val / Math.pow(k, i)).toPrecision(3) + ' ' + size[i]
    }
  }
}
</script>
<style lang="less">
@import '../../../assets/css/less/reset_css/reset_table.less';
@import '../../../assets/css/less/reset_css/reset_invest.less';
@import '../../../assets/css/less/reset_css/reset_tab.less';
</style>



