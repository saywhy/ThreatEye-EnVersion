<template>
  <div id="system_control_monitor"
       class="container">
    <div class="content_box">
      <div class="monitor_title">
        <el-button type="primary"
                   class="btn_i"
                   @click="add_box">Add</el-button>
        <el-button type="primary"
                   class="btn_i"
                   @click="del_monitor">Delete</el-button>
        <el-button type="primary"
                   class="btn_o"
                   @click="import_box">Import</el-button>
        <el-button type="primary"
                   class="btn_o"
                   @click="download">Export</el-button>
      </div>
      <div class="monitor_table">
        <el-table ref="multipleTable"
                  class="reset_table"
                  align="center"
                  border
                  :data="monitor_data.data"
                  tooltip-effect="dark"
                  style="width: 100%"
                  @selection-change="handleSelectionChange"
                  @row-click="alert_detail">
          <el-table-column type="selection"
                           width="50">
          </el-table-column>
          <el-table-column label="Item"
                           width="50"
                           show-overflow-tooltip>
            <template slot-scope="scope">
              {{(monitor_page.page-1)*(monitor_page.rows) + scope.row.index_cn}}
            </template>
          </el-table-column>
          <el-table-column prop="name"
                           label="Name"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="Subnets"
                           show-overflow-tooltip>

            <template slot-scope="scope">
              <li v-for="item in scope.row.ip_segment"
                  class="btn_tag_box">
                <p>{{item}}</p>
              </li>
            </template>
          </el-table-column>
          <el-table-column prop="network_type"
                           label="Subnet type"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="Labels"
                           width="400">
            <template slot-scope="scope">
              <span class="btn_tag_box"
                    v-for="item in scope.row.label">
                <el-button type="primary"
                           class="btn_tag">
                  {{item}}
                </el-button>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="person"
                           label="Owner"
                           width="100"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="Updated Time"
                           width="180"
                           show-overflow-tooltip>
            <template slot-scope="scope">{{ scope.row.updated_at*1000 |formatDate }}</template>
          </el-table-column>
          <el-table-column label="Action">
            <template slot-scope="scope">
              <el-button type="primary"
                         class="btn_edit"
                         @click.stop='edit_box(scope.row)'>Edit</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination class="pagination_box"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="monitor_data.pageNow"
                       :page-sizes="[10,20,50,100]"
                       :page-size="10"
                       layout="total, sizes, prev, pager, next"
                       :total="monitor_data.count">
        </el-pagination>
      </div>
      <!-- 新增 -->
      <el-dialog class="add_box pop_box"
                 :close-on-click-modal="false"
                 :modal-append-to-body="false"
                 :visible.sync="monitor_state.add">
        <img src="@/assets/images/emerge/closed.png"
             @click="closed_add_box"
             class="closed_img"
             alt="">
        <div class="title">
          <div class="mask"></div>
          <span class="title_name">Add</span>
        </div>
        <div class="content">
          <div class="content_item_box">
            <div class="content_item">
              <p>
                <span class="title">Name</span>
                <span class="title_color">*</span>
              </p>
              <el-input class="select_box"
                        placeholder="Please enter a name"
                        v-model="monitor_add.name"
                        clearable>
              </el-input>
            </div>
            <div class="content_item">
              <p>
                <span class="title">Subnet Type</span>
                <span class="title_color">*</span>
              </p>
              <el-select class="select_box"
                         v-model="monitor_add.type"
                         placeholder="Please select the subnet type">
                <el-option v-for="item in monitor_add.type_list"
                           :key="item"
                           :label="item"
                           :value="item">
                </el-option>
              </el-select>
            </div>
            <div class="content_item">
              <p>
                <span class="title">Labels</span>
              </p>
              <div class="item_addrs"
                   v-for="(item,index) in monitor_add.tag_list">
                <el-input class="select_box"
                          placeholder="Please enter labels"
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
            <div class="content_item">
              <p>
                <span class="title">Note: 7 label attributes are reserved:"*** application", "Headquarters", "*** branch", "*** department", "Workstation", "Server", "Network equipment".</span>
              </p>
            </div>
          </div>
          <div class="content_item_space">
          </div>
          <div class="content_item_box">
            <div class="content_item">
              <p>
                <span class="title">Subnets</span>
                <span class="title_color">*</span>
              </p>
              <div class="item_addrs"
                   v-for="(item,index) in monitor_add.ip_segment_list">
                <el-input class="select_box"
                          placeholder="Please enter IP subnets (CIDR) or IP addresses"
                          v-model="item.name"
                          clearable>
                </el-input>
                <img src="@/assets/images/common/add.png"
                     alt=""
                     class="img_box"
                     v-if="item.icon"
                     @click="add_ip">
                <img src="@/assets/images/common/del.png"
                     alt=""
                     class="img_box"
                     @click="del_ip(item,index)"
                     v-if="!item.icon">
              </div>
            </div>
            <div class="content_item">
              <p>
                <span class="title">Owner</span>
              </p>
              <el-input class="select_box"
                        placeholder="Please enter the owner"
                        v-model="monitor_add.person"
                        clearable>
              </el-input>
            </div>
          </div>
        </div>
        <div class="btn_box">
          <el-button @click="closed_add_box"
                     class="cancel_btn">Cancel</el-button>
          <el-button class="ok_btn"
                     @click="add_data">Confirm</el-button>
        </div>
      </el-dialog>
      <!-- 编辑 -->
      <el-dialog class="add_box pop_box"
                 :close-on-click-modal="false"
                 :modal-append-to-body="false"
                 :visible.sync="monitor_state.edit">
        <img src="@/assets/images/emerge/closed.png"
             @click="closed_edit_box"
             class="closed_img"
             alt="">
        <div class="title">
          <div class="mask"></div>
          <span class="title_name">Edit</span>
        </div>
        <div class="content">
          <div class="content_item_box">
            <div class="content_item">
              <p>
                <span class="title">Name</span>
                <span class="title_color">*</span>
              </p>
              <el-input class="select_box"
                        placeholder="Please enter a name"
                        v-model="monitor_edit.name"
                        clearable>
              </el-input>
            </div>

            <div class="content_item">
              <p>
                <span class="title">Subnet Type</span>
                <span class="title_color">*</span>
              </p>
              <el-select class="select_box"
                         v-model="monitor_edit.network_type"
                         placeholder="Please select the subnet type">
                <el-option v-for="item in monitor_edit.type_list"
                           :key="item"
                           :label="item"
                           :value="item">
                </el-option>
              </el-select>
            </div>
            <div class="content_item">
              <p>
                <span class="title">Labels</span>
              </p>
              <div class="item_addrs"
                   v-for="(item,index) in monitor_edit.label_list">
                <el-input class="select_box"
                          placeholder="Please enter labels"
                          v-model="item.name"
                          clearable>
                </el-input>
                <img src="@/assets/images/common/add.png"
                     alt=""
                     class="img_box"
                     v-if="item.icon"
                     @click="add_tag_edit">
                <img src="@/assets/images/common/del.png"
                     alt=""
                     class="img_box"
                     @click="del_tag_edit(item,index)"
                     v-if="!item.icon">
              </div>
            </div>
            <div class="content_item">
              <p>
                <span class="title">Note: 7 label attributes are reserved:"*** application", "Headquarters", "*** branch", "*** department", "Workstation", "Server", "Network equipment".</span>
              </p>
            </div>
          </div>
          <div class="content_item_space">
          </div>
          <div class="content_item_box">
            <div class="content_item">
              <p>
                <span class="title">Subnets</span>
                <span class="title_color">*</span>
              </p>
              <div class="item_addrs"
                   v-for="(item,index) in monitor_edit.ip_segment_list">
                <el-input class="select_box"
                          placeholder="Please enter IP subnets (CIDR) or IP addresses"
                          v-model="item.name"
                          clearable>
                </el-input>
                <img src="@/assets/images/common/add.png"
                     alt=""
                     class="img_box"
                     v-if="item.icon"
                     @click="add_ip_edit">
                <img src="@/assets/images/common/del.png"
                     alt=""
                     class="img_box"
                     @click="del_ip_edit(item,index)"
                     v-if="!item.icon">
              </div>
            </div>
            <div class="content_item">
              <p>
                <span class="title">Owner</span>
              </p>
              <el-input class="select_box"
                        placeholder="Please enter the owner"
                        v-model="monitor_edit.person"
                        clearable>
              </el-input>
            </div>
          </div>
        </div>
        <div class="btn_box">
          <el-button @click="closed_edit_box"
                     class="cancel_btn">Cancel</el-button>
          <el-button class="ok_btn"
                     @click="edit_data">Confirm</el-button>
        </div>
      </el-dialog>
      <!-- 批量导入 -->
      <!-- <el-dialog class="import_box pop_box" :visible.sync="monitor_state.import" v-loading="monitor_state.import_"> -->
      <el-dialog class="import_box pop_box"
                 :close-on-click-modal="false"
                 :modal-append-to-body="false"
                 :visible.sync="monitor_state.import">
        <img src="@/assets/images/emerge/closed.png"
             @click="closed_import_box"
             class="closed_img"
             alt="">
        <div class="title">
          <div class="mask"></div>
          <span class="title_name">Import</span>
        </div>
        <div class="content">
          <el-upload class="upload-demo"
                     ref="uploadExcel"
                     :auto-upload="false"
                     :before-upload="beforeUploadFile"
                     :on-change="fileChange"
                     :on-success="handleSuccess"
                     :on-error="handleError"
                     :limit="1"
                     :on-exceed="onExceed"
                     :file-list="fileList"
                     accept=".xls"
                     drag
                     action="/yiiapi/ipsegment/upload-excel"
                     :multiple='false'>
            <img class="upload_img"
                 src="@/assets/images/setting/upload_s.png"
                 alt="">
            <!-- <img class="upload_img" src="@/assets/images/setting/upload_e.png" alt=""> -->
            <div class="el-upload__text">
              <em>Upload</em>
            </div>
          </el-upload>
          <div class="tip_box">
            <span>Note: Please choose .xls file, and file size should not exceed 10M. No template?</span>
            <span class="download"
                  @click="download_template">Download</span>
          </div>
        </div>
        <div class="btn_box">
          <el-button @click="closed_import_box"
                     class="cancel_btn">Cancel</el-button>
          <el-button class="ok_btn"
                     @click="uploadFile">Confirm</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import moment from 'moment'
import { eventBus } from '@/components/common/eventBus.js';
export default {
  name: "system_control_monitor",
  data () {
    return {
      monitor_data: {},
      monitor_page: {
        page: 1,
        rows: 10,
      },
      monitor_state: {
        add: false,
        edit: false,
        import: false,
        import_loading: false
      },
      monitor_add: {
        name: "",
        ip_segment: [],
        ip_segment_list: [{ name: '', icon: true }],
        type: "static",
        type_list: ["static", 'dhcp', 'public'],
        person: "",
        tag: [],
        tag_list: [{ name: '', icon: true }]
      },
      monitor_edit: {
        id: '',
        name: '',
        network_type: '',
        person: '',
        label_list: [],
        tag: [],
        type_list: ["static", 'dhcp', 'public'],
        ip_segment: [],
        ip_segment_list: [],
      },
      select_list: [],
      fileList: []
    };
  },
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
    isRepeat (arr) {
      var hash = {};
      for (var i in arr) {
        if (hash[arr[i]]) //hash 哈希
          return true;
        hash[arr[i]] = true;
      }
      return false;
    },
    // 获取列表
    get_data () {
      this.$axios.get('/yiiapi/ipsegment/list', {
        params: {
          page: this.monitor_page.page,
          rows: this.monitor_page.rows,
        }
      })
        .then(response => {
          console.log(response);
          this.monitor_data = response.data.data;
          this.monitor_data.data.forEach((item, index) => {
            item.index_cn = index + 1
          });
        })
        .catch(error => {
          console.log(error);
        })
    },
    // 添加IP
    add_box () {
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
          } else {
            this.monitor_state.add = true;
            this.monitor_add.name = '';
            this.monitor_add.type = 'static';
            this.monitor_add.person = '';
            this.monitor_add.tag = [];
            this.monitor_add.ip_segment = [];
            this.monitor_add.tag_list = [{ name: '', icon: true }]
            this.monitor_add.ip_segment_list = [{ name: '', icon: true }]
          }
        })
    },
    add_data () {
      this.monitor_add.tag = [];
      var isRepeat_ip_segment = []
      this.monitor_add.ip_segment = [];
      this.monitor_add.ip_segment = [];
      var isRepeat_tag = []
      var tag_test = []
      var tag_test_str = ''
      this.monitor_add.ip_segment_list.forEach(item => {
        if (item.name != '') {
          isRepeat_ip_segment.push(item.name)
        }
      });
      if (isRepeat_ip_segment.length == 0) {
        this.$message(
          {
            message: 'Please enter IP subnets (CIDR) or IP addresses',
            type: 'warning',
          }
        );
        return false
      }
      if (this.isRepeat(isRepeat_ip_segment)) {
        this.$message(
          {
            message: 'IP addresses or subnets have duplicates, please re-enter.',
            type: 'warning',
          }
        );
        return false
      }
      // 标签处理
      this.monitor_add.tag_list.forEach(item => {
        if (item.name != '') {
          tag_test.push(item.name)
        }
      });
      if (this.isRepeat(tag_test)) {
        this.$message(
          {
            message: 'The labels has duplicates. Please re-enter.',
            type: 'warning',
          }
        );
        return false
      }
      tag_test_str = JSON.stringify(tag_test)
      if (tag_test_str.indexOf("workstation") != -1 && (tag_test_str.indexOf("server") != -1 || tag_test_str.indexOf("network equipment") != -1)) {
        this.$message(
          {
            message: 'Only set one of the three types of tags:"workstation","server",or"network device".Please try again!',
            type: 'warning',
          }
        );
        return false
      }
      if (tag_test_str.indexOf("server") != -1 && (tag_test_str.indexOf("workstation") != -1 || tag_test_str.indexOf("network equipment") != -1)) {
        this.$message(
          {
            message: 'Only set one of the three types of tags:"workstation","server",or"network device".Please try again!',
            type: 'warning',
          }
        );
        return false
      }
      if (tag_test_str.indexOf("network equipment") != -1 && (tag_test_str.indexOf("server") != -1 || tag_test_str.indexOf("workstation") != -1)) {
        this.$message(
          {
            message: 'Only set one of the three types of tags:"workstation","server",or"network device".Please try again!',
            type: 'warning',
          }
        );
        return false
      }
      console.log(isRepeat_tag);
      console.log(isRepeat_ip_segment);
      this.monitor_add.tag_list.forEach(item => {
        if (item.name != '') {
          this.monitor_add.tag.push(item.name)
        }
      });
      this.monitor_add.ip_segment_list.forEach(item => {
        if (item.name != '') {
          this.monitor_add.ip_segment.push(item.name)
        }
      });
      this.$axios.post('/yiiapi/ipsegment/set-ip-segment', {
        name: this.monitor_add.name,
        ip_segment: this.monitor_add.ip_segment,
        network_type: this.monitor_add.type,
        person: this.monitor_add.person,
        label: this.monitor_add.tag,
      })
        .then(response => {
          console.log(response);
          if (response.data.status == 0) {
            this.monitor_state.add = false;
            this.get_data();
            this.$message(
              {
                message: 'Added successfully',
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
    //  添加标签
    add_tag () {
      this.monitor_add.tag_list.forEach(item => {
        item.icon = false;
      });
      this.monitor_add.tag_list.push({ name: '', icon: true })
    },
    del_tag (item, index) {
      this.monitor_add.tag_list.splice(index, 1);
    },
    //  添加ip地址段
    add_ip () {
      this.monitor_add.ip_segment_list.forEach(item => {
        item.icon = false;
      });
      this.monitor_add.ip_segment_list.push({ name: '', icon: true })
    },
    del_ip (item, index) {
      this.monitor_add.ip_segment_list.splice(index, 1);
    },
    // 编辑标签
    add_tag_edit () {
      this.monitor_edit.label_list.forEach(item => {
        item.icon = false;
      });
      this.monitor_edit.label_list.push({ name: '', icon: true })
    },
    del_tag_edit (item, index) {
      this.monitor_edit.label_list.splice(index, 1);
    },
    // 编辑ip
    add_ip_edit () {
      this.monitor_edit.ip_segment_list.forEach(item => {
        item.icon = false;
      });
      this.monitor_edit.ip_segment_list.push({ name: '', icon: true })
    },
    del_ip_edit (item, index) {
      this.monitor_edit.ip_segment_list.splice(index, 1);
    },
    alert_detail () { },
    edit_box (row) {
      this.monitor_state.edit = true;
      console.log(row);
      var item_str = JSON.stringify(row);
      var obj_edit = JSON.parse(item_str);
      this.monitor_edit.id = obj_edit.id
      this.monitor_edit.name = obj_edit.name
      this.monitor_edit.network_type = obj_edit.network_type
      this.monitor_edit.person = obj_edit.person
      this.monitor_edit.label_list = [];
      this.monitor_edit.tag = [];
      this.monitor_edit.ip_segment = [];
      this.monitor_edit.ip_segment_list = [];
      if (obj_edit.label.length == 0) {
        this.monitor_edit.label_list.push({
          name: '',
          icon: true
        })
      } else {
        obj_edit.label.forEach(item => {
          this.monitor_edit.label_list.push({
            name: item,
            icon: false
          })
        });
        this.monitor_edit.label_list[this.monitor_edit.label_list.length - 1].icon = true
      }

      if (obj_edit.ip_segment.length == 0) {
        this.monitor_edit.ip_segment_list.push({
          name: '',
          icon: true
        })
      } else {
        obj_edit.ip_segment.forEach(item => {
          this.monitor_edit.ip_segment_list.push({
            name: item,
            icon: false
          })
        });
        this.monitor_edit.ip_segment_list[this.monitor_edit.ip_segment_list.length - 1].icon = true
      }
    },
    edit_data () {
      console.log(this.monitor_edit.ip_segment_list);
      console.log(this.monitor_edit.label_list);

      var isRepeat_ip_segment_edit = []
      var isRepeat_tag_edit = []
      this.monitor_edit.ip_segment = []
      this.monitor_edit.tag = []
      var tag_test = []
      var tag_test_str = ''

      this.monitor_edit.ip_segment_list.forEach(item => {
        if (item.name != '') {
          isRepeat_ip_segment_edit.push(item.name)
        }
      });
      this.monitor_edit.label_list.forEach(item => {
        if (item.name != '') {
          tag_test.push(item.name)
        }
      });
      tag_test_str = JSON.stringify(tag_test)
      if (tag_test_str.indexOf("workstation") != -1 && (tag_test_str.indexOf("server") != -1 || tag_test_str.indexOf("network equipment") != -1)) {
        this.$message(
          {
            message: 'Only set one of the three types of tags:"workstation","server",or"network device".Please try again!',
            type: 'warning',
          }
        );
        return false
      }
      if (tag_test_str.indexOf("server") != -1 && (tag_test_str.indexOf("workstation") != -1 || tag_test_str.indexOf("network equipment") != -1)) {
        this.$message(
          {
            message: 'Only set one of the three types of tags:"workstation","server",or"network device".Please try again!',
            type: 'warning',
          }
        );
        return false
      }
      if (tag_test_str.indexOf("network equipment") != -1 && (tag_test_str.indexOf("server") != -1 || tag_test_str.indexOf("workstation") != -1)) {
        this.$message(
          {
            message: 'Only set one of the three types of tags:"workstation","server",or"network device".Please try again!',
            type: 'warning',
          }
        );
        return false
      }
      this.monitor_edit.label_list.forEach(item => {
        if (item.name != '') {
          isRepeat_tag_edit.push(item.name)
        }
      });
      if (this.isRepeat(isRepeat_ip_segment_edit)) {
        this.$message(
          {
            message: 'IP addresses or subnets have duplicates, please re-enter.',
            type: 'warning',
          }
        );
        return false
      }
      if (this.isRepeat(isRepeat_tag_edit)) {
        this.$message(
          {
            message: 'The labels has duplicates, Please re-enter.',
            type: 'warning',
          }
        );
        return false
      }
      this.monitor_edit.ip_segment_list.forEach(item => {
        if (item.name != '') {
          this.monitor_edit.ip_segment.push(item.name)
        }
      });
      this.monitor_edit.label_list.forEach(item => {
        if (item.name != '') {
          this.monitor_edit.tag.push(item.name)
        }
      });
      this.$axios.put('/yiiapi/ipsegment/edit-ip-segment', {
        id: this.monitor_edit.id,
        name: this.monitor_edit.name,
        ip_segment: this.monitor_edit.ip_segment,
        network_type: this.monitor_edit.network_type,
        person: this.monitor_edit.person,
        label: this.monitor_edit.tag,
      })
        .then(response => {
          console.log(response);
          if (response.data.status == 0) {
            this.monitor_state.edit = false;
            this.get_data();
            this.$message(
              {
                message: 'Update successfully',
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
    // 分页
    handleSizeChange (val) {
      this.monitor_page.rows = val;
      this.monitor_page.page = 1
      this.get_data();
    },
    handleCurrentChange (val) {
      this.monitor_page.page = val
      this.get_data();
    },
    // 全选择
    handleSelectionChange (val) {
      this.select_list = val
    },
    // 删除
    del_monitor () {
      if (this.select_list.length == 0) {
        this.$message(
          {
            message: 'Please select the IP/IP subnet to delete',
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
        this.$axios.delete('/yiiapi/ipsegment/del', {
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
    import_box () {
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
          } else {
            this.monitor_state.import = true;
          }
        })

    },
    closed_add_box () {
      this.monitor_state.add = false;
    },
    closed_edit_box () {
      this.monitor_state.edit = false;
    },
    closed_import_box () {
      this.monitor_state.import = false;
    },
    // 下载模板
    download_template () {
      this.$axios.get('/yiiapi/site/check-passwd-reset')
        .then((resp) => {
          let {
            status,
            msg,
            data
          } = resp.data;
          if (status == '602') {
            this.monitor_state.import = false;
            this.$message(
              {
                message: msg,
                type: 'warning',
              }
            );
            eventBus.$emit('reset')
          } else {
            this.$axios.get('/yiiapi/site/check-auth-exist', {
              params: {
                pathInfo: 'yararule/download',
              }
            })
              .then(response => {
                var url1 = '/yiiapi/ipsegment/template-download';
                window.location.href = url1;
              })
              .catch(error => {
                console.log(error);
              })
          }
        })
    },
    // 导入

    onExceed (files, fileList) {
      this.$message.warning('Only single file can be uploaded at a time, please upload again');
      console.log(files)
      // console.log(file.raw)
      console.log(fileList)
    },
    // 文件状态改变时的钩子
    fileChange (file, fileList) {

    },
    // 上传文件之前的钩子, 参数为上传的文件,若返回 false 或者返回 Promise 且被 reject，则停止上传
    beforeUploadFile (file) {
      console.log(file);
      let extension = file.name.substring(file.name.lastIndexOf('.') + 1)
      let size = file.size / 1024 / 1024 < 10
      if (!size) {
        this.$message.warning('File size cannot exceed 10 MB');
      }
      return size

    },
    // 文件上传成功时的钩子
    handleSuccess (res, file, fileList) {
      console.log(res);
      if (res.status == 1) {
        this.$message(
          {
            message: res.msg,
            type: 'error',
          }
        );
      } else if (res.status == 0) {
        this.get_data();
        this.monitor_state.import = false;
        this.$message(
          {
            message: 'Uploaded successfully',
            type: 'success',
          }
        );
      }
    },
    // 文件上传失败时的钩子
    handleError (err, file, fileList) {
      this.$message(
        {
          message: err,
          type: 'error',
        }
      );
    },
    uploadFile () {
      this.$axios.get('/yiiapi/site/check-auth-exist', {
        params: {
          pathInfo: 'yararule/download',
        }
      })
        .then(response => {
          this.$refs.uploadExcel.submit()
        })
        .catch(error => {
          console.log(error);
        })
    },
    // 导出
    download () {
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
          } else {
            this.$axios.get('/yiiapi/site/check-auth-exist', {
              params: {
                pathInfo: 'yararule/download',
              }
            })
              .then(response => {
                var url2 = '/yiiapi/ipsegment/export';
                window.location.href = url2;
              })
              .catch(error => {
                console.log(error);
              })
          }
        })
    }
  },
  filters: {
    formatDate: function (value) {
      return moment(value).format('YYYY-MM-DD HH:mm:ss')
    }
  },
};
</script>
<style lang='less'>
@import '../../../assets/css/less/reset_css/reset_table.less';
@import '../../../assets/css/less/reset_css/reset_pop.less';
#system_control_monitor {
  .add_box {
    .el-dialog {
      width: 840px;
      .el-dialog__body {
        width: 840px;
        .content {
          padding: 24px 10px;
          display: flex;
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
          .content_item_box {
            flex: 1;
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
          .content_item_space {
            width: 20px;
          }
        }
      }
    }
  }
  .import_box {
    .el-dialog {
      width: 440px;
      .el-upload-dragger {
        border: 0;
        height: 140px;
        .upload_img {
          margin-top: 20px;
          width: 88px;
        }
      }
      .tip_box {
        font-size: 14px;
        color: #999999;
        margin: 24px 0;
        .download {
          color: #0070ff;
          text-decoration: underline;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
<style scoped lang='less'>
@import '../../../assets/css/less/system/setting/common_box.less';
#system_control_monitor {
  .content_box {
    .monitor_title {
      margin-bottom: 24px;
      .btn_i {
        background: #0070ff;
        color: #fff;
        width: 148px;
        height: 42px;
      }
      .btn_o {
        background: #fff;
        border-color: #0070ff;
        color: #0070ff;
        width: 148px;
        height: 42px;
      }
    }
    .monitor_table {
      padding-right: 24px;
      .pagination_box {
        margin-top: 24px;
        text-align: center;
      }
      .btn_tag_box {
        margin: 2px;
        .btn_tag {
          background: #5389e0;
          border-radius: 2px;
          min-height: 20px;
          font-size: 10px;
          color: #ffffff;
          padding: 2px 5px;
        }
      }
      .btn_edit {
        padding: 0;
        background: #5389e0;
        border-radius: 2px;
        width: 72px;
        height: 30px;
      }
    }
  }
}
</style>
