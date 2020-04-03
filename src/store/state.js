import { playMode } from 'common/js/config'
import { loadSearch, loadPlayHistory, loadFavorite } from 'common/js/cache'

const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playlist: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: 0,
  disc: {},
  topList: {},
  searchHistory: loadSearch(),
  playHistory: loadPlayHistory(),
  favoriteList: loadFavorite()
}

export default state
