<template>
  <div class='singer'>
    <categories>
      <div>
        <div
          class='categories-item'
          v-for='item in categoriesList.genre'
          :key='item.id'
        >{{ item.name }}</div>
      </div>
    </categories>
  </div>
</template>

<script>
import { ERR_OK } from 'api/config'
import { getSingerCategories, getSingerList } from 'api/singer'
import categories from 'base/categories/Categories.vue'
export default {
  data() {
    return {
      categoriesList: []
    }
  },
  created() {
    this._getSingerCategories()
    this._getSingerList()
  },
  methods: {
    async _getSingerCategories() {
      const res = await getSingerCategories()
      const { code, data } = res
      if (code === ERR_OK) {
        this.categoriesList = data
        console.log(this.categoriesList)
      }
    },
    async _getSingerList() {
      const res = await getSingerList()
      console.log(res)
    }
  },
  components: {
    categories
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
