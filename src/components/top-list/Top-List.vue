<template>
  <transition
    name='slider'
    appear
  >
    <music-list
      :title='title'
      :bgImage='bgImage'
      :songs='songs'
      :rank='rank'
    ></music-list>
  </transition>
</template>

<script>
import MusicList from 'components/music-list/Music-List.vue'
import { mapGetters } from 'vuex'
import { getMusicList } from 'api/rank'
import { ERR_OK } from 'api/config'
import { createSingerSong, isValidMusic, processSongsUrl } from 'common/js/song'

export default {
  data() {
    return {
      songs: [],
      rank: true
    }
  },
  computed: {
    ...mapGetters([
      'topList'
    ]),
    title() {
      return this.topList.AdShareContent
    },
    bgImage() {
      return this.topList.frontPicUrl
    }
  },
  created() {
    if (!this.topList.topId) {
      this.$router.back()
      return
    }
    this._getMusicList()
  },
  methods: {
    async _getMusicList() {
      const res = await getMusicList(this.topList.topId)
      const { code, songlist } = res
      if (code === ERR_OK) {
        const songs = await processSongsUrl(this._normalizeSong(songlist))
        this.songs = songs
      }
    },
    _normalizeSong(list) {
      const result = []
      list.forEach(v => {
        if (isValidMusic(v.data)) {
          result.push(createSingerSong(v.data))
        }
      })
      return result
    }
  },
  components: {
    MusicList
  }
}
</script>

<style lang="stylus" scoped>
.slider-enter-active, .slider-leave-active {
  transition: all 0.3s;
}

.slider-enter, .slider-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>
