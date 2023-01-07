const componentOptions = {
  // 组件选项
  options: {
    multipleSlots: true,
  },
  behaviors: [],
  properties: {
    title:{
      type:String,
    },
    color:{
      type:String,
      value:'#fff'
    },
    background:{
      type:String,
      value:'#000',
    },
    showBack:{
      type:Boolean,
      value:true
    },
    customStyle:{
      type:String,
      value:''
    }
  },
  // 组件数据
  data: {
    opacity: 1,
    position: {
      height: 0,
      top: 0
    },
  },
  // 数据监听器
  observers: {},
  // 组件方法
  methods: {
    computeNavbarHeight() {
      // 获得胶囊按钮位置信息
      let {height, top} = wx.getMenuButtonBoundingClientRect()
      this.setData({
        position: {
          height,
          top
        }
      })
    },
    back(){
      const pages = getCurrentPages()
      const prevPage = pages[pages.length - 2]
      if(!prevPage){
        wx.switchTab({
          url:'/pages/main/main'
        })
        return
      }
      wx.navigateBack({
        fail:()=>{
          wx.switchTab({
            url:'/pages/main/main'
          })
        }
      })
    },
  },
  // 组件生命周期
  lifetimes: {
    created() {
    },
    attached() {
      this.computeNavbarHeight()
    },
    ready() {},
    moved() {},
    detached() {},
  },
  definitionFilter() {},
  // 页面生命周期
  pageLifetimes: {
    // 页面被展示
    show() {
    },
    // 页面被隐藏
    hide() {
    },
    // 页面尺寸变化时
    resize() {},
  },
}
Component(componentOptions)
