import request from '@/utils/request'
import { encryptedData } from '@/utils/encrypt'
import { loginRSA, tokenName } from '@/config'

export async function login(data) {
  if (loginRSA) {
    data = await encryptedData(data)
  }
  return request({
    url: '/account/user/auth/login',
    method: 'post',
    data,
  })
}

export function logout() {
  return request({
    url: '/account/user/auth/logout',
    method: 'get',
  })
}

/**
 * 获取用户列表
 * @param {JSON} params
 *    size
 *    page
 *    search_val: 关键词搜索（手机号，用户名，昵称）
 *    status: 状态：1在职（默认） 2离职
 *    department_id: 部门ID
 * @returns
 */
export function getUserPageList(params) {
  return request({
    url: '/account/user/index/list',
    method: 'get',
    params,
  })
}

/**
 * 获取部门列表
 * @param {JSON} params
 *    search_val：关键词搜索
 * @returns
 */
export function getDepartmentList(params) {
  return request({
    url: '/account/user/department/list',
    method: 'get',
    params,
  })
}

export function register() {
  return request({
    url: '/register',
    method: 'post',
  })
}
