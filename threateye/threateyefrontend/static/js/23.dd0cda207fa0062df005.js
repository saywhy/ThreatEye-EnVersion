webpackJsonp([23],{"1ild":function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=i("mvHQ"),a=i.n(s),o=i("PJh5"),n=i.n(o),l={name:"system_control_monitor",data:function(){return{monitor_data:{},monitor_page:{page:1,rows:10},monitor_state:{add:!1,edit:!1,import:!1,import_loading:!1},monitor_add:{name:"",ip_segment:[],ip_segment_list:[{name:"",icon:!0}],type:"static",type_list:["static","dhcp","public"],person:"",tag:[],tag_list:[{name:"",icon:!0}]},monitor_edit:{id:"",name:"",network_type:"",person:"",label_list:[],tag:[],type_list:["static","dhcp","public"],ip_segment:[],ip_segment_list:[]},select_list:[],fileList:[]}},mounted:function(){this.get_data()},methods:{isRepeat:function(t){var e={};for(var i in t){if(e[t[i]])return!0;e[t[i]]=!0}return!1},get_data:function(){var t=this;this.$axios.get("/yiiapi/ipsegment/list",{params:{page:this.monitor_page.page,rows:this.monitor_page.rows}}).then(function(e){console.log(e),t.monitor_data=e.data.data,t.monitor_data.data.forEach(function(t,e){t.index_cn=e+1})}).catch(function(t){console.log(t)})},add_box:function(){this.monitor_state.add=!0,this.monitor_add.name="",this.monitor_add.type="static",this.monitor_add.person="",this.monitor_add.tag=[],this.monitor_add.ip_segment=[],this.monitor_add.tag_list=[{name:"",icon:!0}],this.monitor_add.ip_segment_list=[{name:"",icon:!0}]},add_data:function(){var t=this;this.monitor_add.tag=[];var e=[];this.monitor_add.ip_segment=[],this.monitor_add.ip_segment=[];var i=[],s="";return this.monitor_add.ip_segment_list.forEach(function(t){""!=t.name&&e.push(t.name)}),0==e.length?(this.$message({message:"IP地址段不能为空！",type:"warning"}),!1):this.isRepeat(e)?(this.$message({message:"IP地址或地址段有重复项,请重新输入！",type:"warning"}),!1):(this.monitor_add.tag_list.forEach(function(t){""!=t.name&&i.push(t.name)}),this.isRepeat(i)?(this.$message({message:"标签有重复项,请重新输入。",type:"warning"}),!1):(s=a()(i),console.log(-1!=s.indexOf("终端")),(-1==s.indexOf("终端")||-1==s.indexOf("服务器")&&-1==s.indexOf("网络设备"))&&(-1==s.indexOf("服务器")||-1==s.indexOf("终端")&&-1==s.indexOf("网络设备"))&&(-1==s.indexOf("网络设备")||-1==s.indexOf("服务器")&&-1==s.indexOf("终端"))?(console.log([]),console.log(e),this.monitor_add.tag_list.forEach(function(e){""!=e.name&&t.monitor_add.tag.push(e.name)}),this.monitor_add.ip_segment_list.forEach(function(e){""!=e.name&&t.monitor_add.ip_segment.push(e.name)}),void this.$axios.post("/yiiapi/ipsegment/set-ip-segment",{name:this.monitor_add.name,ip_segment:this.monitor_add.ip_segment,network_type:this.monitor_add.type,person:this.monitor_add.person,label:this.monitor_add.tag}).then(function(e){console.log(e),0==e.data.status?(t.monitor_state.add=!1,t.get_data(),t.$message({message:"添加成功",type:"success"})):t.$message({message:e.data.msg,type:"error"})}).catch(function(t){console.log(t)})):(this.$message({message:"“终端”、“服务器”、“网络设备”三类标签只能设置其中的一种，请重新设置！",type:"warning"}),!1)))},add_tag:function(){this.monitor_add.tag_list.forEach(function(t){t.icon=!1}),this.monitor_add.tag_list.push({name:"",icon:!0})},del_tag:function(t,e){this.monitor_add.tag_list.splice(e,1)},add_ip:function(){this.monitor_add.ip_segment_list.forEach(function(t){t.icon=!1}),this.monitor_add.ip_segment_list.push({name:"",icon:!0})},del_ip:function(t,e){this.monitor_add.ip_segment_list.splice(e,1)},add_tag_edit:function(){this.monitor_edit.label_list.forEach(function(t){t.icon=!1}),this.monitor_edit.label_list.push({name:"",icon:!0})},del_tag_edit:function(t,e){this.monitor_edit.label_list.splice(e,1)},add_ip_edit:function(){this.monitor_edit.ip_segment_list.forEach(function(t){t.icon=!1}),this.monitor_edit.ip_segment_list.push({name:"",icon:!0})},del_ip_edit:function(t,e){this.monitor_edit.ip_segment_list.splice(e,1)},alert_detail:function(){},edit_box:function(t){var e=this;this.monitor_state.edit=!0,console.log(t);var i=a()(t),s=JSON.parse(i);this.monitor_edit.id=s.id,this.monitor_edit.name=s.name,this.monitor_edit.network_type=s.network_type,this.monitor_edit.person=s.person,this.monitor_edit.label_list=[],this.monitor_edit.tag=[],this.monitor_edit.ip_segment=[],this.monitor_edit.ip_segment_list=[],0==s.label.length?this.monitor_edit.label_list.push({name:"",icon:!0}):(s.label.forEach(function(t){e.monitor_edit.label_list.push({name:t,icon:!1})}),this.monitor_edit.label_list[this.monitor_edit.label_list.length-1].icon=!0),0==s.ip_segment.length?this.monitor_edit.ip_segment_list.push({name:"",icon:!0}):(s.ip_segment.forEach(function(t){e.monitor_edit.ip_segment_list.push({name:t,icon:!1})}),this.monitor_edit.ip_segment_list[this.monitor_edit.ip_segment_list.length-1].icon=!0)},edit_data:function(){var t=this;console.log(this.monitor_edit.ip_segment_list),console.log(this.monitor_edit.label_list);var e=[],i=[];this.monitor_edit.ip_segment=[],this.monitor_edit.tag=[];var s=[],o="";return this.monitor_edit.ip_segment_list.forEach(function(t){""!=t.name&&e.push(t.name)}),this.monitor_edit.label_list.forEach(function(t){""!=t.name&&s.push(t.name)}),o=a()(s),console.log(-1!=o.indexOf("终端")),(-1==o.indexOf("终端")||-1==o.indexOf("服务器")&&-1==o.indexOf("网络设备"))&&(-1==o.indexOf("服务器")||-1==o.indexOf("终端")&&-1==o.indexOf("网络设备"))&&(-1==o.indexOf("网络设备")||-1==o.indexOf("服务器")&&-1==o.indexOf("终端"))?(this.monitor_edit.label_list.forEach(function(t){""!=t.name&&i.push(t.name)}),this.isRepeat(e)?(this.$message({message:"IP地址或地址段有重复项,请重新输入。",type:"error"}),!1):this.isRepeat(i)?(this.$message({message:"标签有重复项,请重新输入。",type:"error"}),!1):(this.monitor_edit.ip_segment_list.forEach(function(e){""!=e.name&&t.monitor_edit.ip_segment.push(e.name)}),this.monitor_edit.label_list.forEach(function(e){""!=e.name&&t.monitor_edit.tag.push(e.name)}),void this.$axios.put("/yiiapi/ipsegment/edit-ip-segment",{id:this.monitor_edit.id,name:this.monitor_edit.name,ip_segment:this.monitor_edit.ip_segment,network_type:this.monitor_edit.network_type,person:this.monitor_edit.person,label:this.monitor_edit.tag}).then(function(e){console.log(e),0==e.data.status?(t.monitor_state.edit=!1,t.get_data(),t.$message({message:"修改成功",type:"success"})):t.$message({message:e.data.msg,type:"error"})}).catch(function(t){console.log(t)}))):(this.$message({message:"“终端”、“服务器”、“网络设备”三类标签只能设置其中的一种，请重新设置！",type:"error"}),!1)},handleSizeChange:function(t){this.monitor_page.rows=t,this.monitor_page.page=1,this.get_data()},handleCurrentChange:function(t){this.monitor_page.page=t,this.get_data()},handleSelectionChange:function(t){this.select_list=t},del_monitor:function(){var t=this;if(0==this.select_list.length)return this.$message({message:"请选择需要删除的IP/IP段！",type:"warning"}),!1;this.$confirm("此操作删除信息, 是否继续?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){var e=[];t.select_list.forEach(function(t){e.push(t.id)}),t.$axios.delete("/yiiapi/ipsegment/del",{data:{id:e}}).then(function(e){console.log(e),0==e.data.status?(t.get_data(),t.$message({message:"删除成功！",type:"success"})):t.$message({message:"删除失败！",type:"error"})}).catch(function(t){console.log(t)})}).catch(function(){t.$message({type:"info",message:"已取消删除"})})},import_box:function(){this.monitor_state.import=!0},closed_add_box:function(){this.monitor_state.add=!1},closed_edit_box:function(){this.monitor_state.edit=!1},closed_import_box:function(){this.monitor_state.import=!1},download_template:function(){window.location.href="/yiiapi/ipsegment/template-download"},onExceed:function(t,e){this.$message.warning("请选择单文件上传!"),console.log(t),console.log(e)},fileChange:function(t,e){},beforeUploadFile:function(t){console.log(t);t.name.substring(t.name.lastIndexOf(".")+1);var e=t.size/1024/1024<10;return e||this.$message.warning("上传文件大小不能超过 10MB!"),e},handleSuccess:function(t,e,i){console.log(t),1==t.status?this.$message({message:t.msg,type:"error"}):0==t.status&&(this.get_data(),this.monitor_state.import=!1,this.$message({message:"上传成功！",type:"success"}))},handleError:function(t,e,i){this.$message({message:t,type:"error"})},uploadFile:function(){this.$refs.uploadExcel.submit()},download:function(){window.location.href="/yiiapi/ipsegment/export"}},filters:{formatDate:function(t){return n()(t).format("YYYY-MM-DD HH:mm:ss")}}},c={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"container",attrs:{id:"system_control_monitor"}},[s("div",{staticClass:"content_box"},[s("div",{staticClass:"monitor_title"},[s("el-button",{staticClass:"btn_i",attrs:{type:"primary"},on:{click:t.add_box}},[t._v("新增")]),t._v(" "),s("el-button",{staticClass:"btn_i",attrs:{type:"primary"},on:{click:t.del_monitor}},[t._v("删除")]),t._v(" "),s("el-button",{staticClass:"btn_o",attrs:{type:"primary"},on:{click:t.import_box}},[t._v("导入")]),t._v(" "),s("el-button",{staticClass:"btn_o",attrs:{type:"primary"},on:{click:t.download}},[t._v("导出")])],1),t._v(" "),s("div",{staticClass:"monitor_table"},[s("el-table",{ref:"multipleTable",staticClass:"reset_table",staticStyle:{width:"100%"},attrs:{align:"center",data:t.monitor_data.data,"tooltip-effect":"dark"},on:{"selection-change":t.handleSelectionChange,"row-click":t.alert_detail}},[s("el-table-column",{attrs:{label:"全选",prop:"type",width:"50"}}),t._v(" "),s("el-table-column",{attrs:{type:"selection",width:"50"}}),t._v(" "),s("el-table-column",{attrs:{label:"序号",width:"50","show-overflow-tooltip":""},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v("\n            "+t._s((t.monitor_page.page-1)*t.monitor_page.rows+e.row.index_cn)+"\n          ")]}}])}),t._v(" "),s("el-table-column",{attrs:{prop:"name",label:"IP段名称","show-overflow-tooltip":""}}),t._v(" "),s("el-table-column",{attrs:{label:"IP地址段","show-overflow-tooltip":""},scopedSlots:t._u([{key:"default",fn:function(e){return t._l(e.row.ip_segment,function(e){return s("li",{staticClass:"btn_tag_box"},[s("p",[t._v(t._s(e))])])})}}])}),t._v(" "),s("el-table-column",{attrs:{prop:"network_type",label:"网段类型","show-overflow-tooltip":""}}),t._v(" "),s("el-table-column",{attrs:{label:"标签",width:"400"},scopedSlots:t._u([{key:"default",fn:function(e){return t._l(e.row.label,function(e){return s("span",{staticClass:"btn_tag_box"},[s("el-button",{staticClass:"btn_tag",attrs:{type:"primary"}},[t._v("\n                "+t._s(e)+"\n              ")])],1)})}}])}),t._v(" "),s("el-table-column",{attrs:{prop:"person",label:"责任人",width:"100","show-overflow-tooltip":""}}),t._v(" "),s("el-table-column",{attrs:{label:"更新时间",width:"180","show-overflow-tooltip":""},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v(t._s(t._f("formatDate")(1e3*e.row.updated_at)))]}}])}),t._v(" "),s("el-table-column",{attrs:{label:"操作"},scopedSlots:t._u([{key:"default",fn:function(e){return[s("el-button",{staticClass:"btn_edit",attrs:{type:"primary"},on:{click:function(i){return i.stopPropagation(),t.edit_box(e.row)}}},[t._v("编辑")])]}}])})],1),t._v(" "),s("el-pagination",{staticClass:"pagination_box",attrs:{"current-page":t.monitor_data.pageNow,"page-sizes":[10,20,50,100],"page-size":10,layout:"total, sizes, prev, pager, next",total:t.monitor_data.count},on:{"size-change":t.handleSizeChange,"current-change":t.handleCurrentChange}})],1),t._v(" "),s("el-dialog",{staticClass:"add_box pop_box",attrs:{"close-on-click-modal":!1,"modal-append-to-body":!1,visible:t.monitor_state.add},on:{"update:visible":function(e){return t.$set(t.monitor_state,"add",e)}}},[s("img",{staticClass:"closed_img",attrs:{src:i("6an9"),alt:""},on:{click:t.closed_add_box}}),t._v(" "),s("div",{staticClass:"title"},[s("div",{staticClass:"mask"}),t._v(" "),s("span",{staticClass:"title_name"},[t._v("新增IP段")])]),t._v(" "),s("div",{staticClass:"content"},[s("div",{staticClass:"content_item_box"},[s("div",{staticClass:"content_item"},[s("p",[s("span",{staticClass:"title"},[t._v("IP段名称")]),t._v(" "),s("span",{staticClass:"title_color"},[t._v("*")])]),t._v(" "),s("el-input",{staticClass:"select_box",attrs:{placeholder:"请输入IP段名称",clearable:""},model:{value:t.monitor_add.name,callback:function(e){t.$set(t.monitor_add,"name",e)},expression:"monitor_add.name"}})],1),t._v(" "),s("div",{staticClass:"content_item"},[s("p",[s("span",{staticClass:"title"},[t._v("网段类型")]),t._v(" "),s("span",{staticClass:"title_color"},[t._v("*")])]),t._v(" "),s("el-select",{staticClass:"select_box",attrs:{placeholder:"请选择网段类型"},model:{value:t.monitor_add.type,callback:function(e){t.$set(t.monitor_add,"type",e)},expression:"monitor_add.type"}},t._l(t.monitor_add.type_list,function(t){return s("el-option",{key:t,attrs:{label:t,value:t}})}),1)],1),t._v(" "),s("div",{staticClass:"content_item"},[s("p",[s("span",{staticClass:"title"},[t._v("标签")])]),t._v(" "),t._l(t.monitor_add.tag_list,function(e,a){return s("div",{staticClass:"item_addrs"},[s("el-input",{staticClass:"select_box",attrs:{placeholder:"请输入标签",clearable:""},model:{value:e.name,callback:function(i){t.$set(e,"name",i)},expression:"item.name"}}),t._v(" "),e.icon?s("img",{staticClass:"img_box",attrs:{src:i("uJWp"),alt:""},on:{click:t.add_tag}}):t._e(),t._v(" "),e.icon?t._e():s("img",{staticClass:"img_box",attrs:{src:i("ic23"),alt:""},on:{click:function(i){return t.del_tag(e,a)}}})],1)})],2),t._v(" "),s("div",{staticClass:"content_item"},[s("p",[s("span",{staticClass:"title"},[t._v("注: 标签属性有7个预留字段“**业务” “总部” “**分支” “**部门” “终端” “服务器” “网络设备”。")])])])]),t._v(" "),s("div",{staticClass:"content_item_space"}),t._v(" "),s("div",{staticClass:"content_item_box"},[s("div",{staticClass:"content_item"},[s("p",[s("span",{staticClass:"title"},[t._v("IP地址段")]),t._v(" "),s("span",{staticClass:"title_color"},[t._v("*")])]),t._v(" "),t._l(t.monitor_add.ip_segment_list,function(e,a){return s("div",{staticClass:"item_addrs"},[s("el-input",{staticClass:"select_box",attrs:{placeholder:"请输入IP地址段或IP地址",clearable:""},model:{value:e.name,callback:function(i){t.$set(e,"name",i)},expression:"item.name"}}),t._v(" "),e.icon?s("img",{staticClass:"img_box",attrs:{src:i("uJWp"),alt:""},on:{click:t.add_ip}}):t._e(),t._v(" "),e.icon?t._e():s("img",{staticClass:"img_box",attrs:{src:i("ic23"),alt:""},on:{click:function(i){return t.del_ip(e,a)}}})],1)})],2),t._v(" "),s("div",{staticClass:"content_item"},[s("p",[s("span",{staticClass:"title"},[t._v("责任人")])]),t._v(" "),s("el-input",{staticClass:"select_box",attrs:{placeholder:"请输入责任人",clearable:""},model:{value:t.monitor_add.person,callback:function(e){t.$set(t.monitor_add,"person",e)},expression:"monitor_add.person"}})],1)])]),t._v(" "),s("div",{staticClass:"btn_box"},[s("el-button",{staticClass:"cancel_btn",on:{click:t.closed_add_box}},[t._v("取消")]),t._v(" "),s("el-button",{staticClass:"ok_btn",on:{click:t.add_data}},[t._v("确定")])],1)]),t._v(" "),s("el-dialog",{staticClass:"add_box pop_box",attrs:{"close-on-click-modal":!1,"modal-append-to-body":!1,visible:t.monitor_state.edit},on:{"update:visible":function(e){return t.$set(t.monitor_state,"edit",e)}}},[s("img",{staticClass:"closed_img",attrs:{src:i("6an9"),alt:""},on:{click:t.closed_edit_box}}),t._v(" "),s("div",{staticClass:"title"},[s("div",{staticClass:"mask"}),t._v(" "),s("span",{staticClass:"title_name"},[t._v("编辑IP段")])]),t._v(" "),s("div",{staticClass:"content"},[s("div",{staticClass:"content_item_box"},[s("div",{staticClass:"content_item"},[s("p",[s("span",{staticClass:"title"},[t._v("IP段名称")]),t._v(" "),s("span",{staticClass:"title_color"},[t._v("*")])]),t._v(" "),s("el-input",{staticClass:"select_box",attrs:{placeholder:"请输入IP段名称",clearable:""},model:{value:t.monitor_edit.name,callback:function(e){t.$set(t.monitor_edit,"name",e)},expression:"monitor_edit.name"}})],1),t._v(" "),s("div",{staticClass:"content_item"},[s("p",[s("span",{staticClass:"title"},[t._v("网段类型")]),t._v(" "),s("span",{staticClass:"title_color"},[t._v("*")])]),t._v(" "),s("el-select",{staticClass:"select_box",attrs:{placeholder:"请选择网段类型"},model:{value:t.monitor_edit.network_type,callback:function(e){t.$set(t.monitor_edit,"network_type",e)},expression:"monitor_edit.network_type"}},t._l(t.monitor_edit.type_list,function(t){return s("el-option",{key:t,attrs:{label:t,value:t}})}),1)],1),t._v(" "),s("div",{staticClass:"content_item"},[s("p",[s("span",{staticClass:"title"},[t._v("标签")])]),t._v(" "),t._l(t.monitor_edit.label_list,function(e,a){return s("div",{staticClass:"item_addrs"},[s("el-input",{staticClass:"select_box",attrs:{placeholder:"请输入标签",clearable:""},model:{value:e.name,callback:function(i){t.$set(e,"name",i)},expression:"item.name"}}),t._v(" "),e.icon?s("img",{staticClass:"img_box",attrs:{src:i("uJWp"),alt:""},on:{click:t.add_tag_edit}}):t._e(),t._v(" "),e.icon?t._e():s("img",{staticClass:"img_box",attrs:{src:i("ic23"),alt:""},on:{click:function(i){return t.del_tag_edit(e,a)}}})],1)})],2),t._v(" "),s("div",{staticClass:"content_item"},[s("p",[s("span",{staticClass:"title"},[t._v("注: 标签属性有7个预留字段“**业务” “总部” “**分支” “**部门” “终端” “服务器” “网络设备”。")])])])]),t._v(" "),s("div",{staticClass:"content_item_space"}),t._v(" "),s("div",{staticClass:"content_item_box"},[s("div",{staticClass:"content_item"},[s("p",[s("span",{staticClass:"title"},[t._v("IP地址段")]),t._v(" "),s("span",{staticClass:"title_color"},[t._v("*")])]),t._v(" "),t._l(t.monitor_edit.ip_segment_list,function(e,a){return s("div",{staticClass:"item_addrs"},[s("el-input",{staticClass:"select_box",attrs:{placeholder:"请输入IP地址段或IP地址",clearable:""},model:{value:e.name,callback:function(i){t.$set(e,"name",i)},expression:"item.name"}}),t._v(" "),e.icon?s("img",{staticClass:"img_box",attrs:{src:i("uJWp"),alt:""},on:{click:t.add_ip_edit}}):t._e(),t._v(" "),e.icon?t._e():s("img",{staticClass:"img_box",attrs:{src:i("ic23"),alt:""},on:{click:function(i){return t.del_ip_edit(e,a)}}})],1)})],2),t._v(" "),s("div",{staticClass:"content_item"},[s("p",[s("span",{staticClass:"title"},[t._v("责任人")])]),t._v(" "),s("el-input",{staticClass:"select_box",attrs:{placeholder:"请输入责任人",clearable:""},model:{value:t.monitor_edit.person,callback:function(e){t.$set(t.monitor_edit,"person",e)},expression:"monitor_edit.person"}})],1)])]),t._v(" "),s("div",{staticClass:"btn_box"},[s("el-button",{staticClass:"cancel_btn",on:{click:t.closed_edit_box}},[t._v("取消")]),t._v(" "),s("el-button",{staticClass:"ok_btn",on:{click:t.edit_data}},[t._v("确定")])],1)]),t._v(" "),s("el-dialog",{staticClass:"import_box pop_box",attrs:{"close-on-click-modal":!1,"modal-append-to-body":!1,visible:t.monitor_state.import},on:{"update:visible":function(e){return t.$set(t.monitor_state,"import",e)}}},[s("img",{staticClass:"closed_img",attrs:{src:i("6an9"),alt:""},on:{click:t.closed_import_box}}),t._v(" "),s("div",{staticClass:"title"},[s("div",{staticClass:"mask"}),t._v(" "),s("span",{staticClass:"title_name"},[t._v("批量导入")])]),t._v(" "),s("div",{staticClass:"content"},[s("el-upload",{ref:"uploadExcel",staticClass:"upload-demo",attrs:{"auto-upload":!1,"before-upload":t.beforeUploadFile,"on-change":t.fileChange,"on-success":t.handleSuccess,"on-error":t.handleError,limit:1,"on-exceed":t.onExceed,"file-list":t.fileList,accept:".xls",drag:"",action:"/yiiapi/ipsegment/upload-excel",multiple:!1}},[s("img",{staticClass:"upload_img",attrs:{src:i("8BA2"),alt:""}}),t._v(" "),s("div",{staticClass:"el-upload__text"},[s("em",[t._v("点击上传")])])]),t._v(" "),s("div",{staticClass:"tip_box"},[s("span",[t._v("温馨提示：请选择 .xls 的文件，且文件大小不得超过10M。没有模板？")]),t._v(" "),s("span",{staticClass:"download",on:{click:t.download_template}},[t._v("点击这里下载")])])],1),t._v(" "),s("div",{staticClass:"btn_box"},[s("el-button",{staticClass:"cancel_btn",on:{click:t.closed_import_box}},[t._v("取消")]),t._v(" "),s("el-button",{staticClass:"ok_btn",on:{click:t.uploadFile}},[t._v("确定")])],1)])],1)])},staticRenderFns:[]};var _=i("VU/8")(l,c,!1,function(t){i("zpKv"),i("VwJz")},"data-v-c8fd5392",null);e.default=_.exports},VwJz:function(t,e){},zpKv:function(t,e){}});