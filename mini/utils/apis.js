import request from './request'
// 初始化
export const getInit = (params) => {
  return request().http('Index/init', params)
}
