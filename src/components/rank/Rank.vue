<template>
  <div
    class='rank'
    ref='rank'
  >
    <scroll
      class="rank-wrapper"
      ref='rankWrapper'
      :data='rankList'
      :probeType='probeType'
      :listenScroll='listenScroll'
      :click='click'
      @scroll='scroll'
    >
      <div>
        <div
          class='list-group'
          ref='listGroup'
          v-for='item in rankList'
          :key='item.groupId'
        >
          <h1
            class='item-title'
            v-html='item.groupName'
          ></h1>
          <ul>
            <li
              class='item'
              v-for='list in item.toplist'
              :key='list.topId'
              @click='selectItem(list)'
            >
              <div class='icon'>
                <img :src="list.frontPicUrl">
              </div>
              <div class='desc'>
                <p
                  class='text'
                  v-for='(song,index) in list.song'
                  :key='index'
                >
                  <span>{{ song.rank }}.</span>
                  <span>{{ songTitle(song) }}</span>
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div
        class="list-fixed"
        ref='fixed'
        v-show='fixedTitle'
      >
        <div class="fixed-title">{{ fixedTitle }}</div>
      </div>

      <div
        class="loading"
        v-show='!rankList.length>0'
      >
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import { getRankList } from 'api/rank'
import { ERR_OK } from 'api/config'
import Scroll from 'base/scroll/Scroll.vue'
import { prefixStyle } from 'common/js/dom'
import { mapMutations } from 'vuex'
import { playlistMixin } from 'common/js/mixin'
import Loading from 'base/loading/Loading.vue'

const TITLE_HEIGHT = 30
const transform = prefixStyle('transform')
export default {
  mixins: [playlistMixin],
  data() {
    return {
      rankList: [],
      scrollY: -1,
      currentIndex: 0,
      diff: -1
    }
  },
  computed: {
    fixedTitle() {
      if (this.scrollY >= 0) {
        return ''
      }
      const result = this.rankList.find((value, index) => {
        return this.currentIndex === index
      })

      if (result) {
        return result.groupName
      } else {
        return ''
      }
    }
  },
  created() {
    this.probeType = 3
    this.listenScroll = true
    this.listHeight = []
    this.click = true
    this._getRankList()
  },
  methods: {
    handlePlaylist(playlist) {
      console.log(playlist)
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.rank.style.bottom = bottom
      this.$refs.rankWrapper.refresh()
    },
    ...mapMutations({
      setTopList: 'SET_TOP_LIST'
    }),
    async _getRankList() {
      const res = await getRankList()
      const { code, data } = res
      if (code === ERR_OK) {
        this.rankList = data
      }
    },
    songTitle(song) {
      return `${song.title}-${song.singerName}`
    },
    scroll(pos) {
      this.scrollY = pos.y
    },
    // 计算每个列表的高
    _calculateHeight() {
      const listGroup = this.$refs.listGroup
      let height = 0
      // 保存每个列表距离顶部的距离
      this.listHeight.push(height)
      for (let i = 0; i < listGroup.length; i++) {
        height += listGroup[i].clientHeight + 1
        this.listHeight.push(height)
      }
    },
    selectItem(list) {
      this.$router.push({
        path: `/rank/${list.topId}`
      })
      this.setTopList(list)
    }
  },
  watch: {
    rankList() {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    scrollY(newVal) {
      if (newVal > 0) {
        this.currentIndex = 0
      } else {
        const index = this.listHeight.findIndex(v => {
          return v > -newVal
        })
        this.currentIndex = index - 1
      }
      this.diff = this.listHeight[this.currentIndex + 1] - -newVal
    },
    diff(newVal) {
      const offset = newVal > 0 && newVal < TITLE_HEIGHT ? newVal - TITLE_HEIGHT : 0
      if (this.offset === offset) {
        return
      }
      this.offset = offset
      this.$refs.fixed.style[transform] = `translate3d(0,${offset}px,0)`
    }
  },
  components: {
    Scroll,
    Loading
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable.styl';
@import '~common/stylus/mixin.styl';

.rank {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;

  .rank-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;

    .list-group {
      padding-bottom: 30px;

      .item-title {
        height: 30px;
        line-height: 30px;
        padding: 0 20px;
        font-size: $font-size-small;
        color: $color-text-l;
        background-color: $color-highlight-background;
        no-wrap();
      }

      .item {
        display: flex;
        overflow: hidden;
        margin: 20px 20px 0 20px;
        height: 100px;
        border-radius: 10px;

        .icon {
          flex: 0 0 100px;
          width: 100px;
          height: 100px;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .desc {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 20px;
          height: 100%;
          overflow: hidden;
          font-size: $font-size-small;
          background-color: $color-highlight-background;

          .text {
            line-height: 26px;
            color: $color-text-d;
            no-wrap();
          }
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

    .loading {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translate3d(0, -50%, 0);
    }
  }
}
</style>
