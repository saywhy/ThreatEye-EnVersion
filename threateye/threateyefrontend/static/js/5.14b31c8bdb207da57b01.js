webpackJsonp([5],{"+n12":function(t,s){},"5mP6":function(t,s,a){"use strict";Object.defineProperty(s,"__esModule",{value:!0});var e=a("zQWo"),o={components:{vmEmergePicker:e.a},name:"audit_log",data:function(){return{loading:!1,time_list:{time:[]},audit_log:{},audit_data:{start_time:"",end_time:"",key:"",page:1,rows:10}}},props:{option:{type:Object,default:function(){}}},mounted:function(){this.get_data()},methods:{get_data:function(){var t=this;this.loading=!0,this.$axios.get("/yiiapi/userlog/page",{params:{username:this.audit_data.key,start_time:this.audit_data.start_time,end_time:this.audit_data.end_time,page:this.audit_data.page,rows:this.audit_data.rows}}).then(function(s){t.loading=!1,console.log(s),t.audit_log=s.data.data,t.audit_log.data.forEach(function(t,s){t.index_cn=s+1})}).catch(function(t){console.log(t)})},add_box:function(){},edit_box:function(){},changeTime:function(t){console.log(t),t?(this.audit_data.start_time=t[0].valueOf()/1e3,this.audit_data.end_time=t[1].valueOf()/1e3):(this.audit_data.start_time="",this.audit_data.end_time="")},handleSizeChange:function(t){this.audit_data.rows=t,this.audit_data.page=1,this.get_data()},handleCurrentChange:function(t){this.audit_data.page=t,this.get_data()},reset:function(){this.audit_data.key="",this.audit_data.start_time="",this.audit_data.end_time="",this.time_list={time:[]}},download:function(){var t="/yiiapi/userlog/export?username="+this.audit_data.key+"&start_time="+this.audit_data.start_time+"&end_time="+this.audit_data.end_time;window.location.href=t}}},i={render:function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("div",{directives:[{name:"loading",rawName:"v-loading.fullscreen.lock",value:t.loading,expression:"loading",modifiers:{fullscreen:!0,lock:!0}}],attrs:{id:"audit_log"}},[a("div",{staticClass:"search_box"},[a("el-input",{staticClass:"search_key",attrs:{placeholder:"搜索关键词",clearable:""},model:{value:t.audit_data.key,callback:function(s){t.$set(t.audit_data,"key",s)},expression:"audit_data.key"}},[a("i",{staticClass:"el-input__icon el-icon-search",attrs:{slot:"prefix"},slot:"prefix"})]),t._v(" "),a("vm-emerge-picker",{attrs:{option:t.time_list},on:{changeTime:t.changeTime}}),t._v(" "),a("el-button",{staticClass:"btn_i",on:{click:t.get_data}},[t._v(" 搜索")]),t._v(" "),a("span",{staticClass:"reset",on:{click:t.reset}},[t._v("重置")]),t._v(" "),a("el-button",{staticClass:"btn_right",on:{click:t.download}},[t._v("下载")])],1),t._v(" "),a("p",{staticClass:"line"}),t._v(" "),a("div",{staticClass:"audit_table"},[a("el-table",{ref:"multipleTable",staticClass:"reset_table",staticStyle:{width:"100%"},attrs:{align:"center",data:t.audit_log.data,"tooltip-effect":"dark"}},[a("el-table-column",{attrs:{label:"序号",width:"80"},scopedSlots:t._u([{key:"default",fn:function(s){return[t._v("\n          "+t._s((t.audit_data.page-1)*t.audit_data.rows+s.row.index_cn)+"\n        ")]}}])}),t._v(" "),a("el-table-column",{attrs:{prop:"created_at",label:"时间","show-overflow-tooltip":""}}),t._v(" "),a("el-table-column",{attrs:{prop:"username",label:"用户标识","show-overflow-tooltip":""}}),t._v(" "),a("el-table-column",{attrs:{prop:"info",label:"描述","show-overflow-tooltip":""}}),t._v(" "),a("el-table-column",{attrs:{prop:"userip",label:"主机地址","show-overflow-tooltip":""}})],1),t._v(" "),a("el-pagination",{staticClass:"pagination_box",attrs:{"current-page":t.audit_log.pageNow,"page-sizes":[10,20,50,100],"page-size":10,layout:"total, sizes, prev, pager, next",total:t.audit_log.count},on:{"size-change":t.handleSizeChange,"current-change":t.handleCurrentChange}})],1)])},staticRenderFns:[]};var l=a("VU/8")(o,i,!1,function(t){a("Afm9"),a("tB0A")},"data-v-63a72b93",null).exports,n=a("mvHQ"),c=a.n(n),d=a("PJh5"),r=a.n(d),_={name:"fault_log",data:function(){return{loading:!1,fault_list:{},fault_data:{page:1,rows:10},select_list:[]}},props:{option:{type:Object,default:function(){}}},mounted:function(){this.get_data()},methods:{get_data:function(){var t=this;this.loading=!0,this.$axios.get("/yiiapi/faultlog/list",{params:{page:this.fault_data.page,rows:this.fault_data.rows}}).then(function(s){console.log(s),t.loading=!1,t.fault_list=s.data.data}).catch(function(t){console.log(t)})},faultlog_testing:function(){var t=this;this.loading=!0,this.$axios.get("/yiiapi/faultlog/testing").then(function(s){console.log(s),t.loading=!1,0==s.data.status?(t.get_data(),t.$message({type:"success",message:"检测成功!"})):t.$message({type:"error",message:s.data.msg})}).catch(function(t){console.log(t)})},faultlog_download:function(){var t=this;if(console.log(this.select_list),0==this.select_list.length)return this.$message({message:"请选择需要下载的故障日志！",type:"warning"}),!1;this.$confirm("此操作下载信息, 是否继续?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){var s=[];t.select_list.forEach(function(t){s.push(t.id)}),t.select_list=[],t.$refs.multipleTable.clearSelection(),console.log(s);var a="/yiiapi/faultlog/download?id="+c()(s);window.location.href=a}).catch(function(){t.select_list=[],t.$message({type:"info",message:"已取消下载"})})},faultlog_del:function(){var t=this;if(0==this.select_list.length)return this.$message({message:"请选择需要删除的故障日志！",type:"warning"}),!1;this.$confirm("此操作删除信息, 是否继续?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){var s=[];t.select_list.forEach(function(t){s.push(t.id)}),console.log(s),t.$axios.delete("/yiiapi/faultlog/del",{data:{id:s}}).then(function(s){console.log(s),0==s.data.status?(t.get_data(),t.$message({message:"删除成功！",type:"success"})):t.$message({message:"删除失败！",type:"error"})}).catch(function(t){console.log(t)})}).catch(function(){t.$message({type:"info",message:"已取消删除"})})},handleSizeChange:function(t){this.fault_data.rows=t,this.fault_data.page=1,this.get_data()},handleCurrentChange:function(t){this.fault_data.page=t,this.get_data()},handleSelectionChange:function(t){this.select_list=t},add_box:function(){},edit_box:function(){},alert_detail:function(){},closed_add_box:function(){},closed_edit_box:function(){}},filters:{formatDate:function(t){return r()(t).format("YYYY-MM-DD HH:mm:ss")}}},p={render:function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("div",{directives:[{name:"loading",rawName:"v-loading.fullscreen.lock",value:t.loading,expression:"loading",modifiers:{fullscreen:!0,lock:!0}}],attrs:{id:"fault_log"}},[a("div",{staticClass:"fault_top"},[a("el-button",{staticClass:"btn_i",on:{click:t.faultlog_testing}},[t._v("故障检测")]),t._v(" "),a("el-button",{staticClass:"btn_i",on:{click:t.faultlog_download}},[t._v("下载")]),t._v(" "),a("el-button",{staticClass:"btn_o",on:{click:t.faultlog_del}},[t._v("删除")])],1),t._v(" "),a("div",{staticClass:"fault_table"},[a("el-table",{ref:"multipleTable",staticClass:"reset_table",staticStyle:{width:"100%"},attrs:{align:"center",data:t.fault_list.data,"tooltip-effect":"dark"},on:{"selection-change":t.handleSelectionChange,"row-click":t.alert_detail}},[a("el-table-column",{attrs:{label:"全选",prop:"type",width:"50"}}),t._v(" "),a("el-table-column",{attrs:{type:"selection",width:"50"}}),t._v(" "),a("el-table-column",{attrs:{label:"时间","show-overflow-tooltip":""},scopedSlots:t._u([{key:"default",fn:function(s){return[t._v(t._s(t._f("formatDate")(1e3*s.row.time)))]}}])}),t._v(" "),a("el-table-column",{attrs:{prop:"file",label:"日志文件","show-overflow-tooltip":""}})],1),t._v(" "),a("el-pagination",{staticClass:"pagination_box",attrs:{"current-page":t.fault_list.pageNow,"page-sizes":[10,20,50,100],"page-size":10,layout:"total, sizes, prev, pager, next",total:t.fault_list.count},on:{"size-change":t.handleSizeChange,"current-change":t.handleCurrentChange}})],1)])},staticRenderFns:[]};var u=a("VU/8")(_,p,!1,function(t){a("88LZ"),a("+n12")},"data-v-e253cde8",null).exports,g={components:{vmEmergePicker:e.a},name:"syslog_set",data:function(){return{syslog_data:{page:1,rows:10,loading:!1},syslog_list:{},syslog_pop:{add:{show:!1,switch:!0,protocol:"udp",server_ip:"",server_port:""},edit:{show:!1,switch:!0,radio:"",status:"",ip:"",id:"",port:""}}}},props:{option:{type:Object,default:function(){}}},mounted:function(){this.get_data()},methods:{get_data:function(){var t=this;this.syslog_data.loading=!0,this.$axios.get("/yiiapi/syslog/list",{params:{page:this.syslog_data.page,rows:this.syslog_data.rows}}).then(function(s){console.log(s),t.syslog_data.loading=!1,t.syslog_list=s.data.data,t.syslog_list.data.forEach(function(t,s){t.index_cn=s+1})}).catch(function(t){console.log(t)})},del_box:function(t){var s=this;console.log(t),this.$confirm("此操作删除该条信息, 是否继续?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){s.$axios.delete("/yiiapi/syslog/del-conf",{data:{id:t.id}}).then(function(t){console.log(t),0==t.data.status&&(s.get_data(),s.$message({type:"success",message:"删除成功!"}))}).catch(function(t){console.log(t)})}).catch(function(){s.$message({type:"info",message:"已取消删除"})})},handleSizeChange:function(t){this.syslog_data.rows=t,this.syslog_data.page=1,this.get_data()},handleCurrentChange:function(t){this.syslog_data.page=t,this.get_data()},open_add:function(){this.syslog_pop.add.show=!0,this.syslog_pop.add.switch=!0,this.syslog_pop.add.protocol="udp",this.syslog_pop.add.server_ip="",this.syslog_pop.add.server_port=""},addsyslog:function(){var t=this;this.syslog_pop.add.switch?this.syslog_pop.add.status="1":this.syslog_pop.add.status="0",this.$axios.post("/yiiapi/syslog/add-conf",{server_ip:this.syslog_pop.add.server_ip,server_port:this.syslog_pop.add.server_port,protocol:this.syslog_pop.add.protocol,status:this.syslog_pop.add.status}).then(function(s){console.log(s),1==s.data.status?t.$message({message:s.data.msg,type:"error"}):0==s.data.status&&(t.syslog_pop.add.show=!1,t.get_data())}).catch(function(t){console.log(t)})},edit_box:function(t){this.syslog_pop.edit.show=!0,console.log(t),"1"==t.status?this.syslog_pop.edit.switch=!0:this.syslog_pop.edit.switch=!1,this.syslog_pop.edit.status=t.status,this.syslog_pop.edit.radio=t.protocol,this.syslog_pop.edit.ip=t.server_ip,this.syslog_pop.edit.port=t.server_port,this.syslog_pop.edit.id=t.id},editsyslog:function(){var t=this;this.syslog_pop.edit.switch?this.syslog_pop.edit.status="1":this.syslog_pop.edit.status="0",this.$axios.put("/yiiapi/syslog/edit-conf",{id:this.syslog_pop.edit.id,server_ip:this.syslog_pop.edit.ip,server_port:this.syslog_pop.edit.port,protocol:this.syslog_pop.edit.radio,status:this.syslog_pop.edit.status}).then(function(s){console.log(s),0==s.data.status&&(t.get_data(),t.syslog_pop.edit.show=!1,t.$message({type:"success",message:"修改成功!"}))}).catch(function(t){console.log(t)})},closed_add_box:function(){this.syslog_pop.add.show=!1},closed_edit_box:function(){this.syslog_pop.edit.show=!1}}},h={render:function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("div",{directives:[{name:"loading",rawName:"v-loading.fullscreen.lock",value:t.syslog_data.loading,expression:"syslog_data.loading",modifiers:{fullscreen:!0,lock:!0}}],attrs:{id:"syslog_set"}},[e("div",{staticClass:"search_box"},[e("el-button",{staticClass:"btn_i",on:{click:t.open_add}},[t._v("添加SYSLOG配置")])],1),t._v(" "),e("div",{staticClass:"syslog_table"},[e("el-table",{ref:"multipleTable",staticClass:"reset_table",staticStyle:{width:"100%"},attrs:{align:"center",data:t.syslog_list.data,"tooltip-effect":"dark"}},[e("el-table-column",{attrs:{label:"序号",width:"80"},scopedSlots:t._u([{key:"default",fn:function(s){return[t._v("\n          "+t._s((t.syslog_data.page-1)*t.syslog_data.rows+s.row.index_cn)+"\n        ")]}}])}),t._v(" "),e("el-table-column",{attrs:{prop:"server_ip",label:"SYSLOG服务器IP","show-overflow-tooltip":""}}),t._v(" "),e("el-table-column",{attrs:{prop:"server_port",label:"端口","show-overflow-tooltip":""}}),t._v(" "),e("el-table-column",{attrs:{prop:"protocol",label:"传输协议","show-overflow-tooltip":""}}),t._v(" "),e("el-table-column",{attrs:{label:"状态"},scopedSlots:t._u([{key:"default",fn:function(s){return[e("span",[t._v(t._s("1"==s.row.status?"启用":"未启用"))])]}}])}),t._v(" "),e("el-table-column",{attrs:{label:"操作"},scopedSlots:t._u([{key:"default",fn:function(s){return[e("el-button",{staticClass:"btn_edit",attrs:{type:"primary"},on:{click:function(a){return a.stopPropagation(),t.edit_box(s.row)}}},[t._v("编辑")]),t._v(" "),e("el-button",{staticClass:"btn_edit",attrs:{type:"primary"},on:{click:function(a){return a.stopPropagation(),t.del_box(s.row)}}},[t._v("删除")])]}}])})],1),t._v(" "),e("el-pagination",{staticClass:"pagination_box",attrs:{"current-page":t.syslog_list.pageNow,"page-sizes":[10,20,50,100],"page-size":10,layout:"total, sizes, prev, pager, next",total:t.syslog_list.count},on:{"size-change":t.handleSizeChange,"current-change":t.handleCurrentChange}})],1),t._v(" "),e("el-dialog",{staticClass:"add_box pop_box",attrs:{"close-on-click-modal":!1,"modal-append-to-body":!1,visible:t.syslog_pop.add.show},on:{"update:visible":function(s){return t.$set(t.syslog_pop.add,"show",s)}}},[e("img",{staticClass:"closed_img",attrs:{src:a("6an9"),alt:""},on:{click:t.closed_add_box}}),t._v(" "),e("div",{staticClass:"title"},[e("div",{staticClass:"mask"}),t._v(" "),e("span",{staticClass:"title_name"},[t._v("添加SYSLOG配置")])]),t._v(" "),e("div",{staticClass:"content"},[e("div",{staticClass:"content_item"},[e("div",{staticClass:"item_top"},[e("span",{staticStyle:{"margin-right":"10px"}},[t._v("是否启用")]),t._v(" "),e("el-switch",{model:{value:t.syslog_pop.add.switch,callback:function(s){t.$set(t.syslog_pop.add,"switch",s)},expression:"syslog_pop.add.switch"}})],1),t._v(" "),e("div",{staticClass:"item_bottom"},[e("p",[e("span",{staticClass:"title"},[t._v("SYSLOG服务器IP")]),t._v(" "),e("span",{staticClass:"red_necessary"},[t._v("*")])]),t._v(" "),e("el-input",{staticClass:"select_box",attrs:{placeholder:"请输入SYSLOG服务器IP",clearable:""},model:{value:t.syslog_pop.add.server_ip,callback:function(s){t.$set(t.syslog_pop.add,"server_ip",s)},expression:"syslog_pop.add.server_ip"}})],1)]),t._v(" "),e("div",{staticClass:"content_space"}),t._v(" "),e("div",{staticClass:"content_item"},[e("div",{staticClass:"item_top"},[e("span",{staticStyle:{"margin-right":"10px"}},[t._v("状态")]),t._v(" "),e("el-radio",{staticClass:"r_radio_item",attrs:{label:"udp"},model:{value:t.syslog_pop.add.protocol,callback:function(s){t.$set(t.syslog_pop.add,"protocol",s)},expression:"syslog_pop.add.protocol"}},[t._v("udp")]),t._v(" "),e("el-radio",{staticClass:"r_radio_item",attrs:{label:"tcp"},model:{value:t.syslog_pop.add.protocol,callback:function(s){t.$set(t.syslog_pop.add,"protocol",s)},expression:"syslog_pop.add.protocol"}},[t._v("tcp")])],1),t._v(" "),e("div",{staticClass:"item_bottom"},[e("p",[e("span",{staticClass:"title"},[t._v("端口")]),t._v(" "),e("span",{staticClass:"red_necessary"},[t._v("*")])]),t._v(" "),e("el-input",{staticClass:"select_box",attrs:{placeholder:"请输入端口",clearable:""},model:{value:t.syslog_pop.add.server_port,callback:function(s){t.$set(t.syslog_pop.add,"server_port",s)},expression:"syslog_pop.add.server_port"}})],1)])]),t._v(" "),e("div",{staticClass:"btn_box"},[e("el-button",{staticClass:"cancel_btn",on:{click:t.closed_add_box}},[t._v("取消")]),t._v(" "),e("el-button",{staticClass:"ok_btn",on:{click:t.addsyslog}},[t._v("确定")])],1)]),t._v(" "),e("el-dialog",{staticClass:"add_box pop_box",attrs:{"close-on-click-modal":!1,"modal-append-to-body":!1,visible:t.syslog_pop.edit.show},on:{"update:visible":function(s){return t.$set(t.syslog_pop.edit,"show",s)}}},[e("img",{staticClass:"closed_img",attrs:{src:a("6an9"),alt:""},on:{click:t.closed_edit_box}}),t._v(" "),e("div",{staticClass:"title"},[e("div",{staticClass:"mask"}),t._v(" "),e("span",{staticClass:"title_name"},[t._v("编辑SYSLOG配置")])]),t._v(" "),e("div",{staticClass:"content"},[e("div",{staticClass:"content_item"},[e("div",{staticClass:"item_top"},[e("span",[t._v("是否启用")]),t._v(" "),e("el-switch",{model:{value:t.syslog_pop.edit.switch,callback:function(s){t.$set(t.syslog_pop.edit,"switch",s)},expression:"syslog_pop.edit.switch"}})],1),t._v(" "),e("div",{staticClass:"item_bottom"},[e("p",[e("span",{staticClass:"title"},[t._v("SYSLOG服务器IP")]),t._v(" "),e("span",{staticClass:"red_necessary"},[t._v("*")])]),t._v(" "),e("el-input",{staticClass:"select_box",attrs:{placeholder:"请输入SYSLOG服务器IP",clearable:""},model:{value:t.syslog_pop.edit.ip,callback:function(s){t.$set(t.syslog_pop.edit,"ip",s)},expression:"syslog_pop.edit.ip"}})],1)]),t._v(" "),e("div",{staticClass:"content_space"}),t._v(" "),e("div",{staticClass:"content_item"},[e("div",{staticClass:"item_top"},[e("span",[t._v("状态")]),t._v(" "),e("el-radio",{staticClass:"r_radio_item",attrs:{label:"udp"},model:{value:t.syslog_pop.edit.radio,callback:function(s){t.$set(t.syslog_pop.edit,"radio",s)},expression:"syslog_pop.edit.radio"}},[t._v("udp")]),t._v(" "),e("el-radio",{staticClass:"r_radio_item",attrs:{label:"tcp"},model:{value:t.syslog_pop.edit.radio,callback:function(s){t.$set(t.syslog_pop.edit,"radio",s)},expression:"syslog_pop.edit.radio"}},[t._v("tcp")])],1),t._v(" "),e("div",{staticClass:"item_bottom"},[e("p",[e("span",{staticClass:"title"},[t._v("端口")]),t._v(" "),e("span",{staticClass:"red_necessary"},[t._v("*")])]),t._v(" "),e("el-input",{staticClass:"select_box",attrs:{placeholder:"请输入端口",clearable:""},model:{value:t.syslog_pop.edit.port,callback:function(s){t.$set(t.syslog_pop.edit,"port",s)},expression:"syslog_pop.edit.port"}})],1)])]),t._v(" "),e("div",{staticClass:"btn_box"},[e("el-button",{staticClass:"cancel_btn",on:{click:t.closed_edit_box}},[t._v("取消")]),t._v(" "),e("el-button",{staticClass:"ok_btn",on:{click:t.editsyslog}},[t._v("确定")])],1)])],1)},staticRenderFns:[]};var v={components:{auditLog:l,faultLog:u,syslogSet:a("VU/8")(g,h,!1,function(t){a("KhUU"),a("qHjg")},"data-v-ec79e0cc",null).exports},name:"system_control_record",data:function(){return{activeName:"first",tab_show:{first:!0,second:!1,third:!1}}},methods:{handleClick:function(t,s){switch(console.log(t),t.name){case"first":this.tab_show.first=!0,this.tab_show.second=!1,this.tab_show.third=!1;break;case"second":this.tab_show.first=!1,this.tab_show.second=!0,this.tab_show.third=!1;break;case"third":this.tab_show.first=!1,this.tab_show.second=!1,this.tab_show.third=!0}}}},f={render:function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("div",{staticClass:"container",attrs:{id:"system_control_record"}},[a("div",{staticClass:"content_box"},[a("el-tabs",{staticClass:"reset_tab",on:{"tab-click":t.handleClick},model:{value:t.activeName,callback:function(s){t.activeName=s},expression:"activeName"}},[a("el-tab-pane",{staticClass:"tabs-item",attrs:{label:"审计日志",name:"first"}},[t.tab_show.first?a("audit-log"):t._e()],1),t._v(" "),a("el-tab-pane",{staticClass:"tabs-item",attrs:{label:"SYSLOG配置",name:"second"}},[t.tab_show.second?a("syslog-set"):t._e()],1),t._v(" "),a("el-tab-pane",{staticClass:"tabs-item",attrs:{label:"故障日志",name:"third"}},[t.tab_show.third?a("fault-log"):t._e()],1)],1)],1)])},staticRenderFns:[]};var m=a("VU/8")(v,f,!1,function(t){a("fWvU"),a("ri+g")},"data-v-c2beb326",null);s.default=m.exports},"88LZ":function(t,s){},Afm9:function(t,s){},KhUU:function(t,s){},fWvU:function(t,s){},qHjg:function(t,s){},"ri+g":function(t,s){},tB0A:function(t,s){}});