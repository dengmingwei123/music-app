<template>
  <div
    ref='categories'
    class='categories'
  >
    <div
      class="categories-group"
      ref='categoriesGroup'
    >
      <slot></slot>
    </div>
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
      this._initCategories()
    }, 20)
  },
  methods: {
    // 初始化
    _initCategories() {
      if (!this.$refs.singerCategories) {
        return false
      }
      this.scroll = new BetterScroll(this.$refs.singerCategories, {
        scrollX: true,
        scrollY: false,
        probeType: this.probeType,
        click: this.click
      })
    },
    refresh() {
      this.scroll && this.scroll.refresh()
    }
  },
  watch: {
    data() {
      this.refresh()
    }
  }
}
</script>

<style lang="stylus" scoped>
.categories {
  min-height: 1px;

  .categories-group {
    position: relative;
    overflow: hidden;
    white-space: normap;

    .categories-item {
      float: left;
      box-sizing: border-box;
      overflow: hidden;
      text-align: center;
    }
  }
}
</style>
