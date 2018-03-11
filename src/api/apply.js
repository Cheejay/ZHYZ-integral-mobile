import axios from 'axios'
import { loadInfo } from 'common/js/cache'
import { TOKEN_KEY } from 'common/js/config'

// 获取请假项目列表
export function getLeaveList() {
  let token = loadInfo(TOKEN_KEY)
  const url = 'http://10.21.168.65:9054/server.php?s=/api/v1/leave_type/all'

  return axios.get(url, {
    headers: {
      'XX-Token': token
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    console.log(err)
  })
}

// 申请请假
export function askForLeave(query) {
  let token = loadInfo(TOKEN_KEY)
  const url = 'http://10.21.168.65:9054/server.php?s=/api/v1/leave'

  const data = Object.assign({}, ...query)

  return axios.post(url, data, {
    headers: {
      'XX-Token': token
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    console.log(err)
  })
}

// 获取 全部 / 已审批 / 未审批 列表
export function getProcessApplyList(filter, page = 1) {
  let token = loadInfo(TOKEN_KEY)
  const url = 'http://10.21.168.65:9054/server.php?s=/api/v1/leave/approval'

  return axios.get(url, {
    headers: {
      'XX-Token': token
    },
    params: {
      filter: filter,
      page: page
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    console.log(err)
  })
}

// 最终审批
export function approvalApply(leaveId, status, summary) {
  let token = loadInfo(TOKEN_KEY)
  const url = `http://10.21.168.65:9054/server.php?s=/api/v1/leave/approval/${leaveId}`

  const data = Object.assign({}, {
    status: status,
    summary: summary
  })

  return axios.post(url, data, {
    headers: {
      'XX-Token': token
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    console.log(err)
  })
}
