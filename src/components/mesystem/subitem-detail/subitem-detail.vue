<template>
  <div class="subitem-detail">
    <sub-header :titleText="title" back-place="/me"></sub-header>
    <div class="subitem-detail-container">
      <!-- 十项常规子项详情展示 -->
      <scroll :data="detailList" v-show="detailList.length" class="mesystem-scroll">
        <div>
          <mesystem-list :mesystem-list="detailList"
          @select="selectItem"></mesystem-list>
        </div>
      </scroll>
      <!-- 当没信息的时候 no-result 组件显示 -->
      <div class="no-result-box box" v-show="!hasInfo && !detailList.length">
        <no-result></no-result>
      </div>
    </div>
    <transition name="slide">
      <router-view :detail-data="operateDetailList"></router-view>
    </transition>
  </div>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  import NoResult from 'base/no-result/no-result'
  import SubHeader from 'base/sub-header/sub-header'
  import MesystemList from 'base/mesystem-list/mesystem-list'
  import { getMesystemDetail } from 'api/mesystem'

  export default {
    props: {
      title: {
        type: String,
        default: ''
      },
      clsId: {
        type: Number,
        default: 0
      },
      beginTime: {
        type: String,
        default: ''
      },
      categoryId: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        hasInfo: true, // 是否有信息 ture => 有，false => 没有
        detailList: [],
        operateDetailList: []
      }
    },
    created() {
      if(!this.clsId) {
        this.$router.back()
      }
      this._getMesystemDetail()
    },
    methods: {
      selectItem(item) {
        this.operateDetailList = item
        
        this.$router.push('/mesystem/subitem/subitemDetail/mesystemOperateDetail')
      },
      _getMesystemDetail() {
        getMesystemDetail(this.clsId, this.beginTime, this.categoryId).then((res) => {
          console.log(res)
          if(!res.length) {
            this.hasInfo = false
          } else {
            this.detailList = res
          }
        })
      }
    },
    components: {
      Scroll,
      NoResult,
      SubHeader,
      MesystemList
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  
  .subitem-detail
    position: fixed
    top: 0
    bottom: 0
    left: 0
    right: 0
    z-index: 100
    background-color: $color-background
    .subitem-detail-container
      width: 100%
      height: 100%
      .mesystem-scroll
        height: 100%
        overflow: hidden
        div
          padding-bottom: 30px
      .no-result-box
        position: relative
        top: 40%
        left: 50%
        transform: translate3d(-50%, -50%, 0)
  .slide-enter-active, .slide-leave-active {
    transition: all .5s
  }
  .slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0)
  }
</style>
