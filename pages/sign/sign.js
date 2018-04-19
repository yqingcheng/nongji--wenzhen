//index.js
//获取应用实例
var app = getApp()
//var core = require("../api/core");
/*let apiPrefix = require("../api/config").apiPrefix*/

const ImageUploader = require('../common/image_uploader.js');
var toast = require("../../utils/toast/wetoast.js"); 
var validate = require("../../utils/validate").validate; 
var app = getApp();
var url = app.globalData.h5url;
Page({
  data: {
    pickerindex:"",
    pickerval:"点击选择您的问题类型",
    pickers:true,
    array: [],
    message:"",
    img1: ImageUploader.mergeData({
      count: 9, // 默认9
      sourceType: ['camera', 'album'], //上传图片的来源，相机/相册
      sizeType: ['compressed'],//上传前是否压缩，默认压缩
      maxCount: 9,//一次选择图片的数量

      uploadedImagesPaths: [],//保存已上传的图片路径，也可以设置初始时就显示的图片
      ImageServerPaths:[],
      uploadParams: {
        url: url+'/question/uploadAskFile.do',//后台接收上传图片的路径
        name: 'uploadFile',//后台依靠这个字段拿到文件对象
        formData: {}//这个字段可以设置传到后台的额外的参数
      }
    }),
    planId:'',
    printStatus:'1',
    params:{}
  },
  onLoad: function (options) {
    //监听返回按钮
    let that = this;
    let typeid = options.typeid;
    let plantid = options.name;
    app.data.bool = true;
    let specieqt = wx.getStorageSync("specieqt");
    let arraytmp = [];
    if(specieqt==null||specieqt==""){
      specieqt = {};
    }
    if (typeid == 1) {//种植
      arraytmp = specieqt["plant"];
    } else {//养殖
      arraytmp = specieqt["animal"];
    }
    if (arraytmp == null || arraytmp==""){
      //类别
      app.httpget(url +"/specie/questionTypes.do", { id:typeid},function(data){
        arraytmp = data.data;
        that.setData({
          array: arraytmp,
          planId: plantid
        });
        if (typeid == 1) {//种植
         specieqt["plant"] = arraytmp;
        } else {//养殖
          specieqt["animal"] = arraytmp;
        }
        wx.setStorageSync("specieqt", specieqt);
      });
    }else{
      that.setData({
        array: arraytmp,
        planId: plantid
      });
    }
    var printStatus = options.printStatus
    var self = this
   /* app.login().then(function (userInfo) {
      self.setData({ planId: planId, printStatus: printStatus })
    })    */
    new ImageUploader(this, 'img1');
  },
  toValue(e) {
    var params = this.data.params
    params.message = e.detail.value
    this.setData({
       message:e.detail.value,
       params: params }
       );
 
  },
  checkForm(e){   
    var self = this
    //var params = this.data.params  
    //var uploadedImagesPaths = this.data.img1.uploadedImagesPaths
    var pickerindex = this.data.pickerindex
    var textareaval = this.data.message
    if (pickerindex == "") { 
         toast.show({
            title: '问题类型不能为空',
            duration: 1000
          }); 
      return;
    }
     if (validate.isEmpty(textareaval)) { 
         toast.show({
            title: '文本框不能为空',
            duration: 1000
          }); 
      return;
    }
   
    //params.pickerindex = this.data.pickerindex
    //params.imgUrls = this.data.img1.uploadedImagesPaths
    wx.showLoading() 
    let imgarrs = this.data.img1.ImageServerPaths;
    let imgstr = "";
    if (imgarrs != null || imgarrs.length!=0)
      imgstr = imgarrs.join(",");
    let quetiontype = this.data.array[pickerindex].name;
    let speciename = this.data.planId;
    let user = app.getStoreUserInfo();
    let data = { uuid: user.uuid, specie: speciename, questionType: quetiontype, 
    content: textareaval, imgs: imgstr,
    formId: e.detail.formId};
    app.httppost(url +"/question/ask.do",data,function(rdata){
      wx.hideLoading();
      if(rdata.code==100){
        wx.redirectTo({
          url: "../message/message?quuid=" + rdata.data.question.uuid,
        });
      }else{
        wx.showToast({
          title: rdata.data,
          icon:"none"
        })
      }
    });
    //提交数据
  },
  
  bindPickerChange: function(e) {
   // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      pickerindex: e.detail.value,
      pickers:false
    })
  }
});
