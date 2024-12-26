import {Result, Success} from "@/utils/request"
import wupinPic from "@/assets/images/tmp.jpg"
import {Wupin} from "@/store/hotwupin"

export interface AdminShopRecord {
    id: number
    userid: number
    wupinid: number
    classid: number
    num: number
    time: number
    wupin: Wupin
}

type AdminShopRecordLst = {
    total: number
    list: AdminShopRecord[]
}

export function apiAdminGetUserShoppingRecord(userId: number, page: number, pagesize: number): Result<AdminShopRecordLst> {
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

    const pagemax = 100
    const shopRecordLst = ref([] as AdminShopRecord[])
    for (let i = (page - 1) * pagesize; i < pagemax; i++) {
        if (shopRecordLst.value.length >= pagesize) {
            break
        }

        shopRecordLst.value.push({
            id: page * pagesize + i + 1,
            userid: userId,
            wupinid: 1,
            classid: 2,
            num: 2,
            time: 1734024269,
            wupin: {
                id: 1,
                name: `物品-${page}-${i}`,
                pic: wupinPic,
                classid: 2,
                classOf: {
                    id: 1,
                    name: "分类1",
                },
                tag: "火爆",
                hotPrice: 9999,
                realPrice: 19999,
                info: "hhhhhh",
                ren: "小超市",
                phone: "17322061610",
                email: "songzihuan@song-zh.com",
                location: "广东广州",
                buytotal: 100,
                buydaohuo: 95,
                buygood: 90,
            },
        })
    }

    return Promise.resolve({
        data: {
            code: 0,
            data: {
                maxpage: pagemax,
                total: shopRecordLst.value.length,
                list: shopRecordLst.value,
            },
        },
        status: 200,
    })
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const apiAdminPostAddToShoppingBag = (userId: number, wupinId: number, num: number): Success => {
    return Promise.resolve({
        data: {
            data: {
                success: true,
            },
            code: 0,
        },
        status: 200,
    })
}