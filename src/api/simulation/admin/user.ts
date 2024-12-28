import {Result, Success} from "@/utils/request"
import {AdminUserBase, AdminUserWithoutPre} from "@/store/admin/user"

export function apiAdminGetUserInfo(id: number): Result<AdminUserWithoutPre> {
    return Promise.resolve({
        data: {
            code: 0,
            data: {
                id: id,
                wechat: "xxx",
                email: "hhh",
                status: 1,
                name: "",
                type: 1,
                avatar: "",
                phone: "17322061610",
                location: "广东广州",
                totalPrice: 100000,
                totalBuy: 30,
                totalGood: 20,
                totalJian: 45,
                totalShouHuo: 25,
                totalPingJia: 25,
            } as AdminUserWithoutPre
        },
        status: 200,
    })
}

type AdminUserLst = {
    maxcount: number
    total: number
    list: AdminUserWithoutPre[]
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function apiAdminGetUserLst(page: number, pagesize: number, phone?: string, name?: string, status?: number): Result<AdminUserLst> {
    if (page <= 0) {
        return Promise.reject()
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    phone = phone || ""
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    name = name || ""
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    status = status || 0

    if (pagesize <= 0 || pagesize > 20) {
        return Promise.reject()
    }

    // return request({
    //     url: '/user/buy/record',
    //     method: 'get',
    // })

    const maxcount = 121
    const userLst = ref([] as AdminUserWithoutPre[])
    for (let i = (page - 1) * pagesize; i < maxcount; i++) {
        if (userLst.value.length >= pagesize) {
            break
        }

        userLst.value.push({
            id: page * pagesize + i + 1,
            wechat: "xxx",
            email: "hhh",
            status: 1,
            name: "",
            type: 1,
            avatar: "",
            phone: "17322061610",
            location: "广东广州",
            totalPrice: 100000,
            totalBuy: 30,
            totalGood: 20,
            totalJian: 45,
            totalShouHuo: 25,
            totalPingJia: 25,
        } as AdminUserWithoutPre)
    }

    return Promise.resolve({
        data: {
            code: 0,
            data: {
                maxcount: maxcount,
                total: userLst.value.length,
                list: userLst.value,
            },
        },
        status: 200,
    })
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function apiAdminPostUpdateAvatarData(userId: number, avatar: Blob): Success {
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
export function apiAdminPostUpdateInfo(userId: number, data: AdminUserBase): Success {
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

export interface NewUserData extends AdminUserBase {
    phone: string
    password: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function apiAdminPostNewUser(data: NewUserData): Success {
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
export function apiAdminPostUpdatePassword(userId: number, newPasswordHash: string): Success {
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
export function apiAdminPostUpdatePhone(userId: number, newPhone: string): Success {
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