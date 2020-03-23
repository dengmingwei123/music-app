<template>
  <transition
    appear
    name='slider'
  >
    <music-list></music-list>
  </transition>
</template>

<script>
import MusicList from 'components/music-list/Music-List.vue'
export default {
  components: {
    MusicList
  }
}
</script>

<style lang="stylus" scoped>
.slider-enter-active, .slider-leave-active {
  transition: all 0.3s;
}

.slider-enter, .slider-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>
