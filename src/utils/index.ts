// 提取浮点数
export function extractFloatNumber(str: string) {
  if (!str) {
    return 0
  }
  return +str.toString().replace(/[^0-9.]/gi, '')
}

// 获取手机系统版本
export function getOsVersion() {
  const userAgent = navigator.userAgent
  let version = ''
  if (userAgent.indexOf('Mac OS X') > -1) {
    // ios
    const regStr_saf = /OS [\d._]*/gi
    const info = userAgent.match(regStr_saf)
    version = 'IOS' + (info + '').replace(/[^0-9|_.]/gi, '').replace(/_/gi, '.')
  } else if (userAgent.indexOf('Android') > -1 || userAgent.indexOf('Linux') > -1) {
    // android
    version =
      'Android' +
      userAgent.substr(
        userAgent.indexOf('Android') + 8,
        userAgent.indexOf(';', userAgent.indexOf('Android')) - userAgent.indexOf('Android') - 8
      )
  } else if (userAgent.indexOf('BB10') > -1) {
    // 黑莓bb10系统
    version =
      'blackberry' +
      userAgent.substr(
        userAgent.indexOf('BB10') + 5,
        userAgent.indexOf(';', userAgent.indexOf('BB10')) - userAgent.indexOf('BB10') - 5
      )
  } else if (userAgent.indexOf('IEMobile') > -1) {
    // windows phone
    version =
      'winphone' +
      userAgent.substr(
        userAgent.indexOf('IEMobile') + 9,
        userAgent.indexOf(';', userAgent.indexOf('IEMobile')) - userAgent.indexOf('IEMobile') - 9
      )
  } else {
    const userAgent = navigator.userAgent.toLowerCase()
    if (userAgent.indexOf('windows nt 5.0') > -1) {
      version = 'Windows 2000'
    } else if (userAgent.indexOf('windows nt 5.1') > -1 || userAgent.indexOf('windows nt 5.2') > -1) {
      version = 'Windows XP'
    } else if (userAgent.indexOf('windows nt 6.0') > -1) {
      version = 'Windows Vista'
    } else if (userAgent.indexOf('windows nt 6.1') > -1 || userAgent.indexOf('windows 7') > -1) {
      version = 'Windows 7'
    } else if (userAgent.indexOf('windows nt 6.2') > -1 || userAgent.indexOf('windows 8') > -1) {
      version = 'Windows 8'
    } else if (userAgent.indexOf('windows nt 6.3') > -1) {
      version = 'Windows 8.1'
    } else if (userAgent.indexOf('windows nt 6.2') > -1 || userAgent.indexOf('windows nt 10.0') > -1) {
      version = 'Windows 10'
    } else {
      version = 'Unknown'
    }
  }
  return version
}
