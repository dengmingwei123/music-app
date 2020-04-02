<template>
  <scroll
    class='suggest'
    ref='suggest'
    :data='songs'
    :pullUp='pullUp'
    :click='click'
    :beforeScroll='beforeScroll'
    @beforeScroll='listScroll'
    @scrollToEnd='searchMore'
  >
    <ul class='suggest-list'>
      <li
        class='suggest-item'
        v-for='song in songs'
        :key='song.id'
        @click='selectItem(song)'
      >
        <div class="icon">
          <i :class='iconCls(song)'></i>
        </div>
        <div class="name">
          <p
            class='text'
            v-html='searchText(song)'
          ></p>
        </div>
      </li>
      <loading v-show='hasMore'></loading>
    </ul>

    <div
      class="no-result-wrapper"
      v-show='!hasMore && isShowNoResult'
    >
      <no-result :title='title'></no-result>
    </div>
  </scroll>
</template>

<script>
import { getSearchResult } from 'api/search'
import { ERR_OK } from 'api/config'
import { createSingerSong, isValidMusic, processSongsUrl } from 'common/js/song'
import Scroll from 'base/scroll/Scroll.vue'
import Loading from 'base/loading/Loading.vue'
import Singer from 'common/js/singer'
import NoResult from 'base/no-result/No-Result.vue'
import { mapMutations, mapActions } from 'vuex'

export default {
  data() {
    return {
      page: 1,
      perpage: 20,
      songs: [],
      hasMore: false,
      title: '抱歉,暂无搜索结果',
      isShowNoResult: false
    }
  },
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  created() {
    this.pullUp = true
    this.click = true
    this.beforeScroll = true
  },
  methods: {
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions([
      'insertSong'
    ]),
    async _getSearchResult(query = '') {
      this.$refs.suggest.scrollTo(0, 0, 0)
      this.hasMore = true
      this.page = 1
      try {
        const res = await getSearchResult({ query, page: this.page, perpage: this.perpage, zhida: this.showSinger })
        const { code, data, message } = res
        if (message.length > 0) {
          this.hasMore = false
          this.isShowNoResult = true
        }
        if (code === ERR_OK) {
          this.songs = await this._genResult(data)
        }
      } catch {
        this.hasMore = false
        this.isShowNoResult = true
      }
    },
    // 重置数据
    async _genResult(data) {
      let result = []
      if (data.zhida && data.zhida.type === 2) {
        result.push(data.zhida)
      }
      const songs = await processSongsUrl(this._normalizeSong(data.song.list))
      result = result.concat(songs)
      if (result.length > 0) {
        this.isShowNoResult = false
      }
      if (result.length <= 0) {
        this.hasMore = false
      }
      return result
    },
    // 正常化数据
    _normalizeSong(list) {
      const result = []
      list.forEach(v => {
        if (isValidMusic(v)) {
          result.push(createSingerSong(v))
        }
      })
      return result
    },
    iconCls(item) {
      if (item.type) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    searchText(item) {
      if (item.type) {
        return item.singername
      } else {
        return `${item.name}-${item.singer}`
      }
    },
    // 加载更多数据
    async searchMore() {
      if (!this.hasMore) {
        return
      }
      this.page++
      try {
        const res = await getSearchResult({ query: this.query, page: this.page, perpage: this.perpage, zhida: this.showSinger })
        const { code, data, data: { song: { list } } } = res
        if (code === ERR_OK) {
          const songs = await processSongsUrl(this._normalizeSong(list))
          this.songs = this.songs.concat(songs)
          this._checkMore(data)
        }
      } catch {
        this.hasMore = false
      }
    },
    // 检查是否还有数据
    _checkMore(data) {
      const { song } = data
      if (song.list.length === 0 || song.curnum * song.curpage >= song.totalnum) {
        this.hasMore = false
      }
    },
    // 选中的项
    selectItem(item) {
      // 判断当前点击的是不是歌手
      if (item.type) {
        const singer = new Singer({
          id: item.singermid,
          name: item.singername
        })
        this.$router.push({
          path: `/search/${singer.id}`
        })
        this.setSinger(singer)
      } else {
        this.insertSong({ song: item })
      }
      this.$emit('select', item)
    },
    // 重置滚动组件
    refresh() {
      this.$refs.suggest && this.$refs.suggest.refresh()
    },
    // 列表滚动了
    listScroll() {
      this.$emit('listScroll')
    }
  },
  watch: {
    query(newQuery) {
      this._getSearchResult(newQuery, 1)
    }
  },
  components: {
    Scroll,
    Loading,
    NoResult
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable.styl';
@import '~common/stylus/mixin.styl';

.suggest {
  height: 100%;
  overflow: hidden;

  .suggest-list {
    padding: 0 30px;

    .suggest-item {
      display: flex;
      align-items: center;
      line-height: 36px;

      .icon {
        flex: 0 0 30px;

        .icon-music {
          font-size: $font-size-medium;
          color: $color-text-d;
        }

        .icon-mine {
          font-size: $font-size-medium;
          color: $color-text-d;
        }
      }

      .name {
        flex: 1;

        .text {
          font-size: $font-size-medium;
          color: $color-text-d;
          no-wrap();
        }
      }
    }
  }

  .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translate3d(0, -50%, 0);
  }
}
</style>
