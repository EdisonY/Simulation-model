<template>
  <section class="app-main">
    <!-- <transition name="fade-transform" mode="out-in"> -->
      <router-view :key="$route.fullPath"/>
    <!-- </transition> -->
  </section>
</template>

<script>
export default {
    name: 'AppMain',
    computed: {
        key() {
            return new Date().getTime()
        }
    }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
  z-index: 4;
}
.fixed-header+.app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
