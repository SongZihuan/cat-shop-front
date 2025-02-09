import { Success } from '@/utils/request'
import { LocationForUser } from '#/center/pay'

export const apiAdminPostGouWuDaoHuo = (userId: number, buyRecordId: number): Success => {
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

export const apiAdminPostGouWuTuiHuoDaohuo = (userId: number, buyRecordId: number): Success => {
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

export const apiAdminPostQuXiaoPay = (userId: number, buyRecordId: number): Success => {
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

export const apiAdminPostFaHuoDengJi = (
  userId: number,
  buyRecordId: number,
  kuaidi: string,
  danhao: string
): Success => {
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

export const apiAdminPostTuiHuoDengJi = (
  userId: number,
  buyRecordId: number,
  kuaidi: string,
  danhao: string
): Success => {
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

export const apiAdminPostTuiHuoAccept = (userId: number, buyRecordId: number, accept: boolean): Success => {
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

export const apiAdminPostTuiHuoShenQingAccept = (userId: number, buyRecordId: number): Success => {
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

export const apiAdminPostChangeUser = (userId: number, buyRecordId: number, user: LocationForUser): Success => {
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

export const apiAdminPostChangeShop = (userId: number, buyRecordId: number, shop: LocationForUser): Success => {
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

export const apiAdminPostFaHuoQuXiao = (userId: number, buyRecordId: number): Success => {
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

export const apiAdminPostFaHuoCheHui = (userId: number, buyRecordId: number): Success => {
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

export const apiAdminPostAcceptFaHuoQuXiaoDengJi = (userId: number, buyRecordId: number, accept: boolean): Success => {
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
