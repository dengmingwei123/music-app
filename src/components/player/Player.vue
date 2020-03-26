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

        <div class="middle">
          <div class="middle-l">
            <div
              class="cd-wrapper"
              ref='cdWrapper'
            >
              <div class="cd">
                <img
                  class='image'
                  :src='currentSong.image'
                >
              </div>
            </div>
          </div>
        </div>

        <div class="bottom">
          <div class="operators">

            <div class="icon i-left">
              <i class='icon-sequence'></i>
            </div>

            <div class="icon i-left">
              <i class='icon-prev'></i>
            </div>

            <div class="icon i-center">
              <i class='icon-play'></i>
            </div>

            <div class="icon i-right">
              <i class='icon-next'></i>
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
          <i class='icon-play-mini'></i>
        </div>

        <div class="control">
          <i class='icon-playlist'></i>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import animations from 'create-keyframe-animation'
import { prefixStyle } from 'common/js/dom'

const transform = prefixStyle('transform')

export default {
  created() {
  },
  computed: {
    ...mapGetters([
      'fullScreen',
      'playlist',
      'currentSong'
    ])
  },
  methods: {
    ...mapMutations({
      setFullScreenState: 'SET_FULL_SCREEN_STATE'
    }),
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
      cdWrapper.style.transition = 'all 0.4s'
      cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
      cdWrapper.addEventListener('transitionend', done)
    },
    afterLeave(el) {
      const cdWrapper = this.$refs.cdWrapper
      cdWrapper.style.transition = ''
      cdWrapper.style.transform = ''
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
    }
  },
  watch: {
    currentSong(newVal) {
      console.log(newVal)
    }
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
            }
          }
        }
      }
    }

    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;

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

      .icon-play-mini, .icon-playlist {
        font-size: 30px;
        color: $color-theme-d;
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
</style>
