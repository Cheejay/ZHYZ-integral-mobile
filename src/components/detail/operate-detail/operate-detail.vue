<template>
  <transition name="slide">
    <div class="operate-detail">
      <sub-header :titleText="title"></sub-header>
      <div class="detail-containe">
        <!-- 操作详情信息 -->
        <ul class="operate-detail-group basic" v-if="detailData">
          <!-- 操作类型 -->
          <li class="item">
            <p class="title">
              <i class="zhyz-type"></i>
              操作类型
            </p>
            <p class="text">{{ detailData.type }}</p>
          </li>
          <!-- 操作者 -->
          <li class="item">
            <p class="title">
              <i class="zhyz-Man"></i>
              操作者
            </p>
            <p class="text">{{ detailData.from_user.name }}</p>
          </li>
          <!-- 被操作者 -->
          <li class="item" v-if="detailData.to_user">
            <p class="title">
              <i class="zhyz-icontab04"></i>
              被操作者
            </p>
            <p class="text">{{ detailData.to_user.name }}</p>
          </li>
          <!-- 被操作班 -->
          <li class="item" v-if="detailData.to_cls">
            <p class="title">
              <i class="zhyz-icontab04"></i>
              被操作班
            </p>
            <p class="text">{{ detailData.to_cls.name }}</p>
          </li>
          <!-- 内容 -->
          <li class="item">
            <p class="title">
              <i class="zhyz-neirongyingxiao"></i>
              内容
            </p>
            <p class="text">{{ detailData.content }}</p>
          </li>
          <!-- 加减个人分数 -->
          <li class="item">
            <p class="title">
              <i class="zhyz-neirongyingxiao"></i>
              加减个人分数
            </p>
            <p class="text">{{ padLeftZero(detailData.score) }}</p>
          </li>
          <!-- 加减班级分数 -->
          <li class="item">
            <p class="title">
              <i class="zhyz-neirongyingxiao"></i>
              加减班级分数
            </p>
            <p class="text">{{ padLeftZero(detailData.cls_score) }}</p>
          </li>
          <!-- 操作时间 -->
          <li class="item">
            <p class="title">
              <i class="zhyz-time"></i>
              操作时间
            </p>
            <p class="text time">{{ detailData.op_time | formatDate }}</p>
          </li>
          <!-- 创建时间 -->
          <li class="item">
            <p class="title">
              <i class="zhyz-time"></i>
              创建时间
            </p>
            <p class="text time">{{ detailData.create_time | formatDate }}</p>
          </li>
          <!-- 是否使用拓展积分 -->
          <li class="item">
            <p class="title">
              <i class="zhyz-tuozhan"></i>
              使用拓展积分
            </p>
            <p class="text time">{{ isUseExtraScoreText }}</p>
          </li>
        </ul>
      </div>
    </div>
  </transition>
</template>

<script>
  import SubHeader from 'base/sub-header/sub-header'
  import { formatDate } from 'common/js/date'

  export default {
    props: {
      detailData: {
        type: Object,
        default: null
      },
      title: {
        type: String,
        default: '操作详情'
      }
    },
    created() {
      if(!this.detailData) {
        this.$router.back()
      }
      console.log(this.detailData)
    },
    methods: {
      // 补全分数左边的符号（+ -）
      padLeftZero(num) {
        return num > 0 ? `+${num}` : num
      }
    },
    computed: {
      isUseExtraScoreText() {
        return this.detailData.more.use_score_type === 1 ? '是' : '否'
      }
    },
    filters: {
      formatDate(time) {
        time += '000'
        time = parseInt(time)
        let date = new Date(time)

        return formatDate(date, 'yyyy-MM-dd hh:mm')
      }
    },
    components: {
      SubHeader
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  .operate-detail
    position: fixed
    top: 0
    left: 0
    z-index: 150
    width: 100%
    height: 100%
    background-color: $color-background
    .operate-detail-group
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
        &:first-child
          border-top: 1px solid $color-border
        &:active
          background-color: $color-background
        &.exit
          text-align: center              
          .title
            color: $color-sub-theme
        .title
          flex: 0 0 120px
          color: #000
          i
            font-size: $font-size-large
        .text
          flex: 1
          text-align: right
          color: $color-text-l
          &.time
            font-size: $font-size-medium
  .slide-enter-active, .slide-leave-active {
    transition: all .5s
  }
  .slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0)
  }
</style>

