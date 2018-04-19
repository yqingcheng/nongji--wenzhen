 
//var app = getApp()
//var core = require("../api/core");
/*let apiPrefix = require("../api/config").apiPrefix*/
var app = getApp() 
var detailUrl="https://wx.yzyy365.com/q/liteq/"
Page({
    data:{
      pathurl:[]
    } ,
    onLoad: function( options ) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      indexDetail: options.indexDetail
    })

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
        return {

           title: '农技问答',

          desc: '云种养优质问题',

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
    }
}) 
