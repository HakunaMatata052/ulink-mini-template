import { createStoreBindings } from "../../miniprogram_npm/mobx-miniprogram-bindings/index"
import { store } from "../../utils/store"
import message from '../../utils/message'
import {postUser} from '../../utils/apis'
const Ulink = requirePlugin('ulink-mini-core')
const componentOptions = {
  // 组件选项
  options: {
    multipleSlots: true,
    addGlobalClass: true
  },
  behaviors: [],
  properties: {
    customStyle:{
      type: String,
      value:''
    },
  },
  // 组件数据
  data: {
    useEditProfile:false,
    editProfileShow:false,
    isPageHidden: false, // 页面是否处于隐藏状态
    canIUseGetUserProfile: false,
  },
  // 数据监听器
  observers: {},
  // 组件方法
  methods: {
    getUserProfile() {
      // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
      // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
      wx.getUserProfile({
        desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: async (res) => {
          this.emit(res.userInfo)
        }
      })
    },
    getUserInfo(e) {
      // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
      this.emit(e.detail.userInfo)
    },
    getEditProfile(e){
      this.emit(e.detail.userInfo)
    },
    onClick() {
      this.triggerEvent('getUserInfo', {
        userInfo: store.userInfo
      })
    },
    async emit(e){
      try {
        const userInfo ={nickname:e.nickName.trim().substr(0,8), avatar:e.avatarUrl}
        const {data} = await postUser(userInfo)
        if(data){
          await store.setUserInfo(userInfo)
          this.triggerEvent('getUserInfo', {
            userInfo
          })
          this.data.editProfileShow && this.hideEditProfile()
          store.getUserInfo() //  为了回显IP属地
        }
      }catch(err){
        message.info(err?.sMsg.replace('，','，\r\n'))
      }
    },
    showEditProfile(){
      this.setData({
        editProfileShow:true
      })
    },
    hideEditProfile(){
      this.setData({
        editProfileShow:false
      })
    }
  },
  // 组件生命周期
  lifetimes: {
    created() {
      this.storeBindings = createStoreBindings(this, {
        store,
        fields: ["userInfo"]
      })
    },
    async attached() {
      const {SDKVersion} = wx.getSystemInfoSync()
      if(Ulink.CONSTS.isWechat && Ulink.checkVersion(SDKVersion,'2.21.2')===1){
        // 完善弹窗
        this.setData({
          useEditProfile:true
        })
      }else{
        // 授权
        if (wx.getUserProfile) {
          this.setData({
            canIUseGetUserProfile: true
          })
        }
      }
    },
    ready() { },
    moved() { },
    detached() {
      // 销毁全局状态管理
      this.storeBindings.destroyStoreBindings()
    },
  },
  definitionFilter() { },
  // 页面生命周期
  pageLifetimes: {
    // 页面被展示
    show() {
      const { isPageHidden } = this.data
      // show事件发生前，页面不是处于隐藏状态时
      if (!isPageHidden) {
        return
      }
      // 重新执行定时器等操作
    },
    // 页面被隐藏
    hide() {
      this.setData({
        isPageHidden: true,
      })
      // 清除定时器等操作
    },
    // 页面尺寸变化时
    resize() { },
  },
}
Component(componentOptions)
