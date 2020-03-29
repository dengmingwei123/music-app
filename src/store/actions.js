import * as types from './mutation-types'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'

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
  } else if (index >= state.playlist.length - 1) {
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
