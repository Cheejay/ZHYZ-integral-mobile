import axios from 'axios'
import { loadInfo } from 'common/js/cache'
import { TOKEN_KEY } from 'common/js/config'

export function changePassword(query) {
  let token = loadInfo(TOKEN_KEY)
  const url = 'http://10.21.168.65:9054/server.php?s=/api/v1/password'

  return axios.post(url, ...query, {
    headers: {
      'XX-Token': token
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    console.log(err)
  })
}
