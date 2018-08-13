// pages/flower/flower.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
      items: [
          {name: '植物',checked: 'true'},
          {name: '动物'}
      ],
      status: '植物'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
    radioChange(e) {
        this.setData({status: e.detail.value})
    },
    /*
    * 相册选取
    * */
    album() {
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
            success: (res) => {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                let img = res.tempFilePaths[0]
                // wx.getImageInfo({
                //     src: img,
                //     success:(res) => {
                //         let width = res.width
                //         let height = res.height
                //         wx.navigateTo({url: `../png/png?img=${img}&status=${this.data.status}`})
                //     }
                // })
                if(img) {
                    wx.navigateTo({url: `../upload/upload?src=${img}&status=${this.data.status}`})
                }
            }
        })
    },
    /*
    * 拍照
    * */
    photo() {
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: (res) => {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                let img = res.tempFilePaths[0]
                if(img) {
                    wx.navigateTo({url: `../upload/upload?src=${img}&status=${this.data.status}`})
                }
            }
        })


        // wx.chooseImage({
        //     success: function(res) {
        //         var tempFilePaths = res.tempFilePaths
        //         wx.uploadFile({
        //             url: 'https://example.weixin.qq.com/upload', //仅为示例，非真实的接口地址
        //             filePath: tempFilePaths[0],
        //             name: 'file',
        //             formData:{
        //                 'user': 'test'
        //             },
        //             success: function(res){
        //                 var data = res.data
        //                 //do something
        //             }
        //         })
        //     }
        // })
    },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})