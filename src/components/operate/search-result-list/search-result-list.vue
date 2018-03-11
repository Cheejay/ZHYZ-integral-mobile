<template>
  <div class="search-student-score">
    <sub-header titleText="选择学生"></sub-header>
    <listview @select="selectStudent" 
      :can-multiple-choice="canMultipleChoice" 
      @onItemMultipleChoice="onItemMultipleChoice" 
      @onMultipleSelectConfirm="onMultipleSelectConfirm"
      :data="searchDataList" 
      ref="list"></listview>
    <transition name="slide">
      <router-view :student-data="studentData"
        :student-data-list="studentDataList"
        :is-multiple-student="multipleMode"></router-view>
    </transition>
  </div>
</template>

<script>
  import SubHeader from 'base/sub-header/sub-header'
  import Listview from 'base/listview/listview'
  import { getStudentInfoById } from 'api/operate'
  import { LOGIN_ERR } from 'api/config'
  import { loginFailure } from 'common/js/util'

  export default {
    props: {
      searchDataList: {
        type: Array,
        default: null
      }
    },
    data() {
      return {
        studentData: null,
        studentDataList: null,
        canMultipleChoice: true, // 是否可以多选
        multipleMode: false // 是否开启了多选模式
      }
    },
    created() {
      if(!this.searchDataList) {
        this.$router.back()
      }
    },
    methods: {
      // 当点击了学生之后
      selectStudent(stu) {
        this._getStudentInfoById(stu.id)
        this.$router.push('/inputStudentNumber/searchResultList/performOperate')
      },
      // 开启了多选模式之后
      onItemMultipleChoice(val) {
        this.multipleMode = val
      },
      // 多选确认之后
      onMultipleSelectConfirm(list) {
        this.studentDataList = list
        this.$router.push('/inputStudentNumber/searchResultList/performOperate')
      },
      _getStudentInfoById(id) {
        getStudentInfoById(id).then((res) => {
          if(res.code === LOGIN_ERR) {
            loginFailure()
          }
          this.studentData = res
        })
      }
    },
    components: {
      Listview,
      SubHeader
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  .search-student-score
    position: fixed
    top: 0
    left: 0
    z-index: 55
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
