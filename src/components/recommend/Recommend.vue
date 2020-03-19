<template>
  <div class='recommend'>
    <div class="recommend-content">
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
                <img :src="item.picUrl">
              </a>
            </div>
          </slider>
        </div>
      </div>
      <div class="recommend-list">
        <h1 class='list-title'>热门歌单推荐</h1>
        <ul></ul>
      </div>
    </div>
  </div>
</template>

<script>
import { getRecommend } from 'api/recommend.js'
import { ERR_OK } from 'api/config.js'
import Slider from 'base/slider/Slider.vue'
export default {
  data() {
    return {
      sliderData: [],
      autoPlay: true
    }
  },
  created() {
    this._getRecommend()
  },
  methods: {
    // 获取轮播图数据
    async _getRecommend() {
      const res = await getRecommend()
      const { code, data: { slider } } = res
      if (code === ERR_OK) {
        this.sliderData = slider
        console.log(this.sliderData)
      }
    }
  },
  components: {
    Slider
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
