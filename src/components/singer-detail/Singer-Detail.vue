<template>
  <transition
    appear
    name='slider'
  >
    <music-list
      :bg-image='bgImage'
      :title='title'
      :songs='songs'
    ></music-list>
  </transition>
</template>

<script>
import MusicList from 'components/music-list/Music-List.vue'
import { mapGetters } from 'vuex'
import { getSingerDetail } from 'api/singer'
import { ERR_OK } from 'api/config'
import { createSong, isValidMusic, processSongsUrl } from 'common/js/song'
export default {
  data() {
    return {
      songs: []
    }
  },
  computed: {
    title() {
      return this.singer.name
    },
    bgImage() {
      return this.singer.imgUrl
    },
    ...mapGetters(['singer'])
  },
  created() {
    this._getDetail()
  },
  methods: {
    async _getDetail() {
      if (!this.singer.id) {
        this.$router.back()
        return
      }

      const res = await getSingerDetail(this.singer.id)
      const { code, data: { list } } = res
      if (code === ERR_OK) {
        const songs = await processSongsUrl(this._normalListSongs(list))
        this.songs = songs
        console.log(this.songs)
      }
    },
    _normalListSongs(list) {
      const result = []
      list.forEach(v => {
        const { musicData } = v
        if (isValidMusic(musicData)) {
          result.push(createSong(musicData))
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
