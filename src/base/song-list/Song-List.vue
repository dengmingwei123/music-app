<template>
  <div class='song-list'>
    <ul class='list-box'>
      <li
        v-for='(song,index) in songs'
        :key='song.id'
        class='list-item'
        @click='selectSong(song,index)'
      >
        <div class="item-content">
          <p
            v-html='song.name'
            class='item-name'
          ></p>
          <p class='item-desc'>{{ getDesc(song) }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    songs: {
      type: Array,
      default: null
    }
  },
  methods: {
    getDesc(song) {
      return `${song.singer}-${song.album}`
    },
    selectSong(song, index) {
      this.$emit('select', song, index)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable.styl';

.song-list {
  .list-box {
    .list-item {
      display: flex;
      align-items: center;
      height: 64px;
      font-size: $font-size-medium;

      .item-content {
        flex: 1;
        line-height: 20px;
        overflow: hidden;

        .item-name {
          no-wrap();
          color: $color-text;
        }

        .item-desc {
          margin-top: 4px;
          no-wrap();
          color: $color-text-d;
        }
      }
    }
  }
}
</style>
