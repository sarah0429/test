// pages/detailSug/detailSug.js
const db = wx.cloud.database({});
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    suggest: [],
    id:'',
    showOne:true,
  },
  /**
  * 建议资讯点赞
  */
  clickSuggestLike: function (e) {
    var that = this
    var index = parseInt(this.data.id)
    // console.log('当前点击的建立消息在数组中的索引：' + index)
    var isExit = that.data.suggest.scan.like.likeUsers.indexOf(app.globalData.openid)
    console.log('目前点赞数量：' + that.data.suggest.scan.like.likeNum)
    var flag = false
    var s = 'suggest.scan.like.likeNum'
    if (isExit > -1) {
      that.setData({
        [s]: that.data.suggest.scan.like.likeNum - 1
      })
      that.data.suggest.scan.like.likeUsers.splice(isExit, 1)
      //将数据同步更新到数据库
      db.collection('suggest').doc(that.data.suggest._id).update({
        data: {
          scan: {
            like: {
              likeUsers: that.data.suggest.scan.like.likeUsers,
              likeNum: that.data.suggest.scan.like.likeNum
            }
          }
        }
      })
      console.log('取消点赞后，点赞用户列表： ' + that.data.suggest.scan.like.likeUsers)
    } else {
      that.setData({
        [s]: that.data.suggest.scan.like.likeNum + 1,
      })
      that.data.suggest.scan.like.likeUsers.push(app.globalData.openid)
      //将数据同步更新到数据库
      db.collection('suggest').doc(that.data.suggest._id).update({
        data: {
          scan: {
            like: {
              likeUsers: that.data.suggest.scan.like.likeUsers,
              likeNum: that.data.suggest.scan.like.likeNum
            }
          }
        }
      })
      console.log('增加点赞后，点赞用户列表： ' + that.data.suggest.scan.like.likeUsers)
    }
    console.log("最后该建议点赞数量：" + that.data.suggest.scan.like.likeNum)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id
    this.setData({
      id: id,
    })
    const db = wx.cloud.database()
    var that = this
    db.collection('suggest').get({
      success: res => {
        that.setData({
          suggest: res.data.reverse()
        })
        that.setData({
          suggest: that.data.suggest[id]
        })
        //判断只有一张图时，放大那一张图
        if (that.data.suggest.fileID.length == 1 && that.data.suggest.videoID.length==0){
          that.setData({
            showOne:false
          })
          console.log(that.data.showOne)
        }
        else{
          that.setData({
            showOne: true
          })
        }
      },
      fail: err => {
        console.error('发生错误')
      }
    })
  },

  previewImage: function (e) {
    var index = e.currentTarget.dataset.index  //获取当前数组下标
    var current = this.data.suggest.fileID[index]
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: this.data.suggest.fileID // 需要预览的图片http链接列表
    })
  },

  onShow: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})