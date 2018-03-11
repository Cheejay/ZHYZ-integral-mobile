<template>
  <div class="class-student">
    <sub-header :titleText="`${classInfo.name} 学生`"></sub-header>
    <listview @select="selectStudent" 
      :can-multiple-choice="canMultipleChoice" 
      @onItemMultipleChoice="onItemMultipleChoice" 
      @onMultipleSelectConfirm="onMultipleSelectConfirm"
      :data="students" 
      ref="list"></listview>
    <el-button type="primary"
      v-loading.fullscreen.lock="isLoading"></el-button>
    <transition name="slide">
      <router-view :stu="stu"
        :student-data="studentData"
        :student-data-list="studentDataList"
        :is-multiple-student="multipleMode"></router-view>
    </transition>
  </div>
</template>

<script>
  import SubHeader from 'base/sub-header/sub-header'
  import Listview from 'base/listview/listview'
  import { getStuByCls, getStudentInfoById } from 'api/operate'
  import { mapGetters } from 'vuex'
  import { LOGIN_ERR } from 'api/config'
  import { normalizeList, loginFailure } from 'common/js/util'

  export default {
    props: {
      isSelectStu: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        stu: null,
        students: [],
        isLoading: false,
        studentData: null,
        studentDataList: null,
        multipleMode: false, // 是否开启了多选模式
        canMultipleChoice: false
      }
    },
    created() {
      if(!this.classInfo.id) {
        this.$router.back()
      }
      if(this.isSelectStu) {
        this.canMultipleChoice = true
      }
      this._getStuByCls()
    },
    methods: {
      // 当选择了学生之后
      selectStudent(stu) {
        if(this.isSelectStu) {
          this._getStudentInfoById(stu.id)
          this.$router.push('classStudent/performOperate')
        } else {
          this.stu = stu
          this.$router.push('/searchStudentScore/selectClass/classStudent/studentOperateDetailList')
        }
      },
      // 开启了多选模式之后
      onItemMultipleChoice(val) {
        this.multipleMode = val
      },
      // 多选确认之后
      onMultipleSelectConfirm(list) {
        this.studentDataList = list
        this.$router.push('classStudent/performOperate')
      },
      // 根据 class id get 到这个班级的学生信息列表
      _getStuByCls() {
        getStuByCls(this.classInfo.id).then((res) => {
          if(res.code === LOGIN_ERR) {
            loginFailure()
          }
          this.students = normalizeList(res, 'name')
        })
      },
      // 根据选择的学生 id get 到此学生数据
      _getStudentInfoById(id) {
        this.isLoading = true
        getStudentInfoById(id).then((res) => {
          if(!res.code && res.code !== 0) {
            this.studentData = res
          }
          this.isLoading = false
        })
      }
    },
    computed: {
      ...mapGetters([
        'classInfo'
      ])
    },
    components: {
      Listview,
      SubHeader
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  .class-student
    position: fixed
    top: 0
    left: 0
    z-index: 50
    width: 100%
    height: 100%
    background-color: $color-background
  .slide-enter-active, .slide-leave-active {
    transition: all .5s
  }
  .slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0)
  }
</style>

