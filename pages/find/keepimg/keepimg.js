// pages/find/keepimg/keepimg.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keep_id:0,
    keep_name:null,
    keepimg_info:[],
    cate_img_left: [],
    cate_img_right: [],
    cate_left: 0,
    cate_right: 0,
    imgcount: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var keep_id = options.keep_id
    var keep_name = options.keep_name
    this.setData({ keep_id:keep_id,keep_name: keep_name });
    var that = this
    wx.request({
      url: getApp().globalData.api_url + '/getkeepimg',
      method: 'get',
      data: { keep_id: keep_id, start: 0},
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
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
  //跳转到详情页
  jump_details: function (option) {
    var id = option.currentTarget.id
    wx.navigateTo({
      url: '../../index/details/details?img_id=' + id,
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