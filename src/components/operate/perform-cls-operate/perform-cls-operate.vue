<template>
  <div class="perform-operate">
    <sub-header titleText="执行操作确认"></sub-header>
    <div class="perform-container">
      <!-- 基础信息 学生 -->
      <ul class="setting-list-group basic" v-show="classInfo">
        <!-- 班级名称 -->
        <li class="item">
          <p class="title">
            <i class="zhyz-id-card"></i>
            班级名称
          </p>
          <p class="text">{{ classInfo.name }}</p>
        </li>
      </ul>
      <!-- 选择操作项目 -->
      <ul class="setting-list-group operate">
        <li class="item">
          <p class="title">
            <i class="zhyz-time"></i>
            选择时间
          </p>
          <p class="text">
            <datetime class="finishTime"
              zone="Asia/Shanghai"
              value-zone="Asia/Shanghai"
              v-model="operateTime"
              type="datetime"
              :phrases="{ok: 'Continue', cancel: 'Exit'}"
              :format="{ year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit'}"
            ></datetime>
          </p>
        </li>
        <li class="item" @click="toggleSelectList">
          <p class="title">
            <i class="zhyz-xiangmu"></i>
            考评项目
          </p>
          <p class="text">
            <span class="project" v-if="requestQuery" v-for="item in requestQuery">{{ item.content }}</span>
            <span v-show="!requestQuery[0]">
              请选择
              <i class="zhyz-right"></i>
            </span>
          </p>
        </li>
        <!-- 分值 -->
        <li class="item">
          <p class="title">
            <i class="zhyz-number1"></i>
            分值
          </p>
          <p class="text" v-show="requestQuery">{{ totalPDScore | padLeftSign }}</p>
        </li>
      </ul>
      <!-- 操作按钮 -->
      <el-button type="primary"
        v-loading.fullscreen.lock="isLoading"
        class="confirm-btn" 
        @click="runOperate">确认</el-button>
    </div>
    <select-list @hide="toggleSelectList"
      @selectProject="selectProject"
     :is-show="isShowSelectList"
     :list-data="categoryData"></select-list>
  </div>
</template>

<script>
  import SubHeader from 'base/sub-header/sub-header'
  import SelectList from 'components/operate/select-list/select-list'
  import { Datetime } from 'vue-datetime'
  import { getAllCategory, operateClassScore } from 'api/operate'
  import { ERR_OK, LOGIN_ERR } from 'api/config'
  import { openVn, loginFailure } from 'common/js/util'
  import { mapMutations, mapGetters } from 'vuex'

  export default {
    data() {
      return {
        operateTime: '',
        isLoading: false,
        isShowSelectList: false,
        categoryData: [],
        requestQuery: [],
        totalPDScore: 0
      }
    },
    created() {
      this._getAllCategory()
    },
    methods: {
      // 执行积分操作
      runOperate() {
        this._operateClassScore()
      },
      // 显示 / 隐藏选择分类列表
      toggleSelectList() {
        this.isShowSelectList = !this.isShowSelectList
      },
      // 选择了考评项目之后
      selectProject(item) {
        console.log(item)
        console.log(this.operateTime)
        this.requestQuery.push({
          content: item.content,
          cls_score: item.cls_score,
          cls_id: this.classInfo.id,
          score_item_id: item.id,
          op_time: !this.operateTime ? 0 : (new Date(this.operateTime).getTime() + '').substring(0, 10)
        })
        this.figureTotalPDScore()
      },
      // 总共的加减分
      figureTotalPDScore() {
        this.totalPDScore = 0
        for(let i of this.requestQuery) {
          this.totalPDScore += i.cls_score
        }
      },
      // get 所有考评项目分类
      _getAllCategory() {
        getAllCategory().then((res) => {
          if(res.code === LOGIN_ERR) {
            loginFailure()
          }
          this.categoryData = res
        })
      },
      // 执行积分操作
      _operateClassScore() {
        operateClassScore(this.requestQuery).then((res) => {
          console.log(res)
          if(res.code === ERR_OK) {
            openVn('操作成功！')
            this.requestQuery = []
            this.operateTime = 0
          } else {
            openVn(res.msg, 'error')
          }
        })
      },
      ...mapMutations({
        setClassInfo: 'SET_CLASS_INFO'
      })
    },
    computed: {
      ...mapGetters([
        'classInfo'
      ])
    },
    filters: {
      padLeftSign(num) {
        return num > 0 ? `+${num}` : num
      }
    },
    components: {
      Datetime,
      SubHeader,
      SelectList
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  .perform-operate
    position: fixed
    top: 0
    left: 0
    z-index: 200
    width: 100%
    height: 100%
    background-color: $color-background
    .perform-container
      .setting-list-group
        margin-bottom: 30px
        &.multiple
          .text
            text-align: center !important
        &:first-child
          margin-top: 15px
        .item
          display: flex
          align-items: center
          justify-content: space-between
          padding: 14px
          font-size: $font-size-medium-x
          background-color: $color-background-d
          &:not(:last-child) {
            border-bottom: 1px solid $color-border
          }
          &:active
            background-color: $color-background-b
          &.exit
            text-align: center              
            .title
              color: $color-sub-theme
          .title
            flex: 1
            color: #000
            i
              font-size: $font-size-large
          .text
            flex: 1
            text-align: right
            color: $color-text-l
            .project
              display: inline-block
              width: 180px
              text-overflow: ellipsis
              overflow: hidden
              white-space: nowrap
      .confirm-btn
        padding: 12px 0
        width: 100%
        color: $color-text-a
        font-size: $font-size-large
        text-align: center
        border-radius: 6px
        box-shadow: 1px 4px 8px rgba(0, 0, 0, .1)
        background-color: $color-background-f
        &:active
          background-color: #2ea1e4
</style>
