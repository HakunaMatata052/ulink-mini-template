import message from "./message"
import log from "./log"
const Ulink = requirePlugin("ulink-mini-core")
async function request(route, data = {}, options = {}){
  const config = {
    route,
    data,
    activityId:'',
    method: "post",
    errAlert: true,
    resAlert: false,
    loading: true,
    refresh: 1,
    maxRefresh: 0, // 默认不重试
    refreshTimeOut: 1000,
    type: "ulink",
    ...options,
  }
  let res // 每次请求返回的的正确结果
  let err // 每次请求返回的的错误结果
  let requireRetry = false
  config.loading && message.loading(false)
  try {
    res = await HttpClient(config)
    config.loading && message.hideLoading()
    if (typeof config.resAlert === "boolean" && config.resAlert) {
      message.info(res.sMsg || res.rawData.sMsg || res.data.sMsg)
    } else if (typeof config.resAlert === "alert") {
      message.confirm(res.sMsg || res.rawData.sMsg || res.data.sMsg)
    }
    return res
  } catch (error) {
    err = error
    requireRetry = true
  }
  if (requireRetry && config.refresh < config.maxRefresh) {
    config.refresh++
    await sleep(config.refreshTimeOut)
    console.log(`第${config.refresh}次重试`)
    res = request(route, data, config)
    return res
  } else {
    // 最后一次请求错误
    config.loading && message.hideLoading()
    if (typeof config.errAlert === "boolean" && config.errAlert) {
      message.info(err.sMsg || "系统繁忙，请稍后再试～")
    } else if (typeof config.errAlert === "alert") {
      message.confirm(err.sMsg || "系统繁忙，请稍后再试～")
    }
  }
  // 上报日志系统
  log.error({
    route: config.route,
    data: config.data,
    toast: err.sMsg || "",
    sULinkSerial:
      err.sULinkSerial || "非接口报错，无流水--" + JSON.stringify(err),
  })
  return Promise.reject(err)
}
async function HttpClient(config) {
  if (config.type == "milo") {
    if(!config.activityId){
      throw new Error('activityId为空')
    }
    await Ulink.checkLogin()
    let openId = wx.getStorageSync("openid")
    return new Promise((resolve, reject) => {
      Ulink.http[config.method](
        `https://x8m8.ams.game.qq.com/ams/ame/amesvr?ameVersion=0.3&sServiceType=${
          Ulink.config.game
        }&iActivityId=${config.activityId}`,
        {
          iActivityId: config.activityId,
          iFlowId: config.route,
          sOpenid: openId,
          openId,
          ...config.data,
        }
      )
        .then((res) => {
          if (res.rawData.modRet.iRet == 0) {
            console.log(
              "请求成功：" +
                "\n " +
                config.route +
                " \n " +
                res.rawData.flowRet.sLogSerialNum +
                " \n ",
              res.rawData
            )
            resolve(res.rawData.modRet)
          } else {
            console.error(
              "请求失败：" +
                "\n " +
                config.route +
                " \n " +
                res.rawData.flowRet.sLogSerialNum +
                " \n ",
              res.rawData
            )
            reject(res.rawData.modRet)
          }
        })
        .catch((err) => {
          console.error("请求失败：" + "\n " + config.route)
          reject(err)
        })
    })
  } else if (config.type == "ulink") {
    return new Promise((resolve, reject) => {
      Ulink.http[config.method](config.route, config.data)
        .then((res) => {
          if (res.rawData.iRet == 0) {
            console.log(
              "请求成功：" +
                "\n " +
                config.route +
                " \n " +
                res.rawData.sULinkSerial +
                " \n ",
              res.rawData
            )
            resolve(res)
          } else {
            console.error(
              "请求失败：" +
                "\n " +
                config.route +
                " \n " +
                res.rawData.sULinkSerial +
                " \n ",
              res.rawData
            )
            reject(res)
          }
        })
        .catch((err) => {
          console.error(
            "请求失败：" +
              "\n " +
              config.route +
              " \n " +
              err.sULinkSerial +
              " \n ",
            err
          )
          reject(err)
        })
    })
  } else {
    return new Promise((resolve, reject) => {
      wx.request({
        url: config.route, //url
        method: config.method, //请求方式
        header: {
          "Content-Type": "application/json",
        },
        success: (res) => {
          if (res.statusCode === 200) {
            const data = {
              iRet: 0,
              sMsg: "SUC",
              jData: res.data,
            }
            console.log(
              "请求成功：" + "\n " + config.route + " \n other \n ",
              data
            )
            resolve({
              rawData: data,
              data: res.data,
            })
          } else {
            const data = {
              iRet: -1,
              sMsg: "ERR",
              jData: res.data,
            }
            console.error(
              "请求失败：" + "\n " + config.route + " \n other \n ",
              data
            )
            reject(data)
          }
        },
        fail: (err) => {
          const data = {
            iRet: -1,
            sMsg: "ERR",
            jData: JSON.stringify(err),
          }
          console.error(
            "请求失败：" + "\n " + config.route + " \n other \n ",
            data
          )
          reject(data)
        },
      })
    })
  }
}
function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}
export default request
