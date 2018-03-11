<template>
  <transition name="slide">
    <div class="select-list" v-show="isShow">
      <!-- 头部 -->
      <div class="sub-header">
        <div class="back">
          <i class="icon-hide zhyz-right" v-show="showType === 1" @click="hide"></i>
          <i class="icon-back zhyz-right" v-show="showType === 2" @click="back"></i>
        </div>
        <h2 class="title">选择考评项目</h2>
      </div>
      <scroll class="list-container" 
        :data="listData"
        v-if="listData"
        ref="wrapper">
        <!-- 分类 -->
        <ul class="list-group category" v-show="showType === 1">
          <li class="item" v-for="item in listData" :key="item.id" 
          @click.prevent.stop="selectCategory(item)">
            <p class="title">{{ item.name }}</p>
            <p class="text">
              <i class="zhyz-right"></i>
            </p>
          </li>
        </ul>
        <!-- 项目 -->
        <ul class="list-group project" v-show="showType === 2">
          <li class="item" v-for="item in projectData" :key="item.id" @click="selectProject(item)">
            <p class="title">{{ item.content }}</p>
          </li>
        </ul>
      </scroll>
      <el-button
        type="primary"
        v-loading.fullscreen.lock="fullscreenLoading">
      </el-button>
    </div>
  </transition>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  import { getProjectByCategoryId } from 'api/operate'
  import { loginFailure } from 'common/js/util'
  import { LOGIN_ERR } from 'api/config'

  export default {
    props: {
      listData: {
        type: Array,
        default: null
      },
      isShow: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        showType: 1,
        projectData: [],
        fullscreenLoading: false
      }
    },
    methods: {
      // 选择分类后
      selectCategory(item) {
        this._getProjectByCategoryId(item.id)
        this.showType = 2
        this.$refs.wrapper.scrollTo(0, 0)
      },
      // 选择项目后
      selectProject(item) {
        this.$emit('selectProject', item)
        this.hide()
      },
      hide() {
        this.$emit('hide')
        this.showType = 1
      },
      back() {
        this.showType = 1
      },
      _getProjectByCategoryId(id) {
        this.fullscreenLoading = true
        getProjectByCategoryId(id).then((res) => {
          if(res.code === LOGIN_ERR) {
            loginFailure()
          }
          this.projectData = res
          this.fullscreenLoading = false
        })
      }
    },
    components: {
      Scroll
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/mixin"
  @import "~common/stylus/variable"

  .select-list
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    height: 100%
    z-index: 300
    background-color: $color-background
    .sub-header
      position: relative
      width: 100%
      height: 50px
      color: $color-text
      background-color: #EDEDED
      .back
        display: inline-block
        vertical-align: top
        i
          display: block
          padding: 15px
          font-size: $font-size-large-x
          &.icon-hide
            transform: rotate(90deg)
          &.icon-back
            transform: rotate(180deg)
      .title
        display: inline-block
        no-wrap()
        line-height: 50px
        font-size: $font-size-large
    .list-container
      position: relative
      height: 100%
      overflow: hidden
      .list-group
        overflow: hidden
        .item
          display: flex
          align-items: center
          justify-content: space-between
          padding: 14px
          font-size: $font-size-medium-x
          background-color: $color-background-d
          &:not(:last-child)
            border-bottom: 1px solid $color-border
          &:active
            background-color: $color-background
          &.exit
            text-align: center              
          &:last-child
            padding-bottom: 80px
          .title
            color: $color-sub-theme
          .title
            flex: 1
            color: #000
            i
              font-size: $font-size-large
          .text
            flex: 1
            text-align: right
            color: $color-text-l
  .slide-enter-active, .slide-leave-active {
    transition: all .3s
  }
  .slide-enter, .slide-leave-to {
    opacity: 0
    transform: translate3d(0, 100%, 0)
  }
</style>
