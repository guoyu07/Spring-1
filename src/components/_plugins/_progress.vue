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
      // this.getFilteredList()
      // console.log(this.progress.taskList)
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
        this.proConfig = []
        let alltasks = []
        // let alltasksIndex = []
        let valueIndex = 0
        this.proConfig = this.progress.taskList.reduce((pre, cur, index, arr) => {
          if (!alltasks.includes(cur.tkey)) {
            alltasks.push(cur.tkey)
            // let valueIndex = index
            // if (alltasksIndex.includes(index)) valueIndex = index + 1
            // alltasksIndex.push(valueIndex)
            pre.push({
              value: valueIndex++,
              list: [{
                tkey: cur.tkey,
                tname: cur.tname
              }]
            })
            // cur.action长度大于1 并且 cur.action 里的 expression 有重复数据的都是并发任务
            if (cur.action.length > 1) {
              // 找出所有的 expression
              const expres = cur.action.reduce((p, c) => {
                p.push(c.expression)
                return p
              }, [])
              // 找出有重复的 expression
              let repeatExpre = []
              for (let i = 0; i < expres.length; i++) {
                if (expres.indexOf(expres[i]) !== expres.lastIndexOf(expres[i]) && !repeatExpre.includes(expres[i])) {
                  repeatExpre.push(expres[i])
                }
              }
              if (repeatExpre.length) {
                // 每一个重复的 expresssion 都是并发任务
                repeatExpre.map(expression => {
                  let data = {}
                  data.list = []
                  const leng = cur.action.length
                  for (var i = 0; i < leng; i++) {
                    if (cur.action[i].expression === expression) {
                      // alltasksIndex.push(index + 1)
                      // data.value = index + 1
                      data.value = valueIndex++
                      alltasks.push(cur.action[i].target)
                      arr.map(task => {
                        if (task.tkey === cur.action[i].target) {
                          data.list.push({
                            tkey: task.tkey,
                            tname: task.tname
                          })
                        }
                      })
                    }
                  }
                  pre.push(data)
                })
              }
            }
          }
          return pre
        }, [])
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
    margin: 0 15px;
    position: relative;
    min-height: 150px;
    padding-top: 20px;
  }

  .progress-bar {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-around;
    // height: 3px;
    width: 100%;
    margin-top: 80px;
    padding: 0;
    padding-right: 3%;
    // background-color: @activeColor;
    border-bottom: 3px solid @activeColor;
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
      // width: 18px;
      // height: 18px;
      border-radius: 50%;
      // background-color: @activeColor;
      border: 10px solid @activeColor;
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
        left: 12px;
        z-index: 2;
        padding-left: 4px;
        transform: rotate(-35deg);
        transform-origin: -120% -30%;
        white-space: nowrap;
        color: lighten(@textColor, 30%);
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
          color: lighten(@activeColor, 20%);
        }

        &::before {
          background-color: lighten(@activeColor, 20%);
          -webkit-print-color-adjust: exact;
          border: none;
          content: "\f00c";
          // content: "\f058";
          font: normal normal normal 14px/1 FontAwesome;
          color: #fff;
          font-size: 10px;
          text-align: center;
        }
      }

      &.ing {
        .detail {
          color: @activeColor;
        }

        &::before {
          // background-color: @activeColor;
          animation: ing .8s infinite;
          border: 7px solid @activeColor;
        }
      }

      &::before {
        content: '';
        position: absolute;
        top: -7px;
        // left: 8px;
        display: block;
        // margin-top: -6px;
        padding-top: 3px;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        border: 2px solid lighten(@textColor, 30%);
        background-color: #fff;
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
