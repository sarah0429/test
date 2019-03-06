//index.js
const app = getApp()

Page({

  data: {
    // 服务功能栏 badge-新消息数，fun-绑定的函数
    serviceBar: [
      // 公告功能
      {
        icon: 'noticefill',
        color: 'olive',
        badge: 0,
        name: '公告',
        fun: 'clickNotice'
      },
      // 投诉功能
      {
        icon: 'recordfill',
        color: 'orange',
        badge: 0,
        name: '投诉',
        fun: 'clickComplaint'
      },
      // 建议功能
      {
        icon: 'commentfill',
        color: 'red',
        badge: 0,
        name: '建议',
        fun: 'clickSuggest'
      },
    ],
    
    gridCol: 3,
    skin: false,
    
    imgheights: [],
    current: 0,
    imgwidth: 750,
    imgUrls: [
      '/images/3.png',
      '/images/2.png',
      '/images/1.png',
    ],
  },
  imageLoad: function (e) {
    //获取图片真实宽度
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      //宽高比
      ratio = imgwidth / imgheight;
    //计算的高度值
    var viewHeight = 750 / ratio;
    var imgheight = viewHeight
    var imgheights = this.data.imgheights
    //把每一张图片的高度记录到数组里
    imgheights[e.target.dataset['index']] = imgheight;// 改了这里 赋值给当前 index
    this.setData({
      imgheights: imgheights,
    })
  },
  bindchange: function (e) {
    this.setData({
      current: e.detail.current
    })
  },

  clickNotice:function(){
    wx.reLaunch({
      url: '../community/community?TabCur=0',
    })
  },
  clickSuggest:function(){
    wx.navigateTo({
      url: '../suggestForm/suggestForm?hadConfirm=' + app.globalData.isConfirm + '&ifPass=' + app.globalData.userInfomation.ifPass,
    })
    var page = getCurrentPages().pop()
    // console.log(page)
    if(page == undefined || page == null) return;
    page.onLoad();
  },
  clickComplaint:function(){
    wx.navigateTo({
      url: '../complaintForm/complaintForm?hadConfirm=' + app.globalData.isConfirm + '&ifPass=' + app.globalData.userInfomation.ifPass,
    })
  },

  onLoad:function(){
  },

  onShareAppMessage: function () {
    return {
      title: '居福苑',
      desc: '',
      path: '/pages/index/index',
      imageUrl: '/images/programAvatar.png'
    }
  }
});