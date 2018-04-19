/**
 * 请求代理
 */
module.exports = (function () {
  let apiPrefix = require("config").apiPrefix //, toast = require("../../utils/toast/toast.js")

  return {
    "get": function (body) {
      body.method = "GET";
      return this.request(body);
    }, "post": function (body) {
      body.method = "POST";
      body.header = {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
      return this.request(body);
    },
    "request": function (body) {
      let sessionId = wx.getStorageSync('sessionId'), header = body.header || {};
      if (sessionId) header.sessionId = sessionId;
      body.header = header || {};
      body.url = apiPrefix + body.url
      let callback = body.success, failCallback = body.fail, apiResult;
      body.success = function (resdata) {
        console.log('res:', resdata);
        apiResult = resdata.data;
        if (apiResult && apiResult.statusCode && apiResult.statusCode != 0) {
          
          if (failCallback) {
            failCallback(apiResult);
          } else if (apiResult.msg) {
            if (apiResult.msg.indexOf('未登') >= 0) {
              wx.showToast({
                title: apiResult.msg,
                duration: 5000
              })
            } else {
              wx.navigateTo({ url: '../exception/index?msg=' + apiResult.msg });
            }
          }
          return;
        }
        if (callback) {
          callback(apiResult);
        }
      }
      body.fail = (resdata) => {
        console.log('core fail response:', res)
        if (failCallback) {
          failCallback(resdata.data);
        }
      }
      wx.request(body);
    }
  }
})();