<template>
  <div
    class="search-list"
    v-show='searchHistory.length'
  >
    <transition-group
      name='list'
      tag='div'
    >
      <div
        class='search-item'
        :key='history'
        @click='selectItem(history)'
        v-for='history in searchHistory'
      >
        <div class='text'>{{ history }}</div>
        <div
          class="delete"
          @click.stop='deleteOne(history)'
        >
          <i class='icon-delete'></i>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
export default {
  props: {
    searchHistory: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    selectItem(item) {
      this.$emit('selectHistory', item)
    },
    deleteOne(item) {
      this.$emit('deleteOne', item)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable.styl';
@import '~common/stylus/mixin.styl';

.search-list {
  .search-item {
    display: flex;
    align-items: center;
    height: 40px;
    overflow: hidden;

    &.list-enter-active, &.list-leave-active {
      transition: all 0.1s;
    }

    &.list-enter, &.list-leave-to {
      height: 0;
    }

    .text {
      flex: 1;
      color: $color-text-l;
    }

    .delete {
      flex: 0 0 34px;
      width: 34px;
      text-align: right;

      .icon-delete {
        color: $color-text-d;
        font-size: $font-size-small;
      }
    }
  }
}
</style>
