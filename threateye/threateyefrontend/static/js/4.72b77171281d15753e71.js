webpackJsonp([4],{"65t9":function(t,e){},AEuH:function(t,e){},IXam:function(t,e){},Oe3C:function(t,e,a){"use strict";(function(t){e.a={name:"yara_rule",data:function(){return{rule_data:{file_size:"",update_time:"",name:"上传"},rule:{upload_pop:!1},fileList:[],loading:!1}},props:{option:{type:Object,default:function(){}}},watch:{$route:function(t,e){console.log(t.path)}},created:function(){this.get_data()},mounted:function(){},methods:{get_data:function(){var t=this;this.loading=!0,this.$axios.get("/yiiapi/yararule/get").then(function(e){console.log(e.data),0==e.data.status?(t.rule_data.file_size=e.data.data.file_size,t.rule_data.update_time=e.data.data.update_time,t.rule_data.name="替换"):1==e.data.status&&(t.rule_data.file_size=e.data.msg.file_size,t.rule_data.update_time=e.data.msg.update_time,t.rule_data.name="上传"),setTimeout(function(){t.loading=!1},500)}).catch(function(t){console.log(t)})},download:function(){if(console.log(this.rule_data),""==this.rule_data.file_size)return this.$message({message:"并未发现任何yara规则文件，请先上传规则库文件！",type:"warning"}),!1;this.$axios.get("/yiiapi/site/check-auth-exist",{params:{pathInfo:"yararule/download"}}).then(function(e){if(console.log(e.data),0==e.data.status){(new Date).getTime();var a=t("<form>");a.attr("style","display:none"),a.attr("target",""),a.attr("method","get"),a.attr("action","/yiiapi/yararule/download"),t("body").append(a);var s=t("<input>");s.attr("type","hidden"),a.append(s),a.submit()}}).catch(function(t){console.log(t)})},handleExceed:function(){},handlePreview:function(){},handleRemove:function(){},beforeRemove:function(){},onBeforeUpload:function(){},onChange:function(t){console.log(t),"fail"==t.status&&this.$message({message:"上传失败！",type:"error"})},onsuccess:function(t){1==t.status?this.$message({message:t.msg,type:"error"}):0==t.status&&(this.get_data(),this.$message({message:"上传成功！",type:"success"}))},onerror:function(t){"fail"==t.status&&this.$message({message:"上传失败！",type:"error"})},del_yara:function(){var t=this;this.$confirm("此操作删除此文件, 是否继续?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){t.$axios.get("/yiiapi/yararule/del").then(function(e){console.log(e.data.data),0==e.data.data.status?(t.get_data(),t.$message({message:"删除成功！",type:"success"})):t.$message({message:"删除失败！",type:"error"})}).catch(function(t){console.log(t)})}).catch(function(){t.$message({type:"info",message:"已取消删除"})})}},filters:{filterType:function(t){if(""!=t&&void 0!=t){if(0==t)return"0B";var e=Math.floor(Math.log(t)/Math.log(1024));return(t/Math.pow(1024,e)).toPrecision(3)+" "+["B","KB","MB","GB","TB","PB","EB","ZB","YB"][e]}}}}}).call(e,a("7t+N"))},R9aR:function(t,e){},SKcu:function(t,e){},"UTu/":function(t,e){},dLkD:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s={name:"rule_base",data:function(){return{loading:!1,options:{target:"/yiiapi/rulebase/upload-package",chunkSize:"10048000",testChunks:!1,parseTimeRemaining:function(t,e){return e.replace(/\syears?/,"年").replace(/\days?/,"天").replace(/\shours?/,"小时").replace(/\sminutes?/,"分钟").replace(/\sseconds?/,"秒")}},fileStatusText:{success:"成功",error:"错误",uploading:"上传中",paused:"暂停",waiting:"等待"},rule:{},rule_data:{upload_pop:!1},timer:null}},props:{option:{type:Object,default:function(){}}},activated:function(){},deactivated:function(){},mounted:function(){var t=this;this.get_data(),this.timer=setInterval(function(){t.get_data()},2e3)},beforeDestroy:function(){console.log("2222"),clearInterval(this.timer)},destroyed:function(){console.log("33333")},beforeRouteLeave:function(t,e,a){console.log("2132131")},methods:{update_status:function(){var t=this;this.$axios.get("/yiiapi/rulebase/get-update-status").then(function(e){console.log(e),0==e.data.status?(t.rule=e.data.data,t.rule.forEach(function(t){switch(t.status){case"1":t.status_cn="更新中";break;case"2":t.status_cn="成功";break;case"3":t.status_cn="失败"}})):e.data.status}).catch(function(t){console.log(t)})},get_data:function(){var t=this;this.$axios.get("/yiiapi/rulebase/get-update-status").then(function(e){console.log(e),0==e.data.status?(t.rule=e.data.data,t.rule.forEach(function(t){switch(t.status){case"1":t.status_cn="更新中";break;case"2":t.status_cn="成功";break;case"3":t.status_cn="失败"}})):e.data.status}).catch(function(t){console.log(t)})},open_box:function(){this.rule_data.upload_pop=!0},closed_upload_box:function(){this.rule_data.upload_pop=!1},onBeforeUpload:function(){},onChange:function(){},uploadSuccess:function(){console.log("1111"),this.monitor_state.import_loading=!1},update_online:function(){var t=this;this.$axios.post("/yiiapi/rulebase/realtime-update").then(function(e){console.log(e);var a=e.data,s=a.status;a.data;0==s&&(t.$message({type:"success",message:"开始更新！"}),setTimeout(function(){t.get_data()},100))}).catch(function(t){console.log(t)})},onFileAdded:function(t){console.log(t.name),t.pause(),"sdk.tgz"==t.name||"ids.tgz"==t.name||"df.tgz"==t.name?setTimeout(function(){t.resume()},100):(this.$message({message:"请上传文件名为sdk.tgz、ids.tgz、df.tgz的文件",type:"warning"}),setTimeout(function(){t.cancel()},100))},onFileSuccess:function(t,e,a,s){var i=this;0==JSON.parse(a).status&&(console.log(e),this.$axios.get("/yiiapi/sandbox/move-file",{params:{upload_name:e.name}}).then(function(t){var a=t.data,s=a.status;a.data;0==s&&(e.cancel(),i.get_data(),i.$message({message:"上传成功！",type:"success"}))}).catch(function(t){console.log(t)})),console.log(s)},onFileProgress:function(t){},onFileError:function(){}}},i={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{directives:[{name:"loading",rawName:"v-loading.fullscreen.lock",value:t.loading,expression:"loading",modifiers:{fullscreen:!0,lock:!0}}],attrs:{id:"rule_base"}},[s("p",{staticClass:"title"},[t._v("实时更新")]),t._v(" "),t._l(t.rule,function(e){return"1"==e.update_type?s("p",{staticClass:"item_box"},[s("span",{staticClass:"item_name"},[t._v(t._s(e.key))]),t._v(" "),s("span",{staticClass:"item_time"},[t._v("上次更新时间：\n      "),s("span",[t._v(t._s(e.time))])]),t._v(" "),s("span",{staticClass:"item_status"},[t._v(t._s(e.status_cn))])]):t._e()}),t._v(" "),s("el-button",{staticClass:"update",attrs:{type:"primary"},on:{click:t.update_online}},[t._v("更新")]),t._v(" "),s("p",{staticClass:"title"},[t._v("离线更新")]),t._v(" "),t._l(t.rule,function(e){return"2"==e.update_type?s("p",{staticClass:"item_box"},[s("span",{staticClass:"item_name"},[t._v(t._s(e.key))]),t._v(" "),s("span",{staticClass:"item_time"},[t._v("上次更新时间：\n      "),s("span",[t._v(t._s(e.time))])]),t._v(" "),s("span",{staticClass:"item_status"},[t._v(t._s(e.status_cn))])]):t._e()}),t._v(" "),s("el-button",{staticClass:"update",attrs:{type:"primary"},on:{click:t.open_box}},[t._v("上传更新文件")]),t._v(" "),s("el-dialog",{staticClass:"import_box pop_box",attrs:{"close-on-click-modal":!1,"modal-append-to-body":!1,visible:t.rule_data.upload_pop},on:{"update:visible":function(e){return t.$set(t.rule_data,"upload_pop",e)}}},[s("img",{staticClass:"closed_img",attrs:{src:a("6an9"),alt:""},on:{click:t.closed_upload_box}}),t._v(" "),s("div",{staticClass:"title"},[s("div",{staticClass:"mask"}),t._v(" "),s("span",{staticClass:"title_name"},[t._v("上传更新文件")])]),t._v(" "),s("div",{staticClass:"content"},[s("uploader",{staticClass:"uploader-example",attrs:{options:t.options,autoStart:!1,fileStatusText:t.fileStatusText},on:{"file-added":t.onFileAdded,"file-success":t.onFileSuccess,"file-progress":t.onFileProgress,"file-error":t.onFileError}},[s("uploader-unsupport"),t._v(" "),s("img",{staticClass:"upload_img",attrs:{src:a("8BA2"),alt:""}}),t._v(" "),s("uploader-drop",[s("uploader-btn",{staticClass:"select_btn"},[t._v("点击上传")]),t._v(" "),s("span",[t._v("请上传文件名为sdk.tgz、ids.tgz、df.tgz的文件")])],1),t._v(" "),s("uploader-list")],1)],1),t._v(" "),s("div",{staticClass:"btn_box"},[s("el-button",{staticClass:"cancel_btn",on:{click:t.closed_upload_box}},[t._v("取消")]),t._v(" "),s("el-button",{staticClass:"ok_btn",on:{click:t.closed_upload_box}},[t._v("确定")])],1)])],2)},staticRenderFns:[]};var n=a("VU/8")(s,i,!1,function(t){a("p0Tr"),a("AEuH")},"data-v-7ee855e6",null).exports,o=a("Oe3C"),l={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{directives:[{name:"loading",rawName:"v-loading.fullscreen.lock",value:t.loading,expression:"loading",modifiers:{fullscreen:!0,lock:!0}}],attrs:{id:"yara_rule"}},[a("p",[a("img",{attrs:{src:"",alt:""}}),t._v(" "),a("span",[t._v("文件大小："+t._s(t._f("filterType")(t.rule_data.file_size)))])]),t._v(" "),a("p",{staticClass:"updata_time"},[t._v("上次更新时间：\n    "),a("span",[t._v(t._s(t.rule_data.update_time))])]),t._v(" "),a("div",{staticClass:"btn_box"},[a("el-button",{staticClass:"btn_i",on:{click:t.download}},[t._v("下载")]),t._v(" "),a("el-upload",{staticClass:"upload-demo",staticStyle:{display:"inline-block"},attrs:{action:"/yiiapi/yararule/upload","on-preview":t.handlePreview,"on-remove":t.handleRemove,"before-remove":t.beforeRemove,"show-file-list":!1,"before-upload":t.onBeforeUpload,"on-change":t.onChange,multiple:"","auto-upload":!0,"on-success":t.onsuccess,"on-error":t.onerror,"on-exceed":t.handleExceed,"file-list":t.fileList}},[a("el-button",{staticClass:"btn_i",attrs:{type:"primary"}},[a("span",[t._v(" "+t._s(t.rule_data.name))])])],1),t._v(" "),a("el-button",{staticClass:"btn_o",on:{click:t.del_yara}},[t._v("删除")])],1)])},staticRenderFns:[]};var c=function(t){a("65t9"),a("lcdP")},r=a("VU/8")(o.a,l,!1,c,"data-v-edaa12ee",null).exports,d={name:"white_list",data:function(){return{loading:!1,white_list:{},white_data:{page:1,rows:10},white_add:{add:!1,type_list:["MD5","IP","URL","Indicator"],indicator:"",type:"MD5"},fileList:[],select_list:[]}},props:{option:{type:Object,default:function(){}}},mounted:function(){this.get_data()},methods:{get_data:function(){var t=this;this.loading=!0,this.$axios.get("/yiiapi/whitelist/list",{params:{page:this.white_data.page,rows:this.white_data.rows}}).then(function(e){t.loading=!1,t.white_list=e.data.data,t.white_list.data.forEach(function(t,e){t.index_cn=e+1})}).catch(function(t){console.log(t)})},open_add_box:function(){this.white_add.add=!0,this.white_add.indicator="",this.white_add.type="MD5"},add_white:function(){var t=this;if(console.log(this.white_add),""==this.white_add.indicator)return this.$message({message:"请输入指标",type:"warning"}),!1;this.$axios.post("/yiiapi/whitelist/add",{indicator:this.white_add.indicator,alert_type:this.white_add.type}).then(function(e){console.log(e),1==e.data.status?t.$message({message:e.data.msg,type:"error"}):0==e.data.status&&(t.get_data(),t.$message({message:"添加成功",type:"success"}),t.white_add.add=!1)}).catch(function(t){console.log(t)})},closed_add_box:function(){this.white_add.add=!1},handleSizeChange:function(t){this.white_data.rows=t,this.white_data.page=1,this.get_data()},handleCurrentChange:function(t){this.white_data.page=t,this.get_data()},download:function(){window.location.href="/yiiapi/whitelist/download-ioc-template"},handlePreview:function(){},handleRemove:function(){},beforeRemove:function(){},onBeforeUpload:function(){},onChange:function(t){console.log(t),"fail"==t.status&&this.$message({message:"上传失败！",type:"error"})},onsuccess:function(t){console.log(t),1==t.status?this.$message({message:t.msg,type:"error"}):0==t.status&&(this.get_data(),this.$message({message:"上传成功！",type:"success"}))},onerror:function(t){console.log(t),"fail"==t.status&&this.$message({message:"上传失败！",type:"error"})},handleExceed:function(){},handleSelectionChange:function(t){console.log(t),this.select_list=t},del_white:function(){var t=this;if(console.log(this.select_list),0==this.select_list.length)return this.$message({message:"请选择需要删除的白名单！",type:"warning"}),!1;this.$confirm("此操作删除信息, 是否继续?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){var e=[];t.select_list.forEach(function(t){e.push(t.id)}),t.$axios.delete("/yiiapi/whitelist/del",{data:{id:e}}).then(function(e){console.log(e.data),0==e.data.status?(t.get_data(),t.$message({message:"删除成功！",type:"success"})):t.$message({message:"删除失败！",type:"error"})}).catch(function(t){console.log(t)})}).catch(function(){t.$message({type:"info",message:"已取消删除"})})}}},u={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{directives:[{name:"loading",rawName:"v-loading.fullscreen.lock",value:t.loading,expression:"loading",modifiers:{fullscreen:!0,lock:!0}}],attrs:{id:"white_list"}},[s("div",{staticClass:"btn_box"},[s("el-button",{staticClass:"btn_i",on:{click:t.open_add_box}},[t._v("添加白名单")]),t._v(" "),s("el-button",{staticClass:"btn_i",on:{click:t.download}},[t._v("下载模板")]),t._v(" "),s("el-upload",{staticClass:"upload-demo",staticStyle:{display:"inline-block"},attrs:{action:"/yiiapi/whitelist/add-import","on-preview":t.handlePreview,"on-remove":t.handleRemove,"before-remove":t.beforeRemove,"show-file-list":!1,"before-upload":t.onBeforeUpload,"on-change":t.onChange,multiple:"","auto-upload":!0,"on-success":t.onsuccess,"on-error":t.onerror,"on-exceed":t.handleExceed,"file-list":t.fileList}},[s("el-button",{staticClass:"btn_o",attrs:{type:"primary"}},[t._v("批量导入")])],1),t._v(" "),s("el-button",{staticClass:"btn_o",on:{click:t.del_white}},[t._v("删除")])],1),t._v(" "),s("div",{staticClass:"user_table"},[s("el-table",{ref:"multipleTable",staticClass:"reset_table",staticStyle:{width:"100%"},attrs:{align:"center",data:t.white_list.data,"tooltip-effect":"dark"},on:{"selection-change":t.handleSelectionChange}},[s("el-table-column",{attrs:{label:"全选",prop:"",width:"50"}}),t._v(" "),s("el-table-column",{attrs:{type:"selection",width:"50"}}),t._v(" "),s("el-table-column",{attrs:{label:"序号",width:"80"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v("\n          "+t._s((t.white_data.page-1)*t.white_data.rows+e.row.index_cn)+"\n        ")]}}])}),t._v(" "),s("el-table-column",{attrs:{prop:"indicator",label:"指标","show-overflow-tooltip":""}}),t._v(" "),s("el-table-column",{attrs:{prop:"alert_type",label:"类型","show-overflow-tooltip":""}}),t._v(" "),s("el-table-column",{attrs:{prop:"create_time",label:"创建时间","show-overflow-tooltip":""}})],1),t._v(" "),s("el-pagination",{staticClass:"pagination_box",attrs:{"current-page":t.white_list.pageNow,"page-sizes":[10,20,50,100],"page-size":10,layout:"total, sizes, prev, pager, next",total:t.white_list.count},on:{"size-change":t.handleSizeChange,"current-change":t.handleCurrentChange}})],1),t._v(" "),s("el-dialog",{staticClass:"add_box pop_box",attrs:{"close-on-click-modal":!1,"modal-append-to-body":!1,visible:t.white_add.add},on:{"update:visible":function(e){return t.$set(t.white_add,"add",e)}}},[s("img",{staticClass:"closed_img",attrs:{src:a("6an9"),alt:""},on:{click:t.closed_add_box}}),t._v(" "),s("div",{staticClass:"title"},[s("div",{staticClass:"mask"}),t._v(" "),s("span",{staticClass:"title_name"},[t._v("添加白名单")])]),t._v(" "),s("div",{staticClass:"content"},[s("div",{staticClass:"content_item"},[s("p",[s("span",{staticClass:"title"},[t._v("指标")]),t._v(" "),s("span",{staticClass:"red_necessary"},[t._v("*")])]),t._v(" "),s("el-input",{staticClass:"select_box",attrs:{placeholder:"请输入指标",clearable:""},model:{value:t.white_add.indicator,callback:function(e){t.$set(t.white_add,"indicator",e)},expression:"white_add.indicator"}})],1),t._v(" "),s("div",{staticClass:"content_item"},[s("p",[s("span",{staticClass:"title"},[t._v("类型")]),t._v(" "),s("span",{staticClass:"red_necessary"},[t._v("*")])]),t._v(" "),s("el-select",{staticClass:"select_box",attrs:{placeholder:"请选择类型"},model:{value:t.white_add.type,callback:function(e){t.$set(t.white_add,"type",e)},expression:"white_add.type"}},t._l(t.white_add.type_list,function(t){return s("el-option",{key:t,attrs:{label:t,value:t}})}),1)],1)]),t._v(" "),s("div",{staticClass:"btn_box"},[s("el-button",{staticClass:"cancel_btn",on:{click:t.closed_add_box}},[t._v("取消")]),t._v(" "),s("el-button",{staticClass:"ok_btn",on:{click:t.add_white}},[t._v("确定")])],1)])],1)},staticRenderFns:[]};var _={components:{ruleBase:n,yaraRule:r,whiteList:a("VU/8")(d,u,!1,function(t){a("R9aR"),a("SKcu")},"data-v-1a0ce1c4",null).exports},name:"system_control_rule",data:function(){return{activeName:"first",tab_show:{first:!0,second:!1,third:!1}}},methods:{handleClick:function(t,e){switch(console.log(t),t.name){case"first":this.tab_show.first=!0,this.tab_show.second=!1,this.tab_show.third=!1;break;case"second":this.tab_show.first=!1,this.tab_show.second=!0,this.tab_show.third=!1;break;case"third":this.tab_show.first=!1,this.tab_show.second=!1,this.tab_show.third=!0}}}},p={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"container",attrs:{id:"system_control_rule"}},[a("div",{staticClass:"content_box"},[a("div",{staticClass:"network_tab"},[a("el-tabs",{staticClass:"reset_tab",on:{"tab-click":t.handleClick},model:{value:t.activeName,callback:function(e){t.activeName=e},expression:"activeName"}},[a("el-tab-pane",{staticClass:"tabs-item",attrs:{label:"规则库更新",name:"first"}},[t.tab_show.first?a("rule-base"):t._e()],1),t._v(" "),a("el-tab-pane",{staticClass:"tabs-item",attrs:{label:"YARA规则",name:"second"}},[t.tab_show.second?a("yara-rule"):t._e()],1),t._v(" "),a("el-tab-pane",{staticClass:"tabs-item",attrs:{label:"白名单设置",name:"third"}},[t.tab_show.third?a("white-list"):t._e()],1)],1)],1)])])},staticRenderFns:[]};var h=a("VU/8")(_,p,!1,function(t){a("UTu/"),a("IXam")},"data-v-57f05162",null);e.default=h.exports},lcdP:function(t,e){},p0Tr:function(t,e){}});