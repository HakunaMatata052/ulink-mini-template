const componentOptions = {
  // 组件选项
  options: {
    multipleSlots: true,
  },
  behaviors: [],
  properties: {
    size: {
      type:Number,
      value:24
    },
    color: {
      type:String,
      value:'#000'
    },
    name: {
      type:String,
      value:''
    },
    dot:{
      type:Boolean || String,
      value:false,
    }
  },
  // 组件数据
  data: {
  },
  // 数据监听器
  observers: {},
  // 组件方法
  methods: {
  },
  // 组件生命周期
  lifetimes: {
    created() {},
    attached() {
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
