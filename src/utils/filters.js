//常用工具文件

/* 格式化日期 */
export function formatDate(date, fmt) {
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
        }
    }
  console.log(fmt);
  return fmt;
};

function padLeftZero(str) {
    return ('00' + str).substr(str.length);
}

/* 'yyyy/MM/dd HH:mm:ss'格式的字符串转日期 */
export function stringToDate(str){
    var tempStrs = str.split(" ");
    var dateStrs = tempStrs[0].split("/");
    var year = parseInt(dateStrs[0], 10);
    var month = parseInt(dateStrs[1], 10) - 1;
    var day = parseInt(dateStrs[2], 10);
    var timeStrs = tempStrs[1].split(":");
    var hour = parseInt(timeStrs[0], 10);
    var minute = parseInt(timeStrs[1], 10);
    var second = parseInt(timeStrs[2], 10);
    var date = new Date(year, month, day, hour, minute, second);
    return date;
}

/*
　*计算前几天的日期
　*返回格式为：yyyy/MM/dd HH:mm:ss
*/
export function GetFirstFewDays(AddDayCount) {
  console.log(AddDayCount);
  var dd = new Date();
  dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
  var CurrentDate = "";
  var year=dd.getFullYear();
  var month=dd.getMonth()+1;
  var date=dd.getDate();
  var hour=dd.getHours();
  var minute=dd.getMinutes();
  var second=dd.getSeconds();
  CurrentDate += year + "/";
  if (month >= 10 ) {
    CurrentDate += month + "/";
  } else {
    CurrentDate += "0" + month + "/";
  }
  if (date >= 10 ) {
    CurrentDate += date ;
  } else {
    CurrentDate += "0" + date ;
  }
  if (minute >= 10 ) {
    minute = minute ;
  } else {
    minute = "0" + minute ;
  }
  if (second >= 10 ) {
    second = second ;
  } else {
    second = "0" + second ;
  }
  return CurrentDate+" "+"00:00:00";
  //return CurrentDate+" "+hour+":"+minute+":"+second;
  //return CurrentDate;
}


