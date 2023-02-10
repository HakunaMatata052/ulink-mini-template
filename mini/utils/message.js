const messages = {
  success: (content = "", onSuccess = () => {}) => {
    wx.showToast({
      title: content,
      icon: "success",
      mask: true,
      duration: 2000,
      success: onSuccess,
    })
  },
  info: (content = "", onSuccess = () => {}) => {
    wx.showToast({
      title: content,
      icon: "none",
      mask: true,
      duration: 2000,
      success: onSuccess,
    })
  },
  error: (content = "", onSuccess = () => {}) => {
    wx.showToast({
      title: content,
      icon: "error",
      mask: true,
      duration: 2000,
      success: onSuccess,
    })
  },
  confirm: (content, onConfirm = () => {}, onCancel = () => {}) => {
    wx.showModal({
      title: "",
      content,
      success: (res) => {
        if (res.confirm) {
          onConfirm()
        } else if (res.cancel) {
          onCancel()
        }
      },
    })
  },
  loading: (content = "", timeout = 0) => {
    wx.showLoading({
      title: content,
      mask: true,
    })
    if (timeout) {
      setTimeout(() => {
        messages.hideLoading()
      }, timeout)
    }
  },
  hideLoading: () => {
    wx.hideLoading()
  },
}
export default messages
