 
//var app = getApp()
//var core = require("../api/core");
/*let apiPrefix = require("../api/config").apiPrefix*/
var app = getApp() 
var detailUrl="https://wx.yzyy365.com/q/liteq/"
Page({
    data:{
      pathurl:[],
      btnshow:false,
      indexDetail:''
    } ,
    onLoad: function( options ) {
      console.log(app.globalData.btnscene)
     // 当小程序从 1036（App 分享消息卡片） 打开时，该状态置为 true。
     // 当小程序从 1069（App 打开小程序） 打开时，该状态置为 true。
     // 当小程序从 1089（微信聊天主界面下拉）或 1090（长按小程序右上角菜单唤出最近使用历史）的场景打开时，该状态不变，即保持上一次打开小程序时该状态的值。
      var scenenum = app.globalData.btnscene 
      if (scenenum == 1036 || scenenum == 1069 || scenenum == 1089 || scenenum == 1090) {
        this.setData({ btnshow: true })
      } else {
        this.setData({ btnshow: false })
      }




    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      indexDetail: options.indexDetail
    })
     // console.log(options.indexDetail)
   app.httpClient( detailUrl +options.indexDetail+".html", ( error, data ) => {  
         var imgurl=[]
            this.setData({question: data, loading: true})
        //  console.log(this.data.question)
           for (var i = 0;i<this.data.question.answers.length;i++) {
          
              if ( this.data.question.answers[i].content_type == 2) {
               // this.data.pathurl[i]=this.data.question.answers[i].content;
                 imgurl.push(this.data.question.answers[i].content)
             }; 
          };
         
         
           this.setData({
            ImagesPaths:imgurl
          })
         //   console.log(this.data.ImagesPaths) 
    })
    },
    onShareAppMessage: function (options) { 
      let that = this;
    //  console.log(that.data)
        return { 
           title: '农技问答', 
          desc: '云种养优质问题详情', 
          path: '/pages/index/indexDetail?indexDetail=' + that.data.indexDetail 
        }
 
      },
      /**   
     * 预览图片  
     */   
   previewImage: function(e){
    let current = e.target.dataset.src;
        wx.previewImage({
            current: current,
            urls: this.data.ImagesPaths
        });
    },  
  launchAppError: function (e) {
    console.log(e.detail.errMsg); 
      wx.showModal({
        title: '提示',
        content: '打开APP失败，请前往应用商城下载云种养App',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            // wx.hideToast()
          } else if (res.cancel) {
            console.log('用户点击取消')
            //wx.hideToast()
          }
        }
      })
     
  },
  goindex:function(){
    console.log("goindex")
    wx.switchTab({
      url: 'index'
    })
  }
}) 
