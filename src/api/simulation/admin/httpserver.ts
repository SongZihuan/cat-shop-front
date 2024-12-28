import {Result, Success} from "@/utils/request";

export interface data {
    waitsec: number
    success: boolean
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const apiAdminRestartServer = (passwordHash: string, secret: string): Result<data> => {
    return Promise.resolve({
        data: {
            code: 0,
            data: {
                success: true,
                waitsec: 20,
            },
        } as unknown as data,
        status: 200,
    } as Result<data>)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const apiAdminStopServer = (passwordHash: string, secret: string): Success => {
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
