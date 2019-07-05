// pages/find/keepimg/keepimg.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    options:null,
    keep_id:0,
    keep_name:null,
    keepimg_info:[],
    keep_info:[],
    keep_info1:[],
    cate_img_left: [],
    cate_img_right: [],
    cate_img:[],
    cate_left: 0,
    cate_right: 0,
    imgcount: 0,
    is_mykeep:1,
    checkValue:[],
    is_manage:false,
    hiddenmodalput1: true,
    hiddenmodalput2: true,
    hiddenmodalput3:true,
    delete_arr: [],
    move_arr: [],
    copy_arr:[],
    is_checkbox_all:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var keep_id = options.keep_id
    var keep_name = options.keep_name
    var is_mykeep = options.is_mykeep
    this.setData({ keep_id: keep_id, keep_name: keep_name, is_mykeep: is_mykeep, options: options});
    this.getindex(keep_id, keep_name, is_mykeep)
    console.log(is_mykeep)
    if(is_mykeep == 2){
      wx.setNavigationBarTitle({
        title: '我的收藏夹'
      })
    }else{
      wx.setNavigationBarTitle({
        title: '推荐收藏夹'
      })
    }
  },
  //获取首屏数据
  getindex(keep_id, keep_name, is_mykeep){
    var that = this
    wx.request({
      url: getApp().globalData.api_url + '/getkeepimg',
      method: 'get',
      data: { keep_id: keep_id, start: 0 },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        //设置后台查询开始的条目数
        that.setData({
          imgcount: res.data.start,
          cate_img: res.data.image
        });
        var img = res.data.image
        that.grouping(img)
      }
    })
  },
  //滚动到底部加载数据
  loadimg3(e){
    //获取id
    var keep_id = e.currentTarget.dataset.keep_id
    //获取开始的条目数
    var offset_start = e.currentTarget.dataset.offset_start
    var that = this
    //后台获取图片
    wx.request({
      url: getApp().globalData.api_url + '/getkeepimg',
      data: {
        keep_id: keep_id,
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
        var img = res.data.image
        that.grouping(img)
      }
    })
  },
  //数据左右分组
  grouping(img){
    var that = this
    var left_height = 0
    var right_height = 0
    //循环往图片数组里添加图片
    for (var i in img) {
      //如果左边一列大就往右边一列放,反之往左边放
      if (right_height >= left_height) {
        that.data.cate_img_left.push(img[i]),
          that.setData({
            cate_img_left: that.data.cate_img_left,
          });
        left_height = left_height + img[i].img_height
      } else {
        that.data.cate_img_right.push(img[i])
        that.setData({
          cate_img_right: that.data.cate_img_right,
        });
        right_height = right_height + img[i].img_height
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
  },
  //跳转到详情页
  jump_details: function (option) {
    var id = option.currentTarget.id
    wx.navigateTo({
      url: '../../index/details/details?img_id=' + id,
    })
  },
  //批量修改
  batch_update(){
    var is_manage = !this.data.is_manage
    this.setData({
      is_manage: is_manage
    });
  },
  //是否全选
  checkbox_all(e){
    var arr_left = this.data.cate_img_left
    var arr_right = this.data.cate_img_right
    if (this.data.is_checkbox_all){
      this.data.is_checkbox_all = false
      for (var i = 0; i < arr_left.length; i++) {
        arr_left[i].checked = false
      }
      for (var i = 0; i < arr_right.length; i++) {
        arr_right[i].checked = false
      }
      this.setData({
        cate_img_left: arr_left,
        cate_img_right: arr_right,
      })
    }else{
      this.data.is_checkbox_all = true
      for (var i = 0; i < arr_left.length; i++) {
        arr_left[i].checked = true
      }
      for (var i = 0; i < arr_right.length; i++) {
        arr_right[i].checked = true
      }
      this.setData({
        cate_img_left: arr_left,
        cate_img_right: arr_right,
      })
    }
  },
  //关闭模态框
  cancelM1: function (e) {
    this.setData({
      hiddenmodalput1: true,
    })
  },
  //关闭模态框
  cancelM2: function (e) {
    this.setData({
      hiddenmodalput2: true,
    })
  },
  //关闭模态框
  cancelM3: function (e) {
    this.setData({
      hiddenmodalput3: true,
    })
  },
  //批量删除
  batch_delete(){
    var array = this.get_batch()
    if(!array){
      return false
    }
    this.setData({
      hiddenmodalput1: false,
      delete_arr: array
    })
  },
  //批量移动
  batch_move() {
    var token = getApp().globalData.token
    var array = this.get_batch()
    if (!array) {
      return false
    }
    var that = this
    //后台查询收藏夹
    wx.request({
      url: getApp().globalData.api_url + '/getukeep2',
      data: { token: token, keep_id: that.data.keep_id},
      method: 'get',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data == 1) {
          wx.showToast({
            title: '没有其他收藏夹',
            icon: 'none',
            duration: 2000
          });
        } else {
          that.setData({
            keep_info: res.data,
          });
        }
      }
    })
    that.setData({
      hiddenmodalput2: false,
      move_arr: array
    })
  },
  //批量移动
  move_to_keep(event){
    var token = getApp().globalData.token
    var to_keep_id = event.currentTarget.dataset.to_keep_id
    var keep_id = this.data.keep_id
    var move_arr = this.data.move_arr
    var arr_left = this.data.cate_img_left
    var arr_right = this.data.cate_img_right
    var that = this
    wx.showLoading({
      title: '正在移动...',
    });
    //删除图片
    wx.request({
      url: getApp().globalData.api_url + '/moveimg',
      data: { token: token, keep: keep_id, to_keep: to_keep_id, img_id: that.data.move_arr },
      method: 'get',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data == 1) {
          wx.showToast({
            title: '移动成功',
            icon: 'success',
            duration: 1000
          });
        } else {
          wx.showToast({
            title: '移动失败',
            icon: 'none',
            duration: 1000
          });
          return false
        }
        that.setData({
          cate_img_left: [],
          cate_img_right: [],
          hiddenmodalput2: true,
          move_arr: '',
        })
        var img = [];
        for (var i = 0; i < arr_left.length; i++) {
          if (arr_left[i].checked) {
          } else {
            img.push(arr_left[i])
          }
        }
        for (var i = 0; i < arr_right.length; i++) {
          if (arr_right[i].checked) {
          } else {
            img.push(arr_right[i])
          }
        }
        that.grouping(img)
      }
    })
  },
  //批量复制
  batch_copy() {
    var token = getApp().globalData.token
    var array = this.get_batch()
    if (!array) {
      return false
    }
    var that = this
    //后台查询收藏夹
    wx.request({
      url: getApp().globalData.api_url + '/getukeep2',
      data: { token: token, keep_id: that.data.keep_id },
      method: 'get',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data == 1) {
          wx.showToast({
            title: '没有其他收藏夹',
            icon: 'none',
            duration: 2000
          });
        } else {
          that.setData({
            keep_info1: res.data,
          });
        }
      }
    })
    this.setData({
      hiddenmodalput3: false,
      copy_arr: array
    })
  },
  //批量复制
  copy_to_keep(event) {
    var token = getApp().globalData.token
    var to_keep_id = event.currentTarget.dataset.to_keep_id
    var keep_id = this.data.keep_id
    var copy_arr = this.data.copy_arr
    var arr_left = this.data.cate_img_left
    var arr_right = this.data.cate_img_right
    var that = this
    wx.showLoading({
      title: '正在复制...',
    });
    //删除图片
    wx.request({
      url: getApp().globalData.api_url + '/copyimg',
      data: { token: token, keep: keep_id, to_keep: to_keep_id, img_id: that.data.copy_arr },
      method: 'get',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data == 1) {
          wx.showToast({
            title: '复制成功',
            icon: 'success',
            duration: 1000
          });
        } else {
          wx.showToast({
            title: '复制失败',
            icon: 'none',
            duration: 1000
          });
          return false
        }
        that.setData({
          hiddenmodalput3: true,
          copy_arr: '',
        })
        for (var i = 0; i < arr_left.length; i++) {
          if (arr_left[i].checked) {
            arr_left[i].checked = false
          }
        }
        for (var i = 0; i < arr_right.length; i++) {
          if (arr_right[i].checked) {
            arr_right[i].checked = false
          }
        }
        that.setData({
          cate_img_left: arr_left,
          cate_img_right: arr_right,
        })
      }
    })
  },
  //获取编辑列表
  get_batch(){
    var array_left = this.data.cate_img_left
    var array_right = this.data.cate_img_right
    var check_arr = '';
    for (var i = 0; i < array_left.length; i++) {
      if (array_left[i].checked) {
        check_arr = check_arr + ',' + array_left[i].id
        // check_arr.push(array_left[i].id)
      }
    }
    for (var i = 0; i < array_right.length; i++) {
      if (array_right[i].checked) {
        check_arr = check_arr + ',' + array_right[i].id
        // check_arr.push(array_right[i].id)
      }
    }
    if (check_arr.length>0){
      return check_arr
    }else{
      wx.showToast({
        title: '请选择图片',
        icon: 'none',
        duration: 1000
      });
      return false;
    }
  },
  //模态框点确认
  confirmM1: function (e) {
    var token = getApp().globalData.token
    var delete_arr = this.data.delete_arr
    var keep_id = e.currentTarget.dataset.keep_id
    var arr_left = this.data.cate_img_left
    var arr_right = this.data.cate_img_right
      wx.showLoading({
        title: '正在删除...',
      });
      var that = this
      //删除图片
      wx.request({
        url: getApp().globalData.api_url + '/deleteimg',
        data: { token: token, keep: keep_id, img_id: that.data.delete_arr},
        method: 'get',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          wx.hideLoading()
          if (res.data == 1) {
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 1000
            });
          } else{
            wx.showToast({
              title: '删除失败',
              icon: 'none',
              duration: 1000
            });
            return false
          }
          that.setData({
            cate_img_left: [],
            cate_img_right: [],
            hiddenmodalput1: true,
            delete_arr: '',
          })
          var img = [];
          for (var i = 0; i < arr_left.length;i++){
            if (arr_left[i].checked) {
            }else{
              img.push(arr_left[i])
            }
          }
          for (var i = 0; i < arr_right.length; i++) {
            if (arr_right[i].checked) {
            } else {
              img.push(arr_right[i])
            }
          }
          that.grouping(img)
        }
      })
  },
  checkbox: function (e) {
    var index = e.currentTarget.dataset.left_index;//获取当前点击的下标
    var checkboxArr1 = this.data.cate_img_left;//选项集合
    checkboxArr1[index].checked = !checkboxArr1[index].checked;//改变当前选中的checked值
    this.setData({
      cate_img_left: checkboxArr1
    });
  },
  checkbox2: function (e) {
    var index = e.currentTarget.dataset.right_index;//获取当前点击的下标
    var checkboxArr2 = this.data.cate_img_right;//选项集合
    checkboxArr2[index].checked = !checkboxArr2[index].checked;//改变当前选中的checked值
    this.setData({
      cate_img_right: checkboxArr2
    });
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