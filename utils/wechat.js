'use strict';

var Promise = require('./bluebird');

function chooseImage(sourceType = null, sizeType = null, count = null) {
  return new Promise((resolve, reject) => {
    wx.chooseImage({sourceType: sourceType, sizeType: sizeType, count: count, success: resolve, fail: reject});
  });
}
function uploadFile(url, filePath, name, formData) {
  return new Promise((resolve, reject) => {
    let _resolve = function(res){
      resolve(JSON.parse(res.data));
    }
    let _reject = function(res){
      reject(JSON.parse(res.data));
    }
    var sessionId = wx.getStorageSync("sessionId");
    var header = { 'Cookie': 'JSESSIONID=' + sessionId }
    wx.uploadFile({ url: url, filePath: filePath, name: name, header: header, formData: formData, success: _resolve, fail: _reject});
  });
}
module.exports = {
  chooseImage: chooseImage,
  uploadFile: uploadFile,
  original: wx
};
