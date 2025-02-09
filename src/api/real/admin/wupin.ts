import { Result, Success } from '@/utils/request'
import WupinPic from '@/assets/images/tmp.jpg'
import { AdminClass } from '#/admin/class'
import { UploadRawFile } from 'element-plus'

export interface AdminWupinID {
  id: number
}

export interface AdminHotWupin {
  hot: boolean
}

export interface AdminWupinWithDown {
  down: boolean
}

export interface AdminWupinBase extends AdminHotWupin, AdminWupinWithDown {
  name: string
  classId: number
  tag?: string
  hotPrice?: number
  realPrice: number
  info: string
  ren: string
  phone: string
  email?: string
  wechat?: string
  location: string
}

export interface AdminPicForWupin {
  pic: string
}

export interface AdminClassForWupin {
  classOf: AdminClass
}

export interface AdminWupinWithInfo extends AdminWupinBase, AdminPicForWupin, AdminClassForWupin {
  buytotal: number
  buydaohuo: number
  buygood: number
  buyprice: number
  buypingjia: number
  buyjian: number
}

export interface AdminWupin extends AdminWupinID, AdminWupinWithInfo {}

export const apiAdminGetWupin = (id: number): Result<AdminWupin> => {
  const wupin = {
    id: id,
    name: '商品' + id,
    pic: WupinPic,
    classId: 2,
    classOf: {
      id: 2,
      name: '商品分类2222',
      show: true,
      down: false
    },
    tag: '爆卖！',
    hotPrice: 19999,
    realPrice: 19999,
    info:
      "<p style='font-size: 20px;'> 贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪 </p>" +
      "<p style='font-size: 20px;'> 贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪 </p>" +
      "<p style='font-size: 20px;'> 贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪 </p>" +
      "<p style='font-size: 20px;'> 贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪 </p>" +
      "<p style='font-size: 20px;'> 贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪 </p>" +
      "<p style='font-size: 20px;'> 贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪 </p>" +
      "<p style='font-size: 20px;'> 贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪 </p>" +
      "<p style='font-size: 20px;'> 贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪 </p>" +
      "<p style='font-size: 20px;'> 贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪 </p>" +
      "<p style='font-size: 20px;'> 贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪 </p>" +
      "<p style='font-size: 20px;'> 贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪 </p>" +
      "<p style='font-size: 20px;'> 贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪 </p>" +
      "<p style='font-size: 20px;'> 贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪 </p>" +
      "<p style='font-size: 20px;'> 贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪 </p>" +
      "<p style='font-size: 20px;'> 贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪 </p>" +
      "<p style='font-size: 20px;'> 贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪 </p>" +
      "<p style='font-size: 20px;'> 贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪 </p>" +
      "<p style='font-size: 20px;'> 贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪 </p>",
    ren: '小超',
    phone: '17366251478',
    email: 'contact@song-zh.com',
    location: '广东广州',
    wechat: '12345',
    buytotal: 100,
    buydaohuo: 95,
    buygood: 90,
    buyprice: 1000,
    buypingjia: 10,
    buyjian: 10,
    hot: true,
    down: false
  } as AdminWupin
  return Promise.resolve({
    data: {
      data: wupin,
      code: 0
    },
    status: 200
  })
}

type AdminWupinLst = {
  maxcount: number
  total: number
  list: AdminWupin[]
}

export function apiAdminGetWupinLst(page: number, pagesize: number): Result<AdminWupinLst> {
  if (page <= 0) {
    return Promise.reject()
  }

  if (pagesize <= 0 || pagesize > 20) {
    return Promise.reject()
  }

  // return request({
  //     url: '/user/buy/record',
  //     method: 'get',
  // })

  const maxcount = 121
  const wupinLst = ref([] as AdminWupin[])
  for (let i = (page - 1) * pagesize; i < maxcount; i++) {
    if (wupinLst.value.length >= pagesize) {
      break
    }

    wupinLst.value.push({
      id: page * pagesize + i + 1,
      name: '商品' + (page * pagesize + i + 1),
      pic: WupinPic,
      classId: 2,
      classOf: {
        id: 2,
        name: '商品分类2222',
        show: true,
        down: false
      },
      tag: '爆卖！',
      hotPrice: 19999,
      realPrice: 19999,
      info:
        "<p style='font-size: 20px;'> 贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪 </p>" +
        "<p style='font-size: 20px;'> 贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪 </p>" +
        "<p style='font-size: 20px;'> 贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪 </p>" +
        "<p style='font-size: 20px;'> 贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪 </p>" +
        "<p style='font-size: 20px;'> 贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪 </p>" +
        "<p style='font-size: 20px;'> 贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪 </p>" +
        "<p style='font-size: 20px;'> 贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪 </p>" +
        "<p style='font-size: 20px;'> 贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪 </p>" +
        "<p style='font-size: 20px;'> 贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪 </p>" +
        "<p style='font-size: 20px;'> 贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪 </p>" +
        "<p style='font-size: 20px;'> 贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪 </p>" +
        "<p style='font-size: 20px;'> 贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪 </p>" +
        "<p style='font-size: 20px;'> 贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪 </p>" +
        "<p style='font-size: 20px;'> 贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪 </p>" +
        "<p style='font-size: 20px;'> 贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪 </p>" +
        "<p style='font-size: 20px;'> 贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪 </p>" +
        "<p style='font-size: 20px;'> 贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪 </p>" +
        "<p style='font-size: 20px;'> 贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪 </p>",
      ren: '小超',
      phone: '17366251478',
      email: 'contact@song-zh.com',
      location: '广东广州',
      wechat: '12345',
      buytotal: 100,
      buydaohuo: 95,
      buygood: 90,
      buyprice: 1000,
      buypingjia: 10,
      buyjian: 10,
      hot: i % 2 == 0,
      down: false
    } as AdminWupin)
  }

  return Promise.resolve({
    data: {
      code: 0,
      data: {
        maxcount: maxcount,
        total: wupinLst.value.length,
        list: wupinLst.value
      }
    },
    status: 200
  })
}

export function apiAdminPostUpdateWupin(data: AdminWupinBase, pic: UploadRawFile | null): Success {
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

export function apiAdminPostAddWupin(data: AdminWupinBase, pic: UploadRawFile): Success {
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
