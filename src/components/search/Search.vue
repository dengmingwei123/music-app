<template>
  <div class='search'>
    <div class="search-box-wrapper">
      <search-box></search-box>
    </div>
  </div>
</template>

<script>
import SearchBox from 'base/search-box/Search-Box.vue'
export default {
  components: {
    SearchBox
  }
}
</script>

<style lang="stylus" scoped>
.search {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;

  .search-box-wrapper {
    margin: 20px;
  }
}
</style>
