import {Result} from "@/utils/request"

export interface AdminMsg {
    id: number
    userid: number
    msg: string
    time: number
}

type AdminMsgLst = {
    total: number
    list: AdminMsg[]
    maxpage: number
}

export function apiAdminGetUserMsg(userId: number, page: number, pagesize: number): Result<AdminMsgLst> {
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
    const msgLst = ref([] as AdminMsg[])
    for (let i = (page - 1) * pagesize; i < pagemax; i++) {
        if (msgLst.value.length >= pagesize) {
            break
        }

        msgLst.value.push({
            id: page * pagesize + i + 1,
            userid: userId,
            msg: "这是一条消息，Hahahaha！",
            time: 1734024269,
        })
    }

    return Promise.resolve({
        data: {
            code: 0,
            data: {
                maxpage: pagemax,
                total: msgLst.value.length,
                list: msgLst.value,
            },
        },
        status: 200,
    })
}

export function apiAdminGetMsg(page: number, pagesize: number): Result<AdminMsgLst> {
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
    const msgLst = ref([] as AdminMsg[])
    for (let i = (page - 1) * pagesize; i < pagemax; i++) {
        if (msgLst.value.length >= pagesize) {
            break
        }

        msgLst.value.push({
            id: page * pagesize + i + 1,
            userid: 1,
            msg: "这是一条消息，Hahahaha！",
            time: 1734024269,
        })
    }

    return Promise.resolve({
        data: {
            code: 0,
            data: {
                maxpage: pagemax,
                total: msgLst.value.length,
                list: msgLst.value,
            },
        },
        status: 200,
    })
}