import * as types from './mutation-types'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'
import { saveSearch, deleteSearch, clearSearch, playHistory, saveFavorite } from 'common/js/cache'

function findIndex(list, song) {
  return list.findIndex(v => {
    return v.id === song.id
  })
}

// 播放音乐
export const playMusic = function ({ commit, state }, { list, index }) {
  // 全屏打开
  commit(types.SET_FULL_SCREEN_STATE, true)
  // 顺序播放列表
  commit(types.SET_SEQUENCE_LIST, list)
  // 判断是否是随机播放
  if (state.mode === playMode.random) {
    // 需要打乱数组
    const randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    // 需要找出当前点击歌曲在新数组中的索引
    index = findIndex(randomList, list[index])
  } else {
    // 当前播放列表
    commit(types.SET_PLAYLIST, list)
  }
  // 当前播放索引
  commit(types.SET_CURRENT_INDEX, index)
  // 开始播放
  commit(types.SET_PLAYING_STATE, true)
}

// 上一首下一首播放
export const switchSong = function ({ commit, state }, { index }) {
  if (index <= -1) {
    index = state.playlist.length - 1
  } else if (index > state.playlist.length - 1) {
    index = 0
  }
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_CURRENT_INDEX, index)
}

// 随机播放
export const randomPlay = function ({ commit, state }, { list }) {
  // 改变播放状态
  commit(types.SET_MODE_STATE, playMode.random)
  // 全屏打开
  commit(types.SET_FULL_SCREEN_STATE, true)
  // 顺序播放列表
  commit(types.SET_SEQUENCE_LIST, list)
  // 随机播放列表
  commit(types.SET_PLAYLIST, shuffle(list))
  // 进行播放
  commit(types.SET_PLAYING_STATE, true)
  // 当前播放索引
  commit(types.SET_CURRENT_INDEX, 0)
}

// 插入音乐
export const insertSong = function ({ commit, state }, { song }) {
  const playlist = state.playlist.slice()
  const sequenceList = state.sequenceList.slice()
  const currentIndex = state.currentIndex
  const currentSong = playlist[currentIndex]
  if (currentSong) {
    if (currentSong.id === song.id) {
      return
    }
  }
  // 判断播放列表中是否有当前这个音乐
  const PlayIndex = findIndex(playlist, song)
  if (PlayIndex >= 0) {
    // 有这首歌曲,需要删除,重新添加
    playlist.splice(PlayIndex, 1)
  }
  // 判断顺序列表中是否有当前这个音乐
  const sequenceIndex = findIndex(sequenceList, song)
  if (sequenceIndex >= 0) {
    // 有这首歌曲,需要删除,重新添加
    sequenceList.splice(sequenceIndex, 1)
  }
  // 当前是否在播放音乐
  playlist.splice(currentIndex, 0, song)
  sequenceList.splice(currentIndex, 0, song)

  // 提交
  // 全屏打开
  commit(types.SET_FULL_SCREEN_STATE, true)
  // 顺序列表
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  // 播放列表
  commit(types.SET_PLAYLIST, playlist)
  // 当前播放索引
  commit(types.SET_CURRENT_INDEX, currentIndex)
  // 播放状态
  commit(types.SET_PLAYING_STATE, true)
}

// 保存搜索历史记录
export const saveSearchHistory = function ({ commit, state }, { query }) {
  const history = saveSearch(query)
  // 还需要提交到vuex中
  commit(types.SET_SEARCH_HISTORY, history)
}

// 删除搜索历史记录
export const deleteSearchHistory = function ({ commit, state }, { query }) {
  const history = deleteSearch(query)
  commit(types.SET_SEARCH_HISTORY, history)
}

// 清空搜索历史
export const clearSearchHistory = function ({ commit, state }) {
  const history = clearSearch()
  commit(types.SET_SEARCH_HISTORY, history)
}

// 删除列表的一首歌
export const deleteSong = function ({ commit, state }, { song }) {
  const playlist = state.playlist.slice()
  const sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  // 获取当前要删除歌曲在播放列表的位置
  const playIndex = findIndex(playlist, song)
  // 删除
  playlist.splice(playIndex, 1)
  // 获取当前要删除歌曲在顺序列表的位置
  const requenceIndex = findIndex(sequenceList, song)
  // 删除
  sequenceList.splice(requenceIndex, 1)
  // 判断当前播放索引是否大于要删除歌曲的索引,或者当前播放的是最后一条
  if (currentIndex > playIndex || currentIndex === playlist.length) {
    // index需要-1
    currentIndex--
  }
  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  // 如果播放列表没有歌曲了,需要停止播放
  if (!playlist.length) {
    commit(types.SET_CURRENT_INDEX, 0)
    commit(types.SET_PLAYING_STATE, false)
  }
}

// 清空列表所有歌曲
export const clearSong = function ({ commit, state }) {
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_PLAYING_STATE, false)
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
}

// 修改最近播放的列表
export const changePlayHistory = function ({ commit, state }, { song }) {
  const playHistoryList = playHistory(song)
  commit(types.SET_PLAY_HISTORY, playHistoryList)
}

// 修改喜欢的音乐列表
export const changeFavoriteList = function ({ commit, state }, { song }) {
  const favoriteList = saveFavorite(song)
  commit(types.SET_FAVORITE_LIST, favoriteList)
}
