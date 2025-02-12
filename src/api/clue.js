import request from '@/utils/request'

/**
 * 上传导入的excel表格
 * @param {File} formData
 * @returns
 */
export function uploadImportExcel(formData) {
  return request({
    url: '/manage/admin/clue/import/upload',
    method: 'post',
    data: formData,
    timeout: 10000,
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

/**
 * 导入表单预览
 * @param {*} data
 * @returns
 */
export function getImportPreviewList(params) {
  return request({
    url: '/manage/admin/clue/import/getPageList',
    method: 'get',
    params,
  })
}

/**
 * 导入数据
 * @param {*} data
 * @returns
 */
export function importExcelData(data) {
  return request({
    url: '/manage/admin/clue/import/import',
    method: 'post',
    timeout: 10000,
    data,
  })
}
