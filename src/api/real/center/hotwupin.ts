import { Result } from '@/utils/request'
import { Wupin } from '@/store/hotwupin'
import WupinPic from '@/assets/images/tmp.jpg'

export interface HotWupinLst {
  list: Wupin[]
  total: number
}

export const apiGetHotWupinLst = (): Result<HotWupinLst> => {
  const wupinLst = [] as Wupin[]

  for (let i = 0; i < 50; i++) {
    wupinLst.push({
      id: i + 1,
      name: '商品' + ' - ' + (i + 1),
      pic: WupinPic,
      classId: 2,
      classOf: {
        id: 2,
        name: '商品分类2222'
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
      phone: '17322061610',
      email: 'songzihuan@song-zh.com',
      location: '广东广州',
      wechat: '12345',
      buytotal: 100,
      buydaohuo: 95,
      buygood: 90,
      buyprice: 1000,
      buypingjia: 10,
      buyjian: 10,
      hot: true
    } as Wupin)
  }
  return Promise.resolve({
    data: {
      code: 0,
      data: {
        total: wupinLst.length,
        list: wupinLst
      }
    },
    status: 200
  })
}
