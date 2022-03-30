import request from '@/utils/request'

/**
 * 企业切换列表
 * @param {*} params
 * @returns
 */
export function switchList() {
  return request({
    url: '/account/company/index/switchList',
    method: 'get',
  })
}

/**
 * 企业切换操作
 * @param {*} data
 * @returns
 */
export function handleSwitch(data) {
  return request({
    url: '/account/company/index/switch',
    method: 'post',
    data,
  })
}
