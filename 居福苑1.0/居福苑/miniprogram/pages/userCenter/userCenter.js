// miniprogram/pages/userCenter/userCenter.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hadConfirm: false, 
    name: '',
    communityName: null,
    buildingId: null,
    roomId: null,
    tel: null,
    telError: "",
    nameError: "",

    ifPass: false,

    space:"  ",

    myselfConsole:[{
      title:'个人信息',
      key:'0',
      state: 0, //审核状态
    },{
      title:'我的提交',
      key: '1'
    },{
      title:'联系客服',
      key: '2'
    }]
  },

  clickUserInfo:function(){
    wx.navigateTo({
      url: '../userInfomation/userInfomation?hadConfirm=' + this.data.hadConfirm,
    })
  },
  clickConfirmUser: function () {
    wx.navigateTo({
      url: '../userConfirm/userConfirm',
    })
  },
  onTap: function () {
    wx.navigateTo({
      url: '../userConfirm/userConfirm',
    })
  },
  getName: function () {
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('owner').where({
      _openid: app.globalData.openid
    }).get({
      success: res => {
        // console.log(res.data[0].name);
        this.setData({
          name: res.data[0].name
        })
        this.data.name = res.data[0].name
        app.globalData.userInfomation = res.data[0]
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })

      }
    })
  },
  /**
    * 获取用户审核信息
    */
  getIfPass: function () {
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('owner').where({
      _openid: app.globalData.openid
    }).get({
      success: res => {
        // console.log(res.data[0].ifPass);
        this.setData({
          ifPass: res.data[0].ifPass
        })
        app.globalData.userInfomation.ifPass = res.data[0].ifPass
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询审核信息失败！'
        })

      }
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {   
    if (options.hadConfirm!==null && options.hadConfirm !== undefined){
      getApp().globalData.isConfirm = options.hadConfirm
      this.setData({
        hadConfirm : options.hadConfirm,
      })
  
        this.getName()

    }
    else{
      this.setData({
         hadConfirm: app.globalData.isConfirm,
        name: app.globalData.userInfomation.name
       });
    }
   
  },
  /**
  * 生命周期函数--监听页面显示
  */
  onShow: function () {

    this.getIfPass()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '幸福社区',
      desc: '为您的优质生活而服务',
      path: '/pages/userCenter/userCenter',
      imageUrl: '/images/幸福社区.png'
    } 
  },
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo;
      app.globalData.avatarUrl = e.detail.userInfo.avatarUrl;
      // console.log(e.detail.userInfo.avatarUrl)
      this.onTap()
    } else {
      wx.showModal({
        title: '授权失败',
        content: '您拒绝了授权登录',
      })
    }
  },

  // 获取用户openid
  onGetOpenid: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
})