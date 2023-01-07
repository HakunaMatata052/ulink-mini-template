const componentOptions = {
  // 组件选项
  options: {
    multipleSlots: true,
  },
  properties: {
    mask: {
      type: Boolean,
      value: true,
      observer: function () { }
    },
    show: {
      type: Boolean,
      value: false,
      observer: async function (e) {
        if (e) {
          this.open()
        } else {
          this.close()
        }
      }
    }
  },
  // 组件数据
  data: {
    isShow: false,
    animation: 'hide'
  },
  // 组件方法
  methods: {
    async open() {
      this.setData({
        isShow: true,
        animation: 'show'
      })
    },
    async close() {
      this.setData({
        animation: 'hide'
      })
      await this.sleep(300)
      this.setData({
        isShow: false,
      })
      this.triggerEvent('close', true)
    },
    sleep(timeout) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve()
        }, timeout)
      })
    },
    onMove(e){
      console.log(e)
      return true
    },
  },
}
Component(componentOptions)
