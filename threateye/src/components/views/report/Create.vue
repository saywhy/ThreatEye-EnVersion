<template>
  <div id="report_create"
       v-loading.fullscreen.lock="report.loading">
    <div class="r_top">
      <div class="r_content_top">
        <h3 class="title">Generate Reports</h3>
      </div>
      <el-form class="r_content_main">
        <el-row type="flex"
                class="r_main_list">
          <el-col :span="3">
            <span class="title">Time Range</span>
          </el-col>
          <el-col :span="21">
            <div class="r_time">
              <vm-emerge-picker @changeTime='changeTime'></vm-emerge-picker>
            </div>
          </el-col>
        </el-row>
        <el-row type="flex"
                class="r_main_list">
          <el-col :span="3">
            <span class="title">Format</span>
          </el-col>
          <el-col :span="21">
            <div class="r_radio">
              <el-radio v-model="report.type"
                        label="csv"
                        class="r_radio_item">Excel</el-radio>
              <el-radio v-model="report.type"
                        label="doc"
                        class="r_radio_item">Word</el-radio>
              <el-radio v-model="report.type"
                        label="pdf"
                        class="r_radio_item">PDF</el-radio>
            </div>
          </el-col>
        </el-row>
        <el-row type="flex"
                class="r_main_list r_special_list">
          <el-col :span="3">
            <span class="title">Report Name</span>
          </el-col>
          <el-col :span="21">
            <el-input class="report-input"
                      placeholder="Please enter the report name"
                      v-model="report.name"
                      clearable>
            </el-input>
          </el-col>
          <div class="r_btn_group">
            <el-button class="b_btn b_ok"
                       @click="create">Generate</el-button>
            <el-button class="b_btn b_cancel"
                       @click="reseet">Cancel</el-button>
          </div>
        </el-row>
      </el-form>
    </div>
    <div class="r_bottom">
      <el-row class="common-table-pattern">
        <el-col :span="24">
          <el-table class="reset_table"
                    align="center"
                    border
                    ref="multipleTable"
                    :data="report_lsit.data"
                    style="width: 100%;"
                    @selection-change="handleSelectionChange">
            <el-table-column label="Item"
                             width="80">
              <template slot-scope="scope">
                {{(report_data.page-1)*(report_data.rows) + scope.row.index_cn}}
              </template>
            </el-table-column>
            <el-table-column prop="create_time"
                             label="Created Time"></el-table-column>
            <el-table-column prop="report_name"
                             label="Name"></el-table-column>
            <el-table-column label='Time Range'>
              <template slot-scope="scope">
                <span>{{scope.row.stime}}</span>
                <span>-</span>
                <span>{{scope.row.etime}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="report_type"
                             label="Format"></el-table-column>
            <el-table-column label='Action'>
              <template slot-scope="scope">
                <img src="@/assets/images/common/download.png"
                     class="img_icon"
                     alt=""
                     @click.stop='download(scope.row)'>
                <img src="@/assets/images/common/delete.png"
                     class="img_icon"
                     alt=""
                     @click.stop='del_box(scope.row)'>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="24"
                class="e-pagination">
          <el-pagination style="margin-top:24px;"
                         @size-change="handleSizeChange"
                         @current-change="handleCurrentChange"
                         :current-page="report_lsit.pageNow"
                         :page-sizes="[10,20,50,100]"
                         :page-size="10"
                         layout="total, sizes, prev, pager, next"
                         :total="report_lsit.count">
          </el-pagination>
        </el-col>
      </el-row>
    </div>
    <div class="echarts">
      <!-- 未处理告警 -->
      <div id="untreatedalarm_report"></div>
      <!-- // 柱状图-威胁应用协议 -->
      <div id="application_protocol"></div>
      <!-- 告警趋势 -->
      <div id="alert_trend"></div>
      <!-- 威胁类型 -->
      <div id="alert_type"></div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import VmEmergePicker from "@/components/common/vm-emerge-picker";
import { eventBus } from '@/components/common/eventBus.js';
export default {
  name: "report_create",
  data () {
    return {
      report: {
        name: '',
        type: 'csv',
        start_time: '',
        end_time: '',
        loading: false
      },
      report_data: {
        page: 1,
        rows: 10
      },
      report_lsit: {},
      untreatedAlarm_data: {
        low_total_count: 0,
        medium_total_count: 0,
        high_total_count: 0,
        base64: ''
      },
      application_protocol_data: {
        application_protocol_name: [],
        application_protocol_value: [],
        base64: ''
      },
      alert_trend_data: {
        alert_trend_name: [],
        alert_trend_value: [],
        base64: '',
      },
      alert_type_data: {
        alert_type_name: [],
        alert_type_value: [],
        base64: '',
      },
    }
  },
  components: { VmEmergePicker },
  mounted () {
    this.get_data()
    this.check_passwd()
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
    // 生成报表
    create () {
      if (this.report.name == '') {
        this.$message(
          {
            message: 'Please enter the report name',
            type: 'warning',
          }
        );
        return false
      }
      if (this.report.start_time == '' || this.report.end_time == '') {
        this.$message(
          {
            message: 'Please select a time range',
            type: 'warning',
          }
        );
        return false
      }
      this.report.loading = true
      if (this.report.type == 'doc') {
        this.$axios.get('/yiiapi/report/create-echarts-img', {
          params: {
            stime: this.report.start_time,
            etime: this.report.end_time,
            report_name: this.report.name,
            report_type: 'doc',
          }
        })
          .then(response => {
            let { status, data } = response.data;
            console.log(data);
            // 未处理告警
            if (data.threat_level) {
              this.untreatedAlarm(data.threat_level);
            }
            //威胁使用应用协议
            if (data.threat_protocol) {
              this.application_protocol(data.threat_protocol);
            }
            //告警趋势
            if (data.alert_trend) {
              this.alert_trend(data.alert_trend);
            }
            //告警类型
            if (data.alert_type) {
              this.alert_type(data.alert_type);
            }
            setTimeout(() => {
              this.$axios.post('/yiiapi/report/create-report', {
                stime: this.report.start_time,
                etime: this.report.end_time,
                report_name: this.report.name,
                report_type: 'doc',
                threat_level: this.untreatedAlarm_data.base64,
                threat_protocol: this.application_protocol_data.base64,
                alert_type: this.alert_type_data.base64,
                alert_trend: this.alert_trend_data.base64,
              })
                .then(response => {
                  let { status, data, msg } = response.data;
                  this.report.loading = false
                  if (status == 0) {
                    this.get_data();
                    this.$message(
                      {
                        message: 'Report generated successfully',
                        type: 'success',
                      }
                    );
                  } else if (status == 602) {
                    this.$message(
                      {
                        message: msg,
                        type: 'warning',
                      }
                    );
                  } else {
                    this.$message(
                      {
                        message: msg,
                        type: 'error',
                      }
                    );
                  }
                })
                .catch(error => {
                  console.log(error);
                })
            }, 100);
          })
          .catch(error => {
            console.log(error);
          })
      }
      if (this.report.type == 'csv') {
        this.$axios.post('/yiiapi/report/create-report', {
          stime: this.report.start_time,
          etime: this.report.end_time,
          report_name: this.report.name,
          report_type: 'csv',
        })
          .then(response => {
            this.report.loading = false
            let { status, data, msg } = response.data;
            if (status == 0) {
              this.get_data();
              this.$message(
                {
                  message: 'Report generated successfully',
                  type: 'success',
                }
              );
            } else if (status == 602) {
              this.$message(
                {
                  message: msg,
                  type: 'warning',
                }
              );
            } else {
              this.$message(
                {
                  message: msg,
                  type: 'error',
                }
              );
            }
          })
          .catch(error => {
            console.log(error);
          })
      }
      if (this.report.type == 'pdf') {
        this.$axios.get('/yiiapi/report/create-echarts-img', {
          params: {
            stime: this.report.start_time,
            etime: this.report.end_time,
            report_name: this.report.name,
            report_type: 'pdf',
          }
        })
          .then(response => {
            let { status, data } = response.data;
            console.log(data);
            // 未处理告警
            if (data.threat_level) {
              this.untreatedAlarm(data.threat_level);
            }
            //威胁使用应用协议
            if (data.threat_protocol) {
              this.application_protocol(data.threat_protocol);
            }
            //告警趋势
            if (data.alert_trend) {
              this.alert_trend(data.alert_trend);
            }
            //告警类型
            if (data.alert_type) {
              this.alert_type(data.alert_type);
            }
            setTimeout(() => {
              this.$axios.post('/yiiapi/report/create-report', {
                stime: this.report.start_time,
                etime: this.report.end_time,
                report_name: this.report.name,
                report_type: 'pdf',
                threat_level: this.untreatedAlarm_data.base64,
                threat_protocol: this.application_protocol_data.base64,
                alert_type: this.alert_type_data.base64,
                alert_trend: this.alert_trend_data.base64,
              })
                .then(response => {
                  this.report.loading = false
                  let { status, data, msg } = response.data;
                  if (status == 0) {
                    this.get_data();
                    this.$message(
                      {
                        message: 'Report generated successfully',
                        type: 'success',
                      }
                    );
                  } else if (status == 602) {
                    this.$message(
                      {
                        message: msg,
                        type: 'warning',
                      }
                    );
                  } else {
                    this.$message(
                      {
                        message: msg,
                        type: 'error',
                      }
                    );
                  }
                })
                .catch(error => {
                  console.log(error);
                })
            }, 100);
          })
          .catch(error => {
            console.log(error);
          })
      }
    },
    untreatedAlarm (params) {
      if (params.length == 0) {
        this.untreatedAlarm_data.low_total_count = 0;
        this.untreatedAlarm_data.medium_total_count = 0;
        this.untreatedAlarm_data.high_total_count = 0;
      } else {
        params.forEach(element => {
          if (element.degree == "low") {
            this.untreatedAlarm_data.low_total_count = element.total_count
          } else if (element.degree == "medium") {
            this.untreatedAlarm_data.medium_total_count = element.total_count
          } else if (element.degree == "high") {
            this.untreatedAlarm_data.high_total_count = element.total_count
          }
        });
      }
      var myChart = this.$echarts.init(document.getElementById("untreatedalarm_report"));
      var option = {
        tooltip: {
          trigger: 'item',
          formatter: "{b}:{c}({d}%)"
        },
        grid: {
          show: true,
          left: 'center',
          right: 'center',
          top: 'center',
          bottom: 'center'
        },
        series: [{
          name: 'Unresolved Alerts',
          type: 'pie',
          animation: false,
          radius: '60%',
          center: ['50%', '50%'],
          hoverAnimation: false, //是否开启 hover 在扇区上的放大动画效果。
          hoverOffset: 0, //高亮扇区的偏移距离。
          selectedMode: 'single',
          data: [{
            value: this.untreatedAlarm_data.high_total_count,
            name: 'High',
            itemStyle: {
              normal: {
                color: '#962116'
              }
            }
          },
          {
            value: this.untreatedAlarm_data.medium_total_count,
            name: 'Medium',
            itemStyle: {
              normal: {
                color: '#F5BF41'
              }
            }
          },
          {
            value: this.untreatedAlarm_data.low_total_count,
            name: 'Low',
            itemStyle: {
              normal: {
                color: '#4AA46E'
              }
            }
          }
          ],
          itemStyle: {
            normal: {
              label: {
                show: true,
                formatter: '{b} : {c} \n ({d}%)'
              },
              labelLine: {
                show: true
              }
            },
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      };
      myChart.setOption(option);
      this.untreatedAlarm_data.base64 = myChart.getDataURL();
    },
    application_protocol (params) {
      this.application_protocol_data.application_protocol_name = [];
      this.application_protocol_data.application_protocol_value = [];
      params.forEach(element => {
        this.application_protocol_data.application_protocol_name.push(element.application);
        this.application_protocol_data.application_protocol_value.push(element.count);
      });
      var myChart = this.$echarts.init(document.getElementById("application_protocol"));
      var option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '5%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: this.application_protocol_data.application_protocol_name,
          axisTick: {
            show: false
          },
          axisLabel: {
            // interval: 0,
            rotate: '60',
            margin: 5,
            textStyle: {
              fontSize: 16
            }
          }
        },
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false
          },
          axisLabel: {
            margin: 3,
            textStyle: {
              fontSize: 16
            }
          }
        }],
        series: [{
          // name: '高危',
          type: 'bar',
          barWidth: 20,
          animation: false,
          stack: 'abc',
          itemStyle: {
            normal: {
              barBorderRadius: [4, 4, 4, 4], //柱形图圆角，初始化效果
              color: 'rgba(150,33,22,.8)'
            }
          },
          data: this.application_protocol_data.application_protocol_value
        }]
      };
      myChart.setOption(option);
      this.application_protocol_data.base64 = myChart.getDataURL();
    },

    alert_trend (params) {
      console.log(params);
      this.alert_trend_data.alert_trend_name = [];
      this.alert_trend_data.alert_trend_value = [];
      params.forEach(element => {
        this.alert_trend_data.alert_trend_name.push(element.date_time);
        this.alert_trend_data.alert_trend_value.push(element.count - 0);
      });
      console.log(this.alert_trend_data);
      var myChart = this.$echarts.init(document.getElementById("alert_trend"));
      var option_file = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '5%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: this.alert_trend_data.alert_trend_name,
          axisTick: {
            show: false
          },
          axisLabel: {
            // interval: 0,
            rotate: '60',
            margin: 5,
            textStyle: {
              fontSize: 16
            }
          }
        },
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false
          },
          axisLabel: {
            margin: 5,
            textStyle: {
              fontSize: 16
            }
          }
        }],
        series: [{
          // name: '高危',
          type: 'bar',
          barWidth: 20,
          animation: false,
          stack: '111',
          itemStyle: {
            normal: {
              barBorderRadius: [4, 4, 4, 4], //柱形图圆角，初始化效果
              color: 'rgba(150,33,22,.8)'
            }
          },
          data: this.alert_trend_data.alert_trend_value
        }]
      };
      myChart.setOption(option_file);
      this.alert_trend_data.base64 = myChart.getDataURL();
    },
    alert_type (params) {
      this.alert_type_data.alert_type_name = [];
      this.alert_type_data.alert_type_value = [];
      params.forEach(element => {
        this.alert_type_data.alert_type_name.push(element.alert_type);
        this.alert_type_data.alert_type_value.push(element.alert_count);
      });
      var myChart = this.$echarts.init(document.getElementById("alert_type"));
      var option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '5%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: this.alert_type_data.alert_type_name,
          axisTick: {
            show: false
          },
          axisLabel: {
            // interval: 0,
            rotate: '60',
            margin: 5,
            textStyle: {
              fontSize: 16
            }
          }
        },
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false
          },
          axisLabel: {
            margin: 5,
            textStyle: {
              fontSize: 16
            }
          }
        }],
        series: [{
          // name: '高危',
          type: 'bar',
          barWidth: 20,
          animation: false,
          stack: 'abc',
          itemStyle: {
            normal: {
              barBorderRadius: [4, 4, 4, 4], //柱形图圆角，初始化效果
              color: 'rgba(150,33,22,.8)'
            }
          },
          data: this.alert_type_data.alert_type_value
        }]
      };
      myChart.setOption(option);
      this.alert_type_data.base64 = myChart.getDataURL();
    },
    // 取消
    reseet () {
      this.report.name = ''
      this.report.type = 'csv'
      this.report.start_time = ''
      this.report.end_time = ''
      $(document.querySelector('.el-button--text')).trigger('click');
    },
    // 获取列表
    get_data () {
      this.$axios.get('/yiiapi/report/list', {
        params: {
          page: this.report_data.page,
          rows: this.report_data.rows,
        }
      })
        .then(response => {
          let { status, data } = response.data;
          console.log(status);
          this.report_lsit = data
          this.report_lsit.data.forEach((item, index) => {
            item.index_cn = index + 1
          });
        })
        .catch(error => {
          console.log(error);
        })
    },
    // 下载
    download (item) {
      console.log(item);
      this.$axios.get('/yiiapi/site/check-auth-exist', {
        params: {
          pathInfo: 'yararule/download',
        }
      })
        .then(response => {
          var url1 = '/yiiapi/report/download-report?id=' + item.id;
          window.location.href = url1;
        })
        .catch(error => {
          console.log(error);
        })

    },
    // 删除
    del_box (item) {
      this.$confirm('This action deletes the item. Do you want to continue?', 'Message', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.$axios.delete('/yiiapi/report/delete', {
          data: {
            id: item.id,
            report_name: item.report_name
          }
        })
          .then(response => {
            let { status, data } = response.data;
            if (status == 0) {
              this.get_data();
              this.$message(
                {
                  message: 'Deleted successfully',
                  type: 'success',
                }
              );
            } else {
              this.$message(
                {
                  message: 'Delete Failure',
                  type: 'error',
                }
              );
            }
          })
          .catch(error => {
            console.log(error);
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Delete Cancelled'
        });
      });

    },
    changeTime (data) {
      console.log(data);
      this.report.start_time = parseInt(data[0].valueOf() / 1000)
      this.report.end_time = parseInt(data[1].valueOf() / 1000)
    },
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange (val) {
      // this.multipleSelection = val;
    },
    // 分页
    handleSizeChange (val) {
      this.report_data.rows = val;
      this.report_data.page = 1
      this.get_data();
    },
    handleCurrentChange (val) {
      this.report_data.page = val
      this.get_data();
    },
  }
}
</script>

<style scoped lang="less">
@import '../../../assets/css/less/report_less/rewrite_radio.less';
#report_create {
  padding: 24px;
  .r_top {
    background: #fff;
    font-family: PingFangMedium;
    border-bottom: 1px solid #ececec;

    .r_content_top {
      height: 80px;
      line-height: 80px;
      text-align: left;
      border-bottom: 1px solid #ececec;
      .title {
        font-size: 18px;
        color: #333333;
        padding: 0 24px;
      }
    }
    .r_content_main {
      padding: 0 24px;
      text-align: left;
      .r_main_list {
        height: 62px;
        line-height: 60px;
        border-bottom: 1px solid #ececec;
        .title {
          font-size: 14px;
          color: #333;
        }
        .r_time {
          line-height: 58px;
        }
        .r_radio {
          .r_radio_item {
            font-size: 14px;
            color: #333;
          }
        }
        &.r_special_list {
          border-width: 0;
          height: auto;
          min-height: 164px;
          position: relative;
          .report-input {
            width: 280px;
          }
          .r_btn_group {
            position: absolute;
            left: 0;
            bottom: 24px;
            text-align: left;
            height: 42px;
            z-index: 999;
            font-size: 0;
            /deep/ .b_btn {
              width: 136px;
              height: 42px;
              font-size: 16px;
              vertical-align: text-bottom;
              border: 1px solid #0070ff;
              &.b_ok {
                background: #0070ff;
                color: #fff;
              }
              &.b_cancel {
                background: #fff;
                color: #0070ff;
                margin-left: 24px;
              }
            }
          }
        }
      }
    }
  }
  .r_middle {
    height: 90px;
    width: 100%;
    background: #fff;
    position: relative;
    text-align: left;
    padding: 0 24px;
    .r_btn_middle_group {
      position: absolute;
      top: 24px;
      height: 42px;
      z-index: 999;
      font-size: 0;
      .b_btn {
        width: 148px;
        height: 42px;
        font-size: 16px;
        vertical-align: text-bottom;
        border: 1px solid #0070ff;
        &.b_download {
          background: #0070ff;
          color: #fff;
        }
        &.b_delete {
          background: #fff;
          color: #0070ff;
          margin-left: 8px;
        }
      }
    }
  }
  .r_bottom {
    background: #fff;
    padding: 24px;
    min-height: 441px;
  }
  .img_icon {
    cursor: pointer;
    margin-right: 10px;
  }
  .echarts {
    display: none;
  }
  #untreatedalarm_report,
  #application_protocol,
  #alert_trend,
  #alert_type {
    border: 1px solid red;
    width: 1000px;
    height: 600px;
  }
}
</style>

<style lang="less">
@import '../../../assets/css/less/reset_css/reset_table.less';
</style>
