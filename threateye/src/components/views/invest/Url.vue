<template>
  <div id="invest_url"
       class="common_invest"
       v-loading.fullscreen.lock="url_search.loading">
    <div class="invest_box">
      <el-tabs v-model="activeName"
               class="reset_tab">
        <el-tab-pane label="IP/URL"
                     class="tabs-item"
                     name="first">
          <div class="invest_top">
            <el-input placeholder="Source IP"
                      class="search_box"
                      v-model="url_search.src_ip"
                      clearable>
            </el-input>
            <el-input placeholder="Source port"
                      class="search_box"
                      v-model="url_search.src_port"
                      clearable>
            </el-input>
            <el-input placeholder="Destination IP"
                      class="search_box"
                      v-model="url_search.dst_ip"
                      clearable>
            </el-input>
            <el-input placeholder="Destination port"
                      class="search_box"
                      v-model="url_search.dst_port"
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
                      border
                      :data="url_list_data.data"
                      tooltip-effect="dark"
                      style="width: 100%">
              <el-table-column label="Item"
                               width="60">
                <template slot-scope="scope">
                  {{(url_search.page-1)*(url_search.rows) + scope.row.index_cn}}
                </template>
              </el-table-column>
              <el-table-column prop="timestamp"
                               width="320"
                               label="Time"
                               show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="src_ip"
                               label="Source IP"
                               show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="src_port"
                               label="Source Port"
                               show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="dest_ip"
                               label="Destination IP"
                               show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="dest_port"
                               label="Destination Port"
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
                           :current-page="url_list.pageNow"
                           :page-sizes="[10,20,50,100]"
                           :page-size="10"
                           layout="total, sizes, prev, pager, next"
                           :total="url_list.count">
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
  name: "invest_url",
  components: {
    VmEmergePicker
  },
  data () {
    return {
      activeName: 'first',
      time_list: {
        time: []
      },
      url_search: {
        loading: false,
        src_ip: '',
        dst_ip: '',
        src_port: '',
        dst_port: '',
        email: "",
        start_time: "",
        end_time: "",
        page: 1,
        rows: 10
      },
      url_list: {
        count: 0,
        pageNow: 1,
      },
      url_list_data: {
      }
    };
  },
  mounted () {
    this.check_passwd();
    console.log(this.$route.query);
    if (this.$route.query.src_ip && this.$route.query.src_ip != '') {
      this.url_search.src_ip = this.$route.query.src_ip;
      this.get_data();
    }
    if (this.$route.query.dest_ip && this.$route.query.dest_ip != '') {
      this.url_search.dst_ip = this.$route.query.dest_ip;
      this.get_data();
    }
    this.test()
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
          pathInfo: 'investigate/ipurl-communication-investigation',
        }
      })
        .then(response => {

        })
        .catch(error => {
          console.log(error);
        })
    },
    search () {
      this.url_search.page = 1
      this.url_list.pageNow = 1
      this.get_data();
    },
    get_data () {
      this.url_search.loading = true
      this.$axios.get('/yiiapi/investigate/ipurl-communication-investigation', {
        params: {
          src_ip: this.url_search.src_ip,
          dst_ip: this.url_search.dst_ip,
          src_port: this.url_search.src_port,
          dst_port: this.url_search.dst_port,
          email: this.url_search.email,
          start_time: this.url_search.start_time,
          end_time: this.url_search.end_time,
          current_page: this.url_search.page,
          per_page_count: this.url_search.rows
        }
      })
        .then(response => {
          // this.$set(this.url_search, 'loading', false)
          this.url_search.loading = false
          console.log(this.url_search.loading);
          console.log(response);
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
          this.url_list = data
          this.url_list_data = data.data
          this.url_list_data.data.forEach((item, index) => {
            item.index_cn = index + 1
          });
        })
        .catch(error => {
          this.url_search.loading = false
          console.log(error);
        })
    },
    // 重置
    reset () {
      this.url_search.src_ip = ''
      this.url_search.dst_ip = ''
      this.url_search.src_port = ''
      this.url_search.dst_port = ''
      this.url_search.start_time = ''
      this.url_search.end_time = ''
      $(document.querySelector('.el-button--text')).trigger('click');
    },
    // 下载
    download () {
      if (!this.url_list.data || this.url_list.data.data.length == 0) {
        this.$message({
          type: 'warning',
          message: 'Please search for data before downloading'
        });
        return false
      }
      // if (this.url_list.count > 1000) {
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
          var url1 = "/yiiapi/investigate/ipurl-communication-investigation-export?src_ip=" + this.url_search.src_ip +
            '&dst_ip=' + this.url_search.dst_ip +
            '&src_port=' + this.url_search.src_port +
            '&dst_port=' + this.url_search.dst_port +
            '&email=' + this.url_search.email +
            '&start_time=' + this.url_search.start_time +
            '&end_time=' + this.url_search.end_time +
            '&current_page=0&per_page_count=0';
          window.location.href = url1;
        })
        .catch(error => {
          console.log(error);
        })
    },
    // 分页
    handleSizeChange (val) {
      this.url_search.rows = val;
      this.url_search.page = 1
      this.get_data();
    },
    handleCurrentChange (val) {
      console.log(val);
      this.url_search.page = val
      this.get_data();
    },
    changeTime (data) {
      console.log(data);
      if (data) {
        this.url_search.start_time = parseInt(data[0].valueOf() / 1000);
        this.url_search.end_time = parseInt(data[1].valueOf() / 1000)
      } else {
        this.url_search.start_time = ''
        this.url_search.end_time = ''
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

