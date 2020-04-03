<template>
  <transition name='user'>
    <div
      class='user-center'
      ref='userCenter'
    >
      <div
        class="back"
        @click='back'
      >
        <i class='icon-back'></i>
      </div>
      <div class="switches-wrapper">
        <switches
          :switches='switches'
          :currentIndex='switchIndex'
          @activeSwitch='activeSwitch'
        ></switches>
      </div>
      <div
        class="play-btn"
        @click='randomPlaySong'
      >
        <i class='icon-play'></i>
        <span class='text'>随机播放全部</span>
      </div>
      <div
        class="list-wrapper"
        ref='listWrapper'
      >
        <scroll
          class="list-scroll"
          ref='favorite'
          v-if='switchIndex === 0'
          :click='click'
        >
          <div class="list-inner">
            <song-list
              :songs='favoriteList'
              @select='selectSong'
            ></song-list>
          </div>
        </scroll>
        <scroll
          class="list-scroll"
          ref='playHistory'
          :data='playHistory'
          :click='click'
          v-if="switchIndex === 1"
        >
          <div class="list-inner">
            <song-list
              :songs='playHistory'
              @select='selectSong'
            ></song-list>
          </div>
        </scroll>
      </div>
      <div
        class="no-result-wrapper"
        v-show='favoriteList.length===0'
      >
        <no-result title='暂无喜欢的音乐'></no-result>
      </div>
    </div>
  </transition>
</template>

<script>
import Switches from 'base/switches/Switches.vue'
import SongList from 'base/song-list/Song-List.vue'
import Scroll from 'base/scroll/Scroll'
import NoResult from 'base/no-result/No-Result.vue'
import { mapGetters, mapActions } from 'vuex'
import { playlistMixin } from 'common/js/mixin'
export default {
  mixins: [playlistMixin],
  data() {
    return {
      switchIndex: 0
    }
  },
  computed: {
    ...mapGetters([
      'playHistory',
      'favoriteList'
    ])
  },
  created() {
    this.switches = ['我喜欢的', '最近听的']
    this.click = true
  },
  methods: {
    ...mapActions([
      'insertSong',
      'randomPlay'
    ]),
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.listWrapper.style.bottom = bottom
      if (this.switchIndex === 0) {
        this.$refs.favorite.refresh()
      } else {
        this.$refs.playHistory.refresh()
      }
    },
    back() {
      this.$router.back()
    },
    activeSwitch(index) {
      this.switchIndex = index
    },
    selectSong(song, index) {
      this.insertSong({ song })
    },
    randomPlaySong() {
      if (this.switchIndex === 0) {
        if (this.favoriteList.length <= 0) {
          return
        }
        this.randomPlay({ list: this.favoriteList })
      } else {
        if (this.playHistory.length <= 0) {
          return
        }
        this.randomPlay({ list: this.playHistory })
      }
    }
  },
  components: {
    Switches,
    SongList,
    Scroll,
    NoResult
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable.styl';

.user-center {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  background-color: $color-background;

  &.user-enter-active, &.user-leave-active {
    transition: all 0.3s;
  }

  &.user-enter, &.user-leave-to {
    transform: translate3d(100%, 0, 0);
  }

  .back {
    position: absolute;
    left: 6px;
    top: 5px;
    z-index: 50;

    .icon-back {
      display: block;
      padding: 10px;
      color: $color-theme;
      font-size: $font-size-large-x;
    }
  }

  .switches-wrapper {
    margin: 10px 0 30px 0;
  }

  .play-btn {
    box-sizing: border-box;
    width: 135px;
    padding: 7px 0;
    margin: 0 auto;
    text-align: center;
    border: 1px solid $color-text-l;
    border-radius: 100px;
    font-size: 0;
    color: $color-text-l;

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

  .list-wrapper {
    position: absolute;
    top: 110px;
    bottom: 0;
    width: 100%;

    .list-scroll {
      height: 100%;
      overflow: hidden;

      .list-inner {
        padding: 20px 30px;
      }
    }
  }

  .no-result-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
