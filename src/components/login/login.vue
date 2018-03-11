<template>
  <div class="login">
    <div class="login-container">
      <!-- 登陆头部 -->
      <div class="login-header">
        <!-- 学校 logo -->
        <div class="zhyz-logo">
          <div class="icon"></div>
        </div>
        <!-- 登陆文字 -->
        <h2 class="title">一职积分奖励系统</h2>
      </div>
      <!-- 登陆框 -->
      <form class="login-form" v-loading.body="isLoading">
        <!-- 账号 -->
        <div class="form-item">
          <i class="icon zhyz-user-login"></i>
          <input type="text" class="user-login" @keydown.enter="runLogin" v-model="userLogin" placeholder="账号">
          <i class="right-icon zhyz-error" @click="clearLoginNum" v-show="userLogin"></i>
        </div>
        <!-- 密码 -->
        <div class="form-item">
          <i class="icon zhyz-user-password"></i>
          <input type="password" class="user-password" @keydown.enter="runLogin" v-show="!isShowPwd" v-model="userPassword" placeholder="密码" maxlength="15">
          <i class="right-icon zhyz-eye" @click="toggleshowPwd" :class="{'active': isShowPwd}"></i>
          <input type="text" class="user-password" @keydown.enter="runLogin" v-show="isShowPwd" v-model="userPassword" placeholder="密码" maxlength="15">
          <div class="save-password" @click="toggleSavePassword">
            <p class="checkbox" :class="{'active': isSavePwd}"></p>
            <span class="text">记住密码</span>
          </div>
        </div>
        <!-- submit btn -->
        <div class="form-item btn">
          <el-button type="primary"class="submit-btn" 
            @click="runLogin">立即登陆</el-button>
        </div>
        <!-- submit btn -->
        <!-- <div class="form-item">
          <el-button type="primary"class="submit-btn" 
            @click="redirect">使用 eonline 一键登录</el-button>
        </div> -->
      </form>
    </div>
  </div>  
</template>

<script>
  import md5 from 'js-md5'
  import { saveInfo, loadInfo } from 'common/js/cache'
  import { TOKEN_KEY, LOGIN_KEY } from 'common/js/config'
  import { ERR_OK } from 'api/config'
  import { checkLogin } from 'api/login'
  import { getPersonalInfo } from 'api/index'
  import { mapMutations } from 'vuex'
  import { openVn } from 'common/js/util'

  export default {
    data() {
      return {
        userLogin: loadInfo(LOGIN_KEY).userLogin,
        userPassword: loadInfo(LOGIN_KEY).userPassword,
        isShowPwd: false,
        requestQuery: [],
        isLoading: false,
        isSavePwd: true
      }
    },
    created() {
      this._autoLogin()
    },
    methods: {
      // 运行登陆
      runLogin() {
        if(!this.userLogin || !this.userPassword) {
          openVn('账号或密码不能为空！', 'error')
          return
        }
        this._checkLogin()
      },
      // 重定向至 eonline 网站
      // redirect() {
      //   let URL = encodeURIComponent(window.location.href)
      //   console.log(URL)
      //   const REDIRECT_URL = `http://10.21.168.65:9054/server.php?s=/api/v1/token/cas/user&service=${URL}`
      //   console.log(REDIRECT_URL)
      //   window.location.href = REDIRECT_URL
      // },
      // 是否显示密码
      toggleshowPwd() {
        this.isShowPwd = !this.isShowPwd
      },
      // 是否保存密码
      toggleSavePassword() {
        this.isSavePwd = !this.isSavePwd
      },
      // 清空登陆账号
      clearLoginNum() {
        this.userLogin = ''
      },
      // 验证登陆
      _checkLogin() {
        this.isLoading = true
        this._initData()
        checkLogin(this.requestQuery).then((res) => {
          if(res.code === ERR_OK) {
            openVn('登陆成功！')
            // 保存 token 到本地存储
            saveInfo(TOKEN_KEY, res.data.token)
            // 保存登陆账号到本地存储
            saveInfo(LOGIN_KEY, {
              userLogin: this.userLogin,
              userPassword: this.isSavePwd ? this.userPassword : ''
            })
            this.setToken(res.data.token)
            this.$router.push('/index')
          } else {
            openVn(`登陆失败！${res.msg}`, 'error')
          }
          this.isLoading = false
        })
      },
      // 用这个请求判断是否之前登陆过
      _autoLogin() {
        getPersonalInfo().then((res) => {
          if(!res.code) {
            openVn('自动登陆成功！')
            this.$router.push('/index')
          }
        })
      },
      _initData() {
        let arr = []
        arr.push({
          user_login: this.userLogin,
          user_pass: md5(`${this.userPassword}`)
        })
        this.requestQuery = arr
      },
      ...mapMutations({
        setToken: 'SET_TOKEN'
      })
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/mixin"
  @import "~common/stylus/variable"

  .login
    width: 100%
    height: 100%
    .login-container
      position: relative
      top: 40%
      margin: 0 auto
      padding: 0 20px
      box-sizing: border-box
      transform: translate3d(0, -50%, 0)
      .login-header
        padding: 60px 0 22px
        .zhyz-logo
          width: 55px
          height: 55px
          margin: 0 auto 22px
          .icon
            width: 70px
            height: 70px
            bg-image('logo')
            background-size: 70px 70px
        .title
          text-align: center
          font-size: $font-size-large-x
      .login-form
        .form-item
          position: relative
          &.btn
            padding: 24px 0 5px
          .icon
            display: inline-block
            width: 8%
            text-align: center
            font-size: $font-size-large
          .right-icon
            position: absolute
            top: 7px
            right: 7px
            padding: 5px
            color: #555
            font-size: $font-size-large-x
          .zhyz-error
            top: 10px
          .zhyz-eye
            &.active
              color: $color-text-e !important
          input
            display: inline-block
            padding: 1rem 0 1rem 10px
            width: 90%
            font-size: $font-size-medium
            box-sizing: border-box
            background: $color-background-d
            border-bottom: 1px solid rgba(0, 0, 0, 0)
            &.user-login
              border-radius: 14px 14px 0 0
              border-color: $color-border
            &.user-password
              border-radius: 0 0 14px 14px
          .submit-btn
            margin-top: 10px
            padding: .8rem 0
            width: 100%
            border-radius: 100px
            color: $color-text-a
            text-align: center
            font-size: $font-size-medium-x
            background-color: $color-background-f
            &:active
              background-color: #2a97d6
          .save-password
            position: absolute
            left: calc(20px + 4%)
            z-index: 20
            margin-top: 10px
            font-size: 0
            .checkbox
              display: inline-block
              width: 13px
              height: 13px
              vertical-align: top
              margin-right: 4px
              border-radius: 3px
              box-sizing: border-box
              border: 1px solid $color-border
              &.active
                border: none
                background-color: $color-background-e
            .text
              font-size: $font-size-medium
</style>
