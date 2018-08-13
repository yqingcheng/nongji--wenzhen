//index.js
//获取应用实例
//var app = getApp()
//var core = require("../api/core");
let imgurl = require("../api/config").imgurl;
var app = getApp();
const ImageUploader = require('../common/image_uploader.js');
var toast = require("../../utils/toast/wetoast.js");
var validate = require("../../utils/validate").validate
Page({  
    data: {
        currentItems:[],//当前显示列表
        navLeftItems: [], //种植
        navRightItems: [],  
        navLeftItems2: [],  //养殖列表
        curNav: 1,  //种植左侧导航高亮i
        curNav2: 1,  //养殖左侧导航高亮id
        selected:true,//tab切换判断
        zzid:1,//种植的id
        yzid:2,//养殖的id
        selected1: false, //tab切换判断
        curlis: 1//选中的种类
    },  
    onLoad: function() {  
      //监听返回按钮
        app.data.bool = true
        //console.log(app.data.bool)
        // 加载的使用进行网络访问，把需要的数据设置到data数据对象  
        var that = this
        let dics = wx.getStorageSync("dics");//数据
        if (dics == null || dics == "" || dics["1"] == null || dics["1"]==""){
          this.getChildSpecie(1,function(data){
            if(dics==null||dics==""){
              dics={}
            }
            dics["1"]=data.data;
            that.setData({
              currentItems:data.data,
              navLeftItems:data.data
            });
            wx.setStorageSync("dics", dics);
          })   
        }else{
          that.setData({
            currentItems: dics["1"],
            navLeftItems: dics["1"]
          });
        }

       this.setData({ imgurl: imgurl });
      //console.log(this.data.imgurl)
    },  
  
    //事件处理函数  
    switchRightTab: function(e) {  
        // 获取item项的id，和数组的下标值
        let id = e.target.dataset.id;
        let dics = wx.getStorageSync("dics");
        let rdata = dics[id];
        let that = this;
        if(rdata==null){
          this.getChildSpecie(id,function(data){
            dics[id]=data.data;
            that.setData({
              curNav: id,
              navRightItems: data.data
            })  
            wx.setStorageSync("dics", dics);
          });
        }else{
          this.setData({
            curNav: id,
            navRightItems: rdata
          })  
        }
       
    },
    //选择单个物种id
    choiceTab: function (e) {
      // 获取item项的id，和数组的下标值  
        let id = e.target.dataset.id;
        let name = e.target.dataset.name;
      // 把点击到的某一项，设为当前index  
      this.setData({
        curlis: id,
        curliname:name
      })    
    },
    //tab高亮   
  selected:function(e){
    if (this.data.navLeftItems == null || this.data.navLeftItems.length==0){
      let dics = wx.getStorageInfoSync("dics");
      let leftitems = dics["1"];
      this.setData({
        selected1: false,
        selected: true, 
        navLeftItems: leftitems,
        currentItems: leftitems,
        navRightItems:[]
      })
    }else{
      this.setData({
        selected1:false,
        selected:true,
        currentItems: this.data.navLeftItems,
        navRightItems: []
      })
    }
  },
  selected1:function(e){
      if (this.data.navLeftItems2 == null || this.data.navLeftItems2.length == 0) {
        let dics = wx.getStorageInfoSync("dics");
        let leftitems = dics["2"];
        if (leftitems == null || leftitems == "") {
          var that = this;
          this.getChildSpecie(2, function (data) {
            dics["2"] = data.data;
            that.setData({
              selected: false,
              selected1: true,
              navLeftItems2: data.data,
              currentItems: data.data,
              navRightItems: []
            });
            wx.setStorageSync("dics", dics);
          })
        }else{
          this.setData({
            selected: false,
            selected1: true,
            navLeftItems2: leftitems,
            currentItems: leftitems,
            navRightItems: []
          })
        }
      } else {
        this.setData({
          selected: false,
          selected1: true,
          currentItems: this.data.navLeftItems2,
          navRightItems: []
        })
      }
  },
  getChildSpecie:function(id,func){
    app.httpget(app.globalData.h5url+"/specie/childSpecie.do",{"id":id},function(data){
      if(func!=null&&func!=""){
        func(data);
      }else{
        let specdics = wx.getStorageSync("dics");//数据
        if (specdics == null || specdics==""){
          specdics = {};
        }
        specdics[id] = data.data;
        wx.setStorageSync("dics", specdics);
      }

    });
  },
  nextpage:function(e){
    var curlisnum=this.data.curlis
    var curliname = this.data.curliname;
    if ( curlisnum == "" || curlisnum == 1) { 
      toast.show({
            title: '请选择问题种类',
            duration: 1000
          }); 
      return;
    };
    let typeid = 1;
    if (this.data.selected1 == true) typeid=2;
      getApp().globalData.name = curliname
      getApp().globalData.typeid = typeid
    console.log(getApp().globalData, 999)
    wx.navigateBack({url: `../sign/sign`})
    // wx.navigateTo({
    //   url: '../sign/sign?name=' + curliname + "&typeid=" + typeid
    // })
  }
})  