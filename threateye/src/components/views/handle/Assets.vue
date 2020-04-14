<template>
  <div class="handle-assets"
       v-loading.fullscreen.lock="handle.save"
       v-cloak>
    <vm-handle-tabs :data_top="data_top"
                    v-if="data_top_show"></vm-handle-tabs>
    <!--全部资产-->
    <div class="assets_all">
      <el-row class="assets_all_list">
        <h3 class="title">Assets</h3>
        <div class="all_list">
          <el-tag v-for="(tag,$index) in assets_all.tags"
                  :key="$index"
                  closable
                  size="small"
                  type=""
                  effect="plain"
                  @close="deleteAllAssets(tag)">
            {{tag.name}}
          </el-tag>
        </div>
        <div class="tog">
          <el-button class="assets-toggle"
                     @click="toggle_top_show = !toggle_top_show">
            <span class="name"
                  v-show="toggle_top_show">Collapse</span>
            <span class="name"
                  v-show="!toggle_top_show">More</span>
            <i class="icons"
               :class="{'top_down':!toggle_top_show}"></i>
          </el-button>
        </div>
      </el-row>
      <el-row class="assets_all_detail"
              v-show="toggle_top_show">
        <ul class="all_detail">
          <li class="all_detail_item"
              v-for="(item,$index) in assets_all.base"
              :key="$index">
            <h4 class="title">{{item.name}}:</h4>

            <div class="detail_list">
              <el-button class="d_btn"
                         :class="{'d_btn_active':it.flag}"
                         :title="it.name"
                         size="small"
                         :key="$idx"
                         v-for="(it,$idx) in item.value"
                         @click="clickAllAssets(it.name,it.flag,$index,$idx);">{{it.name}}
              </el-button>
            </div>

            <div class="detail-toggle"
                 v-if="$index == item.pid"
                 @click="toggle_types($index,item.toggle_show)"
                 v-show="assets_all.base[$index].souce_value.length > 15">
              <label class="tog-types">
                <span class="name">More</span>
                <i class="icons"
                   :class="{'checked': item.toggle_show }"></i>
              </label>
            </div>
          </li>
        </ul>
      </el-row>
    </div>

    <!--风险资产-->
    <div class="assets_risk">
      <el-form class="common-pattern">
        <h3 class="title">Risk Assets</h3>
        <el-row class="common_box"
                style="padding: 15px 0;">
          <el-col :span="24"
                  class="common_box_list">
            <el-input class="s_key"
                      placeholder="Search keywords"
                      v-model="params.key"
                      clearable>
              <i slot="prefix"
                 class="el-input__icon el-icon-search"></i>
            </el-input>

            <el-select class="s_key"
                       v-model="params.threat"
                       clearable
                       placeholder="Compromise">
              <el-option v-for="item in options_threat"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>

            <el-select class="s_key"
                       v-model="params.degree"
                       clearable
                       placeholder="Severity"
                       width="100">
              <el-option v-for="item in options_degree"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>

            <el-select class="s_key"
                       v-model="params.status"
                       clearable
                       placeholder="Status">
              <el-option v-for="item in options_status"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>

            <el-button class="s_btn"
                       @click="submitClick();">Search</el-button>
            <el-link class="s_link"
                     @click="resetClick();">Reset</el-link>
          </el-col>
        </el-row>
        <!--按钮组-->
        <el-row class="common_btn">
          <el-col :span="24"
                  class="common_btn_list">
            <el-dropdown @command="change_state"
                         trigger="click"
                         placement='bottom-start'
                         size='148'>
              <el-button type="primary"
                         class="change_btn">
                <span>Status</span>
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown"
                                class="dropdown_ul_box">
                <el-dropdown-item command="In Progress"
                                  class="select_item">In Progress</el-dropdown-item>
                <el-dropdown-item command="Resolved"
                                  class="select_item">Resolved</el-dropdown-item>
                <el-dropdown-item command="Ignored"
                                  class="select_item">Ignored</el-dropdown-item>
                <el-dropdown-item command="False positive"
                                  class="select_item">False positive</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown @command="change_task"
                         placement='bottom-start'
                         trigger="click">
              <el-button type="primary"
                         class="change_btn">
                <span>Ticket</span>
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown"
                                class="dropdown_ul_box">
                <el-dropdown-item command="Create">Create</el-dropdown-item>
                <el-dropdown-item command="Add to ticket">Add to ticket</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </el-form>
      <el-row class="common-table-pattern">
        <el-col :span="24">
          <el-table ref="multipleTable"
                    class="common-table"
                    :row-style="{cursor:'pointer'}"
                    v-loading="table.loading"
                    :data="table.tableData"
                    @row-click="detailClick"
                    @selection-change="handleSelChange">
            <el-table-column prop="type"
                             width="20"></el-table-column>
            <el-table-column type="selection"
                             width="50"></el-table-column>
            <el-table-column prop="asset_ip"
                             label="Asset"></el-table-column>
            <el-table-column prop="label_group"
                             label="Asset Groups"
                             show-overflow-tooltip
                             min-width="120">
            </el-table-column>
            <el-table-column min-width="140"
                             label="Related Threats">
              <template slot-scope="scope">
                <span class="btn_tag_box"
                      v-if="item!=''"
                      v-for="item in scope.row.category">
                  <el-button type="primary"
                             class="btn_tag">
                    {{item}}
                  </el-button>
                </span>
              </template>
            </el-table-column>
            <el-table-column label="Severity"
                             min-width="100">
              <template slot-scope="scope">
                <span class="btn_alert_background"
                      :class="{'high_background':scope.row.degree =='high','mid_background':scope.row.degree =='medium','low_background':scope.row.degree =='low'}">
                  {{ scope.row.degree | degree }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Compromise"
                             min-width="100">
              <template slot-scope="scope">
                <span :class="{'fall_certainty':scope.row.fall_certainty == '1'}">
                  {{ scope.row.fall_certainty | certainty }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Status"
                             width="120">
              <template slot-scope="scope">{{ scope.row.status | risk_status }}</template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="24"
                class="e-pagination">
          <el-pagination class="handle-pagination"
                         @size-change="handleSizeChange"
                         @current-change="handleCurrentChange"
                         :page-sizes="[10,20,50,100]"
                         :page-size="table.eachPage"
                         :current-page="table.pageNow"
                         :total="table.count"
                         layout="total, sizes, prev, pager, next">
          </el-pagination>
        </el-col>
      </el-row>
    </div>

    <!-- 弹窗 -->
    <!-- 状态变更 -->
    <el-dialog class="pop_state_box"
               :close-on-click-modal="false"
               :modal-append-to-body="false"
               :visible.sync="state_change">
      <img src="@/assets/images/emerge/closed.png"
           @click="closed_state"
           class="closed_img"
           alt="">
      <div class="title">
        <div class="mask"></div>
        <span class="title_name">Status</span>
      </div>
      <div class="content">
        <p class="content_p"
           style="font-size:0;text-align: center;">
          <span style="font-size:14px">Please confirm to change the status of the selected </span>
          <span style="font-size:14px">{{table.multipleSelection.length}}</span>
         <span style="font-size:14px"
                v-if="table.multipleSelection.length==1"> &nbsp;item to "</span>
          <span style="font-size:14px"
                v-if="table.multipleSelection.length!=1"> &nbsp;items to "</span>
          <span style="font-size:14px">{{process_state}}</span>
          <span style="font-size:14px">"?</span>
        </p>
      </div>
      <div class="btn_box">
        <el-button @click="cancel_state"
                   class="cancel_btn">Cancel</el-button>
        <el-button @click="ok_state"
                   class="ok_btn">Confirm</el-button>
      </div>
    </el-dialog>

    <!-- 弹窗 -->
    <!-- 工单任务 -->
    <el-dialog class="task_new_box pop_box"
               :close-on-click-modal="false"
               :modal-append-to-body="false"
               :visible.sync="task.new">
      <img src="@/assets/images/emerge/closed.png"
           @click="closed_task_new"
           class="closed_img"
           alt="">
      <div class="title">
        <div class="mask"></div>
        <span class="title_name">Edit</span>
      </div>
      <div class="step_box">
        <div class="step_box1">
          <span class="step1_span"
                :class="task.new_contet?'step_now':'step_past'">Basic Info</span>
          <img src="@/assets/images/emerge/selected01.png"
               class="selected_img"
               alt="">
        </div>
        <div class="step_box2">
          <span class="step2_span"
                :class="!task.new_contet?'step_now':'step_past'">Content</span>
        </div>
      </div>
      <!-- 基本信息 -->
      <div class="task_new_content"
           v-if="task.new_contet">
        <div class="task_content_box">
          <div class="content_top">
            <div class="content_top_left">
              <li class="left_item">
                <div class="title">
                  <span>Name</span>
                  <span class="improtant_ico">*</span>
                </div>
                <el-input class="task_new_input"
                          placeholder="Please enter a ticket name"
                          v-model="task_params.name"
                          show-word-limit
                          maxlength="32"
                          clearable>
                </el-input>
              </li>
              <li class="left_item">
                <div class="title">
                  <span>Assignee</span>
                  <span class="improtant_ico">*</span>
                </div>
                <el-select class="task_new_input"
                           v-model="task_params.operator"
                           clearable
                           placeholder="Please select the assignee">
                  <el-option v-for="item in task_new.operator_list"
                             @click.native="select_changced(item)"
                             :key="item.id"
                             :label="item.username"
                             :value="item.username">
                  </el-option>
                </el-select>
              </li>
            </div>
            <div class="content_top_right">
              <li class="right_item">
                <div class="title">
                  <span>Priority</span>
                  <span class="improtant_ico">*</span>
                </div>
                <el-select class="task_new_input"
                           v-model="task_params.level"
                           clearable
                           placeholder="Please select the priority">
                  <el-option v-for="item in task_new.level_list"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </li>
              <li class="right_item">
                <el-checkbox-group v-model="task_params.notice">
                  <el-checkbox label="email"
                               value="email">Mail notification</el-checkbox>
                  <el-checkbox label="message"
                               value="message">SMS notification</el-checkbox>
                  <!--<el-checkbox label="news" value="news">消息中心通知</el-checkbox>-->
                </el-checkbox-group>
              </li>
            </div>
          </div>
          <div class="content_remarks">
            <p class="title">Remarks</p>
            <el-input type="textarea"
                      :rows="4"
                      placeholder="Please enter the remark"
                      maxlength="500"
                      show-word-limit
                      v-model="task_params.textarea">
            </el-input>
          </div>
          <div class="content_table">
            <el-table :data="table_operator.tableData"
                      style="width: 100%">
              <el-table-column prop="username"
                               label="Assignee"></el-table-column>
              <el-table-column prop="department"
                               label="Department"></el-table-column>
              <el-table-column prop="email_addr"
                               label="Email"></el-table-column>
            </el-table>
          </div>
        </div>
        <div class="btn_box">
          <el-button @click="closed_task_new"
                     class="cancel_btn">Cancel</el-button>
          <el-button @click="next_task_new"
                     class="next_btn">Next</el-button>
        </div>
      </div>

      <!-- 处置内容 -->
      <div class="task_handle_content"
           v-if="!task.new_contet">
        <div class="task_content_box">
          <div class='table_box'>
            <ul class="table_box_title">
              <li v-for="(tab,index) in handle.table_title"
                  @click="table_btn_toggle(index)"
                  :class="{active:handle.active==index}">
                {{tab}}
              </li>
            </ul>
            <div v-show="handle.active == 0">
              <el-table class="common-table"
                        :data="table_assets.tableData_new"
                        tooltip-effect="dark"
                        style="width: 100%"
                        @selection-change="handle_sel_table_assets">
                <el-table-column prop="type"
                                 width="20"></el-table-column>
                <el-table-column type="selection"
                                 width="30"></el-table-column>
                <el-table-column prop="asset_ip"
                                 label="Asset"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column prop="label_group"
                                 label="Asset Groups"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="Related Threats"
                                 min-width="100"
                                 show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span class="btn_tag_box"
                          v-if="item!=''"
                          v-for="item in scope.row.category">
                      <el-button type="primary"
                                 class="btn_tag">
                        {{item}}
                      </el-button>
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="Severity">
                  <template slot-scope="scope">
                    <span class="btn_alert_background"
                          :class="{'high_background':scope.row.degree =='high','mid_background':scope.row.degree =='medium','low_background':scope.row.degree =='low'}">
                      {{ scope.row.degree | degree }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="Compromise"
                                 width="120">
                  <template slot-scope="scope">
                    <span :class="{'fall_certainty':scope.row.fall_certainty == '1'}">
                      {{ scope.row.fall_certainty | certainty }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="Status"
                                 width="80">
                  <template slot-scope="scope">{{ scope.row.status | risk_status }}</template>
                </el-table-column>
              </el-table>
              <el-pagination class="pagination_box"
                             @size-change="sc_table_assets"
                             @current-change="hcc_table_assets"
                             :page-sizes="[10,20,50,100]"
                             :page-size="table_assets.eachPage"
                             :current-page="table_assets.pageNow"
                             :total="table_assets.count"
                             layout="total, sizes, prev, pager, next">
              </el-pagination>
            </div>
          </div>
        </div>
        <div class="btn_box">
          <el-button @click="closed_task_new"
                     class="cancel_btn">Cancel</el-button>
          <el-button @click="prev_task_handle"
                     class="prev_btn">Previous</el-button>
          <el-button @click="prev_task_handle_assign"
                     class="prev_btn">Assign</el-button>
          <el-button @click="prev_task_handle_save"
                     class="prev_btn">Save</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 弹窗 -->
    <!-- 添加到工单 -->
    <el-dialog class="pop_state_add pop_box"
               :close-on-click-modal="false"
               :modal-append-to-body="false"
               :visible.sync="add_state_change">
      <img src="@/assets/images/emerge/closed.png"
           @click="add_closed_state"
           class="closed_img"
           alt="">
      <div class="title">
        <div class="mask"></div>
        <span class="title_name">Add to ticket</span>
      </div>
      <div class="content">
        <el-row class="common-table-pattern">
          <el-col :span="24">
            <el-table class="common-table"
                      highlight-current-row
                      v-loading="table_add_works.loading"
                      :data="table_add_works.tableData"
                      @selection-change="handle_sel_table_add_works">
              <el-table-column width="20"></el-table-column>
              <el-table-column type="selection"
                               width="50"></el-table-column>
              <!--<el-table-column label="选择" width="55" align="left">
                <template slot-scope="scope">
                  <el-radio  v-model="tableRadio" :label="scope.row"><i></i></el-radio>
                </template>
              </el-table-column>-->
              <el-table-column prop="name"
                               label="Name"
                               show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="creator"
                               label="Created By"
                               show-overflow-tooltip>
              </el-table-column>
              <el-table-column label="Priority"
                               width="120">
                <template slot-scope="scope">{{ scope.row.priority | priority }}</template>
              </el-table-column>
              <el-table-column prop="new_perator"
                               label="Assignee"
                               show-overflow-tooltip>
              </el-table-column>
              <el-table-column label="Status"
                               width="120"
                               show-overflow-tooltip>
                <template slot-scope="scope">{{ scope.row.status | work_status }}</template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="24"
                  class="e-pagination">
            <el-pagination class="handle-pagination"
                           @size-change="sc_table_add_works"
                           @current-change="hcc_table_add_works"
                           :page-sizes="[10,20,50,100]"
                           :page-size="table_add_works.eachPage"
                           :total="table_add_works.count"
                           :current-page="table_add_works.pageNow"
                           layout="total, sizes, prev, pager, next">
            </el-pagination>
          </el-col>
        </el-row>
      </div>
      <div class="btn_box">
        <el-button @click="add_closed_state"
                   class="cancel_btn">Cancel</el-button>
        <el-button @click="add_ok_state"
                   class="ok_btn">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import VmHandleTabs from "./vm-handle/vm-handle-tabs";

export default {
  name: 'assets',
  components: {
    VmHandleTabs
  },

  data () {
    return {
      //
      search_flag: false,
      //頂部數據
      data_top: {},
      data_top_show: false,
      assets_all: {
        tags: [],
        base: [
          { name: 'Category', souce_value: [], value: [], toggle_show: false, pid: 0 },
          { name: 'Application', souce_value: [], value: [], toggle_show: false, pid: 1 },
          { name: 'Branch', souce_value: [], value: [], toggle_show: false, pid: 2 },
          { name: 'Department', souce_value: [], value: [], toggle_show: false, pid: 3 },
          { name: 'Others', souce_value: [], value: [], toggle_show: false, pid: 4 }
        ]
      },
      toggle_top_show: true,
      params: {
        key: "",
        threat: "",
        degree: "",
        status: "",
      },
      options_threat: [
        {
          value: "1",
          label: "Compromised"
        }
      ],
      options_degree: [
        {
          value: "high",
          label: "High"
        },
        {
          value: "medium",
          label: "Medium"
        },
        {
          value: "low",
          label: "Low"
        }
      ],
      options_status: [
        {
          value: "1",
          label: "Pending"
        },
        {
          value: "2",
          label: "In Progress"
        }
      ],
      table: {
        tableData: [],
        count: 0,
        pageNow: 1,
        maxPage: 1,
        eachPage: 10,
        multipleSelection: [],
        loading: true
      },
      //弹窗部分
      state_change: false,
      process_state: "",

      //工单任务
      task: {
        new: false,
        new_contet: true
      },
      task_params: {
        name: "",
        level: "",
        operator: "",
        new_operator: [],
        notice: ['email'],
        textarea: "",
        multiple: []
      },
      task_new: {
        level_list: [
          {
            value: "highest",
            label: "Critical"
          },
          {
            value: "high",
            label: "High"
          },
          {
            value: "medium",
            label: "Medium"
          },
          {
            value: "low",
            label: "Low"
          }
        ],
        operator_list: [],
      },
      //经办人数组
      table_operator: {
        tableData: [],
        count: 0,
        pageNow: 1,
        maxPage: 1,
        eachPage: 5
      },
      handle: {
        add: "",
        table_title: ["Assets"],
        active: 0,
        dist: false,
        save: false
      },
      table_assets: {
        tableData: [],
        tableData_new: [],
        count: 0,
        pageNow: 1,
        maxPage: 1,
        eachPage: 10,
        multipleSelection: []
      },

      //添加到工单
      add_state_change: false,
      table_add_works: {
        tableData: [],
        count: 0,
        pageNow: 1,
        maxPage: 1,
        eachPage: 10,
        loading: true,
        multipleSelection: []
      },
      add_params: {
        name: "",
        level: "",
        operator: [],
        notice: ['email'],
        remarks: "",
        multiple: [],
        old_as: [],
        remind: ['email']
      }
    };
  },
  created () {
    //頂部
    this.get_list_top();

    //全部資產
    this.get_list_all();

    //風險資產
    this.get_list_risk();

  },
  methods: {
    //资产頂部
    get_list_top () {
      this.$axios.get('/yiiapi/alert/risk-asset-top')
        .then((resp) => {
          this.data_top_show = true;
          let data = resp.data.data;
          this.data_top = data;
          this.$set(this.data_top, data);
        })
    },

    //全部資產列表
    get_list_all () {
      this.$axios.get('/yiiapi/alert/all-asset-labels')
        .then((resp) => {

          let { status, data } = resp.data;

          if (status == 0) {

            //data.base_category = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17]
            data.base_category = data.base_category.map(function (v, k) {
              return { name: v, flag: false };
            });
            data.business = data.business.map(function (v, k) {
              return { name: v, flag: false };
            });
            data.branch = data.branch.map(function (v, k) {
              return { name: v, flag: false };
            });
            data.department = data.department.map(function (v, k) {
              return { name: v, flag: false };
            });

            let obj = data.others;
            let attr = [];
            Object.keys(obj).forEach(function (k) {
              attr.push({ name: obj[k], flag: false });
            });
            data.others = attr;
            this.assets_all.base[0].value = this.assets_all.base[0].souce_value = data.base_category;
            this.assets_all.base[1].value = this.assets_all.base[1].souce_value = data.business;
            this.assets_all.base[2].value = this.assets_all.base[2].souce_value = data.branch;
            this.assets_all.base[3].value = this.assets_all.base[3].souce_value = data.department;
            this.assets_all.base[4].value = this.assets_all.base[4].souce_value = data.others;

          }
        });
    },

    //風險資產列表
    get_list_risk () {

      this.table.loading = true;

      let params = { threat: 0, label: [] };

      //失陷确定性处置
      if (this.params.threat != '') {
        params.threat = 1;
      }
      //标签处置
      let labels = this.assets_all.tags;
      labels.forEach(function (v, k) {
        params.label.push(v.name);
      })

      params.label = JSON.stringify(params.label);

      this.$axios.get('/yiiapi/alert/risk-asset',
        {
          params: {
            label: params.label,
            key_word: this.params.key,
            fall_certainty: params.threat,
            degree: this.params.degree,
            status: this.params.status,
            page: this.table.pageNow,
            rows: this.table.eachPage
          }
        })
        .then((resp) => {
          this.table.loading = false;

          let { status, data } = resp.data;

          let datas = data;

          if (status == 0) {

            let { data, count, maxPage, pageNow } = datas;
            data.map(function (v, k) {

              let label_group = (Object.values(v.label)).join(',');
              let category_group = v.category.join(',');
              v.label_group = label_group;
              v.category_group = category_group;
            });

            this.table.tableData = data;
            this.table.count = count;
            this.table.maxPage = maxPage;
            this.table.pageNow = pageNow;

            //console.log(data)
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    //*******************************需要修改
    //全部资产按钮点击事件
    clickAllAssets (name, flag, $index, $idx) {
      if (!flag) {
        this.assets_all.tags.push({ name: name, index: $index, idx: $idx });
        this.assets_all.base[$index].value[$idx].flag = true;
      } else {
        let tags = this.assets_all.tags;
        const index = tags.findIndex(item => item.name === name);
        this.assets_all.tags.splice(index, 1);
        this.assets_all.base[$index].value[$idx].flag = false;
      }


      if (!this.search_flag) {
        this.params = {
          key: "",
          threat: "",
          degree: "",
          status: "",
        };
      }

      this.get_list_risk();
    },

    //全部资产删除标签事件
    deleteAllAssets (item) {
      let tags = this.assets_all.tags;
      this.assets_all.base[item.index].value[item.idx].flag = false;
      let index = tags.findIndex(x => x.name == item.name);
      this.assets_all.tags.splice(index, 1);

      if (!this.search_flag) {
        this.params = {
          key: "",
          threat: "",
          degree: "",
          status: "",
        };
      }

      this.get_list_risk();
    },
    //*******************************需要修改

    //全部资产小分类展开折叠事件
    toggle_types (index, flag) {
      let souse = this.assets_all.base[index].souce_value;
      let souse_str = souse.slice(0, 15);
      if (!flag) {
        this.assets_all.base[index].value = souse_str;
      } else {
        this.assets_all.base[index].value = souse;
      }
      this.assets_all.base[index].toggle_show = !this.assets_all.base[index].toggle_show;
    },

    //搜索按鈕點擊事件
    submitClick () {
      this.search_flag = true;
      this.get_list_risk();
    },

    //重置按鈕點擊事件
    resetClick () {
      //清空选中全部资产
      this.assets_all.tags = [];

      //取消全部资产选中状态
      this.assets_all.base[0].value.map(item => item.flag = false);
      this.assets_all.base[1].value.map(item => item.flag = false);
      this.assets_all.base[2].value.map(item => item.flag = false);
      this.assets_all.base[3].value.map(item => item.flag = false);
      this.assets_all.base[4].value.map(item => item.flag = false);
      this.params = {
        key: "",
        threat: "",
        degree: "",
        status: "",
      };
      this.get_list_risk();
    },

    //每頁多少條切換
    handleSizeChange (val) {
      this.table.eachPage = val;
      this.table.pageNow = 1;
      this.get_list_risk();
    },

    //頁數點擊切換
    handleCurrentChange (val) {
      this.table.pageNow = val;
      this.get_list_risk();
    },

    //多选获取选中数据
    handleSelChange (val) {
      this.table.multipleSelection = val;
    },

    /************************************/
    //进入详情页
    detailClick (row, column, event) {
      this.$router.push({        path: '/detail/assets', name: 'detail_assets',
        query: { id: row.id, asset_ip: row.asset_ip, status: row.status }      });
    },

    /***********************************以下是弹窗部分****************************************/
    /***********************************以下是弹窗部分****************************************/

    // 状态变更选择
    change_state (command) {
      this.process_state = command;
      this.open_state();
    },

    //工单任务选择
    change_task (command) {
      if (command == "Create") {
        this.open_task_new();
      } else if (command == "Add to ticket") {
        this.open_add_new();
      }
    },

    /***************状态变更*****************/
    //打开状态变更弹窗
    open_state () {
      let sel_table_data = this.table.multipleSelection;
      if (sel_table_data.length == 0) {
        this.$message({ message: 'Please select the assets to be changed', type: 'warning' });
        return false;
      } else {
        this.state_change = true;
      }
    },

    //关闭状态变更弹窗
    closed_state () {
      this.state_change = false;
      this.$refs.multipleTable.clearSelection();
    },

    //状态变更取消按钮点击
    cancel_state () {
      this.closed_state();
    },

    //状态变更确定按钮点击
    ok_state () {

      let selected = this.table.multipleSelection;
      //资产ID处理
      let asset_ip_group = selected.map(x => { return x.asset_ip });
      //状态设置
      let process = this.process_state;
      let change_status = 0;

      if (process == 'In Progress') {
        change_status = 2;
      } else if (process == 'Resolved') {
        change_status = 3;
      } else if (process == 'Ignored') {
        change_status = 4;
      } else if (process == 'False positive') {
        change_status = 5;
      }

      this.$axios.put('/yiiapi/alert/change-asset-status', {
        asset_ip: asset_ip_group,
        status: change_status
      })
        .then(resp => {
          let { status, data } = resp.data;
          if (status == 0) {
            this.$message.success('Change asset status successfully');
            //关闭弹窗
            this.closed_state();
            this.get_list_risk();
          } else {
            this.$message.error('Change asset status failed');
          }
        })
        .catch(err => {
          console.log(err);
        })
    },

    /***************工单任务*****************/

    //打开编辑工单
    open_task_new () {
      let sel_table_data = this.table.multipleSelection;
      let sel_table_attr = sel_table_data.map(x => { return x.status });
      if (sel_table_data.length == 0) {
        this.$message({ message: 'Please select the assets to be edited', type: 'warning' });
        return false;
      } else {
        if (sel_table_attr.includes('3')
          || sel_table_attr.includes('4')
          || sel_table_attr.includes('5')) {
          this.$message({ message: 'Asset whose status is resolved, ignored, false positive cannot create new tickets.', type: 'warning' });
        } else {
          this.table_assets.tableData = sel_table_data;
          this.table_assets.count = sel_table_data.length;
          let eachPage = this.table_assets.eachPage;
          let handle_data = this.table_assets.tableData.slice(0, eachPage);
          this.table_assets.tableData_new = handle_data;

          //获取用户列表(经办人使用)
          this.$axios.get('/yiiapi/site/user-list')
            .then(resp => {
              let { status, data } = resp.data;
              if (status == 0) {
                this.task_new.operator_list = data;
              } else {
                this.task_new.operator_list = [];
              }
              this.task.new = true;
              this.task.new_contet = true;
            })
            .catch(err => {
              console.log('User list error.');
              console.log(err);
            })

        }
      }
    },

    //关闭编辑工单
    closed_task_new () {
      this.task.new = false;
      this.task.new_contet = false;
      this.task_params = {
        name: "",
        level: "",
        operator: "",
        new_operator: [],
        notice: ['email'],
        textarea: "",
        multiple: []
      };
      this.table_operator.tableData = [];
      this.table_assets.tableData_new = [];
      this.$refs.multipleTable.clearSelection();
    },

    //下一步时候验证工单名称，优先级、经办人等参数
    next_task_new () {
      if (this.task_params.name == '') {
        this.$message.error('Ticket name is required');
      } else if (this.task_params.level == '') {
        this.$message.error('Please select the priority');
      } else if (this.task_params.operator == '') {
        this.$message.error('Please select the assignee');
      } else {
        this.task.new_contet = false;
        this.handle.active = 0;
      }
    },

    //上一步
    prev_task_handle () {
      this.task.new_contet = true;
    },

    //经办人change处理
    select_changced (item) {
      let level_list = this.table_operator.tableData;
      let selected_id_attr = level_list.map(x => { return x.id });
      if (selected_id_attr.includes(item.id)) {
        this.$message.error('Exited.');
      } else {
        this.table_operator.tableData.unshift(item);
      }
      let selected_name_attr = this.table_operator.tableData.map(x => { return x.username });
      this.task_params.new_operator = selected_name_attr;
    },

    //tabs下table每页显示多少条
    sc_table_assets (val) {
      this.table_assets.eachPage = val;
      this.table_assets.pageNow = 1;
      let handle_data = this.table_assets.tableData.slice(0, val);
      this.table_assets.tableData_new = handle_data;
    },

    //tabs下第一个table页数点击(资产);
    hcc_table_assets (val) {
      this.table_assets.pageNow = val;
      let eachPage = this.table_assets.eachPage;
      let handle_data = this.table_assets.tableData
        .slice((val - 1) * eachPage, val * eachPage);
      this.table_assets.tableData_new = handle_data;
    },

    //tab下第一个table多选
    handle_sel_table_assets (val) {
      this.table_assets.multipleSelection = val;
      let selected = val.map(x => { return x.id * 1 });
      this.task_params.multiple = selected;
    },

    //新增工单按钮切换
    table_btn_toggle (index) {
      this.handle.active = index;
    },

    //编辑工单分配
    prev_task_handle_assign () {
      if (this.task_params.multiple.length == 0) {
        let selected = this.table.multipleSelection
          .map(x => { return x.id * 1 });
        this.task_params.multiple = selected;
      }
      this.handle.save = true;
      this.$axios.put('/yiiapi/asset/distribution-workorder',
        {
          name: this.task_params.name,
          priority: this.task_params.level,
          perator: this.task_params.new_operator,
          remarks: this.task_params.textarea,
          risk_asset: this.task_params.multiple,
          remind: this.task_params.notice,
          type: 'asset'
        })
        .then((resp) => {
          this.handle.save = false;
          let { status, msg, data } = resp.data;
          if (status == 0) {
            this.$message.success('Assigned successfully');
            this.closed_task_new();
            this.get_list_risk();
          } else if (status == 1) {
            this.$message.error(msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    //编辑工单保存
    prev_task_handle_save () {
      if (this.task_params.multiple.length == 0) {
        let selected = this.table.multipleSelection
          .map(x => { return x.id * 1 });
        this.task_params.multiple = selected;
      }
      console.log(this.task_params.multiple);
      this.handle.save = true;
      this.$axios.post('/yiiapi/asset/add-workorder',
        {
          name: this.task_params.name,
          priority: this.task_params.level,
          perator: this.task_params.new_operator,
          remarks: this.task_params.textarea,
          risk_asset: this.task_params.multiple,
          remind: this.task_params.notice,
          type: 'asset'
        })
        .then((resp) => {
          this.handle.save = false;
          let { status, msg, data } = resp.data;
          if (status == 0) {
            this.$message.success('Saved successfully');
            this.closed_task_new();
            this.get_list_risk();
          } else if (status == 1) {
            this.$message.error(msg);
          }
        })
        .catch(err => {
          console.log(err);
        });

    },
    /***************新加到工单*****************/

    //添加到工单打开
    open_add_new () {
      this.add_open_state();
    },

    //新加到工单打开状态
    add_open_state () {
      let sel_table_data = this.table.multipleSelection;
      let sel_table_attr = sel_table_data.map(x => { return x.status });
      if (sel_table_data.length == 0) {
        this.$message({ message: 'Please select the assets that need to be added to the ticket', type: 'warning' });
        return false;
      } else {
        if (sel_table_attr.includes('3')
          || sel_table_attr.includes('4')
          || sel_table_attr.includes('5')) {
          this.$message({ message: 'Asset whose status is resolved, ignored, false positive cannot be added to the ticket.', type: 'warning' });
        } else {
          this.add_state_change = true;
          this.get_table_works_list();
        }
      }
    },

    //获取列表
    get_table_works_list () {
      this.$axios.get('/yiiapi/asset/workorder-list', {
        params: {
          page: this.table_add_works.pageNow,
          rows: this.table_add_works.eachPage,
          type: 'asset'
        }
      }).then((resp) => {
        this.table_add_works.loading = false;
        let { status, data } = resp.data;
        let datas = data;
        if (status == 0) {
          let { data, count, maxPage, pageNow } = datas;
          data.map(function (v, k) {
            v.new_perator = (JSON.parse(v.perator)).join(',');
            v.checked = false;
          });
          this.table_add_works.tableData = data;
          this.table_add_works.count = count;
          this.table_add_works.maxPage = maxPage;
          this.table_add_works.pageNow = Number(pageNow);
        }
      })
    },

    //新加到工单取消状态
    add_closed_state () {
      this.add_state_change = false;
      this.add_params = {
        name: "",
        level: "",
        operator: "",
        new_operator: [],
        notice: ['email'],
        textarea: "",
        multiple: [],
        old_as: [],
        remind: ['email']
      };
      this.$refs.multipleTable.clearSelection();
    },

    //新加工单列表勾选某一条记录
    handle_sel_table_add_works (row) {
      this.table_add_works.multipleSelection = row;
    },

    //新加到工单确定
    add_ok_state () {

      let selected_attr = this.table.multipleSelection
        .map(x => { return x.id * 1 });
      this.add_params.multiple = selected_attr;

      //判断工单列表长度
      let multipe = this.table_add_works.multipleSelection;

      if (multipe.length == 0) {
        this.$message({ message: 'Please select the assets that need to be added to the ticket', type: 'warning' });
      } else if (multipe.length > 1) {
        this.$message({ message: 'Assets or alerts cannot be added to multiple tickets, please try again.', type: 'warning' });
      } else {
        console.log('******************')
        this.add_params.id = multipe[0].id;
        this.add_params.name = multipe[0].name;
        this.add_params.level = multipe[0].priority;
        this.add_params.perator = JSON.parse(multipe[0].perator);
        this.add_params.remarks = multipe[0].remarks;
        this.add_params.remind = JSON.parse(multipe[0].remind);

        this.add_params.old_as = JSON.parse(multipe[0].risk_asset);
        //console.log(this.add_params);
        this.add_params.multiple = [...this.add_params.multiple, ...this.add_params.old_as];

        console.log(this.add_params.multiple);
        this.add_params.multiple = [...new Set(this.add_params.multiple)];

        var newArr = this.add_params.multiple.filter(item => item)

        this.add_params.multiple = newArr;


        console.log(this.add_params.perator);

        this.handle.save = true;

        this.$axios.post('/yiiapi/asset/add-workorder',
          {
            id: this.add_params.id,
            name: this.add_params.name,
            priority: this.add_params.level,
            perator: this.add_params.perator,
            remind: this.add_params.remind,
            remarks: this.add_params.remarks,
            risk_asset: this.add_params.multiple,
            type: 'asset'
          })
          .then((resp) => {
            this.handle.save = false;
            let { status, msg, data } = resp.data;
            if (status == 0) {
              this.$message.success('Added successfully');
              //清空状态
              this.add_closed_state();
              this.get_list_risk();
            } else if (status == 1) {
              this.$message.error(msg);
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },

    //每页显示多少条
    sc_table_add_works (val) {
      this.table_add_works.eachPage = val;
      this.table_add_works.pageNow = 1;
      this.get_table_works_list();
    },

    //新加工单列表分页页面切换
    hcc_table_add_works (val) {
      this.table_add_works.pageNow = val;
      this.get_table_works_list();
    },

  }
};
</script>

<style scoped lang="less">
@import '../../../assets/css/less/common-pattern.less';
@import '../../../assets/css/less/common-table-pattern.less';
.handle-assets {
  padding: 24px;
  .btn_tag_box {
    .btn_tag {
      margin: 2px;
      background: #5389e0;
      border-radius: 2px;
      min-height: 20px;
      font-size: 10px;
      color: #ffffff;
      padding: 2px 5px;
    }
  }
  .assets_all {
    height: auto;
    background: #fff;
    border-radius: 4px;
    margin-top: 30px;

    .assets_all_list {
      min-height: 60px;
      display: flex;
      position: relative;
      .title {
        width: 136px;
        color: #333333;
        font-size: 18px;
        margin-top: 16px;
        text-align: left;
        padding-left: 24px;
        font-family: PingFangMedium;
      }

      .all_list {
        flex: 1;
        text-align: left;
        line-height: 36px;
        padding: 12px 0;
        /deep/ .el-tag {
          border-radius: 2px;
          margin-right: 5px;
          border-style: dashed;
        }
      }
      .tog {
        width: 124px;
        /deep/ .assets-toggle {
          position: absolute;
          bottom: 0;
          right: 0;
          height: 34px;
          width: 124px;
          line-height: 0;
          border-width: 0;
          background: #f8f8f8;
          text-align: center;
          .name {
            font-family: PingFang;
            font-size: 12px;
            color: #666666;
          }

          .icons {
            width: 16px;
            height: 16px;
            display: inline-block;
            vertical-align: middle;
            background-repeat: no-repeat;
            background-size: 16px;
            background-position: 0px -2px;
            background-image: url('../../../assets/images/handle/others/tog-top-down.png');

            &.top_down {
              background-position: 0px -4px;
              background-image: url('../../../assets/images/handle/others/tog-top.png');
            }
          }
        }
      }
    }

    .assets_all_detail {
      background: #ccc;
      font-family: PingFang;
      border-top: 1px solid #ececec;
      .all_detail {
        .all_detail_item {
          display: flex;
          height: 100%;
          .title {
            width: 136px;
            display: inline-block;
            background: #f8f8f8;
            font-size: 14px;
            color: #333;
            text-align: left;
            padding-top: 12px;
            padding-left: 24px;
          }
          .detail_list {
            flex: 1;
            text-align: left;
            padding: 5px;
            font-size: 0;
            background: #fff;
            min-height: 48px;
            display: inline-block;
            border-bottom: 1px solid #ececec;
            /deep/ .d_btn {
              width: 88px;
              height: 28px;
              border: 1px solid #ececec;
              margin: 3px 2px;
              background-color: #fff;
              padding: 0 !important;
              color: #333;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              &.d_btn_active {
                border: 1px solid #0070ff;
                color: #0070ff;
              }

              &:hover {
                background-color: #fff;
              }
            }
          }

          .detail-toggle {
            width: 80px;
            background: #fff;
            position: relative;
            border-bottom: 1px solid #ececec;

            .tog-types {
              position: absolute;
              top: 11px;
              left: 9px;

              .name {
                font-family: PingFang;
                font-size: 12px;
                color: #0070ff;
                display: inline-block;
              }

              .icons {
                width: 16px;
                height: 16px;
                display: inline-block;
                vertical-align: middle;
                background-repeat: no-repeat;
                background-size: 16px;
                background-position: 0px -2px;
                background-image: url('../../../assets/images/handle/others/tog-types.png');
                &.checked {
                  background-image: url('../../../assets/images/handle/others/tog-types-down.png');
                }
              }
            }
          }

          &:last-child {
            .detail_list {
              border-top: 1px solid #fff;
              border-bottom: 1px solid #fff;
            }
            .detail-toggle {
              border-width: 0;
            }
          }
        }
      }
    }

    /deep/ .handle-pagination {
      margin: 20px 0;
    }
  }

  .assets_risk {
    border-radius: 4px;
    margin-top: 20px;
    padding: 20px 24px;
    height: auto;
    background: #fff;
    text-align: left;
  }

  /* 弹窗 */
  /* 状态变更 */
  /deep/ .pop_state_box {
    .el-dialog {
      .el-dialog__header {
        display: none;
      }

      .el-dialog__body {
        height: 260px;
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

        .content {
          height: 128px;
          padding-top: 48px;
        }

        .btn_box {
          height: 42px;
          text-align: center;
          margin-bottom: 24px;

          .ok_btn {
            width: 136px;
            height: 42px;
            background: #0070ff;
            color: #fff;
          }

          .cancel_btn {
            width: 136px;
            height: 42px;
            border-color: #0070ff;
            background: #fff;
            color: #0070ff;
          }
        }
      }
    }
  }

  // 编辑工单
  /deep/ .task_new_box {
    .el-dialog {
      .el-dialog__header {
        display: none;
      }

      .el-dialog__body {
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

        .step_box {
          height: 36px;
          margin: 20px 0 24px 0;
          .step_box1 {
            background-image: url('../../../assets/images/emerge/step1.png');
            background-repeat: no-repeat;
            background-size: 100% 100%;
            width: 120px;
            height: 36px;
            float: left;
            position: relative;
            line-height: 36px;
            text-align: center;

            .step1_span {
              font-size: 14px;
            }

            .selected_img {
              position: absolute;
              left: 0;
              top: 0;
            }
          }

          .step_box2 {
            width: 120px;
            height: 36px;
            background-image: url('../../../assets/images/emerge/step2.png');
            background-repeat: no-repeat;
            background-size: 100% 100%;
            float: left;
            position: relative;
            line-height: 36px;
            text-align: center;
            margin-left: -10px;

            .step2_span {
              font-size: 14px;
            }
          }

          .step_now {
            color: #0070ff;
          }

          .step_past {
            color: #999999;
          }
        }

        .task_new_content {
          /*height: 480px;*/
          .task_content_box {
            height: 400px;
            overflow-y: auto;
            &::-webkit-scrollbar {
              /*滚动条整体样式*/
              width: 6px; /*高宽分别对应横竖滚动条的尺寸*/
              border-radius: 6px;
            }
            &::-webkit-scrollbar-thumb {
              /*滚动条里面小方块*/
              border-radius: 6px;
              background: #a8a8a8;
            }
            &::-webkit-scrollbar-track {
              /*滚动条里面轨道*/
              border-radius: 6px;
              background: #f4f4f4;
            }

            .content_top {
              overflow: hidden;
              .content_top_left {
                float: left;
                width: 45%;

                .left_item {
                  margin-bottom: 16px;
                  display: flex;

                  .title {
                    width: 100px;
                    line-height: 38px;

                    .improtant_ico {
                      color: #ff3a36;
                    }
                  }

                  .task_new_input {
                    flex: 1;

                    .el-input__inner {
                      height: 38px;
                    }
                  }
                }
              }

              .content_top_right {
                float: right;
                width: 45%;

                .right_item {
                  margin-bottom: 16px;
                  display: flex;

                  .title {
                    width: 100px;
                    line-height: 38px;

                    .improtant_ico {
                      color: #ff3a36;
                    }
                  }

                  .task_new_input {
                    flex: 1;

                    .el-input__inner {
                      height: 38px;
                    }
                  }
                }
              }
            }

            .content_remarks {
              .title {
                font-size: 12px;
                color: #999999;
              }

              /deep/ .el-textarea {
                height: 92px;
                textarea {
                  resize: none;
                  height: 92px;
                  font-size: 14px;
                  color: #333;
                  font-family: PingFang;
                }
              }
              .el-textarea__inner:hover {
                border: none;
              }

              .el-textarea__inner {
                border: none;
                background: #f8f8f8;
              }
            }

            .content_table {
              margin-top: 16px;

              /deep/ .el-table td {
                padding: 0;
                height: 32px;
              }
              /deep/ .el-table th {
                padding: 0;
                height: 36px;
                background: #f8f8f8;
                .cell {
                }
              }

              /deep/ .el-pagination {
                margin-top: 20px;
                text-align: center;
              }
            }
          }

          .btn_box {
            margin-top: 36px;
            margin-bottom: 24px;
            height: 42px;
            text-align: center;

            .cancel_btn {
              border: 1px solid #0070ff;
              background: #fff;
              color: #0070ff;
              width: 136px;
              height: 42px;
              font-size: 16px;
            }

            .next_btn {
              background-color: #0070ff;
              color: #fff;
              width: 136px;
              height: 42px;
              font-size: 16px;
            }
          }
        }

        .task_handle_content {
          .handle_content_top {
            height: 42px;
            text-align: left;
            .change_btn,
            .ref {
              background-color: #0070ff;
              border-color: #0070ff;
              width: 136px;
              height: 42px;
              color: #fff;
            }

            .cel {
              border: 1px solid #0070ff;
              background: #fff;
              color: #0070ff;
              width: 136px;
              height: 42px;
              margin-left: 0;
            }
          }

          .table_box {
            margin-top: 24px;

            .table_box_title {
              height: 38px;
              li {
                height: 38px;
                width: 92px;
                float: left;
                font-size: 14px;
                line-height: 38px;
                color: #bbbbbb;
                text-align: center;
                border-top: 2px solid #fff;
              }

              li.active {
                cursor: pointer;
                background: #eef6ff;
                color: #0070ff;
                border-top: 2px solid #0070ff;
              }
            }
            /deep/ .el-table {
              font-size: 12px;
              thead.has-gutter {
                th {
                  color: #333333;
                  background: #f8f8f8;
                  .cell {
                  }
                }
              }
              .cell {
                color: #333333;
              }
            }

            /deep/ .el-pagination {
              margin-top: 20px;
              text-align: center;
            }
          }

          .btn_box {
            margin-top: 36px;
            margin-bottom: 24px;
            height: 42px;
            text-align: center;

            .cancel_btn {
              border: 1px solid #0070ff;
              background: #fff;
              color: #0070ff;
              width: 136px;
              height: 42px;
              font-size: 16px;
            }

            .prev_btn {
              background-color: #0070ff;
              color: #fff;
              width: 136px;
              height: 42px;
              font-size: 16px;
            }
          }
        }
      }
    }
  }

  //添加到工单
  /deep/ .pop_state_add {
    .el-dialog {
      .el-dialog__header {
        display: none;
      }

      .el-dialog__body {
        max-height: 640px;
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

        .content {
          padding-top: 48px;
        }

        .btn_box {
          height: 42px;
          text-align: center;
          margin-bottom: 24px;
          margin-top: 36px;

          .ok_btn {
            width: 136px;
            height: 42px;
            background: #0070ff;
            color: #fff;
          }

          .cancel_btn {
            width: 136px;
            height: 42px;
            border-color: #0070ff;
            background: #fff;
            color: #0070ff;
          }
        }
      }
    }
  }
  /deep/ .pop_box {
    .el-dialog {
      background: #ffffff;
      border-radius: 4px;
      position: fixed;
      // top: 200px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
}
</style>
