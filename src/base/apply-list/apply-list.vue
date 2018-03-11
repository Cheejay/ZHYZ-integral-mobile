<template>
  <div class="apply-list">
    <ul class="list-content">
      <!-- 详细 -->
      <li @click="selectItem(item, $event)" 
        class="list-item">
        <div class="left">
          <p class="title">我发烧</p>
          <span class="name">Jua</span>
          <span class="time">2018-03-11 8:00 ~ 2018-03-12 8:00</span>
        </div>
        <div class="right">
          <p class="is-pass yet">未通过</p>
        </div>
      </li>
      <li @click="selectItem(item, $event)" 
        class="list-item">
        <div class="left">
          <p class="title">我就不上学</p>
          <span class="name">Jua</span>编程
          <span class="time">2018-03-10 8:00 ~ 2018-03-11 8:00</span>
        </div>
        <div class="right">
          <p class="is-pass already">已通过</p>
        </div>
      </li>
      <!-- 详细 -->
      <!-- <li @click="selectItem(item, $event)" 
        :key="item.id"
        class="list-item">
        <div class="left">
          <p class="title">{{ item.content }}</p>
          <span class="name">{{ item.name }}</span>
          <span class="time">{{ item.create_time | formatDate }}</span>
        </div>
        <div class="right">
          <p class="is-pass" :style="{'color': item.cls_score > 0 ? '#12b7f5' : '#f62836'}">{{ padLeftZero(item.cls_score) }}</p>
        </div>
      </li> -->
    </ul>
  </div>
</template>

<script>
  import { formatDate } from 'common/js/date'
  import { mapGetters } from 'vuex'

  export default {
    props: {
      applies: {
        type: Array,
        default: []
      }
    },
    methods: {
      selectItem(item, event) {
        this.$emit('select', item)
      },
      // 补全分数左边的符号（+ -）
      padLeftZero(num) {
        return num > 0 ? `+${num}` : num
      }
    },
    filters: {
      formatDate(time) {
        time += '000'
        time = parseInt(time)
        let date = new Date(time)

        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      }
    },
    computed: {
      ...mapGetters([
        'personalInfo'
      ])
    }
  }
</script>

<style lang="stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .apply-list
    margin-top: 20px
    .list-content
      position: relative
      background: #fff
      .list-item
        position: relative
        display: flex
        align-items: center
        justify-content: space-between
        height: 60px
        padding: 0 0 0 20px
        border-bottom: 1px solid #e5e5e5
        transition: all .3s ease
        .left
          flex: 0 0 80%
          width: 80%
          .title
            margin-bottom: 2px
            text-overflow: ellipsis
            overflow: hidden
            white-space: nowrap
          .time
            font-size: 10px
        .right
          flex: 0 0 20%
          width: 20%
          transform: rotate(30deg)
          text-align: center
          .is-pass
            font-size: 15px
            &.already
              color: #12b7f5
            &.yet
              color: #f62836
</style>
