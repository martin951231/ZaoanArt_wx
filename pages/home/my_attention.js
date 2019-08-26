// pages/home/my_attention.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keep_info: [],
    is_display: true,
    hasUserInfo: false,
    inputShowed: false,
    searchInfo: '',
    img_ratio: 1,
    uid:null,
    icon:'',
    username:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      uid: options.uid,
    });
  },
  //跳转到收藏夹图片
  jump_keepimg(options) {
    var keep_id = options.currentTarget.dataset.keep_id
    var keep_name = options.currentTarget.dataset.keep_name
    var uid = options.currentTarget.dataset.uid
    wx.navigateTo({
      url: '../find/keepimg/keepimg?keep_id=' + keep_id + '&keep_name=' + keep_name + '&is_mykeep=3' + '&uid=' + uid,
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
    this.getkeep()
    this.getusername()
  },
  //获取用户名和头像
  getusername() {
    var that = this
    //获取用户名和头像
    wx.request({
      url: getApp().globalData.api_url + '/getusername3',
      data: { uid: that.data.uid },
      method: 'get',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          username: res.data.username,
          icon: res.data.icon,
          my_attention: res.data.my_attention,
          attention_user_num: res.data.attention_user_num
        });
      }
    })
  },
  //获取收藏夹内容
  getkeep() {
    if (getApp().globalData.token) {
      var token = getApp().globalData.token
    } else {
      var token = null
    }
    var that = this
    wx.setNavigationBarTitle({
      title: '他的关注'
    })
    wx.request({
      url: getApp().globalData.api_url + '/getmyfocus',
      data: {
        uid: this.data.uid
      },
      method: 'get',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          keep_info: res.data,
        });
      }
    })
  },
  //取消关注
  del_attention(e) {
    var keep_id = e.currentTarget.dataset.keep_id
    var token = getApp().globalData.token
    var that = this
    if (!token) {
      wx.switchTab({
        url: '../home/index',
      })
    } else {
      wx.showLoading({
        title: '正在取消...',
      });
      //添加关注
      wx.request({
        url: getApp().globalData.api_url + '/del_attention',
        data: {
          token: token,
          keep_id: keep_id
        },
        method: 'get',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          wx.hideLoading()
          if (res.data == 1) {
            wx.showToast({
              title: '取消成功',
              icon: 'success',
              duration: 1000
            });
            that.getkeep()
          } else if (res.data == 2) {
            wx.showToast({
              title: '取消失败',
              icon: 'none',
              duration: 1000
            });
          }
        }
      })
    }
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