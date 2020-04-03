const SEARCH_KEY = 'searchHistory'
const SERACH_MAX_LENGTH = 15
const PLAYHISTORY_KEY = 'playHistory'
const PLAYHISTORY_MAX_LENGTH = 100
const FAVORITE_KEY = '_favorite_'

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
  // 添加到最前面
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

export const playHistory = function (song) {
  const playHistoryList = JSON.parse(localStorage.getItem(PLAYHISTORY_KEY)) || []
  insertArray(playHistoryList, song, v => {
    return v.id === song.id
  }, PLAYHISTORY_MAX_LENGTH)

  localStorage.setItem(PLAYHISTORY_KEY, JSON.stringify(playHistoryList))

  return playHistoryList
}

export const loadPlayHistory = function () {
  return JSON.parse(localStorage.getItem(PLAYHISTORY_KEY)) || []
}

export const saveFavorite = function (song) {
  const favoriteList = JSON.parse(localStorage.getItem(FAVORITE_KEY)) || []
  // 判断当前要加入喜欢列表的音乐在不在列表中
  const index = favoriteList.findIndex(v => {
    return v.id === song.id
  })
  // 若是在,则删除
  if (index >= 0) {
    favoriteList.splice(index, 1)
  } else {
    // 否则添加
    favoriteList.push(song)
  }
  localStorage.setItem(FAVORITE_KEY, JSON.stringify(favoriteList))
  return favoriteList
}

export const loadFavorite = function () {
  return JSON.parse(localStorage.getItem(FAVORITE_KEY)) || []
}
