// pages/leave_message.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    max_length:0,
    message_info:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //获取文本框数据
  message_text(e){
    var text = e.detail.value
    this.setData({
      max_length: text.length,
      message_info:text
    })
  },
  //点击提交留言
  to_message(){
    var token = getApp().globalData.token
    var message = this.data.message_info
    if (!message){
      wx.showToast({
        title: '请输入您的建议',
        icon: 'none',
        duration: 1000
      });
    }else{
      if (!token) {
        wx.showToast({
          title: '请先登录',
          icon: 'none',
          duration: 1000
        });
      }else{
        //提交留言信息
        wx.request({
          url: getApp().globalData.api_url + '/message',
          data: { token: token, content: message},
          method: 'get',
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            if(res.data == 0){
              wx.showToast({
                title: '留言成功',
                icon: 'success',
                duration: 1000
              });
            } else if (res.data == 1) {
              wx.showToast({
                title: '每日留言最多十条',
                icon: 'none',
                duration: 1000
              });
            } else if (res.data == 2){
              wx.showToast({
                title: '留言失败',
                icon: 'none',
                duration: 1000
              });
            } 
          }
        })
      }
    }
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