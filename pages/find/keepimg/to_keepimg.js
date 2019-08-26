// pages/find/keepimg/to_keepimg.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    options:[],
    keep_info:null,
    edit_status:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var token = options.token
    var img_array = options.img_array
    var keep_id = options.keep_id
    this.setData({
      options: options,
      edit_status: options.edit_status
    });
    var that = this
    //后台查询收藏夹
    wx.request({
      url: getApp().globalData.api_url + '/getukeeps',
      data: { token: token, keep_id: keep_id },
      method: 'get',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data == 1) {
          wx.showToast({
            title: '没有其他收藏夹',
            icon: 'none',
            duration: 2000
          });
        } else {
          that.setData({
            keep_info: res.data,
          });
        }
      }
    })
  },

  edit_keep(e){
    var to_keep_id = e.currentTarget.dataset.keep_id
    if (this.data.edit_status == 1){
      this.move_to_keep(to_keep_id)
    } else if (this.data.edit_status == 2){
      this.copy_to_keep(to_keep_id)
    }
  },

  //移动到收藏夹
  move_to_keep(to_keep_id){
    var token = this.data.options.token
    var img_array = this.data.options.img_array
    var keep_id = this.data.options.keep_id
    var keep_name = this.data.options.keep_name
    wx.showActionSheet({
      itemList: ['确定移动'],
      success(res) {
        if (res.tapIndex == 0) {
          wx.showLoading({
            title: '正在移动...',
          });
          wx.request({
            url: getApp().globalData.api_url + '/moveimg',
            data: { token: token, keep: keep_id, to_keep: to_keep_id, img_id: img_array },
            method: 'get',
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              wx.hideLoading()
              if (res.data == 1) {
                wx.navigateBack({
                  url: './keepimg?keep_id=' + keep_id + '&keep_name=' + keep_name + '&is_mykeep=1',
                })
                wx.showToast({
                  title: '移动成功',
                  icon: 'success',
                  duration: 1000
                });
              } else {
                wx.showToast({
                  title: '移动失败',
                  icon: 'none',
                  duration: 1000
                });
                return false
              }
            }
          })
        }
      },
      fail(res) {
      }
    })
  },
  //复制到收藏夹
  copy_to_keep(to_keep_id){
    var token = this.data.options.token
    var img_array = this.data.options.img_array
    var keep_id = this.data.options.keep_id
    var keep_name = this.data.options.keep_name
    wx.showActionSheet({
      itemList: ['确定复制'],
      success(res) {
        if (res.tapIndex == 0) {
          wx.showLoading({
            title: '正在复制...',
          });
          wx.request({
            url: getApp().globalData.api_url + '/copyimg',
            data: { token: token, keep: keep_id, to_keep: to_keep_id, img_id: img_array },
            method: 'get',
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              wx.hideLoading()
              if (res.data == 1) {
                wx.showToast({
                  title: '复制成功',
                  icon: 'success',
                  duration: 1000
                });
                wx.navigateBack({
                  url: './keepimg?keep_id=' + keep_id + '&keep_name=' + keep_name + '&is_mykeep=2',
                })
              } else {
                wx.showToast({
                  title: '复制失败',
                  icon: 'none',
                  duration: 1000
                });
                return false
              }
            }
          })
          console.log(token, to_keep_id, img_array, keep_id, keep_name)
        }
      },
      fail(res) {
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