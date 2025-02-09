import { Result } from '@/utils/request'
import wupinPic from '@/assets/images/tmp.jpg'
import { LocationForUser } from '#/center/pay'
import { AdminWupin } from '#/admin/wupin'

export const AdminBuyRecordStatus = {
  1: '已下单，等待支付和确认',
  2: '已下单，支付失败',
  3: '待发货',
  4: '已发货',
  5: '已收货',
  6: '已评价',
  7: '申请退货审核中',
  8: '申请退货成功，等待寄回',
  9: '申请退货成功，待收货',
  10: '申请退货失败',
  11: '已退货',
  12: '申请取消订单审核中',
  13: '已取消订单'
} as Object

export interface AdminBuyRecord {
  id: number
  userId: number
  wupinId: number
  classId: number
  num: number
  price: number
  totalPrice: number
  time: number
  fukuantime: number
  fahuotime: number
  shouhuotime: number
  pingjiatime: number
  tuihuoshenqingtime: number
  dengjituihuotime: number
  querentuihuotime: number
  tuohuotime: number
  quxiaotime: number
  status: number
  kuaidi: string
  kuaidinum: string
  backkuaidi: string
  backkuaidinum: string
  isgood: boolean
  user: LocationForUser
  shop: LocationForUser
  wupin: AdminWupin
  nowwupin: AdminWupin
  down: boolean
}

type AdminBuyRecordLstByPage = {
  maxcount: number
  total: number
  list: AdminBuyRecord[]
}

export function apiAdminGetBuyRecordByPage(
  page: number,
  pagesize: number,
  status: number
): Result<AdminBuyRecordLstByPage> {
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

  const maxcount = 100
  const buyRecordLst = ref([] as AdminBuyRecord[])
  for (let i = (page - 1) * pagesize; i < maxcount; i++) {
    if (buyRecordLst.value.length >= pagesize) {
      break
    }

    buyRecordLst.value.push({
      id: page * pagesize + i + 1,
      userId: 1,
      wupinId: 1,
      classId: 2,
      num: 2,
      price: 5000,
      totalPrice: 9999,
      time: 1734024269,
      fukuantime: 1734024269,
      fahuotime: 1734024269,
      shouhuotime: 1734024269,
      pingjiatime: 1734024269,
      tuihuoshenqingtime: 1734024269,
      dengjituihuotime: 1734024269,
      querentuihuotime: 1734024269,
      tuohuotime: 1734024269,
      quxiaotime: 1734024269,
      status: status,
      kuaidi: '顺丰',
      kuaidinum: 'SF1234',
      backkuaidi: '',
      backkuaidinum: '',
      isgood: true,
      wupin: {
        id: 1,
        name: `商品-${page}-${i}`,
        pic: wupinPic,
        classId: 2,
        classOf: {
          id: 2,
          name: '商品分类2',
          show: true,
          down: false
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
        hot: false,
        down: false
      },
      nowwupin: {
        id: 1,
        name: `商品-${page}-${i}`,
        pic: wupinPic,
        classId: 2,
        classOf: {
          id: 2,
          name: '商品分类2',
          show: true,
          down: false
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
        hot: false,
        down: false
      },
      user: {
        name: '用户-222',
        phone: '17366251478',
        location: '广东广州',
        wechat: '1234',
        email: '1234',
        remark: '1234,'
      },
      shop: {
        name: '用户',
        phone: '17366251478',
        location: '广东广州',
        wechat: '1234',
        email: '1234',
        remark: '1234,'
      },
      down: false
    })
  }

  return Promise.resolve({
    data: {
      code: 0,
      data: {
        maxcount: maxcount,
        total: buyRecordLst.value.length,
        list: buyRecordLst.value
      }
    },
    status: 200
  })
}

export function apiAdminGetUserBuyRecordByPage(
  userId: number,
  page: number,
  pagesize: number,
  status: number
): Result<AdminBuyRecordLstByPage> {
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

  const maxcount = 100
  const buyRecordLst = ref([] as AdminBuyRecord[])
  for (let i = (page - 1) * pagesize; i < maxcount; i++) {
    if (buyRecordLst.value.length >= pagesize) {
      break
    }

    buyRecordLst.value.push({
      id: page * pagesize + i + 1,
      userId: userId,
      wupinId: 1,
      classId: 2,
      num: 2,
      price: 5000,
      totalPrice: 9999,
      time: 1734024269,
      fukuantime: 1734024269,
      fahuotime: 1734024269,
      shouhuotime: 1734024269,
      pingjiatime: 1734024269,
      tuihuoshenqingtime: 1734024269,
      dengjituihuotime: 1734024269,
      querentuihuotime: 1734024269,
      tuohuotime: 1734024269,
      quxiaotime: 1734024269,
      status: status,
      kuaidi: '顺丰',
      kuaidinum: 'SF1234',
      backkuaidi: '',
      backkuaidinum: '',
      isgood: true,
      wupin: {
        id: 1,
        name: `商品-${page}-${i}`,
        pic: wupinPic,
        classId: 2,
        classOf: {
          id: 2,
          name: '商品分类2',
          show: true,
          down: false
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
        buyprice: 1000,
        buypingjia: 10,
        buyjian: 10,
        hot: i % 2 == 0,
        down: false
      },
      nowwupin: {
        id: 1,
        name: `商品-${page}-${i}`,
        pic: wupinPic,
        classId: 2,
        classOf: {
          id: 2,
          name: '商品分类2',
          show: true,
          down: false
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
        buyprice: 1000,
        buypingjia: 10,
        buyjian: 10,
        hot: i % 2 == 0,
        down: false
      },
      user: {
        name: '用户-111',
        phone: '17366251478',
        location: '广东广州',
        wechat: '1234',
        email: '1234',
        remark: '1234,'
      },
      shop: {
        name: '用户',
        phone: '17366251478',
        location: '广东广州',
        wechat: '1234',
        email: '1234',
        remark: '1234,'
      },
      down: false
    })
  }

  return Promise.resolve({
    data: {
      code: 0,
      data: {
        maxcount: maxcount,
        total: buyRecordLst.value.length,
        list: buyRecordLst.value
      }
    },
    status: 200
  })
}

export function apiAdminGetBuyRecordInfo(id: number, userId: number = 0): Result<AdminBuyRecord> {
  if (id <= 0 || userId < 0) {
    return Promise.reject()
  }

  return Promise.resolve({
    data: {
      code: 0,
      data: {
        id: id,
        userId: userId,
        wupinId: 1,
        classId: 2,
        num: 2,
        price: 500,
        totalPrice: 9999,
        time: 1734024269,
        fukuantime: 1734024269,
        fahuotime: 1734024269,
        shouhuotime: 1734024269,
        pingjiatime: 1734024269,
        tuihuoshenqingtime: 1734024269,
        dengjituihuotime: 1734024269,
        querentuihuotime: 1734024269,
        tuohuotime: 1734024269,
        quxiaotime: 1734024269,
        status: 6,
        kuaidi: '顺丰',
        kuaidinum: 'SF1234',
        backkuaidi: '中通',
        backkuaidinum: 'ZT1234',
        isgood: true,
        wupin: {
          id: 1,
          name: '商品',
          pic: wupinPic,
          classId: 2,
          classOf: {
            id: 2,
            name: '商品分类2222'
          },
          tag: '火爆',
          hotPrice: 9999,
          realPrice: 19999,
          info: 'hhhhhh',
          ren: '宋子桓',
          phone: '17366251478',
          wechat: 'abcd',
          email: 'contact@song-zh.com',
          location: '广东广州',
          buytotal: 100,
          buydaohuo: 95,
          buygood: 90,
          buyprice: 1000,
          buypingjia: 10,
          buyjian: 10,
          hot: false,
          down: false
        } as AdminWupin,
        nowwupin: {
          id: 1,
          name: '商品',
          pic: wupinPic,
          classId: 2,
          classOf: {
            id: 2,
            name: '商品分类2222'
          },
          tag: '火爆',
          hotPrice: 9999,
          realPrice: 19999,
          info: 'hhhhhh',
          ren: '宋子桓',
          phone: '17366251478',
          wechat: 'abcd',
          email: 'contact@song-zh.com',
          location: '广东广州',
          buytotal: 100,
          buydaohuo: 95,
          buygood: 90,
          buyprice: 1000,
          buypingjia: 10,
          buyjian: 10,
          hot: false,
          down: false
        } as AdminWupin,
        user: {
          name: '用户',
          phone: '17366251478',
          location: '广东广州',
          wechat: '1234',
          email: '1234',
          remark: '1234,'
        } as LocationForUser,
        shop: {
          name: '用户2222',
          phone: '17366251478',
          location: '广东广州',
          wechat: '1234',
          email: '1234',
          remark: '1234,'
        } as LocationForUser
      } as AdminBuyRecord,
      down: false
    },
    status: 200
  })
}
