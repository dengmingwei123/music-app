<template>
  <transition name='list-add'>
    <div
      class='add-song'
      v-show='showFlag'
      @click.stop
    >
      <div class="header">
        <div class="title">添加歌曲到列表</div>
        <div
          class="close"
          @click='hide'
        >
          <i class='icon-close'></i>
        </div>
      </div>

      <div class="search-box-wrapper">
        <search-box
          ref='searchBox'
          placeholder='搜索歌曲'
          @query='getQuery'
        ></search-box>
      </div>

      <div
        class="shortcut"
        v-show='!query'
      >
        <switches
          :switches='switches'
          :currentIndex='switchIndex'
          @activeSwitch='activeSwitch'
        ></switches>
        <div class="list-wrapper">
          <scroll
            class="list-scroll"
            ref='playHistory'
            v-if='switchIndex === 0'
            :click='click'
            :data='playHistory'
            :key='0'
          >
            <div class="list-inner">
              <song-list
                :songs='playHistory'
                @select='selectSong'
              ></song-list>
            </div>
          </scroll>

          <scroll
            class="list-scroll"
            ref='searchHistory'
            v-if='switchIndex === 1'
            :click='click'
            :data='searchHistory'
            :key='1'
          >
            <div class="list-inner">
              <search-list
                @selectHistory='selectHistory'
                @deleteOne='deleteOne'
                :searchHistory='searchHistory'
              ></search-list>
            </div>
          </scroll>
        </div>
      </div>

      <div
        class="search-result"
        v-show='query'
      >
        <suggest
          :showSinger='false'
          :query='query'
          @listScroll='inputBlur'
          @select='saveSearch'
        ></suggest>
      </div>

      <top-tip ref='topTip'></top-tip>
    </div>
  </transition>
</template>

<script>
import SearchBox from 'base/search-box/Search-Box.vue'
import Suggest from 'base/suggest/Suggest.vue'
import Switches from 'base/switches/Switches.vue'
import SearchList from 'base/search-list/Search-List.vue'
import Scroll from 'base/scroll/Scroll.vue'
import SongList from 'base/song-list/Song-List.vue'
import TopTip from 'base/top-tip/Top-Tip.vue'
import { mapGetters, mapActions } from 'vuex'
import { searchMixin } from 'common/js/mixin'

export default {
  mixins: [searchMixin],
  data() {
    return {
      showFlag: false,
      switches: ['最近播放', '搜索历史'],
      switchIndex: 0
    }
  },
  computed: {
    ...mapGetters([
      'playHistory'
    ])
  },
  created() {
    this.click = true
  },
  methods: {
    ...mapActions([
      'insertSong',
      'changePlayHistory'
    ]),
    hide() {
      this.showFlag = false
    },
    show() {
      this.showFlag = true
    },
    refreshList() {
      setTimeout(() => {
        if (this.switchIndex === 0) {
          this.$refs.playHistory.refresh()
        } else {
          this.$refs.searchHistory.refresh()
        }
      }, 20)
    },
    // 选中的分类
    activeSwitch(index) {
      this.switchIndex = index
    },
    // 需要添加音乐
    selectSong(song, index) {
      if (index !== 0) {
        this.insertSong({ song })
        this.showTopTip()
      }
    },
    // 保存当前搜索框中的值
    saveSearch(item) {
      this.saveSearchHistory({ query: this.query })
      this.showTopTip()
    },
    showTopTip() {
      this.$refs.topTip.show()
    }
  },
  watch: {
    query(newQuery) {
      if (!newQuery) {
        this.refreshList()
      }
    }
  },
  components: {
    SearchBox,
    Suggest,
    Switches,
    SearchList,
    Scroll,
    SongList,
    TopTip
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable.styl';

.add-song {
  position: fixed;
  width: 100%;
  top: 0;
  bottom: 0;
  z-index: 200;
  background-color: $color-background;

  &.list-add-enter-active, &.list-add-leave-active {
    transition: all 0.3s;
  }

  &.list-add-enter, &.list-add-leave-to {
    transform: translate3d(100%, 0, 0);
  }

  .header {
    height: 44px;
    line-height: 44px;
    text-align: center;
    font-size: $font-size-large;
    color: $color-text;

    .close {
      position: absolute;
      right: 8px;
      top: 0;

      .icon-close {
        display: block;
        padding: 12px;
        font-size: 20px;
        color: $color-theme;
      }
    }
  }

  .search-box-wrapper {
    margin: 20px;
  }

  .shortcut {
    .list-wrapper {
      position: fixed;
      top: 165px;
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
  }

  .search-result {
    position: fixed;
    width: 100%;
    top: 124px;
    bottom: 0;
  }
}
</style>
