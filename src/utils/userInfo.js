import { storage, userTableName } from '@/config'
import { json } from 'body-parser'

/**
 * @description 获取用户信息
 * @returns {string|ActiveX.IXMLDOMNode|Promise<any>|any|IDBRequest<any>|MediaKeyStatus|FormDataEntryValue|Function|Promise<Credential | null>}
 */
export function getUserInfo() {
  if (storage) {
    if ('localStorage' === storage) {
      return JSON.parse(localStorage.getItem(userTableName))
    } else if ('sessionStorage' === storage) {
      return JSON.parse(sessionStorage.getItem(userTableName))
    } else {
      return JSON.parse(localStorage.getItem(userTableName))
    }
  } else {
    return JSON.parse(localStorage.getItem(userTableName))
  }
}

/**
 * @description 存储用户信息
 * @param userInfo
 * @returns {void|*}
 */
export function setUserInfo(userInfo) {
  userInfo = JSON.stringify(userInfo)
  if (storage) {
    if ('localStorage' === storage) {
      return localStorage.setItem(userTableName, userInfo)
    } else if ('sessionStorage' === storage) {
      return sessionStorage.setItem(userTableName, userInfo)
    } else {
      return localStorage.setItem(userTableName, userInfo)
    }
  } else {
    return localStorage.setItem(userTableName, userInfo)
  }
}

/**
 * @description 移除UserInfo
 * @returns {void|Promise<void>}
 */
export function removeUserInfo() {
  if (storage) {
    if ('localStorage' === storage) {
      return localStorage.removeItem(userTableName)
    } else if ('sessionStorage' === storage) {
      return sessionStorage.clear()
    } else {
      return localStorage.removeItem(userTableName)
    }
  } else {
    return localStorage.removeItem(userTableName)
  }
}
