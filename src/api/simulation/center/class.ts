import {Result} from "@/utils/request"

export interface Class {
    id: number
    name: string
}

export const allClass = ref({
    id: 0,
    name: "全部",
} as Class)

export interface ClassLst {
    list: Class[],
    total: number,
}

export function apiGetClassLst(limit: number, offset: number): Result<ClassLst> {
    if (limit > 100) {
        limit = 100
    }

    if (offset <= 0 || offset > 20) {
        offset = 20
    }

    // return request({
    //     url: '/user/buy/record',
    //     method: 'get',
    // })

    if (offset > 10000) {
        return Promise.resolve({
            data: {
                code: 0,
                data: {
                    total: 0,
                    list: [],
                },
            },
            status: 200,
        })
    }

    const classLst = ref([] as Class[])
    for (let i = 0; i < limit; i++) {
        classLst.value.push({
            id: offset + i + 1,
            name: "商品分类" + (offset + i + 1),
        })
    }

    return Promise.resolve({
        data: {
            code: 0,
            data: {
                total: classLst.value.length,
                list: classLst.value,
            },
        },
        status: 200,
    })
}

export interface ClassLstByPage {
    list: Class[],
    total: number,
}

export function apiGetClassLstByPage(page: number, pagesize: number): Result<ClassLstByPage> {
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
    const classLst = ref([] as Class[])
    for (let i = (page - 1) * pagesize; i < maxcount; i++) {
        if (classLst.value.length >= pagesize) {
            break
        }

        classLst.value.push({
            id: page * pagesize + i + 1,
            name: "商品分类" + (page * pagesize + i + 1),
        })
    }

    return Promise.resolve({
        data: {
            code: 0,
            data: {
                maxcount: maxcount,
                total: classLst.value.length,
                list: classLst.value,
            },
        },
        status: 200,
    })
}