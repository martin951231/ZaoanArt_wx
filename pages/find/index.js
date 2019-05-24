// pages/find/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keep_info:[],
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.request({
      url: getApp().globalData.api_url + '/getkeep',
      method: 'get',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({ keep_info: res.data });
      }
    })
  },
  //跳转到收藏夹图片
  jump_keepimg(options){
    var keep_id = options.currentTarget.dataset.keep_id
    var keep_name = options.currentTarget.dataset.keep_name
    wx.navigateTo({
      url: './keepimg/keepimg?keep_id=' + keep_id + '&keep_name=' + keep_name,
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