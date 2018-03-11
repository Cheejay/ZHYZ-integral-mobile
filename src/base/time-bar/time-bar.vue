<template>
  <div class="time-bar">
    <div class="time-wrapper" ref="timeWrapper">
      <ul class="time-list" ref="timeList">
        <li @click="selectItem(item, index)" :class="{'active': activeIndex === index}" class="time-item" v-for="(item, index) in timeList">第{{ item.week }}周</li>
      </ul>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'

  export default {
    props: {
      timeList: { // 时间列表
        type: Array,
        default: null
      }
    },
    data() {
      return {
        activeIndex: 0
      }
    },
    created() {
      this.$nextTick(() => {
        this._initBar()
      })
    },
    methods: {
      // 当时间选择项被点击时
      selectItem(item, index) {
        this.activeIndex = index
        this.$emit('clickItem', item)
      },
      // 时间选择项横向滚动初始化
      _initBar() {
				if(this.timeList) {
					let timeWidth = 70 // 单个时间选择项的宽度
					let margin = 0 // 时间选择项的右间距
					let width = (timeWidth + margin) * this.timeList.length - margin // ul 的总宽度

					this.$refs.timeList.style.width = width + 'px'
					if(!this.timeScroll) {
						this.timeScroll = new BScroll(this.$refs.timeWrapper, {
							scrollX: true,
							eventPassthrough: 'vertical',
							bounceTime: 400
						})
					}
				}
			}
    }
  }
</script>

<style lang="stylus">
  @import "~common/stylus/variable"

  .time-bar
    .time-wrapper
      width: 100%
      overflow: hidden
      white-space: nowrap
      background-color: $color-background-d
      .time-list
        font-size: 0
        background-color: $color-background-d
        .time-item
          display: inline-block
          width: 70px
          height: 45px
          line-height: 40px
          text-align: center
          font-size: 14px
          box-sizing: border-box
          border-bottom: 0px solid $color-text-e
          transition: all .1s
          &.active
            border-width: 2px
</style>
