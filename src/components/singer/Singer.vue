<template>
  <div class='singer'>
    <list-view
      :data='singerList'
      @select='selectSinger'
    ></list-view>
    <router-view></router-view>
  </div>
</template>

<script>
import { ERR_OK } from 'api/config'
import Singer from 'common/js/singer'
import { getSingerList } from 'api/singer'
import ListView from 'base/list-view/List-View.vue'

const HOT_NAME = '热门'
const HOT_SINGER_LENGH = 10
export default {
  data() {
    return {
      singerList: []
    }
  },
  created() {
    this._getSingerList()
  },
  methods: {
    selectSinger(singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      })
    },
    async _getSingerList() {
      const res = await getSingerList()
      const { code, data: { list } } = res
      if (code === ERR_OK) {
        this.singerList = this._normalizeSinger(list)
        console.log(this.singerList)
      }
    },
    _normalizeSinger(list) {
      const map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }

      list.forEach((value, index) => {
        // 将前十的数据加入到热门
        if (index < HOT_SINGER_LENGH) {
          map.hot.items.push(new Singer({ id: value.Fsinger_mid, name: value.Fsinger_name }))
        }
        // 判断对象中是否有当前的key
        let key = value.Findex
        // 若是没有,创建一个
        if (!map[key]) {
          if (key === '9') {
            key = '#'
          }
          map[key] = {
            title: key,
            items: []
          }
        }

        map[key].items.push(new Singer({ id: value.Fsinger_mid, name: value.Fsinger_name }))
      })

      // 为了得到有序列表,我们需要处理map
      const result = []
      const hot = []
      const special = []
      for (const key in map) {
        const val = map[key]
        if (val.title.match(/[a-zA-z]/)) {
          result.push(val)
        } else if (val.title === HOT_NAME) {
          hot.push(val)
        } else {
          special.push(val)
        }
      }
      result.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(result).concat(special)
    }
  },
  components: {
    ListView
  }
}
</script>

<style lang="stylus" scoped>
.singer {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
}
</style>
