<template>
  <div
    class='player'
    v-show='playlist.length>0'
  >
    <transition
      name='normal'
      @enter='enter'
      @after-enter='afterEnter'
      @leave='leave'
      @after-leave='afterLeave'
    >
      <div
        class="normal-player"
        v-show='fullScreen'
      >
        <div class="background">
          <img
            width='100%'
            height='100%'
            :src='currentSong.image'
          >
        </div>

        <div class="top">
          <div
            class="back"
            @click='shrink'
          >
            <i class='icon-back'></i>
          </div>
          <h1
            class="title"
            v-html='currentSong.name'
          ></h1>
          <h2
            class="subtitle"
            v-html='currentSong.singer'
          ></h2>
        </div>

        <div
          class="middle"
          @touchstart.prevent='middleTouchStart'
          @touchmove.prevent='middleTouchMove'
          @touchend='middleTouchEnd'
        >
          <div
            class="middle-l"
            ref='middleLeft'
          >
            <div
              class="cd-wrapper"
              ref='cdWrapper'
            >
              <div class="cd">
                <img
                  :class='rotateIcon'
                  class='image'
                  :src='currentSong.image'
                >
              </div>
            </div>

            <div class="playing-lyric-wrapper">
              <div ref='lyricBox'>
                <div class="playing-lyric">{{ currentLyricText }}</div>
                <div class="playing-lyric">{{ currentLyricText }}</div>
              </div>
            </div>
          </div>
          <scroll
            class="middle-r"
            :data='currentLyric && currentLyric.lines'
            ref='lyricList'
          >
            <div class="lyric-wrapper">
              <div v-if='currentLyric'>
                <p
                  class="text"
                  ref='lyricLine'
                  :class='{current:index === currentLineNum}'
                  v-for='(lyric,index) in currentLyric.lines'
                  :key='lyric.time'
                  v-html='lyric.txt'
                ></p>
              </div>
            </div>
          </scroll>
        </div>

        <div class="bottom">
          <div class="dot-wrapper">
            <span
              class="dot"
              :class='{ active:currentShow ===
              "cd"
              }'
            ></span>
            <span
              class="dot"
              :class='{ active:currentShow === "lyric" }'
            ></span>
          </div>

          <div class='progress-wrapper'>
            <span class='time time-l'>{{ format(currentTime) }}</span>
            <div class="progress-bar-wrapper">
              <progress-bar
                :percent='percent'
                @percentchange='percentChange'
              ></progress-bar>
            </div>
            <span class='time time-r'>{{ format(currentSong.duration) }}</span>
          </div>

          <div class="operators">
            <div class="icon i-left">
              <i
                :class='iconMode'
                @click='changeMode'
              ></i>
            </div>

            <div
              class="icon i-left"
              :class='disableCls'
            >
              <i
                class='icon-prev'
                @click='prev'
              ></i>
            </div>

            <div
              class="icon i-center"
              :class='disableCls'
            >
              <i
                :class='playIcon'
                @click='togglePlaying'
              ></i>
            </div>

            <div
              class="icon i-right"
              :class='disableCls'
            >
              <i
                class='icon-next'
                @click='next'
              ></i>
            </div>

            <div class="icon i-right">
              <i class='icon-not-favorite'></i>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <transition name='mini'>
      <div
        class="min-player"
        v-show='!fullScreen'
        @click='open'
      >

        <div class="icon">
          <div class="imgWrapper">
            <img
              width='40'
              height='40'
              :class='rotateIcon'
              :src='currentSong.image'
            >
          </div>
        </div>

        <div class="text">
          <h2
            class='name'
            v-html='currentSong.name'
          ></h2>
          <p
            class='desc'
            v-html='currentSong.singer'
          ></p>
        </div>

        <div class="control">
          <progress-circle
            :redius='32'
            :percent='percent'
          >
            <i
              @click.stop='togglePlaying'
              :class='miniPlayIcon'
              class='icon-mini'
            ></i>
          </progress-circle>
        </div>

        <div class="control">
          <i class='icon-playlist'></i>
        </div>
      </div>
    </transition>
    <audio
      ref='audio'
      @canplay='ready'
      @error='error'
      @timeupdate='updateTime'
      @ended='end'
    >
    </audio>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import animations from 'create-keyframe-animation'
import { prefixStyle } from 'common/js/dom'
import ProgressBar from 'base/progress-bar/Progress-Bar.vue'
import ProgressCircle from 'base/progress-circle/Progress-Circle.vue'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'
import LyricParser from 'lyric-parser'
import Scroll from 'base/scroll/Scroll.vue'

const transform = prefixStyle('transform')
const transition = prefixStyle('transition')

export default {
  data() {
    return {
      songReady: false,
      currentTime: 0,
      currentLyric: null,
      currentLineNum: 0,
      currentShow: 'cd',
      currentLyricText: '',
      index: 0
    }
  },
  created() {
    this.touch = {}
  },
  computed: {
    ...mapGetters([
      'fullScreen',
      'playlist',
      'currentSong',
      'playing',
      'currentIndex',
      'mode',
      'sequenceList'
    ]),
    playIcon() {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    miniPlayIcon() {
      return !this.playing ? 'icon-play-mini' : 'icon-pause-mini'
    },
    rotateIcon() {
      return this.playing ? 'play' : 'play pause'
    },
    disableCls() {
      return this.songReady ? '' : 'disable'
    },
    percent() {
      return this.currentTime / this.currentSong.duration
    },
    iconMode() {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
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
    ...mapActions(['switchSong']),
    // 动画
    enter(el, done) {
      const { x, y, scale } = this._getPosAndScale()

      const animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        60: {
          transform: 'translate3d(0,0,0) scale(1.2)'
        },
        100: {
          transform: 'translate3d(0,0,0) scale(1)'
        }
      }

      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })

      animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    afterEnter(el) {
      animations.unregisterAnimation('move')
      this.$refs.cdWrapper.style.animation = ''
    },
    leave(el, done) {
      const { x, y, scale } = this._getPosAndScale()
      const cdWrapper = this.$refs.cdWrapper
      cdWrapper.style[transition] = 'all 0.4s'
      cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
      cdWrapper.addEventListener('transitionend', done)
    },
    afterLeave(el) {
      const cdWrapper = this.$refs.cdWrapper
      cdWrapper.style[transition] = ''
      cdWrapper.style[transform] = ''
    },
    // 获取数值
    _getPosAndScale() {
      const targetWidth = 40
      const targetPaddingLeft = 40
      const targetPaddingBottom = 30
      const currentPaddingTop = 80
      const currentWidth = window.innerWidth * 0.8
      const scale = targetWidth / currentWidth
      const x = -(window.innerWidth / 2 - targetPaddingLeft)
      const y = window.innerHeight - (currentPaddingTop + targetPaddingBottom + currentWidth / 2)

      return {
        scale,
        x,
        y
      }
    },
    // 缩小播放器
    shrink() {
      this.setFullScreenState(false)
    },
    // 打开播放器
    open() {
      this.setFullScreenState(true)
    },
    // 播放按钮的切换
    togglePlaying() {
      if (this.songReady) {
        this.setPlayingState(!this.playing)
      }
      // 需要切换歌词的状态
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
    },
    // 播放到结尾
    end() {
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.next()
      }
    },
    // 循环
    loop() {
      const audio = this.$refs.audio
      audio.currentTime = 0
      audio.play()
      // 如果是单曲循环,需要将歌词播放的地方回到最开始
      if (this.currentLyric) {
        this.currentLyric.seek(0)
      }
    },
    // 上一首
    prev() {
      if (this.playlist.length === 1) {
        this.loop()
      } else {
        const index = this.currentIndex - 1
        if (this.songReady) {
          this.switchSong({ index })
        }
      }
    },
    // 下一首
    next() {
      // 如果播放列表只有一首歌曲,只需要重复播放即可
      if (this.playlist.length === 1) {
        this.loop()
      } else {
        const index = this.currentIndex + 1
        if (this.songReady) {
          this.switchSong({ index })
        }
      }
    },
    // 播放器缓冲已足够开始时
    ready() {
      this.songReady = true
    },
    error() {
      this.songReady = true
    },
    // 获取播放时的时间戳
    updateTime(e) {
      this.currentTime = e.target.currentTime
    },
    // 通过时间戳改变格式
    format(interval) {
      const minute = interval / 60 | 0
      const second = this._pad(interval % 60 | 0)
      return `${minute}:${second}`
    },
    // 改变秒,如果是个位数就在前面加0
    _pad(num, n = 2) {
      const len = num.toString().length
      if (len < n) {
        num = '0' + num
      }
      return num
    },
    // 获取改变后进度条的进度
    percentChange(percent) {
      const changeTime = percent * this.currentSong.duration
      this.$refs.audio.currentTime = changeTime
      if (!this.playing) {
        this.togglePlaying()
      }
      // 改变歌词的进度
      if (this.currentLyric) {
        this.currentLyric.seek(changeTime * 1000)
      }
    },
    // 改变播放模式
    changeMode() {
      const mode = (this.mode + 1) % 3
      let list = null
      this.setModeState(mode)
      // 如果是随机播放,需要进行洗牌
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.resetCurrentIndex(list)
      this.setPlaylist(list)
    },
    // 播放模式改变后,需要重新设置currentIndex
    resetCurrentIndex(list) {
      const index = list.findIndex(v => {
        return v.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    // 获取歌词
    async getLyric() {
      if (!this.$refs.audio.src) {
        return
      }
      try {
        const result = await this.currentSong.getLyric()
        this.currentLyric = new LyricParser(result, this.handleLyric)
        if (this.playing) {
          this.currentLyric.play()
        }
      } catch (err) {
        // 如果获取不到歌词
        this.currentLyric = null
        this.currentLyricText = ''
        this.currentLineNum = 0
      }
    },
    handleLyric({ lineNum, txt }) {
      this.currentLyricText = txt

      const lyricBox = this.$refs.lyricBox
      this.index++
      lyricBox.style[transition] = 'all 0.3s'
      lyricBox.style[transform] = `translate3d(0,-${this.index * 20}px,0)`

      lyricBox.addEventListener('transitionend', () => {
        if (this.index >= lyricBox.children.length - 1) {
          this.index = 0
          lyricBox.style[transition] = 'none'
          lyricBox.style[transform] = 'translate3d(0,0,0)'
        }
      })

      this.currentLineNum = lineNum
      if (lineNum > 5) {
        this.$refs.lyricList.scrollToElement(this.$refs.lyricLine[lineNum - 5], 1000)
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000)
      }
    },
    middleTouchStart(e) {
      this.$refs.lyricList.$el.style[transition] = ''
      this.$refs.middleLeft.style[transition] = ''
      // 保存初始化
      this.touch.initated = true
      // 保存触屏时的开始值
      this.touch.startX = e.touches[0].pageX
      this.touch.startY = e.touches[0].pageY
    },
    middleTouchMove(e) {
      if (!this.touch.initated) {
        return
      }
      // 判断差值
      const deltaX = e.touches[0].pageX - this.touch.startX
      const deltaY = e.touches[0].pageY - this.touch.startY
      // 判断是否是左右滑动,如若不是,什么都不做
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        return
      }
      // 如果是左右滑动
      const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
      const width = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
      const percent = Math.abs(width) / window.innerWidth
      this.$refs.lyricList.$el.style[transform] = `translate3d(${width}px,0,0)`
      this.$refs.middleLeft.style.opacity = 1 - percent
      this.touch.offset = width
    },
    middleTouchEnd() {
      this.touch.initated = false
      this.$refs.lyricList.$el.style.transition = 'all 1s'
      this.$refs.middleLeft.style[transition] = 'all 1s'
      if (this.currentShow === 'cd') {
        if (Math.abs(this.touch.offset) > window.innerWidth * 0.3) {
          this.$refs.lyricList.$el.style[transform] = `translate3d(${-window.innerWidth}px,0,0)`
          this.$refs.middleLeft.style.opacity = 0
          this.currentShow = 'lyric'
        } else {
          this.$refs.lyricList.$el.style[transform] = 'translate3d(0,0,0)'
          this.$refs.middleLeft.style.opacity = 1
        }
      } else {
        if (this.touch.offset > -window.innerWidth * 0.7) {
          this.$refs.lyricList.$el.style[transform] = 'translate3d(0,0,0)'
          this.$refs.middleLeft.style.opacity = 1
          this.currentShow = 'cd'
        } else {
          this.$refs.lyricList.$el.style[transform] = `translate3d(${-window.innerWidth}px,0,0)`
          this.$refs.middleLeft.style.opacity = 0
        }
      }
    }
  },
  watch: {
    currentSong(newSong, oldSong) {
      // 如果新的歌曲和旧的歌曲一样,不需要做什么
      if (newSong.id === oldSong.id) {
        return
      }
      // 换歌后,重新获取歌词前,需要将当前的歌词停止,并清空
      if (this.currentLyric) {
        this.currentLyric.stop()
        this.currentLyric = null
        this.currentTime = 0
        this.playingLyric = ''
        this.currentLineNum = 0
      }
      const audio = this.$refs.audio
      // 防止快速点击造成错误
      this.songReady = false
      // 播放音乐
      this.$nextTick(() => {
        audio.pause()
        audio.src = newSong.url
        audio.play()
        this.getLyric()
      })
    },
    // 播放状态改变,开始停止播放音乐
    playing(newVal) {
      const audio = this.$refs.audio
      this.$nextTick(() => {
        newVal ? audio.play() : audio.pause()
      })
    }
  },
  components: {
    ProgressBar,
    ProgressCircle,
    Scroll
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable.styl';

.player {
  .normal-player {
    position: fixed;
    width: 100%;
    top: 0;
    bottom: 0;
    z-index: 150;
    background-color: $color-background;

    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);
    }

    .top {
      position: relative;

      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;

        .icon-back {
          display: block;
          padding: 9px;
          transform: rotate(-90deg);
          font-size: $font-size-large-x;
          color: $color-theme;
        }
      }

      .title {
        width: 70%;
        height: 40px;
        line-height: 40px;
        margin: 0 auto;
        text-align: center;
        font-size: $font-size-large;
        color: $color-text;
        no-wrap();
      }

      .subtitle {
        width: 100%;
        height: 20px;
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
        no-wrap();
      }
    }

    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;

      .middle-l {
        position: relative;
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 0;
        padding-top: 80%;

        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          box-sizing: border-box;
          width: 80%;
          height: 100%;

          .cd {
            width: 100%;
            height: 100%;
            border-radius: 50%;

            .image {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border-radius: 50%;
              border: 10px solid rgba(255, 255, 255, 0.1);

              &.play {
                animation: rotate 20s linear infinite;
              }

              &.pause {
                animation-play-state: paused;
              }
            }
          }
        }

        .playing-lyric-wrapper {
          width: 80%;
          height: 20px;
          overflow: hidden;
          margin: 30px auto 0 auto;
          text-align: center;

          .playing-lyric {
            line-height: 20px;
            color: $color-text-l;
            font-size: $font-size-medium;
          }
        }
      }

      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;

        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          text-align: center;

          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;

            &.current {
              color: $color-text;
            }
          }
        }
      }
    }

    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;

      .dot-wrapper {
        text-align: center;

        .dot {
          display: inline-block;
          vertical-align: middle;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin: 0 4px;
          background-color: $color-text-l;

          &.active {
            width: 20px;
            border-radius: 5px;
            background-color: $color-text-ll;
          }
        }
      }

      .progress-wrapper {
        width: 80%;
        margin: 0 auto;
        padding: 10px 0;
        display: flex;

        .progress-bar-wrapper {
          flex: 1;
          height: 30px;
          line-height: 30px;
        }

        .time {
          flex: 0 0 30px;
          width: 30px;
          line-height: 30px;
          font-size: $font-size-small;

          &.time-l {
            text-align: left;
          }

          &.time-r {
            text-align: right;
          }
        }
      }

      .operators {
        display: flex;
        align-items: center;

        .icon {
          flex: 1;
          color: $color-theme;

          &.disable {
            color: $color-theme-d;
          }

          i {
            font-size: 30px;
          }
        }

        .i-left {
          text-align: right;
        }

        .i-center {
          padding: 0 20px;
          text-align: center;

          i {
            font-size: 40px;
          }
        }

        .i-right {
          text-align: left;
        }

        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }

    &.normal-enter-active, &.normal-leave-active {
      transition: all 0.4s;

      .top, .bottom {
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
      }
    }

    &.normal-enter, &.normal-leave-to {
      opacity: 0;

      .top {
        transform: translate3d(0, -100px, 0);
      }

      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }

  .min-player {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: 60px;
    background: $color-highlight-background;
    display: flex;
    align-items: center;

    .icon {
      flex: 0 0 40px;
      width: 40px;
      height: 40px;
      padding: 0 10px 0 20px;

      .imgWrapper {
        width: 100%;
        height: 100%;

        img {
          border-radius: 50%;

          &.play {
            animation: rotate 20s linear infinite;
          }

          &.pause {
            animation-play-state: paused;
          }
        }
      }
    }

    .text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      overflow: hidden;
      flex: 1;
      line-height: 20px;

      .name {
        margin-bottom: 2px;
        font-size: $font-size-medium;
        color: $color-text;
        no-wrap();
      }

      .desc {
        font-size: $font-size-small;
        color: $color-text-d;
        no-wrap();
      }
    }

    .control {
      flex: 0 0 30px;
      width: 30px;
      padding: 0 10px;

      .icon-play-mini, .icon-playlist, .icon-pause-mini {
        font-size: 30px;
        color: $color-theme-d;
      }

      .icon-mini {
        position: absolute;
        top: 0;
        left: 0;
        font-size: 32px;
      }
    }

    &.mini-enter-active, &.mini-leave-active {
      transition: all 0.4s;
    }

    &.mini-enter, &.mini-leave-to {
      opacity: 0;
    }
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
