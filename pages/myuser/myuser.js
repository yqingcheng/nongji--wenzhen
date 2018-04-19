//index.js
//获取应用实例
var app = getApp()
//var core = require("../api/core");
let imgurl = require("../api/config").imgurl;
const ImageUploader = require('../common/image_uploader.js');
var wetoast = require("../../utils/toast/wetoast.js"); 
var validate = require("../../utils/validate").validate
var formatdate = require("../../utils/util").formatDate;
var url = app.globalData.h5url;
Page({  
    data: {  
      userpic: imgurl+"1.png",
      username:'我是谁',
      imgurl: imgurl
    },  
    onLoad: function() {  
      let that = this;
      let user = app.getStoreUserInfo();
      if (app.globalData.logined==false || user==null||user==""){
        app.login();
      }
      wx.showLoading({
        title: '加载中', 
        mask:true
      });
      let totaltimes = 0;
      let tiemr = setInterval(function(){
        if (app.globalData.userInfo!=null){
          let userinfo = app.globalData.userInfo;
          that.setData({
            userpic: userinfo.avatarUrl,
            username: userinfo.nickName
          });
          if (app.globalData.logined == true || totaltimes>50){
            clearInterval(tiemr);
            wx.hideLoading();
          }
          totaltimes++;
        }
      },200);
      // 加载的使用进行网络访问，把需要的数据设置到data数据对象 
         this.setData({ imgurl: imgurl });
       // console.log(this.data.imgurl)
    }
})  