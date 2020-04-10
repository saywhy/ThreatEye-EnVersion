<template>
  <div id="invest_user"
       class="common_invest"
       v-loading.fullscreen.lock="user_search.loading">
    <div class="invest_box">
      <el-tabs v-model="activeName"
               class="reset_tab">
        <el-tab-pane label="User"
                     class="tabs-item"
                     name="first">
          <div class="invest_top">
            <el-input placeholder="User name"
                      class="search_box"
                      v-model="user_search.username"
                      clearable>
            </el-input>
            <el-input placeholder="Host"
                      class="search_box"
                      v-model="user_search.host_ip"
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
                      :data="user_list_data.data"
                      tooltip-effect="dark"
                      style="width: 100%">
              <el-table-column label="Item"
                               width="60">
                <template slot-scope="scope">
                  {{(user_search.page-1)*(user_search.rows) + scope.row.index_cn}}
                </template>
              </el-table-column>
              <el-table-column prop="timestamp"
                               width="320"
                               label="Time"
                               show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="username"
                               label="User Name"
                               show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="host_ip"
                               label="Host"
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
                           :current-page="user_list.pageNow"
                           :page-sizes="[10,20,50,100]"
                           :page-size="10"
                           layout="total, sizes, prev, pager, next"
                           :total="user_list.count">
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
  name: "invest_user",
  components: {
    VmEmergePicker
  },
  data () {
    return {
      activeName: 'first',
      time_list: {
        time: []
      },
      user_search: {
        loading: false,
        username: '',
        host_ip: '',
        start_time: "",
        end_time: "",
        page: 1,
        rows: 10
      },
      user_list: {
        count: 0,
        pageNow: 1,
      },
      user_list_data: {
      }
    };
  },
  methods: {
    search () {
      this.user_search.page = 1
      this.user_list.pageNow = 1
      this.get_data();
    },
    get_data () {
      this.user_search.loading = true
      this.$axios.get('/yiiapi/investigate/user-investigation', {
        params: {
          username: this.user_search.username,
          host_ip: this.user_search.host_ip,
          start_time: this.user_search.start_time,
          end_time: this.user_search.end_time,
          current_page: this.user_search.page,
          per_page_count: this.user_search.rows
        }
      })
        .then(response => {
          this.user_search.loading = false
          let { status, data } = response.data;
          if (data.count > 10000) {
            this.$message({
              type: 'warning',
              message: 'Over 10,000 search results returned, please narrow the search conditions.'
            });
            return false
          }
          this.user_list = data
          this.user_list_data = data.data
          this.user_list_data.data.forEach((item, index) => {
            item.index_cn = index + 1
          });
        })
        .catch(error => {
          console.log(error);
        })
    },
    // 重置
    reset () {
      this.user_search.username = ''
      this.user_search.host_ip = ''
      this.user_search.start_time = ''
      this.user_search.end_time = ''
      $(document.querySelector('.el-button--text')).trigger('click');
    },
    // 下载
    download () {
      if (!this.user_list.data || this.user_list.data.data.length == 0) {
        this.$message({
          type: 'warning',
          message: 'Please search for data before downloading'
        });
        return false
      }
      if (this.user_list.count > 1000) {
        this.$message({
          type: 'warning',
          message: 'Downloaded data cannot exceed 1000 records!'
        });
        return false
      }
      this.$axios.get('/yiiapi/site/check-auth-exist', {
        params: {
          pathInfo: 'yararule/download',
        }
      })
        .then(response => {
          var url1 = "/yiiapi/investigate/user-investigation-export?username=" + this.user_search.username +
            '&host_ip=' + this.user_search.host_ip +
            '&start_time=' + this.user_search.start_time +
            '&end_time=' + this.user_search.end_time +
            '&current_page=0&per_page_count=0';
          window.location.href = url1;
        })
        .catch(error => {
          console.log(error);
        })

    },
    // 分页
    handleSizeChange (val) {
      this.user_search.rows = val;
      this.user_search.page = 1
      this.get_data();
    },
    handleCurrentChange (val) {
      console.log(val);
      this.user_search.page = val
      this.get_data();
    },
    changeTime (data) {
      console.log(data);
      if (data) {
        this.user_search.start_time = parseInt(data[0].valueOf() / 1000);
        this.user_search.end_time = parseInt(data[1].valueOf() / 1000)
      } else {
        this.user_search.start_time = ''
        this.user_search.end_time = ''
      }
    }
  }
}
</script>
<style  lang="less">
@import '../../../assets/css/less/reset_css/reset_table.less';
@import '../../../assets/css/less/reset_css/reset_invest.less';
@import '../../../assets/css/less/reset_css/reset_tab.less';
</style>


