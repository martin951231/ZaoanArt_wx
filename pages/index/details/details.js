// pages/index/details/details.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: '',
    img_id:0,
    img_info:[],
    cate_img_left: [],
    cate_img_right: [],
    page_status: true,
    cate_left: 0,
    cate_right: 0,
    keep_info:[],
    imgcount: 0,
    hiddenmodalput: true,
  },
  //跳转到详情页
  jump_details: function (option) {
    var id = option.currentTarget.id
    wx.redirectTo({
      url: './details?img_id=' + id,
    })
  },
  //取消按钮
  confirm: function () {
    this.setData({
      hiddenmodalput: true
    });
  },
  addkeep: function (event){
    console.log(event)
    var that = this
    var uid = event.target.dataset.uid;
    var kid = event.target.dataset.kid;
    var img_id = event.target.dataset.img_id;
    if (uid && kid && img_id){
      //后台添加收藏夹
      wx.request({
        url: getApp().globalData.api_url + '/addkeep',
        data: { uid: uid, kid: kid, img_id: img_id },
        method: 'get',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          if (res.data == 1) {
            wx.showToast({
              title: '该收藏夹已存在此图片',
              icon: 'none',
              duration: 1000
            });
          } else if (res.data == 0){
            that.setData({
              hiddenmodalput: true
            });
            wx.showToast({
              title: '添加成功',
              icon: 'success',
              duration: 1000
            });
          }
        }
      })
    }
  },
  //跳转到装裱页
  to_decoration(){
    var img_url = this.data.img_info.image
    wx.redirectTo({
      url: './decoration?img=' + img_url,
    })
  },
  //添加到收藏夹
  to_keep(){
    var that = this
    var token = getApp().globalData.token
    if (!token) {
      //跳转到登录页
      wx.switchTab({
        url: '../../home/index',
      })
    } else {
      //后台查询收藏夹
      wx.request({
        url: getApp().globalData.api_url + '/getukeep',
        data: { token: token },
        method: 'get',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          if(res.data == 1){
            wx.showToast({
              title: '请先到个人中心添加收藏夹',
              icon: 'none',
              duration: 2000
            });
          }else{
            that.setData({
              keep_info: res.data,
              hiddenmodalput: !that.data.hiddenmodalput
            });
          }
        }
      })
    }
  },
  //点击预览图片
  enlarge:function(event){
    var src =  event.currentTarget.dataset.src;//获取data-src
    src = src+"?watermark/1/image/aHR0cDovL3d3dy56YW9hbmFydC5jb206ODAwMC9pbWFnZXMvemFvYW5hcnRfbG9nb19zaHVpeWluLnBuZw=="
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: [src]
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var img_id = options.img_id
    //获取图片详情
    this.getimg(img_id)
    //获取相似图片
    this.getlikeimage(img_id)
    var that = this 
    
  },
  //获取图片详情
  getimg(img_id){
    var that = this
    that.setData({ img_id: img_id });
    //后台查询图片详情
    wx.request({
      url: getApp().globalData.api_url + '/getimg',
      data: { id: img_id },
      method: 'get',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({ img_info: res.data });
      }
    })
  },
  //获取相似图片
  getlikeimage(img_id){
    var that = this
    //后台查询图片
    wx.request({
      url: getApp().globalData.api_url + '/getlikeimage',
      data: {
        id: img_id,
        start: 0
      },
      method: 'get',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        //设置后台查询开始的条目数
        that.setData({
          imgcount: res.data.start,
        });
        var left_height = 0
        var right_height = 0
        //循环往图片数组里添加图片
        for (var i in res.data.image) {
          //如果左边一列大就往右边一列放,反之往左边放
          if (right_height >= left_height) {
            that.data.cate_img_left.push(res.data.image[i]),
              that.setData({
                cate_img_left: that.data.cate_img_left,
              });
            left_height = left_height + res.data.image[i].img_height
          } else {
            that.data.cate_img_right.push(res.data.image[i])
            that.setData({
              cate_img_right: that.data.cate_img_right,
            });
            right_height = right_height + res.data.image[i].img_height
          }
        }
        //设置左右两列的高度
        that.setData({
          cate_left: left_height,
          cate_right: right_height,
        });
        wx.getSystemInfo({
          success: (res) => {
            that.setData({
              height: res.windowHeight
            })
          }
        })
      }
    })
  },
  //滚动到底部加载图片
  loadimg2(e){
    var page_status = this.data.page_status
    if (page_status) {
      this.setData({
        page_status: false
      })
      //获取id
      var img_id = e.currentTarget.dataset.img_id
      //获取开始的条目数
      var offset_start = e.currentTarget.dataset.offset_start
      var that = this
      //后台获取图片
      wx.request({
        url: getApp().globalData.api_url + '/getlikeimage',
        data: {
          id: img_id,
          start: offset_start
        },
        method: 'get',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          //设置开始的条目数
          that.setData({
            imgcount: res.data.start,
          });
          var left_height = that.data.cate_left;
          var right_height = that.data.cate_right;
          //循环往图片数组里追加图片
          for (var i in res.data.image) {
            //如果左边一列大就往右边一列放,反之往左边放
            if (right_height >= left_height) {
              that.data.cate_img_left.push(res.data.image[i]),
                that.setData({
                  cate_img_left: that.data.cate_img_left,
                });
              left_height = left_height + res.data.image[i].img_height
            } else {
              that.data.cate_img_right.push(res.data.image[i])
              that.setData({
                cate_img_right: that.data.cate_img_right,
              });
              right_height = right_height + res.data.image[i].img_height
            }
          }
          //设置左右两列的高度
          that.setData({
            cate_left: left_height,
            cate_right: right_height,
            page_status: true
          });
          wx.getSystemInfo({
            success: (res) => {
              that.setData({
                height: res.windowHeight
              })
            }
          })
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