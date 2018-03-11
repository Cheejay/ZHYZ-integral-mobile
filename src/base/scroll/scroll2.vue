<template>
  <div ref="wrapper" class="list-wrapper">
    <div class="scroll-content">
      <slot>
        <ul class="list-content">
          <li @click="clickItem(item, $event)" 
            @touchstart.prevent="itemTouchStart"
            @touchmove.prevent="itemTouchMove"
            @touchend.prevent="itemTouchEnd"
            :class="{'disabled': !item.more.set_failure_time}"
            :key="item.id"
            class="list-item" 
            v-for="item in data">
            <div class="left">
              <p class="title">{{ item.content }}</p>
              <span class="time">{{ item.create_time | formatDate }}</span>
            </div>
            <div class="right">
              <p class="add-subtrac-score" :style="{'color': item.score > 0 ? '#12b7f5' : '#f62836'}">{{ padLeftZero(item.score) }}</p>
            </div>
            <!-- 向左划出现的操作按钮 -->
            <div class="left-slide-btn">
              <div class="withdraw-btn btn" @click.stop="withdrawItem(item)">
                <p class="text">撤回</p>
              </div>
            </div>
            <!-- cover -->
            <div class="touch-cover"></div>
          </li>
        </ul>
      </slot>
      <slot name="pullup" :pullUpLoad="pullUpLoad" :isPullUpLoad="isPullUpLoad">
        <div class="pullup-wrapper" v-if="pullUpLoad">
          <div class="before-trigger" v-if="!isPullUpLoad">
            <span>{{ pullUpTxt }}</span>
          </div>
          <div class="after-trigger" v-else>
            <loading></loading>
          </div>
        </div>
      </slot>
    </div>
    <slot name="pulldown" :pullDownRefresh="pullDownRefresh" :pullDownStyle="pullDownStyle" :beforePullDown="beforePullDown" :pulling="pulling" :bubbleY="bubbleY">
      <div ref="pulldown" class="pulldown-wrapper" :style="pullDownStyle" v-if="pullDownRefresh">
        <div class="before-trigger" v-if="beforePullDown">
          <bubble :y="bubbleY"></bubble>
        </div>
        <div class="after-trigger" v-else>
          <div v-if="pulling" class="loading">
            <loading></loading>
          </div>
          <div v-else>
            <span>{{refreshTxt}}</span>
          </div>
        </div>
      </div>
    </slot>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import Loading from 'base/loading/loading-gif'
  import Bubble from 'base/bubble/bubble'
  import { formatDate } from 'common/js/date'
  import { prefixStyle } from 'common/js/dom'

  const btnWidth = 100
  const transform = prefixStyle('transform')

  const COMPONENT_NAME = 'scroll'
  const DIRECTION_H = 'horizontal'
  const DIRECTION_V = 'vertical'
  const DEFAULT_LOAD_TXT_MORE = '加载更多'
  const DEFAULT_LOAD_TXT_NO_MORE = '没有更多数据了'
  const DEFAULT_REFRESH_TXT = '刷新成功'

  export default {
    name: COMPONENT_NAME,
    props: {
      data: {
        type: Array,
        default: function() {
          return []
        }
      },
      probeType: {
        type: Number,
        default: 1
      },
      click: {
        type: Boolean,
        default: true
      },
      listenScroll: {
        type: Boolean,
        default: false
      },
      listenBeforeScroll: {
        type: Boolean,
        default: false
      },
      direction: {
        type: String,
        default: DIRECTION_V
      },
      scrollbar: {
        type: null,
        default: false
      },
      pullDownRefresh: {
        type: null,
        default: false
      },
      pullUpLoad: {
        type: null,
        default: false
      },
      startY: {
        type: Number,
        default: 0
      },
      refreshDelay: {
        type: Number,
        default: 20
      },
      freeScroll: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        beforePullDown: true,
        isRebounding: false,
        isPullingDown: false,
        pulling: false,
        isPullUpLoad: false,
        pullUpDirty: true,
        pullDownStyle: '',
        bubbleY: 0
      }
    },
    computed: {
      pullUpTxt() {
        const moreTxt = this.pullUpLoad && this.pullUpLoad.txt && this.pullUpLoad.txt.more || DEFAULT_LOAD_TXT_MORE

        const noMoreTxt = this.pullUpLoad && this.pullUpLoad.txt && this.pullUpLoad.txt.noMore || DEFAULT_LOAD_TXT_NO_MORE

        return this.pullUpDirty ? moreTxt : noMoreTxt
      },
      refreshTxt() {
        return this.pullDownRefresh && this.pullDownRefresh.txt || DEFAULT_REFRESH_TXT
      }
    },
    created() {
      this.pullDownInitTop = -50
      this.touch = {}
    },
    mounted() {
      setTimeout(() => {
        this.initScroll()
      }, 20)
    },
    methods: {
      clickItem(item, event) {
        this.$emit('clickItem', item)
      },
      // 点击撤回按钮
      withdrawItem(item) {
        this.$emit('withdrawItem', item)
      },
      itemTouchStart(e) {
        // 开始滑动或点击
        this.touch.initiated = true
        this.touch.startX = e.touches[0].pageX
        if(e.target.className !== 'touch-cover') {
          this.touch.initiated = false
        }
      },
      itemTouchMove(e) {
        if(!this.touch.initiated) {
          return
        }
        // 手指滑动放学，向左 ← 滑为 true 反之为 false
        let touchDirection = true
        // 移动的距离
        let deltaX = e.touches[0].pageX - this.touch.startX
        if(deltaX > this.touch.deltaX && this.touch.deltaX === -btnWidth) {
          touchDirection = false
        }
        this.touch.deltaX = deltaX
        if(deltaX >= -btnWidth && touchDirection) {
          this._offset(e.target, deltaX)
        }
      },
      itemTouchEnd(e) {
        if(e.changedTouches[0].pageX === this.touch.startX || !this.touch.initiated) {
          return
        }
        // 结束滑动或点击
        this.touch.initiated = false
        // 如果结束时手指滑动 X 距离超过了 撤回按钮的宽度
        if(this.touch.deltaX <= -btnWidth / 2) {
          this.touch.deltaX = -btnWidth
        } else {
          this.touch.deltaX = 0
        }
        if(this.touch.deltaX <= 0 && this.touch.deltaX >= -btnWidth) {
          this._offset(e.target, this.touch.deltaX)
        }
        // this.touch.endX = e.touches[0].pageX
      },
      padLeftZero(num) {
        return num > 0 ? `+${num}` : num
      },
      initScroll() {
        if(!this.$refs.wrapper) {
          return
        }

        let options = {
          probeType: this.probeType,
          click: this.click,
          scrollY: this.freeScroll || this.direction === DIRECTION_V,
          scrollX: this.freeScroll || this.direction === DIRECTION_H,
          scrollbar: this.scrollbar,
          pullDownRefresh: this.pullDownRefresh,
          pullUpLoad: this.pullUpLoad,
          startY: this.startY,
          freeScroll: this.freeScroll
        }

        this.scroll = new BScroll(this.$refs.wrapper, options)

        if(this.listenScroll) {
          this.scroll.on('scroll', (pos) => {
            this.$emit('scroll', pos)
          })
        }

        if(this.listenBeforeScroll) {
          this.scroll.on('beforeScrollStart', () => {
            this.$emit('beforeScrollStart')
          })
        }

        if(this.pullDownRefresh) {
          this._initPullDownRefresh()
        }

        if(this.pullUpLoad) {
          this._initPullUpLoad()
        }
      },
      disable() {
        this.scroll && this.scroll.disable()
      },
      enable() {
        this.scroll && this.scroll.enable()
      },
      refresh() {
        this.scroll && this.scroll.refresh()
      },
      scrollTo() {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElement() {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      },
      destroy() {
        this.scroll.destroy()
      },
      forceUpdate(dirty) {
        if(this.pullDownRefresh && this.isPullingDown) {
          this.pulling = false
          this._reboundPullDown().then(() => {
            this._afterPullDown()
          })
        } else if(this.pullUpLoad && this.isPullUpLoad) {
          this.isPullUpLoad = false
          this.scroll.finishPullUp()
          this.pullUpDirty = dirty
          this.refresh()
        } else {
          this.refresh()
        }
      },
      // 设置操作按钮的 X 值
      _offset(el, deltaX) {
        el.parentNode.style[transform] = `translateX(${deltaX}px)`
      },
      _initPullDownRefresh() {
        this.scroll.on('pullingDown', () => {
          this.beforePullDown = false
          this.isPullingDown = true
          this.pulling = true
          this.$emit('pullingDown')
        })

        this.scroll.on('scroll', (pos) => {
          if(this.beforePullDown) {
            this.bubbleY = Math.max(0, pos.y + this.pullDownInitTop)
            this.pullDownStyle = `top:${Math.min(pos.y + this.pullDownInitTop, 10)}px`
          } else {
            this.bubbleY = 0
          }

          if(this.isRebounding) {
            this.pullDownStyle = `top:${10 - (this.pullDownRefresh.stop - pos.y)}px`
          }
        })
      },
      _initPullUpLoad() {
        this.scroll.on('pullingUp', () => {
          this.isPullUpLoad = true
          this.$emit('pullingUp')
        })
      },
      _reboundPullDown() {
        const { stopTime = 600 } = this.pullDownRefresh
        return new Promise((resolve) => {
          setTimeout(() => {
            this.isRebounding = true
            this.scroll.finishPullDown()
            this.isPullingDown = false
            resolve()
          }, stopTime)
        })
      },
      _afterPullDown() {
        setTimeout(() => {
          this.pullDownStyle = `top:${this.pullDownInitTop}px`
          this.beforePullDown = true
          this.isRebounding = false
          this.refresh()
        }, this.scroll.options.bounceTime)
      }
    },
    watch: {
      data() {
        setTimeout(() => {
          this.forceUpdate(true)
        }, this.refreshDelay)
      }
    },
    filters: {
      formatDate(time) {
        time += '000'
        time = parseInt(time)
        let date = new Date(time)

        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      }
    },
    components: {
      Loading,
      Bubble
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .list-wrapper
    position: absolute
    left: 0
    top: 0
    right: 0
    bottom: 0
    overflow: hidden
    .list-content
      position: relative
      z-index: 10
      background: #fff
      .list-item
        position: relative
        display: flex
        align-items: center
        justify-content: space-between
        height: 60px
        padding: 0 0 0 20px
        border-bottom: 1px solid #e5e5e5
        transition: all .3s ease
        &.disabled
          color: #d8d6d6
          p
            color: #d8d6d6 !important
        .left
          flex: 0 0 85%
          width: 85%
          .title
            margin-bottom: 2px
            text-overflow: ellipsis
            overflow: hidden
            white-space: nowrap
          .time
            font-size: 10px
        .right
          flex: 0 0 15%
          width: 15%
          text-align: center
          .add-subtrac-score
            font-size: 16px
        .left-slide-btn
          flex: 1
          height: 100%
          .btn
            display: flex
            align-items: center
            justify-content: center
            width: 100px
            height: 100%
            text-align: center
            background-color: #FF6700
            .text
              color: #FFF
              font-size: 18px
        .touch-cover
          position: absolute
          top: 0
          left: 0
          width: 100%
          height: 100%
  .pulldown-wrapper
    position: absolute
    width: 100%
    left: 0
    display: flex
    justify-content center
    align-items center
    transition: all
    .after-trigger
      margin-top: 10px

  .pullup-wrapper
    width: 100%
    display: flex
    justify-content center
    align-items center
    padding: 16px 0
</style>
