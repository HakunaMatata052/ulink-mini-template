const Ulink = requirePlugin('ulink-mini-core')
import message from './message'
const app = getApp()
class Request {
  // route:string
  // options:options
  // data:unknown
  // refresh:number // 当前熔断次数
  // maxRefresh:number // 最大熔断次数
  constructor(){
  }
  async http(route, data = {}, options={}){
    this.route = route
    this.data = data
    const config = {
      method: 'post',
      errAlert: true,
      resAlert: false,
      loading: true,
      refresh:1,
      maxRefresh: 5,
      refreshTimeOut:1000,
      type:'ulink',
      ...options
    }
    this.options = config
    let res // 每次请求返回的的正确结果
    let err // 每次请求返回的的错误结果
    let requireRetry = false
    this.showLoading()
    try{
      res = await this.HttpClient(config)
    }catch(error){
      err = error
      requireRetry = true
    }
    if(requireRetry&&config.refresh<config.maxRefresh){
      config.refresh++
      await this.sleep(config.refreshTimeOut)
      console.log(`第${config.refresh}次重试`)
      res = await this.http(route, data,config)
    }else{
      this.hideLoading()
      if(res){
        this.toast('resAlert',res.sMsg || res.rawData.sMsg || res.data.sMsg)
      }else{
        this.toast('errAlert',err.sMsg||'系统繁忙，请稍后再试～')
      }
    }
    return res
  }
  async HttpClient(config){
    if(config.type=='ulink') {
      return new Promise((resolve,reject)=>{
        Ulink.http[config.method](this.route, this.data).then(res=>{
          if(res.rawData.iRet==0){
            console.log('请求成功：' + '\n ' + this.route + ' \n ' + res.rawData.sULinkSerial + ' \n ', res.rawData)
            resolve(res)
          }else{
            console.error('请求失败：' + '\n ' + this.route + ' \n ' + res.rawData.sULinkSerial + ' \n ', res.rawData)
            reject(res)
          }
        }).catch(err=>{
          console.error('请求失败：' + '\n ' + this.route + ' \n ' + err.sULinkSerial + ' \n ', err.jData)
          reject(err)
        })
      })
    }else{
      return new Promise((resolve,reject)=>{
        wx.request({
          url: this.route, //url
          method: this.options.method, //请求方式
          header: {
            'Content-Type': 'application/json',
          },
          success:(res)=>{
            const data ={
              iRet: 0,
              sMsg: "SUC",
              jData: res.data
            }
            console.log('请求成功：' + '\n ' + this.route + ' \n other \n ' , data)
            resolve(data)
          },
          fail:(err)=>{
            const data ={
              iRet: -1,
              sMsg: "ERR",
              jData: JSON.stringify(err)
            }
            console.error('请求失败：' + '\n ' + this.route + ' \n other \n ' , data)
            reject(data)
          },
        })
      })
    }
  }
  sleep(time){
    return new Promise(resolve=>{
      setTimeout(() => {
        resolve()
      }, time)
    })
  }
  showLoading(){
    if(typeof this.options.loading ==='boolean' && this.options.loading){
      message.loading('',false)
    }else if(typeof this.options.loading ==='string' ){
      message.loading(this.options.loading,false)
    }
  }
  hideLoading(){
    if (this.options.loading){
      message.hideLoading()
    }
  }
  toast(type, content){
    if (typeof this.options[type] === 'boolean'){
      if (this.options[type]){
        message.info(content)
      }
    } else if (this.options[type] === 'alert'){
      message.confirm(content)
    }
  }
}
export default new Request()