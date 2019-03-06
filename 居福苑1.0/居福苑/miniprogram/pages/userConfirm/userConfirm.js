// miniprogram/pages/userComfirm/userComfirm.js
const app = getApp()
Page({

  data: {
    name: null,
    communityName: null,
    houseNum: null,
    phoneNum: null,

    ifPass: false,
    hadConfirm: false,

    warnText: '',
    checkName: false,
    checkCommunityName: false,
    checkBuildingNum: false,
    checkHouseNum: false,
    checkPhoneNum: false,

    indexCommunitys: null,
    indexBuildings: null,
    communitys: ['广州海景花园'],
    buildings: ['A栋', 'B栋', 'C栋', 'D栋']
  },
  checkName: function(e) {
    if (e.detail.value == '') {
      this.setData({
        warnText: '注意：业主姓名不得为空！',
        checkName: false,
      })
    } else {
      if (/^[\u4e00-\u9fa5]{2,6}$/.test(e.detail.value)) {
        this.setData({
          warnText: '',
          checkName: true,
        })
      } else {
        this.setData({
          warnText: '注意：您输入的姓名有误！',
          checkName: true,
        })
      }
    }
  },
  checkPhoneNum: function(e) {
    var mobile = /^[1][3,4,5,7,8][0-9]{9}$/;
    //判断是否是座机电话
    var myreg = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
    //检查
    var isMobile = mobile.exec(e.detail.value) || myreg.exec(e.detail.value);

    //输入有误的话，弹出模态框提示
    if (e.detail.value == '') {
      this.setData({
        warnText: '注意：联系电话不得为空！',
        checkPhoneNum: false,
      })
    } else {
      if (!isMobile) {
        this.setData({
          warnText: "注意：您输入的联系电话有误！"
        })

      } else {
        this.setData({
          warnText: '',
          checkPhoneNum: true,
        })
      }
    }
  },
  checkHouseNum: function(e) {
    var houseNum = /^[0-9]{3,5}$/;
    var isHouseNum = houseNum.exec(e.detail.value);

    if (e.detail.value == '') {
      this.setData({
        warnText: '注意：房号不得为空！',
        checkHouseNum: false,
      })
    } else {
      if (!isHouseNum) {
        this.setData({
          warnText: "注意：您输入的房号有误！"
        })
      } else {
        this.setData({
          warnText: '',
          checkHouseNum: true,
        })
      }
    }
  },

  onConfirm(e) {
    if (this.data.checkName && this.data.checkHouseNum && this.data.checkPhoneNum) {
      if (this.data.indexCommunitys && this.data.indexBuildings) {
        this.setData({
          warnText: ''
        })
        this.onAddOwner(e);
      } else {
        this.setData({
          warnText: '注意：“请点击选择”不得为空！',
          checkIndex: false,
        })
        wx.showToast({
          title: '提交失败',
          icon: 'none',
          duration: 1500
        })
      }
    } else {
      this.setData({
        warnText: '注意：认证信息输入有误！',
      })
      wx.showToast({
        title: '认证失败',
        icon: 'none',
        duration: 1500
      })
    }
  },
  onAddOwner: function(e) {
    const db = wx.cloud.database()
    const that = e.detail.value;
    db.collection('owner').add({
      data: {
        name: that.name,
        phoneNum: that.phoneNum,
        avatar: app.globalData.avatarUrl, 
        ifPass: false,
        community: {
          community_Name: this.data.communitys[this.data.indexCommunitys],
          building_Num: this.data.buildings[this.data.indexBuildings],
          house_Num: that.houseNum
        } 
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        wx.showToast({
          duration: 1500,
          title: '提交成功',
          icon: 'success'
        });

        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id);
        setTimeout(function() {
          wx.reLaunch({
            url: '../userCenter/userCenter?hadConfirm=true',
            success: function(e) {
              var page = getCurrentPages().pop()
              console.log(page)
              if (page == undefined || page == null) return;
              page.onLoad;
            }
          })
        }, 1500)
      },
      fail: err => {
        wx.showToast({
          title: '认证失败',
          icon: 'none',
          duration: 1500
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },
  PickerChangeCommunityName(e) {
    this.setData({
      indexCommunitys: e.detail.value
    })
  },
  PickerChangeBuildingNum(e) {
    this.setData({
      indexBuildings: e.detail.value
    })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //判断是否已认证，认证不允许再次进入该页面
    var hadConfirm = app.globalData.isConfirm;
    if (hadConfirm) {
      wx.reLaunch({
        url: '../index/index',
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})