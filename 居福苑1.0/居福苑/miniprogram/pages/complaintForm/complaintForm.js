// miniprogram/pages/complaintForm/complaintForm.js
const db = wx.cloud.database()
var util = require('../util/util.js');
const app = getApp()
Page({
  data: {
    head: null,
    time: null,
    publisher: null,
    finalPublisher:null,
    complaint: null,
    complaint_object: null,
    avatar: null,
    ifHiddenName:false,

    complainTypeIndex: null,
    complaintObjectIndex: null,
    picker: ['公共卫生', '安全隐患', '其他'],
    complaintPicker: ['物业', '开发商', '业主', '其他'],

    tempFilePaths: [], //创建存放图片路径地址数组
    tempFileVideo: [], //视频路径
    fileID: [], //图片
    videoID: [], //视频
    _id: '', //记录
    count: 0,
    warnText: '',
    checkIndex: false,
    checkHead: true,
    checkBepublisher: false,
    checkComplaint: false,
  },

  //匿名
  hideName: function() {

    this.setData({
      ifHiddenName:!this.data.ifHiddenName
    })
    if(this.data.ifHiddenName){
      this.setData({
        publisher: '匿名用户',
      })
    }
    else{
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

  checkComplaint: function(e) {
    if (e.detail.value == '') {
      this.setData({
        warnText: '注意：详细情况不得为空！',
        checkComplaint: false,
      })
    } else {
      this.setData({
        warnText: '',
        checkComplaint: true,
      })
    }
  },
  onConfirm(e) {
    if (this.data.checkHead && this.data.checkComplaint && this.data.complainTypeIndex && this.data.complaintObjectIndex && this.data.count <= 6) {
      this.setData({
        warnText: ''
      })
      this.onAddOwner(e);
    } else if (!this.data.complainTypeIndex) {
      this.setData({
        warnText: '注意：类别不得为空！',
        checkIndex: false,
      })
      wx.showToast({
        title: '提交失败',
        icon: 'none',
        duration: 1500
      })
    } else if (!this.data.complaintObjectIndex) {
      this.setData({
        warnText: '注意：投诉对象不得为空！',
        checkIndex: false,
      })
      wx.showToast({
        title: '提交失败',
        icon: 'none',
        duration: 1500
      })
    } else if (this.data.count > 6) {
      this.setData({
        warnText: '注意：照片和视频总数量不能超过6'
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
    db.collection('complaint').add({
      data: {
        // head: that.head,
        info: {
          time: that.time,
          type: this.data.picker[this.data.complainTypeIndex],
          complaint_object: this.data.complaintPicker[this.data.complaintObjectIndex],
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
        complaint: that.complaint,
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
        console.log('[数据库] [新增投诉记录] 成功，记录 _id: ', res._id);
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
        console.error('[数据库] [新增投诉记录] 失败：', err)
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
        cloudPath: 'complaint/photo/' + name + '-' + time + '-' + i + '.jpg',
        filePath: they.data.tempFilePaths[i],
        success: res => {
          // 返回文件 ID
          they.setData({
            fileID: they.data.fileID.concat(res.fileID)
          })
          this.addfileID()
          console.log('图片上传成功')
        },
        fail: console.error
      })
      i++
    }
    //上传视频,上传路径和数组不同，所以和图片需分开上传
    var j = 0
    while (they.data.tempFileVideo[j] != null) {
      wx.cloud.uploadFile({
        cloudPath: 'complaint/video/' + name + '-' + time + '-' + j + '.mp4',
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
      j++
    }
  },

  typePickerChange(e) {
    this.setData({
      complainTypeIndex: e.detail.value
    })
  },

  complaintPickerChange(e) {
    this.setData({
      complaintObjectIndex: e.detail.value
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
      finalPublisher : app.globalData.userInfomation.name,
      publisher: app.globalData.userInfomation.name,
      avatar: app.globalData.userInfomation.avatar
    });
    // console.log('options.hadConfirm: ' + options.hadConfirm)
    // console.log('options.ifPass: ' + options.ifPass)
    if (options.hadConfirm == 'true' && options.ifPass == 'true') {
      return;
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
  addfileID: function() {
    console.log(this.data._id)
    console.log(this.data.fileID)
    db.collection('complaint').doc(this.data._id).update({
      data: {
        fileID: this.data.fileID,
        videoID: this.data.videoID
      },
      success(res) {
        console.log('fileID上传成功')
      }
    })
  },

})