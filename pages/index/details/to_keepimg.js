// pages/find/keepimg/to_keepimg.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    options: [],
    keep_info: null,
    keep_lately_info: null,
    edit_status: null,
    img_id:null,
    uid:null,
    hiddenmodalput2:true,
    keepname2:null,
    image:null,
    category:null,
    theme:null,
    input_margin:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var token = options.token
    var img_id = options.img_id
    var image = options.image
    this.setData({
      img_id: img_id,
      image: image
    });
    this.getmykeep(token)
    this.getlatelykeep()
    var that = this
    //查询分类和主题
    wx.request({
      url: getApp().globalData.api_url + '/getcate_theme',
      data: { category: options.category, theme: options.theme },
      method: 'get',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          category: res.data.category_name,
          theme: res.data.theme_name,
        });
      }
    })
  },
  get_focus() {
    this.setData({
      input_margin: '-35vh'
    });
  },
  lose_focus() {
    this.setData({
      input_margin: ''
    });
  },
  //查询我的收藏夹
  getmykeep(token){
    var that = this
    wx.request({
      url: getApp().globalData.api_url + '/getukeep',
      data: { token: token },
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
          console.log(res.data)
          that.setData({
            keep_info: res.data,
            uid: res.data[0].uid
          });
        }
      }
    })
  },
  //查询最近添加的3个收藏夹
  getlatelykeep(){
    var that = this
    wx.getStorage({
      key: 'lately_keep',
      success: function (res) {
        that.setData({
          keep_lately_info:res.data
        })
      },
      fail: function (res) {
        console.log(res)
      }
    });
  },
  edit_keep(e) {
    var keep_id = e.currentTarget.dataset.keep_id
    var keep_index = e.currentTarget.dataset.keep_index
    var uid = this.data.uid
    var img_id = this.data.img_id
    var that = this
    wx.showLoading({
      title: '正在添加...',
    });
    wx.request({
      url: getApp().globalData.api_url + '/addkeep',
      data: { uid: uid, kid: keep_id, img_id: img_id },
      method: 'get',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data == 1) {
          wx.showToast({
            title: '该收藏夹已存在此图片',
            icon: 'none',
            duration: 1000
          });
        } else if (res.data == 0) {
          var data = new Array()
          data[0] = {
            id: that.data.keep_info[keep_index].id,
            heat: that.data.keep_info[keep_index].heat,
            image: that.data.keep_info[keep_index].image,
            keep_name: that.data.keep_info[keep_index].keep_name,
            uid: that.data.keep_info[keep_index].uid,
          } 
          wx.getStorage({
            key: 'lately_keep',
            success: function (res) {
              console.log(res.data)
              var datas = new Array()
              if(res.data.length >= 3){
                datas[0] = res.data[1]
                datas[1] = res.data[2]
                datas[2] = data[0]
              }else{
                res.data.push(data[0])
                datas = res.data
              }
              wx.setStorage({
                key: "lately_keep",
                data: datas
              })
            },
            fail: function (res) {
              var datas = new Array()
              datas.push(data[0])
              wx.setStorage({
                key: "lately_keep",
                data: datas
              })
            }
          });
          wx.navigateBack({
            delta: 1
          })
          wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 1000
          });
        }
      }
    })
  },

  //新建收藏夹模态框
  addkeep() {
    var token = getApp().globalData.token
    if (token) {
      this.setData({
        hiddenmodalput2: false,
      });
    } else {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 1000
      });
    }
  },
  touch_move(){
    return;
  },
  //获取模态框输入信息
  keepname2(e) {
    this.setData({
      keepname2: e.detail.value
    })
  },
  //关闭模态框
  cancelM2: function (e) {
    this.setData({
      hiddenmodalput2: true,
    })
  },
  //模态框点确认
  confirmM2: function (e) {
    var token = getApp().globalData.token
    var that = this
    if (!this.data.keepname2) {
      wx.showToast({
        title: '收藏夹名不能为空',
        icon: 'none',
        duration: 1000
      });
    } else {
      this.setData({
        hiddenmodalput2: true,
      })
      wx.showLoading({
        title: '正在添加...',
      });
      var that = this
      //添加新的收藏夹
      wx.request({
        url: getApp().globalData.api_url + '/addnewkeep',
        data: { token: token, keep_name: that.data.keepname2 },
        method: 'get',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          wx.hideLoading()
          if (res.data == 1) {
            wx.showToast({
              title: '收藏夹名已存在',
              icon: 'none',
              duration: 1000
            });
          } else if (res.data == 0) {
            wx.showToast({
              title: '添加成功',
              icon: 'success',
              duration: 1000
            });
            that.getmykeep(token)
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