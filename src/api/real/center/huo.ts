import { Success } from '@/utils/request'
import { LocationForUser } from '#/center/pay'

export const apiPostGouWuDaoHuo = (buyRecordId: number): Success => {
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

export const apiPostQuXiaoPay = (buyRecordId: number): Success => {
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

export const apiPostGouWuPingJia = (buyRecordId: number, isGood: boolean = true): Success => {
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

export const apiPostTuiHuoShenQing = (buyRecordId: number, name: string, phone: string, reason: string): Success => {
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

export const apiPostTuiHuoDengJi = (buyRecordId: number, kuaidi: string, danhao: string): Success => {
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

export const apiPostFaHuoQuXiaoShenQing = (buyRecordId: number): Success => {
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

export const apiPostChangeUser = (buyRecordId: number, user: LocationForUser): Success => {
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
