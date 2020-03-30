<template>
  <div class='song-list'>
    <ul class='list-box'>
      <li
        v-for='(song,index) in songs'
        :key='song.id'
        class='list-item'
        @click='selectSong(song,index)'
      >
        <div
          class="rank"
          v-if='rank'
        >
          <p :class='rankCls(index)'>{{ index+1 }}</p>
        </div>
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
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getDesc(song) {
      return `${song.singer}-${song.album}`
    },
    selectSong(song, index) {
      this.$emit('select', song, index)
    },
    rankCls(index) {
      if (this.rank) {
        if (index === 0) {
          return 'icon icon0'
        } else if (index === 1) {
          return 'icon icon1'
        } else if (index === 2) {
          return 'icon icon2'
        } else {
          return 'text'
        }
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable.styl';
@import '~common/stylus/mixin.styl';

.song-list {
  .list-box {
    .list-item {
      display: flex;
      align-items: center;
      height: 64px;
      font-size: $font-size-medium;

      .rank {
        flex: 0 0 25px;
        width: 25px;
        margin-right: 30px;
        text-align: center;

        .icon {
          width: 25px;
          height: 24px;
          background-size: 25px 24px;

          &.icon0 {
            bg-image('./first');
          }

          &.icon1 {
            bg-image('./second');
          }

          &.icon2 {
            bg-image('./third');
          }
        }

        .text {
          font-size: $font-size-large;
          color: $color-theme;
        }
      }

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
