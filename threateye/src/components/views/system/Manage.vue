<template>
  <div id="equipment">
    <div class="container">
      <div class="top">
        <div class="item"
             :class="{'left_active':activeDiv=='1'}"
             @click="chooseDiv('1')">
          <div class="item_left">
            <img class="img_box"
                 src="@/assets/images/setting/yq.png"
                 alt="">
          </div>
          <div class="item_right">
            <p class="item_right_title left_title">Engine</p>
            <p class="">
              <span class="green"></span>
              <span>Online:
                <span>{{equipment_top.engine.online_count}}</span>
              </span>
              <span class="red"></span>
              <span> Offline:
                <span>{{equipment_top.engine.offline_count}}</span>
              </span>
            </p>
          </div>
        </div>
        <div class="mid item "
             :class="{'left_active':activeDiv=='2'}"
             @click="chooseDiv('2')">
          <div class="item_left">
            <img class="img_box"
                 src="@/assets/images/setting/yt.png"
                 alt="">
          </div>
          <div class="item_right">
            <p class="item_right_title ">Engine/Sensor</p>
            <p class="">
              <span class="green"></span>
              <span>Online:
                <span>{{equipment_top.sensor_engine.online_count}}</span>
              </span>
              <span class="red"></span>
              <span> Offline:
                <span>{{equipment_top.sensor_engine.offline_count}}</span>
              </span>
            </p>
          </div>
        </div>
        <div class="mid item "
             :class="{'left_active':activeDiv=='3'}"
             @click="chooseDiv('3')">
          <div class="item_left">
            <img class="img_box"
                 src="@/assets/images/setting/tz.png"
                 alt="">
          </div>
          <div class="item_right">
            <p class="item_right_title ">Sensor</p>
            <p class="">
              <span class="green"></span>
              <span>Online:
                <span>{{equipment_top.sensor.online_count}}</span>
              </span>
              <span class="red"></span>
              <span> Offline:
                <span>{{equipment_top.sensor.offline_count}}</span>
              </span>
            </p>
          </div>
        </div>
        <div class="right item "
             :class="{'left_active':activeDiv=='4'}"
             @click="chooseDiv('4')"
             v-if="sandbox_show">
          <div class="item_left">
            <img class="img_box"
                 src="@/assets/images/setting/sb.png"
                 alt="">
          </div>
          <div class="item_right">
            <p class="item_right_title ">Sandbox</p>
            <p class="">
              <span class="green"></span>
              <span>Online:
                <span>{{equipment_top.sandbox.online_count}}</span>
              </span>
              <span class="red"></span>
              <span> Offline:
                <span>{{equipment_top.sandbox.offline_count}}</span>
              </span>
            </p>
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="btn_box">
          <el-button type="primary"
                     class="btn_i"
                     v-if="sandbox_show"
                     @click="add_box">Add</el-button>
          <el-button type="primary"
                     class="btn_o"
                     @click="del_equipment">Delete</el-button>
        </div>
        <div class="equipment_table">
          <el-table ref="multipleTable"
                    class="reset_table"
                    align="center"
                    border
                    :data="equipment_list.list"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="handleSelectionChange"
                    @row-click="alert_detail">
            <el-table-column type="selection"
                             width="50">
            </el-table-column>
            <el-table-column label="Item"
                             width="80">
              <template slot-scope="scope">
                {{(equipment_data.page-1)*(equipment_data.rows) + scope.row.index_cn}}
              </template>
            </el-table-column>
            <el-table-column label='Device Name'>
              <template slot-scope="scope">
                <span class="color_span"
                      @click.stop='alert_detail(scope.row)'>{{scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="type"
                             label="Device Type"
                             show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.type=='1'">Sensor</span>
                <span v-if="scope.row.type=='2'">Engine</span>
                <span v-if="scope.row.type=='3'">Engine/Sensor</span>
                <span v-if="scope.row.type=='4'">Sandbox</span>
              </template>
            </el-table-column>
            <el-table-column label='Device IP'>
              <template slot-scope="scope">
                <span class="color_span"
                      @click.stop='alert_detail(scope.row)'>{{scope.row.ip}}</span>
              </template>
            </el-table-column>
            <el-table-column label="Device Status">
              <template slot-scope="scope">
                <span :class="scope.row.status=='offline'?'red_s':'green'"></span>
                <span v-if="scope.row.status!='offline'">Normal</span>
                <el-popover placement="top"
                            width="50"
                            :content="scope.row.status"
                            trigger="hover"
                            v-if="scope.row.status=='offline'">
                  <span slot="reference">Abnormal</span>
                </el-popover>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination class="pagination_box"
                         @size-change="handleSizeChange"
                         @current-change="handleCurrentChange"
                         :current-page="equipment_list.pageNow"
                         :page-sizes="[10,20,50,100]"
                         :page-size="10"
                         layout="total, sizes, prev, pager, next"
                         :total="equipment_list.count">
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- 新增设备 -->
    <el-dialog class="add_box pop_box"
               :close-on-click-modal="false"
               :modal-append-to-body="false"
               :visible.sync="equipment_pop.show">
      <img src="@/assets/images/emerge/closed.png"
           @click="closed_add_box"
           class="closed_img"
           alt="">
      <div class="title">
        <div class="mask"></div>
        <span class="title_name">Add</span>
      </div>
      <div class="content">
        <div class="content_item">
          <p>
            <span class="title">Device Name</span>
            <span class="red_necessary">*</span>
          </p>
          <el-input class="select_box"
                    placeholder="Please enter the device name"
                    v-model="equipment_pop.name"
                    clearable>
          </el-input>
        </div>
        <div class="content_item">
          <p>
            <span class="title">Device Type</span>
            <span class="red_necessary">*</span>
          </p>
          <el-input class="select_box"
                    placeholder="Please select the device type"
                    v-model="equipment_pop.label"
                    :disabled="true">
          </el-input>
          <!-- <el-select class="select_box"
                     v-model="equipment_pop.type"
                     placeholder="Please select the device type">
            <el-option v-for="(item,index) in equipment_pop.type_list"
                       :key="index"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select> -->
        </div>
        <div class="content_item">
          <p>
            <span class="title">Device IP</span>
            <span class="red_necessary">*</span>
          </p>
          <el-input class="select_box"
                    placeholder="Please enter the device ip"
                    v-model="equipment_pop.ip"
                    clearable>
          </el-input>
        </div>
      </div>
      <div class="btn_box">
        <el-button @click="closed_add_box"
                   class="cancel_btn">Cancel</el-button>
        <el-button class="ok_btn"
                   @click="add_equipment">Confirm</el-button>
      </div>
    </el-dialog>
    <!-- 设备详情 -->
    <el-dialog class="sys_detail"
               width="840"
               :close-on-click-modal="false"
               :modal-append-to-body="false"
               :visible.sync="equipment_detail.show">
      <img src="@/assets/images/emerge/closed.png"
           @click="closed_detail"
           class="closed_img"
           alt="">
      <div class="title">
        <div class="mask"></div>
        <span class="title_name">
          <!-- <span>{{equipment_detail.title.name}}</span>
          <span>{{equipment_detail.title.ip}}</span> -->
          <span>{{equipment_detail.title.type}}</span>
          <span>System Status</span>
        </span>
      </div>
      <div class="sys_detail_content">
        <div class="detail_item">
          <div id='cpu'></div>
        </div>
        <div class="detail_item">
          <div id='flow_echarts'></div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  name: "system_control_orient",
  data () {
    return {
      activeDiv: '1',
      equipment_list: {
      },
      equipment_data: {
        page: 1,
        rows: 10
      },
      equipment_top: {
        engine: {},
        sandbox: {},
        sensor: {},
        sensor_engine: {},
      },
      equipment_pop: {
        show: false,
        type: '4',
        label: 'Sandbox',
        name: '',
        type_list: [
          { label: 'Sandbox', value: '4' },
        ],
        ip: '',
      },
      equipment_detail: {
        show: false,
        cpu: [],
        mem: [],
        disk: [],
        statistics_time: [],
        flow: [],
        title: {
          type: '',
          ip: '',
          name: '',
        }
      },
      select_list: [],
      sandbox_show: false
    };
  },
  mounted () {
    this.get_data();
    this.get_top();
    this.get_version();
  },
  methods: {
    chooseDiv (index) {
      this.activeDiv = index
    },
    // 获取列表
    get_data () {
      this.$axios.get('/yiiapi/dev/list', {
        params: {
          page: this.equipment_data.page,
          rows: this.equipment_data.rows,
        }
      })
        .then(response => {
          console.log(response);
          this.equipment_list = response.data.data
          this.equipment_list.pageNow *= 1
          this.equipment_list.rows *= 1
          this.equipment_list.list.forEach((item, index) => {
            item.index_cn = index + 1
          });
        })
        .catch(error => {
          console.log(error);
        })
    },
    // 获取license版本
    get_version () {
      this.$axios.get('/yiiapi/site/license-version')
        .then(response => {
          let { status, data } = response.data;
          console.log(data.edition);
          if (data.edition == 2) {
            this.sandbox_show = true
          } else {
            this.sandbox_show = false
          }
        })
        .catch(error => {
          console.log(error);
        })
    },
    get_top () {
      this.$axios.get('/yiiapi/dev/top')
        .then(response => {
          console.log(response);
          this.equipment_top = response.data.data;
        })
        .catch(error => {
          console.log(error);
        })
    },
    // 添加设备
    add_box () {
      this.equipment_pop.show = true
      this.equipment_pop.name = ''
      this.equipment_pop.type = '4'
      this.equipment_pop.ip = ''
    },
    add_equipment () {
      console.log(1212);
      console.log(this.equipment_pop);
      if (this.equipment_pop.name == '') {
        this.$message(
          {
            message: 'Please enter the device name',
            type: 'warning',
          }
        );
        return false
      }
      if (this.equipment_pop.type == '') {
        this.$message(
          {
            message: 'Please select the device type',
            type: 'warning',
          }
        );
        return false
      }
      if (this.equipment_pop.ip == '') {
        this.$message(
          {
            message: 'Please enter the device ip',
            type: 'warning',
          }
        );
        return false
      }
      this.$axios.post('/yiiapi/dev/add', {
        name: this.equipment_pop.name,
        type: this.equipment_pop.type,
        ip: this.equipment_pop.ip,
      })
        .then(response => {
          console.log(response);
          if (response.data.status == 0) {
            this.get_data()
            this.equipment_pop.show = false
            this.$message(
              {
                message: '添加设备成功！',
                type: 'success',
              }
            );
          } else {
            this.$message(
              {
                message: response.data.msg,
                type: 'error',
              }
            );
          }
        })
        .catch(error => {
          console.log(error);
        })
    },
    // 删除
    del_equipment () {
      if (this.select_list.length == 0) {
        this.$message(
          {
            message: 'Please select the item to delete ',
            type: 'warning',
          }
        );
        return false
      }
      this.$confirm('This action deletes the item. Do you want to continue?', 'Message', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        var id_list = []
        this.select_list.forEach(element => {
          id_list.push(element.id)
        });
        this.$axios.delete('/yiiapi/dev/del', {
          data: {
            id: id_list
          }
        })
          .then(response => {
            console.log(response);
            if (response.data.status == 0) {
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

    // 分页
    handleSizeChange (val) {
      this.equipment_data.rows = val;
      this.equipment_data.page = 1
      this.get_data();
    },
    handleCurrentChange (val) {
      this.equipment_data.page = val
      this.get_data();
    },
    // 全选择
    handleSelectionChange (val) {
      this.select_list = val
    },
    alert_detail (item) {
      console.log(item);
      this.equipment_detail.cpu = []
      this.equipment_detail.mem = []
      this.equipment_detail.disk = []
      this.equipment_detail.statistics_time = []
      this.equipment_detail.flow = []
      switch (item.type) {
        case '1':
          this.equipment_detail.title.type = 'Sensor'
          break;
        case '2':
          this.equipment_detail.title.type = 'Engine'
          break;
        case '3':
          this.equipment_detail.title.type = 'Engine/Sensor'
          break;
        case '4':
          this.equipment_detail.title.type = 'Sandbox'
          break;

        default:
          break;
      }
      this.equipment_detail.title.ip = item.ip
      this.equipment_detail.title.name = item.name
      this.$axios.get('/yiiapi/alert/dev-state', {
        params: {
          ip: item.ip
        }
      })
        .then(response => {
          let {
            status,
            data
          } = response.data;
          console.log(data);
          data.forEach(element => {
            this.equipment_detail.cpu.unshift(element.cpu)
            this.equipment_detail.mem.unshift(element.mem)
            this.equipment_detail.disk.unshift(element.disk)
            this.equipment_detail.statistics_time.unshift(element.statistics_time)
            this.equipment_detail.flow.unshift(element.flow)
          });
          this.equipment_detail.show = true;
          setTimeout(() => {
            this.cpu()
            this.flow()
          }, 100);
        })
        .catch(error => {
          console.log(error);
        })
    },
    closed_add_box () {
      this.equipment_pop.show = false
    },
    // 设备详情
    closed_detail () {
      this.equipment_detail.show = false;
    },
    cpu () {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("cpu"));
      // 绘制图表
      myChart.setOption({
        grid: {
          top: "18%",
          left: '5%',
          right: "3%",
          bottom: "20%",
          containLabel: true
        },
        legend: {
          bottom: 5,
          left: 'center',
          orient: 'horizontal',
          textStyle: {
            fontSize: 12
          },
          selected: {
            // 选中'系列1'
            'CPU': true,
            'Memory': true,
            'Disk': true,
          },
          data: ['CPU', 'Memory', 'Disk']
        },
        tooltip: {
          trigger: "axis",
          borderColor: "rgba(2,136,209,0.3)",
          borderWidth: 2,
          backgroundColor: "#fff",
          textStyle: {
            color: "#ccc"
          },
          axisPointer: {
            lineStyle: {
              color: "#ccc"
            }
          }
        },
        xAxis: {
          boundaryGap: false,
          //网格样式
          splitLine: {
            show: true,
            lineStyle: {
              color: ["#F4F4F4"],
              width: 1,
              type: "solid"
            }
          },
          axisLine: {
            lineStyle: {
              color: "#ECECEC",
              width: 2
            }
          },
          axisLabel: {
            textStyle: {
              color: "#666666"
            }
          },
          axisTick: {
            show: false
          },
          data: this.equipment_detail.statistics_time,
        },
        yAxis: [{
          name: 'Unit(%)',
          nameTextStyle: {
            color: '#666'
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#F4F4F4",
              width: 1,
              type: "solid"
            }
          },
          axisLine: {
            lineStyle: {
              color: "#ECECEC",
              width: 2
            }
          },
          axisLabel: {

            textStyle: {
              color: "#666666"
            }
          },
          axisTick: {
            show: false
          }
        }],
        color: ["rgba(2,136,209,0.9)", "rgba(205,220,57,0.9)", "rgba(76,175,80,0.9)"],
        series: [
          {
            name: "CPU",
            type: "line",
            symbol: "none",
            cursor: "pointer",
            smooth: true,
            data: this.equipment_detail.cpu,
            lineStyle: {
              color: "rgba(2,136,209,0.9)"
            },
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(2,136,209,0.3)" // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "rgba(2,136,209,0.1)" // 100% 处的颜色
                  }
                ]
              }
            }
          },
          {
            name: "Memory",
            type: "line",
            symbol: "none",
            cursor: "pointer",
            smooth: true,
            data: this.equipment_detail.mem,
            lineStyle: {
              color: "rgba(205,220,57,0.9)"
            },
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(205,220,57,0.3)" // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "rgba(205,220,57,0.1)" // 100% 处的颜色
                  }
                ]
              }
            }
          },
          {
            name: "Disk",
            type: "line",
            symbol: "none",
            cursor: "pointer",
            smooth: true,
            data: this.equipment_detail.disk,
            lineStyle: {
              color: "rgba(76,175,80,0.9)"
            },
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(76,175,80,0.3)" // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "rgba(76,175,80,0.1)" // 100% 处的颜色
                  }
                ]
              }
            }
          },
        ]
      });
      window.addEventListener("resize", () => {
        myChart.resize();
      });
    },
    flow () {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("flow_echarts"));
      // 绘制图表
      myChart.setOption({
        grid: {
          top: "18%",
          left: '5%',
          right: "3%",
          bottom: "20%",
          containLabel: true
        },
        legend: {
          bottom: 5,
          left: 'center',
          orient: 'horizontal',
          textStyle: {
            fontSize: 12
          },
          selected: {
            // 选中'系列1'
            'Traffic': true,
          },
          data: ['Traffic']
        },
        tooltip: {
          trigger: "axis",
          borderColor: "rgba(187,120,247,0.3)",
          borderWidth: 2,
          backgroundColor: "#fff",
          textStyle: {
            color: "#ccc"
          },
          axisPointer: {
            lineStyle: {
              color: "#ccc"
            }
          }
        },
        color: ["rgba(187,120,247,0.9)"],
        xAxis: {
          boundaryGap: false,
          //网格样式
          splitLine: {
            show: true,
            lineStyle: {
              color: ["#F4F4F4"],
              width: 1,
              type: "solid"
            }
          },
          axisLine: {
            lineStyle: {
              color: "#ECECEC",
              width: 2
            }
          },
          axisLabel: {
            textStyle: {
              color: "#666666"
            }
          },
          axisTick: {
            show: false
          },
          data: this.equipment_detail.statistics_time
        },
        yAxis: [{
          name: 'Unit(Mbps)',
          nameTextStyle: {
            color: '#666'
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#F4F4F4",
              width: 1,
              type: "solid"
            }
          },
          axisLine: {
            lineStyle: {
              color: "#ECECEC",
              width: 2
            }
          },
          axisLabel: {
            textStyle: {
              color: "#666666"
            }
          },
          axisTick: {
            show: false
          }
        }],
        series: [
          {
            name: "Traffic",
            type: "line",
            symbol: "none",
            cursor: "pointer",
            smooth: true,
            data: this.equipment_detail.flow,
            lineStyle: {
              color: "rgba(187,120,247,0.9)"
            },
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(187,120,247,0.3)" // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "rgba(187,120,247,0.1)" // 100% 处的颜色
                  }
                ]
              }
            }
          }
        ]
      });
      window.addEventListener("resize", () => {
        myChart.resize();
      });
    }
  }
}
</script>

<style scoped lang="less">
#equipment {
  text-align: left;
  padding: 16px 36px 20px 16px;
  .container {
    .red {
      width: 8px;
      height: 8px;
      display: inline-block;
      background: #ff5f5c;
      border-radius: 8px;
      margin-left: 26px;
    }
    .red_s {
      width: 8px;
      height: 8px;
      display: inline-block;
      background: #ff5f5c;
      border-radius: 8px;
    }
    .green {
      width: 8px;
      height: 8px;
      display: inline-block;
      background: #7ace4c;
      border-radius: 8px;
    }
    .color_span {
      color: #0070ff;
      cursor: pointer;
    }
    .top {
      display: flex;
      margin-bottom: 24px;
      .item {
        cursor: pointer;
        width: 324px;
        height: 108px;
        background: #ffffff;
        border: 1px solid #dddddd;
        border-radius: 4px;
        margin-right: 10px;
        display: flex;
        .item_left {
          width: 84px;
          height: 108px;
          position: relative;
          .img_box {
            width: 48px;
            height: 48px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }
        .item_right {
          .item_right_title {
            font-family: PingFangMedium;
            font-size: 18px;
            color: #333333;
            margin-top: 25px;
            margin-bottom: 16px;
          }
        }
      }
      .left_active {
        border: 1px solid #e1bf3e;
        box-shadow: 0 0 6px 2px rgba(46, 63, 96, 0.12);
        .item_right_title {
          color: #e1bf3e !important;
        }
      }
    }
    .bottom {
      background: #ffffff;
      border-radius: 2px;
      padding: 24px 24px 24px 16px;
      .btn_box {
        margin-bottom: 16px;
        .btn_i {
          padding: 0;
          background: #0070ff;
          color: #fff;
          width: 124px;
          height: 36px;
        }
        .btn_o {
          padding: 0;
          background: #fff;
          border-color: #0070ff;
          color: #0070ff;
          width: 124px;
          height: 36px;
        }
      }
      .pagination_box {
        text-align: center;
        margin-top: 24px;
      }
    }
  }
}
</style>

<style lang='less'>
@import '../../../assets/css/less/reset_css/reset_table.less';
@import '../../../assets/css/less/reset_css/reset_pop.less';
#equipment {
  .add_box {
    .el-dialog {
      width: 440px;
      .content_item {
        margin-top: 24px;
        .select_box {
          width: 100%;
          height: 38px;
          margin-top: 6px;
          .el-input__inner {
            background: #f8f8f8;
            border: 0;
          }
        }
      }
      .btn_box {
        margin-top: 24px;
      }
    }
  }
  .sys_detail {
    z-index: 99999 !important;
    .el-dialog {
      width: 840px;
      .el-dialog__header {
        display: none;
      }
      .el-dialog__body {
        width: 840px;
        padding: 30px;
        .closed_img {
          position: absolute;
          top: -18px;
          right: -18px;
          cursor: pointer;
          width: 46px;
          height: 46px;
        }
        .title {
          height: 24px;
          line-height: 24px;
          text-align: left;
          .title_name {
            font-size: 20px;
            color: #333333;
            line-height: 24px;
          }
          .mask {
            width: 24px;
            height: 0px;
            border-top: 0px;
            border-right: 2px solid transparent;
            border-bottom: 5px solid #0070ff;
            border-left: 2px solid transparent;
            transform: rotate3d(0, 0, 1, 90deg);
            display: inline-block;
            margin-right: -5px;
            margin-bottom: 4px;
            margin-left: -10px;
          }
        }
        .sys_detail_content {
          text-align: left;
          .detail_item {
            margin-top: 24px;
            p {
              font-size: 14px;
              color: #999999;
            }
            #cpu,
            #flow_echarts {
              height: 200px;
            }
          }
        }
      }
    }
  }
}
</style>