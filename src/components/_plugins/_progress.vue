<template>
  <div>
    <div class="progressWarp">
      <ul class="progress-bar">
        <li v-for="(item, index) in proConfig[progress.pkey]" class="progress-step" :class="[{ active: item.value < ing }, { ing: item.value === ing }]">
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
    },
    data () {
      return {
        step: 0,
        proConfig: {
          equipment_on: [
            {
              value: 1,
              list: [{
                tkey: 'start',
                tname: '选取设备'
              }]
            },
            {
              value: 2,
              list: [{
                tkey: 'deviceInfo',
                tname: '填写上架信息'
              }, {
                tkey: 'ipinfo',
                tname: '填写IP信息'
              }]
            },
            {
              value: 3,
              list: [{
                tkey: 'approve',
                tname: '运维主管审批'
              }]
            },
            {
              value: 4,
              list: [{
                tkey: 'netLine',
                tname: '准备网线连接'
              }, {
                tkey: 'installDB',
                tname: '安装数据库'
              }, {
                tkey: 'deviceMove',
                tname: '设备搬迁/挂牌及配置'
              }]
            }
          ],
          import_device: [
            {
              value: 1,
              list: [{
                tkey: 'start',
                tname: '填写入库单'
              }]
            },
            {
              value: 2,
              list: [{
                tkey: 'approve',
                tname: '审批'
              }]
            }
          ],
          alter_device: [
            {
              value: 1,
              list: [{
                tkey: 'start',
                tname: '填写变更申请单'
              }]
            },
            {
              value: 2,
              list: [{
                tkey: 'approve',
                tname: '审批'
              }]
            }
          ],
          host_apply: [
            {
              value: 1,
              list: [{
                tkey: 'start',
                tname: '填写入库单'
              }]
            },
            {
              value: 2,
              list: [{
                tkey: 'restart',
                tname: '准备服务器资源'
              }]
            },
            {
              value: 3,
              list: [{
                tkey: 'approve',
                tname: '资源审批'
              }]
            },
            {
              value: 4,
              list: [{
                tkey: 'assignIP',
                tname: '分配虚拟机IP'
              }]
            },
            {
              value: 5,
              list: [{
                tkey: 'createVM',
                tname: '创建虚拟机'
              }]
            }
          ]
        }
      }
    },

    methods: {
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
        for (const item of this.proConfig[this.progress.pkey]) {
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
        left: 0;
        z-index: 2;
        transform: rotate(-35deg);
        transform-origin: -155% -155%;
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
        }
      }

      &.ing {
        .detail {
          color: @success;
        }

        &::before {
          background-color: @success;
          animation: ing 2s infinite;
          border: none;
        }
      }

      &::before {
        content: '';
        position: absolute;
        top: -4px;
        // left: 8px;
        display: block;
        // margin-top: -6px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 1px solid @activeColor;
        background-color: #fff;
      }
    }
  }

  @keyframes ing {
    0% {
        transform: scale(1.2);
    }
    50% {
        transform: scale(1.1);
    }
    100% {
        transform: scale(1.2);
    }
  }
</style>
