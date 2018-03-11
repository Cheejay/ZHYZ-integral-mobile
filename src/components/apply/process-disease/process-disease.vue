<template>
  <div class="my-apply-list">
    <sub-header titleText="请假审批列表" :is-show-close-icon="false"></sub-header>
    <div class="bg-image" ref="bgImage">
      <!-- 选择分数种类的显示 -->
      <div class="type-wrapper" ref="btn">
        <div class="all btn-container" 
          :class="{'active': showType === 1}"
          @click="showAllType">
          <p class="text">所有</p>
          <p class="count">3</p>
        </div>
        <div class="already btn-container" 
          :class="{'active': showType === 2}"
          @click="showAddType">
          <p class="text">已审批</p>
          <p class="count">1</p>
        </div>
        <div class="yet btn-container" 
          :class="{'active': showType === 3}"
          @click="showDeeType">
          <p class="text">未审批</p>
          <p class="count">2</p>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll @scroll="scroll" 
      :probeType="probeType" 
      :listen-scroll="listenScroll" 
      :data="applies" 
      class="list" 
      ref="list">
      <!-- 所有项 -->
      <div class="apply-list-wrapper all" v-if="showType === 1">
        <apply-list :applies="applies" 
        :pull-up-load-more-txt="pullUpLoadAllMoreTxt"
        :is-loading-more="isLoadingMore"
        @select="selectItem"
        @onClickLoadMore="loadAllMore"></apply-list>
        <!-- 当有信息但是为渲染的时候 loading 组件显示 -->
        <div class="loading-box box" v-show="allHasInfo && !applies.length">
          <loading></loading>
        </div>
        <!-- 当没信息的时候 no-result 组件显示 -->
        <div class="no-result-box box" v-show="!allHasInfo && !applies.length">
          <no-result></no-result>
        </div>
      </div>
      <!-- 加分项 -->
      <div class="apply-list-wrapper add" v-if="showType === 2">
        <apply-list :applies="alreadyApply" 
        :pull-up-load-more-txt="pullUpLoadAddMoreTxt"
        :is-loading-more="isLoadingMore"
        @select="selectItem"
        @onClickLoadMore="loadAlreadyMore"></apply-list>
        <!-- 当有信息但是为渲染的时候 loading 组件显示 -->
        <div class="loading-box box" v-show="alreadyHasInfo && !alreadyApply.length">
          <loading></loading>
        </div>
        <!-- 当没信息的时候 no-result 组件显示 -->
        <div class="no-result-box box" v-show="!alreadyHasInfo && !alreadyApply.length">
          <no-result></no-result>
        </div>
      </div>
      <!-- 减分项 -->
      <div class="apply-list-wrapper dee" v-if="showType === 3">
        <apply-list :applies="yetApply" 
        :pull-up-load-more-txt="pullUpLoadDeeMoreTxt"
        :is-loading-more="isLoadingMore"
        @select="selectItem"
        @onClickLoadMore="loadYetMore"></apply-list>
        <!-- 当有信息但是为渲染的时候 loading 组件显示 -->
        <div class="loading-box box" v-show="yetHasInfo && !yetApply.length">
          <loading></loading>
        </div>
        <!-- 当没信息的时候 no-result 组件显示 -->
        <div class="no-result-box box" v-show="!yetHasInfo && !yetApply.length">
          <no-result></no-result>
        </div>
      </div>
    </scroll>
    <router-view :detail-data="detailData"></router-view>
  </div>
</template>

<script>
  import Loading from 'base/loading/loading'
  import Scroll from 'base/scroll/scroll'
  import SubHeader from 'base/sub-header/sub-header'
  import NoResult from 'base/no-result/no-result'
  import ApplyList from 'base/apply-list/apply-list'
  import { getProcessApplyList } from 'api/apply'
  import { LOGIN_ERR } from 'api/config'
  import { loginFailure } from 'common/js/util'
  import { prefixStyle } from 'common/js/dom'
  
  const RESERVED_HEIGHT = 0
  // const SCREEN_HEIGHT = window.screen.height
  const transform = prefixStyle('transform')
  const backdrop = prefixStyle('backdrop-filter')

  const ALL_TYPE = 1
  const ADD_TYPE = 2
  const DEE_TYPE = 3

  export default {
    data() {
      return {
        scrollY: 0,
        applies: [], // 所有项
        alreadyApply: [], // 加分项
        yetApply: [], // 减分项
        AllPageNum: 1, // 请求页数
        AllTotalPage: 2, // 请求总页数
        alreayPageNum: 1, // 请求页数
        alreadyTotalPage: 2, // 请求总页数
        yetPageNum: 1, // 请求页数
        yetTotalPage: 2, // 请求总页数
        allHasInfo: true, // 是否还有信息
        alreadyHasInfo: true, // 是否还有信息
        yetHasInfo: true, // 是否还有信息
        detailData: null,
        showType: 1, // 显示那种类型的加减分项，1 全部，2 已审批，3 未审批
        isLoadingMore: false, // 是否正在加载更多信息
        pullUpLoadAllMoreTxt: '点击加载更多',
        pullUpLoadAddMoreTxt: '点击加载更多',
        pullUpLoadDeeMoreTxt: '点击加载更多'
      }
    },
    created() {
      this.probeType = 3
      this.listenScroll = true
      this._getAllApplyList()
      this._getAlreadyApplyTypeList()
      this._getYetApplyTypeList()
    },
    mounted() {
      this.imageHeight = this.$refs.bgImage.clientHeight + 60
      this.mainTranslateY = -this.imageHeight + RESERVED_HEIGHT
      this.$refs.list.$el.style.top = `${this.imageHeight}px`
    },
    methods: {
      scroll(pos) {
        this.scrollY = pos.y
      },
      selectItem(item) {
        this.detailData = item
        this.$router.push('/apply/processDisease/processVerify')
      },
      // 显示已经审批项
      showAddType() {
        this.showType = ADD_TYPE
        this.pageNum = 1
        this.$refs.list.scrollTo(0, 0)
      },
      // 显示未审批项
      showDeeType() {
        this.showType = DEE_TYPE
        this.pageNum = 1
        this.$refs.list.scrollTo(0, 0)
      },
      // 显示所有审批项
      showAllType() {
        this.showType = ALL_TYPE
        this.pageNum = 1
        this.$refs.list.scrollTo(0, 0)
      },
      // 点击加载更多
      loadAllMore() {
        this._getAllApplyList(++this.AllPageNum)
      },
      loadAlreadyMore() {
        this._getAlreadyApplyTypeList(++this.alreayPageNum)
      },
      loadYetMore() {
        this._getYetApplyTypeList(++this.yetPageNum)
      },
      // get 所有审批列表
      _getAllApplyList(page) {
        this.isLoadingMore = true
        let filter = ''
        getProcessApplyList(filter, page).then((res) => {
          if(res.code === LOGIN_ERR) {
            loginFailure()
          }
          if(res.total === 0) {
            this.allHasInfo = false
          }
          this.AllTotalPage = Math.ceil(res.total / res.per_page)
          if(this.AllPageNum >= this.AllTotalPage) {
            this.pullUpLoadAllMoreTxt = '没有更多数据了'
          }
          this.applies = this.applies.concat(res.data)
          this.isLoadingMore = false
        })
      },
      // get 已审批列表
      _getAlreadyApplyTypeList(page) {
        let filter = 'over'
        getProcessApplyList(filter, page).then((res) => {
          if(res.code === LOGIN_ERR) {
            loginFailure()
          }
          if(res.total === 0) {
            this.alreadyHasInfo = false
          }
          this.alreadyTotalPage = Math.ceil(res.total / res.per_page)
          if(this.alreayPageNum >= this.alreadyTotalPage) {
            this.pullUpLoadAddMoreTxt = '没有更多数据了'
          }
          this.alreadyApply = this.alreadyApply.concat(res.data)
        })
      },
      // get 未审批列表
      _getYetApplyTypeList(page) {
        let filter = 'wait'
        getProcessApplyList(filter, page).then((res) => {
          if(res.code === LOGIN_ERR) {
            loginFailure()
          }
          if(res.total === 0) {
            this.yetHasInfo = false
          }
          this.yetTotalPage = Math.ceil(res.total / res.per_page)
          if(this.yetPageNum >= this.yetTotalPage) {
            this.pullUpLoadDeeMoreTxt = '没有更多数据了'
          }
          this.yetApply.concat(res.data)
        })
      }
    },
    watch: {
      scrollY(newY) {
        let translateY = Math.max(this.mainTranslateY, newY)
        // 图片是否要遮住文字，0为否
        let zIndex = 0
        // 图片放大的倍数
        let scale = 1
        // 图片的模糊值
        let blur = 0
        // 设置 layer 的位置
        this.$refs.layer.style[transform] = `translate3d(0, ${translateY}px, 0)`
        // 图片放大的百分比（percent）
        const percent = Math.abs(newY / this.imageHeight)
        // 列表往上拉的时候，图片放大
        if(newY > 0) {
          scale = 1 + percent
          zIndex = 10
        } else {
          blur = Math.min(20 * percent, 20)
        }
        // 设置图片模糊值（backdrop-filter只有在 IOS 系统下才可用）
        this.$refs.filter.style[backdrop] = `blur(${blur}px)`
        // 列表往下拉的时候，图片缩小并且图片高度变为 40px
        if(newY < this.mainTranslateY) {
          zIndex = 10
          this.$refs.bgImage.style.paddingTop = 0
          this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
          this.$refs.btn.style.display = 'none'
        } else {
          this.$refs.bgImage.style.paddingTop = '20%'
          this.$refs.bgImage.style.height = 0
          this.$refs.btn.style.display = ''
        }
        this.$refs.bgImage.style.zIndex = zIndex
        // 设置图片的大小倍数
        this.$refs.bgImage.style[transform] = `scale(${scale})`
      }
    },
    components: {
      Scroll,
      Loading,
      NoResult,
      SubHeader,
      ApplyList
    }
  }
</script>

<style lang="stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .my-apply-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 20%
      transform-origin: top
      background-size: cover
      background-color: #FFF
      .type-wrapper
        position: absolute
        bottom: 25px
        z-index: 50
        display: flex
        width: 100%
        .btn-container
          box-sizing: border-box
          flex: 1
          padding: 6px 0
          margin: 0 5px
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          &.active
            border-color: $color-border-e
            .text
              color: $color-text-e
          &.already
            .count
              color: #12b7f5
          &.yet
            .count
              color: #f62836
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-medium
          .count
            margin-top: 3px
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        // background: rgba(7, 17, 27, .5)
    .bg-layer
      position: relative
      height: 100%
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
      .no-result-box
        position: relative
        top: 40%
        left: 50%
        transform: translate3d(-50%, -50%, 0)
</style>
