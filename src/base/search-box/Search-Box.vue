<template>
  <div class='search-box'>
    <div class='icon'>
      <i class='icon-search'></i>
    </div>
    <div class='text-box'>
      <input
        class='text'
        ref='query'
        v-model='query'
        :placeholder='placeholder'
      >
    </div>
    <div
      class='icon'
      v-show='query'
      @click='clear'
    >
      <i class='icon-dismiss'></i>
    </div>
  </div>
</template>

<script>
import { debounce } from 'common/js/util'

export default {
  props: {
    placeholder: {
      type: String,
      default: '搜索歌曲、歌手'
    }
  },
  data() {
    return {
      query: ''
    }
  },
  methods: {
    clear() {
      this.query = ''
    },
    // 设置搜索框的内容
    setQuery(query) {
      this.query = query
    },
    // 让input框失去焦点
    inputBlur() {
      this.$refs.query.blur()
    }
  },
  created() {
    this.$watch('query', debounce((newQuery) => {
      this.$emit('query', newQuery)
    }, 300))
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable.styl';
@import '~common/stylus/mixin.styl';

.search-box {
  display: flex;
  align-items: center;
  width: 100%;
  height: 40px;
  padding: 0 6px;
  border-radius: 8px;
  box-sizing: border-box;
  background-color: $color-highlight-background;

  .icon {
    flex: 0 0 24px;
    color: $color-background;
    text-align: center;

    .icon-search {
      font-size: 24px;
    }

    .icon-dismiss {
      font-size: $font-size-medium-x;
    }
  }

  .text-box {
    flex: 1;
    margin: 0 5px;

    .text {
      width: 100%;
      height: 100%;
      outline: 0;
      color: $color-text;
      font-size: $font-size-medium;
      background-color: $color-highlight-background;
      no-wrap();
    }
  }
}
</style>
