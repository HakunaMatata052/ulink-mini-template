/**
 * 时间格式转yyyy-MM-dd hh:mm:ss
 * @param {Number} dateTimeStamp 时间字符串 2022-01-01 12:00:00
 * @param {String} fmt 指定格式 yyyy-MM-dd hh:mm:ss
 */
export const formatTime = (timeString, fmt) => {
  let dateTimeStamp = new Date(timeString.replace(/-/g,'/'))
  // dateTimeStamp = new Date(Number(dateTimeStamp * 1000))
  let o = {
    "M+": dateTimeStamp.getMonth() + 1, //月份
    "d+": dateTimeStamp.getDate(), //日
    "h+": dateTimeStamp.getHours(), //小时
    "m+": dateTimeStamp.getMinutes(), //分
    "s+": dateTimeStamp.getSeconds(), //秒
    "q+": Math.floor((dateTimeStamp.getMonth() + 3) / 3), //季度
    "S": dateTimeStamp.getMilliseconds() //毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (dateTimeStamp.getFullYear() + "").substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)))
    }
  }
  return fmt
}
/**
 * 中文时间
 * @param {Number} dateTimeStamp 时间字符串 2022-01-01 12:00:00
 */
export const timeSwitchString = (timeString) => {
  let dateTimeStamp = new Date(timeString.replace(/-/g,'/'))
  let minute = 1000 * 60 // 把分，时，天，周，半个月，一个月用毫秒表示
  let hour = minute * 60
  let day = hour * 24
  let week = day * 7
  // let halfamonth = day * 15
  let month = day * 30
  let year = day * 365
  let now = new Date().getTime() // 获取当前时间毫秒
  let diffValue = now - dateTimeStamp // 时间差
  let result
  if (diffValue < 0) {
    return
  }
  let minC = diffValue / minute // 计算时间差的分，时，天，周，月
  let hourC = diffValue / hour
  let dayC = diffValue / day
  let weekC = diffValue / week
  let monthC = diffValue / month
  let yearC = diffValue / year
  // if (monthC >= 1 && monthC <= 3) {
  //   result = " " + parseInt(monthC) + "月前"
  // } else if (weekC >= 1 && weekC <= 3) {
  //   result = " " + parseInt(weekC) + "周前"
  // } else if (dayC >= 1 && dayC <= 6) {
  //   result = " " + parseInt(dayC) + "天前"
  // } else
  if (hourC >= 1 && hourC <= 23) {
    result = " " + parseInt(hourC) + "小时前"
  } else if (minC >= 1 && minC <= 59) {
    result = " " + parseInt(minC) + "分钟前"
  } else if (diffValue >= 0 && diffValue <= minute) {
    result = "刚刚"
  } else if (hourC>24 && yearC<1 ) {
    result = formatTime(timeString,'MM-dd')
  }else{
    result = formatTime(timeString,'yyyy-MM-dd')
  }
  return result
}
/**
 * 节流函数
 * @param {Function} callback 回调方法
 * @param {Number} wait 延迟时间
 * @param {Boolean} immediate 是否立刻执行
 */
export const throttle = (callback, wait = 500, immediate = true)=>{
  let timeout
  if (typeof callback !== 'function') {
    throw new TypeError('Expected a function')
  }
  return function () {
    let context = this
    let args = arguments
    // if(immediate){
    //   callback.apply(context, args)
    // }
    if (timeout) {
      return
    }
    // 每次调用都指定timeout后再执行
    timeout = setTimeout(() => {
      timeout = null
      callback.apply(context, args)
    }, wait)
  }
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
/**
 * 大数处理
 * @param {Number} c 需要处理的字符串
 */
export const changeBillionToCN = (c)=> {
  // 对传参进行类型处理,非字符串进行转换
  if(typeof(c) != "string") {
    c = c.toString()
  }
  // 对参数进行判断,
  if(c.split(".")[0].length >= 3 && c.split(".")[0].length < 4) {
    return(c / 1000).toFixed(2)+"千"
  } else if(c.split(".")[0].length >= 4 && c.split(".")[0].length < 8) {
    return(c / 10000).toFixed(2)+"万"
  } else if(c.split(".")[0].length >= 8 && c.split(".")[0].length < 13) {
    return(c / 100000000).toFixed(2)+"亿"
  } else if(c.split(".")[0].length >= 13) {
    return(c / 1000000000000).toFixed(2)+"兆"
  }
}
/**
 * 验证手机号
 * @param {string} content
 */
export const isPhone = function (content) {
  return /^1[3|4|5|7|8|9][0-9]\d{8}$/.test(content)
}
/**
 * 数组去重
 * @param {array} arr
 * @param {string} uniId
 */
export const uniqueFunc = function (arr, uniId){
  const res = new Map()
  return arr.filter((item) => !res.has(item[uniId.split('.')[0]][uniId.split('.')[1]]) && res.set(item[uniId.split('.')[0]][uniId.split('.')[1]], 1))
}