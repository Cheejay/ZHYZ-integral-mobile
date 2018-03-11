<template>
  <scroll class="listview" 
      :data="data" 
      ref="listview" 
      @scroll="scroll"
      :probeType="probeType"
      :listenScroll="listenScroll">
    <ul>
      <li v-for="group in data" class="list-group" :key="group.id" ref="listGroup">
        <h2 class="list-group-title">{{ group.title }}</h2>
        <ul>
          <li v-for="item in group.items" 
            @click.prevent.stop="selectItem(item, $event)"
            @touchstart.prevent="onItemTouchStart"
            @touchend.prevent="onItemTouchEnd"
            :key="item.id" 
            class="list-group-item">
            <p class="multiple-choice"
              :class="{'selected': isHasSameId(item) > -1}"
              v-show="canMultipleChoice && isMultiple"></p>
            <!-- <img v-lazy="item.avatar" class="avatar"> -->
            <!-- <div class="avatar">
              <i class="zhyz-avatar-male" v-show="item.sex === '男'"></i>
              <i class="zhyz-avatar-female" v-show="item.sex === '女'"></i>
            </div> -->
            <p class="name">{{ item.name }}</p>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" 
        v-show="data.length"
        @touchstart="onShortcutTouchStart" 
        @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item, index) in shortcutList" 
          :key="item.id"
          class="item" 
          :class="{'current': currentIndex === index}"
          :data-index="index">{{ item }}</li>
      </ul>
    </div>

    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h1 class="fixed-title">{{ fixedTitle }}</h1>
    </div>
    <transition name="fade-top">
      <!-- 多选顶部操作栏 -->
      <div class="top-multiple-operate" v-show="isMultiple">
        <div class="select-cancel">
          <i class="zhyz-delete" @click="cancelMultipleChoice"></i>
        </div>
        <p class="select-count">{{ selectedStudentList.length }} 个学生被选择</p>
        <div class="btn">
          <p class="select-all" @click="selectAll">
            <i class="icon zhyz-quanxuan"></i>
            全选
          </p>
          <p class="select-confirm" @click="selectConfirm">
            <i class="icon zhyz-seiyw33"></i>
            确认
          </p>
        </div>
      </div>
    </transition>
    <div v-show="!data.length" class="loading-container">
      <loading :title="'别急！数据马上出来！'"></loading>
    </div>
  </scroll>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import { getData } from 'common/js/dom'

  const ANCHOR_HEIGHT = 18
  const TITLE_HEIGHT = 30
  // 出现多选删除得时间
  const HOLD_TOUCH_TIME = 0.7

  export default {
    props: {
      data: {
        type: Array,
        default: []
      },
      canMultipleChoice: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        scrollY: -1,
        currentIndex: 0,
        diff: -1,
        itemTime: null,
        isMultiple: false,
        selectCountList: [],
        selectedStudentList: []
      }
    },
    created() {
      this.touch = {}
      this.listenScroll = true
      this.listHeight = []
      this.probeType = 3
    },
    mounted() {
      this._countingItmes()
    },
    computed: {
      // 右边快速滑条数值（只有一个）
      shortcutList() {
        return this.data.map((group) => {
          return group.title.substr(0, 1)
        })
      },
      fixedTitle() {
        if(this.scrollY > 0) {
          return ''
        }
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
      }
    },
    methods: {
      // 当点击了单个元素之后
      selectItem(item, event) {
        if(this.isMultiple) {
          // 如果包含此类
          let FIndex = this.isHasSameId(item)
          if(FIndex !== -1) {
            // 把该元素的索引找出来并删除
            this.selectedStudentList.splice(FIndex, 1)
            // 如果没有学生被选择（只剩一个人的时候取消选择），则退出多选模式
            if(this.selectedStudentList.length === 0) {
              this.cancelMultipleChoice()
              return
            }
          } else {
            // 加入到最终返回的数组里
            this.selectedStudentList.push({
              id: item.id,
              name: item.name
            })
          }
        } else {
          this.$emit('select', item)
        }
      },
      // 选择全部
      selectAll() {
        // 如果之前没有全部选择
        let stuLen = this.selectCountList.length
        if(this.selectedStudentList.length < stuLen) {
          this.selectCountList.forEach((item) => {
            // 如果列表内没有此条数据（-1 代表没有）
            let FIndex = this.isHasSameId(item)
            if(FIndex === -1) {
              // 把全部学生都加进选择列表去
              this.selectedStudentList.push({
                id: item.id,
                name: item.name
              })
            }
          })
        } else { // 如果之前全部选择了
          this.cancelMultipleChoice()
          // this.selectedStudentList = []
        }
      },
      // 确认选择
      selectConfirm() {
        this.$emit('onMultipleSelectConfirm', this.selectedStudentList)
      },
      // 联动选择，判断最终列表是否包含此条数据
      isHasSameId(newItem) {
        return this.selectedStudentList.findIndex((item) => {
          return item.id === newItem.id
        })
      },
      // 判断是否需要长按选择
      onItemTouchStart() {
        this.itemTime = setTimeout(() => {
          if(this.canMultipleChoice) {
            this.isMultiple = true
            this.$emit('onItemMultipleChoice', true)
          }
        }, HOLD_TOUCH_TIME * 1000)
      },
      onItemTouchEnd() {
        clearTimeout(this.itemTime)
      },
      // 点击跳转到相应的区块（如点 Z 跳到 Z 姓歌手的区域）
      onShortcutTouchStart(e) {
        let anchorIndex = getData(e.target, 'index')
        let firstTouch = e.touches[0]
        this.touch.y1 = firstTouch.pageY
        this.touch.anchorIndex = anchorIndex

        this._scrollTo(anchorIndex)
      },
      // 持续滑动跳转到相应的区块
      onShortcutTouchMove(e) {
        let firstTouch = e.touches[0]
        this.touch.y2 = firstTouch.pageY
        let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
        let anchorIndex = parseInt(this.touch.anchorIndex) + delta

        this._scrollTo(anchorIndex)
      },
      // 取消多选模式
      cancelMultipleChoice() {
        this.isMultiple = false
        this.selectedStudentList = []
        this.$emit('onItemMultipleChoice', false)
      },
      // 监听滚动事件
      scroll(pos) {
        this.scrollY = pos.y
      },
      refresh() {
        this.$refs.listview.refresh()
      },
      // 点击字母跳到相应的区块
      _scrollTo(index) {
        if(!index && index !== 0) {
          return
        }
        if(index < 0) {
          index = 0
        } else if(index > this.listHeight.length - 2) {
          index = this.listHeight.length - 2
        }
        this.scrollY = -this.listHeight[index]
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
      },
      // 计算有多少个元素
      _countingItmes() {
        this.data.forEach((item, index) => {
          item.items.forEach((cItem, cIndex) => {
            this.selectCountList.push({
              id: cItem.id,
              name: cItem.name
            })
          })
        })
      },
      // 计算每个区块的高度
      _calculateHeight() {
        this.listHeight = []
        const list = this.$refs.listGroup
        let height = 0
        this.listHeight.push(height)
        for(let i = 0; i < list.length; i++) {
          let item = list[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      }
    },
    watch: {
      data() {
        setTimeout(() => {
          this._calculateHeight()
          this._countingItmes()
        }, 20)
      },
      scrollY(newY) {
        const listHeight = this.listHeight
        // 当滚动到顶部 newY > 0
        if(newY > 0) {
          this.currentIndex = 0
          return
        }

        // 在中间部分滚动
        for(let i = 0; i < listHeight.length - 1; i++) {
          let height1 = listHeight[i]
          let height2 = listHeight[i + 1]
          if(-newY >= height1 && -newY < height2) {
            this.currentIndex = i
            this.diff = height2 + newY
            return
          }
        }
        // 当滚动到底部，且 -newY > 最后一个元素的上限
        this.currentIndex = listHeight.length - 2
      },
      diff(newVal) {
        let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
        if(this.fixedTop === fixedTop) {
          return
        }
        this.fixedTop = fixedTop
        this.$refs.fixed.style.transform = `translate3d(0, ${fixedTop}px, 0`
      }
    },
    components: {
      Scroll,
      Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background-d
    .list-group
      &:last-child
        .list-group-item
          &:last-child
            padding-bottom: 80px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text
        background: $color-background
      .list-group-item
        position: relative
        display: flex
        align-items: center
        padding: 14px 0 14px 30px
        border-top: 1px solid $color-border
        &:active
          background-color: rgba(0, 0, 0, .1)
        .avatar
          width: 30px
          height: 30px
          border-radius: 50%
        .multiple-choice
          width: 16px
          height: 16px
          box-sizing: border-box
          border-radius: 4px
          border: 1px solid $color-border
          transition: all .3s
          &.selected
            border: none
            box-shadow: 0 3px 6px rgba(0, 0, 0, .1)
            background-color: #5b97fb
        .name
          margin-left: 15px
          padding: 2px 0
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 50
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-text-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-a
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: #111
        background: $color-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
    .top-multiple-operate
      position: fixed
      top: 0
      display: flex
      align-items: center
      justify-content: center
      z-index: 55
      width: 100%
      height: 50px
      color: $color-text-a
      background-color: #5b97fb
      transition: all .3s
      &.fade-top-enter, &.fade-top-leave-active
        opacity: 0
      .select-cancel
        flex: 0 0 50px
        width: 50px
        text-align: right
        font-size: $font-size-huge
        i
          display: inline-block
          padding: 10px
      .select-count
        flex: 1
        text-align: center
      .btn
        flex: 1
        font-size: 0
        p
          display: inline-block
          width: 50%
          box-sizing: border-box
          text-align: center
          font-size: $font-size-medium
          .icon
            display: block
            padding-bottom: 2px
            font-size: $font-size-large-x
</style>
