// pages/detailCom/detailCom.js
const db = wx.cloud.database({});
Page({

  /**
   * 页面的初始数据
   */
  data: {
    complaint: [],
    id: '',
    showOne: true,
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
    db.collection('complaint').get({
      success: res => {
        that.setData({
          complaint: res.data.reverse()
        })
        that.setData({
          complaint: that.data.complaint[id]
        })
        //判断只有一张图时，放大那一张图
        if (that.data.complaint.fileID.length == 1 && that.data.complaint.videoID.length == 0) {
          that.setData({
            showOne: false
          })
          console.log(that.data.showOne)
        }
        else {
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
    var current = this.data.complaint.fileID[index]
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: this.data.complaint.fileID // 需要预览的图片http链接列表
    })
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