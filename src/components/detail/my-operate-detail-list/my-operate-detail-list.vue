<template>
  <div class="my-operate-detail-list">
    <sub-header titleText="操作详情列表" :is-show-close-icon="false"></sub-header>
    <div class="bg-image" ref="bgImage">
      <!-- 选择分数种类的显示 -->
      <div class="type-wrapper" ref="btn">
        <div class="all btn-container" 
          :class="{'active': showType === 1}"
          @click="showAllType">
          <p class="text">所有</p>
          <p class="score">{{ myScore.add + myScore.dee }}</p>
        </div>
        <div class="add btn-container" 
          :class="{'active': showType === 2}"
          @click="showAddType">
          <p class="text">加分</p>
          <p class="score">{{ myScore.add }}</p>
        </div>
        <div class="dee btn-container" 
          :class="{'active': showType === 3}"
          @click="showDeeType">
          <p class="text">减分</p>
          <p class="score">{{ myScore.dee }}</p>
        </div>
      </div>
      <!-- <div class="type-wrapper" ref="btn">
        <div class="score-bar">
          <ul class="score-list">
            <li class="bar-item add" @click="showAddType">
              <p class="title">加分项</p>
              <p class="score-text">12</p>
            </li>
            <li class="bar-item dee" @click="showDeeType">
              <p class="title">减分项</p>
              <p class="score-text">2</p>
            </li>
            <li class="bar-item all" @click="showAllType">
              <p class="title">所有项</p>
              <p class="score-text">3</p>
            </li>
          </ul>
        </div>
      </div> -->
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll @scroll="scroll" 
      :probeType="probeType" 
      :listen-scroll="listenScroll" 
      :data="operates" 
      class="list" 
      ref="list">
      <!-- 所有项 -->
      <div class="operate-list-wrapper all" v-if="showType === 1">
        <operate-list :operates="operates" 
        :pull-up-load-more-txt="pullUpLoadAllMoreTxt"
        :is-loading-more="isLoadingMore"
        @onClickLoadMore="loadAllMore"
        @select="selectItem"
        @withdrawItem="withdrawItem"
        @unWithdrawItem="unWithdrawItem"></operate-list>
        <!-- 当有信息但是为渲染的时候 loading 组件显示 -->
        <div class="loading-box box" v-show="allHasInfo && !operates.length">
          <loading></loading>
        </div>
        <!-- 当没信息的时候 no-result 组件显示 -->
        <div class="no-result-box box" v-show="!allHasInfo && !operates.length">
          <no-result></no-result>
        </div>
      </div>
      <!-- 加分项 -->
      <div class="operate-list-wrapper add" v-if="showType === 2">
        <operate-list :operates="addOperates" 
        :pull-up-load-more-txt="pullUpLoadAddMoreTxt"
        :is-loading-more="isLoadingMore"
        @onClickLoadMore="loadAddMore"
        @select="selectItem"
        @withdrawItem="withdrawItem"
        @unWithdrawItem="unWithdrawItem"></operate-list>
        <!-- 当有信息但是为渲染的时候 loading 组件显示 -->
        <div class="loading-box box" v-show="addHasInfo && !addOperates.length">
          <loading></loading>
        </div>
        <!-- 当没信息的时候 no-result 组件显示 -->
        <div class="no-result-box box" v-show="!addHasInfo && !addOperates.length">
          <no-result></no-result>
        </div>
      </div>
      <!-- 减分项 -->
      <div class="operate-list-wrapper dee" v-if="showType === 3">
        <operate-list :operates="deeOperates" 
        :pull-up-load-more-txt="pullUpLoadDeeMoreTxt"
        :is-loading-more="isLoadingMore"
        @onClickLoadMore="loadDeeMore"
        @select="selectItem"
        @withdrawItem="withdrawItem"
        @unWithdrawItem="unWithdrawItem"></operate-list>
        <!-- 当有信息但是为渲染的时候 loading 组件显示 -->
        <div class="loading-box box" v-show="deeHasInfo && !deeOperates.length">
          <loading></loading>
        </div>
        <!-- 当没信息的时候 no-result 组件显示 -->
        <div class="no-result-box box" v-show="!deeHasInfo && !deeOperates.length">
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
  import OperateList from 'base/operate-list/operate-list'
  import { getPersonalInfo } from 'api/index'
  import { getPersonalOperateInfo, withdrawOperateHistory, unWithdrawOperateHistory, getPersonalAddTypeList, getPersonalDeeTypeList, getAllADDScore, getAllDeeScore } from 'api/operate'
  import { ERR_OK, LOGIN_ERR } from 'api/config'
  import { openVn, loginFailure, findIndex } from 'common/js/util'
  import { prefixStyle } from 'common/js/dom'
  import { mapMutations } from 'vuex'
  
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
        operates: [], // 所有项
        addOperates: [], // 加分项
        deeOperates: [], // 减分项
        AllPageNum: 1, // 请求页数
        AllTotalPage: 2, // 请求总页数
        addPageNum: 1, // 请求页数
        addTotalPage: 2, // 请求总页数
        deePageNum: 1, // 请求页数
        deeTotalPage: 2, // 请求总页数
        allHasInfo: true, // 是否还有信息
        addHasInfo: true, // 是否还有信息
        deeHasInfo: true, // 是否还有信息
        detailData: null,
        showType: 1, // 显示那种类型的加减分项，1 全部，2 加分，3 减分
        isLoadingMore: false, // 是否正在加载更多信息
        pullUpLoadAllMoreTxt: '点击加载更多',
        pullUpLoadAddMoreTxt: '点击加载更多',
        pullUpLoadDeeMoreTxt: '点击加载更多',
        myScore: {
          add: 0,
          dee: 0
        }
      }
    },
    created() {
      this.probeType = 3
      this.listenScroll = true
      this._getPersonalOperateInfo()
      this._getPersonalAddTypeList()
      this._getPersonalDeeTypeList()
      this._getAllADDScore()
      this._getAllDeeScore()
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
        this.$router.push('/myOperateDetailList/myOperateDetail')
      },
      // 撤回操作
      withdrawItem(item) {
        let FIndex = findIndex(this.operates, item)
        this._withdrawOperateHistory(item)
        this.$set(this.operates[FIndex].more, 'set_failure_time', 'disabled')
      },
      // 取消撤回操作
      unWithdrawItem(item) {
        let FIndex = findIndex(this.operates, item)
        this._unWithdrawOperateHistory(item)
        this.$set(this.operates[FIndex].more, 'set_failure_time', '')
      },
      // 显示加分项
      showAddType() {
        this.showType = ADD_TYPE
        this.pageNum = 1
        this.$refs.list.scrollTo(0, 0)
      },
      // 显示减分项
      showDeeType() {
        this.showType = DEE_TYPE
        this.pageNum = 1
        this.$refs.list.scrollTo(0, 0)
      },
      // 显示所有项
      showAllType() {
        this.showType = ALL_TYPE
        this.pageNum = 1
        this.$refs.list.scrollTo(0, 0)
      },
      // 点击加载更多
      loadAllMore() {
        this._getPersonalOperateInfo(++this.AllPageNum)
      },
      loadAddMore() {
        this._getPersonalAddTypeList(++this.addPageNum)
      },
      loadDeeMore() {
        this._getPersonalDeeTypeList(++this.deePageNum)
      },
      _getPersonalOperateInfo(page) {
        this.isLoadingMore = true
        getPersonalOperateInfo(page).then((res) => {
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
          this.operates = this.operates.concat(res.data)
          this.isLoadingMore = false
        })
      },
      _getPersonalAddTypeList(page) {
        getPersonalAddTypeList(page).then((res) => {
          if(res.code === LOGIN_ERR) {
            loginFailure()
          }
          if(res.total === 0) {
            this.addHasInfo = false
          }
          this.addTotalPage = Math.ceil(res.total / res.per_page)
          if(this.addPageNum >= this.addTotalPage) {
            this.pullUpLoadAddMoreTxt = '没有更多数据了'
          }
          this.addOperates = this.addOperates.concat(res.data)
        })
      },
      _getPersonalDeeTypeList(page) {
        getPersonalDeeTypeList(page).then((res) => {
          if(res.code === LOGIN_ERR) {
            loginFailure()
          }
          if(res.total === 0) {
            this.deeHasInfo = false
          }
          this.deeTotalPage = Math.ceil(res.total / res.per_page)
          if(this.deePageNum >= this.deeTotalPage) {
            this.pullUpLoadDeeMoreTxt = '没有更多数据了'
          }
          this.deeOperates = this.deeOperates.concat(res.data)
        })
      },
      // 当操作学生积分后更新个人信息
      _getPersonalInfo() {
        getPersonalInfo().then((res) => {
          if(res.code === LOGIN_ERR) {
            loginFailure()
          }
          this.setPersonalInfo(res)
        })
      },
      _withdrawOperateHistory(item) {
        withdrawOperateHistory(item.id + '').then((res) => {
          if(res.code === ERR_OK) {
            openVn('撤回成功！')
            this._getPersonalInfo()
          } else if(res.code === LOGIN_ERR) {
            loginFailure()
          } else {
            openVn(`撤回失败！${res.msg}`, 'error')
          }
        })
      },
      _unWithdrawOperateHistory(item) {
        unWithdrawOperateHistory(item.id + '').then((res) => {
          if(res.code === ERR_OK) {
            openVn('取消撤回成功！')
            this._getPersonalInfo()
          } else if(res.code === LOGIN_ERR) {
            loginFailure()
          } else {
            openVn(`${res.msg}`, 'error')
          }
        })
      },
      _getAllADDScore() {
        getAllADDScore().then((res) => {
          this.myScore.add = res.score
        })
      },
      _getAllDeeScore() {
        getAllDeeScore().then((res) => {
          this.myScore.dee = res.score
        })
      },
      ...mapMutations({
        setPersonalInfo: 'SET_CURRENT_PERSONAL_ACCOUNT_INFO'
      })
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
          &.add
            .score
              color: #12b7f5
          &.dee
            .score
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
          .score
            margin-top: 3px
            font-size: $font-size-small
        .score-bar
          width: 100%
          .score-list
            display: flex
            text-align: center
            align-items: center
            align-content: center
            justify-content: center
            box-sizing: border-box
            .bar-item
              position: relative
              z-index: 10
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
