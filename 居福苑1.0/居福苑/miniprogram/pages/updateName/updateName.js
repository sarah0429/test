// miniprogram/pages/test01/test01.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: null,
    ownerId: null,
    
    warnText: '',
    checkName: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    var that = this
    that.setData({
      name: app.globalData.userInfomation.name
    })

    // console.log('name: ' + that.data.name)
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

  },

  /**
   * 名字更改约束规范
   */
  checkName: function (e) {
    if (e.detail.value == '') {
      this.setData({
        warnText: '注意：业主姓名不得为空！',
        checkName: false,
      })
    }
    else {
      if (/^[\u4e00-\u9fa5]{2,6}$/.test(e.detail.value)) {
        this.setData({
          warnText: '',
          checkName: true,
          name: e.detail.value
        })
      }
      else {
        this.setData({
          warnText: '注意：您输入的姓名有误',
          checkName: false,
        })
      }
    }
  },

  /**
   * 确认保存验证
   */
  onSave(e) {
    if (this.data.checkName) {
      this.updateName();
    }
  },

  /**
   * 更新用户姓名
   */
  updateName: function () {
    this.getOwnerId();
    
    var that = this
    const db = wx.cloud.database()

    console.log('修改后的名字为: ' + that.data.name)                

    db.collection('owner').doc(that.ownerId).update({
      data: {
        name: that.data.name
      },
      success: res => {
        app.globalData.userInfomation.name = that.data.name
        // console.log('更改姓名到数据库成功')
        wx.showToast(
          {
            duration: 1500,
            title: '成功更改姓名',
            icon: 'success'
          });
        setTimeout(function () {
          wx.reLaunch({
            url: '../userCenter/userCenter?hadConfirm=true',
            success: function (e) {
              var page = getCurrentPages().pop()
              console.log(page)
              if (page == undefined || page == null) return;
              page.onLoad;
            }
          })
        }, 1500)
      },
      fail: res => {
        console.log('更改姓名到数据库失败')
      }
    })


  },
  
  /**
   * 根据用户的openid获取对应的owner表中的id
   */
  getOwnerId: function () {
    const db = wx.cloud.database()
    var that = this
    
    db.collection('owner').where({
      _openid: app.globalData.openid
    }).get({
      success: res => {
        // console.log(that.data.ownerId)
        that.setData({
          ownerId: res.data[0]._id
        })
      },
      fail: err => {
        console.log('获取用户owner表失败')
      }
    })
  }
})