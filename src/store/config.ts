import WeChat from '@/assets/images/wechat.jpg'
import Logo from '@/assets/images/logo.jpg'
import LogoIco from '@/assets/images/logo-icon.png'
import AD from '@/assets/images/ad.jpeg'
import DefaultAvatar from '@/assets/images/default-avatar.jpg'

import { apiGetConfig } from '#/center/config'
import { apiGetXieyi } from '#/center/xieyi'

export interface Config {
  name: string
  subname: string
  hotline: string
  logo: string
  icon: string
  service: string
  wechat: string
  adtitle: string
  adpic: string
  ad: string
  adurl?: string
  avatar: string
  aboutus: string
  passwordfronthash: string
  footer: string
}

const useConfigStore = defineStore('configStore', () => {
  const config = ref({
    name: '',
    subname: '',
    logo: '',
    icon: '',
    hotline: '',
    service: '',
    wechat: '',
    adtitle: '',
    adpic: '',
    ad: '',
    adurl: undefined,
    avatar: '',
    aboutus: '',
    passwordfronthash: '',
    footer: ''
  } as Config)

  const xieyi = ref('')

  const updateConfig = async () => {
    return apiGetConfig().then((res) => {
      config.value = res.data.data
      if (!config.value.name) {
        config.value.name = '猫猫超市'
      }

      if (!config.value.subname) {
        config.value.subname = '让您有个温馨的体验'
      }

      if (!config.value.logo) {
        config.value.logo = Logo
      }

      if (!config.value.icon) {
        config.value.icon = LogoIco
      }

      if (!config.value.hotline) {
        config.value.hotline = '000-000-0000'
      }

      if (!config.value.hotline) {
        config.value.hotline = '000-000-0000'
      }

      if (!config.value.service) {
        config.value.service = '24小时在线贴心服务'
      }

      if (!config.value.wechat) {
        config.value.wechat = WeChat
      }

      if (!config.value.adtitle) {
        config.value.adtitle = '这只是个广告'
      }

      if (!config.value.ad) {
        config.value.ad = '广告的内容哦！'
      }

      if (!config.value.adpic) {
        config.value.adpic = AD
      }

      if (!config.value.avatar) {
        config.value.avatar = DefaultAvatar
      }

      if (!config.value.aboutus) {
        config.value.aboutus = `${config.value.name}是一个互联网商铺平台。感谢您的关注，我们在持续进步。`
      }

      if (!config.value.passwordfronthash) {
        config.value.passwordfronthash = config.value.name
      }
    })
  }

  const updateXieyi = async () => {
    return apiGetXieyi().then((res) => {
      xieyi.value = res.data.data.xieyi
    })
  }

  return {
    config,
    xieyi,
    updateConfig,
    updateXieyi
  }
})

export default useConfigStore
