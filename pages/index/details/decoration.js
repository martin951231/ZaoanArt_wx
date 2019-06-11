// pages/index/details/decoration.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    default_img: '',
    default_img1:'',
    borderimg: [],
    border_img:[],
    border_series:[],
    border_status:1,
    width:0,
    height:0,
    canvas_width: 0,
    canvas_height:0,
    click_img:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var img = options.img
    this.setData({ default_img1: img, default_img: img, click_img: img});
    var that = this
    //获取边框素材
    wx.request({
      url: getApp().globalData.api_url + '/getborderimg',
      method: 'get',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({ borderimg: res.data, border_img: res.data[1], border_status: res.data[1][0]['sid']});
      }
    })
    //获取边框色系
    wx.request({
      url: getApp().globalData.api_url + '/getborderseries',
      method: 'get',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({ border_series: res.data});
      }
    })
  },
  //点击切换边框数据
  up_border(e){
    var series_id = e.currentTarget.dataset.series_id
    this.setData({ border_img: this.data.borderimg[series_id], border_status: series_id});
  },
  //点击预览图片
  enlarge: function (event) {
    var that = this
    var src = event.currentTarget.dataset.src;//获取data-src
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: [that.data.click_img]
    })
  },
  //点击装裱
  decoration(e){
    var that = this
    var obj = wx.createSelectorQuery();
    obj.select('.decoration_image').boundingClientRect();
    obj.exec(function (rect) {
      console.log(rect[0])
      that.setData({
        width: rect[0].width,
        height: rect[0].height
      });
      var series_id = e.currentTarget.dataset.item
      var border_info = e.currentTarget.dataset.border_info
      var border_name = border_info.img_name
      var face_width = border_info.face_width
      var box_width = that.data.width
      var box_height = that.data.height
      var img_name = that.data.default_img1
      var ctx = wx.createCanvasContext('customCanvas')
      that.setData({ canvas_width: box_width + 40, canvas_height: box_height + 40 });
      wx.showLoading({
        title: '装裱中,请稍等.',
      });
      //装裱
      wx.request({
        url: getApp().globalData.api_url + '/decoration',
        data: {
          border_name: border_info.img_name,
          face_width: border_info.face_width,
          box_width: that.data.width,
          box_height: that.data.height,
          img_name: that.data.default_img1
        },
        method: 'get',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          var array = wx.base64ToArrayBuffer(res.data.url)
          var base64 = wx.arrayBufferToBase64(array)

          wx.getImageInfo({
            src: 'https://www.zaoanart.com/admin/test/bgimg.png',
            success: function (res) {
              ctx.beginPath()//开始创建一个路径
              ctx.fillStyle = "#FFFFFF";
              ctx.fillRect(0, 0, box_width + 40, box_height + 40);
              ctx.setShadow(1, 10, 5, '#ccc')
              ctx.drawImage(res.path, 40, 40, box_width - 40, box_height - 40)//绘制图片
              ctx.draw(false, function () {
                setTimeout(function () {
                  wx.canvasToTempFilePath({
                    canvasId: 'customCanvas',
                    success: function (res) {
                      var tempFilePath = res.tempFilePath
                      // var tempFilePath2 = wx.getFileSystemManager().readFileSync(tempFilePath, "base64")
                      // console.log('data:image/png;base64,' + tempFilePath2)
                      wx.hideLoading()
                      that.setData({ default_img: 'data:image/png;base64,' + base64, click_img: tempFilePath });
                    },
                    fail: function (res) {
                      console.log(res);
                    }
                  });
                }, 500);
              })
            },
            fail: function (msg) {
              console.log(msg)
            }
          })
        }
      })
    });
    
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