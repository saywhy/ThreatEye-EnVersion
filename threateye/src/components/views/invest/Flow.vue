<template>
  <div id="invest_flow"
       class="common_invest"
       v-loading.fullscreen.lock="flow_search.loading">
    <div class="invest_box">
      <el-tabs v-model="activeName"
               class="reset_tab">
        <el-tab-pane label="Flow Direction"
                     class="tabs-item"
                     name="first">
          <div class="invest_top">
            <el-select class="select_box"
                       v-model="flow_search.direction"
                       placeholder="Flow">
              <el-option v-for="item in flow_search.direction_list"
                         :key="item.type"
                         :label="item.name"
                         :value="item.type">
              </el-option>
            </el-select>
            <el-input placeholder="Host"
                      class="search_box"
                      v-model="flow_search.host_ip"
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
                      align="center"
                      border
                      class="reset_table"
                      :data="flow_list_data.data"
                      tooltip-effect="dark"
                      style="width: 100%">
              <el-table-column label="Item"
                               width="60">
                <template slot-scope="scope">
                  {{(flow_search.page-1)*(flow_search.rows) + scope.row.index_cn}}
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
              <el-table-column prop="dest_ip"
                               label="Destination IP"
                               show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="application"
                               label="Protocol"
                               show-overflow-tooltip>
              </el-table-column>
            </el-table>
            <el-pagination class="pagination_box"
                           @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           :current-page="flow_list.pageNow"
                           :page-sizes="[10,20,50,100]"
                           :page-size="10"
                           layout="total, sizes, prev, pager, next"
                           :total="flow_list.count">
            </el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import VmEmergePicker from "@/components/common/vm-emerge-picker";
import { eventBus } from '@/components/common/eventBus.js';
export default {
  name: "invest_flow",
  components: {
    VmEmergePicker
  },
  data () {
    return {
      activeName: 'first',
      time_list: {
        time: []
      },
      flow_search: {
        loading: false,
        direction_list: [
          { name: 'Intranet to extranet', type: '0' },
          { name: 'Extranet to intranet', type: '1' },
          { name: 'Intranet to intranet', type: '2' },
          { name: 'Others', type: '3' },
        ],
        direction: '0',
        host_ip: '',
        start_time: "",
        end_time: "",
        page: 1,
        rows: 10
      },
      flow_list: {
        count: 0,
        pageNow: 1,
      },
      flow_list_data: {
      }
    };
  },
  mounted () {
    this.test()
    this.check_passwd();
  },
  methods: {
    // 测试密码过期
    check_passwd () {
      this.$axios.get('/yiiapi/site/check-passwd-reset')
        .then((resp) => {
          let {
            status,
            msg,
            data
          } = resp.data;
          if (status == '602') {
            this.$message(
              {
                message: msg,
                type: 'warning',
              }
            );
            eventBus.$emit('reset')
          }
        })
    },
    // 测试600专用
    test () {
      this.$axios.get('/yiiapi/site/check-auth-exist', {
        params: {
          pathInfo: 'investigate/flow-direction-investigation',
        }
      })
        .then(response => {

        })
        .catch(error => {
          console.log(error);
        })
    },
    search () {
      this.flow_search.page = 1
      this.flow_list.pageNow = 1
      this.get_data();
    },
    get_data () {
      this.flow_search.loading = true
      console.log(this.flow_search);
      this.$axios.get('/yiiapi/investigate/flow-direction-investigation', {
        params: {
          flow_direction: this.flow_search.direction,
          host_ip: this.flow_search.host_ip,
          start_time: this.flow_search.start_time,
          end_time: this.flow_search.end_time,
          current_page: this.flow_search.page,
          per_page_count: this.flow_search.rows
        }
      })
        .then(response => {
          this.flow_search.loading = false
          let { status, data } = response.data;
          if (status == '602') {
            return false
          }
          // if (data.count > 10000) {
          //   this.$message({
          //     type: 'warning',
          //     message: 'Over 10,000 search results returned, please narrow the search conditions.'
          //   });
          //   return false
          // }
          this.flow_list = data
          this.flow_list_data = data.data
          this.flow_list_data.data.forEach((item, index) => {
            item.index_cn = index + 1
          });
        })
        .catch(error => {
          console.log(error);
        })
    },
    // 重置
    reset () {
      this.flow_search.direction = '0'
      this.flow_search.host_ip = ''
      this.flow_search.start_time = ''
      this.flow_search.end_time = ''
      $(document.querySelector('.el-button--text')).trigger('click');
    },
    // 下载
    download () {
      if (!this.flow_list.data || this.flow_list.data.data.length == 0) {
        this.$message({
          type: 'warning',
          message: 'Please search for data before downloading'
        });
        return false
      }
      // if (this.flow_list.count > 1000) {
      //   this.$message({
      //     type: 'warning',
      //     message: 'Downloaded data cannot exceed 1000 records!'
      //   });
      //   return false
      // }
      this.$axios.get('/yiiapi/site/check-auth-exist', {
        params: {
          pathInfo: 'yararule/download',
        }
      })
        .then(response => {
          var url1 = "/yiiapi/investigate/flow-direction-investigation-export?host_ip=" + this.flow_search.host_ip +
            '&flow_direction=' + this.flow_search.direction +
            '&start_time=' + this.flow_search.start_time +
            '&end_time=' + this.flow_search.end_time +
            '&current_page=0&per_page_count=0';
          window.location.href = url1;
        })
        .catch(error => {
          console.log(error);
        })

    },
    // 分页
    handleSizeChange (val) {
      this.flow_search.rows = val;
      this.flow_search.page = 1
      this.get_data();
    },
    handleCurrentChange (val) {
      console.log(val);
      this.flow_search.page = val
      this.get_data();
    },
    changeTime (data) {
      console.log(data);
      if (data) {
        this.flow_search.start_time = parseInt(data[0].valueOf() / 1000);
        this.flow_search.end_time = parseInt(data[1].valueOf() / 1000)
      } else {
        this.flow_search.start_time = ''
        this.flow_search.end_time = ''
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
<style  lang="less">
@import '../../../assets/css/less/reset_css/reset_table.less';
@import '../../../assets/css/less/reset_css/reset_invest.less';
@import '../../../assets/css/less/reset_css/reset_tab.less';
</style>


