import request from './request'
const Ulink = requirePlugin('ulink-mini-core')
// 初始化
export const getInit = (params) => {
  return request().http('Index/init', params)
}
// 绑定角色
export const bindRole = (params) => {
  return request().http('Role/bindRole', params)
}
// 组队订阅
export const recordDyState = () => {
  return request().http('Index/recordDyState', {isTeamDy:1},{resalert:true})
}
// 加入队伍
export const joinTeam = (params) => {
  return request().http('Index/joinTeam', params,{errAlert:false})
}
// 组队红包数据
export const getTeamGift = (params) => {
  return request().http('Index/getTeamGift', params)
}
// 拆红包
export const openRedEnvelope = (params) => {
  return request().http('Index/openRedEnvelope', params)
}
// 分享信息
export const getShareInfo = (params) => {
  return request().http('Index/getShareInfo', params,{errAlert:false})
}
// 红包详情
export const redPacketDetail = (params) => {
  return request().http('Index/redPacketDetail', params,{errAlert:false})
}
// 兜底策略拆红包
export const newOpenRedEnvelope = (params) => {
  return request().http('NewIndex/newOpenRedEnvelope', params,{loading:false})
}
