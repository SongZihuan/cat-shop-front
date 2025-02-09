export const isMobile = (phone: string) => /^1[0-9]{10}$/.test(phone)

export const isEmail = (email: string) => /^.+@.+\..+$/i.test(email)

export function maskPhoneNumber(phoneNumber: string) {
  return phoneNumber.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')
}

export function asString(obj: any) {
  return typeof obj === 'string' ? obj : ''
}
