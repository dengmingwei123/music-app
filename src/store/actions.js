import * as types from './mutation-types'

// 播放音乐
export const playMusic = function ({ commit, state }, { list, index }) {
  // 全屏打开
  commit(types.SET_FULL_SCREEN_STATE, true)
  // 开始播放
  commit(types.SET_PLAYING_STATE, true)
  // 顺序播放列表
  commit(types.SET_SEQUENCE_LIST, list)
  // 当前播放列表
  commit(types.SET_PLAYLIST, list)
  // 当前播放索引
  commit(types.SET_CURRENT_INDEX, index)
}
