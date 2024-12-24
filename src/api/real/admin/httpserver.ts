import {Success} from "@/utils/request";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const apiAdminRestartServer = (passwordHash: string, secret: string): Success => {
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
