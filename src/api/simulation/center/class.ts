import {Class} from "@/store/class"
import {Result} from "@/utils/request"

export interface ClassLst {
    list: Class[],
    total: number,
}

export const apiGetClassLst = (): Result<ClassLst> => {
    const classLst = [] as Class[]
    const total = 60

    for (let i = 0; i < total; i++) {
        classLst.push({
            name: "商品分类" + (i + 1),
            id: i + 1,
        })
    }

    return Promise.resolve({
        data: {
            data: {
                list: classLst,
                total: total,
            }
        },
        status: 200,
    })
}