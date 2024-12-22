import useConfigStore from "@/store/config"
import {isAdmin, isRootAdmin} from "@/store/admin/index"
import {
    apiAdminGetUserInfo,
    apiAdminGetUserLst, apiAdminPostNewUser,
    apiAdminPostUpdateAvatarData,
    apiAdminPostUpdateInfo, apiAdminPostUpdatePassword, apiAdminPostUpdatePhone, NewUserData
} from "#/admin/user";
import {sha256} from "@/utils/encrypt"

export const AdminUserType = {
    1: "用户",
    2: "管理员",
    3: "根管理员",
}

export const AdminUserStatus = {
    1: "正常",
    2: "冻结",
}

export const RootAdminUserStatus = {
    ...AdminUserStatus,
    3: "删除",// 理论上不会有
}

export const GetAdminUserStatus = (): {[status: number]: string} => {
    if (isRootAdmin()) {
        return RootAdminUserStatus
    } else if (isAdmin()) {
        return AdminUserStatus
    }
    return {}
}

export interface AdminUserId {
    id: number
}

export interface AdminUserBase {
    name: string
    wechat: string,
    email: string,
    location: string
    status: number
    type: number
}

export interface AdminUserAvatar {
    avatar: string
}

export interface AdminUserWithoutPre extends AdminUserId, AdminUserBase, AdminUserAvatar{
    phone: string
    totalPrice: number
    totalBuy: number
    totalGood: number
    totalJian: number
    totalShouHuo: number
    totalPingJia: number
}

export interface AdminUserPre {
    goodPre: number
    pricePre: number
}

export interface AdminUser extends AdminUserWithoutPre, AdminUserPre {}

const useAdminUserStore = defineStore("useAdminUserStore", () => {
    const targetUser = ref({} as {[id: number]: AdminUser})
    const location = ref("")
    
    async function getUser(id: number) {
        if (!isAdmin()) {
            return
        }
        
        // if (window.location.href === location.value && targetUser.value[id]) {
        //     return targetUser.value[id]
        // }
        
        const configStore = useConfigStore()
        return apiAdminGetUserInfo(id).then((res) => {
            const user = res.data.data as AdminUser

            user.goodPre = (user.totalGood / user.totalPingJia) * 100
            user.pricePre = user.totalPrice / user.totalBuy

            if (!user.name) {
                user.name = "新用户"
            }

            if (!user.avatar) {
                user.avatar = configStore.config?.avatar
            }

            if (!Object.keys(AdminUserType).some((v) => Number(v).valueOf() === user.type)) {
                user.type = 1
            }

            if (!Object.keys(GetAdminUserStatus()).some((v) => Number(v).valueOf() === user.status)) {
                user.status = 1
            }

            targetUser.value[id] = user
            location.value = window.location.href

            return user
        })
    }

    async function getUserLst(page: number, pagesize: number, phone?: string, name?: string, status?: number) {
        if (!isAdmin()) {
            return
        }

        const userLst = [] as AdminUser[]
        const configStore = useConfigStore()

        return apiAdminGetUserLst(page, pagesize, phone, name, status).then((res) => {
            res.data.data.list && res.data.data.list.forEach((user: AdminUser) => {
                user.goodPre = (user.totalGood / user.totalPingJia) * 100
                user.pricePre = user.totalPrice / user.totalBuy

                if (!user.name) {
                    user.name = "新用户"
                }

                if (!user.avatar) {
                    user.avatar = configStore.config?.avatar
                }

                if (!Object.keys(AdminUserType).some((v) => Number(v).valueOf() === user.type)) {
                    user.type = 1
                }

                if (!Object.keys(GetAdminUserStatus()).some((v) => Number(v).valueOf() === user.status)) {
                    user.status = 1
                }

                userLst.push(user)
            })

            return {
                maxpage: res.data.data.maxpage,
                total: userLst.length,
                list: userLst
            }
        })
    }

    const editData = async (userId: number, data: AdminUserBase) => {
        if (!isAdmin()) {
            return
        }

        return apiAdminPostUpdateInfo(userId, data).then((res) => {
            if (!res.data.data.success) {
                return Promise.reject("更新失败")
            }
            return Promise.resolve()
        })
    }

    const newUser = async (data: NewUserData) => {
        if (!isAdmin()) {
            return
        }

        return apiAdminPostNewUser(data).then((res) => {
            if (!res.data.data.success) {
                return Promise.reject("添加失败")
            }
            return Promise.resolve()
        })
    }

    const editUserAvatar = async (userId: number, avatar: Blob) => {
        if (!isAdmin()) {
            return
        }

        return apiAdminPostUpdateAvatarData(userId, avatar).then((res) => {
            if (!res.data.data.success) {
                return Promise.reject("更新失败")
            }
            return Promise.resolve()
        })
    }

    const editPassword = async (userId: number, data: { newPassword: string; newPasswordDouble: string }) => {
        if (!isAdmin()) {
            return
        }

        const configStore = useConfigStore()
        const newP = await sha256((`${configStore.config?.passwordfronthash}::${data.newPassword}>>`))

        return apiAdminPostUpdatePassword(userId, newP).then((res) => {
            if (!res.data.data.success) {
                return Promise.reject("更新失败")
            }
            return Promise.resolve()
        })
    }

    const editPhone = async (userId: number, data: { newPhone: string }) => {
        if (!isAdmin()) {
            return
        }

        return apiAdminPostUpdatePhone(userId, data.newPhone).then((res) => {
            if (!res.data.data.success) {
                return Promise.reject("更新失败")
            }
            return Promise.resolve()
        })
    }

    return {
        getUser,
        getUserLst,
        editUserAvatar,
        editData,
        editPassword,
        editPhone,
        newUser,
    }
})

export default useAdminUserStore