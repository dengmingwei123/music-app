<template>
  <div id="app">
    <my-header></my-header>
    <tab></tab>
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
import MyHeader from 'components/my-header/MyHeader.vue'
import Tab from 'components/tab/Tab.vue'
export default {
  components: {
    MyHeader,
    Tab
  }
}
</script>

<style lang="stylus"></style>
