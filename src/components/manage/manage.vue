<template>
  <keep-alive>
      <router-view></router-view>
  </keep-alive>
</template>

<script>
  import { getPersonalInfo } from 'api/index'
  import { getMyTeachCls } from 'api/mesystem'
  import { mapMutations } from 'vuex'
  import { openVn } from 'common/js/util'

  export default {
    created() {
      this._getPersonalInfo()
    },
    methods: {
      // get 我带的班级
      _getMyTeachCls() {
        getMyTeachCls().then((res) => {
          this.setMyTeachCls(res)
        })
      },
      // 用这个请求判断是否正常登陆
      _getPersonalInfo() {
        getPersonalInfo().then((res) => {
          if(!res.code) {
            console.log(res)
            this.setPersonalInfo(res) // 保存个人信息存到 vuex 里

            if(res.roles.length > 0) {
              // 如果是班主任的话
              for(let i of res.roles) {
                if(i.name === '班主任') {
                  // 把该班主任带的班级存到 vuex 里
                  // 在查看十项常规页面需要用到
                  this._getMyTeachCls()
                }
              }
            }
          } else {
            openVn('请先登陆！', 'info')
            this.$router.push('/login')
          }
        })
      },
      ...mapMutations({
        setMyTeachCls: 'SET_MY_TEACH_CLS',
        setPersonalInfo: 'SET_CURRENT_PERSONAL_ACCOUNT_INFO'
      })
    }
  }
</script>

<style lang="stylus" scoped>

</style>

