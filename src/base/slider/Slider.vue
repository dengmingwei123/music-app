<template>
  <div
    class='slider'
    ref='slider'
  >
    <div
      class="slider-group"
      ref='sliderGroup'
    >
      <slot></slot>
    </div>
    <div class="dots">
      <span
        v-for='(item,index) in dots'
        :key='index'
        class='dot'
        :class='{active:currentPageIndex===index}'
      ></span>
    </div>
  </div>
</template>

<script>
import BetterScroll from 'better-scroll'
export default {
  data() {
    return {
      dots: [],
      currentPageIndex: 0
    }
  },
  props: {
    // 是否可以循环轮播
    loop: {
      type: Boolean,
      default: true
    },
    // 是否自动轮播
    autoPlay: {
      type: Boolean,
      default: true
    },
    // 轮播时间
    interval: {
      type: Number,
      default: 3000
    }
  },
  mounted() {
    setTimeout(() => {
      this._setSliderWidth()
      this._initDots()
      this._initSlider()

      if (this.autoPlay) {
        this._play()
      }
    }, 20)

    window.addEventListener('resize', () => {
      if (!this.slider) {
        return
      }
      this.refresh()
    })
  },
  activated() {
    this.slider.enable()
    const pageIndex = this.slider.getCurrentPage().pageX
    this.slider.goToPage(pageIndex, 0, 0)
    this.currentPageIndex = pageIndex
    if (this.autoPlay) {
      this._play()
    }
  },
  deactivated() {
    this.slider.disable()
    clearTimeout(this.timer)
  },
  beforeDestroy() {
    this.slider.disable()
    clearTimeout(this.timer)
  },
  methods: {
    refresh() {
      this._setSliderWidth(true)
      this.slider.refresh()
    },
    _setSliderWidth(isResize) {
      this.children = this.$refs.sliderGroup.children
      let width = 0
      const sliderWidth = this.$refs.slider.clientWidth
      for (let i = 0; i < this.children.length; i++) {
        const child = this.children[i]
        child.classList.add('slider-item')
        child.style.width = sliderWidth + 'px'
        width += sliderWidth
      }
      if (this.loop && !isResize) {
        width += 2 * sliderWidth
      }
      this.$refs.sliderGroup.style.width = width + 'px'
    },
    _initDots() {
      this.dots = new Array(this.children.length)
    },
    _initSlider() {
      this.slider = new BetterScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop,
          threshold: 0.3,
          speed: 400
        }
      })

      this.slider.on('scrollEnd', () => {
        const index = this.slider.getCurrentPage().pageX
        this.currentPageIndex = index
        if (this.autoPlay) {
          this._play()
        }
      })

      this.slider.on('beforeScrollStart', () => {
        if (this.autoPlay) {
          clearTimeout(this.timer)
        }
      })

      this.slider.on('touchend', () => {
        if (this.autoPlay) {
          this._play()
        }
      })
    },
    _play() {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.slider.next()
      }, this.interval)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable.styl';

.slider {
  min-height: 1px;

  .slider-group {
    position: relative;
    overflow: hidden;
    white-space: normap;

    .slider-item {
      float: left;
      box-sizing: border-box;
      overflow: hidden;
      text-align: center;

      a {
        display: block;
        width: 100%;
        overflow: hidden;
        text-decoration: none;
      }

      img {
        display: block;
        width: 100%;
      }
    }
  }

  .dots {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 12px;
    text-align: center;

    .dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      margin: 0 4px;
      border-radius: 50%;
      background-color: $color-text-l;

      &.active {
        width: 20px;
        border-radius: 5px;
        background-color: $color-text-ll;
      }
    }
  }
}
</style>
