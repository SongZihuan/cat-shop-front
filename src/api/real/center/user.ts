import { Result, Success } from '@/utils/request'
import { UserBase, UserWithoutPre } from '@/store/user'

export interface LoginResult {
  xtoken: string
  success: boolean
}

export function apiPostLoginGetXToken(phone: string, password: string): Result<LoginResult> {
  if (phone.startsWith('1732206') || password.length >= 10) {
    return Promise.resolve({
      data: {
        code: 0,
        data: {
          xtoken: '123456' + phone + password,
          success: true
        }
      },
      status: 200
    })
  }

  return Promise.resolve({
    data: {
      code: 0,
      data: {
        xtoken: '',
        success: false
      }
    },
    status: 200
  })
}

export function apiPostRegisterGetXToken(phone: string, password: string): Result<LoginResult> {
  return Promise.resolve({
    data: {
      code: 0,
      data: {
        xtoken: '123456' + phone + password,
        success: true
      }
    },
    status: 200
  })
}

export function apiGetSelfInfo(): Result<UserWithoutPre> {
  return Promise.resolve({
    data: {
      code: 0,
      data: {
        name: '小桓',
        wechat: 'xxx',
        email: 'hhh',
        type: 3,
        avatar: '',
        phone: '17366251478',
        location: '广东广州',
        totalPrice: 100000,
        totalBuy: 30,
        totalGood: 20,
        totalJian: 45,
        totalShouHuo: 25,
        totalPingJia: 25
      } as UserWithoutPre
    },
    status: 200
  })
}

export function apiPostUpdateSelfInfo(data: UserBase): Success {
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

export function apiPostUpdateSelfPassword(oldPasswordHash: string, newPasswordHash: string): Success {
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

export function apiPostUpdateAvatarData(avatar: Blob): Success {
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
