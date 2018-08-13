//index.js
//获取应用实例
var app = getApp()
//var core = require("../api/core");
/*let apiPrefix = require("../api/config").apiPrefix*/
var formatdate = require("../../utils/util").formatDate;
let imgurl = require("../api/config").imgurl;
var url = app.globalData.h5url;
Page({
    data: {
        imgurl: imgurl,
        index: 0,
        questions: [],
        havenext: true,
        active: true,
        actives: false
    },
    onLoad: function () {
        // 加载的使用进行网络访问，把需要的数据设置到data数据对象
        this.loadMore();
    },
    myProblem() {
        this.setData({
            active: true,
            actives: false
        })
        // 加载的使用进行网络访问，把需要的数据设置到data数据对象
        this.loadMore();
    },
    seProblem() {
        this.setData({
            active: false,
            actives: true
        })
    },
    onReachBottom: function () {
        //页面上拉触底事件的处理函数
        if (this.data.havenext == false) {
            wx.showToast({
                title: '没有了',
                icon: "none"
            })
        } else {
            this.loadMore();
        }
    },
    loadMore: function () {
        let that = this;
        let pageNo = this.data.index + 1;
        let user = app.getStoreUserInfo();
        if (user == null || user == "") {
            return;
        }
        app.httpget(url + "/njwd/myQuestion.do", {pageNo: pageNo, "uuid": wx.getStorageSync("uuid")}, function (data) {
            if (data.code == 100) {
                //let farmer = data.data.farmer;
                let questions = data.data.pageData;
                let qlist = questions.pageDatas
                let curqlist = that.data.questions;
                if (qlist != null) {
                    for (var i = 0; i < qlist.length; i++) {
                        qlist[i].createTime = formatdate(new Date(qlist[i].createTime), "yyyy-MM-dd");
                        curqlist.push(qlist[i]);
                    }
                }
                that.setData({
                    //userpic: farmer.headImg,
                    //username: farmer.name,
                    questions: curqlist,
                    index: questions.pageIndex,
                    havenext: questions.isHaveNextPage
                });
            }
        });
    },
})  