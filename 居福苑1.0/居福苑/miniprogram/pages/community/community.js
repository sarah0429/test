const db = wx.cloud.database({});
Page({
  data: {
    TabCur: 0,
    scrollLeft: 0,
    isCard: true,
    TabList: [{
        tab: '公告',
        info: '这是公告内容'
      },
      {
        tab: '建议',
        info: '这是建议内容'
      },
      {
        tab: '投诉',
        info: '这是投诉内容'
      }
    ],

    suggest: [],
    complaint: [],
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
  onShareAppMessage: function() {
    return {
      title: '幸福社区',
      desc: '为您的优质生活而服务',
      path: '/pages/community/community',
      imageUrl: '/images/幸福社区.png'
    }
  },
  onLoad: function(options) {
    if (options.TabCur) {
      this.setData({
        TabCur: options.TabCur
      })
    }
    this.getSuggest();
    this.getComplaint();
    this.getAnnouncement();
  },
  onShow: function() {
    this.getSuggest();
    this.getComplaint();
    this.getAnnouncement();
  },
  //获取数据库中公告内容
  getAnnouncement: function() {
    var that = this
    db.collection('announcement').get({
      success(res) {
        that.setData({
          announcement: res.data.reverse()
        })
      }
    })
  },
  //获取数据库中建议内容
  getSuggest: function() {
    const db = wx.cloud.database()
    var that = this
    db.collection('suggest').count({
      success: res => {
        var sum = res.total
        // 查询当前所有的 suggest
        if (sum > 20) {
          db.collection('suggest').skip(sum - 20).where({
            isPublish: true
          }).get({
            success: res => {
              if (res.data.length != 0) {
                that.setData({
                  suggest: res.data.reverse()
                })
                // console.log(res.data.length)
              } else {
                console.log('[数据库] [查询建议表] 为空: ', err)
              }
            },
            fail: err => {
              console.error('[数据库] [查询建议表] 失败：', err)
            }
          })
        } else {
          db.collection('suggest').where({
            isPublish: true
          }).get({
            success: res => {
              if (res.data.length != 0) {
                that.setData({
                  suggest: res.data.reverse()
                })
                // console.log(res.data.length)
              } else {
                console.log('[数据库] [查询建议表] 为空: ', err)
              }
            },
            fail: err => {
              console.error('[数据库] [查询建议表] 失败：', err)
            }
          })
        }
      }
    })
  },

  //获取数据库中投诉内容
  getComplaint: function() {
    const db = wx.cloud.database()
    var that = this
    db.collection('complaint').count({
      success: res => {
        var sum = res.total
        // 查询当前所有的 suggest
        if (sum > 20) {
          db.collection('complaint').skip(sum - 20).where({
            isPublish: true
          }).get({
            success: res => {
              if (res.data.length != 0) {
                that.setData({
                  complaint: res.data.reverse()
                })
                // console.log(res.data.length)
              } else {
                console.log('[数据库] [查询投诉表] 为空: ', err)
              }
            },
            fail: err => {
              console.error('[数据库] [查询投诉表] 失败：', err)
            }
          })
        } else {
          db.collection('complaint').where({
            isPublish: true
          }).get({
            success: res => {
              if (res.data.length != 0) {
                that.setData({
                  complaint: res.data.reverse()
                })
                // console.log(res.data.length)
              } else {
                console.log('[数据库] [查询投诉表] 为空: ', err)
              }
            },
            fail: err => {
              console.error('[数据库] [查询投诉表] 失败：', err)
            }
          })
        }
      }
    })
  },
  //公告跳转
  toAnnouncement: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/announcement/announcement?id=' + id,
    })
  },

  //预览建议相册
  previewImageSug: function(e) {
    var id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index //获取当前数组下标
    var current = this.data.suggest[id].fileID[index]
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: this.data.suggest[id].fileID // 需要预览的图片http链接列表
    })
  },

  //预览投诉相册
  previewImageCom: function(e) {
    var id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index //获取当前数组下标
    var current = this.data.complaint[id].fileID[index]
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: this.data.complaint[id].fileID // 需要预览的图片http链接列表
    })
  },
  //下拉刷新
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    var that = this
    setTimeout(function() { //模拟网络加载，强化体验
      that.onShow()
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1000)
  },

})