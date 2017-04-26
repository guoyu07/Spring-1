<template>
  <div>
    <div class="progressWarp">
      <ul class="progress-bar">
        <li v-for="(item, index) in proConfig" class="progress-step" :class="[{ active: item.value < ing }, { ing: item.value === ing }]">
          <div class="detail">
            <div v-for="(step, stepindex) in item.list">
              {{ step.tname }}
              <p v-if="step.time">{{ step.time }}</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      progress: { type: Object }
    },
    created () {
      this.getFilteredList()
      this.renderPro()
    },
    watch: {
      'progress': {
        handler: 'renderPro',
        deep: true
      }
    },
    data () {
      return {
        step: 0,
        proConfig: []
      }
    },

    methods: {
      renderPro () {
        // TODO: 这里只写了简单的流程任务数据，未判断是否为并发任务
        this.proConfig = []
        // let allcontasks = []
        this.progress.taskList.forEach((item, k) => {
          let data = {
            value: k,
            list: [{
              tkey: item.tkey,
              tname: item.tname
            }]
          }
          this.proConfig.push(data)
        //   let contasks = []
        //   if (item.next.length) {
        //     item.next.map(next => {
        //       if (next.pass === 0) {
        //         if (!allcontasks.includes(next.tkey)) {
        //           allcontasks.push(next.tkey)
        //           contasks.push(next.tkey)
        //         }
        //       }
        //     })
        //   }
          // else { // 这是最后一步的tkey,最后一步的next为空数组
          //   // contasks.push(item.tkey)
          // }
          // console.log(contasks)
          // let data = {
          //   value: k,
          //   list: []
          // }
          // this.progress.taskList.map(task => {
          //   if (contasks.includes(task.tkey)) {
          //     data.list.push({
          //       tkey: task.tkey,
          //       tname: task.tname
          //     })
          //     if (!this.proConfig.some(config => { return config.value === k })) {
          //       this.proConfig.push(data)
          //     }
          //   }
          // })
        })
      },
      getFilteredList () {
        console.log(this.progress.taskList)
        let postData = {
          action: 'activiti/task/form',
          method: 'GET',
          data: {
            pkey: this.progress.pkey,
            // tkey: "流程任务key(POST/GET[GET可不填此参数])",
            form: {}
          }
        }
        this.http.post('', this.parseData(postData)).then((res) => {
          console.log(res)
        })
      }
    },

    computed: {
      ing () {
        for (const item of this.proConfig) {
          for (const list of item.list) {
            if (this.progress.task === list.tkey) {
              return item.value
            }
          }
        }
      }
    }
  }
</script>

<style scoped lang="less">
  @import url("./../../assets/css/variables.less");
  @activeColor: #00c0ef;

  .active {
    color: @activeColor;
  }

  .progressWarp {
    // width: 86%;
    margin: 0 auto;
    display: flex;
    position: relative;
    min-height: 150px;
    padding-top: 20px;
  }

  .progress-bar {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-around;
    height: 3px;
    width: 100%;
    margin-top: 80px;
    padding: 0;
    padding-right: 3%;
    background-color: @activeColor;
    position: absolute;

    &::before,
    &::after {
      position: absolute;
      top: 50%;
      content: '';
    }

    &::before {
      left: -18px;
      display: block;
      margin-top: -9px;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background-color: @activeColor;
    }

    &::after {
      height: 10px;
      border-left: 20px solid @activeColor;
      border-top: 10px solid transparent;
      border-bottom: 10px solid transparent;
      right: -20px;
      margin-top: -10px;
    }

    li {
      list-style: none;
      /*width: 160px;*/
      // margin: 10px;
      position: relative;

      .detail {
        width: 20px;
        // height: auto;
        // height: 30px;
        position: absolute;
        top: 0;
        left: 14px;
        z-index: 2;
        transform: rotate(-35deg);
        transform-origin: -114% -78%;
        white-space: nowrap;
        color: #696969;
        text-align: center;
        font-size: 13px;

        p {
          color: @activeColor;
          font-weight: normal;
          font-size: 10px;
          margin: 0;
        }
      }

      &.active {
        .detail {
          font-size: 13px;
          color: @activeColor;
        }

        &::before {
          background-color: @activeColor;
          border: none;
          content: '\2714';
          color: #fff;
          font-size: 10px;
          text-align: center;
        }
      }

      &.ing {
        .detail {
          color: @success;
        }

        &::before {
          background-color: @success;
          animation: ing .8s infinite;
          border: none;
        }
      }

      &::before {
        content: '';
        position: absolute;
        top: -6px;
        // left: 8px;
        display: block;
        // margin-top: -6px;
        padding-top: 3px;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        border: 2px solid #fff;
        background-color: #9e9e9e;
      }
    }
  }

  @keyframes ing {
    0% {
        transform: scale(1);
    }
    40% {
        transform: scale(.8);
    }
    100% {
        transform: scale(1);
    }
  }
</style>
