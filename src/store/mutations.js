import * as types from './mutation-types'

const mutations = {
  [types.SET_SINGER](state, singer) {
    state.singer = singer
  },
  [types.SET_PLAYING_STATE](state, flag) {
    state.playing = flag
  },
  [types.SET_FULL_SCREEN_STATE](state, flag) {
    state.fullScreen = flag
  },
  [types.SET_PLAYLIST](state, array) {
    state.playlist = array
  },
  [types.SET_SEQUENCE_LIST](state, array) {
    state.sequenceList = array
  },
  [types.SET_MODE_STATE](state, number) {
    state.mode = number
  },
  [types.SET_CURRENT_INDEX](state, number) {
    state.currentIndex = number
  },
  [types.SET_DISC](state, disc) {
    state.disc = disc
  }
}

export default mutations
