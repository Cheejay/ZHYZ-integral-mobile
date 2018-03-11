import axios from 'axios'
import { loadInfo } from 'common/js/cache'
import { TOKEN_KEY } from 'common/js/config'

// get 个人信息
export function getPersonalInfo() {
  let token = loadInfo(TOKEN_KEY)
  const url = 'http://10.21.168.65:9054/server.php?s=/api/v1/info'
  
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
