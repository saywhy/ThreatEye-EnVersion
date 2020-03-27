<template>
  <div class="detail-network"
       v-loading.fullscreen.lock="loading"
       v-cloak>
    <back-title :title-name="title_name"></back-title>
    <div class="detail_base">
      <div class="detail_base_top">
        <div class="top_left">
          <img src="@/assets/images/emerge/top1.png"
               alt="">
          <img src="@/assets/images/emerge/top2.png"
               alt="">
          <img src="@/assets/images/emerge/top3.png"
               alt="">
        </div>
        <div class="top_right">
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
                  <el-dropdown-item command='2'
                                    class="select_item">In Progress</el-dropdown-item>
                  <el-dropdown-item command="3"
                                    class="select_item">Resolved</el-dropdown-item>
                  <el-dropdown-item command='4'
                                    class="select_item">Ignored</el-dropdown-item>
                  <el-dropdown-item command="5"
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
                  <el-dropdown-item command="1">Create</el-dropdown-item>
                  <el-dropdown-item command="2">Add to ticket</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-button class="edit_btn"
                         @click="edit_tag_box">Tags</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="detail_base_bottom">
        <div class="detail_base_bottom_item">
          <ul>
            <li class="item_li">
              <span class="item_li_title">Source IP:</span>
              <el-dropdown @command="change_state_src"
                           trigger="click"
                           class="src_dropdown_box"
                           placement='bottom-start'
                           size='148'>
                <el-button class="change_src_btn">
                  <span>{{network_detail.src_ip}}</span>
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown"
                                  style="width:200px;"
                                  class="dropdown_ul_box_detail">
                  <el-dropdown-item command='1'
                                    class="select_item">Threat hunting</el-dropdown-item>
                  <el-dropdown-item command="2"
                                    class="select_item">Add to the external dynamic list</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </li>
            <li class="item_li">
              <span class="item_li_title">Destination IP:</span>
              <el-dropdown @command="change_state_dest"
                           trigger="click"
                           class="src_dropdown_box"
                           placement='bottom-start'
                           size='148'>
                <el-button class="change_src_btn">
                  <span>{{network_detail.dest_ip}}</span>
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown"
                                  style="width:200px;"
                                  class="dropdown_ul_box_detail">
                  <el-dropdown-item command='1'
                                    class="select_item">Threat hunting</el-dropdown-item>
                  <el-dropdown-item command="2"
                                    class="select_item">Add to the external dynamic list</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </li>
            <li class="item_li">
              <span class="item_li_title">Source labels:</span>
              <div class="item_li_content">
                <ul v-if="network_detail.src_label_obj.length !=0">
                  <li class="tag_btn_box"
                      v-for="item in network_detail.src_label_obj">
                    <span class="tag_btn">{{item}}</span>
                  </li>
                </ul>
              </div>
            </li>
            <li class="item_li">
              <span class="item_li_title">Destination labels:</span>
              <div class="item_li_content">
                <ul v-if="network_detail.dest_label_obj.length !=0">
                  <li class="tag_btn_box"
                      v-for="item in network_detail.dest_label_obj">
                    <span class="tag_btn">{{item}}</span>
                  </li>
                </ul>
              </div>
            </li>
            <li class="item_li">
              <span class="item_li_title">Time:</span>
              <span class="item_li_content">{{network_detail.alert_time}}</span>
            </li>
            <li class="item_li">
              <span class="item_li_title">Indicator:</span>
              <span class="item_li_content">{{network_detail.indicator}}</span>
            </li>
            <li class="item_li">
              <span class="item_li_title">Type:</span>
              <span class="item_li_content">{{network_detail.category}}</span>
            </li>
            <li class="item_li">
              <span class="item_li_title">Status:</span>
              <span class="item_li_content">{{network_detail.status | alert_status}}</span>
            </li>
          </ul>
        </div>
        <div class="detail_base_bottom_item">
          <ul>
            <li class="item_li">
              <span class="item_li_title">Protocol:</span>
              <span class="item_li_content">{{network_detail.application}}</span>
            </li>
            <li class="item_li">
              <span class="item_li_title">Detection Engine:</span>
              <span class="item_li_content">{{network_detail.detect_engine}}</span>
            </li>
            <li class="item_li">
              <span class="item_li_title">Compromise:</span>
              <span :class="network_detail.fall_certainty == '0'?'':'fall_certainty'">
                {{network_detail.fall_certainty == '0'?'':'Compromised'}}</span>
            </li>
            <li class="item_li">
              <span class="item_li_title">Labels:</span>
              <div class="item_li_content">
                <ul v-if="network_detail.label_obj.length !=0">
                  <li class="tag_btn_box"
                      v-for="item in network_detail.label_obj">
                    <span class="tag_btn">{{item}}</span>
                  </li>
                </ul>
              </div>
            </li>
            <li class="item_li">
              <span class="item_li_title">Attack Phase:</span>
              <span class="item_li_content">{{network_detail.attack_stage_cn }}</span>
            </li>
            <li class="item_li">
              <span class="item_li_title">Ticket Name:</span>
              <span class="item_li_content Goto_workorder"
                    @click="Goto_workorder"
                    v-if="network_work_order.work_name!=''">{{network_work_order.work_name}}</span>
            </li>
            <li class="item_li">
              <span class="item_li_title">Ticket Status:</span>
              <span class="item_li_content">{{network_work_order.work_order_status}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 检测时间轴 -->
    <div class="detail_time_box">
      <p class="time_title">Detection Timeline</p>
      <div class="time_content">
        <div class="time_left">
          <ul class="time_left_list">
            <li class="time_item"
                v-for="(item,index) in network_times"
                @click="time_active(index)"
                :class="{active:time_choose==index}">
              <div class="triangle"
                   v-show="time_choose==index"></div>
              <div class="time_item_left">
                <img src="@/assets/images/emerge/time_false.png"
                     v-show="time_choose!=index">
                <img src="@/assets/images/emerge/time_true.png"
                     v-show="time_choose==index">
              </div>
              <div class="time_item_right">
                <p>{{item.alert_time}} </p>
              </div>
            </li>
          </ul>
        </div>
        <div class="time_right">
          <div v-for="(item,index) in network_times"
               v-show="time_choose==index">
            <p class="title">Details</p>
            <div class="time_right_info">
              <div class="time_right_info_top">
                <li class="info_top_item"
                    v-for="value in item.info_list">
                  <span class="info_top_item_title">{{value.name}}</span>
                  <span v-if="value.name=='file_size'">
                    {{value.value | filterType }}
                  </span>
                  <span class="info_top_item_content"
                        v-if="value.name!='file_size'"
                        :class="value.value=='download'?'download_text':''"
                        @click="download(value,item)">{{value.value}}</span>
                </li>
              </div>
              <div class="time_right_info_bom"
                   v-if="item.whois_list.length !=0">
                <span class="info_bom_title">Whois</span>
                <div class="info_bom_item">
                  <div class="info_bom_item_li"
                       v-for="demo in item.whois_list">
                    <div class="left_li">{{demo.name}}</div>
                    <div class="right_li">{{demo.value}}</div>
                  </div>
                </div>
              </div>
            </div>
            <p class="title">Network Event</p>
            <div class="time_right_net">
              <div class="time_right_net_item"
                   v-for="demo in item.event_list">
                <div class="title_net">{{demo.name}}</div>
                <div class="value_net">{{demo.value}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 攻击阶段 -->
    <div class="attack_stage_box">
      <div class="detail_base_top">
        <img src="@/assets/images/emerge/detai_attack.png"
             alt=""
             class="icon_img">
        <span class="attack_stage_title">Attack Phase Distribution</span>
      </div>
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
    <!-- Threat and Security Recommendations -->
    <div class="suggest_box">
      <div class="suggest_top">
        <img src="@/assets/images/emerge/detal_jianyi.png"
             alt=""
             class="icon_img">
        <span class="suggest_title">Threat and Security Recommendations</span>
      </div>
      <div class="suggest_bom">
        <p class="suggest_bom_title">Threat description</p>
        <p class="suggest_bom_des">{{suggest_list[network_detail.safety_suggestion].des}}</p>
        <p class="suggest_bom_title">Security Recommendations</p>
        <p class="suggest_bom_list">
          <img src="@/assets/images/emerge/detail_suggest.png"
               class="suggest_icon"
               alt="">
          <span class="suggest_bom_title">Mitigation Recommendations</span>
        </p>
        <div>
          <p class="suggest_bom_li"
             v-for="item in suggest_list[network_detail.safety_suggestion].handle">
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
             v-for="item in suggest_list[network_detail.safety_suggestion].reinforce">
            {{item}}
          </p>
        </div>
      </div>
    </div>
    <!-- 告警列表 -->
    <div class="emerge_box">
      <el-tabs v-model="emerge_list.activeName"
               @tab-click="handleClick"
               class="reset_tab">
        <el-tab-pane label="Current Risk Assets"
                     class="tabs-item"
                     name="first">
          <el-table class="emerge_table"
                    ref="multipleTable"
                    align="center"
                    :data="emerge_list.now.data"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="handleSelectionChange">
            <el-table-column prop="alert_time"
                             label="Time"
                             show-overflow-tooltip>
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
            <el-table-column label="Severity">
              <template slot-scope="scope">
                <span class="btn_alert_background"
                      :class="{'high_background':scope.row.degree =='High risk','mid_background':scope.row.degree =='Medium risk','low_background':scope.row.degree =='Low risk'}">
                  {{ scope.row.degree | degree_sino }}</span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination class="pagination_box"
                         @size-change="handleSizeChange_now"
                         @current-change="handleCurrentChange_now"
                         :current-page="emerge_list.now.pageNow"
                         :page-sizes="[10,20,50,100]"
                         :page-size="10"
                         layout="total, sizes, prev, pager, next"
                         :total="emerge_list.now.count">
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="Historical Risk Assets"
                     class="tabs-item"
                     name="second">
          <el-table class="emerge_table"
                    ref="multipleTable"
                    align="center"
                    :data="emerge_list.old.data"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="handleSelectionChange">
            <el-table-column prop="alert_time"
                             label="Time"
                             show-overflow-tooltip>
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
            <el-table-column label="Severity">
              <template slot-scope="scope">
                <span class="btn_alert_background"
                      :class="{'high_background':scope.row.degree =='high','mid_background':scope.row.degree =='medium','low_background':scope.row.degree =='low'}">
                  {{ scope.row.degree | degree_sino }}</span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination class="pagination_box"
                         @size-change="handleSizeChange_old"
                         @current-change="handleCurrentChange_old"
                         :current-page="emerge_list.old.pageNow"
                         :page-sizes="[10,20,50,100]"
                         :page-size="10"
                         layout="total, sizes, prev, pager, next"
                         :total="emerge_list.old.count">
          </el-pagination>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 编辑标签 -->
    <el-dialog class="add_tag pop_box"
               :close-on-click-modal="false"
               :modal-append-to-body="false"
               :visible.sync="edit_tag.pop">
      <img src="@/assets/images/emerge/closed.png"
           @click="closed_edit_tag_box"
           class="closed_img"
           alt="">
      <div class="title">
        <div class="mask"></div>
        <span class="title_name">Edit</span>
      </div>
      <div class="content">
        <div class="content_item">
          <div class="item_addrs"
               v-for="(item,index) in edit_tag.tag_list">
            <el-input class="select_box"
                      placeholder="Please enter up to 5 labels"
                      v-model="item.name"
                      clearable>
            </el-input>
            <img src="@/assets/images/common/add.png"
                 alt=""
                 class="img_box"
                 v-if="item.icon"
                 @click="add_tag">
            <img src="@/assets/images/common/del.png"
                 alt=""
                 class="img_box"
                 @click="del_tag(item,index)"
                 v-if="!item.icon">
          </div>
        </div>
      </div>
      <div class="btn_box">
        <el-button @click="closed_edit_tag_box"
                   class="cancel_btn">Cancel</el-button>
        <el-button class="ok_btn"
                   @click="edit_tag_true">Confirm</el-button>
      </div>
    </el-dialog>
    <!-- 弹窗 -->
    <!-- 添加到工单 -->
    <!--:visible.sync="worksheets_data.pop" class="pop_state_add pop_box"-->
    <el-dialog class="pop_state_add pop_box"
               :close-on-click-modal="false"
               :modal-append-to-body="false"
               :visible.sync="add_state_change">
      <img src="@/assets/images/emerge/closed.png"
           @click="add_closed_state1"
           class="closed_img"
           alt="">
      <div class="title">
        <div class="mask"></div>
        <span class="title_name">Add to ticket</span>
      </div>
      <div class="content">
        <div class="add_works">
          <el-table ref="multipleTable"
                    class="reset_table"
                    align="center"
                    :data="table_add_works.tableData"
                    tooltip-effect="dark"
                    @selection-change="handle_sel_table_add_works"
                    style="width: 100%">
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
              <template slot-scope="scope">{{ scope.row.priority | priority}}</template>
            </el-table-column>
            <el-table-column prop="new_perator"
                             label="Assignee"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="Status"
                             width="80"
                             show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.status | work_status }}</template>
            </el-table-column>
          </el-table>
          <el-pagination class="pagination_box"
                         @size-change="sc_table_add_works"
                         @current-change="hcc_table_add_works"
                         :current-page="table_add_works.pageNow"
                         :page-sizes="[10,20,50,100]"
                         :page-size="table_add_works.eachPage"
                         layout="total, sizes, prev, pager, next"
                         :total="table_add_works.count">
          </el-pagination>
        </div>
      </div>
      <div class="btn_box">
        <el-button @click="add_closed_state1"
                   class="cancel_btn">Cancel</el-button>
        <el-button @click="add_ok_state"
                   class="ok_btn">Confirm</el-button>
      </div>
    </el-dialog>

    <!-- 弹窗 -->
    <!-- 新建工单任务 -->
    <el-dialog class="task_new_box pop_box"
               :close-on-click-modal="false"
               :modal-append-to-body="false"
               :visible.sync="new_worksheets_data.pop">
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
                :class="new_worksheets_data.new_contet?'step_now':'step_past'">Basic Info</span>
          <img src="@/assets/images/emerge/selected01.png"
               class="selected_img"
               alt="">
        </div>
        <div class="step_box2">
          <span class="step2_span"
                :class="!new_worksheets_data.new_contet?'step_now':'step_past'">Content</span>
        </div>
      </div>
      <!-- 基本信息 -->
      <div class="task_new_content"
           v-if="new_worksheets_data.new_contet">
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
                          v-model="new_worksheets_list.name"
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
                           v-model="new_worksheets_list.operator"
                           clearable
                           placeholder="Please select the assignee">
                  <el-option v-for="item in new_worksheets_data.operator_list"
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
                           v-model="new_worksheets_list.level"
                           clearable
                           placeholder="Please select the priority">
                  <el-option v-for="item in new_worksheets_data.level_list"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </li>
              <li class="right_item">
                <el-checkbox-group v-model="new_worksheets_list.notice">
                  <el-checkbox label="email"
                               value="email">Mail notification</el-checkbox>
                  <el-checkbox label="message"
                               value="message">SMS notification</el-checkbox>
                  <!-- <el-checkbox label="news"
                             value="news">消息中心通知</el-checkbox> -->
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
                      v-model="new_worksheets_list.textarea">
            </el-input>
          </div>
          <div class="content_table">
            <el-table :data="new_worksheets_data.table_operator.tableData"
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
          <el-button @click="next_task"
                     class="next_btn">Next</el-button>
        </div>
      </div>

      <!-- 处置内容 -->
      <div class="task_handle_content"
           v-if="!new_worksheets_data.new_contet">
        <div class="task_content_box">
          <div class='table_box'>
            <div>
              <div>
                <el-table align="center"
                          :data="new_worksheets_data.network_detail"
                          @selection-change="select_alert_new"
                          tooltip-effect="dark"
                          style="width: 100%">
                  <!-- <el-table-column type="selection"
                                 width="40">
                </el-table-column> -->
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
                                   width="100"
                                   show-overflow-tooltip>
                    <template slot-scope="scope">
                      <span class="btn_alert_background"
                            :class="{'high_background':scope.row.degree =='high','mid_background':scope.row.degree =='medium','low_background':scope.row.degree =='low'}">
                        {{ scope.row.degree | degree }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="Compromise"
                                   width="100"
                                   show-overflow-tooltip>
                    <template slot-scope="scope">
                      <span :class="{'fall_certainty':scope.row.fall_certainty == '1'}">
                        {{ scope.row.fall_certainty | certainty }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="Status"
                                   width="80">
                    <template slot-scope="scope">{{ scope.row.status | work_status }}</template>
                  </el-table-column>
                </el-table>
              </div>
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
  </div>
</template>

<script type="text/ecmascript-6">
import backTitle from "@/components/common/back-title";
export default {
  name: "detail-network",
  data () {
    return {
      loading: false,
      network_work_order: {
        work_name: '',
        workorder_id: '',
        work_order_status: '',
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
            '1. Mitigation Recommendations',
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
            '1. Mitigation Recommendations',
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
            '1. Mitigation Recommendations',
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
            '1. Mitigation Recommendations',
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
            '1. Mitigation Recommendations',
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
      ],
      // attack_stage
      network_detail: {
        attack_stage_cn: '',
        label_obj: [],
        src_label_obj: [],
        dest_label_obj: [],
      },
      title_name: "Alert Details",
      network_times: [],
      network_list: {
        new_list: {
          handle: {
            page: 1,
            rows: 10
          }
        },
        old_list: {
          handle: {
            page: 1,
            rows: 10
          }
        },
      },
      time_choose: 0,
      emerge_list: {
        title: ["Current Risk Assets", "Historical Risk Assets"],
        activeName: "first",
        choose: 0,
        now_data: {
          page: 1,
          rows: 10
        },
        old_data: {
          page: 1,
          rows: 10
        },
        now: {},
        old: {}
      },
      src_active_ul: false,
      edit_tag: {
        tag_list: [
        ],
        pop: false
      },


      //添加到工单
      worksheets_data: {
        page: 1,
        rows: 10,
        pop: false,
        tableRadio: {},
        level_list: [
          {
            value: "highest",
            label: "highest"
          },
          {
            value: "high",
            label: "high"
          },
          {
            value: "medium",
            label: "medium"
          },
          {
            value: "low",
            label: "low"
          }
        ],
        status_type: [
          'N/A', 'To be Assigned', 'Assigned', 'In Progress', 'Cancelled', 'Resolved'
        ]
      },
      worksheets_list: {},
      // 新建工单
      new_worksheets_list: {
        name: "",
        level: "",
        operator: "",
        new_operator: [],
        notice: ['email'],
        textarea: "",
        multiple: [],
        select_list: []
      },
      new_worksheets_data: {
        pop: false,
        new_contet: true,
        operator_list: [],
        level_list: [
          {
            value: "highest",
            label: "highest"
          },
          {
            value: "high",
            label: "high"
          },
          {
            value: "medium",
            label: "medium"
          },
          {
            value: "low",
            label: "low"
          }
        ],
        //经办人数组
        table_operator: {
          tableData: [],
          tableData_new: [],
          count: 0,
          pageNow: 1,
          maxPage: 1,
          eachPage: 5
        },
        // 告警数组
        network_detail: []
      },

      //
      table_alerts: {
        tableData: [],
        count: 0,
        pageNow: 1,
        maxPage: 1,
        eachPage: 10,
        loading: true,
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
      }
    };
  },
  components: {
    backTitle
  },
  mounted () {
    this.get_data();
    console.log(this.$route.query);
    // detail: val.id, type: 'risks'
    // horizontalthreat  横向威胁告警  lateral
    // externalthreat  外部威胁告警  outside
    // outreachthreat  外联威胁告警  outreath
  },
  methods: {
    /**************************************************************************************************************/
    /***************新加到工单*****************/

    //添加到工单打开
    open_add_new () {
      this.add_open_state();
    },

    //新加到工单打开状态
    add_open_state () {

      let status = this.table_alerts.tableData[0].status;

      if (status == '3' || status == '4' || status == '5') {
        this.$message({ message: 'Alert whose status is resolved, ignored, false positive cannot be added to the ticket', type: 'warning' });
      } else {
        this.add_state_change = true;
        this.get_table_works_list();
      }
    },
    //新加到工单取消状态
    add_closed_state1 () {
      this.add_state_change = false;
      this.add_params = {
        name: "",
        level: "",
        operator: "",
        new_operator: [],
        notice: ['email'],
        textarea: "",
        multiple: [],
        old_as: []
      };
    },
    //获取列表
    get_table_works_list () {
      let workorder_list = '';
      let workorder_type = '';
      switch (this.$route.query.type) {
        case 'alert':
          workorder_list = '/yiiapi/alert/workorder-list'
          workorder_type = 'alert'
          break;
        case 'asset':
          workorder_list = '/yiiapi/asset/workorder-list'
          workorder_type = 'asset'
          break;
        case 'lateral':
          workorder_list = '/yiiapi/horizontalthreat/workorder-list'
          workorder_type = 'alert'
          break;
        case 'outside':
          workorder_list = '/yiiapi/externalthreat/workorder-list'
          workorder_type = 'alert'
          break;
        case 'outreath':
          workorder_list = '/yiiapi/outreachthreat/workorder-list'
          workorder_type = 'alert'
          break;
        default:
          break;
      }

      this.$axios.get(workorder_list, {
        params: {
          page: this.table_add_works.pageNow,
          rows: this.table_add_works.eachPage,
          type: workorder_type
        }
      }).then((resp) => {
        console.log('*************8')
        console.log(resp)
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

    //新加工单列表勾选某一条记录
    handle_sel_table_add_works (row) {
      // el-radio单选框,不需要这一步
      console.log('&&&&&3434')
      console.log(row)
      this.table_add_works.multipleSelection = row;
    },

    //新加到工单确定
    add_ok_state () {
      let selected_attr = this.table_alerts.tableData
        .map(x => { return x.id * 1 });
      this.add_params.multiple = selected_attr;

      //判断工单列表长度
      let multipe = this.table_add_works.multipleSelection;

      if (multipe.length == 0) {
        this.$message({ message: 'Please select the assets that need to be added to the ticket', type: 'warning' });
      } else if (multipe.length > 1) {
        this.$message({ message: 'Alerts cannot be aAssets or alerts cannot be added to multiple tickets, please try again.dded to multiple tickets, please try again.', type: 'warning' });
      } else {
        console.log('******************')
        this.add_params.id = multipe[0].id;
        this.add_params.name = multipe[0].name;
        this.add_params.level = multipe[0].priority;
        this.add_params.perator = JSON.parse(multipe[0].perator);
        this.add_params.remarks = multipe[0].remarks;
        this.add_params.remind = JSON.parse(multipe[0].remind);

        this.add_params.old_as = JSON.parse(multipe[0].te_alert);
        //console.log(this.add_params);
        this.add_params.multiple = [...this.add_params.multiple, ...this.add_params.old_as];

        console.log(this.add_params.multiple);
        this.add_params.multiple = [...new Set(this.add_params.multiple)];

        var newArr = this.add_params.multiple.filter(item => item)

        this.add_params.multiple = newArr;

        console.log(this.add_params)
        console.log(this.add_params.perator);
        this.loading = true;


        var add_workorder = ''
        // horizontalthreat  横向威胁告警  lateral
        // externalthreat  外部威胁告警  outside
        // outreachthreat  外联威胁告警  outreath
        switch (this.$route.query.type) {
          case 'alert':
            add_workorder = '/yiiapi/alert/add-workorder'
            break;
          case 'asset':
            add_workorder = '/yiiapi/asset/add-workorder'
            break;
          case 'lateral':
            add_workorder = '/yiiapi/horizontalthreat/add-workorder'
            break;
          case 'outside':
            add_workorder = '/yiiapi/externalthreat/add-workorder'
            break;
          case 'outreath':
            add_workorder = '/yiiapi/outreachthreat/add-workorder'
            break;
          default:
            break;
        }

        this.$axios.post(add_workorder,
          {
            id: this.add_params.id,
            type: "alert",
            name: this.add_params.name,
            priority: this.add_params.level,
            perator: this.add_params.perator,
            remind: this.add_params.remind,
            remarks: this.add_params.remarks,
            te_alert: this.add_params.multiple
          }).then((resp) => {
            this.loading = false;
            let { status, msg, data } = resp.data;
            if (status == 0) {
              this.$message.success('Added successfully');
              //清空状态
              this.add_closed_state1();
              this.get_data();
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

    /**************************************************************************************************************/
    // ^[0-9]*$
    // _-.@
    get_rex (str) {
      var pattern = (/[\u4e00-\u9fa5]| /)
      return pattern.test(str)
    },
    // 获取数据
    get_data () {
      this.loading = true
      console.log(this.$route.query.detail);
      var url = ''
      // horizontalthreat  横向威胁告警  lateral
      // externalthreat  外部威胁告警  outside
      // outreachthreat  外联威胁告警  outreath
      switch (this.$route.query.type) {
        case 'alert':
          url = '/yiiapi/alert/alert-details'
          break;
        case 'asset':
          url = '/yiiapi/asset/alert-details'
          break;
        case 'lateral':
          url = '/yiiapi/horizontalthreat/alert-details'
          break;
        case 'outside':
          url = '/yiiapi/externalthreat/alert-details'
          break;
        case 'outreath':
          url = '/yiiapi/outreachthreat/alert-details'
          break;
        default:
          break;
      }

      this.$axios.get(url, {
        params: {
          id: this.$route.query.detail
        }
      })
        .then(response => {
          this.loading = false;
          console.log('*************************************')
          console.log(response)
          let attr = [];
          attr.push(response.data.data);
          this.table_alerts.tableData = attr;
          console.log('*************************************')
          this.network_detail = response.data.data
          this.network_detail.attack_stage_cn = ''
          this.network_detail.src_label_obj = JSON.parse(this.network_detail.src_label)
          this.network_detail.dest_label_obj = JSON.parse(this.network_detail.dest_label)
          if (!this.network_detail.label) {
            this.network_detail.label_obj = []
          } else {
            this.network_detail.label_obj = JSON.parse(this.network_detail.label)
          }
          var workorders = ''
          // horizontalthreat  横向威胁告警  lateral
          // externalthreat  外部威胁告警  outside
          // outreachthreat  外联威胁告警  outreath
          switch (this.$route.query.type) {
            case 'alert':
              workorders = '/yiiapi/alert/workorders'
              break;
            case 'asset':
              workorders = '/yiiapi/asset/workorders'
              break;
            case 'lateral':
              workorders = '/yiiapi/horizontalthreat/workorders'
              break;
            case 'outside':
              workorders = '/yiiapi/externalthreat/workorders'
              break;
            case 'outreath':
              workorders = '/yiiapi/outreachthreat/workorders'
              break;
            default:
              break;
          }
          // 获取当前告警的工单状态
          this.$axios.get(workorders, {
            params: {
              id: this.$route.query.detail
            }
          })
            .then(response => {
              console.log(response.data);
              this.$nextTick(() => {
                console.log(response.data);
                this.network_work_order.workorder_id = response.data.data.workorder_id
                if (response.data.data.workorder_id == '0') {
                  this.network_work_order.work_order_status = 'No ticket associated'
                  this.network_work_order.work_name = ''
                } else {
                  if (response.data.data.workorder_status && response.data.data.workorder_name) {
                    switch (response.data.data.workorder_status += '') {
                      case '0':
                        this.network_work_order.work_order_status = 'To be Assigned'
                        break;
                      case '1':
                        this.network_work_order.work_order_status = 'Assigned';
                        break;
                      case '2':
                        this.network_work_order.work_order_status = 'In Progress';
                        break;
                      case '3':
                        this.network_work_order.work_order_status = 'Resolved';
                        break;
                      case '4':
                        this.network_work_order.work_order_status = 'Cancelled';
                        break;
                      default:
                        break;
                    }
                    this.network_work_order.work_name = response.data.data.workorder_name
                  } else {
                    this.network_work_order.work_order_status = ''
                    this.network_work_order.work_name = ''
                  }
                }
              })
            })
            .catch(error => {
              console.log(error);
            })
          this.network_times = [];
          this.network_times.push(this.network_detail)
          if (this.network_detail.alarm_merger.length != 0) {
            this.network_detail.alarm_merger.forEach(item => {
              item.attack_stage_cn = ''
              this.network_times.push(item)
            });
          }
          console.log(this.network_times);
          // 匹配Type
          this.network_times.forEach(item => {
            item.info_list = []
            item.whois_list = [];
            item.event_list = [];
            if (item.alert_description.whois) {
              for (let key in item.alert_description.whois) {
                var obj = {
                  name: key,
                  value: item.alert_description.whois[key],
                }
                item.whois_list.push(obj)
              }
            } else if (item.alert_description.ip_whois) {
              for (let key in item.alert_description.ip_whois) {
                var obj = {
                  name: key,
                  value: item.alert_description.ip_whois[key],
                }
                item.whois_list.push(obj)

              }
            }
            // 情报类型匹配
            switch (item.description_type) {
              case 'BotnetCAndCURL':
                item.info_list = [
                  {
                    name: 'URL',
                    value: item.alert_description.mask
                  },
                  {
                    name: 'Category',
                    value: item.alert_description.category
                  },
                  {
                    name: 'Threat',
                    value: item.alert_description.threat
                  },
                  {
                    name: 'First_seen',
                    value: item.alert_description.first_seen
                  },
                  {
                    name: 'Popularity',
                    value: item.alert_description.popularity
                  },
                  {
                    name: 'Geo',
                    value: item.alert_description.geo
                  },
                ];
              case 'RansomwareURL':
                item.info_list = [
                  {
                    name: 'URL',
                    value: item.alert_description.mask
                  },
                  {
                    name: 'Category',
                    value: item.alert_description.category
                  },
                  {
                    name: 'First_seen',
                    value: item.alert_description.first_seen
                  },
                  {
                    name: 'Popularity',
                    value: item.alert_description.popularity
                  },
                  {
                    name: 'IP',
                    value: item.alert_description.IP
                  },
                ];
                break;
              case 'IPReputation':
                item.info_list = [
                  {
                    name: 'IP',
                    value: item.alert_description.ip
                  },
                  {
                    name: 'Category',
                    value: item.alert_description.category
                  },
                  {
                    name: 'First_seen',
                    value: item.alert_description.first_seen
                  },
                  {
                    name: 'Popularity',
                    value: item.alert_description.popularity
                  },
                  {
                    name: 'Geo',
                    value: item.alert_description.geo
                  },
                  {
                    name: 'Domains',
                    value: item.alert_description.domains
                  },
                ];
                break;
              case 'MaliciousHash':
                item.info_list = [
                  {
                    name: 'MD5',
                    value: item.alert_description.MD5
                  },
                  {
                    name: 'SHA256',
                    value: item.alert_description.SHA256
                  },
                  {
                    name: 'File_size',
                    value: item.alert_description.file_size
                  },
                  {
                    name: 'File_type',
                    value: item.alert_description.file_type
                  },
                  {
                    name: 'File_name',
                    value: item.alert_description.file_name
                  },
                  {
                    name: 'Category',
                    value: item.alert_description.category
                  },
                  {
                    name: 'Threat',
                    value: item.alert_description.threat
                  },
                  {
                    name: 'First_seen',
                    value: item.alert_description.first_seen
                  },
                  {
                    name: 'Popularity',
                    value: item.alert_description.popularity
                  },
                  {
                    name: "Geo",
                    value: item.alert_description.geo,
                  },
                  {
                    name: "IP",
                    value: item.alert_description.IP,
                  },
                ];
                break;
              case 'MaliciousURL':
                item.info_list = [
                  {
                    name: 'URL',
                    value: item.alert_description.mask
                  },
                  {
                    name: 'Category',
                    value: item.alert_description.category
                  },
                  {
                    name: 'First_seen',
                    value: item.alert_description.first_seen
                  },
                  {
                    name: 'Popularity',
                    value: item.alert_description.popularity
                  },
                  {
                    name: "Geo",
                    value: item.alert_description.geo,
                  },
                  {
                    name: "File",
                    value: item.alert_description.file,
                  },
                ];
                break;
              case 'PhishingURL':
                item.info_list = [
                  {
                    name: 'URL',
                    value: item.alert_description.mask
                  },
                  {
                    name: 'Category',
                    value: item.alert_description.category
                  },
                  {
                    name: 'First_seen',
                    value: item.alert_description.first_seen
                  },
                  {
                    name: 'Popularity',
                    value: item.alert_description.popularity
                  },
                  {
                    name: "Geo",
                    value: item.alert_description.geo,
                  },
                  {
                    name: "IP",
                    value: item.alert_description.IP,
                  },
                ];
                break;
              case 'MobileMaliciousHash':
                item.info_list = [
                  {
                    name: 'MD5',
                    value: item.alert_description.MD5
                  },
                  {
                    name: 'SHA256',
                    value: item.alert_description.SHA256
                  },
                  {
                    name: 'File_size',
                    value: item.alert_description.file_size
                  },
                  {
                    name: 'Category',
                    value: item.alert_description.category
                  },
                  {
                    name: 'Threat',
                    value: item.alert_description.threat
                  },
                  {
                    name: 'First_seen',
                    value: item.alert_description.first_seen
                  },
                  {
                    name: 'Popularity',
                    value: item.alert_description.popularity
                  },
                  {
                    name: "Geo",
                    value: item.alert_description.geo,
                  },
                ];
                break;
              case 'sdk':
                item.info_list = [
                  {
                    name: 'Category',
                    value: item.alert_description.category
                  },
                  {
                    name: 'File_name',
                    value: item.alert_description.file_name
                  },
                  {
                    name: 'File_size',
                    value: item.alert_description.file_size
                  },
                  {
                    name: 'MD5',
                    value: item.alert_description.md5
                  },
                  {
                    name: 'Threat',
                    value: item.alert_description.threat
                  },
                ];
                break;
              case 'sandbox':
                item.info_list = [
                  {
                    name: 'Category',
                    value: item.alert_description.category
                  },
                  {
                    name: 'Filename',
                    value: item.alert_description.filename
                  },
                  {
                    name: 'Size',
                    value: item.alert_description.size
                  },
                  {
                    name: 'Type',
                    value: item.alert_description.type
                  },
                  {
                    name: 'MD5',
                    value: item.alert_description.md5
                  },
                  {
                    name: 'SHA1',
                    value: item.alert_description.sha1
                  },
                  {
                    name: 'SHA256',
                    value: item.alert_description.sha256
                  },
                  {
                    name: 'TaskID',
                    value: item.alert_description.taskID
                  },
                ];
                break;
              case 'yara':
                item.info_list = [
                  {
                    name: "File_name",
                    value: item.alert_description.file_name,
                  },
                  {
                    name: "File_size",
                    value: item.alert_description.file_size,
                  },
                  {
                    name: "MD5",
                    value: item.alert_description.md5,
                  },
                  {
                    name: "Rule_name",
                    value: item.alert_description.rule_name,
                  },
                ];
                break;
              case 'IDS':
                item.info_list = [
                  {
                    name: "Category",
                    value: item.alert_description.category,
                  },
                  {
                    name: "Threat",
                    value: item.alert_description.threat,
                  },
                  {
                    name: "Payload",
                    value: "download",
                  },
                ];
                break;
              default:
                break;
            }
            // 网络事件匹配
            switch (item.network_event.event_type) {
              case 'fileinfo':
                switch (item.network_event.app_proto) {
                  case 'smtp':
                    if (item.network_event.email.to.length > 1) {
                      item.network_event.email_to = item.network_event.email.to.join(
                        ","
                      );
                    }
                    item.event_list = [
                      { name: 'Time', value: item.network_event.timestamp },
                      { name: 'Source IP', value: item.network_event.src_ip + ':' + item.network_event.src_port },
                      { name: 'Destination IP', value: item.network_event.dest_ip + ':' + item.network_event.dest_port },
                      { name: 'Mail_from', value: item.network_event.email.from },
                      { name: 'Recpt_to', value: item.network_event.email_to },
                      { name: 'Traffic', value: 'smtp' },
                    ]
                    break;
                  case 'http':
                    item.event_list = [
                      { name: 'Method', value: item.network_event.http.http_method },
                      { name: 'Source IP', value: item.network_event.src_ip + ':' + item.network_event.src_port },
                      { name: 'Destination IP', value: item.network_event.dest_ip + ':' + item.network_event.dest_port },
                      { name: 'URL', value: item.network_event.http.url },
                      { name: 'User Agent', value: item.network_event.http.http_user_agent },
                      { name: 'Referrer', value: item.network_event.http.http_refer },
                      { name: 'Traffic', value: 'http' },
                    ]
                    break;
                  case 'ftp-data':
                    item.event_list = [
                      { name: 'Time', value: item.network_event.timestamp },
                      { name: 'Source IP', value: item.network_event.src_ip + ':' + item.network_event.src_port },
                      { name: 'Destination IP', value: item.network_event.dest_ip + ':' + item.network_event.dest_port },
                      { name: 'User', value: '-' },
                      { name: 'Traffic', value: 'FTP' },
                    ]
                    break;
                  case 'imap':
                    if (item.network_event.email.to.length > 1) {
                      item.network_event.email_to = item.network_event.email.to.join(
                        ","
                      );
                    }
                    item.event_list = [
                      { name: 'Time', value: item.network_event.timestamp },
                      { name: 'Source IP', value: item.network_event.src_ip + ':' + item.network_event.src_port },
                      { name: 'Destination IP', value: item.network_event.dest_ip + ':' + item.network_event.dest_port },
                      { name: 'Mail_from', value: item.network_event.email.from },
                      { name: 'Recpt_to', value: item.network_event.email_to },
                      { name: 'Traffic', value: 'imap' },
                    ]
                    break;
                  case 'pop3':
                    if (item.network_event.email.to.length > 1) {
                      item.network_event.email_to = item.network_event.email.to.join(
                        ","
                      );
                    }
                    item.event_list = [
                      { name: 'Time', value: item.network_event.timestamp },
                      { name: 'Source IP', value: item.network_event.src_ip + ':' + item.network_event.src_port },
                      { name: 'Destination IP', value: item.network_event.dest_ip + ':' + item.network_event.dest_port },
                      { name: 'Mail_from', value: item.network_event.email.from },
                      { name: 'Recpt_to', value: item.network_event.email_to },
                      { name: 'Traffic', value: 'pop3' },
                    ]
                    break;
                  case 'smb':
                    item.event_list = [
                      { name: 'Time', value: item.network_event.timestamp },
                      { name: 'Source IP', value: item.network_event.src_ip + ':' + item.network_event.src_port },
                      { name: 'Destination IP', value: item.network_event.dest_ip + ':' + item.network_event.dest_port },
                      { name: 'Domain', value: '-' },
                      { name: 'User', value: '-' },
                      { name: 'Traffic', value: 'smb' },
                    ]
                    break;
                  default:
                    if (!item.network_event.app_proto) {
                      item.network_event.app_proto = item.network_event.proto
                    } else if (item.network_event.app_proto == 'failed') {
                      item.network_event.app_proto = ''
                    }
                    item.event_list = [
                      { name: 'Time', value: item.network_event.timestamp },
                      { name: 'Source IP', value: item.network_event.src_ip + ':' + item.network_event.src_port },
                      { name: 'Destination IP', value: item.network_event.dest_ip + ':' + item.network_event.dest_port },
                      { name: 'Traffic', value: item.network_event.app_proto },
                    ]
                    break;
                }
                break;
              case 'flow':
                switch (item.network_event.app_proto) {
                  case 'ftp':
                    item.event_list = [
                      { name: 'Time', value: item.network_event.timestamp },
                      { name: 'Source IP', value: item.network_event.src_ip + ':' + item.network_event.src_port },
                      { name: 'Destination IP', value: item.network_event.dest_ip + ':' + item.network_event.dest_port },
                      { name: 'User', value: item.network_event.user },
                      { name: 'Traffic', value: item.network_event.app_proto },
                    ]
                    break;
                  default:
                    if (!item.network_event.app_proto) {
                      item.network_event.app_proto = item.network_event.proto
                    } else if (item.network_event.app_proto == 'failed') {
                      item.network_event.app_proto = ''
                    }
                    item.event_list = [
                      { name: 'Time', value: item.network_event.timestamp },
                      { name: 'Source IP', value: item.network_event.src_ip + ':' + item.network_event.src_port },
                      { name: 'Destination IP', value: item.network_event.dest_ip + ':' + item.network_event.dest_port },
                      { name: 'Traffic', value: item.network_event.app_proto },
                    ]
                    break;
                }
                break
              case 'smb':
                item.event_list = [
                  { name: 'Time', value: item.network_event.timestamp },
                  { name: 'Source IP', value: item.network_event.src_ip + ':' + item.network_event.src_port },
                  { name: 'Destination IP', value: item.network_event.dest_ip + ':' + item.network_event.dest_port },
                  { name: 'Domain', value: '-' },
                  { name: 'User', value: '-' },
                  { name: 'Traffic', value: item.network_event.event_type },
                ]
                break
              case 'ssh':
                item.event_list = [
                  { name: 'Time', value: item.network_event.timestamp },
                  { name: 'Source IP', value: item.network_event.src_ip + ':' + item.network_event.src_port },
                  { name: 'Destination IP', value: item.network_event.dest_ip + ':' + item.network_event.dest_port },
                  { name: 'Tool', value: item.network_event.ssh.client.software_version },
                  { name: 'User', value: '-' },
                  { name: 'Traffic', value: item.network_event.event_type },
                ]
                break
              case 'tls':
                if (item.network_event.tls.subject) {
                  item.network_event.tls.Authorizing = item.network_event.tls.subject.substring(
                    item.network_event.tls.subject.indexOf("CN=") + 3
                  );
                }
                item.event_list = [
                  { name: 'Time', value: item.network_event.timestamp },
                  { name: 'Source IP', value: item.network_event.src_ip + ':' + item.network_event.src_port },
                  { name: 'Destination IP', value: item.network_event.dest_ip + ':' + item.network_event.dest_port },
                  { name: 'URL', value: item.network_event.tls.sni },
                  { name: 'Issuerdn', value: item.network_event.tls.issuerdn },
                  { name: 'Authorizing', value: item.network_event.tls.Authorizing },
                  { name: 'Notafter', value: item.network_event.tls.notafter },
                  { name: 'Traffic', value: 'https' },
                ]
                break
              case 'dns':
                if (item.network_event.dns.grouped) {
                  item.network_event.dns.HostAddr = item.network_event.dns.grouped.join(
                    ","
                  );
                }
                if (item.network_event.dns.answers) {
                  item.network_event.dns.answers.forEach(element => {
                    if (item.network_event.dns.rrname == element.rrname) {
                      item.network_event.dns.ttl = element.ttl;
                      item.network_event.dns.rrtype = element.rrtype;
                    }
                  });
                }
                item.event_list = [
                  { name: 'Time', value: item.network_event.timestamp },
                  { name: 'Source IP', value: item.network_event.src_ip + ':' + item.network_event.src_port },
                  { name: 'Destination IP', value: item.network_event.dest_ip + ':' + item.network_event.dest_port },
                  { name: 'SectianType', value: item.network_event.dns.rrtype },
                  { name: 'Domain', value: item.network_event.dns.rrname },
                  { name: 'TTL', value: item.network_event.dns.HostAddr },
                  { name: 'Traffic', value: 'dns' },
                ]
                break
              case 'krb5':
                item.event_list = [
                  { name: 'Time', value: item.network_event.timestamp },
                  { name: 'Source IP', value: item.network_event.src_ip + ':' + item.network_event.src_port },
                  { name: 'Destination IP', value: item.network_event.dest_ip + ':' + item.network_event.dest_port },
                  { name: 'Msg_type', value: item.network_event.krb5.msg_type },
                  { name: 'Cname', value: item.network_event.krb5.cname },
                  { name: 'Realm', value: item.network_event.krb5.realm },
                  { name: 'Sname', value: item.network_event.krb5.sname },
                  { name: 'Traffic', value: 'krb5' },
                ]
                break
              case 'http':
                item.event_list = [
                  { name: 'Method', value: item.network_event.http.http_method },
                  { name: 'Source IP', value: item.network_event.src_ip + ':' + item.network_event.src_port },
                  { name: 'Destination IP', value: item.network_event.dest_ip + ':' + item.network_event.dest_port },
                  { name: 'URL', value: item.network_event.http.url },
                  { name: 'User Agent', value: item.network_event.http.http_user_agent },
                  { name: 'Referrer', value: item.network_event.http.http_refer },
                  { name: 'Traffic', value: 'http' },
                ]
                break
              case 'alert':
                switch (item.network_event.app_proto) {
                  case 'tls':
                    if (item.network_event.tls.subject) {
                      item.network_event.tls.Authorizing = item.network_event.tls.subject.substring(
                        item.network_event.tls.subject.indexOf("CN=") + 3
                      );
                    }
                    item.event_list = [
                      { name: 'Time', value: item.network_event.timestamp },
                      { name: 'Source IP', value: item.network_event.src_ip + ':' + item.network_event.src_port },
                      { name: 'Destination IP', value: item.network_event.dest_ip + ':' + item.network_event.dest_port },
                      { name: 'URL', value: item.network_event.tls.sni },
                      { name: 'Issuerdn', value: item.network_event.tls.issuerdn },
                      { name: 'Authorizing', value: item.network_event.tls.Authorizing },
                      { name: 'Notafter', value: item.network_event.tls.notafter },
                      { name: 'Traffic', value: 'https' },
                    ]
                    break;
                  case 'http':
                    item.event_list = [
                      { name: 'Method', value: item.network_event.http.http_method },
                      { name: 'Source IP', value: item.network_event.src_ip + ':' + item.network_event.src_port },
                      { name: 'Destination IP', value: item.network_event.dest_ip + ':' + item.network_event.dest_port },
                      { name: 'URL', value: item.network_event.http.url },
                      { name: 'User Agent', value: item.network_event.http.http_user_agent },
                      { name: 'Referrer', value: item.network_event.http.http_refer },
                      { name: 'Traffic', value: 'http' },
                    ]
                    break;
                  default:
                    if (!item.network_event.app_proto) {
                      item.network_event.app_proto = item.network_event.proto
                    } else if (item.network_event.app_proto == 'failed') {
                      item.network_event.app_proto = ''
                    }
                    item.event_list = [
                      { name: 'Time', value: item.network_event.timestamp },
                      { name: 'Source IP', value: item.network_event.src_ip + ':' + item.network_event.src_port },
                      { name: 'Destination IP', value: item.network_event.dest_ip + ':' + item.network_event.dest_port },
                      { name: 'Traffic', value: item.network_event.app_proto },
                    ]
                    break;
                }
              default:
                if (!item.network_event.app_proto) {
                  item.network_event.app_proto = item.network_event.proto
                } else if (item.network_event.app_proto == 'failed') {
                  item.network_event.app_proto = ''
                }
                item.event_list = [
                  { name: 'Time', value: item.network_event.timestamp },
                  { name: 'Source IP', value: item.network_event.src_ip + ':' + item.network_event.src_port },
                  { name: 'Destination IP', value: item.network_event.dest_ip + ':' + item.network_event.dest_port },
                  { name: 'Traffic', value: item.network_event.app_proto },
                ]
                break;
                break;
            }
          });
          // 攻击阶段
          this.attack_stage_list.forEach(element => {
            element.count = 0;
            if (this.network_detail.attack_stage == element.name) {
              this.network_detail.attack_stage_cn = element.value
            }
          });
          this.network_times.forEach(item => {
            this.attack_stage_list.forEach(element => {
              if (item.attack_stage == element.name) {
                item.attack_stage_cn = element.value
                element.count = element.count + 1;
              }
            });
          });

          this.new_list();
          this.old_list();
          // this.network_times.push(item_obj)
        })
        .catch(error => {
          console.log(error);
        })
    },
    // 跳转到工单详情
    Goto_workorder () {
      switch (this.$route.query.type) {
        case 'alert':
          this.$router.push({ path: "/detail/works", query: { id: this.network_work_order.workorder_id, type: 'alert_detail' } });
          break;
        case 'asset':
          this.$router.push({ path: "/detail/works", query: { id: this.network_work_order.workorder_id, type: 'asset' } });
          break;
        case 'lateral':
          this.$router.push({ path: "/detail/works", query: { id: this.network_work_order.workorder_id, type: 'lateral' } });
          break;
        case 'outside':
          this.$router.push({ path: "/detail/works", query: { id: this.network_work_order.workorder_id, type: 'outside' } });
          break;
        case 'outreath':
          this.$router.push({ path: "/detail/works", query: { id: this.network_work_order.workorder_id, type: 'outreath' } });
          break;
        default:
          break;
      }

    },
    // 下载payload
    download (value, item) {
      if (value.value == "download" && value.name == "Payload") {
        var funDownload = function (content, filename) {
          // 创建隐藏的可下载链接
          var eleLink = document.createElement("a");
          eleLink.download = filename;
          eleLink.style.display = "none";
          // 字符内容转变成blob地址
          var blob = new Blob([content]);
          eleLink.href = URL.createObjectURL(blob);
          // 触发点击
          document.body.appendChild(eleLink);
          eleLink.click();
          // 然后移除
          document.body.removeChild(eleLink);
        };
        funDownload(item.network_event.payload, "payload.dat");
      }
      if (value.value == "download" && value.name == 'download') {
        var window_open = ''
        // horizontalthreat  横向威胁告警  lateral
        // externalthreat  外部威胁告警  outside
        // outreachthreat  外联威胁告警  outreath
        switch (this.$route.query.type) {
          case 'alert':
            window_open = '/yiiapi/alert/get-file?md5='
            break;
          case 'asset':
            window_open = '/yiiapi/asset/get-file?md5='
            break;
          case 'lateral':
            window_open = '/yiiapi/horizontalthreat/get-file?md5='
            break;
          case 'outside':
            window_open = '/yiiapi/externalthreat/get-file?md5='
            break;
          case 'outreath':
            window_open = '/yiiapi/outreachthreat/get-file?md5='
            break;
          default:
            break;
        }
        window.open(window_open + value.md5);
      }
    },
    // Current Risk Assets
    new_list () {
      var new_list = ''
      // horizontalthreat  横向威胁告警  lateral
      // externalthreat  外部威胁告警  outside
      // outreachthreat  外联威胁告警  outreath
      switch (this.$route.query.type) {
        case 'alert':
          new_list = '/yiiapi/alert/get-same-indicator-alert'
          break;
        case 'asset':
          new_list = '/yiiapi/asset/get-same-indicator-alert'
          break;
        case 'lateral':
          new_list = '/yiiapi/horizontalthreat/get-same-indicator-alert'
          break;
        case 'outside':
          new_list = '/yiiapi/externalthreat/get-same-indicator-alert'
          break;
        case 'outreath':
          new_list = '/yiiapi/outreachthreat/get-same-indicator-alert'
          break;
        default:
          break;
      }

      this.$axios.get(new_list, {
        params: {
          indicator: this.network_detail.indicator,
          is_deal: 0,
          page: this.emerge_list.now_data.page,
          rows: this.emerge_list.now_data.rows,
        }
      })
        .then(response => {
          let { status, data } = response.data;
          this.emerge_list.now = data
        })
        .catch(error => {
          console.log(error);
        })
    },
    handleSizeChange_now (val) {
      this.emerge_list.now_data.rows = val;
      this.emerge_list.now_data.page = 1;
      this.new_list();
    },
    handleCurrentChange_now (val) {
      this.emerge_list.now_data.page = val;
      this.new_list();
    },
    // Historical Risk Assets
    old_list () {
      var new_list = ''
      // horizontalthreat  横向威胁告警  lateral
      // externalthreat  外部威胁告警  outside
      // outreachthreat  外联威胁告警  outreath
      switch (this.$route.query.type) {
        case 'alert':
          new_list = '/yiiapi/alert/get-same-indicator-alert'
          break;
        case 'asset':
          new_list = '/yiiapi/asset/get-same-indicator-alert'
          break;
        case 'lateral':
          new_list = '/yiiapi/horizontalthreat/get-same-indicator-alert'
          break;
        case 'outside':
          new_list = '/yiiapi/externalthreat/get-same-indicator-alert'
          break;
        case 'outreath':
          new_list = '/yiiapi/outreachthreat/get-same-indicator-alert'
          break;
        default:
          break;
      }
      this.$axios.get(new_list, {
        params: {
          indicator: this.network_detail.indicator,
          is_deal: 2,
          page: this.emerge_list.old_data.page,
          rows: this.emerge_list.old_data.rows
        }
      })
        .then(response => {
          let { status, data } = response.data;
          this.emerge_list.old = data
        })
        .catch(error => {
          console.log(error);
        })
    },
    handleSizeChange_old (val) {
      this.emerge_list.old_data.rows = val;
      this.emerge_list.old_data.page = 1;
      this.old_list();
    },
    handleCurrentChange_old (val) {
      this.emerge_list.old_data.page = val;
      this.old_list();
    },

    // 状态变更
    change_state (item) {
      console.log(item);
      var id_list = []
      id_list.push(this.$route.query.detail)

      var alarm = ''
      // horizontalthreat  横向威胁告警  lateral
      // externalthreat  外部威胁告警  outside
      // outreachthreat  外联威胁告警  outreath
      switch (this.$route.query.type) {
        case 'alert':
          alarm = '/yiiapi/alert/do-alarm'
          break;
        case 'asset':
          alarm = '/yiiapi/asset/do-alarm'
          break;
        case 'lateral':
          alarm = '/yiiapi/horizontalthreat/do-alarm'
          break;
        case 'outside':
          alarm = '/yiiapi/externalthreat/do-alarm'
          break;
        case 'outreath':
          alarm = '/yiiapi/outreachthreat/do-alarm'
          break;
        default:
          break;
      }
      this.$axios.put(alarm, {
        id: id_list,
        status: item
      })
        .then(response => {
          let { status, data } = response.data;
          console.log(data);
          console.log(response);
          if (status == 0) {
            this.get_data();
            this.$message(
              {
                message: 'Change status successfully',
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
    // 编辑标签
    edit_tag_box () {
      this.edit_tag.tag_list = [];
      console.log(this.network_detail.label_obj);
      if (this.network_detail.label_obj.length == 0) {
        this.edit_tag.tag_list.push({ name: '', icon: true })
      } else {
        this.network_detail.label_obj.forEach(element => {
          var obj = {
            name: element,
            icon: false
          }
          this.edit_tag.tag_list.push(obj)
        });
        this.edit_tag.tag_list[this.edit_tag.tag_list.length - 1].icon = true
      }
      this.edit_tag.pop = true
    },
    edit_tag_true () {
      console.log(this.edit_tag.tag_list);
      // /alert/label-edit
      var label_list = [];
      this.edit_tag.tag_list.forEach(element => {
        if (element.name != '') {
          label_list.push(element.name)
        }
      });
      var label = ''
      // horizontalthreat  横向威胁告警  lateral
      // externalthreat  外部威胁告警  outside
      // outreachthreat  外联威胁告警  outreath
      switch (this.$route.query.type) {
        case 'alert':
          label = '/yiiapi/alert/label-edit'
          break;
        case 'asset':
          label = '/yiiapi/asset/label-edit'
          break;
        case 'lateral':
          label = '/yiiapi/horizontalthreat/label-edit'
          break;
        case 'outside':
          label = '/yiiapi/externalthreat/label-edit'
          break;
        case 'outreath':
          label = '/yiiapi/outreachthreat/label-edit'
          break;
        default:
          break;
      }
      this.$axios.put(label, {
        id: this.$route.query.detail,
        label: label_list
      })
        .then(response => {
          let { status, data } = response.data;
          console.log(data);
          if (status == 0) {
            this.$message(
              {
                message: 'Change label successfully',
                type: 'success',
              }
            );
            this.edit_tag.pop = false;
            this.get_data()
          } else {
            this.$message(
              {
                message: data.msg,
                type: 'error',
              }
            );
          }
        })
        .catch(error => {
          console.log(error);
        })



    },
    closed_edit_tag_box () {
      this.edit_tag.pop = false
    },
    //  添加标签
    add_tag () {
      if (this.edit_tag.tag_list.length < 5) {
        this.edit_tag.tag_list.forEach(item => {
          item.icon = false;
        });
        this.edit_tag.tag_list.push({ name: '', icon: true })
      } else {
        this.$message.warning(
          {
            message: 'Up to 5 labels can be set',
            offset: 50
          })
      }
    },
    del_tag (item, index) {
      this.edit_tag.tag_list.splice(index, 1);
    },

    // 加入外部链接
    change_state_src (item) {
      console.log(item);
      // 只能是1和2；动态类型，1Ip，2url
      // 选择“威胁追查“后就直接跳到威胁调查页面的IP/URL通讯调查页面，把该IP地址作为搜索条件得出搜索结果。
      if (item == '1') {
        // var label = ''
        // if (this.$route.query.type == 'alert') {
        //   label = '/yiiapi/alert/label-edit'
        // } else if (this.$route.query.type == 'risks') {
        //   label = '/yiiapi/outreachthreat/label-edit'
        // }
        this.$router.push({ path: "/invest/url", query: { src_ip: this.network_detail.src_ip, dest_ip: '' } });

      }
      //加入外部链接
      if (item == '2') {
        this.$confirm('This address will be added to an external dynamic list and can be alerted or blocked by third-party devices after reading it.', 'Message', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          var join = ''
          // horizontalthreat  横向威胁告警  lateral
          // externalthreat  外部威胁告警  outside
          // outreachthreat  外联威胁告警  outreath
          switch (this.$route.query.type) {
            case 'alert':
              join = '/yiiapi/alert/join-external-dynamics'
              break;
            case 'asset':
              join = '/yiiapi/asset/join-external-dynamics'
              break;
            case 'lateral':
              join = '/yiiapi/horizontalthreat/join-external-dynamics'
              break;
            case 'outside':
              join = '/yiiapi/externalthreat/join-external-dynamics'
              break;
            case 'outreath':
              join = '/yiiapi/outreachthreat/join-external-dynamics'
              break;
            default:
              break;
          }
          this.$axios.post(join, {
            addr: this.network_detail.src_ip,
            type: 1
          })
            .then(response => {
              let { status, data } = response.data;
              console.log(data);
              if (status == 0) {
                this.$message(
                  {
                    message: 'Added to the external dynamic list successfully',
                    type: 'success',
                  }
                );
              } else {
                this.$message(
                  {
                    message: data.msg,
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
            message: 'Operation cancelled'
          });
        });
      }
    },

    // 加入外部链接
    change_state_dest (item) {
      console.log(item);
      if (item == '1') {
        this.$router.push({ path: "/invest/url", query: { dest_ip: this.network_detail.dest_ip, src_ip: '' } });
      }
      //加入外部链接
      if (item == '2') {
        this.$confirm('This address will be added to an external dynamic list and can be alerted or blocked by third-party devices after reading it.', 'Message', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          var join = ''

          // horizontalthreat  横向威胁告警  lateral
          // externalthreat  外部威胁告警  outside
          // outreachthreat  外联威胁告警  outreath
          switch (this.$route.query.type) {
            case 'alert':
              join = '/yiiapi/alert/join-external-dynamics'
              break;
            case 'asset':
              join = '/yiiapi/asset/join-external-dynamics'
              break;
            case 'lateral':
              join = '/yiiapi/horizontalthreat/join-external-dynamics'
              break;
            case 'outside':
              join = '/yiiapi/externalthreat/join-external-dynamics'
              break;
            case 'outreath':
              join = '/yiiapi/outreachthreat/join-external-dynamics'
              break;
            default:
              break;
          }
          this.$axios.post(join, {
            addr: this.network_detail.dest_ip,
            type: 1
          })
            .then(response => {
              let { status, data } = response.data;
              console.log(data);
              if (status == 0) {
                this.$message(
                  {
                    message: 'Added to the external dynamic list successfully',
                    type: 'success',
                  }
                );
              } else {
                this.$message(
                  {
                    message: data.msg,
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
            message: 'Operation cancelled'
          });
        });
      }
    },
    time_active (index) {
      console.log("111");
      this.time_choose = index;
    },
    emerge_list_active (index) {
      this.emerge_list.choose = index;
    },
    src_active () {
      console.log("111");
      this.src_active_ul = !this.src_active_ul;
    },
    src_active_item (num) {
      this.src_active_ul = false;
      console.log(num);
    },
    handleSelectionChange () { },
    handleClick (tab, event) {
      console.log(tab);
    },
    //工单任务选择
    change_task (command) {
      if (command == "1") {
        this.new_worksheets_list.name = ''
        this.new_worksheets_list.level = ''
        this.new_worksheets_list.operator = ''
        this.new_worksheets_list.new_operator = ''
        this.new_worksheets_list.notice = ['email']
        this.new_worksheets_list.textarea = ''
        this.new_worksheets_list.multiple = []
        this.new_worksheets_list.select_list = []
        this.new_worksheets_data.operator_list = []
        this.new_worksheets_data.operator_list = []
        this.new_worksheets_data.table_operator.tableData = []
        this.new_worksheets_data.table_operator.tableData = []
        this.new_worksheets_data.table_operator.count = 0
        this.new_worksheets_data.table_operator.pageNow = 1
        this.new_worksheets_data.table_operator.maxPage = 1
        this.new_worksheets_data.table_operator.eachPage = 5
        this.new_worksheets_data.network_detail = []
        // 存在被创建工单的告警
        console.log(this.network_detail.status);
        if (this.network_detail.status == '3' || this.network_detail.status == '4' || this.network_detail.status == '5') {
          this.$message({ message: 'Alert whose status is resolved, ignored, false positive cannot create new tickets', type: 'warning' });
          return false
        }
        this.get_user_list();
      } else if (command == "2") {

        this.open_add_new();
      }
    },
    // 添加到工单
    //获取工单列表
    get_worksheets_list () {
      var workorder_list = ''
      var workorder_type = ''
      // horizontalthreat  横向威胁告警  lateral
      // externalthreat  外部威胁告警  outside
      // outreachthreat  外联威胁告警  outreath
      switch (this.$route.query.type) {
        case 'alert':
          workorder_list = '/yiiapi/alert/workorder-list'
          workorder_type = 'alert'
          break;
        case 'asset':
          workorder_list = '/yiiapi/asset/workorder-list'
          workorder_type = 'asset'
          break;
        case 'lateral':
          workorder_list = '/yiiapi/horizontalthreat/workorder-list'
          workorder_type = 'alert'
          break;
        case 'outside':
          workorder_list = '/yiiapi/externalthreat/workorder-list'
          workorder_type = 'alert'
          break;
        case 'outreath':
          workorder_list = '/yiiapi/outreachthreat/workorder-list'
          workorder_type = 'alert'
          break;
        default:
          break;
      }
      this.$axios.get(workorder_list, {
        params: {
          page: this.worksheets_data.page,
          rows: this.worksheets_data.rows,
          type: workorder_type
        }
      }).then((resp) => {
        let { status, data } = resp.data;
        console.log(data);
        console.log(status);
        if (status == 0) {
          console.log(data);
          this.worksheets_list = data
          this.worksheets_list.pageNow = data.pageNow * 1
          this.worksheets_data.pop = true;
          this.worksheets_list.data.forEach(element => {
            element.perator_cn = JSON.parse(element.perator).join(',')
            this.worksheets_data.level_list.forEach(item => {
              if (element.priority == item.value) {
                element.priority_cn = item.label
              }
            });
            this.worksheets_data.status_type.forEach((ele, index) => {
              if (element.status == index) {
                element.status_cn = this.worksheets_data.status_type[index]
              }
            });
          });
        }
      })
    },
    handleSizeChange_add (val) {
      this.worksheets_data.rows = val;
      this.worksheets_data.page = 1;
      this.worksheets_data.tableRadio = {}
      this.get_worksheets_list();
    },
    handleCurrentChange_add (val) {
      this.worksheets_data.page = val;
      this.worksheets_data.tableRadio = {}
      this.get_worksheets_list();
    },

    // -新加到工单取消状态
    add_closed_state () {
      this.worksheets_data.pop = false;
    },


    //新加到工单确定
    add_ok_worksheets () {
      console.log(this.worksheets_data.tableRadio);
      if (Object.keys(this.worksheets_data.tableRadio).length == 0) {
        this.$message(
          {
            message: 'Please select the ticket',
            type: 'warning',
          }
        );
        return false
      }
      // this.worksheets_data.tableRadio
      var te_alert = []
      JSON.parse(this.worksheets_data.tableRadio.te_alert).forEach(element => {
        if (element != '') {
          te_alert.push(element * 1)
        }
      });
      te_alert.push(this.$route.query.detail * 1)
      console.log(te_alert);
      var add_workorder = ''
      // horizontalthreat  横向威胁告警  lateral
      // externalthreat  外部威胁告警  outside
      // outreachthreat  外联威胁告警  outreath
      switch (this.$route.query.type) {
        case 'alert':
          add_workorder = '/yiiapi/alert/add-workorder'
          break;
        case 'asset':
          add_workorder = '/yiiapi/asset/add-workorder'
          break;
        case 'lateral':
          add_workorder = '/yiiapi/horizontalthreat/add-workorder'
          break;
        case 'outside':
          add_workorder = '/yiiapi/externalthreat/add-workorder'
          break;
        case 'outreath':
          add_workorder = '/yiiapi/outreachthreat/add-workorder'
          break;
        default:
          break;
      }
      this.$axios.post(add_workorder,
        {
          id: this.worksheets_data.tableRadio.id,
          type: "alert",
          name: this.worksheets_data.tableRadio.name,
          perator: JSON.parse(this.worksheets_data.tableRadio.perator),
          priority: this.worksheets_data.tableRadio.priority,
          remind: JSON.parse(this.worksheets_data.tableRadio.remind),
          remarks: this.worksheets_data.tableRadio.remarks,
          te_alert: te_alert,
        })
        .then((resp) => {
          let { status, msg, data } = resp.data;
          console.log(data);
          if (status == 0) {
            this.$message.success('Added successfully');
            this.get_data()
          } else if (status == 1) {
            this.$message.error(msg);
          }
          this.add_closed_state();
        })
        .catch(err => {
          console.log(err);
        });
    },
    ///-------------------------新建工单

    closed_task_new () {
      this.new_worksheets_data.pop = false
    },
    //获取用户列表(经办人使用)
    get_user_list () {
      this.$axios.get('/yiiapi/site/user-list')
        .then(resp => {
          let { status, data } = resp.data;
          if (status == 0) {
            this.new_worksheets_data.operator_list = data;
          } else {
            this.new_worksheets_data.operator_list = [];
          }
          this.new_worksheets_data.pop = true
          this.new_worksheets_data.new_contet = true;
        })
        .catch(err => {
          console.log(err);
        })
    },

    //经办人change处理
    select_changced (item) {
      console.log(item);
      // this.new_worksheets_data.table_operator.tableData.push(item)
      let level_list = this.new_worksheets_data.table_operator.tableData;
      let selected_id_attr = level_list.map(x => { return x.id });
      if (selected_id_attr.includes(item.id)) {
        this.$message.error('Exited');
      } else {
        this.new_worksheets_data.table_operator.tableData.unshift(item);
      }
      let pageNow = this.new_worksheets_data.table_operator.pageNow;
      let handle_data_operator = this.new_worksheets_data.table_operator.tableData.slice((pageNow - 1) * 5, pageNow * 5);
      this.new_worksheets_data.table_operator.tableData_new = handle_data_operator;
      let selected_name_attr = this.new_worksheets_data.table_operator.tableData.map(x => { return x.username });
      console.log(selected_name_attr);
      console.log(this.new_worksheets_data.table_operator.tableData);
      // this.task_params.new_operator = selected_name_attr;
    },
    //经办人页数点击
    hcc_table_operator (val) {
      this.new_worksheets_data.table_operator.pageNow = val;
    },
    //下一步时候验证工单名称，优先级、经办人等参数
    next_task () {
      if (this.new_worksheets_list.name == '') {
        this.$message.error('Ticket name is required');
        return false
      }
      if (this.new_worksheets_list.level == '') {
        this.$message.error('Please select the priority');
        return false
      }

      if (this.new_worksheets_list.operator == '') {
        this.$message.error('Please select the assignee');
        return false
      }
      this.new_worksheets_data.new_contet = false;
      // this.handle.active = 0;
      this.new_worksheets_data.network_detail.push(this.network_detail)
      console.log(this.network_detail);
    },
    // 上一步
    prev_task_handle () {
      this.new_worksheets_data.network_detail = [];
      this.new_worksheets_data.new_contet = true;
    },
    // 添加工单 选择告警列表
    select_alert_new (val) {
      this.new_worksheets_list.select_list = val
      console.log(val);
    },
    // 分配
    prev_task_handle_assign () {
      var te_alert = []
      var perator_list = []
      te_alert.push(this.network_detail.id * 1)
      this.new_worksheets_data.table_operator.tableData.forEach(element => {
        perator_list.push(element.username)
      });
      console.log(te_alert);
      console.log(perator_list);
      console.log(this.new_worksheets_list);
      var distribution_workorder = ''
      // horizontalthreat  横向威胁告警  lateral
      // externalthreat  外部威胁告警  outside
      // outreachthreat  外联威胁告警  outreath
      switch (this.$route.query.type) {
        case 'alert':
          distribution_workorder = '/yiiapi/alert/distribution-workorder'
          break;
        case 'asset':
          distribution_workorder = '/yiiapi/asset/distribution-workorder'
          break;
        case 'lateral':
          distribution_workorder = '/yiiapi/horizontalthreat/distribution-workorder'
          break;
        case 'outside':
          distribution_workorder = '/yiiapi/externalthreat/distribution-workorder'
          break;
        case 'outreath':
          distribution_workorder = '/yiiapi/outreachthreat/distribution-workorder'
          break;
        default:
          break;
      }


      this.$axios.put(distribution_workorder,
        {
          name: this.new_worksheets_list.name,
          priority: this.new_worksheets_list.level,
          perator: perator_list,
          remarks: this.new_worksheets_list.textarea,
          te_alert: te_alert,
          remind: this.new_worksheets_list.notice
        })
        .then((resp) => {
          let { status, msg, data } = resp.data;
          console.log(data);
          if (status == 0) {
            this.get_data();
            this.new_worksheets_data.pop = false
            this.$message.success('Assigned successfully');
          } else if (status == 1) {
            this.$message.error(msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 保存
    prev_task_handle_save () {
      var te_alert = []
      var perator_list = []
      this.new_worksheets_data.table_operator.tableData.forEach(element => {
        perator_list.push(element.username)
      });
      te_alert.push(this.network_detail.id * 1)
      console.log(te_alert);
      console.log(this.new_worksheets_list);

      var add_workorder = ''
      // horizontalthreat  横向威胁告警  lateral
      // externalthreat  外部威胁告警  outside
      // outreachthreat  外联威胁告警  outreath
      switch (this.$route.query.type) {
        case 'alert':
          add_workorder = '/yiiapi/alert/add-workorder'
          break;
        case 'asset':
          add_workorder = '/yiiapi/asset/add-workorder'
          break;
        case 'lateral':
          add_workorder = '/yiiapi/horizontalthreat/add-workorder'
          break;
        case 'outside':
          add_workorder = '/yiiapi/externalthreat/add-workorder'
          break;
        case 'outreath':
          add_workorder = '/yiiapi/outreachthreat/add-workorder'
          break;
        default:
          break;
      }
      this.$axios.post(add_workorder,
        {
          type: "alert",
          name: this.new_worksheets_list.name,
          perator: perator_list,
          priority: this.new_worksheets_list.level,
          remind: this.new_worksheets_list.notice,
          remarks: this.new_worksheets_list.textarea,
          te_alert: te_alert,
        })
        .then((resp) => {
          let { status, msg, data } = resp.data;
          console.log(data);
          if (status == 0) {
            this.new_worksheets_data.pop = false
            this.$message.success('Added successfully');
            this.get_data()
          } else if (status == 1) {
            this.$message.error(msg);
          }
          this.add_closed_state();
        })
        .catch(err => {
          console.log(err);
        });



    },
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
};
</script>
<style lang="less">
@import '../../../../assets/css/less/reset_css/reset_tab.less';
@import '../../../../assets/css/less/reset_css/reset_pop.less';

@import '../../../../assets/css/less/common-dropdown.less';
.reset_table {
  .el-table__header-wrapper {
    .el-table__header {
      thead.has-gutter {
        th {
          background: #f8f8f8;
          .cell {
            font-family: PingFangMedium;
            color: #333;
            font-size: 14px;
          }
        }
      }
    }
  }
}
.el-input__inner {
  background: #f8f8f8;
  border: 0;
}
.dropdown_ul_box_detail {
  // width: 124px;
  // top: 209px !important;
  .el-dropdown-menu__item:hover {
    color: #606266;
  }
}
// tab栏
.emerge_table {
  th {
    .cell {
      font-family: PingFangMedium;
      font-size: 14px;
      color: #333333;
    }
  }
  td {
    .cell {
      font-family: PingFang;
      font-size: 14px;
      color: #666;
    }
  }
}
.detail-network {
  .pagination_box {
    margin: 24px 0;
    text-align: center;
  }

  // 弹窗编辑标签
  .add_tag {
    .el-dialog {
      width: 440px;
      .el-dialog__body {
        width: 440px;
        .content {
          padding: 24px 5px;
          height: 120px;
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
          .content_item {
            margin-bottom: 24px;
            .item_addrs {
              margin-bottom: 12px;
              display: flex;
            }
            .img_box {
              width: 16px;
              height: 16px;
              margin-left: 10px;
              margin-top: 14px;
              cursor: pointer;
            }
            .title {
              font-size: 12px;
              color: #999999;
            }
            .title_color {
              color: #ff5f5c;
            }
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
        }
      }
    }
  }
  //添加到工单
  .pop_state_add {
    .el-dialog {
      width: 960px;
      .el-dialog__body {
        width: 960px;
        .content {
          padding-top: 24px;
          // 修改radio 改成对号
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

          .el-radio__input.is-checked .el-radio__inner::after {
            transform: rotate(45deg) scaleY(1);
          }
          .el-radio__inner::after {
            -webkit-box-sizing: content-box;
            box-sizing: content-box;
            background-color: transparent;
            content: '';
            border: 1px solid #fff;
            border-left: 0;
            border-top: 0;
            height: 0.4375rem;
            left: 0.25rem;
            position: absolute;
            top: 1px;
            -webkit-transform: rotate(45deg) scaleY(0);
            transform: rotate(45deg) scaleY(0);
            width: 0.1875rem;
            -webkit-transition: -webkit-transform 0.15s ease-in 0.05s;
            transition: -webkit-transform 0.15s ease-in 0.05s;
            transition: transform 0.15s ease-in 0.05s;
            transition: transform 0.15s ease-in 0.05s,
              -webkit-transform 0.15s ease-in 0.05s;
            transition: transform 0.15s ease-in 0.05s,
              -webkit-transform 0.15s ease-in 0.05s;
            -webkit-transform-origin: center;
            transform-origin: center;
          }
          .el-radio__inner {
            border-radius: 2px;
          }
        }
      }
    }
  }
  //  新建工单
  .task_new_box {
    .el-dialog {
      width: 960px;
      .el-dialog__body {
        width: 960px;
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
            font-family: PingFangMedium;
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
}
</style>
<style scoped lang="less">
.detail-network {
  background: #f8f8f8;

  .red_color {
    color: #ff5f5c !important;
  }
  //   基础信息
  .detail_base {
    // height: 323px;
    background: #fff;
    .detail_base_top {
      padding: 0 56px;
      height: 62px;
      border-bottom: 1px solid #ececec;
      .top_left {
        float: left;
        line-height: 62px;
        img {
          vertical-align: middle;
        }
      }
      .top_right {
        float: right;
        /*margin-top: 14px;*/
        // line-height: 62px;
        .change_btn {
          height: 34px;
          width: 124px;
          padding: 0;
          background: #0070ff;
        }
        .edit_btn {
          height: 34px;
          width: 124px;
          padding: 0;
          background: #fff;
          border: 1px solid #0070ff;
          color: #0070ff;
        }
      }
    }
    .detail_base_bottom {
      // height: 260px;
      padding: 24px 56px;
      display: flex;
      .detail_base_bottom_item {
        text-align: left;
        flex: 1;
        .change_src_btn {
          background: none;
          border: none;
          padding: 0;
        }
        .item_li {
          display: flex;
          height: 22px;
          margin-bottom: 16px;
          position: relative;
          .src_ul {
            width: 180px;
            padding: 10px 0;
            background: #fff;
            box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.24);
            position: absolute;
            left: 96px;
            top: 22px;
            z-index: 99;
            li {
              height: 32px;
              line-height: 32px;
              padding: 0 12px;
              cursor: pointer;
            }
            li:hover {
              background: #eef6ff;
            }
          }
          .item_li_title {
            width: 180px;
            font-size: 16px;
            color: #333333;
            font-family: PingFangMedium;
          }
          .item_li_content {
            flex: 1;
            font-size: 16px;
            color: #666;
            .tag_btn_box {
              margin: 0 2px;
              display: inline-block;
              height: 20px;
              padding: 0 3px;
              border-radius: 2px;
              color: #ffffff;
              background: #5389e0;
              text-align: center;
            }
            .tag_btn {
              height: 20px;
              font-size: 10px;
              line-height: 20px;
              font-family: PingFang;
              transform: scale(0.8);
              display: block;
            }
          }
          .Goto_workorder {
            color: #0070ff;
            cursor: pointer;
          }
          .btn_fall {
            display: inline-block;
            width: 76px;
            height: 30px;
            background: #ff5f5c;
            color: #fff;
          }
          .src_active {
            font-family: PingFang;
            font-size: 16px;
            color: #0070ff;
            cursor: pointer;
          }
        }
      }
    }
  }
  //   检测时间轴
  .detail_time_box {
    // min-height: 716px;
    padding: 24px 56px 36px 56px;
    .time_title {
      height: 22px;
      font-family: PingFangMedium;
      font-size: 16px;
      color: #333333;
      margin-bottom: 12px;
      text-align: left;
    }
    .time_content {
      display: flex;
      .time_left {
        width: 180px;
        float: left;
        background: #fff;
        margin: 0;
        ul.time_left_list {
          width: 180px;
          // height: 610px;
          background: #fff;
          overflow-y: auto;
          overflow-x: hidden;
          z-index: 0;
          &.time_left_list::-webkit-scrollbar {
            /*滚动条整体样式*/
            width: 3px; /*高宽分别对应横竖滚动条的尺寸*/
            height: 1px;
            z-index: 0;
          }
          &.time_left_list::-webkit-scrollbar-thumb {
            /*滚动条里面小方块*/
            border-radius: 10px;
            background: #fff;
          }
          &.time_left_list::-webkit-scrollbar-track {
            /*滚动条里面轨道*/
            border-radius: 10px;
            background: #ededed;
          }
        }
        .time_item {
          z-index: 999;
          height: 60px;
          width: 95%;
          display: flex;
          position: relative;
          cursor: pointer;
          .time_item_left {
            width: 52px;
            padding: 20px 0;
          }
          .time_item_right {
            flex: 1;
            padding: 10px 0;
            text-align: left;
          }
        }
        .time_item.active {
          background: #0070ff;
          color: #fff;
        }
        .time_item.active:after {
          content: '';
          display: block;
          width: 0px;
          height: 0px;
          border-top: 8px solid transparent;
          border-bottom: 8px solid transparent;
          border-left: 8px solid #0070ff;
          position: absolute;
          top: 20px;
          right: -8px;
          z-index: 999;
        }
      }
      .time_right {
        flex: 1;
        // overflow: hidden;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: flex-start;
        margin-left: 18px;
        // height: 610px;
        background: #fff;
        .title {
          height: 42px;
          font-family: PingFangMedium;
          font-size: 16px;
          color: #333333;
          border-bottom: 1px solid #ececec;
          line-height: 42px;
          text-align: left;
          padding: 0 24px;
        }
        .time_right_info {
          padding-left: 24px;
          .download_text {
            color: #0070ff !important;
            cursor: pointer;
            text-decoration: underline;
          }
          .time_right_info_top {
            overflow-y: auto;
            border-bottom: 1px solid #ececec;
            padding-top: 16px;
            .info_top_item {
              // height: 22px;
              margin-bottom: 16px;
              width: 50%;
              float: left;
              text-align: left;
              display: flex;
              .info_top_item_title {
                width: 150px;
                font-family: PingFang;
                font-size: 16px;
                color: #333333;
              }
              .info_top_item_content {
                flex: 1;
                font-family: PingFang;
                font-size: 16px;
                color: #666666;
              }
            }
          }
          .time_right_info_bom {
            padding: 16px 0;
            text-align: left;
            display: flex;
            .info_bom_title {
              width: 150px;
              font-family: PingFang;
              font-size: 16px;
              color: #333333;
            }
            .info_bom_item {
              flex: 1;
              display: flex;
              flex-direction: column;
              .info_bom_item_li {
                margin-bottom: 12px;
                flex: 1;
                display: flex;
                flex-wrap: wrap;
                justify-content: flex-start;
                align-items: flex-start;
                .left_li {
                  width: 200px;
                  font-size: 16px;
                  color: #666;
                }
                .right_li {
                  font-size: 16px;
                  color: #666;
                  flex: 1;
                  flex-wrap: wrap;
                  justify-content: flex-start;
                  align-items: flex-start;
                }
              }
            }
          }
        }
        .time_right_net {
          margin: 16px 24px;
          border-bottom: 1px solid #ececec;
          display: flex;
          .time_right_net_item {
            flex: 1;
            width: 0;
            // display: flex;
            // flex-direction: column;
            // flex-wrap: wrap;
            // justify-content: flex-start;
            .title_net {
              height: 42px;
              text-align: left;
              background: #f8f8f8;
              font-family: PingFangMedium;
              font-size: 14px;
              color: #333333;
              line-height: 42px;
              padding: 0 10px;
            }
            .value_net {
              min-height: 42px;
              word-wrap: break-word;
              word-break: break-all;
              overflow: hidden;
              font-size: 14px;
              color: #666;
              text-align: left;
              padding: 10px;
            }
          }
        }
      }
    }
  }
  // 攻击阶段
  .attack_stage_box {
    text-align: left;
    // height: 171px;
    background: #fff;
    margin-bottom: 24px;
    .detail_base_top {
      padding: 0 56px;
      height: 62px;
      border-bottom: 1px solid #ececec;
      .attack_stage_title {
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
    .attack_stage_bom {
      height: 108px;
      padding: 30px 56px;
      display: flex;
      justify-content: space-between;
      .stage_item_box {
        width: 104px;
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

  //   告警列表
  .emerge_box {
    padding: 24px 56px;
    background: #fff;
    .pagination_box {
      margin-top: 24px;
    }
    .emerge_table {
      .el-table th.is-leaf {
        border-bottom: 1px solid #fff;
      }
      .el-table {
        th {
          .cell {
            font-family: PingFangMedium;
            font-size: 14px;
            color: #333333;
          }
        }
      }

      th > .cell {
        font-family: PingFangMedium;
        font-size: 14px;
        color: #333333;
      }
      .el-table__row {
        height: 42px;
      }
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
