// pages/home/edit_user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    icon: '',
    username:'',
    uid:null,
    username: '',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getusername()
  },
  //获取用户名和头像
  getusername() {
    var token = getApp().globalData.token
    var that = this
    if (token) {
      //获取用户名和头像
      wx.request({
        url: getApp().globalData.api_url + '/getusername',
        data: { token: token },
        method: 'get',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          that.setData({
            username: res.data.username,
            icon: res.data.icon,
            my_attention: res.data.my_attention,
            attention_user_num: res.data.attention_user_num,
            uid: res.data.uid
          });
        }
      })
    }
  },
  //获取输入昵称内容
  searchInfoInput: function (e) {
    this.setData({
      username: e.detail.value
    })
  },
  //修改昵称
  edit_username(){
    var token = getApp().globalData.token
    var username = this.data.username
    if(token){
      wx.showLoading({
        title: '正在修改...',
      });
      wx.request({
        url: getApp().globalData.api_url + '/edit_username',
        data: { 
          token: token,
          username: username
        },
        method: 'get',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          wx.hideLoading()
          if(res.data == 1){
            wx.showToast({
              title: '请设定一个不一样的昵称吧',
              icon: 'none',
              duration: 1000
            });
          } else if (res.data == 2){
            wx.showToast({
              title: '修改成功',
              icon: 'success',
              duration: 1000
            });
          }else if(res.data == 3){
            wx.showToast({
              title: '修改失败',
              icon: 'none',
              duration: 1000
            });
          }
        }
      })
    }
  },
  // 切换头像
  changeAvatar: function () {
    var that = this;
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        var avatar = res.tempFilePaths;
        var path = avatar
        that.upload(path)
        that.setData({
          icon: avatar,
        })
      },
    })
  },
  //上传头像
  upload(path) {
    var that = this
    wx.showToast({
      icon: "loading",
      title: "正在上传"
    }),
    wx.uploadFile({
      url: getApp().globalData.api_url + '/edit_img',
      filePath: path[0],
      name: 'file',
      header: { "Content-Type": "multipart/form-data" },
      formData: {
        //和服务器约定的token, 一般也可以放在header中
        'session_token': wx.getStorageSync('session_token'),
        'uid': that.data.uid,
      },
      success: function (res) {
        console.log(res.data)
        if (res.data == 1) {
          wx.showToast({
            title: '上传成功',
            icon: 'success',
            duration: 1000
          });
        } else if (res.data == 2) {
          wx.showToast({
            title: '上传失败',
            icon: 'none',
            duration: 1000
          });
        }else if(res.data == 3){
          wx.showToast({
            title: '文件太大',
            icon: 'none',
            duration: 1000
          });
        }
      },
      fail: function (e) {
        wx.showToast({
          title: '上传失败',
          icon: 'none',
          duration: 1000
        });
      },
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
    this.getusername()
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