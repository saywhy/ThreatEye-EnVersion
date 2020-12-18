webpackJsonp([25],{"J+Nb":function(e,t){},Qucx:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=a("PJh5"),n=a.n(s),o={name:"system_control_licence",data:function(){return{loading:!1,license_list:{},license_data:{page:1,rows:10},licence_pop:{add:!1,key:"",cdk:""},fileList:[],file_data:{bin:""},uploadList:[],license_version:""}},beforeCreate:function(){FileReader.prototype.reading=function(){var e=(arguments.length>0&&void 0!==arguments[0]?arguments[0]:pms).encode,t=new Uint8Array(this.result);return new TextDecoder(e||"UTF-8").decode(t)},FileReader.prototype.readAsBinaryString=function(e){var t=this;this.onload||(this.onload=function(e){var a=t.reading();console.log(a)}),this.readAsArrayBuffer(e)}},mounted:function(){this.get_data(),this.get_license(),this.get_version()},methods:{get_data:function(){var e=this;this.$axios.get("/yiiapi/license/get",{params:{page:this.license_data.page,rows:this.license_data.rows}}).then(function(t){e.license_list=t.data.data.license,e.licence_pop.key=t.data.data.key,e.license_list.list.forEach(function(e,t){e.index_cn=t+1})}).catch(function(e){console.log(e)})},get_license:function(){var e=this;this.$axios.get("/yiiapi/site/version").then(function(t){var a=t.data,s=(a.status,a.data);console.log(s),e.license_version=s.version}).catch(function(e){console.log(e)})},get_version:function(){this.$axios.get("/yiiapi/site/license-version").then(function(e){var t=e.data,a=(t.status,t.data);console.log(a)}).catch(function(e){console.log(e)})},online_active_pop:function(){this.licence_pop.add=!0},closed_add_box:function(){this.licence_pop.add=!1},online_active:function(){var e=this;if(""==this.licence_pop.cdk)return this.$message({message:"请输入序列号",type:"warning"}),!1;this.loading=!0,this.$axios.post("/yiiapi/license/online",{SN:this.licence_pop.cdk,key:this.licence_pop.key}).then(function(t){if(e.loading=!1,console.log(t),"fail"==t.data.status)switch(t.data.errorMessage){case"License does not exist":e.$message({message:"序列号校验失败，请确认您输入的序列号！",type:"error"});break;case"Key error":e.$message({message:"此序列号已被其他设备使用，请购买新的许可证！",type:"error"});break;default:e.$message({message:"序列号激活成功。",type:"success"})}else"success"==t.data.status&&(console.log(t.data.bin),e.$axios.post("/yiiapi/license/import",{bin:t.data.bin}).then(function(t){console.log(t.data),1==t.data.status?e.$message({message:t.data.msg,type:"error"}):(e.$message({message:"许可证导入成功！",type:"success"}),e.licence_pop.add=!1,e.get_data())}).catch(function(e){console.log(e)}))}).catch(function(e){console.log(e)})},uploadSectionFile:function(e){var t=this;this.readData(e.file),setTimeout(function(){t.$axios.post("/yiiapi/license/import",t.file_data).then(function(e){console.log(e),1==e.data.status?t.$message({message:e.data.msg,type:"error"}):(t.$message({message:"许可证导入成功！",type:"success"}),t.licence_pop.add=!1,t.get_data())}).catch(function(e){console.log(e)})},100)},handleSizeChange:function(e){this.license_data.rows=e,this.license_data.page=1,this.get_data()},handleCurrentChange:function(e){this.license_data.page=e,console.log(this.license_data),this.get_data()},handleSelectionChange:function(){},alert_detail:function(){},handleRemove:function(e,t){console.log(e,t)},handlePreview:function(e){console.log(e)},handleExceed:function(e,t){this.$message.warning("当前限制选择 3 个文件，本次选择了 "+e.length+" 个文件，共选择了 "+(e.length+t.length)+" 个文件")},beforeRemove:function(e,t){return this.$confirm("确定移除 "+e.name+"？")},onsuccess:function(e){console.log(e)},onBeforeUpload:function(e){console.log(this.file_data.bin)},readData:function(e){var t=this,a=e.name,s=new FileReader;s.readAsText(e),s.onload=function(e){t.file_data.bin=e.target.result,t.uploadList.push({name:a,data:e.target.result})}},onChange:function(e,t){}},filters:{formatDate:function(e){return n()(e).format("YYYY-MM-DD HH:mm:ss")}}},i={render:function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{directives:[{name:"loading",rawName:"v-loading.fullscreen.lock",value:e.loading,expression:"loading",modifiers:{fullscreen:!0,lock:!0}}],staticClass:"container",attrs:{id:"system_control_licence"}},[s("div",{staticClass:"content_box"},[s("p",{staticClass:"title"},[e._v("系统版本号：\n      "),s("span",[e._v(e._s(e.license_version))])]),e._v(" "),s("el-button",{staticClass:"btn_i",on:{click:e.online_active_pop}},[e._v("在线激活")]),e._v(" "),s("el-upload",{staticClass:"upload-demo",staticStyle:{display:"inline-block"},attrs:{"http-request":e.uploadSectionFile,action:"sdsdsdsa","on-preview":e.handlePreview,"on-remove":e.handleRemove,"before-remove":e.beforeRemove,"show-file-list":!1,"before-upload":e.onBeforeUpload,"on-change":e.onChange,data:e.file_data,multiple:"","auto-upload":!0,"on-success":e.onsuccess,"on-exceed":e.handleExceed,"file-list":e.fileList}},[s("el-button",{staticClass:"btn_o",attrs:{type:"primary"}},[e._v("导入许可证")])],1),e._v(" "),s("div",{staticClass:"licence_table"},[s("el-table",{ref:"multipleTable",staticClass:"reset_table",staticStyle:{width:"100%"},attrs:{align:"center",data:e.license_list.list,"tooltip-effect":"dark"},on:{"selection-change":e.handleSelectionChange,"row-click":e.alert_detail}},[s("el-table-column",{attrs:{prop:"index",label:"序号",width:"50","show-overflow-tooltip":""},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v("\n            "+e._s((e.license_data.page-1)*e.license_data.rows+t.row.index_cn)+"\n          ")]}}])}),e._v(" "),s("el-table-column",{attrs:{prop:"SN",width:"300",label:"序列号","show-overflow-tooltip":""}}),e._v(" "),s("el-table-column",{attrs:{prop:"product",label:"受保护机构","show-overflow-tooltip":""}}),e._v(" "),s("el-table-column",{attrs:{label:"授权时间"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(e._s(e._f("formatDate")(t.row.startTime)))]}}])}),e._v(" "),s("el-table-column",{attrs:{label:"授权到期时间"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(e._s(e._f("formatDate")(t.row.endTime)))]}}])}),e._v(" "),s("el-table-column",{attrs:{prop:"orgName",label:"威胁情报","show-overflow-tooltip":""},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v("\n            "+e._s("1"==t.row.edition?"企业版":"高级版")+"\n          ")]}}])}),e._v(" "),s("el-table-column",{attrs:{prop:"status",label:"许可证状态","show-overflow-tooltip":""}})],1),e._v(" "),s("el-pagination",{staticClass:"pagination_box",attrs:{"current-page":e.license_list.pageNow,"page-sizes":[10,20,50,100],"page-size":10,layout:"total, sizes, prev, pager, next",total:e.license_list.count},on:{"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange}})],1),e._v(" "),s("el-dialog",{staticClass:"add_box pop_box",attrs:{"close-on-click-modal":!1,"modal-append-to-body":!1,visible:e.licence_pop.add},on:{"update:visible":function(t){return e.$set(e.licence_pop,"add",t)}}},[s("img",{staticClass:"closed_img",attrs:{src:a("6an9"),alt:""},on:{click:e.closed_add_box}}),e._v(" "),s("div",{staticClass:"title"},[s("div",{staticClass:"mask"}),e._v(" "),s("span",{staticClass:"title_name"},[e._v("在线激活")])]),e._v(" "),s("div",{staticClass:"content"},[s("div",{staticClass:"content_item"},[s("p",[s("span",{staticClass:"title"},[e._v("序列号")]),e._v(" "),s("span",{staticClass:"red_necessary"},[e._v("*")])]),e._v(" "),s("el-input",{staticClass:"select_box",attrs:{placeholder:"请输入序列号",clearable:""},model:{value:e.licence_pop.cdk,callback:function(t){e.$set(e.licence_pop,"cdk",t)},expression:"licence_pop.cdk"}})],1),e._v(" "),s("div",{staticClass:"content_item"},[s("p",[s("span",{staticClass:"title"},[e._v("机器码：\n              "),s("span",[e._v(e._s(e.licence_pop.key))])])])])]),e._v(" "),s("div",{staticClass:"btn_box"},[s("el-button",{staticClass:"cancel_btn",on:{click:e.closed_add_box}},[e._v("取消")]),e._v(" "),s("el-button",{staticClass:"ok_btn",on:{click:e.online_active}},[e._v("确定")])],1)])],1)])},staticRenderFns:[]};var l=a("VU/8")(o,i,!1,function(e){a("Y2m6"),a("J+Nb")},"data-v-12e229d5",null);t.default=l.exports},Y2m6:function(e,t){}});