<template>
  <transition
    name='list-fade'
    appear
  >
    <div
      class='playlist'
      v-show='showFlag'
      @click='hide'
    >
      <div
        class="list-wrapper"
        @click.stop
      >
        <div class="list-header">
          <div class="title">
            <div
              class="mode"
              @click='changeMode'
            >
              <i :class='iconMode'></i>
            </div>
            <p class="text">{{ modeText }}</p>
            <div
              class="clear"
              @click='clearPlaylist'
            >
              <i class='icon-clear'></i>
            </div>
          </div>
        </div>
        <scroll
          ref='listContent'
          class="list-content"
          :data='sequenceList'
          :refreshDelay='refreshDelay'
          :click='true'
        >
          <transition-group
            name='list'
            ref='list'
            tag='div'
          >
            <div
              class="list-item"
              ref='listItem'
              v-for="(item,index) in sequenceList"
              :key='item.id'
              @click='selectItem(item,index)'
            >
              <i
                class='current'
                :class='{"icon-play":currentSong.id === item.id}'
              ></i>
              <p
                class='text'
                v-html='item.name'
              ></p>
              <div
                class='icon like'
                @click.stop='addFavorite(item)'
              >
                <i :class='getFavoriteIcon(item)'></i>
              </div>
              <div
                class='icon delete'
                @click.stop='deleteOne(item)'
              >
                <i class='icon-delete'></i>
              </div>
            </div>
          </transition-group>
        </scroll>
        <div class="list-button">
          <div
            class="add"
            @click='showAddSong'
          >
            <i class='icon-add'></i>
            <span class='text'>添加歌曲到队列</span>
          </div>
        </div>
        <div
          class="list-close"
          @click='hide'
        >
          <p>关闭</p>
        </div>
      </div>

      <confirm
        ref='confirm'
        :text='text'
        @confirm='confirm'
      ></confirm>

      <add-song ref='addSong'></add-song>
    </div>
  </transition>
</template>

<script>
import { mapActions } from 'vuex'
import Scroll from 'base/scroll/Scroll.vue'
import { playMode } from 'common/js/config'
import Confirm from 'base/confirm/Confirm.vue'
import { playerMixin } from 'common/js/mixin'
import AddSong from 'components/add-song/Add-Song.vue'

export default {
  mixins: [playerMixin],
  data() {
    return {
      showFlag: false
    }
  },
  created() {
    this.click = true
    this.text = '是否清空播放列表'
    this.refreshDelay = 100
  },
  computed: {
    modeText() {
      return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.loop ? '单曲循环' : '随机播放'
    }
  },
  methods: {
    ...mapActions([
      'deleteSong',
      'clearSong'
    ]),
    // 显示播放列表
    show() {
      this.showFlag = true
      setTimeout(() => {
        this.$refs.listContent.refresh()
        this.scrollToCurrent()
      }, 20)
    },
    // 隐藏播放列表
    hide() {
      this.showFlag = false
    },
    // 选中的音乐
    selectItem(item, index) {
      // 如果是随机播放,则需要找到当前点击的音乐在播放列表的位置
      if (this.mode === playMode.random) {
        index = this.playlist.findIndex(v => {
          return v.id === item.id
        })
      }
      this.setCurrentIndex(index)
      this.setPlayingState(true)
    },
    // 滚动到当前播放的音乐
    scrollToCurrent() {
      const index = this.sequenceList.findIndex(v => {
        return v.id === this.currentSong.id
      })
      this.$refs.listContent.scrollToElement(this.$refs.list.$el.children[index], 1000)
    },

    // 删除一首歌
    deleteOne(song) {
      this.deleteSong({ song })
      // 若是没有歌曲了,需要将列表隐藏
      if (!this.playlist.length) {
        this.hide()
      }
    },
    // 清空播放列表
    clearPlaylist() {
      this.$refs.confirm.show()
    },
    // 确定清空
    confirm() {
      this.clearSong()
      this.hide()
    },
    // 显示添加歌曲页面
    showAddSong() {
      this.$refs.addSong.show()
    }
  },
  watch: {
    currentSong(newVal, oldVal) {
      if (!this.showFlag || newVal.id === oldVal.id) {
        return
      }
      this.scrollToCurrent()
    }
  },
  components: {
    Scroll,
    Confirm,
    AddSong
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable.styl';

.playlist {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 200;
  background-color: $color-background-d;

  &.list-fade-enter-active, &.list-fade-leave-active {
    transition: opacity 0.3s;

    .list-wrapper {
      transition: all 0.3s;
    }
  }

  &.list-fade-enter, &.list-fade-leave-to {
    opacity: 0;

    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }

  .list-wrapper {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: $color-highlight-background;

    .list-header {
      position: relative;
      padding: 20px 20px 10px 20px;

      .title {
        display: flex;
        align-items: center;
        height: 30px;

        .mode {
          flex: 0 0 30px;
          font-size: 30px;
          margin-right: 10px;
          color: $color-theme-d;
        }

        .text {
          flex: 1;
          font-size: $font-size-medium;
          color: $color-text-l;
        }

        .clear {
          flex: 0 0 34px;
          width: 34px;
          height: 30px;
          line-height: 30px;
          text-align: center;

          .icon-clear {
            font-size: $font-size-medium;
            color: $color-text-d;
          }
        }
      }
    }

    .list-content {
      max-height: 240px;
      overflow: hidden;

      .list-item {
        display: flex;
        align-items: center;
        padding: 0 20px;
        height: 40px;

        &.list-enter-active, &.list-leave-active {
          transition: all 0.1s;
        }

        &.list-enter, &.list-leave-to {
          height: 0;
        }

        .current {
          flex: 0 0 20px;
          width: 20px;

          &.icon-play {
            font-size: $font-size-small;
            color: $color-theme-d;
          }
        }

        .text {
          flex: 1;
          font-size: $font-size-medium;
          color: $color-text-d;
        }

        .icon {
          flex: 0 0 32px;
          width: 32px;
          height: 32px;
          line-height: 34px;
          text-align: center;
          font-size: $font-size-small;
          color: $color-theme;
        }

        .like {
          .icon-favorite {
            color: $color-sub-theme;
          }
        }

        .delete {
        }
      }
    }

    .list-button {
      width: 140px;
      margin: 20px auto 30px auto;

      .add {
        display: flex;
        align-items: center;
        padding: 8px 16px;
        border-radius: 100px;
        border: 1px solid $color-text-l;
        color: $color-text-l;

        .icon-add {
          margin-right: 5px;
          font-size: $font-size-small;
        }

        .text {
          font-size: $font-size-small;
        }
      }
    }

    .list-close {
      width: 100%;
      height: 50px;
      line-height: 50px;
      background-color: $color-background;
      text-align: center;
      color: $color-text-l;
    }
  }
}
</style>
