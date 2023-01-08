const message = {}
message.success = function(content,success=()=>{}){
  wx.showToast({
    title:content||'',
    icon: 'success',
    mask: true,
    duration: 2000,
    success
  })
}
message.info = function(content,success=()=>{}){
  wx.showToast({
    title:content||'',
    icon: 'none',
    mask: true,
    duration: 2000,
    success
  })
}
message.error = function(content,success=()=>{}){
  wx.showToast({
    title:content||'',
    icon: 'error',
    mask: true,
    duration: 2000,
    success
  })
}
message.confirm = function(content,confirm=()=>{},cancel=()=>{}){
  wx.showModal({
    'title': '',
    'content': content,
    success(res) {
      if (res.confirm) {
        confirm && confirm()
      } else if (res.cancel) {
        cancel && cancel()
      }
    }
  })
}
message.loading = function(content,timeout = 5000){
  wx.showLoading({
    title: content||'',
    mask:true
  })
  // 超时后自动隐藏loading
  if(typeof timeout === 'boolean' && timeout === false){
    return
  }
  setTimeout(() => {
    message.hideLoading()
  }, timeout)
}
message.hideLoading = function(content){
  wx.hideLoading()
}
export default message