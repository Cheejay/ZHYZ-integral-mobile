<template>
  <transition name="scale">
    <div class="select-cls" @click="clickMask" v-show="isShowSelectCls">
      <div class="select-cls-container">
        <ul class="cls-list" v-if="clsSelectList">
          <li class="cls-item" @click.stop="selectCls(cls)" v-for="cls in clsSelectList">{{ cls.name }}</li>
        </ul>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    props: {
      clsSelectList: { // 带的班级的列表
        type: Array,
        default: null
      },
      isShowSelectCls: { // 是否显示该组件
        type: Boolean,
        default: false
      }
    },
    methods: {
      // 当点击了班级之后
      selectCls(cls) {
        this.$emit('selectCls', cls)
      },
      // 点击了遮罩层之后
      clickMask() {
        this.$emit('hideSelectCls')
      }
    }
  }
</script>

<style lang="stylus">
  .select-cls
    position: fixed
    top: 0
    left: 0
    z-index: 100
    padding: 30px 20px
    width: calc(100% - 40px)
    height: calc(100% - 60px)
    transition: all .3s
    background-color: rgba(0, 0, 0, .5)
    &.scale-enter, &.scale-leave-active
      opacity: 0
      .select-cls-container
        transform: scale(0.9)
    .select-cls-container
      position: absolute
      top: 50%
      left: 50%
      padding: 30px
      width: calc(80% - 60px)
      height: calc(35% - 60px)
      transform: translate3d(-50%, -50%, 0)
      border-radius: 3px
      transition: all .4s cubic-bezier(0,.75,.38,1.36)
      background-color: #FFF
      .cls-list
        position: relative
        top: 50%
        left: 50%
        transform: translate3d(-50%, -50%, 0)
        transfor
        .cls-item
          text-align: center
          padding: 25px 0
</style>
