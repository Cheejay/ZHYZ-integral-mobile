<template>
  <div class="disease">
    <sub-header titleText="请假"></sub-header>
    <div class="disease-container">
      <!-- 请假类型 -->
      <div class="ease-item">
        <ul class="ease-list">
          <li class="item" @click="categoryPickerShow">
            <p class="l-p">
              <i class="necessry">*</i>
              <span class="text">请假类型</span>
            </p>
            <p class="r-p">
              <span class="text category" :class="{'text-unfocus': categoryText === '请选择'}">{{ categoryText }}</span>
              <i class="icon zhyz-right"></i>
            </p>
          </li>
        </ul>
      </div>
      <!-- 我的假期 -->
      <div class="ease-item">
        <h2 class="title">我的假期</h2>
        <ul class="ease-list">
          <li class="item">
            <p class="l-p">
              <i class="necessry">*</i>
              <span class="text">请假天数</span>
            </p>
            <p class="r-p">
              <input type="number" v-model="days" class="number-input days" min="1" max="10" placeholder="请输入">
            </p>
          </li>
          <!-- 开始时间 -->
          <li class="item">
            <p class="l-p">
              <i class="necessry">*</i>
              <span class="text">开始时间</span>
            </p>
            <p class="r-p">
              <datetime class="beginningTime"
                zone="Asia/Shanghai"
                value-zone="Asia/Shanghai"
                v-model="beginningTime"
                type="datetime"
                :phrases="{ok: 'Continue', cancel: 'Exit'}"
                :format="{ year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit'}"
                ></datetime>
            </p>
          </li>
          <!-- 结束时间 -->
          <li class="item">
            <p class="l-p">
              <i class="necessry">*</i>
              <span class="text">结束时间</span>
            </p>
            <p class="r-p">
              <datetime class="finishTime"
                zone="Asia/Shanghai"
                value-zone="Asia/Shanghai"
                v-model="finishTime"
                type="datetime"
                :phrases="{ok: 'Continue', cancel: 'Exit'}"
                :format="{ year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit'}"
                ></datetime>
            </p>
          </li>
        </ul>
      </div>
      <!-- 原因 & 家长电话 -->
      <div class="ease-item">
        <h2 class="title">事由</h2>
        <ul class="ease-list">
          <li class="item">
            <p class="l-p">
              <i class="necessry">*</i>
              <span class="text">家长电话</span>
            </p>
            <p class="r-p">
              <input type="phone" v-model="parentPhone" class="number-input parent-phone" placeholder="请输入">
            </p>
          </li>
          <li class="item multiple">
            <p class="l-p">
              <i class="necessry">*</i>
              <span class="text">请假事由（200字以内）</span>
            </p>
            <p class="r-p">
              <textarea v-model="reason" maxlength="200" class="reason-input" placeholder="请输入请假事由"></textarea>
            </p>
          </li>
        </ul>
      </div>
      <!-- 提交 -->
      <div class="submit-item">
        <button type="button" @click="_askForLeave()" class="submit-btn">提交</button>
      </div>
    </div>
  </div>
</template>

<script>
  import { ERR_OK } from 'api/config'
  import { openVn } from 'common/js/util'
  import { Datetime } from 'vue-datetime'
  import { getLeaveList, askForLeave } from 'api/apply'
  import Picker from 'better-picker'
  import SubHeader from 'base/sub-header/sub-header'

  export default {
    data() {
      return {
        days: '',
        reason: '',
        parentPhone: '',
        categoryText: '请选择',
        categoryValue: 0,
        daysText: '请选择',
        beginningTime: '',
        finishTime: '',
        categoryData: [
          {
            value: 1,
            text: '早操'
          },
          {
            value: 2,
            text: '上午上课'
          },
          {
            value: 3,
            text: '下午上课'
          },
          {
            value: 4,
            text: '晚修'
          },
          {
            value: 5,
            text: '宿舍'
          }
        ]
      }
    },
    created() {
      this._getLeaveList()
    },
    mounted() {
      this.categoryPicker = new Picker({
        data: [this.categoryData],
        selectedIndex: [0],
        title: '请假类型'
      })

      this.categoryPicker.on('picker.select', (selectedVal, selectedIndex) => {
        this.categoryText = this.categoryData[selectedIndex].text
        this.categoryValue = selectedVal
      })
    },
    methods: {
      categoryPickerShow() {
        this.categoryPicker.show()
      },
      _getLeaveList() {
        getLeaveList().then((res) => {
          this.categoryData = res
        })
      },
      _askForLeave() {
        this._initData()
        askForLeave(this.requestQuery).then((res) => {
          if(res.code === ERR_OK) {
            openVn('申请成功！')
          } else {
            openVn(`申请失败！${res.msg}`, 'error')
          }
        })
      },
      _initData() {
        let arr = []
        arr.push({
          days: this.days,
          reason: this.reason,
          parent_phone: this.parentPhone,
          leave_type_id: this.categoryValue,
          begin_time: (new Date(this.beginningTime).getTime() + '').substring(0, 10),
          end_time: (new Date(this.finishTime).getTime() + '').substring(0, 10)
        })
        this.requestQuery = arr
      }
    },
    components: {
      Datetime,
      SubHeader
    }
  }
</script>
  
<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  
  .disease
    position: fixed
    top: 0
    bottom: 0
    left: 0
    right: 0
    overflow-y: auto
    z-index: 100
    background-color: $color-background
    .disease-container
      padding-top: 10px
      .ease-item
        .title
          padding: 10px 0 10px 16px
          font-size: 11px
        .item
          padding: 18px 12px 18px 8px
          display: flex
          align-items: center
          justify-content: space-between
          background-color: $color-background-d
          &:not(:last-child)
            border-bottom: 1px solid #dedede
          &.multiple
            display: block !important
          .l-p
            i.necessry
              color: red
          .r-p
            i.zhyz-right
              font-size: 13px
              color: $color-text-d
            .text-unfocus
              color: #ccc
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
              height: 120px
              text-indent: 1em
              font-family: "微软雅黑"
            .vdatetime
              input
                text-align: right
      .submit-item
        position: fixed
        left: 0
        bottom: 0
        padding: 10px
        width: calc(100% - 20px)
        height: 40px
        background-color: $color-background-d
        .submit-btn
          width: 100%
          height: 100%
          color: $color-text-a
          background-color: $color-background-f
          border-radius: 3px
          font-size: 15px
          font-family: "微软雅黑"
          transition: all .3s
          &:active
            background-color: #72cbff

</style>
