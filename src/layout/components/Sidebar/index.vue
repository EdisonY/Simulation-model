<template>
  <div :class="{'has-logo':showLogo}">
    
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
     <h2 class="newTitle">
        <!-- <svg data-v-2cb57da0="" version="1.0" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100%" height="100%" viewBox="0 0 340.000000 250.000000" preserveAspectRatio="xMidYMid meet" color-interpolation-filters="sRGB" style="margin: auto;">
            <g data-v-2cb57da0="" fill="#fff" class="icon-text-wrapper icon-svg-group iconsvg" transform="translate(71.86470794677734,90.65226364135742)">
                <g class="iconsvg-imagesvg" transform="translate(0,0)"><g>
                    <rect fill="#fff" fill-opacity="0" stroke-width="2" x="0" y="0" width="60" height="68.69547296833139" class="image-rect"></rect> 
                        <svg filter="url(#colors588798367)" x="0" y="0" width="60" height="68.69547296833139" filtersec="colorsf4805047302" class="image-svg-svg primary" style="overflow: visible;">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.022831054404377937 0.0005446672439575195 87.34150695800781 99.99945831298828">
                                <g fill="#333">
                                    <path d="M48.78 65.26L47 98.08l-.09 1.76a18.16 18.16 0 0 1-7.4-2.76L8.17 76.63a18.16 18.16 0 0 1-6.23-7A18 18 0 0 1 0 60.55l2-37.34a18.17 18.17 0 0 1 2.23-7.61l29 18.93-.43 7.77A21 21 0 0 0 42.28 61zM87.29 36.55s-1.53 27.82-2 37.24c-.45 1.16-3.93 4.52-8.87 8.8l1.75-44.65A12.5 12.5 0 0 0 72.62 27L35.57 2C42 .56 46.71-.25 47.91.07c7.9 5.17 31.22 20.38 31.23 20.38a18 18 0 0 1 8.15 16.1z"></path>
                                    <path d="M64.05 40.66l-2.11 53.87c-1.51 1.21-3 2.41-4.57 3.6a18.09 18.09 0 0 1-7.54 1.87l3-55.29a1.47 1.47 0 0 0-.67-1.32L5.83 13.13a18.26 18.26 0 0 1 6-5c1.85-.53 3.73-1 5.6-1.56l44.66 30.21a4.43 4.43 0 0 1 1.96 3.88z"></path><path d="M75.2 37.82l-1.86 47.39c-2.57 2.19-5.41 4.52-8.34 6.89l2-51.32a7.41 7.41 0 0 0-3.26-6.45L21.18 5.58c3.63-1 7.2-1.87 10.48-2.65L71 29.48a9.55 9.55 0 0 1 4.2 8.34z"></path>
                                </g>
                            </svg>
                        </svg> 
                        <defs>
                            <filter id="colors588798367">
                                <feColorMatrix type="matrix" values="0 0 0 0 0.91796875  0 0 0 0 0  0 0 0 0 0.10546875  0 0 0 1 0" class="icon-fecolormatrix"></feColorMatrix>
                            </filter> 
                            <filter id="colorsf4805047302">
                                <feColorMatrix type="matrix" values="0 0 0 0 0.99609375  0 0 0 0 0.99609375  0 0 0 0 0.99609375  0 0 0 1 0" class="icon-fecolormatrix"></feColorMatrix>
                            </filter> 
                            <filter id="colorsb7647789380">
                                <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" class="icon-fecolormatrix"></feColorMatrix>
                            </filter>
                        </defs>
                    </g>
                </g> 
                <g transform="translate(90,1.7242469787597656)">
                    <g data-gra="path-name" fill-rule="" class="tp-name iconsvg-namesvg">
                        <g transform="scale(1)">
                            <g>
                                <path d="M10.81-14.73L10.28-13.69Q10.18-13.52 10.06-13.43 9.95-13.35 9.77-13.35L9.77-13.35Q9.58-13.35 9.32-13.54 9.07-13.73 8.68-13.96 8.29-14.2 7.74-14.39 7.19-14.58 6.41-14.58L6.41-14.58Q5.67-14.58 5.11-14.38 4.54-14.18 4.16-13.84 3.78-13.5 3.59-13.05 3.4-12.59 3.4-12.06L3.4-12.06Q3.4-11.38 3.73-10.93 4.06-10.48 4.61-10.17 5.16-9.85 5.86-9.62 6.55-9.38 7.28-9.14 8.01-8.89 8.71-8.57 9.41-8.26 9.96-7.79 10.51-7.31 10.84-6.62 11.17-5.93 11.17-4.92L11.17-4.92Q11.17-3.86 10.81-2.93 10.45-1.99 9.75-1.3 9.06-0.61 8.04-0.22 7.03 0.18 5.74 0.18L5.74 0.18Q4.17 0.18 2.87-0.39 1.57-0.96 0.66-1.94L0.66-1.94 1.29-2.98Q1.38-3.1 1.51-3.19 1.64-3.27 1.8-3.27L1.8-3.27Q2.04-3.27 2.34-3.02 2.65-2.76 3.11-2.46 3.57-2.15 4.22-1.9 4.87-1.64 5.81-1.64L5.81-1.64Q6.59-1.64 7.2-1.86 7.81-2.07 8.24-2.46 8.66-2.85 8.89-3.4 9.11-3.94 9.11-4.61L9.11-4.61Q9.11-5.34 8.78-5.81 8.44-6.28 7.9-6.6 7.36-6.92 6.66-7.14 5.97-7.36 5.24-7.59 4.51-7.82 3.81-8.13 3.11-8.43 2.57-8.92 2.03-9.41 1.69-10.14 1.36-10.87 1.36-11.94L1.36-11.94Q1.36-12.8 1.69-13.61 2.03-14.41 2.66-15.03 3.29-15.66 4.23-16.03 5.16-16.4 6.37-16.4L6.37-16.4Q7.73-16.4 8.85-15.97 9.97-15.54 10.81-14.73L10.81-14.73ZM21.95-5.86L21.95-5.86Q22.11-5.59 22.23-5.29 22.35-4.99 22.46-4.69L22.46-4.69Q22.57-5 22.7-5.29 22.82-5.58 22.98-5.88L22.98-5.88 28.47-15.85Q28.62-16.11 28.78-16.17 28.93-16.22 29.23-16.22L29.23-16.22 30.85-16.22 30.85 0 28.92 0 28.92-11.92Q28.92-12.16 28.93-12.43 28.95-12.7 28.97-12.98L28.97-12.98 23.41-2.84Q23.13-2.33 22.62-2.33L22.62-2.33 22.3-2.33Q21.79-2.33 21.51-2.84L21.51-2.84 15.83-13.02Q15.86-12.72 15.88-12.44 15.89-12.16 15.89-11.92L15.89-11.92 15.89 0 13.97 0 13.97-16.22 15.59-16.22Q15.88-16.22 16.04-16.17 16.2-16.11 16.35-15.85L16.35-15.85 21.95-5.86ZM41.66-16.22L48.14 0 46.45 0Q46.15 0 45.97-0.15 45.79-0.29 45.7-0.52L45.7-0.52 44.18-4.44 36.9-4.44 35.39-0.52Q35.31-0.32 35.11-0.16 34.92 0 34.64 0L34.64 0 32.94 0 39.43-16.22 41.66-16.22ZM40.06-12.61L37.51-6.02 43.57-6.02 41.02-12.62Q40.77-13.23 40.54-14.15L40.54-14.15Q40.41-13.69 40.29-13.3 40.18-12.9 40.06-12.61L40.06-12.61ZM54.27-6.77L52.6-6.77 52.6 0 50.42 0 50.42-16.22 55-16.22Q56.54-16.22 57.66-15.91 58.79-15.6 59.52-15.01 60.25-14.42 60.6-13.59 60.95-12.76 60.95-11.73L60.95-11.73Q60.95-10.87 60.68-10.12 60.4-9.37 59.89-8.78 59.37-8.18 58.63-7.77 57.89-7.35 56.95-7.13L56.95-7.13Q57.36-6.89 57.68-6.44L57.68-6.44 62.41 0 60.46 0Q59.86 0 59.58-0.46L59.58-0.46 55.37-6.26Q55.17-6.53 54.95-6.65 54.72-6.77 54.27-6.77L54.27-6.77ZM52.6-14.49L52.6-8.37 54.9-8.37Q55.86-8.37 56.59-8.6 57.32-8.83 57.82-9.25 58.31-9.68 58.56-10.27 58.81-10.86 58.81-11.57L58.81-11.57Q58.81-13.02 57.85-13.75 56.89-14.49 55-14.49L55-14.49 52.6-14.49ZM62.53-16.22L75.23-16.22 75.23-14.38 69.99-14.38 69.99 0 67.8 0 67.8-14.38 62.53-14.38 62.53-16.22ZM93.35-3.35L93.35-3.35Q93.53-3.35 93.67-3.2L93.67-3.2 94.53-2.26Q93.54-1.11 92.12-0.46 90.7 0.18 88.69 0.18L88.69 0.18Q86.94 0.18 85.51-0.42 84.09-1.03 83.08-2.12 82.07-3.21 81.52-4.74 80.96-6.27 80.96-8.11L80.96-8.11Q80.96-9.94 81.56-11.47 82.15-13 83.23-14.09 84.3-15.19 85.8-15.8 87.3-16.4 89.11-16.4L89.11-16.4Q90.9-16.4 92.2-15.85 93.49-15.29 94.5-14.34L94.5-14.34 93.79-13.34Q93.71-13.22 93.61-13.15 93.5-13.07 93.31-13.07L93.31-13.07Q93.16-13.07 93-13.18 92.84-13.29 92.61-13.45 92.38-13.61 92.08-13.79 91.77-13.97 91.35-14.13 90.93-14.29 90.38-14.39 89.82-14.5 89.1-14.5L89.1-14.5Q87.8-14.5 86.72-14.05 85.64-13.61 84.86-12.78 84.07-11.95 83.64-10.77 83.2-9.58 83.2-8.11L83.2-8.11Q83.2-6.59 83.64-5.4 84.07-4.21 84.83-3.39 85.58-2.57 86.61-2.14 87.64-1.71 88.83-1.71L88.83-1.71Q89.55-1.71 90.13-1.79 90.71-1.88 91.2-2.06 91.69-2.24 92.12-2.52 92.54-2.8 92.97-3.18L92.97-3.18Q93.16-3.35 93.35-3.35ZM100.02-16.22L100.02 0 97.83 0 97.83-16.22 100.02-16.22ZM102.72-16.22L115.42-16.22 115.42-14.38 110.18-14.38 110.18 0 107.98 0 107.98-14.38 102.72-14.38 102.72-16.22ZM129.93-16.22L123.98-6.45 123.98 0 121.79 0 121.79-6.45 115.85-16.22 117.77-16.22Q118.07-16.22 118.24-16.07 118.41-15.93 118.53-15.71L118.53-15.71 122.25-9.41Q122.47-9.01 122.62-8.66 122.78-8.31 122.9-7.97L122.9-7.97Q123.03-8.32 123.17-8.67 123.32-9.02 123.55-9.41L123.55-9.41 127.25-15.71Q127.35-15.89 127.53-16.06 127.7-16.22 127.99-16.22L127.99-16.22 129.93-16.22Z" transform="translate(-0.6600000262260437, 16.399999618530273)">

                                </path>
                            </g>
                            <g data-gra="path-name-1" fill="#fff" transform="translate(0,19.579999923706055)">
                                <g transform="scale(1.05175)">
                                    <path d="M16.18-18.12L11.73-18.12 11.73 0 5.88 0 5.88-43.42 18.15-43.42Q22.27-43.42 25.27-42.59 28.27-41.76 30.23-40.18 32.18-38.61 33.12-36.38 34.06-34.15 34.06-31.39L34.06-31.39Q34.06-29.09 33.33-27.09 32.61-25.09 31.23-23.5 29.85-21.91 27.86-20.79 25.88-19.67 23.36-19.09L23.36-19.09Q24.45-18.45 25.3-17.24L25.3-17.24 37.97 0 32.76 0Q31.15 0 30.39-1.24L30.39-1.24 19.12-16.76Q18.61-17.48 18-17.8 17.39-18.12 16.18-18.12L16.18-18.12ZM11.73-38.79L11.73-22.39 17.88-22.39Q20.45-22.39 22.41-23.02 24.36-23.64 25.68-24.77 27-25.91 27.67-27.48 28.33-29.06 28.33-30.97L28.33-30.97Q28.33-34.85 25.77-36.82 23.21-38.79 18.15-38.79L18.15-38.79 11.73-38.79ZM62.67-43.42L80.03 0 75.48 0Q74.7 0 74.21-0.39 73.73-0.79 73.48-1.39L73.48-1.39 69.42-11.88 49.94-11.88 45.88-1.39Q45.67-0.85 45.15-0.42 44.64 0 43.88 0L43.88 0 39.33 0 56.7-43.42 62.67-43.42ZM58.39-33.76L51.58-16.12 67.79-16.12 60.97-33.79Q60.3-35.42 59.67-37.88L59.67-37.88Q59.33-36.64 59.02-35.59 58.7-34.55 58.39-33.76L58.39-33.76ZM92.48-43.42L92.48 0 86.61 0 86.61-43.42 92.48-43.42ZM110-43.42L110-4.94 128.79-4.94 128.79 0 104.12 0 104.12-43.42 110-43.42Z" transform="translate(-5.880000114440918, 43.41999816894531)">
                                    </path>
                                </g>
                            </g>
                        </g>
                    </g> 
                </g>
            </g>
        </svg> -->
        <img v-if="!isCollapse" src="../../../assets/basie/logo1.png" />

     </h2>
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        :router="true"
        mode="vertical"
      >
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path"/>
      </el-menu>
    </el-scrollbar>
    <img src="../../../assets/basie/logo.png" class="logo" v-if="sidebar.opened">
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      return this.$router.options.routes
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }      
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
<style>
.logo{position: absolute;left:50%;bottom: 10px;transform: translate(-50%,0);}
.newTitle{display: block;height: 50px;color: #fff;font-size: 18px;text-align: center;line-height: 50px;overflow: hidden;}
.newTitle img{width: 200px;height: 50px;}
.hideSidebar .newTitle img{margin-left: -113px;transform: scaleX(0.7);}
.el-menu div{position: relative;}
.el-menu div strong{display: block;width: 100%;height: 100%;position: absolute;background: transparent;z-index: 2;cursor: not-allowed;}
</style>
