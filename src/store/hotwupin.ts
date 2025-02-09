import { apiGetHotWupinLst } from '#/center/hotwupin'
import { Class } from '#/center/class'

export interface Wupin {
  id: number
  name: string
  pic: string
  classId: number
  classOf: Class
  tag?: string
  hotPrice?: number
  realPrice: number
  info: string
  ren: string
  phone: string
  email?: string
  wechat?: string
  location: string
  buytotal: number
  buydaohuo: number
  buygood: number
  buyprice: number
  buypingjia: number
  buyjian: number
  hot: boolean
}

const useHotWupinStore = defineStore('hotWupinStore', () => {
  const wupinLst = ref([] as Wupin[])

  const deleteAll = () => {
    wupinLst.value = []
  }

  const updateInfo = async (): Promise<null | Array<Wupin>> => {
    return apiGetHotWupinLst()
      .then((res) => {
        wupinLst.value = res.data.data.list
        return wupinLst.value
      })
      .catch(() => {
        return null
      })
  }

  const getLst = async () => {
    if (wupinLst.value.length === 0) {
      return updateInfo()
    }

    return Promise.resolve(wupinLst.value)
  }

  return {
    wupinLst,
    deleteAll,
    updateInfo,
    getLst
  }
})

export default useHotWupinStore
