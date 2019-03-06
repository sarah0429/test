// miniprogram/pages/updatePhone/updatePhone.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: null,
    ownerId: null,

    warnText: '',
    checkPhoneNum: false
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
      phone: app.globalData.userInfomation.phoneNum
    })
    // console.log('phone: ' + that.data.phone)
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
   * 手机号码约束规范
   */
  checkPhoneNum: function (e) {
    var mobile = /^[1][3,4,5,7,8][0-9]{9}$/;
    //判断是否是座机电话
    var myreg = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
    //检查
    var isMobile = mobile.exec(e.detail.value) || myreg.exec(e.detail.value);

    //输入有误的话，弹出模态框提示
    if (e.detail.value == '') {
      this.setData({
        warnText: '注意：手机号码不得为空！'
      })
    }
    else {
      if (!isMobile) {
        // console.log(isMobile)
        this.setData({
          warnText: "手机号码格式错误"
        })

      } else {
        // console.log(isMobile)
        this.setData({
          warnText: '',
          checkPhoneNum: true,
          phone: e.detail.value
        })
      }
    }
  },

  /**
   *确认改绑手机号码验证 
   */
  onSave(e) {
    if (this.data.checkPhoneNum) {
      this.updatePhone();
    }
  },

  /**
   * 更新用户手机号码
   */
  updatePhone: function () {
    this.getOwnerId();

    var that = this;
    const db = wx.cloud.database()

    console.log('修改后的手机号码为： ' + that.data.phone)

    db.collection('owner').doc(that.ownerId).update ({
      data: {
        phoneNum: that.data.phone
      },
      success: res => {
        app.globalData.userInfomation.phoneNum = that.data.phone
        // console.log('更改手机号码到数据库成功')
        wx.showToast(
          {
            duration: 1500,
            title: '成功更改手机号码',
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
        console.log('更改手机号码到数据失败')
      }
    })
  },

  /**
 * 根据用户的openid获取对应的owner表中的id
 */
  getOwnerId: function () {
    const db = wx.cloud.database()
    var that = this
    // 查询当前用户所有的 counters
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