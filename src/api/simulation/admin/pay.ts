import { Success } from '@/utils/request'

export const apiAdminPostPeoplePay = (userId: number, buyRecordId: number): Success => {
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
