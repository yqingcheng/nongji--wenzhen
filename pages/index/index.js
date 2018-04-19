//index.js
//获取应用实例.
//var core = require("../api/core");
let imgurl = require("../api/config").imgurl
var app = getApp() 
var APPURL="https://wx.yzyy365.com/liteapp.html"
Page({
   data: {
        page:1,
        loading:false,
        hasmore:true,
        queatdata: [],
        imgurl: imgurl
    },
    quetionDetail: function(event){
         var qid = event.currentTarget.dataset.qid;
         wx.navigateTo({
             url:"/index/indexDetail?qid="+qid,
         });
    },
    
   onLoad: function () { 
        this.getDataFromServer(this.data.page)
    },
  refresh: function () {
      //  console.log("下拉刷新....")
       // this.onLoad()
  },
  loadMore: function () {
    this.setData({page: this.data.page + 1})
    // console.log("上拉拉加载更多...." + this.data.page)
    this.getDataFromServer(this.data.page)
  },
  //获取网络数据的方法
  getDataFromServer: function (page) {
    if (this.data.loading == true || this.data.hasmore==false){
      wx.showToast({
        title: '没有更多拉拉！',
        icon: 'success',
        duration: 2000
      })
      return;
    }
    this.setData({
      loading: true,
    });
    let that_this = this;
    //调用网络请求
    app.httpClient(APPURL +"?page="+ page, (error, data) => {
      if (data.queryList != null && data.queryList.length!=0) {
        let  quetionList = data.queryList;
        let curquedata = that_this.data.queatdata;
        if (curquedata != null && curquedata.length!=0){
          for (let j = 0; j < quetionList.length; j++){
            for (let i = curquedata.length - 1; i >= curquedata.length-10&&i>=0;i--){
              if (quetionList[j].questionUUID == curquedata[i].questionUUID){
                quetionList.splice(j,j+1);
                j--;
                break;
              }
            }
          }
        }
        curquedata.push.apply(curquedata, quetionList)
        that_this.setData({ queatdata: curquedata, loading: false})
      } else {
        that_this.setData({
          loading: false,
          hasmore:false
        });
        wx.showToast({
          title: '没有更多拉拉！',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  onShareAppMessage: function () { 
      return {

        title: '农技问答',

        desc: '云种养优质问题',

        path: '/pages/index/index'

      }

    },
    gonext:function(){ 
       //wx.navigateTo({
          //url: "../bphone/bphone"
      // });
      //先判断是否登录
      wx.showLoading({
        title: '',
      })
      let user = wx.getStorageSync("user");
      app.login();
      var timer = setInterval(function () {
        user = wx.getStorageSync("user")
        if (app.globalData.logined ==true && user != "" && user.uuid != "") {
          wx.hideLoading();
          clearInterval(timer);
          wx.navigateTo({
            url: "../choice/choice"
          });
        }
      }, 500);
    },
    imageloaderr:function(e){
      console.log(e.detail);
    }
}) 
