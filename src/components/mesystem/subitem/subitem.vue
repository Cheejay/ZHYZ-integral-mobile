<template>
  <div class="subitem">
    <sub-header :titleText="title" back-place="/me"></sub-header>
    <div class="subitem-container">
      <scroll :data="[field]" class="mesystem-scroll">
        <!-- 十项常规展示 -->
        <ul class="subitem-list-group basic">
          <!-- 十项常规项目 -->
          <li class="item" 
            @click="itemSelect(item, key)"
            v-for="(item, key) in field" 
            v-if="key !== 'sum'">
            <p class="title">{{ item }}</p>
            <p class="text">{{ 10 + dayData[key] }}</p>
          </li>
          <!-- 总分 -->
          <li class="item" @click="totalSelect">
            <p class="title">总分</p>
            <p class="text">{{ dayData['sum'] }}</p>
          </li>
        </ul>
      </scroll>
    </div>
    <transition name="slide">
      <router-view :cls-id="clsId"
        :title="subTitle"
        :begin-time="beginTime + ''"
        :category-id="categoryId + ''"></router-view>
    </transition>
  </div>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  import SubHeader from 'base/sub-header/sub-header'

  export default {
    props: {
      field: { // 对照项目
        type: Object,
        default: null
      },
      dayData: { // 这一天的数据
        type: Object,
        default: null
      },
      title: {
        type: String,
        default: ''
      },
      clsId: {
        type: Number,
        default: 0
      },
      beginTime: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        categoryId: 0,
        subTitle: ''
      }
    },
    created() {
      if(!this.dayData) {
        this.$router.back()
      }
      
      console.log(this.dayData)
    },
    methods: {
      // 单独的项目被点击
      itemSelect(item, key) {
        this.subTitle = item
        this.categoryId = key

        this.$router.push('/mesystem/subitem/subitemDetail')
      },
      // 这天的全部项目查看
      totalSelect(item) {
        this.subTitle = `${this.title}总分`
        this.categoryId = 0

        this.$router.push('/mesystem/subitem/subitemDetail')
      }
    },
    components: {
      Scroll,
      SubHeader
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  
  .subitem
    position: fixed
    top: 0
    bottom: 0
    left: 0
    right: 0
    z-index: 100
    background-color: $color-background
    .subitem-container
      width: 100%
      .mesystem-scroll
        height: 100%
        overflow: hidden
        .subitem-list-group
          margin-bottom: 20px
          &:first-child
            margin-top: 15px
          .item
            display: flex
            align-items: center
            justify-content: space-between
            padding: 14px
            font-size: $font-size-medium-x
            border-bottom: 1px solid $color-border
            background-color: $color-background-d
            // &:first-child
            //   border-top: 1px solid $color-border
            // &:active
            //   background-color: $color-background
            &.exit
              text-align: center              
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
    transition: all .5s
  }
  .slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0)
  }
</style>
