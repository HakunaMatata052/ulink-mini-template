/**
 * 时间格式转yyyy-MM-dd hh:mm:ss
 * @param {Number} dateTimeStamp 时间字符串 2022-01-01 12:00:00
 * @param {String} fmt 指定格式 yyyy-MM-dd hh:mm:ss
 */
export const formatTime = (timeString, fmt) => {
  let date = new Date(timeString.replace(/-/g, "/"))
  let o = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds(),
    "q+": Math.floor((date.getMonth() + 3) / 3),
    S: date.getMilliseconds(),
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    )
  }
  for (let key in o) {
    if (new RegExp("(" + key + ")").test(fmt)) {
      let value = (o[key] < 10 ? "0" : "") + o[key]
      fmt = fmt.replace(RegExp.$1, value)
    }
  }
  return fmt
}
/**
 * 节流函数
 * @param {Function} callback 回调方法
 * @param {Number} wait 延迟时间
 * @param {Object} options 选项对象
 * @param {Boolean} options.leading 指定调用在节流开始前
 * @param {Boolean} options.trailing 指定调用在节流结束后
 */
export const throttle = (
  func,
  wait = 500,
  { leading = false, trailing = true } = {}
) => {
  let timeout, context, args, result
  let previous = 0
  if (!options) options = {}
  let later = function () {
    previous = options.leading === false ? 0 : Date.now()
    timeout = null
    result = func.apply(context, args)
    if (!timeout) context = args = null
  }
  let throttled = function () {
    let now = Date.now()
    if (!previous && options.leading === false) previous = now
    let remaining = wait - (now - previous)
    context = this
    args = arguments
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      previous = now
      result = func.apply(context, args)
      if (!timeout) context = args = null
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining)
    }
    return result
  }
  throttled.cancel = function () {
    clearTimeout(timeout)
    previous = 0
    timeout = context = args = null
  }
  return throttled
}
/**
 * 防抖函数
 * @param {Function} callback 回调方法
 * @param {Number} wait 延迟时间
 * @param {Object} options 选项对象
 * @param {Boolean} options.leading 指定调用在防抖开始前
 * @param {Boolean} options.trailing 指定调用在防抖结束后
 */
export const debounce = (
  func,
  wait = 500,
  { leading = false, trailing = true } = {}
) => {
  let timeout
  return function () {
    const context = this
    const args = arguments
    if (leading && !timeout) {
      func.apply(context, args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      timeout = null
      if (trailing) {
        func.apply(context, args)
      }
    }, wait)
  }
}