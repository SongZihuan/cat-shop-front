import { Wupin } from '@/store/hotwupin'
import { Result, Success } from '@/utils/request'
import wupinPic from '@/assets/images/tmp.jpg'

export interface ShopRecord {
  id: number
  userId: number
  wupinId: number
  classId: number
  num: number
  time: number
  wupin: Wupin
  down: boolean
}

type ShopRecordLst = {
  total: number
  list: ShopRecord[]
}

export const apiGetUserShoppingRecord = (offset: number, limit: number): Result<ShopRecordLst> => {
  if (limit > 100 || limit <= 0) {
    limit = 100
  }

  if (offset > 20 || offset <= 0) {
    offset = 0
  }

  // return request({
  //     url: '/user/buy/record',
  //     method: 'get',
  // })

  if (offset > 100) {
    return Promise.resolve({
      data: {
        code: 0,
        data: {
          total: 0,
          list: []
        }
      },
      status: 200
    })
  }

  const shopRecordLst = [] as ShopRecord[]
  for (let i = 0; i < limit; i++) {
    shopRecordLst.push({
      id: offset + i + 1,
      userId: 1,
      wupinId: 1,
      classId: 2,
      num: 2,
      time: 1734024269,
      wupin: {
        id: 1,
        name: '商品' + i,
        pic: wupinPic,
        classId: 2,
        classOf: {
          id: 2,
          name: '商品分类2'
        },
        tag: '火爆',
        hotPrice: 9999,
        realPrice: 19999,
        info: 'hhhhhh',
        ren: '小超市',
        phone: '17366251478',
        email: 'contact@song-zh.com',
        location: '广东广州',
        buytotal: 100,
        buydaohuo: 95,
        buygood: 90,
        buyprice: 999,
        buypingjia: 20,
        buyjian: 10,
        hot: false
      },
      down: false
    })
  }

  return Promise.resolve({
    data: {
      code: 0,
      data: {
        total: limit,
        list: shopRecordLst
      }
    },
    status: 200
  })
}

export const apiPostAddToShoppingBag = (wupinId: number, num: number): Success => {
  return Promise.resolve({
    data: {
      data: {
        success: true
      },
      code: 0
    },
    status: 200
  })
}
