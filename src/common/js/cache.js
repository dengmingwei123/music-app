const SEARCH_KEY = 'searchHistory'
const SERACH_MAX_LENGTH = 15

const insertArray = function (arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  // 如果就是在第一个,则什么都不需要做
  if (index === 0) {
    return
  }
  // 如果不是第一个,则需要删除
  if (index > 0) {
    arr.splice(index, 1)
  }
  // 将搜索历史添加到最前面
  arr.unshift(val)
  // 若是超过了最大存储量
  if (maxLen && arr.length > maxLen) {
    // 删除最后一个
    arr.pop()
  }
  return arr
}

export const saveSearch = function (query) {
  // 判断本地存储中是否有记录
  const history = JSON.parse(localStorage.getItem(SEARCH_KEY)) || []

  insertArray(history, query, v => {
    return v === query
  }, SERACH_MAX_LENGTH)

  localStorage.setItem(SEARCH_KEY, JSON.stringify(history))

  return history
}

export const loadSearch = function () {
  return JSON.parse(localStorage.getItem('searchHistory')) || []
}

export const deleteSearch = function (query) {
  const history = JSON.parse(localStorage.getItem(SEARCH_KEY))
  const index = history.findIndex(v => {
    return v === query
  })
  history.splice(index, 1)
  localStorage.setItem(SEARCH_KEY, JSON.stringify(history))
  return history
}

export const clearSearch = function () {
  const history = []
  localStorage.setItem(SEARCH_KEY, JSON.stringify(history))
  return history
}
