<template>
  <div ref='scrollWrapper'>
    <slot></slot>
  </div>
</template>

<script>
import BetterScroll from 'better-scroll'
export default {
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: null
    }
  },
  mounted() {
    setTimeout(() => {
      this._initScroll()
    }, 20)
  },
  methods: {
    // 初始化
    _initScroll() {
      if (!this.$refs.scrollWrapper) {
        return false
      }
      this.scroll = new BetterScroll(this.$refs.scrollWrapper, {
        probeType: this.probeType,
        click: this.click
      })
    },
    enable() {
      this.scroll && this.scroll.enable()
    },
    disable() {
      this.scroll && this.scroll.disable()
    },
    refresh() {
      this.scroll && this.scroll.refresh()
    }
  },
  watch: {
    // 监听data的变化
    data() {
      // 变化了,重新刷新scroll
      this.refresh()
    }
  }
}
</script>

<style lang="stylus" scoped></style>
