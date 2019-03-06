
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }
    this.globalData = {
      openid: null,
      isConfirm: false,
      userInfomation: '',//已验证的业主信息
      userInfo:null,//当前登录的微信信息
      avatarUrl:'',
    }

    this.onGetOpenid();
  
  },
  // 获取用户openid
  onGetOpenid: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        this.globalData.openid = res.result.openid
        this.loginConfirm()
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
 
  //查询用户是否已存在
  loginConfirm: function () {
    const db = wx.cloud.database()
    db.collection('owner').where({
      _openid: this.globalData.openid
    }).get({
      success: res => {
        if (res.data.length != 0) {
          console.log('[数据库] [查询业主表] 用户已认证: ', res);
          this.globalData.isConfirm = true;
          this.globalData.userInfomation = res.data[0]
        } else {
          console.log('[数据库] [查询业主表] 用户未认证: ', err)
        }
      },
      fail: err => {
        console.error('[数据库] [查询业主表] 失败：', err)
      }
    })
  },


})
