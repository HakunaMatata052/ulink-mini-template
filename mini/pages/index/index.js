import {getInit} from '../../utils/apis'
Page({
  isFirst:true,
  data: {
    pop:{
      type:0,
      message:''
    },
  },
  onLoad(query) {
    console.log('pageQuery',query)
    this.pageQuery = query
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
      setTimeout(resolve, timeout)
    })
  },
})
