<template>
  <div class='tab'>
    <router-link
      class='tab-item'
      tag='div'
      to='/recommend'
    >
      <span class='tab-text'>推荐</span>
    </router-link>
    <router-link
      class='tab-item'
      tag='div'
      to='/singer'
    >
      <span class='tab-text'>歌手</span>
    </router-link>
    <router-link
      class='tab-item'
      tag='div'
      to='/rank'
    >
      <span class='tab-text'>排行</span>
    </router-link>
    <router-link
      class='tab-item'
      tag='div'
      to='/search'
    >
      <span class='tab-text'>搜索</span>
    </router-link>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable.styl';

.tab {
  display: flex;
  width: 100%;
  height: 44px;
  font-size: 0;

  .tab-item {
    flex: 1;
    line-height: 44px;
    text-align: center;

    .tab-text {
      padding-bottom: 5px;
      font-size: $font-size-medium;
      color: $color-text-l;
    }

    &.router-link-active {
      .tab-text {
        border-bottom: 2px solid $color-theme;
        color: $color-theme;
      }
    }
  }
}
</style>
