<template>
  <div>
    <div class="progressWarp">
      <ul class="progress-bar bg-aqua">
        <li v-for="(item, index) in proConfig" :class="[{ active: item.value < progress }, { ing: item.value === progress }]">
          <div class="detail">
            {{ item.label }}
            <p>{{ item.time }}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      progress: { type: Number }
    },
    data () {
      return {
        proConfig: [
          { label: '申请', value: 1 },
          { label: '审批', value: 2 },
          { label: 'IP资源管理', value: 3 },
          { label: 'DC管理', value: 4 },
          { label: '网络管理', value: 5 },
          { label: '存储', value: 6 },
          { label: '申请人核对', value: 7 },
          { label: '跳线管理', value: 8 },
          { label: '现场管理（出单）', value: 9 },
          { label: 'OS管理员', value: 10 },
          { label: '现场管理（上架）', value: 11 },
          { label: '申请人核对关单', value: 12 },
          { label: '上架完成', value: 13 }
        ]
      }
    },

    methods: {
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
  height: 150px;
  padding-top: 20px;
}

.progress-bar {
  display: flex;
  flex-wrap: nowrap;
  padding: 0;
  padding-right: 3%;
  position: relative;
  height: 3px;
  width: 100%;
  margin: 116px 0 28px;
  min-width: 627px;
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
  width: 100px;
  margin: 10px;
  position: relative;
}

.progress-bar li .detail {
  width: 20px;
  height: 30px;
  position: absolute;
  top: 0;
  left: 0;
  transform: rotate(-45deg);
  transform-origin: -155% -155%;
  white-space: nowrap;
  color: #696969;
}

.progressWarp ul.progress-bar li .detail:before{
  content: '';
  position: absolute;
  top: 50%;
  left: -30px;
  display: block;
  margin-top: -6px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid #00c0ef;
  background-color: #fff;
}

.progressWarp ul.progress-bar li .detail{
  font-size: 14px;
  margin: 0;
}

.progressWarp ul.progress-bar li .detail p{
  color: #a5a5a5;
  font-weight: normal;
  font-size: 12px;
  margin: 0;
}

.progressWarp ul.progress-bar li.active .detail{
  font-size: 14px;
  color: #39cccc;
}

.progressWarp ul.progress-bar li.active .detail:before {
  background-color: #00c0ef;
  border-color: #fff;
}

.progressWarp ul.progress-bar li.ing .detail{
  font-size: 14px;
  color: #4caf50;
}
</style>
