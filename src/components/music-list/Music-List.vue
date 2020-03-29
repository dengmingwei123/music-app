<template>
  <div class='music-list'>
    <div
      class="back"
      @click='back'
    >
      <i class='icon-back'></i>
    </div>
    <h1
      class='title'
      v-html='title'
    ></h1>
    <div
      class="bg-image"
      :style='bgStyle'
      ref='bgImage'
    >
      <div
        class="play-wrapper"
        ref='playWrapper'
      >
        <div
          class="playBtn"
          v-show='songs.length'
          @click='random'
        >
          <i class='icon-play'></i>
          <span class='text'>随机播放全部</span>
        </div>
      </div>
      <div
        class="filter"
        ref='filter'
      ></div>
    </div>
    <div
      class="bg-layer"
      ref='bgLayer'
    ></div>
    <scroll
      class="list"
      ref='list'
      @scroll='scroll'
      :data='songs'
      :click='click'
      :probeType='probeType'
      :listenScroll='true'
    >
      <div class="song-list-wrapper">
        <song-list
          :songs='songs'
          @select='selectSong'
        ></song-list>
      </div>
      <div
        v-show='!songs.length'
        class='loading-container'
      >
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
import SongList from 'base/song-list/Song-List.vue'
import Scroll from 'base/scroll/Scroll.vue'
import Loading from 'base/loading/Loading.vue'
import { prefixStyle } from 'common/js/dom'
import { mapActions } from 'vuex'
import { playlistMixin } from 'common/js/mixin'

const HEADER_HEIGHT = 40
const transform = prefixStyle('transform')
const backdrop = prefixStyle('backdrop-filter')
export default {
  mixins: [playlistMixin],
  props: {
    title: {
      type: String,
      default: ''
    },
    bgImage: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default: null
    }
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.bgImage})`
    }
  },
  data() {
    return {
      scrollY
    }
  },
  created() {
    this.probeType = 3
    this.listenScroll = true
    this.click = true
  },
  mounted() {
    this.imageHeight = this.$refs.bgImage.clientHeight
    this.maxTranslateY = -this.imageHeight + HEADER_HEIGHT
    this.$refs.list.$el.style.top = this.imageHeight + 'px'
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.list.$el.style.bottom = bottom
      this.$refs.list.refresh()
    },
    ...mapActions([
      'playMusic',
      'randomPlay'
    ]),
    back() {
      this.$router.back()
    },
    // 实时获取滚动值
    scroll(pos) {
      this.scrollY = pos.y
    },
    // 选中播放
    selectSong(song, index) {
      this.playMusic({ list: this.songs, index, song })
    },
    // 随机播放
    random() {
      this.randomPlay({ list: this.songs })
    }
  },
  watch: {
    scrollY(newVal) {
      const bgLayer = this.$refs.bgLayer
      const bgImage = this.$refs.bgImage
      const playWrapper = this.$refs.playWrapper
      const filter = this.$refs.filter
      const translateY = Math.max(this.maxTranslateY, newVal)
      const percent = Math.abs(newVal / this.imageHeight)
      let scale = 1
      let zIndex = 0
      let blur = 0
      if (newVal > 0) {
        zIndex = 10
        scale = 1 + percent
      } else {
        blur = Math.min(20, percent * 20)
      }
      if (newVal < this.maxTranslateY) {
        zIndex = 10
        bgImage.style.paddingTop = `${HEADER_HEIGHT}px`
        playWrapper.style.display = 'none'
      } else {
        bgImage.style.paddingTop = `${70}%`
        playWrapper.style.display = ''
      }
      bgLayer.style[transform] = `translate3d(0,${translateY}px,0)`
      bgImage.style[transform] = `scale(${scale})`
      filter.style[backdrop] = `blur(${blur}px)`
      bgImage.style.zIndex = zIndex
    }
  },
  components: {
    SongList,
    Scroll,
    Loading
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable.styl';

.music-list {
  position: fixed;
  width: 100%;
  top: 0;
  bottom: 0;
  z-index: 100;
  background-color: $color-background;

  .back {
    position: absolute;
    left: 6px;
    top: 0;
    z-index: 50;

    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }

  .title {
    position: absolute;
    top: 0;
    left: 10%;
    width: 80%;
    z-index: 40;
    line-height: 40px;
    no-wrap();
    text-align: center;
    font-size: $font-size-large;
    color: $color-text;
  }

  .bg-image {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 70%;
    transform-origin: top;
    background-size: cover;

    .play-wrapper {
      position: absolute;
      bottom: 20px;
      width: 100%;
      z-index: 50;

      .playBtn {
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0;
        margin: 0 auto;
        font-size: 0;
        text-align: center;
        border: 1px solid $color-theme;
        border-radius: 100px;
        color: $color-theme;

        .icon-play {
          display: inline-block;
          vertical-align: middle;
          margin-right: 6px;
          font-size: $font-size-medium-x;
        }

        .text {
          display: inline-block;
          vertical-align: middle;
          font-size: $font-size-small;
        }
      }
    }

    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(7, 17, 27, 0.4);
    }
  }

  .bg-layer {
    position: relative;
    height: 100%;
    background-color: $color-background;
  }

  .list {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    background-color: $color-background;

    .song-list-wrapper {
      padding: 20px 30px;
    }

    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
