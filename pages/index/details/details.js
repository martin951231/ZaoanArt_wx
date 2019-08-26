// pages/index/details/details.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: '',
    img_id:0,
    img_info: [],
    img_label:[],
    cate_img_left: [],
    cate_img_right: [],
    page_status: true,
    cate_left: 0,
    keepname2: '',
    hiddenmodalput: true,
    cate_right: 0,
    keep_info:[],
    imgcount: 0,
    hiddenmodalput2: true,
    longtap: 'none',
    jump_details: 'jump_details',
    touch_position_x: 0,
    touch_position_y: 0,
    touch_position_x1: 0,
    touch_position_y1: 0,
    touch_position_x2: 0,
    touch_position_y2: 0,
    touch_position_x3: 0,
    touch_position_y3: 0,
    opacity: 0,
    is_to_keep: '',
    to_keep_icon_hide: 'none',
    touchlong: '',
    keep_lately_info: [],
    touchMove: '',
    touchMove2: '',
    touch_move: ''
  },
  //跳转到详情页
  jump_details: function (option) {
    var id = option.currentTarget.id
    wx.redirectTo({
      url: './details?img_id=' + id,
    })
  },
  //取消按钮
  confirm: function () {
    this.setData({
      hiddenmodalput: true
    });
  },
  //获取模态框输入信息
  keepname2(e) {
    this.setData({
      keepname2: e.detail.value
    })
  },
  //添加收藏夹
  addkeep2() {
    var token = getApp().globalData.token
    if (token){
      this.setData({
        hiddenmodalput2: false,
        hiddenmodalput: true
      });
    }else{
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 1000
      });
    }
  },
  //关闭模态框
  cancelM2: function (e) {
    this.setData({
      hiddenmodalput2: true,
    })
  },
  //模态框点确认
  confirmM2: function (e) {
    var token = getApp().globalData.token
    if (!this.data.keepname2) {
      wx.showToast({
        title: '收藏夹名不能为空',
        icon: 'none',
        duration: 1000
      });
    } else {
      this.setData({
        hiddenmodalput2: true,
      })
      wx.showLoading({
        title: '正在添加...',
      });
      var that = this
      //获取我的收藏夹
      wx.request({
        url: getApp().globalData.api_url + '/addnewkeep',
        data: { token: token, keep_name: that.data.keepname2 },
        method: 'get',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          wx.hideLoading()
          if (res.data == 1) {
            wx.showToast({
              title: '收藏夹名已存在',
              icon: 'none',
              duration: 1000
            });
          } else if (res.data == 0) {
            wx.showToast({
              title: '添加成功',
              icon: 'success',
              duration: 1000
            });
            // that.getmykeep()
          } else if (res.data == 2) {
            wx.showToast({
              title: '添加失败',
              icon: 'none',
              duration: 1000
            });
          }
        }
      })
    }
  },
  addkeep: function (event){
    var that = this
    var uid = event.target.dataset.uid;
    var kid = event.target.dataset.kid;
    var img_id = event.target.dataset.img_id;
    if (uid && kid && img_id){
      //后台添加收藏夹
      wx.request({
        url: getApp().globalData.api_url + '/addkeep',
        data: { uid: uid, kid: kid, img_id: img_id },
        method: 'get',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          if (res.data == 1) {
            wx.showToast({
              title: '该收藏夹已存在此图片',
              icon: 'none',
              duration: 1000
            });
          } else if (res.data == 0){
            that.setData({
              hiddenmodalput: true
            });
            wx.showToast({
              title: '添加成功',
              icon: 'success',
              duration: 1000
            });
          }
        }
      })
    }
  },
  //跳转到列表页
  to_list(e){
    var label_id = e.currentTarget.dataset.label_id
    wx.navigateTo({
      url: '../list/list?cate_id=0&theme_id=0&search=0&label_id='+label_id,
    })
  },
  //跳转到装裱页
  to_decoration(){
    var img_url = this.data.img_info.image
    wx.navigateTo({
      url: './decoration?img=' + img_url + '&img_id=' + this.data.img_id,
    })
  },
  //添加到收藏夹
  to_keep(e){
    var img_id = e.currentTarget.dataset.img_id
    var that = this
    var token = getApp().globalData.token
    if (!token) {
      //跳转到登录页
      wx.switchTab({
        url: '../../home/index',
      })
    } else {
      wx.navigateTo({
        url: './to_keepimg?img_id=' + img_id + '&token=' + token + '&image=' + that.data.img_info.image + '&category=' + that.data.img_info.category + '&theme=' + that.data.img_info.theme,
      })
      return false
      //后台查询收藏夹
      wx.request({
        url: getApp().globalData.api_url + '/getukeep',
        data: { token: token },
        method: 'get',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          that.setData({
            keep_info: res.data,
            hiddenmodalput: !that.data.hiddenmodalput
          });
        }
      })
    }
  },
  //点击预览图片
  enlarge:function(event){
    var src =  event.currentTarget.dataset.src;//获取data-src
    src = src+"?watermark/1/image/aHR0cDovL3d3dy56YW9hbmFydC5jb206ODAwMC9pbWFnZXMvemFvYW5hcnRfbG9nb19zaHVpeWluLnBuZw=="
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: [src]
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var img_id = options.img_id
    //获取图片详情
    this.getimg(img_id)
    //获取相似图片
    this.getlikeimage(img_id)
    var that = this 
    
  },
  //获取图片详情
  getimg(img_id){
    var that = this
    that.setData({ img_id: img_id });
    //后台查询图片详情
    wx.request({
      url: getApp().globalData.api_url + '/getimg',
      data: { id: img_id },
      method: 'get',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({ img_info: res.data });
      }
    })
    //获取图片标签
    wx.request({
      url: getApp().globalData.api_url + '/getimglabel',
      data: { id: img_id },
      method: 'get',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({ img_label: res.data });
      }
    })
  },
  //获取相似图片
  getlikeimage(img_id){
    var that = this
    //后台查询图片
    wx.request({
      url: getApp().globalData.api_url + '/getlikeimage',
      data: {
        id: img_id,
        start: 0
      },
      method: 'get',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        //设置后台查询开始的条目数
        that.setData({
          imgcount: res.data.start,
        });
        var left_height = 0
        var right_height = 0
        //循环往图片数组里添加图片
        for (var i in res.data.image) {
          //如果左边一列大就往右边一列放,反之往左边放
          if (right_height >= left_height) {
            that.data.cate_img_left.push(res.data.image[i]),
              that.setData({
                cate_img_left: that.data.cate_img_left,
              });
            left_height = left_height + res.data.image[i].img_height
          } else {
            that.data.cate_img_right.push(res.data.image[i])
            that.setData({
              cate_img_right: that.data.cate_img_right,
            });
            right_height = right_height + res.data.image[i].img_height
          }
        }
        //设置左右两列的高度
        that.setData({
          cate_left: left_height,
          cate_right: right_height,
        });
        wx.getSystemInfo({
          success: (res) => {
            that.setData({
              height: res.windowHeight
            })
          }
        })
      }
    })
  },
  //滚动到底部加载图片
  loadimg2(e){
    var page_status = this.data.page_status
    if (page_status) {
      this.setData({
        page_status: false
      })
      //获取id
      var img_id = e.currentTarget.dataset.img_id
      //获取开始的条目数
      var offset_start = e.currentTarget.dataset.offset_start
      var that = this
      //后台获取图片
      wx.request({
        url: getApp().globalData.api_url + '/getlikeimage',
        data: {
          id: img_id,
          start: offset_start
        },
        method: 'get',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          //设置开始的条目数
          that.setData({
            imgcount: res.data.start,
          });
          var left_height = that.data.cate_left;
          var right_height = that.data.cate_right;
          //循环往图片数组里追加图片
          for (var i in res.data.image) {
            //如果左边一列大就往右边一列放,反之往左边放
            if (right_height >= left_height) {
              that.data.cate_img_left.push(res.data.image[i]),
                that.setData({
                  cate_img_left: that.data.cate_img_left,
                });
              left_height = left_height + res.data.image[i].img_height
            } else {
              that.data.cate_img_right.push(res.data.image[i])
              that.setData({
                cate_img_right: that.data.cate_img_right,
              });
              right_height = right_height + res.data.image[i].img_height
            }
          }
          //设置左右两列的高度
          that.setData({
            cate_left: left_height,
            cate_right: right_height,
            page_status: true
          });
          wx.getSystemInfo({
            success: (res) => {
              that.setData({
                height: res.windowHeight
              })
            }
          })
        }
      })
    }
  },
  //长按事件
  touchstart(e) {
    var start_X = e.detail.x
    var start_Y = e.detail.y
    var img_id = e.currentTarget.id
    var that = this
    wx.getStorage({
      key: 'lately_keep',
      success: function (res) {
        console.log(res.data)
        that.setData({
          keep_lately_info: res.data
        })
      },
      fail: function (res) {
        console.log(res)
      }
    });
    this.setData({
      longtap: 'block',
      jump_details: '',
      touch_position_x: start_X - 50,
      touch_position_y: start_Y - 50,
      touch_position_x1: start_X - 35,
      touch_position_y1: start_Y - 60,
      touch_position_x2: start_X - 35,
      touch_position_y2: start_Y - 60,
      touch_position_x3: start_X - 35,
      touch_position_y3: start_Y - 60,
      is_to_keep: img_id,
      to_keep_icon_hide: 'flex',
      touchlong: "100vh",
      touchMove: 'touchMove',
      touch_move: 'touch_move',
    });
  },
  //手指移动
  touchMove(e) {
    var end_X = e.changedTouches[0].clientX
    var end_Y = e.changedTouches[0].clientY
    var start_X = this.data.touch_position_x
    var start_Y = this.data.touch_position_y
    var category = e.currentTarget.dataset.category
    var theme = e.currentTarget.dataset.theme
    var img_id = e.currentTarget.dataset.imgid
    var image = e.currentTarget.dataset.image
    if ((end_X - start_X > 5 && end_X - start_X < 100) && (end_Y - start_Y > 5 && end_Y - start_Y < 50)) {
      var token = getApp().globalData.token
      if (token) {
        this.setData({
          touch_position_x1: start_X - 105,
          touch_position_y1: start_Y + 10,
          touch_position_x2: start_X - 80,
          touch_position_y2: start_Y - 65,
          touch_position_x3: start_X - 5,
          touch_position_y3: start_Y - 95,
          opacity: 1,
        });
      }
    }
  },
  //监听手指离开屏幕
  touchEnd(e) {
    var end_X = e.changedTouches[0].clientX
    var end_Y = e.changedTouches[0].clientY
    var start_X = this.data.touch_position_x
    var start_Y = this.data.touch_position_y
    var category = e.currentTarget.dataset.category
    var theme = e.currentTarget.dataset.theme
    var img_id = e.currentTarget.dataset.imgid
    var image = e.currentTarget.dataset.image
    var current_keeps = this.data.keep_lately_info
    this.setData({
      longtap: 'none',
      jump_details: 'jump_details',
      touchMove: '',
      touch_move: '',
      is_to_keep: 0,
      to_keep_icon_hide: 'none',
      opacity: 0,
      touch_position_x1: start_X + 15,
      touch_position_y1: start_Y - 30,
      touch_position_x2: start_X + 15,
      touch_position_y2: start_Y - 30,
      touch_position_x3: start_X + 15,
      touch_position_y3: start_Y - 30,
    });
    if ((end_X - start_X > 5 && end_X - start_X < 100) && (end_Y - start_Y > 5 && end_Y - start_Y < 50)) {
      var token = getApp().globalData.token
      if (!token) {
        wx.showToast({
          title: '请先登录',
          icon: 'none',
          duration: 1000
        });
      } else {
        wx.navigateTo({
          url: './to_keepimg?img_id=' + img_id + '&category=' + category + '&theme=' + theme + '&token=' + token + '&image=' + image,
        })
        return false
      }
    } else if ((end_X - start_X < -35 && end_X - start_X > -105) && (end_Y - start_Y > 10 && end_Y - start_Y < 80)) {
      if (current_keeps && current_keeps.length >= 1) {
        var current_keep = this.data.keep_lately_info[0]
        this.add_keep(current_keep, img_id)
      }
    } else if ((end_X - start_X < -10 && end_X - start_X > -80) && (end_Y - start_Y < 5 && end_Y - start_Y > -65)) {
      if (current_keeps && current_keeps.length >= 2) {
        var current_keep = this.data.keep_lately_info[1]
        this.add_keep(current_keep, img_id)
      }
    } else if ((end_X - start_X > -5 && end_X - start_X < 65) && (end_Y - start_Y < -25 && end_Y - start_Y > -95)) {
      if (current_keeps && current_keeps.length >= 3) {
        var current_keep = this.data.keep_lately_info[2]
        this.add_keep(current_keep, img_id)
      }
    }
  },
  //长按事件
  touchstart2(e) {
    var start_X = e.detail.x
    var start_Y = e.detail.y
    var img_id = e.currentTarget.id
    var that = this
    wx.getStorage({
      key: 'lately_keep',
      success: function (res) {
        console.log(res.data)
        that.setData({
          keep_lately_info: res.data
        })
      },
      fail: function (res) {
        console.log(res)
      }
    });
    this.setData({
      longtap: 'block',
      jump_details: '',
      touch_position_x: start_X - 50,
      touch_position_y: start_Y - 50,
      touch_position_x1: start_X - 35,
      touch_position_y1: start_Y - 60,
      touch_position_x2: start_X - 35,
      touch_position_y2: start_Y - 60,
      touch_position_x3: start_X - 35,
      touch_position_y3: start_Y - 60,
      touchMove: 'true',
      touch_move: 'touch_move',
      is_to_keep: img_id,
      to_keep_icon_hide: 'flex',
      touchlong: "100vh",
      touchMove2: 'touchMove2',
    });
  },
  //手指移动
  touchMove2(e) {
    var end_X = e.changedTouches[0].clientX
    var end_Y = e.changedTouches[0].clientY
    var start_X = this.data.touch_position_x
    var start_Y = this.data.touch_position_y
    var category = e.currentTarget.dataset.category
    var theme = e.currentTarget.dataset.theme
    var img_id = e.currentTarget.dataset.imgid
    var image = e.currentTarget.dataset.image
    if ((end_X - start_X > 5 && end_X - start_X < 100) && (end_Y - start_Y > 5 && end_Y - start_Y < 50)) {
      var token = getApp().globalData.token
      if (token) {
        this.setData({
          touch_position_x1: start_X + 135,
          touch_position_y1: start_Y + 10,
          touch_position_x2: start_X + 115,
          touch_position_y2: start_Y - 65,
          touch_position_x3: start_X + 40,
          touch_position_y3: start_Y - 95,
          opacity: 1,
        });
      }
    }
  },
  //监听手指离开屏幕
  touchEnd2(e) {
    var end_X = e.changedTouches[0].clientX
    var end_Y = e.changedTouches[0].clientY
    var start_X = this.data.touch_position_x
    var start_Y = this.data.touch_position_y
    var category = e.currentTarget.dataset.category
    var theme = e.currentTarget.dataset.theme
    var img_id = e.currentTarget.dataset.imgid
    var image = e.currentTarget.dataset.image
    var current_keeps = this.data.keep_lately_info
    this.setData({
      longtap: 'none',
      jump_details: 'jump_details',
      touchMove: '',
      touch_move: '',
      is_to_keep: 0,
      to_keep_icon_hide: 'none',
      opacity: 0,
      touch_position_x1: start_X + 15,
      touch_position_y1: start_Y - 30,
      touch_position_x2: start_X + 15,
      touch_position_y2: start_Y - 30,
      touch_position_x3: start_X + 15,
      touch_position_y3: start_Y - 30,
    });
    if ((end_X - start_X > 5 && end_X - start_X < 100) && (end_Y - start_Y > 5 && end_Y - start_Y < 50)) {
      var token = getApp().globalData.token
      if (!token) {
        wx.showToast({
          title: '请先登录',
          icon: 'none',
          duration: 1000
        });
      } else {
        wx.navigateTo({
          url: './to_keepimg?img_id=' + img_id + '&category=' + category + '&theme=' + theme + '&token=' + token + '&image=' + image,
        })
        return false
      }
    } else if ((end_X - start_X > 135 && end_X - start_X < 205) && (end_Y - start_Y > 10 && end_Y - start_Y < 80)) {
      if (current_keeps && current_keeps.length >= 1) {
        var current_keep = this.data.keep_lately_info[0]
        this.add_keep(current_keep, img_id)
      }
    } else if ((end_X - start_X > 115 && end_X - start_X < 185) && (end_Y - start_Y < 5 && end_Y - start_Y > -65)) {
      if (current_keeps && current_keeps.length >= 2) {
        var current_keep = this.data.keep_lately_info[1]
        this.add_keep(current_keep, img_id)
      }
    } else if ((end_X - start_X > 40 && end_X - start_X < 110) && (end_Y - start_Y < -25 && end_Y - start_Y > -95)) {
      if (current_keeps && current_keeps.length >= 3) {
        var current_keep = this.data.keep_lately_info[2]
        this.add_keep(current_keep, img_id)
      }
    }
  },
  //快捷添加到收藏夹
  add_keep(current_keep, img_id) {
    var uid = current_keep.uid
    var keep_id = current_keep.id
    var img_id = img_id
    wx.showLoading({
      title: '正在添加...',
    });
    wx.request({
      url: getApp().globalData.api_url + '/addkeep',
      data: { uid: uid, kid: keep_id, img_id: img_id },
      method: 'get',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data == 1) {
          wx.showToast({
            title: '该收藏夹已存在此图片',
            icon: 'none',
            duration: 1000
          });
        } else if (res.data == 0) {
          wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 1000
          });
        }
      }
    })
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

  }
})