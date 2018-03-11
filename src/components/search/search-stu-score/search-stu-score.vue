<template>
  <div class="search-student-score">
    <sub-header titleText="选择校区"></sub-header>
    <listview @select="selectCampus" :data="campus" ref="list"></listview>
    <transition name="slide">
      <router-view :is-select-stu="isSelectStu"
        :is-select-cls="isSelectCls"></router-view>
    </transition>
  </div>
</template>

<script>
  import SubHeader from 'base/sub-header/sub-header'
  import Listview from 'base/listview/listview'
  import { getAllCampus } from 'api/operate'
  import { mapMutations } from 'vuex'
  import { normalizeList, loginFailure } from 'common/js/util'
  import { LOGIN_ERR } from 'api/config'

  export default {
    props: {
      isSelectStu: {
        type: Boolean,
        default: false
      },
      isSelectCls: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        campus: []
      }
    },
    created() {
      this._getAllCampus()
    },
    methods: {
      // 当点击了班级之后
      selectCampus(cls) {
        this.setCampusInfo(cls)
        if(this.isSelectStu) {
          this.$router.push('/inputStudentNumber/selectStudentScore/selectClass')
        } else if(this.isSelectCls) {
          this.$router.push('/operateClsScore/selectStudentScore/selectClass')
        } else {
          this.$router.push('/searchStudentScore/selectClass')
        }
      },
      // get 到班级列表数据
      _getAllCampus() {
        getAllCampus().then((res) => {
          if(res.code === LOGIN_ERR) {
            loginFailure()
          }
          this.campus = normalizeList(res, 'name')
        })
      },
      ...mapMutations({
        setCampusInfo: 'SET_CAMPUS_INFO'
      })
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

