<template>
  <div class="search-student-score">
    <sub-header titleText="选择班级"></sub-header>
    <listview @select="selectClass" :data="classes" ref="list"></listview>
    <transition name="slide">
      <router-view :is-select-stu="isSelectStu"></router-view>
    </transition>
  </div>
</template>

<script>
  import SubHeader from 'base/sub-header/sub-header'
  import Listview from 'base/listview/listview'
  import { getClsListByCampusId } from 'api/operate'
  import { mapMutations, mapGetters } from 'vuex'
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
        classes: []
      }
    },
    created() {
      if(!this.campusInfo.id) {
        this.$router.back()
      }
      this._getClsListByCampusId()
    },
    methods: {
      // 当点击了班级之后
      selectClass(cls) {
        this.setClassInfo(cls)
        if(this.isSelectStu) {
          this.$router.push('/inputStudentNumber/selectStudentScore/selectClass/classStudent')
        } else if(this.isSelectCls) {
          this.$router.push('/operateClsScore/selectStudentScore/selectClass/performClsOperate')
        } else {
          this.$router.push('/searchStudentScore/selectClass/classStudent')
        }
      },
      // get 到班级列表数据
      _getClsListByCampusId() {
        getClsListByCampusId(this.campusInfo.id).then((res) => {
          if(res.code === LOGIN_ERR) {
            loginFailure()
          }
          this.classes = normalizeList(res, 'code', true)
        })
      },
      ...mapMutations({
        setClassInfo: 'SET_CLASS_INFO'
      })
    },
    computed: {
      ...mapGetters([
        'campusInfo'
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

  .search-student-score
    position: fixed
    top: 0
    left: 0
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

