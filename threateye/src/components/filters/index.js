import Vue from 'vue'

import moment from "moment"

/*Vue.filter('time',function(date){
  date = Number(date)
  if(date.length == 10){
    date = date * 1000;
  }
  date = new Date(date);
  var YYYY = date.getFullYear() + '-';
  var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
  var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
  var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
  return YYYY + MM + DD +" "+hh + mm + ss;
});*/

Vue.filter('time', function (value) {
  if (value) {
    value = value.toString();
    if (value.length == 10) {
      value = value * 1000;
    }
    return moment(value).format('YYYY-MM-DD HH:mm:ss')
  }

});

Vue.filter('degree_sino', function (args) {
  let str = '';
  if (args == 'High') {
    str = 'High';
  } else if (args == 'Medium') {
    str = 'Medium';
  } else if (args == 'Low') {
    str = 'Low';
  }
  return str;
});

//威胁等级
Vue.filter('degree', function (args) {
  let str = '';
  if (args == 'high') {
    str = 'High';
  } else if (args == 'medium') {
    str = 'Medium';
  } else if (args == 'low') {
    str = 'Low';
  }
  return str;
});

//失陷确定性
Vue.filter('certainty', function (args) {
  args += ''
  let str = '';
  if (args == '0') {
    str = '';
  } else if (args == '1') {
    str = 'Compromised';
  }
  return str;
});

//处理状态(处置-资产维度)
Vue.filter('risk_status', function (args) {
  args += ''
  let str = '';
  if (args == '1') {
    str = 'Pending';
  } else if (args == '2') {
    str = 'In Progress';
  } else if (args == '3') {
    str = 'Resolved'
  } else if (args == '4') {
    str = 'Ignored';
  } else if (args == '5') {
    str = 'False positive';
  }
  return str;
});

//处理状态(告警)
Vue.filter('alert_status', function (args) {
  args += ''
  let str = '';
  if (args == '0') {
    str = 'New';
  } else if (args == '1') {
    str = 'Pending';
  } else if (args == '2') {
    str = 'In Progress';
  } else if (args == '3') {
    str = 'Resolved';
  } else if (args == '4') {
    str = 'Ignored';
  } else if (args == '5') {
    str = 'False positive';
  }
  return str;
});


//处理状态(处置-工单中心)
Vue.filter('work_status', function (args) {
  //console.log(args);
  args += ''
  let str = '';
  switch (args) {
    case '':
      str = 'No ticket associated';
      break;
    case '0':
      str = 'To be Assigned';
      break;
    case '1':
      str = 'Assigned';
      break;
    case '2':
      str = 'In Progress';
      break;
    case '3':
      str = 'Resolved';
      break;
    case '4':
      str = 'Cancelled';
      break;
    default:
      break;
  }
  return str;
});

//优先级
Vue.filter('priority', function (args) {
  let str = '';
  if (args == 'highest') {
    str = 'Critical';
  } else if (args == 'high') {
    str = 'High';
  } else if (args == 'medium') {
    str = 'Medium';
  } else if (args == 'low') {
    str = 'Low';
  }
  return str;
});

Vue.filter('filterType', function (args) {
  if (args == '') return;
  if (args == undefined) return;
  if (args == 0) return '0B';
  var k = 1024;
  var size = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(args) / Math.log(k));
  return (args / Math.pow(k, i)).toPrecision(3) + ' ' + size[i]
});
