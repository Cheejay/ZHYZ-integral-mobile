import { Message } from 'element-ui'
import VueRouter from 'vue-router'

const router = new VueRouter()

// 信息弹出提示
export function openVn(msg = '', type = 'success') {
  Message({
    message: msg,
    type: type,
    showClose: true
  })
}

// 登陆失效
export function loginFailure(msg = '登陆已失效') {
  openVn(msg, 'info')
  router.push('/login')
}

// 函数节流
export function debounce(func, delay) {
  let timer

  return function(...args) {
    if(timer) {
      clearTimeout(timer)
    }

    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

// 查看数组里是否包含需要加入的元素
export function findIndex(list, newItem) {
  return list.findIndex((item) => {
    return item.id === newItem.id
  })
}

// 创建相同的数组时需要的字段可以封装成一个 class
export class Klass {
  constructor({id, name, sex, scoreTotal, scoreExchange}) {
    this.id = id
    this.name = name
    this.sex = sex
    this.scoreTotal = scoreTotal
    this.scoreExchange = scoreExchange
  }
}

// 排序
export function normalizeList(list = [], lizeName, isLizeEng = false) {
  let map = {}
  lizeName = lizeName.split('.')

  list.forEach((item, index) => {
    let key = item
    lizeName.forEach((cItem, index) => {
      key = key[cItem]
    })
    key = key.substr(0, 1)
    
    if(!map[key]) {
      map[key] = {
        title: key,
        items: []
      }
    }

    // 把数据都加进来
    map[key].items.push(new Klass({
      id: item.id,
      name: item.name,
      sex: item.sex ? item.sex : '',
      scoreTotal: item.score_total ? item.score_total : 0,
      scoreExchange: item.score_exchange ? item.score_exchange : 0
    }))
  })

  // 为了得到有序列表，需要处理 map
  let ret = []
  for(let key in map) {
    let val = map[key]
    ret.push(val)
  }

  if(isLizeEng) {
    // 排序 A,B,C,D
    ret.sort((a, b) => {
      return a.title.charCodeAt(0) - b.title.charCodeAt(0)
    })
  }

  return ret
}
