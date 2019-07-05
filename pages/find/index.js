// pages/find/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keep_info:[],
    is_display:true,
    hasUserInfo: false,
    inputShowed:false,
    searchInfo: '',
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  //跳转到收藏夹图片
  jump_keepimg(options){
    var keep_id = options.currentTarget.dataset.keep_id
    var keep_name = options.currentTarget.dataset.keep_name
    wx.navigateTo({
      url: './keepimg/keepimg?keep_id=' + keep_id + '&keep_name=' + keep_name + '&is_mykeep=1',
    })
  },
  // //跳转到选图方式页面
  // select_status(){
  //   wx.navigateTo({
  //     url: './about/select_status',
  //   })
  // },
  // //跳转到关于我们页面
  // about_us(){
  //   wx.navigateTo({
  //     url: './about/about_us',
  //   })
  // },
  // //跳转到资讯热点页面
  // hotspot(){
  //   wx.navigateTo({
  //     url: './about/hotspot',
  //   })
  // },
  // //跳转到网站声明页面
  // statement(){
  //   wx.navigateTo({
  //     url: './about/statement',
  //   })
  // },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //获取搜索内容
  searchInfoInput: function (e) {
    this.setData({
      searchInfo: e.detail.value
    })
  },
  //搜索
  details_search() {
    this.setData({
      is_display: false,
      inputShowed:true
    })
    // var _search = this.data.searchInfo
    // wx.navigateTo({
    //   url: '../index/list/list?cate_id=0&theme_id=0&search=' + _search,
    // })
  },
  //搜索框失去焦点
  inputHide(){
    this.setData({
      is_display: true,
      inputShowed: false,
    })
  },
  //搜索
  details_search2() {
    this.setData({
      is_display: true
    })
    var _search = this.data.searchInfo
    wx.navigateTo({
      url: '../index/list/list?cate_id=0&theme_id=0&search=' + _search,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
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