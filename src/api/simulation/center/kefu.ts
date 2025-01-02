import { Success } from '@/utils/request'

export const apiSendKefuMsg = (msg: string): Success => {
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
