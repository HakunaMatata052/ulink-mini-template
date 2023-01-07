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
  async http(route, data = {}, options){
    this.route = route
    this.data = data
    this.options = {
      method: 'post',
      errAlert: true,
      resAlert: false,
      loading: true,
      maxRefresh: 2,
      type:'ulink',
      ...options
    }
    this.maxRefresh = this.options.maxRefresh
    this.showLoading()
    try{
      const res = await this.HttpClient()
      this.hideLoading()
      if(res){
        this.toast('resAlert',res.sMsg || res.rawData.sMsg || res.data.sMsg)
        return Promise.resolve(res)
      }else{
        this.toast('errAlert',res.sMsg)
        return Promise.reject(res)
      }
    }catch(err){
      this.hideLoading()
      this.toast('errAlert',err.sMsg||'系统繁忙，请稍后再试～')
      app.data.error = err
      return Promise.reject(err)
    }
  }
  async HttpClient(){
    if(this.options.type=='ulink') {
      return new Promise((resolve,reject)=>{
        Ulink.http[this.options.method](this.route, this.data).then(res=>{
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
          fail:reject,
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
      message.loading()
    }else if(typeof this.options.loading ==='string' ){
      message.loading(this.options.loading)
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
export default Request