 var app = getApp()
//var core = require("../api/core");
/*let apiPrefix = require("../api/config").apiPrefix*/
var wetoast = require("../../utils/toast/wetoast.js"); 
var validate = require("../../utils/validate").validate;
var formatdate = require("../../utils/util").formatDate;
let imgurl = require("../api/config").imgurl
var url = app.globalData.h5url;
var timer = 0;
Page({
  data:{
    text:"",
    title:"标题",
    userInfo: {},
    scrolltop:10000,
    messages:{
      img:""
    },
    animation:{},  
    animation_2:{},
    tap:"tapOff",
    height: 500,
    msg: '',
    more: true,
    moreBox:false,
    question:{
      status:1,
      step:2
    },
    imgurl: imgurl
  },
  onLoad(options){
     //监听返回按钮
    app.data.bool = false
    console.log(app.data.bool)
    // 页面初始化 options为页面跳转所带来的参数 
    let quuid = options.quuid;
    //获取记录
    let that = this;
    this.reQueryData(quuid);
    wx.getSystemInfo({
        success: (res) => {
          that.setData({
            height: res.windowHeight
          })
        }
   });
   timer = setInterval(function(){
     if ((that.data.msg == "" || that.data.msg==null)&&
       (that.data.messages.img == null || that.data.messages.img == "")){
        that.reQueryData(quuid);
     }
   },15000);//15秒刷新一次请求
  },
  onUnload(){
      if(timer!=0){
        clearInterval(timer);
      }
  },
  onReady(){
    // 页面渲染完成 
 /*   wx.setNavigationBarTitle({
      title: this.data.title
    })*/
    this.animation = wx.createAnimation();
    this.animation_2 = wx.createAnimation();
  },
  tapscroll(e) {
    this.setData({ 
      moreBox:false
    })

    this.animation_2.height(this.data.height-50).step();
      this.setData({ animation_2: this.animation_2.export() })
      this.setData({
           tap:"tapOff"
      })

     wx.getSystemInfo({
        success: (res) => {
          this.setData({
            height: res.windowHeight
          })
        }
       })
    
  },
  elseBtn:function(){ 
    let that = this;
    this.setData({
        emotionBox: false,
        moreBox: (this.data.tap == 'tapOff')?true:false
      })

  if(this.data.tap=="tapOff"){ 
      this.animation_2.height(this.data.height-200).step();
      this.setData({ animation_2: this.animation_2.export() })
      this.setData({
           tap:"tapOn",
      })
      wx.getSystemInfo({
        success: (res) => {
          that.setData({
            height: res.windowHeight-200
          })
        }
      })
    }else{
      this.animation_2.height(this.data.height-50).step();
      this.setData({ animation_2: this.animation_2.export() })
      this.setData({
           tap:"tapOff"
      })
      wx.getSystemInfo({
        success: (res) => {
          that.setData({
            height: res.windowHeight
          })
        }
       })
    }
    console.log(this.data.tap)
  },
  chooseImg(e){
    let that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths[0];
        var t = that.data.messages;
        t.img =tempFilePaths;
        that.setData({
          messages:t
        });
        that.Btnall(e);
      }
    })
  },
  sendMessage(e) {
   //console.log(validate.isEmpty(e.detail.value))
    if (!validate.isEmpty(e.detail.value)) {
        this.setData({
              more: false
            });

    }else{
        this.setData({
              more: true
            });
        
    }
     this.setData({
      msg: e.detail.value 
    });
      
  },
  Btnall:function(e){
    //把数据插入到messages中提交到后台
    //1F04A2085651F629933F61ADE8088363BC2EAE00A702F9A3042A98288BBC1DED
    let that = this;
    let fromid = e.detail.formId;
    let img = this.data.messages.img;
    let sessionid = wx.getStorageSync("sessionId");
    let msg = this.data.msg;
    let question = this.data.question;
    let uuid = app.getStoreUserInfo().uuid;
    function callback(data){
      if(data.code==100){
        let question = that.data.question;
        let caskans = question.askAnswers;
        let askAnswers = data.data.success;
        if (caskans == "" || caskans == null) {
          caskans = [];
        }
        if (askAnswers != null && askAnswers.length != 0) {
          for (var key in askAnswers) {
            askAnswers[key].createTime = formatdate(new Date(askAnswers[key].createTime), "yyyy-MM-dd");
            caskans.push(askAnswers[key]);
          }
        }
        that.setData({
          question: question,
          moreBox: false,
          more:true,
          msg:"",
          messages:{
            img:""
          },
          scrolltop: 1000000
        });
      }else{//失败的对话
        let question = that.data.question;
        that.reQueryData(question.uuid);
      }
    };
    if (img==""){
      app.httppost(url + "/njwd/question/speak.do",{
        "uuid": "",
        "username": question.askerName,
        "content": msg,
        "qid": question.uuid,
        "formId": fromid
      },function(res){
        //let data = res.data;
        callback(res);
      });
    }else{
      wx.uploadFile({
        url: url+"/njwd/question/speak.do",
        filePath: img,
        name: 'img',
        formData:{
          "uuid": "",
          "username": question.askerName,
          "qid": question.uuid,
          "formId": fromid
        },
        header: { Cookie:'JSESSIONID=' + sessionid},
        success:function(res){//
          if(res.statusCode==200){
            let data = JSON.parse(res.data);
            callback(data);
          }
        }
      })

    }

  },
  reQueryData:function(quuid){
    let that = this;
    app.httpget(url + "/njwd/askAnswerlist.do", { quuid: quuid }, function (data) {
      let q = data.data;
      if (q != null && q != "") {
        q.createTime = formatdate(new Date(q.createTime), "yyyy-MM-dd");
        let aws = q.askAnswers;
        if (aws != null && aws.length != 0) {
          for (var key in aws) {
            aws[key].createTime = formatdate(new Date(aws[key].createTime), "yyyy-MM-dd");
          }
        }
      }
      that.setData({
        question: data.data,
        moreBox: false,
        more: true,
        msg: "",
        messages: {
          img: ""
        },
        scrolltop: 100000
      });
    });
  }
})