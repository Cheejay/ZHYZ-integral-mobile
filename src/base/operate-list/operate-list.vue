<template>
  <div class="operate-list">
    <ul class="list-content">
      <!-- 教师 and 管理员 -->
      <li @click="selectItem(item, $event)" 
        @touchstart.prevent="itemTouchStart"
        @touchmove.prevent="itemTouchMove"
        @touchend.prevent="itemTouchEnd"
        :class="{'disabled': item.more.set_failure_time}"
        :key="item.id"
        class="list-item" 
        v-if="personalInfo.user_type === '管理员' || personalInfo.user_type === '教师'"
        v-for="item in operates">
        <div class="left">
          <p class="title">{{ item.content }}</p>
          <span class="klass">{{ item.to_cls.name }}</span>
          <span class="name">{{ item.to_user.name }}</span>
          <span class="time">{{ item.create_time | formatDate }}</span>
        </div>
        <div class="right">
          <p class="add-subtrac-score" :style="{'color': item.score > 0 ? '#12b7f5' : '#f62836'}">{{ padLeftZero(item.score) }}</p>
        </div>
        <!-- 向左划出现的操作按钮 -->
        <div class="left-slide-btn">
          <div class="withdraw-btn btn" @click.stop="withdrawItem(item, $event)">
            {{ item.more.set_failure_time ? '取消撤回' : '撤回' }}
          </div>
        </div>
        <!-- cover -->
        <div class="touch-cover"></div>
      </li>
      <!-- 学生 -->
      <li @click="selectItem(item, $event)" 
        :key="item.id"
        class="list-item" 
        :class="{'disabled': item.more.set_failure_time}"
        v-if="personalInfo.user_type === '学生'"
        v-for="item in operates">
        <div class="left">
          <p class="title">{{ item.content }}</p>
          <span class="klass">{{ item.to_cls.name }}</span>
          <span class="name">{{ item.to_user.name }}</span>
          <span class="time">{{ item.create_time | formatDate }}</span>
        </div>
        <div class="right">
          <p class="add-subtrac-score" :style="{'color': item.score > 0 ? '#12b7f5' : '#f62836'}">{{ padLeftZero(item.score) }}</p>
        </div>
      </li>
      <!-- 点击加载按钮 -->
      <div class="more" v-show="operates.length" @click="loadMore">
        <img src="./loading.gif" 
          v-show="isLoadingMore"
          class="loading-img" 
          width="15" 
          height="15">
        <span class="loading-text">{{ pullUpLoadMoreTxt }}</span>
      </div>
    </ul>
  </div>
</template>

<script>
  import { formatDate } from 'common/js/date'
  import { prefixStyle } from 'common/js/dom'
  import { mapGetters } from 'vuex'

  // 撤回按钮宽度
  const withdrawBtnWidth = 100
  // 为浏览器加个前缀
  const transform = prefixStyle('transform')

  export default {
    props: {
      operates: {
        type: Array,
        default: []
      },
      pullUpLoadMoreTxt: {
        type: String,
        default: '点击加载更多'
      },
      isLoadingMore: {
        type: Boolean,
        default: false
      }
    },
    created() {
      this.touch = {}
    },
    methods: {
      selectItem(item, event) {
        this.$emit('select', item)
      },
      // 点击撤回按钮
      withdrawItem(item, e) {
        if(!item.more.set_failure_time) {
          this.$emit('withdrawItem', item)
        } else {
          this.$emit('unWithdrawItem', item)
        }
        this._offset(e.target.parentNode, 0)
      },
      // 点击加载
      loadMore() {
        if(this.pullUpLoadMoreTxt !== '点击加载更多') {
          return
        }
        this.$emit('onClickLoadMore')
      },
      // touch start
      itemTouchStart(e) {
        // 开始滑动或点击
        this.touch.initiated = true
        this.touch.startX = e.touches[0].pageX
        if(e.target.className !== 'touch-cover') {
          this.touch.initiated = false
        }
      },
      // touch move
      itemTouchMove(e) {
        if(!this.touch.initiated) {
          return
        }
        // 手指滑动放学，向左 ← 滑为 true 反之为 false
        let touchDirection = true
        // 移动的距离
        let deltaX = e.touches[0].pageX - this.touch.startX
        if(deltaX > this.touch.deltaX && this.touch.deltaX === -withdrawBtnWidth) {
          touchDirection = false
        }
        this.touch.deltaX = deltaX
        if(deltaX >= -withdrawBtnWidth && touchDirection) {
          this._offset(e.target, deltaX)
        }
      },
      // touch end
      itemTouchEnd(e) {
        if(e.changedTouches[0].pageX === this.touch.startX || !this.touch.initiated) {
          return
        }
        // 结束滑动或点击
        this.touch.initiated = false
        // 如果结束时手指滑动 X 距离超过了 撤回按钮的一半 - 5 宽度
        if(this.touch.deltaX <= -withdrawBtnWidth / 2 - 5) {
          this.touch.deltaX = -withdrawBtnWidth
        } else {
          this.touch.deltaX = 0
        }
        if(this.touch.deltaX <= 0 && this.touch.deltaX >= -withdrawBtnWidth) {
          this._offset(e.target, this.touch.deltaX)
        }
        // this.touch.endX = e.touches[0].pageX
      },
      // 补全分数左边的符号（+ -）
      padLeftZero(num) {
        return num > 0 ? `+${num}` : num
      },
      // 设置操作按钮的 X 值
      _offset(el, deltaX) {
        el.parentNode.style[transform] = `translateX(${deltaX}px)`
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
    computed: {
      ...mapGetters([
        'personalInfo'
      ])
    }
  }
</script>

<style lang="stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .operate-list
    .list-content
      position: relative
      background: #fff
      .more
        padding: 15px 0
        text-align: center
        background-color: $color-background-d
        .loading-img
          vertical-align: middle
        .loading-text
          font-size: $font-size-medium
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
          .name, .klass
            font-size: 12px
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
            width: 100px
            height: 100%
            line-height: 60px
            text-align: center
            background-color: #FF6700
            color: #FFF
            font-size: 18px
        .touch-cover
          position: absolute
          top: 0
          left: 0
          width: 100%
          height: 100%
</style>
