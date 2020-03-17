<template>
  <div class='recommend'>
    <div class="recommend-content">
      <div class="slider-wrapper"></div>
      <div class="recommend-list">
        <h1 class='list-title'>热门歌单推荐</h1>
        <ul></ul>
      </div>
    </div>
  </div>
</template>

<script>
import { getRecommend } from 'api/recommend.js'
export default {
  data() {
    return {}
  },
  created() {
    getRecommend().then(res => {
      console.log(res)
    })
  }
}
</script>

<style lang="stylus">
@import '~common/stylus/variable.styl';

.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;

  .recommend-content {
    .recommend-list {
      text-align: center;
      height: 65px;

      .list-title {
        line-height: 65px;
        color: $color-theme;
        font-size: $font-size-medium;
      }
    }
  }
}
</style>
