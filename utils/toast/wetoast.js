module.exports = (function () {
    var currentPage;
    var toast = {
        __timeout: null,
        page: function () {
            if (currentPage) {
                return currentPage;
            }
            let pages = getCurrentPages(), page = pages[pages.length - 1];
            return currentPage = page;
        },
        show: function (data) {
            let page = this.page();
            clearTimeout(this.__timeout)
            //display需要先设置为block之后，才能执行动画
            page.setData({
                '__wetoast__.reveal': true
            })
            setTimeout(function () {
                let animation = wx.createAnimation()
                animation.opacity(1).step()
                data.animationData = animation.export()
                data.reveal = true
                page.setData({
                    __wetoast__: data
                })
            }, 30)
            if (data.duration === 0) {
                // success callback after toast showed
                setTimeout(function () {
                    typeof data.success === 'function' && data.success(data)
                }, 430)
            } else {
                let that = this;
                this.__timeout = setTimeout(function () {
                    that.hide()
                }, (data.duration || 1500) + 400)
            }
        }, hide: function (data) {
            let page = this.page();
            clearTimeout(this.__timeout)
            if (!page.data.__wetoast__.reveal) {
                return
            }
            let animation = wx.createAnimation()
            animation.opacity(0).step()
            page.setData({
                '__wetoast__.animationData': animation.export(),
                reveal: false
            })
            setTimeout(function () {
                page.setData({
                    "__wetoast__": {
                        reveal: false
                    }
                })
            }, 400)
        }
    }
    return toast
})();