export const compareVersion = (v1, v2)=> {
  v1 = v1.split('.')
  v2 = v2.split('.')
  const len = Math.max(v1.length, v2.length)
  while (v1.length < len) {
    v1.push('0')
  }
  while (v2.length < len) {
    v2.push('0')
  }
  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i])
    const num2 = parseInt(v2[i])
    if (num1 > num2) {
      return 1
    } else if (num1 < num2) {
      return -1
    }
  }
  return 0
}
export const formatSeconds = (value)=> {
  var theTime = parseInt(value)// 秒
  var theTime1 = 0// 分
  var theTime2 = 0// 小时
  if (theTime >= 60) {
    theTime1 = parseInt(theTime / 60)
    theTime = parseInt(theTime % 60)
    if (theTime1 >= 60) {
      theTime2 = parseInt(theTime1 / 60)
      theTime1 = parseInt(theTime1 % 60)
    }
  }
  var result = "" + parseInt(theTime)
  if(result < 10){
    result = '0' + result
  }
  if (theTime1 > 0) {
    result = "" + parseInt(theTime1) + ":" + result
    if(theTime1 < 10){
      result = '0' + result
    }
  }else{
    result = '00:' + result
  }
  if (theTime2 > 0) {
    result = "" + parseInt(theTime2) + ":" + result
    if(theTime2 < 10){
      result = '0' + result
    }
  }else{
    result = '00:' + result
  }
  return result
}
/**
 * 防抖函数
 * @param {Function} callback 回调方法
 * @param {Number} wait 延迟时间
 * @param {Boolean} immediate 是否立刻执行
 */
export const debounce = (callback, wait = 500, immediate = false)=>{
  let timeout, result
  if (typeof callback !== 'function') {
    throw new TypeError('Expected a function')
  }
  let debounced = function () {
    // console.log(this);  //=>从中可以测试出this指向的container
    //保存this
    let context = this
    // 解决前面的event指向问题
    let args = arguments
    // 清空上从定时器
    if (timeout) clearTimeout(timeout)
    if (immediate) {
      let callNow = !timeout
      timeout = setTimeout(() => {
        timeout = null
      }, wait)
      if (callNow) result = callback.apply(context, args)
    } else {
      timeout = setTimeout(function () {
        // console.log(this)  //=>这里面的this指向window，也就是前面的count那的this是指向window
        //但是防抖函数的this应该是指向container
        callback.apply(context, args)
      }, wait)
    }
    return result
  }
  //添加取消防抖函数功能
  debounced.cannel = function () {
    clearTimeout(timeout)
    timeout = null
  }
  return debounced
}