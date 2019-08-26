// pages/home/list.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    height:'',
    cate_info:{},
    cate_img_left: [],
    cate_img_right:[],
    cate_left: 0,
    cate_right:0,
    theme_id:0,
    search_val:'',
    imgcount:0,
    page_status:true,
    img_status:'',
    cate_name: {},
    theme_name:{},
    cate_id: null,
    theme_id: null,
    label_id: null,
    color_id:null,
    progress_width: 0,
    progress_height:2,
    searchInfoInput:null,
    condition_height: '0',
    condition_info_height: '0',
    condition_infos_height: 0,
    display:'block',
    select:true,
    hide_height:0,
    contrast_id:null,
    condition_status:'condition_bottom',
    animation:{},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    longtap:'none',
    jump_details:'jump_details',
    touch_position_x: 0,
    touch_position_y:0,
    touch_position_x1: 0,
    touch_position_y1: 0,
    touch_position_x2: 0,
    touch_position_y2: 0,
    touch_position_x3: 0,
    touch_position_y3: 0,
    opacity: 0,
    is_to_keep:'',
    to_keep_icon_hide:'none',
    touchlong:'',
    keep_lately_info:[],
    touchMove: '',
    touchMove2:'',
    touch_move:''
  },
  touch_move() {
    return;
  },
  //跳转页面
  jump_list: function (option) {
    var id = option.currentTarget.id
    wx.navigateTo({
      url: './list?cate_id=' + id + '&theme_id=0&search=0',
    })
  },
  //跳转到详情页
  jump_details:function (option){
    var id = option.currentTarget.id
    wx.navigateTo({
      url: '../details/details?img_id=' + id,
    })
  },
  //获取搜索内容
  searchInfoInput: function (e) {
    this.setData({
      searchInfoInput: e.detail.value
    })
  },
  //点击滑出条件筛选
  up_condition:function(){
    if (this.data.condition_status == 'condition_bottom'){
      this.setData({ 
        condition_status: 'condition_top',
        condition_height: '100%',
        condition_info_height:'auto',
        hide_height:'100%',
        display:'block',
        select:false
      });
    }else{
      this.setData({ 
        condition_status: 'condition_bottom',
        condition_height: '0px',
        condition_info_height: '0px',
        hide_height: '0%',
        display: 'none',
        select: true
      });
    }
  },
  //点击修改图片比例
  up_contrast(e){
    var contrast_id = e.currentTarget.dataset.contrast_id
    if (this.data.contrast_id == contrast_id) {
      this.setData({
        contrast_id: null
      })
    } else {
      this.setData({
        contrast_id: contrast_id
      })
    }
  },
  //点击修改搜索条件
  up_cate_id(e){
    var cate_id = e.currentTarget.dataset.cate_id
    if (this.data.cate_id == cate_id){
      this.setData({
        cate_id: null
      })
    }else{
      this.setData({
        cate_id: cate_id
      })
    }
  },
  //点击修改搜索条件
  up_theme_id(e) {
    var theme_id = e.currentTarget.dataset.theme_id
    if (this.data.theme_id == theme_id){
      this.setData({
        theme_id: null
      })
    }else{
      this.setData({
        theme_id: theme_id
      })
    }
  },
  //点击修改搜索条件
  up_color_id(e) {
    var color_id = e.currentTarget.dataset.color_id
    if (this.data.color_id == color_id){
      this.setData({
        color_id: null
      })
    }else{
      this.setData({
        color_id: color_id
      })
    }
  },
  //重置搜索条件
  reset(){
    this.setData({
      cate_id: null,
      theme_id: null,
      color_id: null
    })
  },
  //确认筛选条件
  condition_search(){
    this.set_dingshi()
    var cate_id = this.data.cate_id
    var theme_id = this.data.theme_id
    var color_id = this.data.color_id
    var search = this.data.searchInfoInput
    var contrast = this.data.contrast_id
    this.setData({
      condition_status: 'condition_bottom',
      condition_height: '0px',
      condition_info_height: '0px',
      hide_height: '0%',
      display: 'none',
      select: true,
      cate_img_left: [],
      cate_img_right: [],
      cate_left: 0,
      cate_right: 0,
      imgcount:0,
      height:0,
      img_status:'all'
    });
    var that = this
    //后台查询子分类
    wx.request({
      url: getApp().globalData.api_url + '/getcate2',
      data: { id: cate_id },
      method: 'get',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({ cate_info: res.data.data });
      }
    })
    //查询图片
    wx.request({
      url: getApp().globalData.api_url + '/getallimg',
      data: {
        cate_id: cate_id,
        theme_id: theme_id,
        color_id: color_id,
        search: search,
        contrast: contrast,
        start: 0,
      },
      method: 'get',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.setNavigationBarTitle({
          title: res.data.condition
        })
        that.setData({ progress_width: 100, progress_height:0});
        var left_height = 0
        var right_height = 0
        if (res.data.data){
          //设置后台查询开始的条目数
          that.setData({
            imgcount: res.data.data.start,
          });
          //循环往图片数组里添加图片
          for (var i in res.data.data.image) {
            //如果左边一列大就往右边一列放,反之往左边放
            if (right_height >= left_height) {
              that.data.cate_img_left.push(res.data.data.image[i]),
                that.setData({
                  cate_img_left: that.data.cate_img_left,
                });
              left_height = left_height + res.data.data.image[i].img_height
            } else {
              that.data.cate_img_right.push(res.data.data.image[i])
              that.setData({
                cate_img_right: that.data.cate_img_right,
              });
              right_height = right_height + res.data.data.image[i].img_height
            }
          }
        }else{
          wx.showToast({
            title: '暂无图片',
            icon: 'none',
            duration: 1000
          });
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.set_dingshi()
    //初始化属性
    this.height = ''
    this.cate_info = []
    this.cate_img_left = []
    this.cate_img_right = []
    this.cate_left = 0
    this.cate_right = 0
    this.imgcount = 0
    var cate_id = options.cate_id
    var label_id = options.label_id
    var theme_id = options.theme_id
    var search_val = options.search
    var that = this
    //获取屏幕高度
    var window_height = wx.getSystemInfoSync().windowHeight
    this.setData({ condition_infos_height: window_height*0.8 });
    //后台查询分类
    wx.request({
      url: getApp().globalData.api_url + '/getcate3',
      method: 'get',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({ cate_name: res.data });
      }
    })
    //后台查询主题
    wx.request({
      url: getApp().globalData.api_url + '/gettheme2',
      method: 'get',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({ theme_name: res.data });
      }
    })
    if (cate_id != 0){
      that.setData({ img_status: 'cate' });
      that.getcatelist(cate_id)
    }
    if (theme_id != 0){
      that.setData({ img_status: 'theme' });
      that.getthemelist(theme_id)
    }
    if (label_id != 0) {
      that.setData({ img_status: 'label' });
      that.getlabellist(label_id)
    }
    if (search_val != 0) {
      that.setData({ img_status: 'search' });
      that.getsearchlist(search_val)
    }
  },
  //cate搜索
  getcatelist(cate_id){
    var cate_id = cate_id
    var that = this
    //后台查询子分类
    wx.request({
      url: getApp().globalData.api_url + '/getcate2',
      data: { id: cate_id},
      method: 'get',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.setNavigationBarTitle({
          title: res.data.cate_name
        })
        that.setData({ cate_info: res.data.data });
      }
    })
    //后台查询图片
    wx.request({
      url: getApp().globalData.api_url + '/getcateimg',
      data: {
        id: cate_id,
        start: 0,
      },
      method: 'get',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({ progress_width: 100, progress_height: 0});
        var left_height = 0
        var right_height = 0
        if(res.data){
          //设置后台查询开始的条目数
          that.setData({
            imgcount: res.data.start,
          });
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
        }else{
          wx.showToast({
            title: '暂无图片',
            icon: 'none',
            duration: 1000
          });
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
  //theme搜索
  getthemelist(theme_id){
    var that = this
    that.setData({ theme_id: theme_id });
    var theme_id = theme_id
    //后台查询图片
    wx.request({
      url: getApp().globalData.api_url + '/getthemeimg',
      data: {
        id: theme_id,
        start: 0,
      },
      method: 'get',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.setNavigationBarTitle({
          title: res.data.theme_name
        })
        that.setData({ progress_width: 100, progress_height: 0});
        var left_height = 0
        var right_height = 0
        if(res.data.data){
          //设置后台查询开始的条目数
          that.setData({
            imgcount: res.data.data.start,
            cate_info: null
          });
          //循环往图片数组里添加图片
          for (var i in res.data.data.image) {
            //如果左边一列大就往右边一列放,反之往左边放
            if (right_height >= left_height) {
              that.data.cate_img_left.push(res.data.data.image[i]),
                that.setData({
                  cate_img_left: that.data.cate_img_left,
                });
              left_height = left_height + res.data.data.image[i].img_height
            } else {
              that.data.cate_img_right.push(res.data.data.image[i])
              that.setData({
                cate_img_right: that.data.cate_img_right,
              });
              right_height = right_height + res.data.data.image[i].img_height
            }
          }
        }else{
          wx.showToast({
            title: '暂无图片',
            icon: 'none',
            duration: 1000
          });
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
  //label搜索
  getlabellist(label_id) {
    var that = this
    that.setData({ label_id: label_id });
    var label_id = label_id
    //后台查询图片
    wx.request({
      url: getApp().globalData.api_url + '/getlabelimg',
      data: {
        id: label_id,
        start: 0,
      },
      method: 'get',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.setNavigationBarTitle({
          title: res.data.label_name
        })
        that.setData({ progress_width: 100, progress_height: 0 });
        var left_height = 0
        var right_height = 0
        if (res.data.data) {
          //设置后台查询开始的条目数
          that.setData({
            imgcount: res.data.data.start,
            cate_info: null
          });
          //循环往图片数组里添加图片
          for (var i in res.data.data.image) {
            //如果左边一列大就往右边一列放,反之往左边放
            if (right_height >= left_height) {
              that.data.cate_img_left.push(res.data.data.image[i]),
                that.setData({
                  cate_img_left: that.data.cate_img_left,
                });
              left_height = left_height + res.data.data.image[i].img_height
            } else {
              that.data.cate_img_right.push(res.data.data.image[i])
              that.setData({
                cate_img_right: that.data.cate_img_right,
              });
              right_height = right_height + res.data.data.image[i].img_height
            }
          }
        } else {
          wx.showToast({
            title: '暂无图片',
            icon: 'none',
            duration: 1000
          });
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
  //search搜索
  getsearchlist(search_val) {
    var that = this
    var search_val = search_val
    that.setData({ search_val: search_val });
    //后台查询图片
    wx.request({
      url: getApp().globalData.api_url + '/getsearchimg',
      data: {
        val: search_val,
        start: 0,
      },
      method: 'get',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.setNavigationBarTitle({
          title: res.data.search
        })
        that.setData({ progress_width: 100, progress_height: 0});
        var left_height = 0
        var right_height = 0
        if (res.data.data){
          //设置后台查询开始的条目数
          that.setData({
            imgcount: res.data.data.start,
            cate_info: null
          });
          //循环往图片数组里添加图片
          for (var i in res.data.data.image) {
            //如果左边一列大就往右边一列放,反之往左边放
            if (right_height >= left_height) {
              that.data.cate_img_left.push(res.data.data.image[i]),
                that.setData({
                  cate_img_left: that.data.cate_img_left,
                });
              left_height = left_height + res.data.data.image[i].img_height
            } else {
              that.data.cate_img_right.push(res.data.data.image[i])
              that.setData({
                cate_img_right: that.data.cate_img_right,
              });
              right_height = right_height + res.data.data.image[i].img_height
            }
          }
        }else{
          wx.showToast({
            title: '暂无图片',
            icon: 'none',
            duration: 1000
          });
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
  // 滚动加载图片
  loadimg(e){
    this.set_dingshi()
    var page_status = this.data.page_status
    if (page_status){
      this.setData({
        page_status: false
      })
      //获取id
      var cate_id = e.currentTarget.dataset.cate_id
      var theme_id = e.currentTarget.dataset.theme_id
      var label_id = e.currentTarget.dataset.label_id
      var search_val = e.currentTarget.dataset.search_val
      //获取开始的条目数
      var offset_start = e.currentTarget.dataset.offset_start
      if (this.data.img_status == 'cate') {
        this.cate_loadimg(cate_id, offset_start)
      } else if (this.data.img_status == 'theme') {
        this.theme_loadimg(theme_id, offset_start)
      } else if (this.data.img_status == 'label') {
        this.label_loadimg(label_id, offset_start)
      }else if (this.data.img_status == 'search') {
        this.search_loadimg(search_val, offset_start)
      } else if (this.data.img_status == 'all'){
        var cate_id = this.data.cate_id
        var theme_id = this.data.theme_id
        var color_id = this.data.color_id
        this.all_loadimg(cate_id, theme_id, color_id,offset_start)
      }
      wx.getSystemInfo({
        success: (res) => {
          this.setData({
            height: res.windowHeight
          })
        }
      })
    }
  },
  //cate搜索
  cate_loadimg(cate_id, offset_start){
    var that = this
    var cate_id = cate_id
    var offset_start = offset_start
    //后台获取图片
    wx.request({
      url: getApp().globalData.api_url + '/getcateimg',
      data: {
        id: cate_id,
        start: offset_start
      },
      method: 'get',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({ progress_width: 100, progress_height: 0});
        var left_height = that.data.cate_left;
        var right_height = that.data.cate_right;
        if(res.data){
          //设置开始的条目数
          that.setData({
            imgcount: res.data.start,
          });
          if (offset_start != res.data.start) {
            setTimeout(function () {
              that.setData({
                //设置是否加载完成
                page_status: true
              });
            }, 1000)
          }
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
        }else{
          wx.showToast({
            title: '没有图片了',
            icon: 'none',
            duration: 1000
          });
        }
        //设置左右两列的高度
        that.setData({
          cate_left: left_height,
          cate_right: right_height,
          //设置是否加载完成
          // page_status: true
        });
      }
    })
  },
  //theme搜索
  theme_loadimg(theme_id, offset_start) {
    var that = this
    var theme_id = theme_id
    var offset_start = offset_start
    //后台获取图片
    wx.request({
      url: getApp().globalData.api_url + '/getthemeimg',
      data: {
        id: theme_id,
        start: offset_start
      },
      method: 'get',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({ progress_width: 100, progress_height: 0});
        var left_height = that.data.cate_left;
        var right_height = that.data.cate_right;
        if(res.data){
          //设置开始的条目数
          that.setData({
            imgcount: res.data.data.start,
          });
          if (offset_start != res.data.data.start) {
            setTimeout(function () {
              that.setData({
                //设置是否加载完成
                page_status: true
              });
            }, 1000)
          }
          //循环往图片数组里追加图片
          for (var i in res.data.data.image) {
            //如果左边一列大就往右边一列放,反之往左边放
            if (right_height >= left_height) {
              that.data.cate_img_left.push(res.data.data.image[i]),
                that.setData({
                  cate_img_left: that.data.cate_img_left,
                });
              left_height = left_height + res.data.data.image[i].img_height
            } else {
              that.data.cate_img_right.push(res.data.data.image[i])
              that.setData({
                cate_img_right: that.data.cate_img_right,
              });
              right_height = right_height + res.data.data.image[i].img_height
            }
          }
        }else{
          wx.showToast({
            title: '没有图片了',
            icon: 'none',
            duration: 1000
          });
        }
       
        //设置左右两列的高度
        that.setData({
          cate_left: left_height,
          cate_right: right_height,
          // //设置是否加载完成
          // page_status: true
        });
      }
    })
  },
  //theme搜索
  label_loadimg(label_id, offset_start) {
    var that = this
    var label_id = label_id
    var offset_start = offset_start
    //后台获取图片
    wx.request({
      url: getApp().globalData.api_url + '/getlabelimg',
      data: {
        id: label_id,
        start: offset_start
      },
      method: 'get',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({ progress_width: 100, progress_height: 0 });
        var left_height = that.data.cate_left;
        var right_height = that.data.cate_right;
        if (res.data) {
          //设置开始的条目数
          that.setData({
            imgcount: res.data.data.start,
          });
          if (offset_start != res.data.data.start) {
            setTimeout(function () {
              that.setData({
                //设置是否加载完成
                page_status: true
              });
            }, 1000)
          }
          //循环往图片数组里追加图片
          for (var i in res.data.data.image) {
            //如果左边一列大就往右边一列放,反之往左边放
            if (right_height >= left_height) {
              that.data.cate_img_left.push(res.data.data.image[i]),
                that.setData({
                  cate_img_left: that.data.cate_img_left,
                });
              left_height = left_height + res.data.data.image[i].img_height
            } else {
              that.data.cate_img_right.push(res.data.data.image[i])
              that.setData({
                cate_img_right: that.data.cate_img_right,
              });
              right_height = right_height + res.data.data.image[i].img_height
            }
          }
        } else {
          wx.showToast({
            title: '没有图片了',
            icon: 'none',
            duration: 1000
          });
        }

        //设置左右两列的高度
        that.setData({
          cate_left: left_height,
          cate_right: right_height,
          // //设置是否加载完成
          // page_status: true
        });
      }
    })
  },
  //search搜索
  search_loadimg(search_val, offset_start) {
    var that = this
    var search_val = search_val
    var offset_start = offset_start
    //后台获取图片
    wx.request({
      url: getApp().globalData.api_url + '/getsearchimg',
      data: {
        val: search_val,
        start: offset_start
      },
      method: 'get',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({ progress_width: 100, progress_height: 0});
        var left_height = that.data.cate_left;
        var right_height = that.data.cate_right;
        if (res.data.data){
          //设置开始的条目数
          that.setData({
            imgcount: res.data.data.start,
          });
          if (offset_start != res.data.data.start) {
            setTimeout(function () {
              that.setData({
                //设置是否加载完成
                page_status: true
              });
            }, 1000)
          }
          //循环往图片数组里追加图片
          for (var i in res.data.data.image) {
            //如果左边一列大就往右边一列放,反之往左边放
            if (right_height >= left_height) {
              that.data.cate_img_left.push(res.data.data.image[i]),
                that.setData({
                  cate_img_left: that.data.cate_img_left,
                });
              left_height = left_height + res.data.data.image[i].img_height
            } else {
              that.data.cate_img_right.push(res.data.data.image[i])
              that.setData({
                cate_img_right: that.data.cate_img_right,
              });
              right_height = right_height + res.data.data.image[i].img_height
            }
          }
        }else{
          wx.showToast({
            title: '没有图片了',
            icon: 'none',
            duration: 1000
          });
        }
        //设置左右两列的高度
        that.setData({
          cate_left: left_height,
          cate_right: right_height,
          //设置是否加载完成
          // page_status: true
        });
      }
    })
  },
  //筛选搜索
  all_loadimg(cate_id, theme_id, color_id, offset_start) {
    var search = this.data.searchInfoInput
    var contrast = this.data.contrast_id
    var that = this
    //后台获取图片
    wx.request({
      url: getApp().globalData.api_url + '/getallimg',
      data: {
        cate_id: cate_id,
        theme_id: theme_id,
        color_id: color_id,
        search: search,
        contrast: contrast,
        start: offset_start
      },
      method: 'get',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({ progress_width: 100, progress_height: 0});
        var left_height = that.data.cate_left;
        var right_height = that.data.cate_right;
        if(res.data){
          //设置开始的条目数
          that.setData({
            imgcount: res.data.data.start,
          });
          if (offset_start != res.data.data.start) {
            setTimeout(function () {
              that.setData({
                //设置是否加载完成
                page_status: true
              });
            }, 1000)
          }
          //循环往图片数组里追加图片
          for (var i in res.data.data.image) {
            //如果左边一列大就往右边一列放,反之往左边放
            if (right_height >= left_height) {
              that.data.cate_img_left.push(res.data.data.image[i]),
                that.setData({
                  cate_img_left: that.data.cate_img_left,
                });
              left_height = left_height + res.data.data.image[i].img_height
            } else {
              that.data.cate_img_right.push(res.data.data.image[i])
              that.setData({
                cate_img_right: that.data.cate_img_right,
              });
              right_height = right_height + res.data.data.image[i].img_height
            }
          }
        }else{
          wx.showToast({
            title: '没有图片了',
            icon: 'none',
            duration: 1000
          });
        }
        //设置左右两列的高度
        that.setData({
          cate_left: left_height,
          cate_right: right_height,
          //设置是否加载完成
          // page_status: true
        });
      }
    })
  },
  preventTouchMove(){},
  //取消筛选条件
  hide_condition(e){
    // console.log(e.currentTarget.dataset)
    this.setData({
      condition_status: 'condition_bottom',
      condition_height: '0px',
      condition_info_height: '0px',
      hide_height: '0%',
      display: 'none',
      select: true
    });
  },
  //设置定时
  set_dingshi(){
    var that = this
    that.setData({ progress_width: 0, progress_height: 2});
    var timer = setInterval(jindu, 15);
    function jindu() {
      if (that.data.progress_width < 85) {
        that.setData({ progress_width: that.data.progress_width + 1 });
      } else {
        clearInterval(timer)
      }
    }
  },
  //长按事件
  touchstart(e){
    var start_X = e.detail.x
    var start_Y = e.detail.y
    var img_id = e.currentTarget.id
    var that = this
    wx.getStorage({
      key: 'lately_keep',
      success: function (res) {
        console.log(res.data)
        that.setData({
          keep_lately_info: res.data
        })
      },
      fail: function (res) {
        console.log(res)
      }
    });
    this.setData({
      longtap:'block',
      jump_details:'',
      touch_position_x: start_X-50,
      touch_position_y: start_Y-50,
      touch_position_x1: start_X - 35,
      touch_position_y1: start_Y - 60,
      touch_position_x2: start_X - 35,
      touch_position_y2: start_Y - 60,
      touch_position_x3: start_X - 35,
      touch_position_y3: start_Y - 60,
      is_to_keep: img_id,
      to_keep_icon_hide:'flex',
      touchlong:"100vh",
      touchMove:'touchMove',
      touch_move: 'touch_move',
    });
  },
  //手指移动
  touchMove(e){
    var end_X = e.changedTouches[0].clientX
    var end_Y = e.changedTouches[0].clientY
    var start_X = this.data.touch_position_x
    var start_Y = this.data.touch_position_y
    var category = e.currentTarget.dataset.category
    var theme = e.currentTarget.dataset.theme
    var img_id = e.currentTarget.dataset.imgid
    var image = e.currentTarget.dataset.image
    if ((end_X - start_X > 5 && end_X - start_X < 100) && (end_Y - start_Y > 5 && end_Y - start_Y < 50)) {
      var token = getApp().globalData.token
      if (token) {
        this.setData({
          touch_position_x1: start_X - 105,
          touch_position_y1: start_Y + 10,
          touch_position_x2: start_X - 80,
          touch_position_y2: start_Y - 65,
          touch_position_x3: start_X - 5,
          touch_position_y3: start_Y - 95,
          opacity: 1,
        });
      }
    }
  },
  //监听手指离开屏幕
  touchEnd(e){
    var end_X = e.changedTouches[0].clientX
    var end_Y = e.changedTouches[0].clientY
    var start_X = this.data.touch_position_x
    var start_Y = this.data.touch_position_y
    var category = e.currentTarget.dataset.category
    var theme = e.currentTarget.dataset.theme
    var img_id = e.currentTarget.dataset.imgid
    var image = e.currentTarget.dataset.image
    var current_keeps = this.data.keep_lately_info
    this.setData({
      longtap: 'none',
      jump_details: 'jump_details',
      touchMove: '',
      touch_move: '',
      is_to_keep: 0,
      to_keep_icon_hide: 'none',
      opacity: 0,
      touch_position_x1: start_X + 15,
      touch_position_y1: start_Y - 30,
      touch_position_x2: start_X + 15,
      touch_position_y2: start_Y - 30,
      touch_position_x3: start_X + 15,
      touch_position_y3: start_Y - 30,
    });
    if ((end_X - start_X > 5 && end_X - start_X < 100) && (end_Y - start_Y > 5 && end_Y - start_Y < 50)) {
      var token = getApp().globalData.token
      if(!token){
        wx.showToast({
          title: '请先登录',
          icon: 'none',
          duration: 1000
        });
      }else{
        wx.navigateTo({
          url: '../details/to_keepimg?img_id=' + img_id + '&category=' + category + '&theme=' + theme + '&token=' + token + '&image=' + image ,
        })
        return false
      }
    } else if ((end_X - start_X < -35 && end_X - start_X > -105) && (end_Y - start_Y > 10 && end_Y - start_Y < 80)) {
      if (current_keeps && current_keeps.length >= 1) {
        var current_keep = this.data.keep_lately_info[0]
        this.add_keep(current_keep, img_id)
      }
    } else if ((end_X - start_X < -10 && end_X - start_X > -80) && (end_Y - start_Y < 5 && end_Y - start_Y > -65)) {
      if (current_keeps && current_keeps.length >= 2) {
        var current_keep = this.data.keep_lately_info[1]
        this.add_keep(current_keep, img_id)
      }
    } else if ((end_X - start_X > -5 && end_X - start_X < 65) && (end_Y - start_Y < -25 && end_Y - start_Y > -95)) {
      if (current_keeps && current_keeps.length >= 3) {
        var current_keep = this.data.keep_lately_info[2]
        this.add_keep(current_keep, img_id)
      }
    }
  },
  //长按事件
  touchstart2(e) {
    var start_X = e.detail.x
    var start_Y = e.detail.y
    var img_id = e.currentTarget.id
    var that = this
    wx.getStorage({
      key: 'lately_keep',
      success: function (res) {
        console.log(res.data)
        that.setData({
          keep_lately_info: res.data
        })
      },
      fail: function (res) {
        console.log(res)
      }
    });
    this.setData({
      longtap: 'block',
      jump_details: '',
      touch_position_x: start_X - 50,
      touch_position_y: start_Y - 50,
      touch_position_x1: start_X - 35,
      touch_position_y1: start_Y - 60,
      touch_position_x2: start_X - 35,
      touch_position_y2: start_Y - 60,
      touch_position_x3: start_X - 35,
      touch_position_y3: start_Y - 60,
      touchMove: 'true',
      touch_move:'touch_move',
      is_to_keep: img_id,
      to_keep_icon_hide: 'flex',
      touchlong: "100vh",
      touchMove2: 'touchMove2',
    });
  },
  //手指移动
  touchMove2(e) {
    var end_X = e.changedTouches[0].clientX
    var end_Y = e.changedTouches[0].clientY
    var start_X = this.data.touch_position_x
    var start_Y = this.data.touch_position_y
    var category = e.currentTarget.dataset.category
    var theme = e.currentTarget.dataset.theme
    var img_id = e.currentTarget.dataset.imgid
    var image = e.currentTarget.dataset.image
    if ((end_X - start_X > 5 && end_X - start_X < 100) && (end_Y - start_Y > 5 && end_Y - start_Y < 50)) {
      var token = getApp().globalData.token
      if (token) {
        this.setData({
          touch_position_x1: start_X + 135,
          touch_position_y1: start_Y + 10,
          touch_position_x2: start_X + 115,
          touch_position_y2: start_Y - 65,
          touch_position_x3: start_X + 40,
          touch_position_y3: start_Y - 95,
          opacity: 1,
        });
      }
    }
  },
  //监听手指离开屏幕
  touchEnd2(e) {
    var end_X = e.changedTouches[0].clientX
    var end_Y = e.changedTouches[0].clientY
    var start_X = this.data.touch_position_x
    var start_Y = this.data.touch_position_y
    var category = e.currentTarget.dataset.category
    var theme = e.currentTarget.dataset.theme
    var img_id = e.currentTarget.dataset.imgid
    var image = e.currentTarget.dataset.image
    var current_keeps = this.data.keep_lately_info
    this.setData({
      longtap: 'none',
      jump_details: 'jump_details',
      touchMove: '',
      touch_move: '',
      is_to_keep: 0,
      to_keep_icon_hide: 'none',
      opacity: 0,
      touch_position_x1: start_X + 15,
      touch_position_y1: start_Y - 30,
      touch_position_x2: start_X + 15,
      touch_position_y2: start_Y - 30,
      touch_position_x3: start_X + 15,
      touch_position_y3: start_Y - 30,
    });
    if ((end_X - start_X > 5 && end_X - start_X < 100) && (end_Y - start_Y > 5 && end_Y - start_Y < 50)) {
      var token = getApp().globalData.token
      if (!token) {
        wx.showToast({
          title: '请先登录',
          icon: 'none',
          duration: 1000
        });
      } else {
        wx.navigateTo({
          url: '../details/to_keepimg?img_id=' + img_id + '&category=' + category + '&theme=' + theme + '&token=' + token + '&image=' + image,
        })
        return false
      }
    } else if ((end_X - start_X > 135 && end_X - start_X < 205) && (end_Y - start_Y > 10 && end_Y - start_Y < 80)) {
      if (current_keeps && current_keeps.length >= 1) {
        var current_keep = this.data.keep_lately_info[0]
        this.add_keep(current_keep, img_id)
      }
    } else if ((end_X - start_X > 115 && end_X - start_X < 185) && (end_Y - start_Y < 5 && end_Y - start_Y > -65)) {
      if (current_keeps && current_keeps.length >= 2) {
        var current_keep = this.data.keep_lately_info[1]
        this.add_keep(current_keep, img_id)
      }
    } else if ((end_X - start_X > 40 && end_X - start_X < 110) && (end_Y - start_Y < -25 && end_Y - start_Y > -95)) {
      if (current_keeps && current_keeps.length >= 3) {
        var current_keep = this.data.keep_lately_info[2]
        this.add_keep(current_keep, img_id)
      }
    }
  },
  //快捷添加到收藏夹
  add_keep(current_keep, img_id) {
    var uid = current_keep.uid
    var keep_id = current_keep.id
    var img_id = img_id
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
          wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 1000
          });
        }
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
    // this.animation = wx.createAnimation({
    //   duration: 5000,
    //   timingFunction: "linear",
    //   delay: 0,
    //   transformOrigin: "50% 50%",
    // })
    // this.animation.width('85%').step()
    // this.setData({
    //   animationData: this.animation.export()
    // })
    // this.set_dingshi()
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
    this.setData({
      condition_status: 'condition_bottom',
      condition_height: '0px',
      condition_info_height: '0px',
      hide_height: '0%'
    });
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