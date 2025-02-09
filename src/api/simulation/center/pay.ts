import { Result, Success } from '@/utils/request'
import { Wupin } from '@/store/hotwupin'
import { ShopRecord } from '#/center/shoppingbag'

export const testPayPath = '/test/pay'
export const alipay = 'alipay'
export const wechat = 'wechat'

export const repay = 'repay'
export const newpay = 'newpay'
export const shoppingbagpay = 'shoppingbagpay'

export const type = 'type'
export const buyRecordId = 'buyRecordId'
export const wupinId = buyRecordId
export const shoprecordId = buyRecordId
export const redirect = 'redirect'
export const paytype = 'paytype'

export interface PayData {
  url?: string
  recordId?: number
  success: boolean
}

export interface LocationForUser {
  name: string
  phone: string
  location: string
  wechat?: string
  email?: string
  remark?: string
}

export const apiPostAliNewPay = (
  redirectTo: string,
  wupin: Wupin,
  num: number,
  location: LocationForUser,
  password: string
): Result<PayData> => {
  return Promise.resolve({
    data: {
      code: 0,
      data: {
        success: true,
        recordId: 2,
        url:
          window.location.protocol +
          '//127.0.0.1:' +
          window.location.port +
          testPayPath +
          `?${type}=` +
          encodeURIComponent(alipay) +
          `&${wupinId}=` +
          encodeURIComponent(wupin.id) +
          `&${redirect}=` +
          encodeURIComponent(redirectTo) +
          `&${paytype}=` +
          encodeURIComponent(newpay)
      }
    },
    status: 200
  })
}

export const apiPostWechatNewPay = (
  redirectTo: string,
  wupin: Wupin,
  num: number,
  location: LocationForUser,
  password: string
): Result<PayData> => {
  return Promise.resolve({
    data: {
      code: 0,
      data: {
        success: true,
        recordId: 2,
        // 测试不同源
        url:
          window.location.protocol +
          '//127.0.0.1:' +
          window.location.port +
          testPayPath +
          `?${type}=` +
          encodeURIComponent(wechat) +
          `&${wupinId}=` +
          encodeURIComponent(wupin.id) +
          `&${redirect}=` +
          encodeURIComponent(redirectTo) +
          `&${paytype}=` +
          encodeURIComponent(newpay)
      }
    },
    status: 200
  })
}

export const apiPostAliNewPayWithShop = (
  shoprecord: ShopRecord,
  location: LocationForUser,
  password: string
): Result<PayData> => {
  return Promise.resolve({
    data: {
      code: 0,
      data: {
        success: true,
        recordId: 2,
        url:
          window.location.origin +
          testPayPath +
          `?${type}=` +
          encodeURIComponent(alipay) +
          `&${shoprecordId}=` +
          encodeURIComponent(shoprecord.id) +
          `&${paytype}=` +
          encodeURIComponent(shoppingbagpay)
      }
    },
    status: 200
  })
}

export const apiPostWechatNewPayWithShop = (
  shoprecord: ShopRecord,
  location: LocationForUser,
  password: string
): Result<PayData> => {
  return Promise.resolve({
    data: {
      code: 0,
      data: {
        success: true,
        recordId: 2,
        url:
          window.location.origin +
          testPayPath +
          `?${type}=` +
          encodeURIComponent(wechat) +
          `&${shoprecordId}=` +
          encodeURIComponent(shoprecord.id) +
          `&${paytype}=` +
          encodeURIComponent(shoppingbagpay)
      }
    },
    status: 200
  })
}

export const apiPostAliRepay = (
  id: number,
  redirectTo: string,
  location: LocationForUser,
  password: string
): Result<PayData> => {
  return Promise.resolve({
    data: {
      code: 0,
      data: {
        success: true,
        recordId: 2,
        url:
          window.location.origin +
          testPayPath +
          `?${type}=` +
          encodeURIComponent(alipay) +
          `&${buyRecordId}=` +
          encodeURIComponent(id) +
          `&${redirect}=` +
          encodeURIComponent(redirectTo) +
          `&${paytype}=` +
          encodeURIComponent(repay)
      }
    },
    status: 200
  })
}

export const apiPostWechatRepay = (
  id: number,
  redirectTo: string,
  location: LocationForUser,
  password: string
): Result<PayData> => {
  return Promise.resolve({
    data: {
      code: 0,
      data: {
        success: true,
        recordId: 2,
        url:
          window.location.origin +
          testPayPath +
          `?${type}=` +
          encodeURIComponent(wechat) +
          `&${buyRecordId}=` +
          encodeURIComponent(id) +
          `&${redirect}=` +
          encodeURIComponent(redirectTo) +
          `&${paytype}=` +
          encodeURIComponent(repay)
      }
    },
    status: 200
  })
}

export const apiPostTestPay = (id: number): Success => {
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
