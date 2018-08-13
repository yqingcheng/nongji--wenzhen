
/*
* 取sessionId
* */

var getSessionId = (url, callback) => {
    wx.login({
        success:(res) => {
            wx.request({
                url: url + '/njwd/login.do',
                data: {
                    code: res.code
                },
                header: {
                    'content-type': 'application/json'
                },
                success: (res) => {
                    if (res.data.code === 100) {
                        wx.setStorageSync("sessionId", res.data.sessionKey);
                        callback();
                    } else {
                        console.log('取不到sessionkey');
                    }
                }
            });
        },
        fail: () => {
            wx.showToast({ title: '微信登录失败', icon: 'none', duration: 2000 });
        }
    });
};
/*
          * 判断后台登录状态
          * */
var checkuserStatus = (url, callback) => {
    wx.request({
        url: url + '/njwd/checkuser.do',
        data: {
            rawData: wx.getStorageSync("user").rawData,
            signature: wx.getStorageSync("user").signature
        },
        header: {
            'content-type': 'application/json',
            'Cookie': 'JSESSIONID=' + wx.getStorageSync("sessionId")
        },
        success: (res) => {
                callback(res)
        }
    });
};
/*
          * 判断绑定状态
          * */
var getBind = (url, callback) => {
    wx.request({
        url: url + '/wx/checkBindUnionid.do',
        data: {},
        header: {
            'content-type': 'application/json',
            'Cookie': 'JSESSIONID=' + wx.getStorageSync("sessionId")
        },
        success: (res) => {
            /*
             * 判断是否绑定手机号
            * */
            if (res.data.code == 100) {
                //已经绑定 登录
                callback(res);
            } else if (res.data.code == 301) {
                //未绑定
                wx.navigateTo({
                    url: "../bphone/bphone?bindId=" + res.data.data.bindId
                });
            } else if (res.data.code == 302) {
                //未保存用户
                var data = {
                    encryptedData: wx.getStorageSync("user").encryptedData,
                    iv: wx.getStorageSync("user").iv,
                    rawData: wx.getStorageSync("user").rawData
                };
                wx.request({
                    url: url + '/wxsp/decryData.do',
                    data: data,
                    header: {
                        'content-type': 'application/json',
                        'Cookie': 'JSESSIONID=' + wx.getStorageSync("sessionId")
                    },
                    success: (res) => {
                        if (res.data.code == 100) {
                            wx.navigateTo({
                                url: "../bphone/bphone?bindId=" + res.data.bindId
                            });
                        }
                    }
                });
            } else if (res.data.code == 102) {
                wx.showToast({
                    title: '账号异常',
                    icon: 'none'
                });
            }
        }
    });
};

var API = {
    getSessionId: getSessionId,
    checkuserStatus: checkuserStatus,
    getBind: getBind
};

export {
    API
}
