import useClassStore from "@/store/class"
import {Result, Success} from "@/utils/request"
import WupinPic from "@/assets/images/tmp.jpg"
import {AdminClass} from "#/admin/class"
import {UploadRawFile} from "element-plus"

export interface AdminWupinID {
    id: number
}

export interface AdminHotWupin {
    isHot: boolean
}

export interface AdminHShowWupin {
    isShow: boolean
}

export interface AdminWupinBase extends AdminHotWupin, AdminHShowWupin {
    name: string
    pic: string
    classid: number
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

export interface AdminWupinBaseWithClass extends AdminWupinBase {
    classOf: AdminClass
}

export interface AdminWupinWithInfo extends AdminWupinBaseWithClass {
    buytotal: number
    buydaohuo: number
    buygood: number
}

export interface AdminWupin extends AdminWupinID, AdminWupinWithInfo { }

export const apiAdminGetWupin = (id: number): Result<AdminWupin> => {
    const classStore = useClassStore()

    const classId = 1
    let classOf = classStore.findClass(classId) as AdminClass
    if (!classOf) {
        classOf = {
            id: classId,
            name: "分类" + classOf,
            show: true,
        }
    } else {
        classOf.show = true
    }

    const wupin = {
        id: id,
        name: "物品" + id,
        pic: WupinPic,
        classid: classId,
        classOf: classOf,
        tag: "爆卖！",
        hotPrice: 19999,
        realPrice: 19999,
        info: "<p style='font-size: 20px;'> 贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪 </p>" +
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
        ren: "小超",
        phone: "17322061610",
        email: "songzihuan@song-zh.com",
        location: "广东广州",
        wechat: "12345",
        buytotal: 100,
        buydaohuo: 95,
        buygood: 90,
        isHot: true,
    } as AdminWupin
    return Promise.resolve({
        data: {
            data: wupin,
            code: 0,
        },
        status: 200,
    })
}

type AdminWupinLst = {
    maxpage: number
    total: number
    list: AdminWupin[]
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

    const classStore = useClassStore()

    const classId = 1
    let classOf = classStore.findClass(classId) as AdminClass
    if (!classOf) {
        classOf = {
            id: classId,
            name: "分类" + classOf,
            show: true,
        }
    } else {
        classOf.show = true
    }

    const pagemax = 121
    const wupinLst = ref([] as AdminWupin[])
    for (let i = (page - 1) * pagesize; i < pagemax; i++) {
        if (wupinLst.value.length >= pagesize) {
            break
        }

        wupinLst.value.push({
            id: page * pagesize + i + 1,
            name: "物品" + (page * pagesize + i + 1),
            pic: WupinPic,
            classid: classId,
            classOf: classOf,
            tag: "爆卖！",
            hotPrice: 19999,
            realPrice: 19999,
            info: "<p style='font-size: 20px;'> 贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪，贵在坚持，成在创新：满满充满本事的比亚迪 </p>" +
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
            ren: "小超",
            phone: "17322061610",
            email: "songzihuan@song-zh.com",
            location: "广东广州",
            wechat: "12345",
            buytotal: 100,
            buydaohuo: 95,
            buygood: 90,
            isHot: i % 2 == 0,
        } as AdminWupin)
    }

    return Promise.resolve({
        data: {
            code: 0,
            data: {
                maxpage: pagemax,
                total: wupinLst.value.length,
                list: wupinLst.value,
            },
        },
        status: 200,
    })
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function apiAdminPostUpdateWupin(data: AdminWupinBase, pic: UploadRawFile | null): Success {
    return Promise.resolve({
        data: {
            code: 0,
            data: {
                success: true,
            },
        },
        status: 200,
    })
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function apiAdminPostAddWupin(data: AdminWupinBase, pic: UploadRawFile): Success {
    return Promise.resolve({
        data: {
            code: 0,
            data: {
                success: true,
            },
        },
        status: 200,
    })
}