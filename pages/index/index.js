//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    motto: '早安艺术',
    userInfo: {},
    cate_info: {},
    searchInfo: '',
    theme_info:{},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    //记录小程序访问
    wx.request({
      url: getApp().globalData.api_url + '/record_access_wechat',
      method: 'get',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
      }
    })
    wx.getStorage({
      key: 'zanan_token',
      success(res) {
        getApp().globalData.token = res.data
        console.log(res.data)
      },
      fail(msg){
        getApp().globalData.token = null
      }
    })
    this.getcatelist();
    this.getthemelist();
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse){
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }
  },
  getcatelist(){
    var that = this
    wx.request({
      url: getApp().globalData.api_url+'/getcate',
      method: 'get',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({ cate_info: res.data });
      }
    })
  },
  getthemelist() {
    var that = this
    wx.request({
      url: getApp().globalData.api_url+'/gettheme',
      method: 'get',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({ theme_info: res.data });
      }
    })
  },
  jump_details:function(option) {
    var id = option.currentTarget.id
    wx.navigateTo({
      url: './list/list?cate_id=' + id +'&theme_id=0&search=0',
    })
  },
  jump_details2: function (option){
    var id = option.currentTarget.id
    wx.navigateTo({
      url: './list/list?cate_id=0&theme_id=' + id +'&search=0',
    })
  },
  //跳转到用户指南页面
  user_guide() {
    wx.navigateTo({
      url: './about/user_guide',
    })
  },
  //跳转到关于我们页面
  about_us() {
    wx.navigateTo({
      url: './about/about_us',
    })
  },
  //跳转到资讯热点页面
  hotspot() {
    wx.navigateTo({
      url: './about/hotspot',
    })
  },
  //跳转到网站声明页面
  statement() {
    wx.navigateTo({
      url: './about/statement',
    })
  },
  //跳转到留言
  to_leave_message(){
    wx.navigateTo({
      url: '../leave_message',
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
