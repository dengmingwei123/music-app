<template>
  <transition
    name='slider'
    appear
  >
    <music-list
      :title='title'
      :bgImage='bgImage'
      :songs='songs'
    ></music-list>
  </transition>
</template>

<script>
import MusicList from 'components/music-list/Music-List.vue'
import { mapGetters } from 'vuex'
import { getSongList } from 'api/recommend'
import { ERR_OK } from 'api/config'
import { createSongList, isValidSong, processSongsUrl } from 'common/js/song'

export default {
  data() {
    return {
      songs: []
    }
  },
  computed: {
    ...mapGetters([
      'disc'
    ]),
    title() {
      return this.disc.title
    },
    bgImage() {
      return this.disc.cover
    }
  },
  created() {
    if (!this.disc.content_id) {
      console.log(1)
      this.$router.back()
    }
    this._getSongList()
  },
  methods: {
    async _getSongList() {
      const res = await getSongList(this.disc.content_id)
      const { code, data } = res
      if (code === ERR_OK) {
        const songs = await processSongsUrl(this._normalizeSongList(data))
        this.songs = songs
      }
    },
    _normalizeSongList(list) {
      const result = []
      list.forEach(v => {
        if (isValidSong(v)) {
          result.push(createSongList(v))
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
