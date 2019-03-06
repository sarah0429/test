const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    announcement: [],
    time:[],
    reContent: '',
  },

  //获取当前时间与发布时间的间隔
  getTime: function () {
    var time = util.commentTimeHandle(util.formatTime(new Date()))
    this.setData({
      time: time
    })
    console.log("time" + time)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    //  console.log(this.data.id)
    var that = this
    db.collection('announcement').get({
      success(res) {
        //  console.log(res.data),
        that.setData({
          announcement: res.data.reverse(),
          time: res.data.concat(res.tempFilePaths),  //将每个获得的地址接入tempFilePaths数组后
        })
        // 将对象数组内content赋值给reContent方便后续操作
        that.setData({
          reContent: that.data.announcement[that.data.id].content,
        })
        that.setData({   //替换为换行符
          reContent: that.data.reContent.replace(/&h;/g, '\n')
        })
        that.setData({   //替换为空格符（好像没用）
          reContent: that.data.reContent.replace(/&k/g, '\t')
        })
      }
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