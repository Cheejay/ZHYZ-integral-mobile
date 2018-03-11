<template>
  <div class="change-password">
    <sub-header titleText="修改密码" :is-show-close-icon="false"></sub-header>
    <div class="change-password-container">
      <form class="pwd-form">
        <div class="item">
          <label>旧密码：</label>
          <input type="password" v-model="oldPwd" placeholder="旧密码">
        </div>
        <div class="item">
          <label>新密码：</label>
          <input type="password" v-model="newPwd" v-show="!isShowPwd" placeholder="新密码" maxlength="15">
          <input type="text" v-model="newPwd" v-show="isShowPwd" placeholder="新密码" maxlength="15">
          <i class="zhyz-eye" @click="toggleshowPwd" :class="{'active': isShowPwd}"></i>
        </div>
        <div class="item">
          <p class="submit-btn" @click="run">确认</p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import md5 from 'js-md5'
  import SubHeader from 'base/sub-header/sub-header'
  import { changePassword } from 'api/setting'
  import { mapGetters } from 'vuex'
  import { ERR_OK, LOGIN_ERR } from 'api/config'
  import { openVn, loginFailure } from 'common/js/util'

  export default {
    data() {
      return {
        oldPwd: '',
        newPwd: '',
        isShowPwd: false,
        requestQuery: []
      }
    },
    methods: {
      // 运行修改密码
      run() {
        this._changePassword()
      },
      // 是否显示密码
      toggleshowPwd() {
        this.isShowPwd = !this.isShowPwd
      },
      _changePassword() {
        if(!this.oldPwd || !this.newPwd) {
          openVn('密码不能为空！', 'error')
          return
        }
        this._initData()
        changePassword(this.requestQuery).then((res) => {
          if(res.code === ERR_OK) {
            openVn('修改成功！')
            this.oldPwd = ''
            this.newPwd = ''
          } else if(res.code === LOGIN_ERR) {
            loginFailure()
          } else {
            openVn(`修改失败！${res.msg}`, 'error')
          }
        })
      },
      _initData() {
        let arr = []
        arr.push({
          old_password: md5(`${this.oldPwd}`),
          password: md5(`${this.newPwd}`)
        })
        this.requestQuery = arr
      }
    },
    computed: {
      ...mapGetters([
        'personalInfo'
      ])
    },
    components: {
      SubHeader
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  .change-password
    position: fixed
    top: 0
    bottom: 0
    left: 0
    right: 0
    z-index: 100
    background-color: $color-background
    .change-password-container
      width: 100%
      .pwd-form
        margin-top: 30px
        padding: 10px 0
        display: flex
        align-items: center
        align-content: center
        justify-content: center
        flex-direction: column
        box-sizing: border-box
        border-top: 1px solid $color-border
        border-bottom: 1px solid $color-border
        background-color: $color-background-d
        .item
          position: relative
          width: 100%
          padding: 0 20px
          box-sizing: border-box
          flex: 1
          margin: 10px 0
          .zhyz-eye
            position: absolute
            top: 25px
            left: calc(100% - 40px - 2%)
            font-size: $font-size-large
            &.active
              color: $color-text-e
          input
            margin-top: 3px
            padding-left: 7px
            width: 100%
            height: 30px
            box-sizing: border-box
            border-bottom: 1px solid $color-border-c
            font-size: $font-size-medium
            font-family: '黑体'
            &:focus
              border-color: $color-border-e
          .submit-btn
            margin: 0 auto
            width: 40%
            height: 40px
            line-height: 40px
            text-align: center
            border-radius: 6px
            color: $color-text-a
            box-shadow: 0px 5px 10px rgba(0, 0, 0, .2)
            background-color: $color-background-e
            &:active
              background-color: #488ada
</style>

