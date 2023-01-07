const componentOptions = {
  properties: {
    value: Boolean,
    disabled: Boolean,
    useIconSlot: Boolean,
    color: {
      type: String,
      value: '#07c160',
    },
    labelPosition: {
      type: String,
      value: 'right',
    },
    shape: {
      type: String,
      value: 'round',
    },
    iconSize: {
      type: String || Number,
      value: 16,
    },
  },
  data: {
    direction: 'vertical',
    checked:false,
  },
  methods: {
    toggle: function () {
      if(this.data.checked){
        this.setData({
          checked:false
        })
        this.triggerEvent('change',{
          checked:false
        })
      }else{
        this.setData({
          checked:true
        })
        this.triggerEvent('change',{
          checked:true
        })
      }
    },
  },
  // 组件生命周期
  lifetimes: {
    created() {},
    attached() {
      this.setData({
        checked:Boolean(this.properties.disabled)
      })
    },
    ready() {},
    moved() {},
    detached() {},
  },
}
Component(componentOptions)