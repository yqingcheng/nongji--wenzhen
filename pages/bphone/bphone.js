//index.js
//获取应用实例
var app = getApp()
//var core = require("../api/core"); 
/*let apiPrefix = require("../api/config").apiPrefix*/
var wetoast = require("../../utils/toast/wetoast.js"); 
var validate = require("../../utils/validate").validate;
let imgurl = require("../api/config").imgurl
var h5url = app.globalData.h5url;
Page({  
    data: {
      imgurl: imgurl,
      bindId:"",
      userpic:imgurl+"1.png",
      username:'我是谁',
      date:'请选择日期',
	    fun_id:2,
	    time: '获取验证码', //倒计时 
	    currentTime:60,
	    useriphone:"",
        userpassword:"",
        checked:true
    }, 
     useriphone:function(e){
            this.setData({
                useriphone: e.detail.value
            })
        },
    userpassword:function(e){
            this.setData({
                userpassword: e.detail.value
            })
        },
   onLoad: function(option) {  
     // 加载的使用进行网络访问，把需要的数据设置到data数据对象  
     this.data.bindId = option.bindId;

    }, 
  getCode: function (options){ 
    var that = this;
    var currentTime = that.data.currentTime
    var interval = setInterval(function () {
	      currentTime--;
	      that.setData({
	        time: currentTime+'秒'
	      })
	      if (currentTime <= 0) {
	        clearInterval(interval)
	        that.setData({
	          time: '重新发送',
	          currentTime:60,
	          disabled: false   
	        })
          }
    }, 1000)
    app.httppost(h5url + "/wx/sendCode2.do", { phone_no: this.data.useriphone});
  },
  getVerificationCode(){
  	if(validate.isEmpty(this.data.useriphone)){wx.showToast({title: '请输入手机号',duration: 1500});return ;}
    if(!validate.isPhoneNum(this.data.useriphone)){wx.showToast({title: '请输入正确的手机号',duration: 1500});return ;}
    this.getCode();
    var that = this
    that.setData({
      disabled:true
    })
  },
  formSubmit: function(e) {
  	if(validate.isEmpty(this.data.useriphone)){wx.showToast({title: '请输入手机号',duration: 1500});return ;}
  	if(!validate.isPhoneNum(this.data.useriphone)){wx.showToast({title: '请输入正确的手机号',duration: 1500});return ;}
  	if(validate.isEmpty(this.data.userpassword)){wx.showToast({title: '请输入验证码',duration: 1500});return ;}
  	if(!this.data.checked){wx.showToast({title: '请同意使用协议',duration: 1500});return ;}
    let data = e.detail.value;
    app.httppost(h5url +"/wxsp/wxsp_bind.do",data,function(data){
      wx.showToast({ title: '绑定成功', duration: 1000 });
      app.storeUserInfo(data.data);
      app.globalData.loigned=true;
      wx.switchTab({
        url: "/pages/index/index"
      });
    });
    //console.log('form发生了submit事件，携带数据为：', )
  },
 checkboxChange: function(e)  {
   this.setData({
      checked:this.data.checked ? false :true
    })
 console.log(this.data.checked)
 },
 goprotocol:function(){
 	 wx.navigateTo({
        url:"../protocol/protocol",
    });
 }
})  