import { TOKEN_KEY } from 'common/js/config'
import { loadInfo } from 'common/js/cache'

const state = {
  // 身份令牌，有效时间 7200s
  // ！！！非常重要！！！
  token: loadInfo(TOKEN_KEY),
  // 个人信息
  personalInfo: {},
  // 校区信息（根据校区获取的班级）
  campusInfo: {},
  // 班级信息（根据班级获取的学生）
  classInfo: {},
  // 我带的班级（只有班主任才会保存）
  myTeachCls: []
}

export default state
