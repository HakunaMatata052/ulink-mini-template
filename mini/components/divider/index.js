const componentOptions = {
  // 组件选项
  options: {
    multipleSlots: true,
  },
  behaviors: [],
  properties: {
    dashed: {
      type:Boolean,
      value:false
    },
    hairline: {
      type:Boolean,
      value:true
    },
    contentPosition: {
      type:String,
      value:'center'
    },
    fontSize: {
      type:String||Number,
      value:'18'
    },
    borderColor: {
      type:String,
      value:'#b2b2b2'
    },
    textColor: {
      type:String,
      value:'#b2b2b2'
    },
    customStyle: {
      type:String,
      value:''
    },
  },
  // 组件数据
  data: {
  },
  // 数据监听器
  observers: {},
  // 组件方法
  methods: {
    onClick: function () {
    },
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
