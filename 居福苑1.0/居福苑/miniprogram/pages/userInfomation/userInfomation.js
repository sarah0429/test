// miniprogram/pages/userInformation/userInformation.js
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hadConfirm:false,
    name: null,
    communityName: null,
    buildingNum: null,
    houseNum: null,
    phoneNum: null,

    ownerId: null,

    indexCommunitys: null,
    indexBuildings: null,
    communitys: ['广州海景花园'],                                       //小区选择项
    buildings: ['A栋', 'B栋', 'C栋', 'D栋']                              //栋号选择项
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    //通过全局变量将用户信息进行填充
    that.setData({
      name: app.globalData.userInfomation.name,
      communityName: app.globalData.userInfomation.community.community_Name,
      buildingNum: app.globalData.userInfomation.community.building_Num,
      houseNum: app.globalData.userInfomation.community.house_Num,
      phoneNum: app.globalData.userInfomation.phoneNum,
      ifPass: false
    })

    //对用户小区名进行索引识别，转换选择器选择
    if (that.data.communityName == '广州海景花园') {
      that.setData({
        indexCommunitys: 0
      })
    }
    console.log('indexCommunitys: ' + that.data.indexCommunitys)                         //程序检测语句

    //对用户栋号进行索引识别，转换选择器选择
    if (that.data.buildingNum == 'A栋') {
      that.setData({
        indexBuildings: 0
      })
    }
    if (that.data.buildingNum == 'B栋') {
      that.setData({
        indexBuildings: 1
      })
    }
    if (that.data.buildingNum == 'C栋') {
      that.setData({
        indexBuildings: 2
      })
    }
    if (that.data.buildingNum == 'D栋') {
      that.setData({
        indexBuildings: 3
      })
    }
    console.log('indexBuildings: ' + that.data.indexBuildings)                         //程序检测语句
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this

    //更新用户信息
    that.setData({
      name: app.globalData.userInfomation.name,
      communityName: app.globalData.userInfomation.community.community_Name,
      buildingNum: app.globalData.userInfomation.community.building_Num,
      houseNum: app.globalData.userInfomation.community.house_Num,
      phoneNum: app.globalData.userInfomation.phoneNum
    })
  },

  /**
   * 小区名选择器函数
   */
  PickerChangeCommunityName(e) {
    console.log(e);
    this.setData({
      indexCommunitys: e.detail.value
    })

    if (this.data.indexCommunitys == 0) {
      this.setData({
        communityName: '广州海景花园'
      })
    }
    if (this.data.indexCommunitys == 1) {
      this.setData({
        communityName: '越秀.星汇文宇'
      })
    }
    if (this.data.indexCommunitys == 2) {
      this.setData({
        communityName: '越秀.星汇文华'
      })
    }
    console.log('更改后社区的名字： ' + this.data.communityName)                                                         //程序检测语句  

    //调用更新数据库方法
    this.updataCommunityName()
  },


  /**
   * 数据库更新小区名
   */
  updataCommunityName: function () {
    //获取用户owner表的唯一id
    this.getOwnerId();

    var that = this
    const db = wx.cloud.database()
    // console.log('修改后的小区名字为： ' + that.data.communityName)
    db.collection('owner').doc(that.ownerId).update({
      data: {
        community: {
          community_Name: that.data.communityName
        }
      },
      success: res => {
        app.globalData.userInfomation.community.community_Name = that.data.communityName
        // console.log('更改小区名字到数据库成功')                                                        //程序检测语句  
        wx.showToast(
          {
            duration: 1500,
            title: '成功更改小区',
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
        console.log('更改小区名字到数据失败')                                                          //程序检测语句  
      }
    })
  },

  /**
   * 房号选择器函数
   */
  PickerChangeBuildingNum(e) {
    console.log(e);
    this.setData({
      indexBuildings: e.detail.value
    })

    if (this.data.indexBuildings == 0) {
      this.setData({
        buildingNum: 'A栋'
      })
    }
    if (this.data.indexBuildings == 1) {
      this.setData({
        buildingNum: 'B栋'
      })
    }
    if (this.data.indexBuildings == 2) {
      this.setData({
        buildingNum: 'C栋'
      })
    }
    if (this.data.indexBuildings == 3) {
      this.setData({
        buildingNum: 'D栋'
      })
    }
    console.log('更改后栋号： ' + this.data.buildingNum)                                                         //程序检测语句  

    //调用更新数据库方法
    this.updateBuildingNum()
  },


  /**
   * 数据库更新栋号
   */
  updateBuildingNum: function () {

    //获取用户owner表的唯一id
    this.getOwnerId();

    var that = this
    const db = wx.cloud.database()
    console.log('修改后的栋号为： ' + that.data.buildingNum)
    db.collection('owner').doc(that.ownerId).update({
      data: {
        community: {
          building_Num: that.data.buildingNum
        }
      },
      success: res => {
        app.globalData.userInfomation.community.building_Num = that.data.buildingNum
        // console.log('更改栋号到数据库成功')                                                        //程序检测语句 
        wx.showToast(
          {
            duration: 1500,
            title: '成功更改栋号',
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
        console.log('更改栋号到数据失败')                                                          //程序检测语句  
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