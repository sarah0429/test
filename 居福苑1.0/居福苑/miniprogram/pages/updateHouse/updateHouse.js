// miniprogram/pages/updateHouse/updateHouse.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    houseNum: null,
    ownerId: null,

    warnText: '',
    checkHouseNum: false
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
      houseNum: app.globalData.userInfomation.community.house_Num
    })
    // console.log('houseNum: ' + that.data.houseNum)
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
   * 房号更改约束规范
   */
  checkHouseNum: function (e) {
    if (e.detail.value == '') {
      this.setData({
        warnText: '注意：房号不得为空！'
      })
    }
    else {
      if (!(/^\d{3,5}$/.test(e.detail.value))) {
        this.setData({
          warnText: '注意：您输入的房号有误！'
        })
      } else {
        this.setData({
          warnText: '',
          checkHouseNum: true,
          houseNum: e.detail.value
        })
      }
    }
  },

  /**
  * 确认保存验证
  */
  onSave(e) {
    if (this.data.checkHouseNum) {
      this.updateHouse();
    }
  },
  
  
  /**
   * 更新房号
   */
  updateHouse: function () {
    this.getOwnerId();

    var that = this
    const db = wx.cloud.database()

    console.log('修改后的房号为: ' + that.data.houseNum)

    db.collection('owner').doc(that.ownerId).update({
      data: {
        community: {
          house_Num: that.data.houseNum
        }
      },
      success: res => {
        app.globalData.userInfomation.community.house_Num = that.data.houseNum
        // console.log('更改房号到数据库成功')
        wx.showToast(
          {
            duration: 1500,
            title: '成功更改房号',
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
        console.log('更改房号到数据库失败')
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