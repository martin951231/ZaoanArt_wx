// pages/home/attention_user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid:null,
    username:'',
    icon:'',
    my_attention:0,
    attention_user_num:0,
    user_info:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      uid: options.uid
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
    this.getusername()
    this.getattention_user()
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
  //获取关注的用户
  getattention_user(){
    var uid = this.data.uid
    var that = this
    var token = getApp().globalData.token
    wx.request({
      url: getApp().globalData.api_url + '/getattentionuser',
      data: { uid: uid, token: token},
      method: 'get',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          user_info: res.data
        });
      }
    })
  },
  //关注用户
  add_attention_user(e) {
    var uid = e.currentTarget.dataset.uid
    var token = getApp().globalData.token
    var that = this
    if (!token) {
      wx.switchTab({
        url: './home/index',
      })
    } else {
      wx.showLoading({
        title: '正在取消...',
      });
      wx.request({
        url: getApp().globalData.api_url + '/add_attention_user',
        data: {
          uid: uid,
          token: token
        },
        method: 'get',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          wx.hideLoading()
          if (res.data == 1) {
            wx.showToast({
              title: '关注成功',
              icon: 'success',
              duration: 1000
            });
            that.getattention_user()
          } else if (res.data == 2) {
            wx.showToast({
              title: '关注失败',
              icon: 'none',
              duration: 1000
            });
          }
        }
      })
    }
  },
  //取消关注
  del_attention_user(e) {
    var uid = e.currentTarget.dataset.uid
    var token = getApp().globalData.token
    var that = this
    if (!token) {
      wx.switchTab({
        url: '../../home/index',
      })
    } else {
      wx.showLoading({
        title: '正在取消...',
      });
      //添加关注
      wx.request({
        url: getApp().globalData.api_url + '/del_attention_user',
        data: {
          uid: uid,
          token: token
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
            that.getattention_user()
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
  //跳转到关注用户的收藏夹页面
  to_current_user(e){
    var uid = e.currentTarget.dataset.u_id
    wx.navigateTo({
      url: '../find/keepimg/current_user?uid=' + uid,
    })
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