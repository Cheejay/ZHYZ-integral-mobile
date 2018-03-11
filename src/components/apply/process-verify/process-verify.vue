<template>
  <transition name="slide">
    <div class="apply-detail">
      <sub-header :titleText="title" back-place="/me"></sub-header>
      <div class="detail-containe">
        <!-- 申请详情信息 -->
        <ul class="apply-detail-group basic" v-if="detailData">
          <!-- 申请类型 -->
          <li class="item">
            <p class="title">
              <i class="zhyz-type"></i>
              申请类型
            </p>
            <p class="text">{{ detailData.type }}</p>
          </li>
          <!-- 申请者 -->
          <li class="item">
            <p class="title">
              <i class="zhyz-Man"></i>
              申请者
            </p>
            <p class="text">{{ detailData.from_user.name }}</p>
          </li>
          <!-- 班级 -->
          <li class="item" v-if="detailData.to_cls">
            <p class="title">
              <i class="zhyz-icontab04"></i>
              班级
            </p>
            <p class="text">{{ detailData.to_cls.name }}</p>
          </li>
          <!-- 申请开始时间 -->
          <li class="item">
            <p class="title">
              <i class="zhyz-time"></i>
              申请开始时间
            </p>
            <p class="text time">{{ detailData.op_time | formatDate }}</p>
          </li>
          <!-- 申请结束时间 -->
          <li class="item">
            <p class="title">
              <i class="zhyz-time"></i>
              申请结束时间
            </p>
            <p class="text time">{{ detailData.create_time | formatDate }}</p>
          </li>
          <!-- 申请原因 -->
          <li class="item">
            <p class="title">
              <i class="zhyz-neirongyingxiao"></i>
              申请原因
            </p>
            <p class="text">{{ detailData.content }}</p>
          </li>
        </ul>
        <ul class="apply-detail-group basic">
          <!-- 申请类型 -->
          <li class="item">
            <p class="title">
              <i class="zhyz-type"></i>
              申请类型
            </p>
            <p class="text">病假</p>
          </li>
          <!-- 申请者 -->
          <li class="item">
            <p class="title">
              <i class="zhyz-Man"></i>
              申请者
            </p>
            <p class="text">雷江</p>
          </li>
          <!-- 班级 -->
          <li class="item">
            <p class="title">
              <i class="zhyz-icontab04"></i>
              班级
            </p>
            <p class="text">软件151</p>
          </li>
          <!-- 申请开始时间 -->
          <li class="item">
            <p class="title">
              <i class="zhyz-time"></i>
              申请开始时间
            </p>
            <p class="text time">2018-03-11 8:00</p>
          </li>
          <!-- 申请结束时间 -->
          <li class="item">
            <p class="title">
              <i class="zhyz-time"></i>
              申请结束时间
            </p>
            <p class="text time">2018-03-12 8:00</p>
          </li>
          <!-- 申请原因 -->
          <li class="item multiple">
            <p class="title">
              <i class="zhyz-neirongyingxiao"></i>
              申请原因
            </p>
            <p maxlength="200" class="reason-input" placeholder="请输入请假事由">今天早上突然发烧，需要在家休息一天</p>
          </li>
        </ul>
        <!-- 是否同意 -->
        <div class="submit-item">
          <button type="button" @click="typeReason(1)" class="submit-btn allow">同意</button>
          <button type="button" @click="typeReason(2)" class="submit-btn reject">拒绝</button>
        </div>
        <!-- 最终意见框（不管点击同意还是拒绝都会显示） -->
        <reason-confirm :is-show-reason-confirm="isShowReasonConfirm"
          :title-text="purpose"
          @hideReasonConfirm="hideReasonConfirm"
          @confirmed="confirmed"></reason-confirm>
      </div>
      <router-view></router-view>
    </div>
  </transition>
</template>

<script>
  import SubHeader from 'base/sub-header/sub-header'
  import ReasonConfirm from 'base/reason-confirm/reason-confirm'
  import { approvalApply } from 'api/apply'
  import { formatDate } from 'common/js/date'

  export default {
    props: {
      detailData: {
        type: Object,
        default: null
      },
      title: {
        type: String,
        default: '申请详情'
      }
    },
    data() {
      return {
        leaveId: 1,
        purpose: 2, // 最终意向（同意还是拒绝）
        isShowReasonConfirm: false
      }
    },
    created() {
      if(!this.detailData) {
        // this.$router.back()
      }
      console.log(this.detailData)
    },
    methods: {
      typeReason(isAllow) {
        this.isShowReasonConfirm = true // 显示意见框
        this.purpose = isAllow // 是否同意
      },
      hideReasonConfirm() {
        this.isShowReasonConfirm = false // 隐藏意见框
      },
      confirmed(reason) { // 最终确认
        this.hideReasonConfirm()
        this.$router.push('/apply/processDisease/processVerify/processSuccess')
        this._approvalApply(reason)
      },
      // 补全分数左边的符号（+ -）
      padLeftZero(num) {
        return num > 0 ? `+${num}` : num
      },
      // 执行审批确认
      _approvalApply(reason) {
        approvalApply(this.leaveId, this.isAllow, reason).then((res) => {
          console.log(res)
          if(!res.code) {
            this.$router.push('/apply/processDisease/processVerify/processSuccess')
            this.hideReasonConfirm()
          }
        })
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
      SubHeader,
      ReasonConfirm
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  .apply-detail
    position: fixed
    top: 0
    left: 0
    z-index: 55
    width: 100%
    height: 100%
    background-color: $color-background
    .apply-detail-group
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
        &.multiple
          display: block !important
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
        .number-input, .reason-input
          border: none
          outline: none
        .number-input
          text-align: right
        .reason-input
          resize: none
          display: block
          margin-top: 8px
          padding-bottom: 30px
          width: 100%
          height: 80px
          text-indent: 1em
          font-size: 14px
          font-family: "微软雅黑"
    .submit-item
      padding: 10px
      width: calc(100% - 20px)
      background-color: $color-background-d
      .submit-btn
        width: 100%
        height: 40px
        color: $color-text-a
        border-radius: 3px
        font-size: 15px
        font-family: "微软雅黑"
        transition: all .3s
        &:not(:last-child)
          margin-bottom: 5px
        &:active
          background-color: #72cbff
        &.allow
          background-color: $color-background-f
        &.reject
          background-color: $color-sub-theme
  .slide-enter-active, .slide-leave-active {
    transition: all .5s
  }
  .slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0)
  }
</style>
