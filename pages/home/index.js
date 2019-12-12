// pages/home/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token:'',
    code:'',
    openid:'',
    session_key:'',
    keep_info:[],
    hiddenmodalput: true,
    hiddenmodalput2: true,
    hiddenmodalput3: true,
    hiddenmodalput5: true,
    hiddenmodalput6: true,
    modalstatus:false,
    keepname: '',
    keepname2:'',
    keep_id:null,
    username:'',
    icon:'',
    height:0,
    keep_count:0,
    img_ratio: 1,
    my_attention:0,
    attention_user_num:0,
    uid:null,
    input_margin:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      height: wx.getSystemInfoSync().windowWidth/6
    })
    var that = this
    var token = getApp().globalData.token
    // if (!token) {
    //   //跳转到登录页
    //   wx.navigateTo({
    //     url: './login',
    //   })
    // }
    that.wx_login()
  },
  touch_move() {
    return;
  },
  wx_login:function(){
    var that = this
    wx.login({
      success: function (res) {
        //获取手机号
        wx.request({
          url: getApp().globalData.api_url + '/getwxphone',
          data: { code: res.code },
          method: 'get',
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            that.setData({ openid: res.data.openid, session_key: res.data.session_key });
          }
        })
      }
    });
  },
  //注销
  logout(){
    getApp().globalData.token = ''
    wx.removeStorage({
      key: 'zanan_token',
      success(res) {
        console.log(res)
      }
    })
    wx.reLaunch({
      url: './index',
    })
  },
  get_focus(){
    this.setData({
      input_margin: '-35vh'
    });
  },
  lose_focus(){
    this.setData({
      input_margin: ''
    });
  },
  //跳转到登录页
  to_login(){
    wx.navigateTo({
      url: './login',
    })
  },
  confirmM6(){
    wx.navigateTo({
      url: './login',
    })
  },
  islogin(){
    this.setData({
      hiddenmodalput5: false,
    })
  },
  islogin2() {
    this.setData({
      hiddenmodalput6: false,
    })
  },
  //关闭模态框
  cancelM5: function (e) {
    this.setData({
      hiddenmodalput5: true,
    })
  },
  //关闭模态框
  cancelM6: function (e) {
    this.setData({
      hiddenmodalput6: true,
    })
  },
  //添加收藏夹
  addkeep(){
    this.setData({
      hiddenmodalput: false
    });
  },
  //关闭模态框
  cancelM: function (e) {
    this.setData({
      hiddenmodalput: true,
    })
  },
  //模态框点确认
  confirmM: function (e) {
    var token = getApp().globalData.token
    if (!this.data.keepname){
      wx.showToast({
        title: '收藏夹名不能为空',
        icon: 'none',
        duration: 1000
      });
    }else{
      this.setData({
        hiddenmodalput: true,
      })
      wx.showLoading({
        title: '正在添加...',
      });
      var that = this
      //获取我的收藏夹
      wx.request({
        url: getApp().globalData.api_url + '/addnewkeep',
        data: { token: token, keep_name: that.data.keepname },
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
            that.getmykeep()
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
  //模态框点确认
  confirmM2: function (e) {
    var token = getApp().globalData.token
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
        title: '正在修改...',
      });
      var that = this
      //获取我的收藏夹
      wx.request({
        url: getApp().globalData.api_url + '/updatekeep',
        data: { token: token, keep_id: that.data.keep_id, keep_name: that.data.keepname2 },
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
              title: '修改成功',
              icon: 'success',
              duration: 1000
            });
            that.getmykeep()
          } else if (res.data == 2) {
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
  //模态框点确认
  confirmM3: function (e) {
    console.log(e)
    var token = getApp().globalData.token
      this.setData({
        hiddenmodalput3: true,
      })
      wx.showLoading({
        title: '删除中...',
      });
    var that = this
      //获取我的收藏夹
      wx.request({
        url: getApp().globalData.api_url + '/deletekeep',
        data: { token: token, keep_id: that.data.keep_id},
        method: 'get',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          wx.hideLoading()
          if (res.data == 0) {
            wx.showToast({
              title: '删除成功',
              icon: 'none',
              duration: 1000
            });
            that.getmykeep()
          } else if (res.data == 1) {
            wx.showToast({
              title: '删除失败',
              icon: 'success',
              duration: 1000
            });
          }
        }
      })
  },
  //获取模态框输入信息
  keepname(e){
    this.setData({
      keepname: e.detail.value
    })
  },
  //获取模态框输入信息
  keepname2(e) {
    this.setData({
      keepname2: e.detail.value
    })
  },
  //微信登录
  getPhoneNumber: function (e) {//点击获取手机号码按钮
    console.log(e)
    var that = this;
    wx.checkSession({
      success: function () {
        var ency = e.detail.encryptedData;
        var iv = e.detail.iv;
        var sessionk = that.data.session_key;
        if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
          that.setData({
            modalstatus: true
          });
        } else {//同意授权
          wx.request({
            method: "GET",
            url: getApp().globalData.api_url + '/decrypttel',
            data: {
              encrypdata: ency,
              ivdata: iv,
              session_key: sessionk
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: (res) => {
              if (res.data == 1 || res.data ==3){
                wx.showToast({
                  title: '登陆失败',
                  icon: 'none',
                  duration: 1000
                });
              }else if(res.data == 2){
                wx.showToast({
                  title: '该手机号被禁止登录',
                  icon: 'none',
                  duration: 1000
                });
              }else{
                wx.showToast({
                  title: '登录成功',
                  icon: 'success',
                  duration: 1000
                });
                getApp().globalData.token = res.data
                wx.setStorage({
                  key: "zanan_token",
                  data: res.data
                })
                that.getmykeep()
                that.getusername()
              }
            }, 
            fail: function (res) {
              console.log("解密失败~~~~~~~~~~~~~");
            }
          });
        }
      },
      fail: function () {
        console.log("session_key 已经失效，需要重新执行登录流程");
        that.wxlogin(); //重新登录
      }
    });
  },
  //跳转到编辑个人资料页面
  edit_user(){
    wx.navigateTo({
      url: './edit_user',
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
    this.getmykeep()
    this.getusername()
  },
  //获取我的收藏夹
  getmykeep(){
    var token = getApp().globalData.token
    var that = this
    if (token) {
      that.setData({ token: token });
      //获取我的收藏夹
      wx.request({
        url: getApp().globalData.api_url + '/getmykeep',
        data: { token: token },
        method: 'get',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res.data)
          wx.hideLoading()
          that.setData({ keep_info: res.data, token: token });
        }
      })
    }
  },
  //获取用户名和头像
  getusername(){
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
            uid:res.data.uid
          });
        }
      })
    }
  },
  //跳转到收藏夹图片
  jump_keepimg(options) {
    var keep_id = options.currentTarget.dataset.keep_id
    var keep_name = options.currentTarget.dataset.keep_name
    var username = options.currentTarget.dataset.username
    wx.navigateTo({
      url: '../find/keepimg/keepimg?keep_id=' + keep_id + '&keep_name=' + keep_name + '&is_mykeep=2&username=' + username,
    })
  },
  //跳转到我关注的收藏夹
  my_attention(){
    wx.navigateTo({
      url: './my_attention?uid='+this.data.uid,
    })
  },
  attention_user(){
    wx.navigateTo({
      url: './attention_user?uid='+this.data.uid,
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
    // wx.showLoading({
    //   title: '正在修改...',
    // });
    // this.getmykeep()
    // wx.showToast({
    //   title: 'loading....',
    //   icon: 'loading'
    // })
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