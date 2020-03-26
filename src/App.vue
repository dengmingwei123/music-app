<template>
  <div id="app">
    <my-header></my-header>
    <tab></tab>
    <keep-alive>
      <router-view />
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
import MyHeader from 'components/my-header/MyHeader.vue'
import Tab from 'components/tab/Tab.vue'
import Player from 'components/player/Player.vue'

export default {
  components: {
    MyHeader,
    Tab,
    Player
  }
}
</script>

<style lang="stylus"></style>
