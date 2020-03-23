<template>
  <scroll
    @scroll='scroll'
    class='list-view'
    ref='listView'
    :data='data'
    :probeType='probeType'
    :listenScroll='listenScroll'
    :click='click'
  >
    <div>
      <div
        class='list-group'
        ref='listGroup'
        v-for="(item,index) in data"
        :key='index'
      >
        <h1 class='list-title'>{{ item.title }}</h1>
        <ul class='list-wrapper'>
          <li
            class='list-item'
            v-for="list in item.items"
            :key='list.id'
            @click='selectItem(list)'
          >
            <img
              class='singer-img'
              v-lazy="list.imgUrl"
              width='50'
              height='50'
            >
            <p class='singer-text'>{{ list.name }}</p>
          </li>
        </ul>
      </div>
    </div>
    <div class='list-shortcut'>
      <ul>
        <li
          v-for='(item,index) in shortcut'
          :key='index'
          class='shortcut'
          :class='{current:currentIndex===index}'
          :data-index='index'
          @touchstart='onShortcutStart'
          @touchmove.stop.prevent='onShortcutMove'
        >{{ item }}</li>
      </ul>
    </div>
    <div
      class="list-fixed"
      ref='fixed'
      v-show='fixedTitle'
    >
      <div class="fixed-title">{{ fixedTitle }}</div>
    </div>
  </scroll>
</template>

<script>
import Scroll from 'base/scroll/Scroll.vue'
import { getData } from 'common/js/dom'

const ANSHOR_HEIGHT = 18
const TITLE_HEIGHT = 30
export default {
  props: {
    data: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      currentIndex: 0,
      scrollY: -1,
      diff: -1
    }
  },
  computed: {
    shortcut() {
      return this.data.map(v => {
        return v.title.substr(0, 1)
      })
    },
    fixedTitle() {
      if (this.scrollY > 0) {
        return ''
      }
      const result = this.data.find((value, index) => {
        return this.currentIndex === index
      })

      if (result) {
        return result.title
      } else {
        return ''
      }
    }
  },
  created() {
    this.probeType = 3
    this.listenScroll = true
    this.click = true
    this.touchs = {}
    this.listHeight = []
  },
  methods: {
    selectItem(item) {
      this.$emit('select', item)
    },
    // 实时获取滚动距离
    scroll(pos) {
      this.scrollY = pos.y
    },
    // 计算每个列表的高
    _calculateHeight() {
      const listGroup = this.$refs.listGroup
      // 第一个列表距离顶部的距离
      let height = 0
      // 保存每个列表距离顶部的距离
      this.listHeight.push(height)
      for (let i = 0; i < listGroup.length; i++) {
        height += listGroup[i].clientHeight + 1
        this.listHeight.push(height)
      }
    },
    onShortcutStart(e) {
      // 获取当前点击的元素中保存的索引值
      const anchorIndex = getData(e.target, 'index')
      // 保存第一次点击的位置
      const firstTouch = e.touches[0]
      this.touchs.y1 = firstTouch.pageY
      // 将第一次点击的索引值保存
      this.touchs.anchorIndex = anchorIndex
      this._scrollTo(anchorIndex)
    },
    onShortcutMove(e) {
      // 获取移动时的位置
      const firstTouch = e.touches[0]
      this.touchs.y2 = firstTouch.pageY
      // 获取差值
      const delta = (this.touchs.y2 - this.touchs.y1) / ANSHOR_HEIGHT | 0
      const anshorIndex = parseInt(this.touchs.anchorIndex) + delta
      this._scrollTo(anshorIndex)
    },
    _scrollTo(index) {
      if (!index && index !== 0) {
        return
      }
      if (index <= 0) {
        index = 0
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }
      this.$refs.listView.scrollToElement(this.$refs.listGroup[index], 0)
    }
  },
  watch: {
    data(newVal) {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    scrollY(newVal) {
      // 滚动到最顶部或者是超越顶部
      if (newVal >= 0) {
        this.currentIndex = 0
      } else {
        // 根据滚动的距离获取index
        const index = this.listHeight.findIndex(v => {
          return v >= -newVal
        })
        this.currentIndex = index - 1
      }

      this.diff = this.listHeight[this.currentIndex + 1] - -newVal
    },
    diff(newVal) {
      const fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
    }
  },
  components: {
    Scroll
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable.styl';

.list-view {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: $color-background;

  .list-group {
    padding-bottom: 30px;

    .list-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      background-color: $color-highlight-background;
      font-size: $font-size-small;
      color: $color-text-l;
    }

    .list-wrapper {
      .list-item {
        display: flex;
        align-items: center;
        padding: 20px 0 0 30px;

        .singer-img {
          border-radius: 50%;
        }

        .singer-text {
          flex: 1;
          padding-left: 20px;
          color: $color-text-l;
          font-size: $font-size-medium;
        }
      }
    }
  }

  .list-shortcut {
    position: absolute;
    z-index: 30;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    padding: 20px 0;
    border-radius: 10px;
    text-align: center;
    font-family: Helvetica;
    background-color: $color-background-d;

    .shortcut {
      padding: 3px;
      line-height: 1;
      color: $color-text-l;
      font-size: $font-size-small;

      &.current {
        color: $color-theme;
      }
    }
  }

  .list-fixed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;

    .fixed-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      background-color: $color-highlight-background;
      color: $color-text-l;
      font-size: $font-size-small;
    }
  }
}
</style>
