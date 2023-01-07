import {store} from '../utils/store'
import Request from '../utils/request'
import message from '../utils/message'
import config from '../utils/config'
const Ulink = requirePlugin('ulink-mini-core')
const _page = Page
Page = function (pageConfig) {
  // 添加navbar高度属性
  const {height:menuButtonHeight, top ,bottom} = wx.getMenuButtonBoundingClientRect()
  const {statusBarHeight,screenWidth} = wx.getSystemInfoSync()
  const rpx2px = rpx => rpx * (screenWidth / 750)
  const pageTopHeight = menuButtonHeight + statusBarHeight + rpx2px(15)
  const _data = pageConfig.data
  pageConfig.data = {
    PAGETOPHEIGHT:pageTopHeight,
    ..._data
  }
  // 重写onLoad方法
  const _pageOL = pageConfig.onLoad
  pageConfig.onLoad = function (e) {
    if(typeof pageConfig.onLoad === "function") {
      console.log('query',e)
      _pageOL && _pageOL.call(this, e)
    }
  }
  // 重写onShow方法
  const _pageOS = pageConfig.onShow
  let startTime
  pageConfig.onShow = function (e) {
    if(typeof pageConfig.onShow === "function") {
      const pages = getCurrentPages()
      // 计时开始
      startTime = Date.now()
      const routeName = this.route.split('/')[2]
      let adtag = `${config.init.game}.gongjuxiang.${routeName}.show`
      if(this.options.id){
        adtag = `${config.init.game}.gongjuxiang.${routeName}.${this.options.id}.show`
      }
      if(this.options.type){
        adtag = `${config.init.game}.gongjuxiang.${routeName}.${this.options.type}.show`
      }
      Ulink.easReportADTAG({
        e_code: '',
        adtag,
        actid: config.init.iActId,
        acttype: "ulink",
      })
      _pageOS && _pageOS.call(this, e)
    }
  }
  // 重写onHide方法
  const _pageOH = pageConfig.onHide
  pageConfig.onHide = function (e) {
    if(typeof pageConfig.onHide === "function") {
      const pages = getCurrentPages()
      const endTime = Date.now()
      const stayTime = endTime - startTime
      const routeName = this.route.split('/')[2]
      // 计时结束 开始上报
      let adtag = `${config.init.game}.gongjuxiang.${routeName}.duration`
      if(this.options.id){
        adtag = `${config.init.game}.gongjuxiang.${routeName}.${this.options.id}.duration`
      }
      if(this.options.type){
        adtag = `${config.init.game}.gongjuxiang.${routeName}.${this.options.type}.duration`
      }
      Ulink.easReportADTAG({
        e_code: stayTime,
        adtag,
        actid: config.init.iActId,
        acttype: "ulink",
      })
      _pageOH && _pageOH.call(this, e)
    }
  }
  // 重写onUnload方法
  const _pageOU = pageConfig.onUnload
  pageConfig.onUnload = function (e) {
    if(typeof pageConfig.onUnload === "function") {
      const pages = getCurrentPages()
      const endTime = Date.now()
      const stayTime = endTime - startTime
      const routeName = this.route.split('/')[2]
      // 计时结束 开始上报
      let adtag = `${config.init.game}.gongjuxiang.${routeName}.duration`
      if(this.options.id){
        adtag = `${config.init.game}.gongjuxiang.${routeName}.${this.options.id}.duration`
      }
      if(this.options.type){
        adtag = `${config.init.game}.gongjuxiang.${routeName}.${this.options.type}.duration`
      }
      Ulink.easReportADTAG({
        e_code: stayTime,
        adtag,
        actid: config.init.iActId,
        acttype: "ulink",
      })
      _pageOU && _pageOU.call(this, e)
    }
  }
  // 埋点
  pageConfig.EAS = function(e){
    const pages = getCurrentPages()
    const {name , code} = e.currentTarget ? e.currentTarget.dataset : e
    Ulink.easReportADTAG({
      e_code: code || '',
      adtag: `${config.init.game}.gongjuxiang.${name}`,
      actid: config.init.iActId,
      acttype: "ulink",
    })
  }
  // 添加全局页面跳转方法
  pageConfig.GOTO = function(e){
    // 跳转页面（解决小程序页面跳转深度只有10层的限制）
    if(e===-1){
      wx.navigateBack({
        fail:()=>{
          wx.switchTab({
            url:'/pages/main/main'
          })
        }
      })
      return
    }
    const url = e.type == 'tap' && e.currentTarget.dataset.url.indexOf('/pages') >= 0 ? e.currentTarget.dataset.url : e
    wx.navigateTo({
      url,
      complete(done) {},
      fail(err) {
        wx.redirectTo({
          url
        })
      },
      success(ok) {},
    })
  }
  // 添加全局message方法
  pageConfig.MESSAGE = message
  return _page(pageConfig)
}