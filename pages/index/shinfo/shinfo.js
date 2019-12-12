// pages/index/shinfo/shinfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fontsize:14,
    fontweight:100,
    username:'',
    tel:'',
    area:'',
    address:'',
    region: ['选择省 / 市 / 区'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  //获取用户名
  usernameInput: function (e) {
    this.setData({
      username: e.detail.value
    })
  },
  //获取用户名
  telInput: function (e) {
    this.setData({
      tel: e.detail.value
    })
  },
  //获取用户名
  areaInput: function (e) {
    this.setData({
      area: e.detail.value
    })
  },
  //获取用户名
  addressInput: function (e) {
    this.setData({
      address: e.detail.value
    })
  },
  //获取选择的城市
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value,
      fontsize:15,
      fontweight:'none'
    })
  },
  //获取填写的信息
  save_btn:function(){
    var username = this.data.username
    var tel = this.data.tel
    var area = this.data.area
    console.log(this.data.region)
    var region = this.data.region[0] + this.data.region[1] + this.data.region[2]
    var address = this.data.address
    console.log(area, region)
    if (username && tel && address){
      wx.request({
        url: getApp().globalData.api_url + '/save_address_info',
        method: 'get',
        data: { username: username, tel: tel, area: area, region: region, address: address},
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          if (res.data == 1){
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 1000
            });
          } else if (res.data == 2){
            wx.showToast({
              title: '保存失败',
              icon: 'success',
              duration: 1000
            });
          } else if (res.data == 3) {
            wx.showToast({
              title: '该地址已存在',
              icon: 'none',
              duration: 1000
            });
          }
        }
      })
    }else{
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none',
        duration: 1000
      });
    }
  },
  //获取当前城市地址
  get_location(){
    var that = this
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy
        wx.chooseLocation({
          success: function (res) {
            console.log(res.address)
            that.setData({
              region: ['','',''],
              fontsize: 15,
              fontweight: 'none',
              address: res.address
            })
          }
        })
        // wx.openLocation({
        //   latitude,
        //   longitude,
        //   scale: 18,
        //   success:function(res){
            
        //   }
        // })
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