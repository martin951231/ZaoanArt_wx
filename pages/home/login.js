const app = getApp()
Page({
  data: {
    userInfo: {},
    username:'',
    password:'',
    random:0,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //发送验证码
  sendcode(){
    wx.showToast({
      title: '正在发送...',
      icon: 'none',
      duration: 1000
    });
    var username = this.data.username
    var that = this
    //查看手机号是否存在
    wx.request({
      url: 'https://api.zaoanart.com/v1/code/codetel',
      data: { telephone: username },
      method: 'get',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if(res.data == 1){
          //发送验证码
          wx.request({
            url: 'https://api.zaoanart.com/v1/code/sendcode',
            data: { username: username },
            method: 'get',
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              that.setData({
                random: res.data.random
              })
            }
          })
        }else{
          wx.showToast({
            title: '用户不存在',
            icon: 'none',
            duration: 1000
          });
        }
      }
    })
  },
  //登录
  login() {
    var username = this.data.username
    var password = this.data.password
    //验证验证码
    wx.request({
      url: 'https://api.zaoanart.com/v1/code/vercode',
      data: { code: password, telephone: username },
      method: 'get',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if(res.data){
          //登录
          wx.request({
            url: getApp().globalData.api_url + '/login',
            data: { username: username, password: password },
            method: 'get',
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              wx.showToast({
                title: '登录成功',
                icon: 'success',
                duration: 500
              });
              getApp().globalData.token = res.data.token
              //返回上一层
              wx.navigateBack({ delta: 1 })
            }
          })
        }else{
          wx.showToast({
            title: '用户名或验证码错误',
            icon: 'none',
            duration: 1000
          });
        }
      }
    })
  },
  //获取用户名
  usernameInput: function (e) {
    this.setData({
      username: e.detail.value
    })
  },
  //获取密码
  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
})
