<template>
  <div id="invest_dns"
       class="common_invest"
       v-loading.fullscreen.lock="dns_search.loading">
    <div class="invest_box">
      <el-tabs v-model="activeName"
               class="reset_tab">
        <el-tab-pane label="DNS"
                     class="tabs-item"
                     name="first">
          <div class="invest_top">
            <el-input placeholder="Host IP"
                      class="search_box"
                      v-model="dns_search.host_ip"
                      clearable>
            </el-input>
            <el-input placeholder="DNS server IP"
                      class="search_box"
                      v-model="dns_search.dns_ip"
                      clearable>
            </el-input>
            <el-input placeholder="Domain"
                      class="search_box"
                      v-model="dns_search.domain"
                      clearable>
            </el-input>
            <el-input placeholder="TTL"
                      class="search_box"
                      v-model="dns_search.ttl"
                      clearable>
            </el-input>
            <vm-emerge-picker @changeTime='changeTime'
                              :option='time_list'></vm-emerge-picker>
            <el-button class="btn_i"
                       @click="search"> Search</el-button>
            <span class="reset"
                  @click="reset"
                  style="cursor: pointer">Reset</span>
            <el-button class="btn_right"
                       @click="download">Download</el-button>
          </div>
          <div class="invest_bom">
            <el-table ref="multipleTable"
                      align="center"
                      border
                      class="reset_table"
                      :data="dns_list.data"
                      tooltip-effect="dark"
                      style="width: 100%">
              <el-table-column label="Item"
                               width="60">
                <template slot-scope="scope">
                  {{(dns_search.page-1)*(dns_search.rows) + scope.row.index_cn}}
                </template>
              </el-table-column>
              <el-table-column prop="timestamp"
                               label="Time"
                               width="320"
                               show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="dns_ip"
                               label="DNS Server IP"
                               show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="host_ip"
                               label="Host"
                               show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="type"
                               label="Type"
                               show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="rrname"
                               label="Domain"
                               show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="rdata"
                               label="Resolved Address"
                               show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="ttl"
                               label="TTL"
                               show-overflow-tooltip>
              </el-table-column>
            </el-table>
            <el-pagination class="pagination_box"
                           @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           :current-page="dns_list.pageNow"
                           :page-sizes="[10,20,50,100]"
                           :page-size="10"
                           layout="total, sizes, prev, pager, next"
                           :total="dns_list.count">
            </el-pagination>
          </div>

        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import vmEmergePicker from "@/components/common/vm-emerge-picker";
import { eventBus } from '@/components/common/eventBus.js';
export default {
  name: "invest_dns",
  components: {
    vmEmergePicker,
  },
  data () {
    return {
      activeName: 'first',
      time_list: {
        time: []
      },
      dns_search: {
        loading: false,
        host_ip: '',
        dns_ip: '',
        domain: '',
        resolve_ip: '',
        ttl: '',
        resolve_result: '',
        start_time: '',
        end_time: '',
        page: 1,
        rows: 10
      },
      dns_list: {
        count: 0,
        pageNow: 1,
      }
    };
  },
  computed: {

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
          pathInfo: 'investigate/dns-investigation',
        }
      })
        .then(response => {

        })
        .catch(error => {
          console.log(error);
        })
    },
    search () {
      this.dns_list.pageNow = 1
      this.dns_search.page = 1
      this.get_data();
    },
    get_data () {
      this.dns_search.loading = true
      this.$axios.get('/yiiapi/investigate/dns-investigation', {
        params: {
          host_ip: this.dns_search.host_ip,
          dns_ip: this.dns_search.dns_ip,
          domain: this.dns_search.domain,
          resolve_ip: this.dns_search.resolve_ip,
          ttl: this.dns_search.ttl,
          resolve_result: this.dns_search.resolve_result,
          start_time: this.dns_search.start_time,
          end_time: this.dns_search.end_time,
          current_page: this.dns_search.page,
          per_page_count: this.dns_search.rows
        }
      })
        .then(response => {
          this.dns_search.loading = false
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
          this.dns_list = data
          this.dns_list.data.forEach((item, index) => {
            item.index_cn = index + 1
          });
        })
        .catch(error => {
          console.log(error);
        })
    },
    // 重置
    reset () {
      this.dns_search.host_ip = ''
      this.dns_search.dns_ip = ''
      this.dns_search.domain = ''
      this.dns_search.ttl = ''
      this.dns_search.start_time = ''
      this.dns_search.end_time = ''
      $(document.querySelector('.el-button--text')).trigger('click');
    },
    // 下载
    download () {
      console.log(this.dns_list);
      if (!this.dns_list.data) {
        this.$message({
          type: 'warning',
          message: 'Please search for data before downloading'
        });
        return false
      }
      // if (this.dns_list.count > 1000) {
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
          var url2 = "/yiiapi/investigate/dns-investigation-export?host_ip=" + this.dns_search.host_ip + "&dns_ip=" + this.dns_search.dns_ip + '&domain=' + this.dns_search.domain + '&resolve_ip=' + this.dns_search.resolve_ip + '&ttl=' + this.dns_search.ttl + '&resolve_result=' + this.dns_search.resolve_result + '&start_time=' + this.dns_search.start_time + '&end_time=' + this.dns_search.end_time + '&current_page=0&per_page_count=0';
          window.location.href = url2;
        })
        .catch(error => {
          console.log(error);
        })
    },
    // 分页
    handleSizeChange (val) {
      this.dns_search.rows = val;
      this.dns_search.page = 1
      this.get_data();
    },
    handleCurrentChange (val) {
      console.log(val);
      this.dns_search.page = val
      this.get_data();
    },
    changeTime (data) {
      console.log(data);
      if (data) {
        this.dns_search.start_time = parseInt(data[0].valueOf() / 1000);
        this.dns_search.end_time = parseInt(data[1].valueOf() / 1000)
      } else {
        this.dns_search.start_time = ''
        this.dns_search.end_time = ''
      }
    },
  }
}
</script>
<style  lang="less">
@import '../../../assets/css/less/reset_css/reset_table.less';
@import '../../../assets/css/less/reset_css/reset_invest.less';
@import '../../../assets/css/less/reset_css/reset_tab.less';
</style>
