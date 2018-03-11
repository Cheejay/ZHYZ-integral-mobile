<template>
  <div class="perform-operate">
    <sub-header titleText="执行操作确认"></sub-header>
    <div class="perform-container">
      <!-- 基础信息 学生 -->
      <ul class="setting-list-group basic" v-if="!isMultipleStudent && studentData">
        <!-- 姓名 -->
        <li class="item">
          <p class="title">
            <i class="zhyz-id-card"></i>
            姓名
          </p>
          <p class="text">{{ studentData.name }}</p>
        </li>
        <!-- 班级 -->
        <li class="item">
          <p class="title">
            <i class="zhyz-class"></i>
            班级
          </p>
          <p class="text">{{ studentData.cls.name }}</p>
        </li>
        <!-- 学号 -->
        <li class="item">
          <p class="title">
            <i class="zhyz-number"></i>
            学号
          </p>
          <p class="text">{{ studentData.number }}</p>
        </li>
        <!-- 性别 -->
        <li class="item">
          <p class="title">
            <i class="zhyz-nan" v-show="studentData.sex === '男'"></i>
            <i class="zhyz-female" v-show="studentData.sex === '女'"></i>
            性别
          </p>
          <p class="text">{{ studentData.sex }}</p>
        </li>
      </ul>
      <!-- 多人选择 -->
      <ul class="setting-list-group multiple" v-else>
        <!-- 学生 X -->
        <li class="item">
          <span class="text" v-for="(item, index) in studentDataList" :key="item.id">{{ item.name }}</span>
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
            <span v-if="selectedProject">{{ selectedProject.content }}</span>
            <span v-show="!selectedProject">
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
          <p class="text" v-if="selectedProject">{{ selectedProject.score | padLeftSign }}</p>
        </li>
        <div class="item needsclick" @click="toggleUseExtraScore" v-if="personalInfo.is_cls_teacher">
          <p class="title">
            <i class="zhyz-kuozhan"></i>
            是否使用扩展积分
          </p>
          <el-switch
            v-model="isUseExtraScore"
            on-text="是"
            off-text="否"
            on-color="#13ce66"
            off-color="#ff4949">
          </el-switch>
        </div>
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
     <confirm-box :is-show="isShowConfirmBox"
      confirmTitle="注意!"
      :confirmText="confirmBoxText"
      @confirm="overScoreConfirm"></confirm-box>
  </div>
</template>

<script>
  import SubHeader from 'base/sub-header/sub-header'
  import ConfirmBox from 'base/confirm-box/confirm-box'
  import SelectList from 'components/operate/select-list/select-list'
  import { Datetime } from 'vue-datetime'
  import { getAllCategory, operateStudentScore } from 'api/operate'
  import { ERR_OK, CONFIRM_, LOGIN_ERR } from 'api/config'
  import { openVn, loginFailure } from 'common/js/util'
  import { mapMutations, mapGetters } from 'vuex'
  import { getPersonalInfo } from 'api/index'

  export default {
    props: {
      studentData: {
        type: Object,
        default: null
      },
      studentDataList: {
        type: Array,
        default: null
      },
      isMultipleStudent: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        operateTime: '',
        isLoading: false,
        isShowSelectList: false,
        categoryData: null,
        selectedProject: null,
        isUseExtraScore: false,
        requestQuery: [],
        isShowConfirmBox: false,
        confirmBoxText: '',
        overScoreResData: []
      }
    },
    created() {
      this._getAllCategory()
    },
    methods: {
      // 执行积分操作
      runOperate() {
        this._operateStudentScore()
      },
      // 显示 / 隐藏选择分类列表
      toggleSelectList() {
        this.isShowSelectList = !this.isShowSelectList
      },
      // 选择了考评项目之后
      selectProject(item) {
        this.selectedProject = item
      },
      // 是否使用扩展积分
      toggleUseExtraScore() {
        this.isUseExtraScore = !this.isUseExtraScore
      },
      // 超出分数限制
      overScoreConfirm(v) {
        if(v === 'confirm') {
          this._operateStudentScore(this.overScoreResData.data)
        } else {
          this.requestQuery = []
        }
        this.isShowConfirmBox = false
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
      _operateStudentScore(CONFIRM) {
        this._initData(CONFIRM)
        operateStudentScore(this.requestQuery).then((res) => {
          if(res.code === ERR_OK) {
            openVn('操作成功！')
            this.selectedProject = null
            this.isUseExtraScore = false
            this.requestQuery = []
            this._getPersonalInfo()
          } else if(res.code === CONFIRM_) { // 学生分数即将达到限制时
            this.overScoreResData = res
            this.confirmBoxText = res.msg
            this.isShowConfirmBox = true
          } else if(res.code === LOGIN_ERR) {
            loginFailure()
          } else {
            openVn(res.msg, 'error')
          }
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
      _initData(CONFIRM) {
        // 匹配是否为那个超出分数的人
        if(CONFIRM && this.requestQuery.length) {
          this.requestQuery.forEach((item) => {
            // 判断返回的字段是否为需要提示的学生
            if(item.id === CONFIRM.student_id) {
              item.confirm = 1
              return false
            }
          })
          // 如果是需要提示就返回
          return
        }
        // 否则把学生加进去
        let arr = []
        if(this.studentDataList) {
          this.studentDataList.forEach((item) => {
            arr.push({
              student_id: item.id,
              score_item_id: this.selectedProject.id,
              use_score_type: this.isUseExtraScore ? 1 : 0
            })
          })
        } else {
          arr.push({
            student_id: this.studentData.id,
            score_item_id: this.selectedProject.id,
            use_score_type: this.isUseExtraScore ? 1 : 0,
            op_time: this.operateTime === '' ? 0 : (new Date(this.operateTime).getTime() + '').substring(0, 10)
          })
        }
        this.requestQuery = arr
      },
      ...mapMutations({
        setPersonalInfo: 'SET_CURRENT_PERSONAL_ACCOUNT_INFO'
      })
    },
    computed: {
      ...mapGetters([
        'personalInfo'
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
      SelectList,
      ConfirmBox
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
            .vdatetime
              input
                text-align: right
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

