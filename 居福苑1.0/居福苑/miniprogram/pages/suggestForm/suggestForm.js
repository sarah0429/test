// miniprogram/pages/suggestForm/suggestForm.js
const db = wx.cloud.database()
var util = require('../util/util.js');
const app = getApp()
Page({
  data: {
    hadconfirm: null,
    head: null,
    time: null,
    publisher: null,
    finalPublisher: null,
    suggestion: null,
    avatar: null,

    index: null,
    picker: ['公共卫生', '安全隐患', '其他'],

    fileID: [],
    videoID: [],
    tempFilePaths: [], //创建存放图片路径地址数组
    tempFileVideo: [], //视频路径
    _id: '',

    count: 0,
    warnText: '',
    checkHead: true,
    checkIndex: false,
    checkSuggestion: false,
  },
  //匿名
  hideName: function () {

    this.setData({
      ifHiddenName: !this.data.ifHiddenName
    })
    if (this.data.ifHiddenName) {
      this.setData({
        publisher: '匿名用户',
      })
    }
    else {
      this.setData({
        publisher: this.data.finalPublisher,
      })
    }
  },
  //获取时间
  getTime: function() {
    var time = util.formatTime(new Date())
    this.setData({
      time: time
    })
  },
  checkHead: function(e) {
    if (e.detail.value == '') {
      this.setData({
        warnText: '注意：标题不得为空！',
        checkHead: false,
      })
    } else {
      this.setData({
        warnText: '',
        checkHead: true,
      })
    }
  },

  checkSuggestion: function(e) {
    if (e.detail.value == '') {
      this.setData({
        warnText: '注意：建议不得为空！',
        checkSuggestion: false,
      })
    } else {
      this.setData({
        warnText: '',
        checkSuggestion: true,
      })
    }
  },

  onConfirm(e) {
    if (this.data.checkHead && this.data.checkSuggestion && this.data.index && this.data.count <= 6) {
      //新加count不能超过6
      // console.log(this.data.count)
      this.setData({
        warnText: ''
      })
      this.onAddOwner(e);
    } else if (this.data.count > 6) {
      this.setData({
        warnText: '注意：附件总数不能超过6'
      })
    } else if (!this.data.index) {
      this.setData({
        warnText: '注意：类别不得为空！',
        checkIndex: false,
      })
      wx.showToast({
        title: '提交失败',
        icon: 'none',
        duration: 1500
      })
    } else {
      this.setData({
        warnText: '注意：详细情况不得为空！',
      })
      wx.showToast({
        title: '提交失败',
        icon: 'none',
        duration: 1500
      })
    }
  },
  onAddOwner: function(e) {
    const db = wx.cloud.database()
    const that = e.detail.value;
    // console.log(app.globalData.userInfo.avatarUrl)
    db.collection('suggest').add({
      data: {
        // head: that.head,
        info: {
          time: that.time,
          type: this.data.picker[this.data.index],
          publisher: that.publisher,
          avatar: app.globalData.userInfomation.avatar,
        },
        scan: {
          like: {
            likeUsers: [],
            likeNum: 0
          },
          dislike: {
            dislikeUsers: [],
            dislikeNum: 0
          },
          comment: {}
        },
        suggestion: that.suggestion,
        fileID: [],
        videoID: [],
        isPublish: false
      },

      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        wx.showToast({
          duration: 1500,
          title: '提交成功',
          icon: 'success'
        });
        console.log('[数据库] [新增建议记录] 成功，记录 _id: ', res._id);
        setTimeout(function() {
          wx.switchTab({
            url: '../index/index',
          })
        }, 1500)
        this.setData({
          _id: res._id
        })
      },
      fail: err => {
        wx.showToast({
          title: '提交失败',
          icon: 'none',
          duration: 1500
        })
        console.error('[数据库] [新增建议记录] 失败：', err)
      }
    })

    /*上传图片和视频到存储空间中*/
    //上传图片
    var they = this
    var name = this.data.publisher
    var time = this.data.time.replace("/\s*/g", "")
    time = time.replace(" ", "")
    time = time.split(/[:/]/).join('')

    // console.log(time)
    var i = 0
    while (they.data.tempFilePaths[i] != null) {
      wx.cloud.uploadFile({
        cloudPath: 'suggest/photo/' + name + '-' + time + '-' + i + '.jpg',
        filePath: they.data.tempFilePaths[i],
        success: res => {
          // 返回文件 ID
          // console.log(res.fileID)
          they.setData({
            fileID: they.data.fileID.concat(res.fileID)
          })
          this.addfileID()
          console.log('图片上传成功', they.data.fileID)
        },
        fail: console.error
      })
      i++;
    }

    var j = 0
    //上传视频,上传路径和数组不同，所以和图片需分开上传
    while (they.data.tempFileVideo[j] != null) {
      wx.cloud.uploadFile({
        cloudPath: 'suggest/video/' + name + '-' + time + '-' + j + '.mp4',
        filePath: they.data.tempFileVideo[j],
        success: res => {
          // 返回文件 ID
          console.log(res.fileID)
          console.log('视频上传成功')
          they.setData({
            videoID: they.data.videoID.concat(res.fileID)
          })
          this.addfileID()
        },
        fail: console.error
      })
      j++;
    }
  },

  PickerChange(e) {
    //  console.log(e.detail.value);
    this.setData({
      index: e.detail.value
    })
  },
  /*下面是底部上传图片或视频的逻辑 */
  //点击加号打开的底部选择栏
  mediaTap: function() {
    var that = this
    wx.showActionSheet({
      itemList: ['上传照片', '上传视频'],
      success: function(res) {
        if (res.tapIndex == 0) {
          that.photo()
        }
        if (res.tapIndex == 1) {
          that.video()
        }
      }
    })
  },

  //拍照或从相册中选择
  photo: function() {
    var that = this
    wx.chooseImage({
      success: function(res) {
        that.setData({
          tempFilePaths: that.data.tempFilePaths.concat(res.tempFilePaths), //将每个获得的地址接入tempFilePaths数组后
        })
        that.setData({
          count: that.data.tempFilePaths.length + that.data.tempFileVideo.length
        }) //获取全部上传的数量，需在设置数组长度后再获取
      },
    })
  },

  // 预览图集
  previewImage: function(e) {
    var b = e.currentTarget.dataset.index //获得下标
    wx.previewImage({
      current: this.data.tempFilePaths[b], //这个是你点击预览的图片地址
      urls: this.data.tempFilePaths //这个要全部图片的数组
    });
  },

  //上传视频
  video: function() {
    var that = this
    wx.chooseVideo({
      success: function(res) {
        if (res.duration > 60) {
          wx.showToast({
            title: '不能超过60秒!',
            icon: 'none'
          }, 1500)
        } else {
          that.setData({
            tempFileVideo: that.data.tempFileVideo.concat(res.tempFilePath), //将每个获得的地址接入tempFilePath数组后
          }) //注意这个tampFilePath末尾没有s
          that.setData({
            count: that.data.tempFilePaths.length + that.data.tempFileVideo.length //总共count小于等于6
          })
        }
      }
    })
  },
  //删除照片
  deletePhoto: function(e) {
    var index = e.currentTarget.dataset.index;
    var images = this.data.tempFilePaths;
    images.splice(index, 1); //删除数组中的index项，1为个数
    this.setData({
      tempFilePaths: images
    });
    this.setData({
      count: this.data.count - 1
    })
  },
  /*注意，执行删除视频方法会报this._isiOS is not a function
    的错误，但是不影响使用*/
  //删除视频
  deleteVideo: function(e) {
    var index = e.currentTarget.dataset.index
    var video = this.data.tempFileVideo;
    video.splice(index, 1)
    this.setData({
      tempFileVideo: video,
    })
    this.setData({
      count: this.data.count - 1
    })
  },
  onLoad: function(options) {
    this.getTime()
    this.setData({
      finalPublisher: app.globalData.userInfomation.name,
      publisher: app.globalData.userInfomation.name,
      avatar: app.globalData.userInfomation.avatar
    });
    // console.log('app.globalData.userInfomation.avatar' + app.globalData.userInfomation.avatar)
    // console.log('options.hadconfirm:' + options.hadConfirm)
    // console.log('options.ifPass: ' + options.ifPass)
    if (options.hadConfirm == 'true' && options.ifPass == 'true') {
      return
    } else if (options.hadConfirm == 'true' && options.ifPass == 'false') {
      wx.showModal({
        title: '提示',
        content: '已提交业主认证，待审核',
        showCancel: false,
        success: function(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '../index/index',
            })
          }
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请先前往业主认证',
        success: function(res) {
          if (res.confirm) {
            // console.log('用户点击确定')
            wx.redirectTo({
              url: '../userCenter/userCenter',
            })
          } else {
            // console.log('用户点击取消')
            wx.switchTab({
              url: '../index/index',
            })
          }
        }
      })
    }
  },
  //上传file与video
  addfileID: function() {
    console.log(this.data._id)
    console.log(this.data.fileID)
    db.collection('suggest').doc(this.data._id).update({
      data: {
        fileID: this.data.fileID,
        videoID: this.data.videoID
      },
      success(res) {
        console.log('fileID上传成功')
      }
    })
  },
  onUnload: function(options) {

  }
})