const componentOptions = {
  // 组件选项
  options: {
    multipleSlots: true,
  },
  behaviors: [],
  properties: {
    color:{
      type:String,
      value:'#c6c6c6'
    },
    desc:{
      type:String,
      value:'暂无数据~'
    },
    icon:{
      type:String,
      value:'https://game.gtimg.cn/images/hyrz/act/8265/a20220713gjx/empty.png'
    },
    iconSize:{
      type:Number||String,
      value:176
    },
    customStyle:{
      type:String,
      value:''
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
