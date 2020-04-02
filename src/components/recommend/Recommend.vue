<template>
  <div
    class='recommend'
    ref='recommend'
  >
    <scroll
      :data='discList'
      :click='click'
      ref='scroll'
      class='recommend-content'
    >
      <div>
        <div
          class="slider-wrapper"
          v-if="sliderData.length"
        >
          <div class="slider-content">
            <slider>
              <div
                v-for="item in sliderData"
                :key='item.id'
              >
                <a :href="item.linkUrl">
                  <img
                    @load='loadImage'
                    :src="item.picUrl"
                  >
                </a>
              </div>
            </slider>
          </div>
        </div>
        <div class="recommend-list">
          <h1 class='list-title'>热门歌单推荐</h1>
          <ul class='list-box'>
            <li
              class='list-item'
              v-for='item in discList'
              :key='item.content_id'
              @click='selectSongList(item)'
            >
              <div class="icon">
                <img
                  v-lazy="item.cover"
                  width='60'
                  height='60'
                >
              </div>
              <div class='text'>
                <p
                  class='text-name'
                  v-html='item.username'
                ></p>
                <p
                  class='text-desc'
                  v-html='item.title'
                ></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div
        class="loading-container"
        v-show='!discList.length'
      >
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import { getRecommend, getDiscList } from 'api/recommend.js'
import { ERR_OK } from 'api/config.js'
import Slider from 'base/slider/Slider.vue'
import Scroll from 'base/scroll/Scroll.vue'
import Loading from 'base/loading/Loading.vue'
import { playlistMixin } from 'common/js/mixin'
import { mapMutations } from 'vuex'

export default {
  mixins: [playlistMixin],
  data() {
    return {
      sliderData: [],
      discList: []
    }
  },
  created() {
    this._getRecommend()
    this._getDiscList()
    this.click = true
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.recommend.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    ...mapMutations({
      setDisc: 'SET_DISC'
    }),
    // 获取轮播图数据
    async _getRecommend() {
      const res = await getRecommend()
      const { code, data: { slider } } = res
      if (code === ERR_OK) {
        this.sliderData = slider
      }
    },
    // 获取歌单数据
    async _getDiscList() {
      const res = await getDiscList()
      const { code, data } = res
      if (code === ERR_OK) {
        this.discList = data
      }
    },
    // 是否加载好轮播图的高度
    loadImage() {
      // 只执行一次
      if (!this.checkLoad) {
        this.checkLoad = true
        setTimeout(() => {
          this.$refs.scroll.refresh()
        }, 20)
      }
    },
    // 点击歌单
    selectSongList(songList) {
      this.$router.push({
        path: `/recommend/${songList.content_id}`
      })
      this.setDisc(songList)
    }
  },
  components: {
    Slider,
    Scroll,
    Loading
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable.styl';

.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;

  .recommend-content {
    height: 100%;
    overflow: hidden;

    .slider-wrapper {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 40%;
      overflow: hidden;

      .slider-content {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    }

    .recommend-list {
      .list-title {
        line-height: 65px;
        text-align: center;
        color: $color-theme;
        font-size: $font-size-medium;
      }

      .list-box {
        .list-item {
          display: flex;
          box-sizing: border-box;
          align-items: center;
          padding: 0 20px 20px 20px;

          .icon {
            flex: 0 0 60px;
            width: 60px;
            padding-right: 20px;
          }

          .text {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            text-align: left;
            line-height: 20px;
            overflow: hidden;
            font-size: $font-size-medium;

            .text-name {
              margin-bottom: 10px;
              color: $color-text;
            }

            .text-desc {
              color: $color-text-d;
            }
          }
        }
      }
    }

    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
