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
    img_ratio: 1,
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
    var uid = options.currentTarget.dataset.uid
    wx.navigateTo({
      url: './keepimg/keepimg?keep_id=' + keep_id + '&keep_name=' + keep_name + '&is_mykeep=1'+'&uid='+uid,
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
      url: '../index/list/list?cate_id=0&theme_id=0&label_id=0&search=' + _search,
    })
  },
  //添加关注
  add_attention(e){
    var keep_id = e.currentTarget.dataset.keep_id
    var token = getApp().globalData.token
    var that = this
    if(!token){
      wx.switchTab({
        url: '../home/index',
      })
    }else{
      wx.showLoading({
        title: '正在添加...',
      });
      //添加关注
      wx.request({
        url: getApp().globalData.api_url + '/add_attention',
        data:{
          token : token,
          keep_id : keep_id
        },
        method: 'get',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          wx.hideLoading()
          if (res.data == 1) {
            wx.showToast({
              title: '添加成功',
              icon: 'success',
              duration: 1000
            });
            that.getkeep()
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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getkeep()
  },
  getkeep(){
    if (getApp().globalData.token) {
      var token = getApp().globalData.token
    } else {
      var token = null
    }
    var that = this
    wx.request({
      url: getApp().globalData.api_url + '/getkeep',
      data: {
        token: token
      },
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