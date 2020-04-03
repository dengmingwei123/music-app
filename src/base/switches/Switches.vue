<template>
  <div class='switches'>
    <div
      class="switch-item"
      v-for="(item,index) in switches"
      :key='index'
      :class='{active:currentIndex === index}'
      @click='activeSwitch(index)'
    >
      <span>{{ item }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    switches: {
      type: Array,
      default() {
        return []
      }
    },
    currentIndex: {
      type: Number,
      default: 0
    }
  },
  methods: {
    activeSwitch(index) {
      this.$emit('activeSwitch', index)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable.styl';

.switches {
  display: flex;
  align-items: center;
  width: 240px;
  margin: 0 auto;
  border: 1px solid $color-highlight-background;
  border-radius: 5px;

  .switch-item {
    flex: 1;
    text-align: center;
    padding: 8px;
    font-size: $font-size-medium;
    color: $color-text-d;

    &.active {
      color: $color-text;
      background-color: $color-highlight-background;
    }
  }
}
</style>
