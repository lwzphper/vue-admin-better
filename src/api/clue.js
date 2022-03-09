import request from '@/utils/request'
import { loginRSA, tokenName } from '@/config'

/**
 * 导入预览
 * @param {File} formData
 * @returns
 */
export function importPreview(formData) {
  return request({
    url: '/upload',
    method: 'post',
    data: formData,
  })
}

export function getPreviewList(data) {
  return request({
    url: '/userManagement/getList',
    method: 'post',
    data,
  })
}
