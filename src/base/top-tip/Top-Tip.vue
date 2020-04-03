<template>
  <transition name='drop'>
    <div
      class='top-tip'
      v-show='showFlag'
    >
      <div class="tip-title">
        <i class='icon-ok'></i>
        <span class='text'>{{ tipText }}</span>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      showFlag: false
    }
  },
  props: {
    tipText: {
      type: String,
      default: '1首歌曲已经添加到播放列表'
    },
    delay: {
      type: Number,
      default: 2000
    }
  },
  methods: {
    show() {
      this.showFlag = true
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.hide()
      }, this.delay)
    },
    hide() {
      this.showFlag = false
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable.styl';

.top-tip {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 500;
  background-color: $color-dialog-background;

  &.drop-enter-active, &.drop-leave-active {
    transition: all 0.3s;
  }

  &.drop-enter, &.drop-leave-to {
    transform: translate3d(0, -100%, 0);
  }

  .tip-title {
    text-align: center;
    padding: 18px 0;
    font-size: 0;

    .icon-ok {
      font-size: $font-size-medium;
      color: $color-theme;
      margin-right: 4px;
    }

    .text {
      font-size: $font-size-medium;
      color: $color-text;
    }
  }
}
</style>
