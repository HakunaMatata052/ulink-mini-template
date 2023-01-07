const ulinkCore = requirePlugin('ulink-mini-core')
const options = {
  sAppId: 'ULINK-CSQS-772427', // Ulink 活动的 AppId
  iActId: '9282', // Ulink 活动 Id
  apiRoute: 'https://ulinkact.game.qq.com/app/7344/18a91ec36d2666be/index.php', // Ulink 活动的 api 路由
  game: 'yxzj', // 游戏的业务代码
  wxAppId: 'wx17df2ad603406287', // 微信小程序的 AppId
  qqAppId: '', // QQ 小程序的 AppId,
  wx, // wx对象必须传递
}
ulinkCore.init(options)
App({
  data:{
    error:{}
  }
})
