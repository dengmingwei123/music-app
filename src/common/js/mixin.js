import { mapGetters, mapMutations, mapActions } from 'vuex'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'

export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  mounted() {
    this.handlePlaylist(this.playlist)
  },
  activated() {
    this.handlePlaylist(this.playlist)
  },
  watch: {
    playlist(newVal) {
      this.handlePlaylist(newVal)
    }
  },
  methods: {
    handlePlaylist() {
      throw new Error('component must implement handlePlaylist method')
    }
  }
}

export const playerMixin = {
  computed: {
    ...mapGetters([
      'fullScreen',
      'playlist',
      'currentSong',
      'playing',
      'currentIndex',
      'mode',
      'sequenceList',
      'favoriteList'
    ]),
    iconMode() {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    favoriteIcon() {

    }
  },
  methods: {
    ...mapMutations({
      setFullScreenState: 'SET_FULL_SCREEN_STATE',
      setPlayingState: 'SET_PLAYING_STATE',
      setModeState: 'SET_MODE_STATE',
      setPlaylist: 'SET_PLAYLIST',
      setCurrentIndex: 'SET_CURRENT_INDEX'
    }),
    ...mapActions([
      'changeFavoriteList'
    ]),
    // 改变播放模式
    changeMode() {
      const mode = (this.mode + 1) % 3
      let list = null
      this.setModeState(mode)
      // 如果是随机播放,需要打乱数组
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        // 否则,就是顺序播放列表
        list = this.sequenceList
      }
      this.resetCurrentIndex(list)
      this.setPlaylist(list)
    },
    // 模式改变后,需要改变当前索引
    resetCurrentIndex(list) {
      const index = list.findIndex(v => {
        return v.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    // 添加到喜欢的列表中
    addFavorite(song) {
      this.changeFavoriteList({ song })
    },
    // 获取当前歌曲是否喜欢的
    getFavoriteIcon(song) {
      const index = this.favoriteList.findIndex(v => {
        return v.id === song.id
      })
      if (index >= 0) {
        return 'icon-favorite'
      } else {
        return 'icon-not-favorite'
      }
    }
  }
}

export const searchMixin = {
  data() {
    return {
      query: '',
      refreshDelay: 100
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory',
      'clearSearchHistory'
    ]),
    // 获取搜索框的值
    getQuery(query) {
      this.query = query
    },
    // 让input框失去焦点
    inputBlur() {
      this.$refs.searchBox.inputBlur()
    },
    // 删除一条历史记录
    deleteOne(item) {
      this.deleteSearchHistory({ query: item })
    },
    // 选中历史记录
    selectHistory(item) {
      this.$refs.searchBox.setQuery(item)
    }
  }
}
