<template>
  <div
    class='search'
    ref="search"
  >
    <div class="search-box-wrapper">
      <search-box
        ref='searchBox'
        @query='getQuery'
      ></search-box>
    </div>

    <div
      class="shortcut-wrapper"
      ref='shortcutWrapper'
      v-show='!query'
    >
      <scroll
        class="shortcut"
        ref='shortcut'
        :data='searchHistory'
        :refreshDelay='refreshDelay'
        :click='click'
      >
        <div>
          <div class="hot-key">
            <h2 class='title'>热门搜索</h2>
            <div class='content'>
              <p
                class='key-item'
                v-for='item in hotKeyList'
                v-html='item.query'
                :key='item.hotkey_id'
                @click='addQuery(item.query)'
              ></p>
            </div>
          </div>
          <div
            class="search-history"
            v-show='searchHistory.length>0'
          >
            <div class="title">
              <p class='text'>搜索历史</p>
              <div
                class='clear'
                @click='clearHistory'
              >
                <i class='icon-clear'></i>
              </div>
            </div>
            <search-list
              @selectHistory='selectHistory'
              @deleteOne='deleteOne'
              :searchHistory='searchHistory'
            ></search-list>
          </div>
        </div>
      </scroll>
    </div>

    <div
      class="search-result"
      v-show='query'
      ref='searchResult'
    >
      <suggest
        :query='query'
        @listScroll='inputBlur'
        @select='saveSearch'
        ref='suggest'
      ></suggest>
    </div>

    <confirm
      :text='text'
      @confirm='confirm'
      ref='confirm'
    ></confirm>

    <router-view></router-view>
  </div>
</template>

<script>
import SearchBox from 'base/search-box/Search-Box.vue'
import Suggest from 'base/suggest/Suggest.vue'
import SearchList from 'base/search-list/Search-List.vue'
import Scroll from 'base/scroll/Scroll.vue'
import Confirm from 'base/confirm/Confirm.vue'
import { getHotKeyList } from 'api/search'
import { ERR_OK } from 'api/config'
import { playlistMixin, searchMixin } from 'common/js/mixin'

export default {
  mixins: [playlistMixin, searchMixin],
  data() {
    return {
      hotKeyList: []
    }
  },
  computed: {
  },
  created() {
    this.click = true
    this.text = '是否清空所有搜索历史'
    this._getHotKeyList()
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.searchResult.style.bottom = bottom
      this.$refs.shortcutWrapper.style.bottom = bottom
      this.$refs.shortcut.refresh()
      this.$refs.suggest.refresh()
    },
    async _getHotKeyList() {
      const res = await getHotKeyList()
      const { code, data } = res
      if (code === ERR_OK) {
        this.hotKeyList = data.slice(0, 16)
      }
    },
    // 将热门的key输入到搜索框中
    addQuery(query) {
      this.$refs.searchBox.setQuery(query)
    },
    // 清空搜索历史纪录
    clearHistory() {
      this.$refs.confirm.show()
    },
    // 确定清空
    confirm() {
      this.clearSearchHistory()
    },
    // 保存当前搜索框中的值
    saveSearch(item) {
      this.saveSearchHistory({ query: this.query })
    }
  },
  watch: {
    query(newQuery) {
      if (!newQuery) {
        setTimeout(() => {
          this.$refs.shortcut.refresh()
        }, 20)
      }
    }
  },
  components: {
    SearchBox,
    Suggest,
    Scroll,
    SearchList,
    Confirm
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable.styl';
@import '~common/stylus/mixin.styl';

.search {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;

  .search-box-wrapper {
    margin: 20px;
  }

  .shortcut-wrapper {
    position: fixed;
    width: 100%;
    top: 178px;
    bottom: 0;

    .shortcut {
      height: 100%;
      overflow: hidden;

      .hot-key {
        margin: 0 20px 20px 20px;

        .title {
          margin-bottom: 20px;
          color: $color-text-l;
          font-size: $font-size-medium;
        }

        .content {
          .key-item {
            display: inline-block;
            padding: 5px 10px;
            margin: 0 20px 10px 0;
            border-radius: 5px;
            background-color: $color-highlight-background;
            font-size: $font-size-medium;
            color: $color-text-d;
          }
        }
      }

      .search-history {
        margin: 0 20px;

        .title {
          display: flex;
          height: 40px;
          align-items: center;
          font-size: $font-size-medium;

          .text {
            flex: 1;
            text-align: left;
            color: $color-text-l;
          }

          .clear {
            flex: 0 0 34px;
            width: 34px;
            text-align: right;
            color: $color-text-d;
          }
        }
      }
    }
  }

  .search-result {
    position: fixed;
    width: 100%;
    top: 178px;
    bottom: 0;
  }
}
</style>
