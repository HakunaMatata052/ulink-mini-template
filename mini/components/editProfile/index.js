import { createStoreBindings } from "../../miniprogram_npm/mobx-miniprogram-bindings/index"
import { store } from "../../utils/store"
import message from '../../utils/message'
import {getAdverList} from '../../utils/apis'
const Ulink = requirePlugin('ulink-mini-core')
const componentOptions = {
  // 组件选项
  options: {
    multipleSlots: true,
  },
  behaviors: [],
  properties: {},
  // 组件数据
  data: {
    imageSelectOptions: {
      needWxml: false, // 是否显示默认的图片选择控件
      count: 1, // 图片选择数量
      sizeType: ['compressed', 'original'], // 图片选择压缩类型
      sourceType: ['album', 'camera'], // 图片选择源
      fileList: [], // 初始图片列表, 子项-图片地址
      maxSize: 2, // 图片尺寸M
      showMaxSizeLimitModel: true, // 是否显示图片超过限制的弹窗提示
      showLoading: true, // 上传时是否显示 loading
      showLoadingText: "图片上传中", // 图片上传时 loading 文案
    },
    imageCropperOptions:{
      show:false,
      src: '',
      width: 300, //宽度
      height: 300, //高度
      max_width: 300,
      max_height: 300,
      disable_rotate: true, //是否禁用旋转
      disable_ratio: true, //锁定比例
      limit_move: true, //是否限制移动
    },
    avatar:"",
    nickname:"",
    height:300,
    width:300,
    editProfileClose:false,
    useEditProfile:true,
  },
  // 数据监听器
  observers: {},
  // 组件方法
  methods: {
    onChooseAvatar(e){
      console.log(e)
      this.setData({
        'imageCropperOptions.src': e.detail.avatarUrl,
        'imageCropperOptions.show':true
      },()=>{
        this.cropper = this.selectComponent("#image-cropper")
      })
    },
    async onSelectAvatar(){
      await this.selectComponent("#image-upload").remove(0)
      const { current, total } = await this.selectComponent("#image-upload").select()
      console.log('111')
      console.log("result:", current, total)
      const extraData= wx.getFileSystemManager().readFileSync(current[0].path)
      console.log('图片裁剪前',extraData)
      this.setData({
        'imageCropperOptions.src': current[0].path,
        'imageCropperOptions.show':true
      },()=>{
        this.cropper = this.selectComponent("#image-cropper")
      })
    },
    cropperload(e) {
      console.log('cropper加载完成')
    },
    loadimage(e) {
      wx.hideLoading()
      this.cropper.imgReset()
    },
    clickcut(e) {
      //图片预览
      wx.previewImage({
        current: e.detail.url, // 当前显示图片的http链接
        urls: [e.detail.url] // 需要预览的图片http链接列表
      })
    },
    submitAvatar() {
      this.cropper.getImg((obj) => {
        console.log(obj)
        this.setData({
          avatar:obj.url,
          width:obj.width,
          height:obj.height,
          'imageCropperOptions.show':false
        })
      })
    },
    onInput(e){
      console.log(e)
      const {value} = e.detail
      const nickname = value.trim().substr(0,8)
      this.setData({
        nickname
      })
    },
    onClose(){
      this.triggerEvent('close')
    },
    async submit(){
      if(!this.data.nickname){
        message.error('请填写昵称～')
        return
      }
      if(!this.data.avatar){
        message.error('请上传头像～')
        return
      }
      if(this.data.avatar.indexOf('https://')==-1){
        // 上传本地图片
        this.selectComponent("#image-upload").data.imageList = [{path:this.data.avatar,width:this.data.width,height:this.data.height}]
        try{
          const result = await this.selectComponent("#image-upload").upload()
          console.log('上传result',result)
          if(result){
            console.log('triggerEvent_result',result)
            this.triggerEvent('getUserInfo',{
              userInfo:{
                nickName:this.data.nickname,
                avatarUrl:result[0].path
              }
            })
          }else{
            console.log('上传失败result',result)
            message.info(result.sMsg || '头像上传失败～')
          }
        }catch(err){
          console.log('上传失败result2',result)
          message.info(err.sMsg || '系统繁忙～')
        }
      }else{
        this.triggerEvent('getUserInfo',{
          userInfo:{
            nickName:this.data.nickname,
            avatarUrl:this.data.avatar
          }
        })
      }
    }
  },
  // 组件生命周期
  lifetimes: {
    created() {
      this.storeBindings = createStoreBindings(this, {
        store,
        fields: ["userInfo","initInfo"]
      })
    },
    attached() {
      const {SDKVersion} = wx.getSystemInfoSync()
      if(Ulink.CONSTS.isWechat && Ulink.checkVersion(SDKVersion,'2.21.2')===1){
        // 新规则-头像昵称填写
        this.setData({
          useEditProfile:true
        })
      }else{
        this.setData({
          useEditProfile:false
        })
      }
      getAdverList(6).then(res=>{
        console.log(res)
        if(res.data[0]?.config.close == 1){
          this.setData({
            editProfileClose:true
          })
        }
      })
      this.setData({
        avatar:store.userInfo?.avatar,
        nickname:store.userInfo?.nickname
      })
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
