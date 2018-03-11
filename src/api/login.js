import axios from 'axios'

// 检验登陆信息
export function checkLogin(query) {
  const url = 'http://10.21.168.65:9054/server.php?s=/api/v1/token/user'

  const data = Object.assign({}, ...query)

  return axios.post(url, data).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    console.log(err)
  })
}
