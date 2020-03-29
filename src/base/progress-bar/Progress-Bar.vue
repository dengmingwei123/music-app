<template>
  <div
    class='progress-bar'
    ref="progressBar"
    @click='progressClick'
  >
    <div class="bar-inner">
      <div
        class="progress"
        ref='progress'
      ></div>
      <div
        class="progress-btn-wrapper"
        ref='progressBtn'
        @touchstart.prevent='progressBtnTouchStart'
        @touchmove.prevent='progressBtnTouchMove'
        @touchend.prevent='progressBtnTouchEnd'
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { prefixStyle } from 'common/js/dom'
// 小球的宽度
const progressBtnWidth = 16
const transform = prefixStyle('transform')

export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  created() {
    this.touch = {}
  },
  methods: {
    progressBtnTouchStart(e) {
      // 点击后保存一个值开始点击
      this.touch.initiated = true
      // 保存开始点击的X轴位置
      this.touch.startX = e.touches[0].pageX
      // 保存当前进度的宽度
      this.touch.startWidth = this.$refs.progress.clientWidth
    },
    progressBtnTouchMove(e) {
      // 获取移动时的X轴位置
      this.touch.moveX = e.touches[0].pageX

      // 获取差值
      const diff = this.touch.moveX - this.touch.startX
      const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.startWidth + diff))
      this._offset(offsetWidth)
    },
    progressBtnTouchEnd() {
      this._triggerPercent()
      this.touch.initiated = false
    },
    _triggerPercent() {
      // 进度条总宽
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      // 结束后的进度位置
      const progressWidth = this.$refs.progress.clientWidth
      // 获取百分比
      const percent = progressWidth / barWidth
      // 将获取的百分比传递给父组件
      this.$emit('percentchange', percent)
    },
    // 点击改变进度
    progressClick(e) {
      this._offset(e.offsetX)
      this._triggerPercent()
    },
    // 封装方法
    _offset(offsetWidth) {
      // 设置进度条
      this.$refs.progress.style.width = `${offsetWidth}px`
      // 设置小球的位置
      this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
    }
  },
  watch: {
    // 计算当前进度
    percent(newPercent) {
      if (newPercent >= 0 && !this.touch.initiated) {
        // 进度条的总宽度
        const progressBarWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        // 设置进度
        const offsetWidth = newPercent * progressBarWidth
        this._offset(offsetWidth)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable.styl';

.progress-bar {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;

  .bar-inner {
    position: relative;
    flex: 1;
    height: 4px;
    background-color: $color-background-d;

    .progress {
      position: absolute;
      height: 100%;
      background-color: $color-theme;
    }

    .progress-btn-wrapper {
      position: absolute;
      top: -13px;
      left: -8px;
      width: 30px;
      height: 30px;

      .progress-btn {
        position: absolute;
        top: 7px;
        left: 7px;
        width: 16px;
        height: 16px;
        box-sizing: border-box;
        border-radius: 50%;
        border: 3px solid $color-text;
        background-color: $color-theme;
      }
    }
  }
}
</style>
