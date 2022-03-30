/**
 * @author https://gitee.com/chu1204505056/vue-admin-better （不想保留author可删除）
 * @description 登录、获取用户信息、退出登录、清除accessToken逻辑，不建议修改
 */

import Vue from 'vue'
import { login, logout } from '@/api/user'
import {
  getAccessToken,
  removeAccessToken,
  setAccessToken,
} from '@/utils/accessToken'
import { removeUserInfo } from '@/utils/userInfo'
import { resetRouter } from '@/router'
import { title, tokenName, apiResponseTokenName } from '@/config'
import { getUserInfo, setUserInfo } from '@/utils/userInfo'

const state = () => ({
  accessToken: getAccessToken(),
  username: '',
  avatar: '',
  permissions: [],
})
const getters = {
  accessToken: (state) => state.accessToken,
  username: (state) => state.username,
  companyInfo: (state) => state.companyInfo,
  avatar: (state) => state.avatar,
  permissions: (state) => state.permissions,
}
const mutations = {
  setAccessToken(state, accessToken) {
    state.accessToken = accessToken
    setAccessToken(accessToken)
  },
  setUsername(state, username) {
    state.username = username
  },
  setCompanyInfo(state, companyInfo) {
    state.companyInfo = companyInfo
  },
  setAvatar(state, avatar) {
    state.avatar = avatar
  },
  setPermissions(state, permissions) {
    state.permissions = permissions
  },
}
const actions = {
  setPermissions({ commit }, permissions) {
    commit('setPermissions', permissions)
  },
  async login({ commit }, userInfo) {
    const data = await login(userInfo)
    const accessToken = data[apiResponseTokenName]
    if (accessToken) {
      commit('setAccessToken', accessToken)
      const hour = new Date().getHours()
      const thisTime =
        hour < 8
          ? '早上好'
          : hour <= 11
          ? '上午好'
          : hour <= 13
          ? '中午好'
          : hour < 18
          ? '下午好'
          : '晚上好'
      Vue.prototype.$baseNotify(`欢迎登录${title}`, `${thisTime}！`)
      // 设置用户信息
      setUserInfo(data['user'])
    } else {
      Vue.prototype.$baseMessage(
        `登录接口异常，未正确返回${apiResponseTokenName}...`,
        'error'
      )
    }
  },
  async setUserInfo({ commit }, data) {
    const accessToken = data[apiResponseTokenName]
    if (accessToken) {
      commit('setAccessToken', accessToken)
      // 设置用户信息
      setUserInfo(data['user'])
    } else {
      Vue.prototype.$baseMessage(
        `登录接口异常，未正确返回${apiResponseTokenName}...`,
        'error'
      )
    }
  },
  async getUserInfo({ commit, state }) {
    let userInfo = getUserInfo()
    let permissions = ['admin', 'editor']
    commit('setPermissions', permissions)
    commit('setUsername', userInfo['name'])
    commit('setCompanyInfo', userInfo['company'])
    commit('setAvatar', [])
    return permissions
    // const { data } = await getUserInfo(state.accessToken)
    // if (!data) {
    //   Vue.prototype.$baseMessage('验证失败，请重新登录...', 'error')
    //   return false
    // }
    // let { permissions, username, avatar } = data
    // if (permissions && username && Array.isArray(permissions)) {
    //   commit('setPermissions', permissions)
    //   commit('setUsername', username)
    //   commit('setAvatar', avatar)
    //   return permissions
    // } else {
    //   Vue.prototype.$baseMessage('用户信息接口异常', 'error')
    //   return false
    // }
  },
  async logout({ dispatch }) {
    await logout(state.accessToken)
    await dispatch('resetAccessToken')
    await resetRouter()
  },
  resetAccessToken({ commit }) {
    commit('setPermissions', [])
    commit('setAccessToken', '')
    removeAccessToken()
    removeUserInfo()
  },
}
export default { state, getters, mutations, actions }
