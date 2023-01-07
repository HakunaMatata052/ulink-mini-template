import {getInit,bindRole,joinTeam,recordDyState,getTeamGift,getShareInfo,newOpenRedEnvelope} from '../../utils/apis'
import message from '../../utils/message'
import {formatSeconds,debounce} from '../../utils/util'
import {homeGift,giftList} from '../../utils/gift'
const app = getApp()
const ulinkCore = requirePlugin('ulink-mini-core')
const rpx2px = rpx => rpx * (wx.getSystemInfoSync().screenWidth / 750)
let maxTeamNum = 5
if(__wxConfig.envVersion=='develop'){
  // 开发环境2人即可组队成功
  maxTeamNum = 2
}
Page({
  isFirst:true,
  data: {
    pop:{
      type:0,
      message:''
    },
    roleSelectorOptions: {
      title: '',
      systemText: '请选择系统：',
      areaText: '请选择大区：',
      serverText: '请选择服务器：',
      roleText: '请选择角色：',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      filterChannel: ['some_channel'],
      filterServer: ['some_server'],
      retryText: '尝试重新获取',
      requestErrorText: '网络不稳定~',
      loginSuccessText: '数据更新成功',
      showLog: true,
      type: 'roleSelect', // 默认为roleSelect，表示当前为角色选择器，设置为channelSelect时，表示当前为大区选择器
      showChannel: true, // 是否展示渠道下拉框
    },
    homeGift,
    giftList,
    maxTeamNum,// 组队需要多少人
    isMaster: 1, // 页面状态，1主态，2客态
    actMode: 1, // 0未开启不可参与活动，1已开启可正常参与活动，2已开启使用兜底模式参与活动
    bindInfo:{}, // 绑定信息
    teamList:{
      members: 0, // 当前队伍人数
      isJoinTeam: 0, // 当前用户是否已入队
      isTeamMember: 0, // 当前用户是否在当前队伍中
      list: []
    }, // 队伍信息
    redInfo:{
      sPackageName:'',
      expires:'', // 红包倒计时
    },
    teamGiftNum:0, // 组队奖励资格
    defaultNum:0, // 红包奖励资格
    defaultData: { // 兜底红包
      sPackageId: "",
      sPackageName: ""
    },
    redEnvelopeAnimation:'', //红包动画
  },
  onLoad(query) {
    console.log('pageQuery',query)
    this.pageQuery = query
  },
  onShow(){
    if(!this.checkStatus()) return
    if(this.isFirst){
      this.isFirst = false
      this.init()
    }else{
      this.debounceInit()
    }
  },
  onShareAppMessage(e){
    let shareType
    if(e.from =='menu'){
      // 分享活动
      shareType = 1
    }else if(e.from=='button' && e.target.dataset.type=='team'){
      // 分享队伍
      shareType = 2
    }else if(e.from=='button' && e.target.dataset.type=='red'){
      // 分享红包
      shareType = 3
    }
    const promise = (this.data.actMode==2 || app.data.error.iRet === 20010)?null:this.getShareInfo(shareType)
    const shareInfo = {
      ...this.defaultShareInfo(shareType),
      promise
    }
    console.log(shareInfo)
    return shareInfo
  },
  async init(){
    try{
      const sOpenid = this.pageQuery && this.pageQuery.sOpenid ? this.pageQuery.sOpenid: ''
      const res = await getInit({sOpenid})
      if(res){
        const {data} = res
        app.data.initData = data
        this.checkSubscribe()
        this.setData({
          actMode:data.actMode,
          isMaster:data.isMaster,
          bindInfo:data.bindInfo,
          teamList:data.teamInfo,
          teamGiftNum:data.hold.teamGift,
          defaultNum:data.hold.default,
          defaultData:data.defaultData
        })
      }
    }catch(err){
    }
  },
  // init防抖
  debounceInit:debounce(function(){
    this.init()
  },300),
  // 加入队伍
  joinTeam(){
    if(!this.checkStatus()) return
    if(!this.checkBind()) return
    if(app.data.initData.isLoginGame==0){
      this.dialog(4,'今日未登录游戏,请先登录再参加活动哟! ')
      return
    }
    const {sOpenid, sDate, sToken} = this.pageQuery
    const {teamInfo,userInfo,hold} = app.data.initData
    joinTeam({
      sOpenid, sDate, sToken
    }).then(res=>{
      hold.teamGiftNum>0?hold.teamGiftNum--:null
      teamInfo.members ++
      teamInfo.isJoinTeam = 1
      teamInfo.isTeamMember = 1
      teamInfo.list.push({
        openid:sOpenid,
        headImg:userInfo.headImg,
        nickName:userInfo.nickName,
      })
      this.setData({
        teamList:teamInfo,
        teamGiftNum:hold.teamGiftNum
      })
      this.checkSubscribe()
    }).catch(err=>{
      if(err && err.iRet===-20104){
        this.dialog(4,'今日未登录游戏,请先登录再参加活动哟! ')
      }else{
        this.alert(err.sMsg)
      }
    })
  },
  // 检查订阅
  checkSubscribe(){
    const {teamInfo,userInfo} = app.data.initData
    if(teamInfo.members < maxTeamNum && userInfo.teamDyState === 0){
      wx.showModal({
        title: '亲爱的召唤师',
        content: '本活动将在您的队伍满队后，通过订阅给您发送通知，领取奖励',confirmText: '同意',cancelText: '拒绝',
        success: (res) =>{
          if (res.confirm) {
            this.subscribe()
          }
        }
      })
    }
  },
  // 兜底模式打开红包
  openRedEnvelope(){
    if(!this.checkStatus()) return
    if(!this.checkBind()) return
    this.setData({
      redEnvelopeAnimation:'an'
    })
    let loading = false
    setTimeout(() => {
      loading = true
      message.loading()
    }, 600)
    newOpenRedEnvelope().then(res=>{
      if(loading==true){
        message.hideLoading()
      }
      const {hold} = app.data.initData
      hold.default--
      this.setData({
        defaultNum:hold.default,
        defaultData:{
          sPackageId:res.data.sPackageId,
          sPackageName:res.data.sPackageName
        }
      })
      this.dialog(8)
    }).catch(err=>{
      if(loading==true){
        message.hideLoading()
      }
    })
  },
  // 领取奖励
  acceptAward(){
    if(!this.checkStatus()) return
    if(!this.checkBind()) return
    getTeamGift().then(res=>{
      this.teamGift = res.data
      let expires = res.data.expires
      const {hold} = app.data.initData
      hold.teamGiftNum>0?hold.teamGiftNum--:null
      this.setData({
        teamGiftNum:hold.teamGiftNum,
        redInfo:{
          expires:formatSeconds(expires),
          sPackageName:res.data.sPackageName
        }
      })
      this.dialog(2)
      this.alertCallBack = ()=>{
        clearInterval(this.timer)
      }
      clearInterval(this.timer)
      this.timer = setInterval(()=>{
        expires--
        this.setData({
          expires:formatSeconds(expires)
        })
      },1000)
    })
  },
  // 组队订阅
  async subscribe(){
    const tmplId = "0UGLcv50DmhdvZzc8GOzvKkqM-fDIIuuN9ygBl8zm9k"
    try{
      const res = await ulinkCore.subscribeMessage({
        tmplIds: [tmplId]
      })
      console.log(res)
      if(res[tmplId]=='accept'){
        recordDyState().then(res=>{
          message.success('订阅成功～')
        })
      }
    }catch(err){
      console.log(err)
    }
  },
  alert(message,callback){
    this.dialog(9,message)
    typeof callback == 'function' && (this.alertCallBack = callback)
  },
  // 检测活动开放状态
  checkStatus(){
    if(app.data.error.iRet === 20010 || app.data.error.iRet === -1){
      message.info(app.data.error.sMsg)
      return false
    }
    if(!app.data.initData){
      this.init()
      return false
    }
    return true
  },
  // 检测绑定大区
  checkBind(){
    if(!app.data.initData.isBind) {
      this.onBind()
      return false
    }
    return true
  },
  // 打开绑定大区
  onBind(){
    if(!this.checkStatus()) return
    this.selectComponent('#roleSelector').init()
  },
  // 绑定成功
  async bindSuccess(e){
    console.log(e)
    const { area,areaName, partition, roleId, partitionName, roleName } = e.detail
    try{
      const res = await bindRole({
        area,
        areaName:decodeURIComponent(areaName),
        partition,
        partitionName,
        roleId:decodeURIComponent(roleId),
        roleName:decodeURIComponent(roleName)
      })
      if(res){
        this.init()
      }else{
        message.error('绑定失败～')
      }
    }catch(err){
      message.error('绑定失败～')
    }
  },
  async getShareInfo(shareType){
    let path
    if(shareType==1){
      path = `/pages/index/index?shareType=${shareType}`
    }else if(shareType==2){
      const {shareInfo:{sOpenid, sDate, sToken}} = app.data.initData
      path = `/pages/index/index?sOpenid=${sOpenid}&sDate=${sDate}&sToken=${sToken}&shareType=${shareType}`
    }else if(shareType==3){
      const {openid,sDate,token,redId} = this.teamGift
      path = `/pages/receive/receive?sOpenid=${openid}&sDate=${sDate}&sToken=${token}&redId=${redId}&shareType=${shareType}`
    }
    try {
      const res = await getShareInfo({shareType})
      if(res){
        return {
          title:res.data.title,
          imageUrl:res.data.img,
          path:`${path}&shareId=${res.data.id}&ver=${res.data.ver}`
        }
      }
    }catch(err){
      console.log(err)
      return this.defaultShareInfo(shareType)
    }
  },
  // 分享兜底方案
  defaultShareInfo(shareType){
    if(shareType==1){
      // 分享活动
      return {
        title: '王者春节组队福利活动开启中，快来参加吧~',
        imageUrl:'https://game.gtimg.cn/images/yxzj/act/9280/a20221213hb/share/1.jpg',
        path: `/pages/index/index?shareType=${shareType}&shareId=1&ver=1`,
      }
    }else if(shareType==2){
      // 分享队伍
      const {shareInfo:{sOpenid, sDate, sToken}} = app.data.initData
      return {
        title: '王者新春发福利啦！快与我组队赢大奖！~',
        imageUrl:'https://game.gtimg.cn/images/yxzj/act/9280/a20221213hb/share/2.jpg',
        path: `/pages/index/index?sOpenid=${sOpenid}&sDate=${sDate}&sToken=${sToken}&shareType=${shareType}&shareId=3&ver=1`,
      }
    }else if(shareType==3){
      // 分享红包
      const {openid,sDate,token,redId} = this.teamGift
      return {
        title: '发现一个王者新年红包，手慢无！~',
        imageUrl:'https://game.gtimg.cn/images/yxzj/act/9280/a20221213hb/share/6.jpg',
        path: `/pages/receive/receive?sOpenid=${openid}&sDate=${sDate}&sToken=${token}&redId=${redId}&shareType=${shareType}&shareId=3&ver=1`,
      }
    }
  },
  // 拉起游戏
  toGame(){
    wx.openEmbeddedMiniProgram({
      appId: 'wx4a0a73ec028e47d7', // 固定值
      path: 'packageLaunchGame/pages/launchGame/index', // 固定值
      extraData: {
        type: 1,
        message: '',
      }
    })
  },
  // 打开弹窗
  async dialog(e,message) {
    const type = e.currentTarget ? Number(e.currentTarget.dataset.pop) : e
    if (this.data.pop.type != 0) {
      this.closeDialog()
      await this.sleep(300)
    }
    this.setData({
      pop:{
        type,
        message:message || (e.currentTarget ? e.currentTarget.dataset.message : '')
      },
    })
  },
  // 关闭弹窗
  closeDialog() {
    this.setData({
      pop: {
        type:0,
        message:''
      }
    },()=>{
      typeof this.alertCallBack == 'function' && this.alertCallBack()
    })
  },
  sleep(timeout) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, timeout)
    })
  },
  gotoVideo(){
    const system = wx.getSystemInfoSync()
    if(wx.canIUse('openChannelsUserProfile')){
      message.loading('',3000)
      wx.openChannelsUserProfile({
        finderUserName:"sph3dWx6baqqq2K",
        complete:()=>{
          message.hideLoading()
        },
      })
    }else{
      this.dialog(7)
    }
  },
})
