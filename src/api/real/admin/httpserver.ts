import { Success } from '@/utils/request'

export const apiAdminRestartServer = (passwordHash: string, secret: string): Success => {
  return Promise.resolve({
    data: {
      code: 0,
      data: {
        success: true,
        waitsec: 20
      }
    },
    status: 200
  })
}

export const apiAdminStopServer = (passwordHash: string, secret: string): Success => {
  return Promise.resolve({
    data: {
      code: 0,
      data: {
        success: true
      }
    },
    status: 200
  })
}
