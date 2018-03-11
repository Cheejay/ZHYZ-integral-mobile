<template>
  <div class="my-operate-detail-list">
    <sub-header :titleText="`${stu.name} 详情`"></sub-header>
    <scroll @scroll="scroll" 
        :probeType="probeType" 
        :listen-scroll="listenScroll" 
        :data="operates" 
        class="list" 
        ref="list">
      <div class="operate-list-wrapper" ref="list2">
        <operate-list :operates="operates" 
        :pull-up-load-more-txt="pullUpLoadMoreTxt"
        :is-loading-more="isLoadingMore"
        :can-Withdraw="false"
        @onClickLoadMore="loadMore"
        @select="selectItem"></operate-list>
        <!-- 下拉加载 -->
        <!-- <div class="loading-box-gif">
          <loading-gif :title="pullUpLoadMoreTxt"></loading-gif>
        </div> -->
      </div>
      <!-- 当有信息但是为渲染的时候 loading 组件显示 -->
      <div class="loading-box box" v-show="hasInfo && !operates.length">
        <loading></loading>
      </div>
      <!-- 当没信息的时候 no-result 组件显示 -->
      <div class="no-result-box box" v-show="!hasInfo && !operates.length">
        <no-result></no-result>
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
  import OperateList from 'base/operate-list/operate-list'
  import { getStudentOperateInfo, getStudentInfoById } from 'api/operate'
  import { LOGIN_ERR } from 'api/config'
  import { loginFailure } from 'common/js/util'
  import { prefixStyle } from 'common/js/dom'
  
  const RESERVED_HEIGHT = 0
  // const SCREEN_HEIGHT = window.screen.height
  const transform = prefixStyle('transform')
  const backdrop = prefixStyle('backdrop-filter')

  export default {
    props: {
      stu: {
        type: Object,
        default: null
      }
    },
    data() {
      return {
        scrollY: 0,
        operates: [],
        pageNum: 1,
        totalPage: 2,
        hasInfo: true,
        detailData: null,
        isLoadingMore: false,
        pullUpLoadMoreTxt: '点击加载更多'
      }
    },
    created() {
      this.probeType = 3
      this.listenScroll = true
      this._getStudentOperateInfo()
    },
    mounted() {
      this.imageHeight = 60
      this.mainTranslateY = -this.imageHeight + RESERVED_HEIGHT
      this.$refs.list.$el.style.top = `${this.imageHeight}px`
    },
    methods: {
      scroll(pos) {
        this.scrollY = pos.y
      },
      selectItem(item) {
        this.detailData = item
        this.$router.push('/searchStudentScore/selectClass/classStudent/studentOperateDetailList/studentOperateDetail')
      },
      // 点击加载更多
      loadMore() {
        this._getPersonalOperateInfo(++this.pageNum)
      },
      rebuildScroll() {
        this.$nextTick(() => {
          try {
            this.$refs.scroll.destroy()
            this.$refs.scroll.initScroll()
          } catch (err) {
            console.log(err)
          }
        })
      },
      _getStudentOperateInfo(page) {
        getStudentOperateInfo(this.stu.id, page).then((res) => {
          if(res.code === LOGIN_ERR) {
            loginFailure()
          }
          if(res.total === 0) {
            this.hasInfo = false
          }
          this.totalPage = Math.ceil(res.total / res.per_page)
          if(this.pageNum >= this.totalPage) {
            this.pullUpLoadMoreTxt = '没有更多数据了'
          }
          this.operates = this.operates.concat(res.data)
        })
      },
      _getStudentInfoById() {
        getStudentInfoById(this.stu.id).then((res) => {
          if(res.code === LOGIN_ERR) {
            loginFailure()
          }
          this.studentData = res
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
        // 歌曲列表往上拉的时候，图片放大
        if(newY > 0) {
          scale = 1 + percent
          zIndex = 10
        } else {
          blur = Math.min(20 * percent, 20)
        }
        // 设置图片模糊值（backdrop-filter只有在 IOS 系统下才可用）
        this.$refs.filter.style[backdrop] = `blur(${blur}px)`
        // 歌曲列表往下拉的时候，图片缩小并且图片高度变为 40px
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
      OperateList
    }
  }
</script>

<style lang="stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .my-operate-detail-list
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
          padding: 7px 0
          margin: 0 5px
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
        .score-bar
          width: 100%
          .score-list
            padding: 10px 0
            display: flex
            text-align: center
            align-items: center
            align-content: center
            justify-content: center
            box-sizing: border-box
            .bar-item
              position: relative
              flex: 1
              &.add
                .score-text
                  color: #12b7f5
              &.dee
                .score-text
                  color: #f62836
              &:not(:last-child)::after
                content: ''
                position: absolute
                width: 0px
                height: 70%
                top: 0
                right: 0
                transform: translate3d(0, 20%, 0)
                border-right: 1px solid $color-text-c
              .title
                font-size: $font-size-medium
                color: $color-text-l
              .score-text
                margin-top: 5px
                color: $color-text
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
