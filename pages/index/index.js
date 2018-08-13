//index.js
//获取应用实例.
//var core = require("../api/core");
let imgurl = require("../api/config").imgurl
var app = getApp() 
var APPURL="https://wx.yzyy365.com/liteapp.html"
var API = require("../api/api")
var url = app.globalData.h5url;
Page({
   data: {
        page:1,
        loading:false,
        hasmore:true,
        queatdata: [],
        imgurl: imgurl,
        btnshow:false,
       showModal:false
    },
    quetionDetail: function(event){
         var qid = event.currentTarget.dataset.qid;
         wx.navigateTo({
             url:"/index/indexDetail?qid="+qid,
         });
    },

   onLoad: function () { 
        this.getDataFromServer(this.data.page);
       // console.log(app.globalData.btnscene)
        var scenenum = app.globalData.btnscene
       // console.log(scenenum, 2)
        if (scenenum == 1036 || scenenum == 1069){
          this.setData({ btnshow:true })
        }else{
          this.setData({ btnshow: false })
        }
      
    } ,
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
        title: '没有更多啦！',
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
          data.queryList.forEach( item => {
              item.images = item.images.map( iet => {
                  return [
                      iet.slice(0,iet.indexOf('!'))
                  ]
              })
          })
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
          title: '没有更多啦！',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
    /*
    * 已解答问题点击跳转到问题详情
    * */
    skipDetail(e) {
        let id = e.currentTarget.dataset.id
        wx.navigateTo({url: `./indexDetail?indexDetail=${id}`});
    },
  onShareAppMessage: function () { 
      return {

        title: '农技问答',

        desc: '云种养优质问题',

        path: '/pages/index/index'

      }

    },
    bindgetuserinfo(e) {
        wx.setStorageSync("user", e.detail);
        this.gonext()
    },
    comsHander() {
        API.API.checkuserStatus(url, (res) => {
            if(res.data.code === 100 && wx.getStorageSync("uuid")) {
                wx.hideLoading()
                wx.navigateTo({
                    url: `../sign/sign`
                })
            } else {
                API.API.getBind(url, (res) => {
                    wx.setStorageSync("uuid", res.data.data.uuid)
                    wx.hideLoading()
                    wx.navigateTo({
                        url: `../sign/sign`
                    })
                })
            }
        })
    },
    gonext(){
        // 先判断是否登录
        if (wx.getStorageSync("user")) {
            wx.showLoading({
                title: '加载中',
            })
            if (wx.getStorageSync("sessionId")) {
                this.comsHander()
            } else {
                API.API.getSessionId(url, () => {
                    this.comsHander()
                })
            }
        } else {
            this.setData({
                showModal : true
            })
        }
    },
    jujue() {
        this.setData({
            showModal : false
        })
    },
    launchAppError: function (e) {
      console.log(e.detail.errMsg);
      if (e.detail.errMsg == 'invalid scene'){
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
      }
    } 
}) 
