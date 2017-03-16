<template>
  <div>
    <div class="progressWarp">
      <ul class="progress-bar">
        <li v-for="(item, index) in proConfig[progress.pkey]" class="progress-step" :class="[{ active: item.value < steping }, { ing: item.value === steping }]">
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
        let postData = {
          action: 'activiti/task/form',
          method: 'GET',
          data: {
            pkey: 'host_apply',
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
      steping: function () {
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

<style scoped>
  .active {
    color: #03A9F4;
  }

  .progressWarp {
    width: 86%;
    margin: 0 auto;
    display: flex;
    position: relative;
    min-height: 150px;
    padding-top: 20px;
    /*font-family: serif;*/
  }

  .progress-bar {
    display: flex;
    flex-wrap: nowrap;
    padding: 0;
    padding-right: 3%;
    position: relative;
    height: 3px;
    width: 100%;
    /*margin-top: 50px;*/
    margin: 100px 0 28px;
    width: 100%;
    /*min-width: 627px;*/
    box-shadow: none!important;
  }

  .progress-bar{
    content: '';
    width: 100%;
    height: 3px;
    background-color: #00c0ef;
    position: absolute;
    top: 0;
    left: -2%;
  }

  .progress-bar::before {
    position: absolute;
    top: 50%;
    left: -21px;
    display: block;
    content: '';
    margin-top: -9px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background-color: #00c0ef;
  }

  .progress-bar::after {
    content: '';
    height: 10px;
    border-left: 20px solid #00c0ef;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
    position: absolute;
    top: 50%;
    right: -20px;
    margin-top: -10px;
  }

  .progress-bar li {
    list-style: none;
    width: 160px;
    margin: 10px;
    position: relative;
  }

  .progress-bar li .detail {
    width: 20px;
    height: auto;
    height: 30px;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    transform: rotate(-35deg);
    transform-origin: -155% -155%;
    white-space: nowrap;
    color: #696969;
    text-align: center;
  }

  .progressWarp ul.progress-bar li:before{
    content: '';
    position: absolute;
    top: -8px;
    left: 8px;
    display: block;
    margin-top: -6px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 1px solid #00c0ef;
    background-color: #fff;
  }

  .progressWarp ul.progress-bar li .detail{
    font-size: 13px;
    margin: 0;
  }

  .progressWarp ul.progress-bar li .detail p{
    color: #a5a5a5;
    font-weight: normal;
    font-size: 10px;
    margin: 0;
  }

  .progressWarp ul.progress-bar li.active .detail{
    font-size: 13px;
    color: #00c0ef;
  }

  .progressWarp ul.progress-bar li.active:before {
    background-color: #00c0ef;
    border-color: #fff;
  }

  .progressWarp ul.progress-bar li.ing .detail{
    font-size: 13px;
    color: #13ce66;
  }

  .progressWarp ul.progress-bar li.ing:before{
    background-color: #13ce66;
    animation: ing 2s infinite;
  }
  @keyframes ing {
    0% {
        transform:scale(1.3);
    }
    50% {
        transform:scale(0.8);
    }
    100% {
        transform:scale(1.3);
    }
  }
</style>
