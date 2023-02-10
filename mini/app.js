import {ulinkCore,ulinkUI} from './utils/ulinkSDK'
const options = {
  sAppId: 'ULINK-CSQS-772427', // Ulink 活动的 AppId
  iActId: '', // Ulink 活动 Id
  apiRoute: '', // Ulink 活动的 api 路由
  game: '', // 游戏的业务代码
  wxAppId: '', // 微信小程序的 AppId
  qqAppId: '', // QQ 小程序的 AppId,
  wx, // wx对象必须传递
}
ulinkCore.init(options)
ulinkUI.init(options)
App({
  data:{
    error:{}
  }
})
