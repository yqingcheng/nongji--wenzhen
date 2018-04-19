'use strict';
var app = getApp()
/**
 * 格式化时间
 * @param  {Datetime} source 时间对象
 * @param  {String} format 格式
 * @return {String}        格式化过后的时间
 */
function formatDate(source, format) {
  var o = {
    'M+': source.getMonth() + 1, // 月份
    'd+': source.getDate(), // 日
    'H+': source.getHours(), // 小时
    'm+': source.getMinutes(), // 分
    's+': source.getSeconds(), // 秒
    'q+': Math.floor((source.getMonth() + 3) / 3), // 季度
    'f+': source.getMilliseconds() // 毫秒
  };
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (source.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
    }
  }
  return format;
}

/*  
 *  
 *  格式化时间
 *  传入10位或者13位时间戳，返回格式yyyy/mm/dd hh:mm:ss
 *  @ time : number 
 *  
 */
function formatDateByTimestamp(time) {
  let _time = time
  if (typeof _time !== 'number' || _time < 0) {
    return _time
  }
  if (_time.toString().length === 10) {
    _time = parseInt(_time.toString().concat('000'))
  }

  let date = new Date(_time)

  return ([date.getFullYear(), date.getMonth() + 1, date.getDate()]).map(function (item) {
    let _item = item.toString()
    return _item[1] ? _item : '0'.concat(_item)
  }).join("/").concat(" ").concat(([date.getHours(), date.getMinutes(), date.getSeconds()]).map(function (item) {
    let _item = item.toString()
    return _item[1] ? _item : '0'.concat(_item)
  }).join(":"))
}

function mergeDeep(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
}


function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

function formatTime(time) {
  if (typeof time !== 'number' || time < 0) {
    return time
  }

  var hour = parseInt(time / 3600)
  time = time % 3600
  var minute = parseInt(time / 60)
  time = time % 60
  var second = time

  return ([hour, minute, second]).map(function (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }).join(':')
}

function formatLocation(longitude, latitude) {
  if (typeof longitude === 'string' && typeof latitude === 'string') {
    longitude = parseFloat(longitude)
    latitude = parseFloat(latitude)
  }

  longitude = longitude.toFixed(2)
  latitude = latitude.toFixed(2)

  return {
    longitude: longitude.toString().split('.'),
    latitude: latitude.toString().split('.')
  }
}



function formatTime(time) {
  const date = new Date(time)
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

return [hour, minute, second].map(formatNumber).join(':')

  //return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

 

module.exports = {
  formatDate: formatDate,
  mergeDeep: mergeDeep,
  formatTime: formatTime,
  formatLocation: formatLocation,
  formatDateByTimestamp: formatDateByTimestamp,
   formatTime: formatTime
};