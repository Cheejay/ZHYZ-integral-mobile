<template>
  <div class="mesystem">
    <sub-header :titleText="clsName + '十项常规'" 
      :is-show-close-icon="false"
      ></sub-header>
    <div class="mesystem-container">
      <!-- 时间选择 -->
      <time-bar @clickItem="weekSelect" 
        v-if="weekList.week_list" 
        :time-list="weekList.week_list"></time-bar>
      <!-- 选择星期几 -->
      <scroll :data="weekDays" 
        v-if="weekDays"
        class="mesystem-scroll">
        <ul class="day-of-the-week">
          <li class="item" 
            v-if="weekDays.length && index < 5"
            v-for="(item, index) in weekDays" 
            @click.prevent.stop="daySelect(index)">
            <p class="title">
              星期{{ item.day }}
              <span class="score">{{ item.totalScore }}</span>
            </p>
            <div class="mask"></div>
          </li>
          <li class="item total" @click="sumClick">
            <p class="title">
              本周总分
              <span class="score">{{ weekTotalScore }}</span>
            </p>
            <p class="title">
              本周平均分
              <span class="score">{{ weekAverageScore }}</span>
            </p>
            <div class="mask"></div>
          </li>
        </ul>
      </scroll>
    </div>
    <transition name="slide">
      <router-view :field="field" 
        :day-data="dayData"
        :cls-id="clsId"
        :begin-time="dayBeginTime"
        :title="`第${week}周 星期${weekDays[dayIndex].day}`"></router-view>
    </transition>
  </div>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  import TimeBar from 'base/time-bar/time-bar'
  import SubHeader from 'base/sub-header/sub-header'
  import { getWeekList, getClsMesystem } from 'api/mesystem'

  export default {
    props: {
      clsId: {
        type: Number,
        default: 0
      },
      clsName: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        weekList: {},
        beginTime: 0,
        endTime: 0,
        dayBeginTime: 0,
        meData: null,
        dayData: null,
        week: 0,
        field: null,
        dayIndex: 0,
        weekDays: []
      }
    },
    created() {
      if(!this.clsId) {
        this.$router.back()
      }
      this._getWeekList()
    },
    methods: {
      // 选择第几周之后
      weekSelect(item) {
        this.beginTime = item.begin_time // 改变后这个星期的开始时间戳
        this.endTime = item.end_time // 改变后这个星期的结束时间戳
        this.week = item.week

        this._getClsMesystem()
      },
      // 选择了星期几之后
      daySelect(index) {
        this.dayIndex = index // 保存点击了 星期几的索引
        // 把点击的星期几的数据，传给子组件
        this.dayData = this.meData[this.beginTime + this.dayIndex * 86400]
        // 星期几的开始时间
        this.dayBeginTime = this.beginTime + this.dayIndex * 86400
        
        this.$router.push('/mesystem/subitem')
      },
      // 点击了这星期的总分
      sumClick() {
        
      },
      // 初始化每天的总分
      _initWeekdayScore(data) {
        // 本星期每天的分数
        let tmpDayArr = ['一', '二', '三', '四', '五']
        let tmpArr = Object.keys(data)
        let i = 0
        this.weekDays = []
        for(let key of tmpArr) {
          this.weekDays.push({
            day: tmpDayArr[i],
            totalScore: data[key].sum
          })
          i++
        }
      },
      // 获取星期列表
      _getWeekList() {
        getWeekList().then((res) => {
          Object.assign(this.weekList, res)
          this.weekList.week_list.reverse() // 反转星期，从当前星期开始
          this.beginTime = this.weekList.week_list[0].begin_time // 这星期的开始时间戳
          this.endTime = this.weekList.week_list[0].end_time // 这星期的结束时间戳
          this.week = this.weekList.week_list[0].week

          // 获取时间戳后执行获取常规信息
          this._getClsMesystem()
        })
      },
      // 根据传入的时间戳（星期数）获取常规信息
      _getClsMesystem() {
        getClsMesystem(this.clsId, this.beginTime, this.endTime).then((res) => {
          this._initWeekdayScore(res.data)

          this.field = res.field
          this.meData = res.data
        })
      }
    },
    computed: {
      // 本星期的总分
      weekTotalScore() {
        let totalScore = 0
        for(let key in this.meData) {
          totalScore += this.meData[key].sum
        }
        return (totalScore - 200).toFixed(2)
      },
      // 本星期的平均分
      weekAverageScore() {
        let totalScore = 0
        for(let key in this.meData) {
          totalScore += this.meData[key].sum
        }
        return ((totalScore - 200) / 5).toFixed(2)
      }
    },
    components: {
      Scroll,
      TimeBar,
      SubHeader
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  .mesystem
    position: fixed
    top: 0
    bottom: 0
    left: 0
    right: 0
    z-index: 100
    background-color: $color-background
    .mesystem-container
      height: 100%
      .mesystem-scroll
        height: 100%
        overflow: hidden
        .day-of-the-week
          overflow: hidden
          padding: 20px 20px 100px
          font-size: 0
          .item
            position: relative
            z-index: 10
            display: inline-block
            padding: 20px
            width: calc(48% - 40px)
            height: 110px
            margin-bottom: 10px
            border-radius: 3px
            vertical-align: top
            background-size: 100% 100%
            background-position: center center
            &.total
              background-image: url('./Total.jpg')
              .title
                top: 30%
                margin-bottom: 10px
            &:not(:nth-child(2n))
              margin-right: 4%
            &:nth-child(1)
              background-image: url('./Mon.jpg')
            &:nth-child(2)
              background-image: url('./Tue.jpg')
            &:nth-child(3)
              background-image: url('./Wed.jpg')
            &:nth-child(4)
              background-image: url('./Thu.jpg')
            &:nth-child(5)
              background-image: url('./Fri.jpg')
            .title
              position: relative
              top: 50%
              left: 50%
              transform: translate3d(-50%, -50%, 0)
              z-index: 12
              font-size: 20px
              text-align: center
              color: $color-text-a
              .score
                display: block
                margin-top: 10px
                font-size: 14px
            .mask
              position: absolute
              top: 0
              left: 0
              border-radius: 3px
              z-index: 11
              width: 100%
              height: 100%
              background-color: rgba(0, 0, 0, .55)
</style>
