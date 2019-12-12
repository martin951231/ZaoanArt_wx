// pages/find/keepimg/keepimg.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    options:null,
    keep_id:0,
    keep_name:null,
    keepimg_info:[],
    keep_info:[],
    keep_info1:[],
    cate_img_left: [],
    cate_img_right: [],
    cate_img:[],
    cate_left: 0,
    cate_right: 0,
    imgcount: 0,
    is_mykeep:0,
    checkValue:[],
    is_manage:false,
    hiddenmodalput1: true,
    hiddenmodalput2: true,
    hiddenmodalput3: true,
    hiddenmodalput4: true,
    hiddenmodalput5: true,
    hiddenmodalput6:true,
    delete_arr: [],
    move_arr: [],
    copy_arr:[],
    is_checkbox_all:false,
    username:'',
    count:0,
    keepname2:'',
    icon:'',
    is_attention: false,
    attention_num:0,
    uid:null,
    input_margin: '',
    longtap: 'none',
    jump_details: 'jump_details',
    touch_position_x: 0,
    touch_position_y: 0,
    touch_position_x1: 0,
    touch_position_y1: 0,
    touch_position_x2: 0,
    touch_position_y2: 0,
    touch_position_x3: 0,
    touch_position_y3: 0,
    opacity: 0,
    is_to_keep: '',
    to_keep_icon_hide: 'none',
    touchlong: '',
    keep_lately_info: [],
    touchMove: '',
    touchMove2: '',
    touch_move: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var keep_id = options.keep_id
    var keep_name = options.keep_name
    var username = options.username
    var is_mykeep = options.is_mykeep
    var uid = options.uid
    this.setData({ keep_id: keep_id, keep_name: keep_name, is_mykeep: is_mykeep, options: options, username: username,uid:uid});
    // this.getindex(keep_id, keep_name, is_mykeep)
    if(is_mykeep == 2){
      wx.setNavigationBarTitle({
        title: '我的收藏夹'
      })
    }else if(is_mykeep == 1){
      wx.setNavigationBarTitle({
        title: '推荐收藏夹'
      })
    } else if (is_mykeep == 3){
      wx.setNavigationBarTitle({
        title: '用户收藏夹'
      })
    }
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
  touch_move() {
    return;
  },
  //添加关注
  add_attention(e) {
    var keep_id = e.currentTarget.dataset.keep_id
    var token = getApp().globalData.token
    var that = this
    if (!token) {
      wx.switchTab({
        url: '../home/index',
      })
    } else {
      wx.showLoading({
        title: '正在添加...',
      });
      //添加关注
      wx.request({
        url: getApp().globalData.api_url + '/add_attention',
        data: {
          token: token,
          keep_id: keep_id
        },
        method: 'get',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          wx.hideLoading()
          if (res.data == 1) {
            wx.showToast({
              title: '添加成功',
              icon: 'success',
              duration: 1000
            });
            that.getindex(that.data.keep_id, that.data.keep_name, that.data.is_mykeep)
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
  //取消关注
  del_attention(e) {
    var keep_id = e.currentTarget.dataset.keep_id
    var token = getApp().globalData.token
    var that = this
    if (!token) {
      wx.switchTab({
        url: '../home/index',
      })
    } else {
      wx.showLoading({
        title: '正在取消...',
      });
      //取消关注
      wx.request({
        url: getApp().globalData.api_url + '/del_attention',
        data: {
          token: token,
          keep_id: keep_id
        },
        method: 'get',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          wx.hideLoading()
          if (res.data == 1) {
            wx.showToast({
              title: '取消成功',
              icon: 'success',
              duration: 1000
            });
            that.getindex(that.data.keep_id, that.data.keep_name, that.data.is_mykeep)
          } else if (res.data == 2) {
            wx.showToast({
              title: '取消失败',
              icon: 'none',
              duration: 1000
            });
          }
        }
      })
    }
  },
  //获取首屏数据
  getindex(keep_id, keep_name, is_mykeep){
    var that = this
    var token = getApp().globalData.token
    that.setData({
      cate_left: 0,
      cate_right: 0,
      cate_img_left: [],
      cate_img_right: []
    });
    wx.request({
      url: getApp().globalData.api_url + '/getkeepimg',
      method: 'get',
      data: { keep_id: keep_id, start: 0 ,token:token},
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        //设置后台查询开始的条目数
        that.setData({
          imgcount: res.data.start,
          cate_img: res.data.image,
          count: res.data.count,
          icon: res.data.icon,
          is_attention: res.data.is_attention,
          attention_num: res.data.attention_num,
        });
        var img = res.data.image
        that.grouping(img)
      }
    })
  },
  //滚动到底部加载数据
  loadimg3(e){
    var token = getApp().globalData.token
    //获取id
    var keep_id = e.currentTarget.dataset.keep_id
    //获取开始的条目数
    var offset_start = e.currentTarget.dataset.offset_start
    var that = this
    //后台获取图片
    wx.request({
      url: getApp().globalData.api_url + '/getkeepimg',
      data: {
        keep_id: keep_id,
        start: offset_start,
        token: token
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
        var img = res.data.image
        that.grouping(img)
      }
    })
  },
  //数据左右分组
  grouping(img){
    var that = this
    var left_height = 0
    var right_height = 0
    //循环往图片数组里添加图片
    for (var i in img) {
      //如果左边一列大就往右边一列放,反之往左边放
      if (right_height >= left_height) {
        that.data.cate_img_left.push(img[i]),
          that.setData({
            cate_img_left: that.data.cate_img_left,
          });
        left_height = left_height + img[i].img_height
      } else {
        that.data.cate_img_right.push(img[i])
        that.setData({
          cate_img_right: that.data.cate_img_right,
        });
        right_height = right_height + img[i].img_height
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
  },
  //跳转到详情页
  jump_details: function (option) {
    var id = option.currentTarget.id
    wx.navigateTo({
      url: '../../index/details/details?img_id=' + id,
    })
  },
  //批量选择
  batch_update(){
    var is_manage = !this.data.is_manage
    this.setData({
      is_manage: is_manage
    });
  },
  //是否全选
  checkbox_all(e){
    var arr_left = this.data.cate_img_left
    var arr_right = this.data.cate_img_right
    if (this.data.is_checkbox_all){
      this.data.is_checkbox_all = false
      for (var i = 0; i < arr_left.length; i++) {
        arr_left[i].checked = false
      }
      for (var i = 0; i < arr_right.length; i++) {
        arr_right[i].checked = false
      }
      this.setData({
        cate_img_left: arr_left,
        cate_img_right: arr_right,
      })
    }else{
      this.data.is_checkbox_all = true
      for (var i = 0; i < arr_left.length; i++) {
        arr_left[i].checked = true
      }
      for (var i = 0; i < arr_right.length; i++) {
        arr_right[i].checked = true
      }
      this.setData({
        cate_img_left: arr_left,
        cate_img_right: arr_right,
      })
    }
  },
  //关闭模态框
  cancelM1: function (e) {
    this.setData({
      hiddenmodalput1: true,
    })
  },
  //关闭模态框
  cancelM2: function (e) {
    this.setData({
      hiddenmodalput2: true,
    })
  },
  //关闭模态框
  cancelM3: function (e) {
    this.setData({
      hiddenmodalput3: true,
    })
  },
  //关闭模态框
  cancelM4: function (e) {
    this.setData({
      hiddenmodalput4: true,
    })
  },
  //关闭模态框
  cancelM5: function (e) {
    this.setData({
      hiddenmodalput5: true,
    })
  },
  //批量删除
  batch_delete(){
    var array = this.get_batch()
    if(!array){
      return false
    }
    this.setData({
      hiddenmodalput1: false,
      delete_arr: array
    })
  },
  //批量移动
  batch_move() {
    var token = getApp().globalData.token
    var array = this.get_batch()
    if (!array) {
      return false
    }
    //跳转到批量操作收藏夹页面
    wx.navigateTo({
      url: './to_keepimg?token=' + token + '&img_array=' + array + '&keep_id=' + this.data.keep_id + '&keep_name=' + this.data.keep_name+'&edit_status=1',
    })
    // this.batch_update()
    return false
    var that = this
    //后台查询收藏夹
    wx.request({
      url: getApp().globalData.api_url + '/getukeep2',
      data: { token: token, keep_id: that.data.keep_id},
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
    that.setData({
      move_arr: array
    })
  },
  //关闭批量移动框
  hiddenmodalput2_hidden(){
    this.setData({
      hiddenmodalput2: true,
    })
  },
  //批量移动
  move_to_keep(event){
    var token = getApp().globalData.token
    var to_keep_id = event.currentTarget.dataset.to_keep_id
    var keep_id = this.data.keep_id
    var move_arr = this.data.move_arr
    var arr_left = this.data.cate_img_left
    var arr_right = this.data.cate_img_right
    var that = this
    wx.showLoading({
      title: '正在移动...',
    });
    //移动图片
    wx.request({
      url: getApp().globalData.api_url + '/moveimg',
      data: { token: token, keep: keep_id, to_keep: to_keep_id, img_id: that.data.move_arr },
      method: 'get',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data == 1) {
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
        that.setData({
          cate_img_left: [],
          cate_img_right: [],
          hiddenmodalput2: true,
          move_arr: '',
        })
        var img = [];
        for (var i = 0; i < arr_left.length; i++) {
          if (arr_left[i].checked) {
          } else {
            img.push(arr_left[i])
          }
        }
        for (var i = 0; i < arr_right.length; i++) {
          if (arr_right[i].checked) {
          } else {
            img.push(arr_right[i])
          }
        }
        that.grouping(img)
      }
    })
  },
  //批量复制
  batch_copy() {
    var token = getApp().globalData.token
    var array = this.get_batch()
    if (!array) {
      return false
    }
    //跳转到批量操作收藏夹页面
    wx.navigateTo({
      url: './to_keepimg?token=' + token + '&img_array=' + array + '&keep_id=' + this.data.keep_id + '&keep_name=' + this.data.keep_name + '&edit_status=2',
    })
    // this.batch_update()
    return false
    var that = this
    //后台查询收藏夹
    wx.request({
      url: getApp().globalData.api_url + '/getukeep2',
      data: { token: token, keep_id: that.data.keep_id },
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
            keep_info1: res.data,
          });
        }
      }
    })
    this.setData({
      copy_arr: array
    })
  },
  //批量复制
  copy_to_keep(event) {
    var token = getApp().globalData.token
    var to_keep_id = event.currentTarget.dataset.to_keep_id
    var keep_id = this.data.keep_id
    var copy_arr = this.data.copy_arr
    var arr_left = this.data.cate_img_left
    var arr_right = this.data.cate_img_right
    var that = this
    wx.showLoading({
      title: '正在复制...',
    });
    wx.request({
      url: getApp().globalData.api_url + '/copyimg',
      data: { token: token, keep: keep_id, to_keep: to_keep_id, img_id: that.data.copy_arr },
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
        } else {
          wx.showToast({
            title: '复制失败',
            icon: 'none',
            duration: 1000
          });
          return false
        }
        that.setData({
          hiddenmodalput3: true,
          copy_arr: '',
        })
        for (var i = 0; i < arr_left.length; i++) {
          if (arr_left[i].checked) {
            arr_left[i].checked = false
          }
        }
        for (var i = 0; i < arr_right.length; i++) {
          if (arr_right[i].checked) {
            arr_right[i].checked = false
          }
        }
        that.setData({
          cate_img_left: arr_left,
          cate_img_right: arr_right,
        })
      }
    })
  },
  //获取编辑列表
  get_batch(){
    var array_left = this.data.cate_img_left
    var array_right = this.data.cate_img_right
    var check_arr = '';
    for (var i = 0; i < array_left.length; i++) {
      if (array_left[i].checked) {
        check_arr = check_arr + ',' + array_left[i].id
        // check_arr.push(array_left[i].id)
      }
    }
    for (var i = 0; i < array_right.length; i++) {
      if (array_right[i].checked) {
        check_arr = check_arr + ',' + array_right[i].id
        // check_arr.push(array_right[i].id)
      }
    }
    if (check_arr.length>0){
      return check_arr
    }else{
      wx.showToast({
        title: '请选择图片',
        icon: 'none',
        duration: 1000
      });
      return false;
    }
  },
  //模态框点确认
  confirmM1: function (e) {
    var token = getApp().globalData.token
    var delete_arr = this.data.delete_arr
    var keep_id = this.data.keep_id
    var arr_left = this.data.cate_img_left
    var arr_right = this.data.cate_img_right
      wx.showLoading({
        title: '正在删除...',
      });
      var that = this
      //删除图片
      wx.request({
        url: getApp().globalData.api_url + '/deleteimg',
        data: { token: token, keep: keep_id, img_id: that.data.delete_arr},
        method: 'get',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          wx.hideLoading()
          if (res.data == 1) {
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 1000
            });
          } else{
            wx.showToast({
              title: '删除失败',
              icon: 'none',
              duration: 1000
            });
            return false
          }
          that.setData({
            cate_img_left: [],
            cate_img_right: [],
            hiddenmodalput1: true,
            delete_arr: '',
          })
          var img = [];
          for (var i = 0; i < arr_left.length;i++){
            if (arr_left[i].checked) {
            }else{
              img.push(arr_left[i])
            }
          }
          for (var i = 0; i < arr_right.length; i++) {
            if (arr_right[i].checked) {
            } else {
              img.push(arr_right[i])
            }
          }
          that.grouping(img)
        }
      })
  },
  //获取模态框输入信息
  keepname2(e) {
    this.setData({
      keepname2: e.detail.value
    })
  },
  //模态框点确认
  confirmM4: function (e) {
    var token = getApp().globalData.token
    var keep_id = this.data.options.keep_id
    if (!this.data.keepname2) {
      wx.showToast({
        title: '收藏夹名不能为空',
        icon: 'none',
        duration: 1000
      });
    } else {
      this.setData({
        hiddenmodalput4: true,
      })
      wx.showLoading({
        title: '正在修改...',
      });
      var that = this
      //获取我的收藏夹
      wx.request({
        url: getApp().globalData.api_url + '/updatekeep',
        data: { token: token, keep_id: keep_id, keep_name: that.data.keepname2 },
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
            that.setData({
              keep_name: that.data.keepname2
            })
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
  confirmM5: function (e) {
    var token = getApp().globalData.token
    var keep_id = this.data.options.keep_id
    this.setData({
      hiddenmodalput5: true,
    })
    wx.showLoading({
      title: '删除中...',
    });
    var that = this
    //删除收藏夹
    wx.request({
      url: getApp().globalData.api_url + '/deletekeep',
      data: { token: token, keep_id: keep_id },
      method: 'get',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data == 0) {
          console.log(keep_id)
          wx.getStorage({
            key: 'lately_keep',
            success: function (res) {
              var datas = new Array()
              for (var i in res.data) {
                if (res.data[i].id == keep_id){

                }else{
                  datas.push(res.data[i])
                }
              }
              wx.setStorage({
                key: "lately_keep",
                data: datas
              })
            },
          });
          wx.showToast({
            title: '删除成功',
            icon: 'none',
            duration: 1000
          });
          wx.navigateBack({
            delta: 1
          })
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
  checkbox: function (e) {
    var index = e.currentTarget.dataset.left_index;//获取当前点击的下标
    var checkboxArr1 = this.data.cate_img_left;//选项集合
    checkboxArr1[index].checked = !checkboxArr1[index].checked;//改变当前选中的checked值
    this.setData({
      cate_img_left: checkboxArr1
    });
  },
  checkbox2: function (e) {
    var index = e.currentTarget.dataset.right_index;//获取当前点击的下标
    var checkboxArr2 = this.data.cate_img_right;//选项集合
    checkboxArr2[index].checked = !checkboxArr2[index].checked;//改变当前选中的checked值
    this.setData({
      cate_img_right: checkboxArr2
    });
  },
  //弹出编辑名字modal框
  edit_name(options) {
    var keep_id = options.currentTarget.dataset.keep_id
    this.setData({
      keep_id: keep_id,
      hiddenmodalput6:false
    })
    // var that = this
    // wx.showActionSheet({
    //   itemList: ['重命名', '删除'],
    //   success(res) {
    //     if (res.tapIndex == 0) {
    //       that.setData({
    //         hiddenmodalput4: false,
    //       })
    //     } else if (res.tapIndex == 1) {
    //       that.setData({
    //         hiddenmodalput5: false,
    //       })
    //     }
    //   },
    //   fail(res) {
    //   }
    // })
  },
  //隐藏重命名模态框
  edit_name_hide(e){
    this.setData({
      hiddenmodalput6: true
    })
  },
  //重置收藏夹名
  rename(){
    this.setData({
      hiddenmodalput4: false,
      hiddenmodalput6: true
    })
  },
  //删除收藏夹
  delkeep(){
    this.setData({
      hiddenmodalput5: false,
      hiddenmodalput6: true
    })
  },
  //跳转到当前用户的收藏夹
  current_user(e){
    var uid = e.currentTarget.dataset.uid
    wx.navigateTo({
      url: './current_user?uid=' + uid,
    })
  },
  //长按事件
  touchstart(e) {
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
      touch_position_y: start_Y - 80,
      touch_position_x1: start_X - 35,
      touch_position_y1: start_Y - 60,
      touch_position_x2: start_X - 35,
      touch_position_y2: start_Y - 60,
      touch_position_x3: start_X - 35,
      touch_position_y3: start_Y - 60,
      is_to_keep: img_id,
      to_keep_icon_hide: 'flex',
      touchlong: "100vh",
      touchMove: 'touchMove',
      touch_move: 'touch_move',
    });
  },
  //手指移动
  touchMove(e) {
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
  touchEnd(e) {
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
          url: '../../index/details/to_keepimg?img_id=' + img_id + '&category=' + category + '&theme=' + theme + '&token=' + token + '&image=' + image,
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
    console.log(123)
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
      touch_position_y: start_Y - 80,
      touch_position_x1: start_X - 35,
      touch_position_y1: start_Y - 60,
      touch_position_x2: start_X - 35,
      touch_position_y2: start_Y - 60,
      touch_position_x3: start_X - 35,
      touch_position_y3: start_Y - 60,
      touchMove: 'true',
      touch_move: 'touch_move',
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
          url: '../../index/details/to_keepimg?img_id=' + img_id + '&category=' + category + '&theme=' + theme + '&token=' + token + '&image=' + image,
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
    //设置左右两列的高度
    this.getindex(this.data.keep_id, this.data.keep_name, this.data.is_mykeep)
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