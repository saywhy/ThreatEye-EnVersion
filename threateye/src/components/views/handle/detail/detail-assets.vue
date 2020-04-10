<template>
  <div class="detail-assets"
       v-loading.fullscreen.lock="handle.save"
       v-cloak>
    <back-title :title-name="title_name"></back-title>

    <div class="detail_base_top">
      <div class="top_left">
        <img class="t_name"
             src="@/assets/images/handle/others/top_name.png"
             alt="">
        <span class="top_left_title">{{detail.asset_ip}}</span>
      </div>
      <div class="top_right">
        <!--按钮组-->
        <el-row class="common_btn common_btn_124">

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
                                class="dropdown_ul_box_124">
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
                                class="dropdown_ul_box_124">
                <el-dropdown-item command="Create">Create</el-dropdown-item>
                <el-dropdown-item command="Add to ticket">Add to ticket</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </div>
      <div style="clear:both;"></div>
    </div>

    <div class="detail_base_mid">
      <div class="bom_item">
        <li>
          <span class="title">
            <i class="b_i b_name"></i>Compromise:</span>
          <span class="content">{{assets_top.fall_certainty | certainty}}</span>
        </li>
        <li>
          <span class="title">
            <i class="b_i"></i>Severity:</span>
          <span class="content">{{assets_top.degree | degree}}</span>
        </li>
        <li>
          <span class="title">
            <i class="b_i"></i>Status:</span>
          <span class="content">{{assets_top.asset_status | risk_status}}</span>
        </li>
        <li>
          <span class="title">
            <i class="b_i"></i>Category:</span>
          <span class="content">
            <ul>
              <li class="tag_btn_box"
                  v-for="(it,$idx) in assets_top.new_base_category"
                  :key="$idx">
                <span class="tag_btn">{{it}}</span>
              </li>
            </ul>
          </span>
        </li>
        <li>
          <span class="title">
            <i class="b_i"></i>Branch:</span>
          <span class="content">
            <ul>
              <li class="tag_btn_box"
                  v-for="(it,$idx) in assets_top.new_branch"
                  :key="$idx">
                <span class="tag_btn">{{it}}</span>
              </li>
            </ul>
          </span>
        </li>
      </div>
      <div class="bom_item">
        <li>
          <span class="title">Department:</span>
          <span class="content">
            <ul>
              <li class="tag_btn_box"
                  v-for="(it,$idx) in assets_top.new_department"
                  :key="$idx">
                <span class="tag_btn">{{it}}</span>
              </li>
            </ul>
          </span>
        </li>
        <li>
          <span class="title">Application:</span>
          <span class="content">
            <ul>
              <li class="tag_btn_box"
                  v-for="(it,$idx) in assets_top.new_business"
                  :key="$idx">
                <span class="tag_btn">{{it}}</span>
              </li>
            </ul>
          </span>
        </li>
        <li>
          <span class="title">Ticket Name:</span>
          <span class="content Goto_workorder"
                @click="Goto_workorder"
                v-if="assets_top.new_workorder_name!=''">
            {{assets_top.new_workorder_name}}</span>
        </li>
        <li>
          <span class="title">Ticket Status:</span>
          <span class="content">{{assets_top.new_workorder_status}}</span>
        </li>
      </div>
    </div>

    <!--攻击阶段分布-->
    <div class="detail_base_stg">
      <div class="top_left">
        <img class="b_img"
             src="@/assets/images/emerge/detai_attack.png" />
        <span class="title_name">Attack Phase Distribution</span>
      </div>
      <!--<div class="stg-content">
        <vm-hanle-rank></vm-hanle-rank>
      </div>-->
      <div class="attack_stage_bom">
        <div class="stage_item_box">
          <span class="circle_box"
                v-if="attack_stage_list[0].count>1">
            {{attack_stage_list[0].count}}
          </span>
          <span :class="attack_stage_list[0].count>0?'count_color':''">Initial Access</span>
        </div>
        <div class="stage_img_box">
          <img src="@/assets/images/emerge/detail_jiantou.png"
               alt="">
        </div>
        <div class="stage_item_box">
          <span class="circle_box"
                v-if="attack_stage_list[1].count>1">
            {{attack_stage_list[1].count}}
          </span>
          <span :class="attack_stage_list[1].count>0?'count_color':''">Execution</span>
        </div>
        <div class="stage_img_box">
          <img src="@/assets/images/emerge/detail_jiantou.png"
               alt="">
        </div>
        <div class="stage_item_box">
          <span class="circle_box"
                v-if="attack_stage_list[2].count>1">
            {{attack_stage_list[2].count}}
          </span>
          <span :class="attack_stage_list[2].count>0?'count_color':''">Persistence</span>
        </div>
        <div class="stage_img_box">
          <img src="@/assets/images/emerge/detail_jiantou.png"
               alt="">
        </div>
        <div class="stage_item_box">
          <span class="circle_box"
                v-if="attack_stage_list[3].count>1">
            {{attack_stage_list[3].count}}
          </span>
          <span :class="attack_stage_list[3].count>0?'count_color':''">Privilege Escalation</span>
        </div>
        <div class="stage_img_box">
          <img src="@/assets/images/emerge/detail_jiantou.png"
               alt="">
        </div>
        <div class="stage_item_box">
          <span class="circle_box"
                v-if="attack_stage_list[4].count>1">
            {{attack_stage_list[4].count}}
          </span>
          <span :class="attack_stage_list[4].count>0?'count_color':''">Defense Evasion</span>
        </div>
        <div class="stage_img_box">
          <img src="@/assets/images/emerge/detail_jiantou.png"
               alt="">
        </div>
        <div class="stage_item_box">
          <span class="circle_box"
                v-if="attack_stage_list[5].count>1">
            {{attack_stage_list[5].count}}
          </span>
          <span :class="attack_stage_list[5].count>0?'count_color':''">Credential Access</span>
        </div>
        <div class="stage_img_box">
          <img src="@/assets/images/emerge/detail_jiantou.png"
               alt="">
        </div>
        <div class="stage_item_box">
          <span class="circle_box"
                v-if="attack_stage_list[6].count>1">
            {{attack_stage_list[6].count}}
          </span>
          <span :class="attack_stage_list[6].count>0?'count_color':''">Discovery</span>
        </div>
        <div class="stage_img_box">
          <img src="@/assets/images/emerge/detail_jiantou.png"
               alt="">
        </div>
        <div class="stage_item_box">
          <span class="circle_box"
                v-if="attack_stage_list[7].count>1">
            {{attack_stage_list[7].count}}
          </span>
          <span :class="attack_stage_list[7].count>0?'count_color':''">Lateral Movement</span>
        </div>
        <div class="stage_img_box">
          <img src="@/assets/images/emerge/detail_jiantou.png"
               alt="">
        </div>
        <div class="stage_item_box">
          <span class="circle_box"
                v-if="attack_stage_list[8].count>1">
            {{attack_stage_list[8].count}}
          </span>
          <span :class="attack_stage_list[8].count>0?'count_color':''">Collection</span>
        </div>
        <div class="stage_img_box">
          <img src="@/assets/images/emerge/detail_jiantou.png"
               alt="">
        </div>
        <div class="stage_item_box">
          <span class="circle_box"
                v-if="attack_stage_list[9].count>1">
            {{attack_stage_list[9].count}}
          </span>
          <span :class="attack_stage_list[9].count>0?'count_color':''">Command and Control</span>
        </div>
        <div class="stage_img_box">
          <img src="@/assets/images/emerge/detail_jiantou.png"
               alt="">
        </div>
        <div class="stage_item_box">
          <span class="circle_box"
                v-if="attack_stage_list[10].count>1">
            {{attack_stage_list[10].count}}
          </span>
          <span :class="attack_stage_list[10].count>0?'count_color':''">Exfiltration</span>
        </div>
        <div class="stage_img_box">
          <img src="@/assets/images/emerge/detail_jiantou.png"
               alt="">
        </div>
        <div class="stage_item_box">
          <span class="circle_box"
                v-if="attack_stage_list[11].count>1">
            {{attack_stage_list[11].count}}
          </span>
          <span :class="attack_stage_list[11].count>0?'count_color':''">Impact</span>
        </div>
      </div>
    </div>

    <!-- 威胁及安全建议 -->
    <div class="suggest_box"
         v-if="suggest_flag">
      <div class="suggest_top">
        <img src="@/assets/images/emerge/detal_jianyi.png"
             alt=""
             class="icon_img">
        <span class="suggest_title">Threat and Security Recommendations</span>

      </div>
      <div class="suggest_bom">
        <p class="suggest_bom_title">Threat Description</p>
        <p class="suggest_bom_des">{{suggest_list[assets_top.safety_suggestion].des}}</p>
        <p class="suggest_bom_title">Security Recommendations</p>
        <p class="suggest_bom_list">
          <img src="@/assets/images/emerge/detail_suggest.png"
               class="suggest_icon"
               alt="">
          <span class="suggest_bom_title">Mitigation Recommendations</span>
        </p>
        <div>
          <p class="suggest_bom_li"
             v-for="item in suggest_list[assets_top.safety_suggestion].handle">
            {{item}}
          </p>
        </div>
        <p class="suggest_bom_list">
          <img src="@/assets/images/emerge/detail_suggest.png"
               class="suggest_icon"
               alt="">
          <span class="suggest_bom_title">Security Enhancements</span>
        </p>
        <div>
          <p class="suggest_bom_li"
             v-for="item in suggest_list[assets_top.safety_suggestion].reinforce">
            {{item}}
          </p>
        </div>
        <div style="margin-top:12px;"
             v-if="notes">
          <span class="suggest_bom_title"
                style="color:#ff5f5c">Please note: Only the mitigation recommendations of one of the asset’s alerts are provided here, please refer to the alert details in the below list to get all the alerts’ mitigation recommendations.</span>
        </div>
      </div>
    </div>

    <!-- tabs列表 -->
    <div class="detail_base_bom">

      <el-tabs v-model="activeName">
        <!-- 网络风险视角 -->
        <el-tab-pane label="Alerts"
                     class="tabs-item"
                     name="first">
          <el-table class="handle_table_detail"
                    ref="multipleTable"
                    align="center"
                    :data="table.tableData"
                    @row-click="detail_click"
                    tooltip-effect="dark"
                    style="width: 100%">
            <el-table-column label="Time"
                             width="180">
              <template slot-scope="scope">{{ scope.row.alert_time | time }}</template>
            </el-table-column>
            <el-table-column prop="category"
                             label="Type"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="indicator"
                             label="Indicator"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="src_ip"
                             label="Source IP"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="dest_ip"
                             label="Destination IP"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="application"
                             label="Protocol"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="Severity"
                             min-width="80">
              <template slot-scope="scope">
                <span class="btn_alert_background"
                      :class="{'high_background':scope.row.degree =='High risk','mid_background':scope.row.degree =='Medium risk','low_background':scope.row.degree =='Low risk'}">
                  {{ scope.row.degree | degree_sino }}</span>
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
                             width="140">
              <template slot-scope="scope">{{ scope.row.status | alert_status }}</template>
            </el-table-column>
          </el-table>
          <el-pagination class="handle_pagination_box"
                         @size-change="handleSizeChange"
                         @current-change="handleCurrentChange"
                         :total="table.count"
                         :page-sizes="[10,20,50,100]"
                         :page-size="table.eachPage"
                         :current-page="table.pageNow"
                         layout="total, sizes, prev, pager, next">
          </el-pagination>
        </el-tab-pane>

      </el-tabs>
    </div>

    <!-- 弹窗 -->
    <!-- 状态变更 -->
    <el-dialog class="pop_state_box pop_box"
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
           style="font-size:0">
          <span style="font-size:14px">Please confirm to change the status of the selected</span>
          <span style="font-size:14px">{{table.multipleSelection.length}}</span>
          <span style="font-size:14px"> terms to "</span>
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
                  <template slot-scope="scope">{{ scope.row.asset_status | risk_status }}</template>
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
import backTitle from "@/components/common/back-title";
import VmHanleRank from '../vm-handle/vm-handle-rank'
export default {
  name: "detail-assets",
  components: { backTitle, VmHanleRank },
  data () {
    return {
      suggest_flag: false,
      notes: false,
      network_times: [],
      network_detail: {},
      detail: {},
      title_name: "Risk Asset Details",
      activeName: 'first',
      assets_top: {},
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
      },
      attack_stage_list: [
        {
          name: "Initial Access",
          value: "Initial Access",
          count: 0
        },
        {
          name: "Execution",
          value: "Execution",
          count: 0
        },
        {
          name: "Persistence",
          value: "Persistence",
          count: 0
        },
        {
          name: "Privilege Escalation",
          value: "Privilege Escalation",
          count: 0
        },
        {
          name: "Defense Evasion",
          value: "Defense Evasion",
          count: 0
        },
        {
          name: "Credential Access",
          value: "Credential Access",
          count: 0
        },
        {
          name: "Discovery",
          value: "Discovery",
          count: 0
        },
        {
          name: "Lateral Movement",
          value: "Lateral Movement",
          count: 0
        },
        {
          name: "Collection",
          value: "Collection",
          count: 0
        },
        {
          name: "Command and Control",
          value: "Command and Control",
          count: 0
        },
        {
          name: "Exfiltration",
          value: "Exfiltration",
          count: 0
        },
        {
          name: "Impact",
          value: "Impact",
          count: 0
        },
      ],
      suggest_list: [
        {
          name: '',
          des: '',
          handle: [],
          reinforce: [],
        },
        {
          name: 'malwarecommunication',
          des: 'An attacker installs a malicious program on a machine that communicates with an external server via a common protocol or custom protocol.',
          handle: [
            '1. Isolate the machine from the network;',
            '2. Locate the malicious process at the machine according to the port in the network event of the alert details;',
            '3. Do a security analysis to identify the root cause and the extent the threat has spread. If you have an EDR solution installed, you can quickly locate the problem by doing security incident investigation directly through historical information;',
            '4. Install anti-virus software for full system scanning.',
          ],
          reinforce: [
            '1. Enhance endpoint security capabilities;',
            '2. Block the network connection of devices that do not need Internet access with network security devices;',
            '3. Use network threat detection solutions to detect outreach threats as early as possible.',
          ],
        },
        {
          name: '广告软件	Adware',
          des: 'Adware is of relatively low-risk, but sometimes it can lead to greater threats, thus has to be cleaned up in time.',
          handle: [
            '1. Isolate the machine from the network;',
            '2. Locate the malicious process at the machine according to the port in the network event of the alert details;',
            '3. Do a security analysis to identify the root cause and the extent the threat has spread. If you have an EDR solution installed, you can quickly locate the problem by doing security incident investigation directly through historical information;',
            '4. Install anti-virus software for full system scanning.',
          ],
          reinforce: [
            '1. Enhance endpoint security capabilities;',
            '2. Block the network connection of devices that do not need Internet access with network security devices;',
            '3. Use network threat detection solutions to detect outreach threats as early as possible.',
          ],
        },
        {
          name: '危险工具	graytool',
          des: 'Graytool may be used by administrators as internal security tools, but in most cases they are signs of compromise. These tools may be used for scanning, information collection or control; need to determine the purpose of the attack according to specific tools.',
          handle: [
            '1. Verify whether it is the legit use of an administrator;',
            '2. If not, it should be dealt with according to the threat indicator.',
          ],
          reinforce: [
            'Strengthening according to the actual use of gray tools.'
          ],
        },
        {
          name: '漏洞利用	Exploit',
          des: 'An attacker takes advantage of vulnerabilities in an application or service installed on a machine to exploit the vulnerability. Detection of such exploits in network traffic does not necessarily represent success in exploiting vulnerabilities in the machine.',
          handle: [
            '1. Verify that the exploitation of the vulnerability is successful on the attacked machine;',
            '2.If the vulnerability is exploited successfully, isolate the machine and do security analysis.',
          ],
          reinforce: [
            '1. Adopt WAF for Web applications to reduce the attack surface;',
            '2. Turn off unnecessary services on the machine and use technologies such as Windows EMET to prevent vulnerabilities from being exploited;',
            '3. Apply isolate, sandbox, least privilege and other measures to applications and services on the machine to reduce access rights after the attack;',
            '4. Segment networks to increase the difficulty of lateral movement;',
            '5. Use threat intelligence and regular vulnerability scanning to detect vulnerabilities and patch critical vulnerabilities in a timely manner.',
          ],
        },
        {
          name: '其他	Others',
          des: 'N/A',
          handle: ['N/A'],
          reinforce: ['N/A'],
        },
        {
          name: 'EICAR	eicar',
          des: 'EICAR is non-hazardous. Anti-virus software detects it for testing purposes.',
          handle: ['N/A'],
          reinforce: ['N/A'],
        },
        {
          name: 'SQL注入	sqlinjection',
          des: 'SQL injection is the behavior that an attacker takes advantage of such vulnerabilities as database design, development, and lack of validation to cause an application to do something undersigned.',
          handle: [
            '1. Verify that the injection is successful according to the SQL injection script;',
            '2. Because of the different SQL injection vulnerabilities, injection can lead to different results. Mitigate according to the behavior of the specific injection script.',
          ],
          reinforce: [
            '1. Using WAF and other security equipment to reduce the attack surface;',
            '2. Apply isolate, sandbox, least privilege and other measures to applications and services on the machine to reduce access rights after the attack;',
            '3.Do regular vulnerability scanning to detect vulnerabilities and patch critical vulnerabilities in a timely manner.',
          ],
        },
        {
          name: '暴力破解	BruteForce',
          des: "Attackers try to log into the network by spraying a large number of guesswork accounts and password combinations or a small number of common passwords that conform to network password policies. Once the login is successful, it's a legitimate account login, and it's extremely difficult to detect. Common Services that are attacked by brute force include: SSH (22/TCP), Telnet (23/TCP), FTP (21/TCP), NetBIOS/SMB/Samba (139/TCP&445/TCP), LDAP (389/TCP), Kerberos (88/TCP), RDP/Terminal Services (3389/TCP), HTTP/HTTP Management Services (80/TCP&443/TCP), MSSQL (1433/TCP), Oracle (1521/TCP), MySQL (306/TCP), VNC (5TCP).",
          handle: [
            '1. Check the system login log of the attacked machine to see if the brute force was successful. If successful, change the account password;',
            '2. If it is an external threat, block the attack address on the security gateway.',
          ],
          reinforce: [
            "1. Use the appropriate account lockout policy to lock the account after a certain number of failed logins. But the policy can't be too strict to prevent a large number of accounts from being locked out in the event of an attack. For critical applications, requiring extra validation after a certain number of failed logins can effectively solve this problem.",
            '2. Adopt multi-factor authentication;',
            '3. Make network password policies according to NIST password policies.'
          ],
        },
        {
          name: 'WebShell	WebShell',
          des: 'A Web Shell is an entry that is placed on a Web server to interact with an attacker using a stolen account or vulnerabilities. ',
          handle: [
            '1. Verify if it was successful, if it was, isolate the machine and do cleaning, scanning and security analysis;',
            '2. Focus on whether there are signs of lateral movement.',
          ],
          reinforce: [
            '1. Patch or change the account password according to the result of root cause analysis;',
            '2. The accounts that are used to manage Web servers should be different from intranet accounts',
          ],
        },
        {
          name: "扫描	Scan",
          des: 'An attacker detects services running on a machine by scanning them, including services that may have vulnerabilities. ',
          handle: [
            'N/A',
          ],
          reinforce: [
            '1. Patch critical vulnerabilities in a timely manner;',
            '2. Disable unnecessary services;',
            '3. For key services, create access lists to prevent or even restrict remote access from unknown machines.',
          ],
        },
        {
          name: "恶意程序	malwarefile",
          des: '下Download a malicious program to the machine, may be malicious file download, malicious file copy or malicious email attachments and so on.',
          handle: [
            '1. Refer to machine port of the "network event" in the alert details to locate the process that has downloaded malicious programs;',
            '2. If anti-virus software is installed on the machine, verify whether the malicious program has been quarantined according to the filename or hash value detected by the system;',
            '3. If it is not quarantined and the malicious program is not executed, manually remove the malicious program;',
            '4. If the malicious program is executed, kill the executed process, sub processes, and more malicious programs that may be generated or downloaded.',
          ],
          reinforce: [
            '1.Install anti-virus software and update virus library in time;',
            '2. User security awareness training to avoid downloading malicious programs or clicking on malicious email attachments.',
          ],
        },
        {
          name: "恶意地址	malware",
          des: 'The machine visited addresses with malicious programs.',
          handle: [
            '1. Refer to the machine port of "network event" in the alert details, locate the process that has visited this malicious address;',
            '2.Install anti-virus software and update to the latest to do the full system scan.',
          ],
          reinforce: [
            '1.Install anti-virus software and update virus library in time;',
            '2. User security awareness training to enhance security awareness.',
          ],
        },
        {
          name: "tor出口节点	tor_exit_node",
          des: 'The attacker uses Tor to hide the source of the attack and encrypt the communication channel, but there are also cases where some users use Tor to protect their privacy.',
          handle: [
            '1. Verify that the user of the machine is using Tor legitimately;',
            '2. If an attack is confirmed, it should be mitigated starting from the process that has visited the node by identifying the machine port in the "network event" in the alert details.',
          ],
          reinforce: [
            '1.Install anti-virus software and update virus library in time;',
            '2. Consider using network security devices to block Tor node addresses.',
          ],
        },
        {
          name: "tor入口节点	tor_node",
          des: 'The attacker uses Tor to hide the source of the attack and encrypt the communication channel, but there are also cases where some users use Tor to protect their privacy.',
          handle: [
            '1. Verify that the user of the machine is using Tor legitimately;',
            '2. If an attack is confirmed, it should be mitigated starting from the process that has visited the node by identifying the machine port in the "network event" in the alert details.',
          ],
          reinforce: [
            '1.Install anti-virus software and update virus library in time;',
            '2. Consider using network security devices to block Tor node addresses.',
          ],
        },
        {
          name: "垃圾邮件	spam ",
          des: 'Spam itself does not pose a security threat; it is the information that is not desired in the network.',
          handle: [
            'N/A',
          ],
          reinforce: [
            'Block spam through network security devices.',
          ],
        },
        {
          name: '僵尸网络C&C	botc&c ',
          des: 'An attacker installs a malicious program on a machine that communicates with an external server via a common protocol or custom protocol.',
          handle: [
            '1. Isolate the machine from the network;',
            '2. Locate the malicious process at the machine according to the port in the network event of the alert details;',
            '3. Do a security analysis to identify the root cause and the extent the threat has spread. If you have an EDR solution installed, you can quickly locate the problem by doing security incident investigation directly through historical information;',
            '4. Install anti-virus software for full system scanning.',
          ],
          reinforce: [
            '1. Enhance endpoint security capabilities;',
            '2. Block the network connection of devices that do not need Internet access with network security devices;',
            '3. Use network threat detection solutions to detect outreach threats as early as possible.',
          ],
        },
        {
          name: '移动恶意软件	mobilemalware',
          des: '下Download a malicious program to the machine, may be malicious file download, malicious file copy or malicious email attachments and so on.',
          handle: [
            '1. Refer to machine port of the "network event" in the alert details to locate the process that has downloaded malicious programs;',
            '2. If anti-virus software is installed on the machine, verify whether the malicious program has been quarantined according to the filename or hash value detected by the system;',
            '3. If it is not quarantined and the malicious program is not executed, manually remove the malicious program;',
            '4. If the malicious program is executed, kill the executed process, sub processes, and more malicious programs that may be generated or downloaded.',
          ],
          reinforce: [
            '1.Install anti-virus software and update virus library in time;',
            '2. User security awareness training to avoid downloading malicious programs or clicking on malicious email attachments.',
          ],
        },
        {
          name: '网络诈骗	fraud',
          des: 'Entice users by means of social engineering.',
          handle: [
            '1. If there is a loss of money and other emergencies, corresponding actions should be taken in time;',
            '2. Scanning and security analysis of the machine.',
          ],
          reinforce: [
            '1. Consider using network security devices to block fraud addresses;',
            '2. Provide security awareness training to users to help identify social engineering techniques. ',
          ],
        },
        {
          name: '恶意重定向	maliciousredirect',
          des: 'Redirect a user to a malicious address. ',
          handle: [
            '1. If there is an infection, information leakage and other similar situations, corresponding emergency treatment should be taken in time;；',
            '2. Scanning and security analysis of the machine.',
          ],
          reinforce: [
            '1. Consider using network security devices to block malicious redirect addresses;',
            '2. Provide security awareness training to users to help identify social engineering techniques.',
          ],
        },
        {
          name: '网络代理	proxy',
          des: 'Attackers use network proxies to hide the source of the attack and encrypt the communication channel, but some users also use network proxies to protect privacy.',
          handle: [
            '1. Verify that the user of the machine is using the network proxy legitimately;',
            '2. If an attack is confirmed, it should be mitigated starting from the process that has visited the node by identifying the machine port in the "network event" in the alert details.',
          ],
          reinforce: [
            '1.Install anti-virus software and update virus library in time;',
            '2. Consider using network security devices to block network proxy addresses.',
          ],
        },
        {
          name: '钓鱼网站	phishing',
          des: 'Use social engineering and other means to entice users to click on a link, download a document or even an executable file, or enter account details to steal information, exploit browser vulnerabilities, or embed malicious programs.',
          handle: [
            '1. If credentials are lost, the account password should be changed and corresponding emergency treatment should be done in a timely manner;',
            '2. Scanning and security analysis of the machine.',
          ],
          reinforce: [
            '1. Consider using network security devices to block phishing addresses;',
            '2. Provide security awareness training to users to help identify social engineering techniques. ',
          ],
        },
        {
          name: '勒索软件通讯	ransomwareurl',
          des: 'The address is used to download ransomware or to communicate with ransomware.',
          handle: [
            '1. Isolate the machine from the network;',
            '2. If you downloaded the ransomware, remove the software in time;',
            '3. If it is encrypted by ransomware, search security companies’ websites to see if there is a decryption tool.',
          ],
          reinforce: [
            '1. Block the address with a network security device;',
            '2. Install anti-virus software and update virus library in time.',
          ],
        },
        {
          name: '已知APT攻击',
          des: 'This threat detects indicators that have been used by known APT groups.',
          handle: [
            '1. Identify whether the IOCs being detected are still valid;',
            '2. If IOCs are still valid, incident response and highest priority processing should be undergoing according to the relevant information of APT groups.',
          ],
          reinforce: [
            'According to the APT group’s tactics, technology and process (TTP) to do the corresponding security enhancements.',
          ],
        },
        {
          name: '恶意证书',
          des: 'The program in the machine uses malicious ssl certificates to communicate with the external world.',
          handle: [
            '1. Isolate the machine from the network;',
            '2. Locate the malicious process at the machine according to the port in the network event of the alert details;',
            '3. Do a security analysis to identify the root cause and the extent the threat has spread. If you have an EDR solution installed, you can quickly locate the problem by doing security incident investigation directly through historical information;',
            '4. Install anti-virus software for full system scanning.',
          ],
          reinforce: [
            '1. Enhance endpoint security capabilities;',
            '2. Block the network connection of devices that do not need Internet access with network security devices;',
            '3. Use network threat detection solutions to detect outreach threats as early as possible.',
          ],
        },
        {
          name: 'VPN地址vpn',
          des: 'VPN addresses are IP addresses of public VPN providers’ VPN servers. Attackers use VPN to circumvent organizations’ security policies. There are a few legitimate uses of VPN in an organization.',
          handle: [
            '1. Verify that the user of the machine is using VPN legitimately;',
            '2. If an attack is confirmed, it should be mitigated starting from the process that has visited the address by identifying the machine port in the "network event" in the alert details.',
          ],
          reinforce: [
            '1. Install anti-virus software and update virus library in time;',
            '2. Consider using network security devices to block that VPN address.',
          ],
        },
      ],
    };
  },

  created () {
    let asset_ip = this.$route.query.asset_ip;
    let status = this.$route.query.status;
    let id = this.$route.query.id;
    this.detail.asset_ip = asset_ip;
    this.detail.status = status;
    this.detail.id = id;
    this.get_list_assets_detail();
    this.get_assets_detail_top();
  },
  methods: {
    //获取资产详情顶部
    get_assets_detail_top () {
      this.suggest_flag = false;
      this.$axios.get('/yiiapi/asset/asset-details',
        {
          params: {
            id: this.detail.id
          }
        })
        .then((resp) => {
          //console.log(resp)
          let { status, data, msg } = resp.data;

          if (status == 0) {
            let attr = [];

            data.label_group = data.asset_label.join(',');

            attr.push(data);

            this.table_assets.tableData = attr;
            this.table_assets.count = 1;
            this.table_assets.pageNow = 1;
            let base_category = data.label.base_category;

            if (base_category.includes('workstation')) {
              data.new_base_category = ['workstation'];
            } else if (base_category.includes('Server')) {
              data.new_base_category = ['Server'];
            } else if (base_category.includes('Network device')) {
              data.new_base_category = ['Network device'];
            }
            data.new_branch = data.label.branch;
            data.new_department = data.label.department;
            data.new_business = data.label.business;

            ///
            if (data.workorder_id == '0') {
              data.new_workorder_status = 'No ticket associated';
              data.new_workorder_name = '';
            } else {
              if (data.workorder_status && data.workorder_name) {
                switch (data.workorder_status += '') {
                  case '0':
                    data.new_workorder_status = 'To be Assigned'
                    break;
                  case '1':
                    data.new_workorder_status = 'Assigned';
                    break;
                  case '2':
                    data.new_workorder_status = 'In Progress';
                    break;
                  case '3':
                    data.new_workorder_status = 'Resolved';
                    break;
                  case '4':
                    data.new_workorder_status = 'Cancelled';
                    break;
                  default:
                    break;
                }
                data.new_workorder_name = data.workorder_name;
              } else {
                data.new_workorder_status = '';
                data.new_workorder_name = '';
              }
            }
            this.assets_top = data;
            this.suggest_flag = true;
            //攻击阶段
            this.attack_stage_list.forEach(function (v, k) {
              if (data.attack_stage && data.attack_stage.length) {

                data.attack_stage.forEach(function (v1, k1) {
                  if (v.name == v1.attack_stage) {
                    v.count = v1.count;
                  }
                })
              }
            });

          } else if (status == 9) {
            // this.$message.error(msg);
            this.$router.push({ path: "/handle/assets" });
          }
        });
    },

    //获取资产详情列表
    get_list_assets_detail () {
      this.$axios.get('/yiiapi/asset/alert-list',
        {
          params: {
            asset_ip: this.detail.asset_ip,
            page: this.table.pageNow,
            rows: this.table.eachPage
          }
        })
        .then((resp) => {
          let { status, data } = resp.data;
          let datas = data;
          if (status == 0) {
            let { data, count, maxPage, pageNow } = datas;

            this.table.tableData = data;
            if (this.table.tableData.length > 1) {
              this.notes = true
            }
            this.table.count = count;
            this.table.maxPage = maxPage;
            this.table.pageNow = pageNow;

          }
        });
    },


    //每頁多少條切換
    handleSizeChange (val) {
      this.table.eachPage = val;
      this.table.pageNow = 1;
      this.get_list_assets_detail();
    },

    //頁數點擊切換
    handleCurrentChange (val) {
      this.table.pageNow = val;
      this.get_list_assets_detail();
    },

    //跳转至工单详情
    Goto_workorder () {
      this.$router.push({ path: "/detail/works", query: { id: this.assets_top.workorder_id, type: 'asset' } });
    },

    /***********************************以下是弹窗部分****************************************/
    /***********************************以下是弹窗部分****************************************/

    // 状态变更选择
    change_state (command) {
      this.process_state = command;
      this.ok_state();
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
      this.state_change = true;
    },

    //关闭状态变更弹窗
    closed_state () {
      this.state_change = false;
    },

    //状态变更取消按钮点击
    cancel_state () {
      this.closed_state();
    },

    //状态变更确定按钮点击
    ok_state () {
      //资产处理
      let asset_ip_group = this.detail.asset_ip;
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
        asset_ip: Array.of(asset_ip_group),
        status: change_status
      })
        .then(resp => {
          let { status, data, msg } = resp.data;
          this.closed_state();
          if (status == 0) {
            this.$message.success('Change asset status successfully');
            this.get_assets_detail_top();
          } else {
            this.$message.error(msg);
          }
        }).catch(err => {
          console.log(err);
        })
    },

    /***************工单任务*****************/

    //打开编辑工单
    open_task_new () {
      let status = this.detail.status;
      if (status == '3' || status == '4' || status == '5') {
        this.$message({ message: 'Asset whose status is resolved, ignored, false positive cannot create new tickets.', type: 'warning' });
      } else {
        this.table_assets.count = this.table_assets.tableData.length;
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
            console.log('User list error');
            console.log(err);
          })
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
        this.$message.error('Exited');
      } else {
        this.table_operator.tableData.unshift(item);
      }

      let selected_name_attr = this.table_operator.tableData
        .map(x => { return x.username });

      this.task_params.new_operator = selected_name_attr;
    },

    //经办人页数点击
    hcc_table_operator (val) {
      this.table_operator.pageNow = val;
    },

    //tabs下table每页显示多少条
    sc_table_assets (val) {
      this.table_assets.eachPage = val;
      this.table_assets.pageNow = 1;
      let handle_data = this.table_assets.tableData.slice(0, val);
      this.table_assets.tableData_new = handle_data;
    },

    //tabs下第一个table页数点击(资产)
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
        let selected = this.table_assets.tableData
          .map(x => { return x.id * 1 });
        this.task_params.multiple = selected;
      }
      console.log(this.task_params.multiple);
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
            this.get_assets_detail_top();
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
        let selected = this.table_assets.tableData
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
            this.get_assets_detail_top();
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
      let status = this.detail.status;
      if (status == '3' || status == '4' || status == '5') {
        this.$message({ message: 'Asset whose status is resolved, ignored, false positive cannot be added to the ticket.', type: 'warning' });
      } else {
        this.add_state_change = true;
        this.get_table_works_list();
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
        .catch(err => {
          console.log(err);
        })
    },

    //新加到工单取消状态
    add_closed_state () {
      this.add_state_change = false;
      this.table_add_works.tableData = [];
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
    },

    //新加工单列表勾选某一条记录
    handle_sel_table_add_works (row) {
      console.log('************')
      console.log(row);
      this.table_add_works.multipleSelection = row;
    },

    //新加到工单确定
    add_ok_state () {

      let selected_attr = this.table_assets.tableData
        .map(x => { return x.id * 1 });
      this.add_params.multiple = selected_attr;

      console.log(this.add_params.multiple)

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


        console.log(this.add_params.multiple);
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

              this.get_assets_detail_top();
            } else if (status == 1) {
              this.$message.error(msg);
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    // 跳转列表详情
    detail_click (val) {
      console.log(val);
      this.$router.push({ path: "/detail/network", query: { detail: val.id, type: 'asset' } });

      // this.$router.push({ path: "/detail/assets/alert", query: { detail: val.id, type: 'asset' } });
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
@import '../../../../assets/css/less/common-pattern.less';
@import '../../../../assets/css/less/common-table-pattern.less';
.detail-assets {
  text-align: left;
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
  .detail_base_top {
    padding: 0 56px;
    height: 62px;
    background: #fff;
    position: relative;
    border-bottom: 1px solid #ececec;
    .top_left {
      float: left;
      margin-top: 16px;
      img {
        width: 24px;
        margin-right: 5px;
        vertical-align: middle;
      }
      .top_left_title {
        vertical-align: middle;
        font-family: PingFangMedium;
        font-size: 16px;
        color: #333333;
      }
    }
    .top_right {
      float: right;
      height: 62px;
    }
  }

  .detail_base_mid {
    padding: 24px 56px;
    background: #fff;
    display: flex;
    width: 100%;
    .bom_item {
      flex: 1;
      li {
        display: flex;
        margin-bottom: 16px;
        line-height: 30px;
        .title {
          width: 150px;
          font-family: PingFang;
          font-size: 16px;
          color: #333333;
          .b_i {
            width: 18px;
            height: 16px;
            margin-right: 8px;
            display: inline-block;
            &.b_name {
              vertical-align: unset;
              background-repeat: no-repeat;
              background-size: 18px 16px;
              background-image: url('../../../../assets/images/handle/others/works-name.png');
            }
          }
        }
        .content {
          flex: 1;
          font-size: 16px;
          color: #666;
          &.Goto_workorder {
            color: #0070ff;
            cursor: pointer;
          }
          .tag_btn_box {
            margin: 0 2px;
            display: inline-block;
            height: 20px;
            padding: 0 3px;
            border-radius: 2px;
            color: #ffffff;
            background: #5389e0;
            text-align: center;
            .tag_btn {
              height: 20px;
              font-size: 10px;
              line-height: 20px;
              font-family: PingFang;
              transform: scale(0.8);
              display: block;
            }
          }
          .status {
            background: #eef6ff;
            border-radius: 2px;
            font-size: 10px;
            color: #999999;
            padding: 5px 14px;
          }
        }
      }
    }
  }

  .detail_base_stg {
    margin: 24px 0;
    background: #fff;
    height: 171px;
    .top_left {
      height: 62px;
      line-height: 60px;
      text-align: left;
      padding: 0 56px;
      border-bottom: 1px solid #ececec;
      .b_img {
        width: 24px;
        vertical-align: text-top;
        margin-right: 5px;
      }
      .title_name {
        vertical-align: middle;
        font-family: PingFangMedium;
        font-size: 16px;
        color: #333333;
      }
    }
    /*.stg-content {
      margin: 0 56px;
      height: 110px;
      position: relative;
    }*/
    .attack_stage_bom {
      height: 108px;
      padding: 30px 56px;
      display: flex;
      justify-content: space-between;
      .stage_item_box {
        width: 114px;
        height: 56px;
        /* line-height: 48px;*/
        background: #eef6ff;
        border-radius: 2px;
        font-size: 16px;
        color: #aaaaaa;
        text-align: center;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        .circle_box {
          display: block;
          font-size: 12px;
          box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.24);
          width: 18px;
          height: 18px;
          line-height: 18px;
          color: #fff;
          border-radius: 18px;
          background: #ff5f5c;
          position: absolute;
          top: -9px;
          right: -9px;
        }
      }
      .count_color {
        color: #0070ff;
      }
      .stage_img_box {
        flex: 1;
        margin: 0 5px;
        height: 48px;
        line-height: 48px;
        img {
          margin-top: 16px;
          width: 100%;
          height: 24px;
        }
      }
    }
  }

  .detail_base_mag {
    margin: 24px 0;
    height: 283px;
    background-color: #fff;
    text-align: left;
    .osm-top {
      height: 62px;
      line-height: 62px;
      border-bottom: 1px solid #ececec;
      padding: 0 56px;
      .osm-img {
        display: inline-block;
        width: 24px;
        height: 24px;
        margin: 19px 0;
      }
      .osm-title {
        display: inline-block;
        font-family: PingFang;
        font-size: 16px;
        color: #333333;
        margin-left: 6px;
      }
    }
    .osm-middle {
      height: 220px;
      padding: 16px 56px;
      .osm-dt {
        font-family: PingFangMedium;
        font-size: 14px;
        color: #333333;
        margin: 5px 0;
      }
      .osm-dd {
        font-family: PingFang;
        font-size: 14px;
        color: #666666;
      }
    }
  }
  // 威胁安全建议
  .suggest_box {
    text-align: left;
    background: #fff;
    margin-bottom: 24px;
    .suggest_top {
      padding: 0 56px;
      height: 62px;
      border-bottom: 1px solid #ececec;
      .suggest_title {
        font-family: PingFangMedium;
        font-size: 16px;
        color: #333333;
        line-height: 62px;
      }
      .icon_img {
        width: 24px;
        vertical-align: middle;
      }
    }
    .suggest_bom {
      padding: 16px 56px;
      .suggest_icon {
        width: 13px;
        height: 6px;
        vertical-align: middle;
      }
      .suggest_bom_title {
        font-family: PingFangMedium;
        font-size: 14px;
        color: #333333;
      }
      .suggest_bom_des {
        margin: 8px 0 24px 0;
        font-size: 14px;
        color: #666666;
      }
      .suggest_bom_li {
        font-size: 14px;
        color: #666666;
      }
      .suggest_bom_list {
        margin: 12px 0 8px 0;
      }
    }
  }

  .detail_base_bom {
    margin-top: 24px;
    /*height: 717px;*/
    height: auto;
    background: #fff;
    padding: 24px 56px;

    /deep/ .handle_table_detail {
      .el-table__header-wrapper {
        .el-table__header {
          thead.has-gutter {
            th {
              background: #f8f8f8;
              height: 48px;
              .cell {
                color: #333;
                font-size: 14px;
              }
            }
          }
        }
      }
      .el-table__body-wrapper {
        .el-table__row {
          height: 48px;
        }
        td > .cell {
          font-family: PingFangMedium;
          .high {
            color: #dc5f5f;
            /* button {
              background: #dc5f5f;
            }*/
          }
          .mid {
            color: #e0c840;
            /*button {
              background: #e0c840;
            }*/
          }
          .low {
            color: #47cad9;
            /* button {
              background: #47cad9;
            }*/
          }
        }
      }
    }
    .handle_pagination_box {
      margin: 24px 0;
      text-align: center;
    }
    /deep/ .el-tabs {
      .el-tabs__header {
        .el-tabs__nav-wrap {
          &:after {
            background-color: #eef6ff;
          }
          .el-tabs__nav {
            /*line*/
            .el-tabs__active-bar {
              top: 0 !important;
              width: 164px !important;
              background-color: #0070ff;
              transition: transform 0.1s cubic-bezier(0.645, 0.045, 0.355, 1),
                -webkit-transform 0.1s cubic-bezier(0.645, 0.045, 0.355, 1);
            }
            /*tabs*/
            .el-tabs__item {
              padding: 0 !important;
              width: 164px;
              font-size: 14px;
              color: #bbb;
              text-align: center;
              &.is-active {
                color: #0070ff;
                background: #eef6ff;
              }
            }
          }
        }
      }
    }
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
            font-weight: 500;
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
          .content_p {
            text-align: center;
          }
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
            font-weight: 500;
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
            background-image: url('../../../../assets/images/emerge/step1.png');
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
            background-image: url('../../../../assets/images/emerge/step2.png');
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
            font-weight: 500;
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
<style lang="less">
body {
  > ul.dropdown_ul_box_124 {
    width: 156px !important;
  }
}
</style>






