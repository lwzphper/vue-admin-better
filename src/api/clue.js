import request from '@/utils/request'
import { loginRSA, tokenName } from '@/config'

/**
 * 上传导入的excel表格
 * @param {File} formData
 * @returns
 */
export function uploadImportExcel(formData) {
  console.log(formData)
  return request({
    url: '/manage/admin/clue/import/upload',
    method: 'post',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

/**
 * 导入表单预览
 * @param {*} data
 * @returns
 */
export function getImportPreviewList(data) {
  return request({
    url: '/manage/admin/clue/import/getPageList',
    method: 'post',
    data,
  })
}