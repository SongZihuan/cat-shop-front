import { Result } from '@/utils/request'

export interface XieyiData {
  xieyi: string
}

export const apiGetXieyi = (): Result<XieyiData> => {
  return Promise.resolve({
    data: {
      code: 0,
      data: {
        xieyi: `<p> 这是一份协议 </p>`
      }
    },
    status: 200
  })
}
