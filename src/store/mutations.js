import * as types from './mutation-types'

const matutaions = {
  [types.SET_TOKEN](state, token) {
    state.token = token
  },
  [types.SET_CURRENT_PERSONAL_ACCOUNT_INFO](state, info) {
    state.personalInfo = info
  },
  [types.SET_CAMPUS_INFO](state, info) {
    state.campusInfo = info
  },
  [types.SET_CLASS_INFO](state, info) {
    state.classInfo = info
  },
  [types.SET_MY_TEACH_CLS](state, info) {
    state.myTeachCls = info
  }
}

export default matutaions
