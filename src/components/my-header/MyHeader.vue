<template>
  <div class='my-header'>
    <div class='logo'></div>
    <h1 class='title'>Penguins music</h1>
    <router-link
      to='/user'
      tag='div'
      class='mine'
    >
      <i class='icon-mine'></i>
    </router-link>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable.styl';

.my-header {
  position: relative;
  width: 100%;
  height: 44px;
  color: $color-theme;
  font-size: 0;
  text-align: center;

  .logo {
    display: inline-block;
    vertical-align: top;
    width: 30px;
    height: 32px;
    margin-top: 2px;
    margin-right: 9px;
    background-image: url('~common/image/logo.gif');
    background-size: 30px 32px;
  }

  .title {
    display: inline-block;
    vertical-align: top;
    line-height: 44px;
    font-size: $font-size-large;
  }

  .mine {
    position: absolute;
    right: 0;
    top: 0;

    .icon-mine {
      font-size: 20px;
      padding: 12px;
      line-height: 44px;
    }
  }
}
</style>
