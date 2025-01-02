import useUserStore, { hasLoad, isLogin } from '@/store/user'
import { AdminUser } from '@/store/admin/user'

export const isAdmin = (): boolean => {
  if (!isLogin() || !hasLoad()) {
    return false
  }

  return useUserStore().user.type !== 1
}

export const isRootAdmin = (): boolean => {
  return isAdmin() && useUserStore().user.type === 3
}

export const isDeleteUser = (user: AdminUser): boolean => {
  return user.status === 3
}

export const hasPermission = (user: AdminUser): boolean => {
  if (isRootAdmin()) {
    return true
  } else if (isDeleteUser(user)) {
    return false
  } else if (user.type === 3 || user.type === 2) {
    // 普通管理员对普通管理员没权下
    return false
  } else if (user.type == 1) {
    return true
  }
  return false
}
