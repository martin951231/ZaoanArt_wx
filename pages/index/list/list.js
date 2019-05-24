// pages/home/list.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    height:'',
    cate_info:{},
    cate_img_left: [],
    cate_img_right:[],
    cate_left: 0,
    cate_right:0,
    theme_id:0,
    search_val:'',
    imgcount:0,
    img_status:'',
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //跳转页面
  jump_list: function (option) {
    var id = option.currentTarget.id
    wx.navigateTo({
      url: './list?cate_id=' + id + '&theme_id=0&search=0',
    })
  },
  //跳转到详情页
  jump_details:function (option){
    var id = option.currentTarget.id
    wx.navigateTo({
      url: '../details/details?img_id=' + id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //初始化属性
    this.height = ''
    this.cate_info = []
    this.cate_img_left = []
    this.cate_img_right = []
    this.cate_left = 0
    this.cate_right = 0
    this.imgcount = 0
    //获取查询id
    var cate_id = options.cate_id
    var theme_id = options.theme_id
    var search_val = options.search
    if (cate_id != 0){
      this.img_status = 'cate'
      this.getcatelist(cate_id)
    }
    if (theme_id != 0){
      this.img_status = 'theme'
      this.getthemelist(theme_id)
    }
    if (search_val != 0) {
      this.img_status = 'search'
      this.getsearchlist(search_val)
    }
  },
  //cate搜索
  getcatelist(cate_id){
    var cate_id = cate_id
    var that = this
    //后台查询子分类
    wx.request({
      url: getApp().globalData.api_url + '/getcate2',
      data: { id: cate_id },
      method: 'get',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({ cate_info: res.data });
      }
    })
    //后台查询图片
    wx.request({
      url: getApp().globalData.api_url + '/getcateimg',
      data: {
        id: cate_id,
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
  //theme搜索
  getthemelist(theme_id){
    var that = this
    that.setData({ theme_id: theme_id });
    var theme_id = theme_id
    //后台查询图片
    wx.request({
      url: getApp().globalData.api_url + '/getthemeimg',
      data: {
        id: theme_id,
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
          cate_info: null
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
  //search搜索
  getsearchlist(search_val) {
    var that = this
    var search_val = search_val
    that.setData({ search_val: search_val });
    //后台查询图片
    wx.request({
      url: getApp().globalData.api_url + '/getsearchimg',
      data: {
        val: search_val,
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
          cate_info: null
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
  // 滚动加载图片
  loadimg(e){
    //获取id
    var cate_id = e.currentTarget.dataset.cate_id
    var theme_id = e.currentTarget.dataset.theme_id
    var search_val = e.currentTarget.dataset.search_val
    //获取开始的条目数
    var offset_start = e.currentTarget.dataset.offset_start
    if (this.img_status == 'cate'){
      this.cate_loadimg(cate_id, offset_start)
    } else if (this.img_status == 'theme'){
      this.theme_loadimg(theme_id, offset_start)
    } else if (this.img_status == 'search'){
      this.search_loadimg(search_val, offset_start)
    }
      wx.getSystemInfo({
        success: (res) => {
          this.setData({
            height: res.windowHeight
          })
        }
      })
  },
  //cate搜索
  cate_loadimg(cate_id, offset_start){
    var that = this
    var cate_id = cate_id
    var offset_start = offset_start
    //后台获取图片
    wx.request({
      url: getApp().globalData.api_url + '/getcateimg',
      data: {
        id: cate_id,
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
        });
      }
    })
  },
  //theme搜索
  theme_loadimg(theme_id, offset_start) {
    var that = this
    var theme_id = theme_id
    var offset_start = offset_start
    //后台获取图片
    wx.request({
      url: getApp().globalData.api_url + '/getthemeimg',
      data: {
        id: theme_id,
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
        });
      }
    })
  },
  //search搜索
  search_loadimg(search_val, offset_start) {
    var that = this
    var search_val = search_val
    var offset_start = offset_start
    //后台获取图片
    wx.request({
      url: getApp().globalData.api_url + '/getsearchimg',
      data: {
        val: search_val,
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
        });
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