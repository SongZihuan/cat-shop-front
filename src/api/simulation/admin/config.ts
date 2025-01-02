import { UploadRawFile } from 'element-plus'
import { Result, Success } from '@/utils/request'
import Logo from '@/assets/images/logo.jpg'
import WeChat from '@/assets/images/wechat.jpg'
import AD from '@/assets/images/ad.jpeg'
import DefaultAvatar from '@/assets/images/default-avatar.jpg'
import LogoIco from '@/assets/images/logo-icon.png'

export interface AdminConfig {
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

const AdminConfigType = {
  name: 'string|must',
  subname: 'string|must',
  hotline: 'string|must',
  logo: 'pic|must',
  icon: 'pic|must',
  service: 'string|must',
  wechat: 'pic|must',
  avatar: 'pic|must',
  aboutus: 'string|must',
  passwordfronthash: 'string|must',
  footer: 'string',

  adtitle: 'string|must',
  adpic: 'pic|must',
  ad: 'text|must',
  adurl: 'string'
}

const AdminConfigInfo = {
  name: '网站标题',
  subname: '网站副标题',
  hotline: '服务热线',
  logo: '网站主Logo',
  icon: '网页Icon',
  service: '服务标语',
  wechat: '微信二维码推广',
  adtitle: '广告标题',
  adpic: '广告图片',
  ad: '广告内容',
  adurl: '广告Url',
  avatar: '默认头像',
  aboutus: '关于我们',
  passwordfronthash: '密码学加密字段',
  footer: 'ICP备案号和底部文字内容'
}

const AdminConfigTypeName = {
  'string|must': '必选字符串',
  'pic|must': '必选图片',
  'text|must': '必选文本域',
  string: '可选字符串',
  pic: '可选图片',
  text: '可选文本域'
}

export const apiAdminGetConfigType = (): Result<{ [key: string]: string }> => {
  return Promise.resolve({
    data: {
      code: 0,
      data: AdminConfigType
    },
    status: 200
  })
}

export const apiAdminGetConfigTypeName = (): Result<{ [key: string]: string }> => {
  return Promise.resolve({
    data: {
      code: 0,
      data: AdminConfigTypeName
    },
    status: 200
  })
}

export const apiAdminGetConfigInfo = (): Result<{ [key: string]: string }> => {
  return Promise.resolve({
    data: {
      code: 0,
      data: AdminConfigInfo
    },
    status: 200
  })
}

export const apiAdminPostUpdateConfigString = (key: string, value: string): Success => {
  return Promise.resolve({
    data: {
      code: 0,
      data: {
        success: true
      }
    },
    status: 200
  })
}

export const apiAdminPostUpdateConfigSPic = (key: string, value: UploadRawFile): Success => {
  return Promise.resolve({
    data: {
      code: 0,
      data: {
        success: true
      }
    },
    status: 200
  })
}

export const apiAdminPostDeleteConfig = (key: string): Success => {
  return Promise.resolve({
    data: {
      code: 0,
      data: {
        success: true
      }
    },
    status: 200
  })
}

export interface GetConfigData {
  config: AdminConfig
  info: { [key: string]: string }
  type: { [key: string]: string }
  typename: { [key: string]: string }
}

export const apiAdminGetConfig = (): Result<GetConfigData> => {
  return Promise.resolve({
    data: {
      code: 0,
      data: {
        config: {
          name: '猫猫超市',
          subname: '让您有个温馨的体验',
          logo: Logo,
          hotline: '400-930-1318',
          service: '24小时在线贴心服务',
          wechat: WeChat,
          adtitle: '这只是个广告',
          adpic: AD,
          adurl: 'https://www.baidu.com',
          ad: '比亚迪，智领未来，引领绿色出行！作为全球新能源技术的先锋，比亚迪凭借卓越的自主研发和创新实力，打造高性能电动汽车，成就绿色科技与卓越驾控的完美融合。从刀片电池到e平台技术，每一次突破都树立行业标杆。比亚迪汽车不仅续航无忧，动力强劲，更以智能、安全、环保，赢得全球消费者信赖。选择比亚迪，就是选择环保出行，拥抱科技未来！比亚迪，向新而行，驶向明天的辉煌！',
          aboutus: '猫猫超市是一个微商城测试项目，欢迎前来体验。',
          footer: '2024年-宋子桓开发！探索，从现在开始！'
        } as AdminConfig,
        info: AdminConfigInfo,
        type: AdminConfigType,
        typename: AdminConfigTypeName
      },
      status: 200
    }
  })
}

export const apiAdminConfigAsDefault = (config: AdminConfig): AdminConfig => {
  if (!config.name) {
    config.name = '猫猫超市'
  }

  if (!config.subname) {
    config.subname = '让您有个温馨的体验'
  }

  if (!config.logo) {
    config.logo = Logo
  }

  if (!config.icon) {
    config.icon = LogoIco
  }

  if (!config.hotline) {
    config.hotline = '000-000-0000'
  }

  if (!config.hotline) {
    config.hotline = '000-000-0000'
  }

  if (!config.service) {
    config.service = '24小时在线贴心服务'
  }

  if (!config.wechat) {
    config.wechat = WeChat
  }

  if (!config.adtitle) {
    config.adtitle = '这只是个广告'
  }

  if (!config.ad) {
    config.ad = '广告的内容哦！'
  }

  if (!config.adpic) {
    config.adpic = AD
  }

  if (!config.avatar) {
    config.avatar = DefaultAvatar
  }

  if (!config.aboutus) {
    config.aboutus = `${config.name}是一个互联网商铺平台。感谢您的关注，我们在持续进步。`
  }

  if (!config.passwordfronthash) {
    config.passwordfronthash = config.name
  }

  return config
}
