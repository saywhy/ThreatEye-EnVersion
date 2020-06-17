
<template>
  <div id="invest_file"
       class="common_invest"
       v-loading.fullscreen.lock="file_search.loading">
    <div class="invest_box">
      <el-tabs v-model="activeName"
               class="reset_tab">
        <el-tab-pane label="File"
                     class="tabs-item"
                     name="first">
          <div class="invest_top">
            <el-input placeholder="File name"
                      class="search_box"
                      v-model="file_search.file_name"
                      clearable>
            </el-input>
            <el-input placeholder="Hash"
                      class="search_box"
                      v-model="file_search.md5"
                      clearable>
            </el-input>
            <el-input placeholder="Host"
                      class="search_box"
                      v-model="file_search.host_ip"
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
                      :data="file_list_data.data"
                      tooltip-effect="dark"
                      style="width: 100%">
              <el-table-column label="Item"
                               width="60">
                <template slot-scope="scope">
                  {{(file_search.page-1)*(file_search.rows) + scope.row.index_cn}}
                </template>
              </el-table-column>
              <el-table-column prop="timestamp"
                               width="320"
                               label="Time"
                               show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="file_name"
                               label="File Name"
                               show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="md5"
                               label="Hash"
                               show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="source"
                               label="Source"
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
                           :current-page="file_list.pageNow"
                           :page-sizes="[10,20,50,100]"
                           :page-size="10"
                           layout="total, sizes, prev, pager, next"
                           :total="file_list.count">
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
  name: "invest_file",
  components: {
    VmEmergePicker
  },
  data () {
    return {
      activeName: 'first',
      time_list: {
        time: []
      },
      file_search: {
        loading: false,
        file_name: '',
        md5: '',
        host_ip: '',
        start_time: "",
        end_time: "",
        page: 1,
        rows: 10
      },
      file_list: {
        count: 0,
        pageNow: 1,
      },
      file_list_data: {
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
          pathInfo: 'investigate/file-investigation',
        }
      })
        .then(response => {

        })
        .catch(error => {
          console.log(error);
        })
    },
    search () {
      this.file_search.page = 1
      this.file_list.pageNow = 1
      this.get_data();
    },
    get_data () {
      this.file_search.loading = true
      this.$axios.get('/yiiapi/investigate/file-investigation', {
        params: {
          file_name: this.file_search.file_name,
          md5: this.file_search.md5,
          host_ip: this.file_search.host_ip,
          start_time: this.file_search.start_time,
          end_time: this.file_search.end_time,
          current_page: this.file_search.page,
          per_page_count: this.file_search.rows
        }
      })
        .then(response => {
          this.file_search.loading = false
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
          this.file_list = data
          this.file_list_data = data.data
          this.file_list_data.data.forEach((item, index) => {
            item.index_cn = index + 1
          });
        })
        .catch(error => {
          console.log(error);
        })
    },
    // 重置
    reset () {
      this.file_search.file_name = ''
      this.file_search.md5 = ''
      this.file_search.host_ip = ''
      this.file_search.start_time = ''
      this.file_search.end_time = ''
      $(document.querySelector('.el-button--text')).trigger('click');
    },
    // 下载
    download () {
      if (!this.file_list.data || this.file_list.data.data.length == 0) {
        this.$message({
          type: 'warning',
          message: 'Please search for data before downloading'
        });
        return false
      }
      // if (this.file_list.count > 1000) {
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
          var url1 = "/yiiapi/investigate/file-investigation-export?file_name=" + this.file_search.file_name +
            '&md5=' + this.file_search.md5 +
            '&host_ip=' + this.file_search.host_ip +
            '&start_time=' + this.file_search.start_time +
            '&end_time=' + this.file_search.end_time +
            '&current_page=0&per_page_count=0';
          window.location.href = url1;
        })
        .catch(error => {
          console.log(error);
        })

    },
    // 分页
    handleSizeChange (val) {
      this.file_search.rows = val;
      this.file_search.page = 1
      this.get_data();
    },
    handleCurrentChange (val) {
      console.log(val);
      this.file_search.page = val
      this.get_data();
    },
    changeTime (data) {
      console.log(data);
      if (data) {
        this.file_search.start_time = parseInt(data[0].valueOf() / 1000);
        this.file_search.end_time = parseInt(data[1].valueOf() / 1000)
      } else {
        this.file_search.start_time = ''
        this.file_search.end_time = ''
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


