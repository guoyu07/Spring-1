<template>
  <div>
    <!-- //`v-if`是vue的一个指令
    //`$route.path`是当前路由对象的路径，会被解析为绝对路径当
    //`$route.path !== '/time-entries/log-time'`为`true`是显示，`false`，为不显示。
    //to 路由跳转地址 -->
    <router-link
      v-if="$route.path !== '/time-entries/log-time'"
      to="/time-entries/log-time" class="el-button el-button--primary">
      创建
    </router-link>

    <div v-if="$route.path === '/time-entries/log-time'">
      <h3>创建</h3>
    </div>

    <hr>

    <router-view></router-view>

    <div class="time-entries">
      <p v-if="!plans.length"><strong>还没有任何计划</strong></p>

      <div class="list-group">
      <!-- 
        v-for循环，注意参数顺序为(item,index) in items
       -->
        <a class="list-group-item" v-for="(plan,index) in plans">
          <div class="row">
            <div class="col-sm-2 user-details">

            
            <!-- `:src`属性，这个是vue的属性绑定简写`v-bind`可以缩写为`:`
             比如a标签的`href`可以写为`:href`
            并且在vue的指令里就一定不要写插值表达式了(`:src={{xx}}`)，vue自己会去解析
             -->

              <img :src="plan.avatar" class="avatar img-circle img-responsive" />
              <p class="text-center">
                <strong>
                  {{ plan.name }}
                </strong>
              </p>
            </div>

            <div class="col-sm-2 text-center time-block">
              <h3 class="list-group-item-text total-time">
                <i class="glyphicon glyphicon-time"></i>
                {{ plan.totalTime }}
              </h3>
              <p class="label label-primary text-center">
                <i class="glyphicon glyphicon-calendar"></i>
                {{ plan.date }}
              </p>
            </div>

            <div class="col-sm-7 comment-section">
              <p>{{ plan.comment }}</p>
            </div>

            <div class="col-sm-1">
              <button
                class="btn btn-xs btn-danger delete-button"
                @click="deletePlan(index)">
              X
              </button>
            </div>

          </div>
        </a>

      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'TimeEntries',
    computed: {
      plans () {
        return this.$store.state.list
      }
    },
    methods: {
      deletePlan (idx) {
        this.$store.dispatch('decTotalTime', this.plans[idx].totalTime)
        this.$store.dispatch('deletePlan', idx)
      }
    }
  }
</script>
<style lang="less">
  .list-group {
    padding: 20px 0;

    > a {
      display: block;
      margin: 10px 0;
      background-color: #f8f8f8;
      position: relative;
      .close {
        position: absolute;
        top: 0;
        right: 0;
        cursor: pointer;
        z-index: 2;
      }
    }
  }
  .avatar {
    height: 75px;
    margin: 0 auto;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .user-details {
    background-color: #f5f5f5;
    border-right: 1px solid #ddd;
    text-align: center;
    padding: 10px;

    p{
      margin-bottom: 0
    }

    img{
      max-width: 100%;
      border-radius: 50%;
    }
  }
  .time-block {
    padding: 10px 0;
    text-align: center;
  }
  .comment-section {
    padding: 20px;
  }
</style>
