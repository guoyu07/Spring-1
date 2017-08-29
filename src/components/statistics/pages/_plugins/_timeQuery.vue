<template>
  <div class="time-query">
    <el-popover
      ref="timeQuery"
      placement="bottom"
      width="400"
      trigger="click">
      <el-form label-width="80px" label-position="top">
        <el-form-item label="时间类型">
          <el-select v-model="timeQueryBuffer.type" size="small">
            <el-option label="超过 ${time} 之前" value="before"></el-option>
            <el-option label="在过去 ${time} 之内" value="after"></el-option>
            <el-option label="在 ${start} 和 ${end} 之间" value="range"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="具体">
          <template v-if="['before', 'after'].includes(timeQueryBuffer.type)">
            <span>{{ timeQueryBuffer.type === 'before' ? '在过去的' : '超过' }}</span>
            <el-input-number v-model="timeQueryBuffer.time" :min="1" size="small"></el-input-number>
            <el-select v-model="timeQueryBuffer.unit" size="small" style="width: 80px">
              <el-option label="小时" value="h"></el-option>
              <el-option label="天" value="d"></el-option>
              <el-option label="周" value="w"></el-option>
              <el-option label="月" value="m"></el-option>
            </el-select>
            <span>{{ timeQueryBuffer.type === 'before' ? '之内' : '之前' }}</span>
          </template>
          <template v-else="timeQueryBuffer.type === 'range'">
            <el-date-picker
              v-model="timeQueryBuffer.s_date"
              type="date"
              placeholder="起始日期"
              ref="startDate"
              size="small"></el-date-picker>
            至
            <el-date-picker
              v-model="timeQueryBuffer.e_date"
              type="date"
              placeholder="终止日期"
              ref="endDate"
              size="small"></el-date-picker>
          </template>
        </el-form-item>
      </el-form>
    </el-popover>
    <el-button v-popover:timeQuery icon="fa-clock-o" class="margin-bottom">
      <span v-show="timeQueryBuffer.type === 'before'">在过去 {{timeQueryBuffer.time}}{{timeQueryBuffer.unit}} 之内</span>
      <span v-show="timeQueryBuffer.type === 'after'">超过 {{timeQueryBuffer.time}}{{timeQueryBuffer.unit}} 之前</span>
      <span v-show="timeQueryBuffer.type === 'range'">在 <span>{{ timeQueryBuffer.s_date ? `${timeQueryBuffer.s_date.getFullYear()}-${timeQueryBuffer.s_date.getMonth() + 1}-${timeQueryBuffer.s_date.getDate()}` : '-&infin;' }}</span>—<span>{{ timeQueryBuffer.e_date ? `${timeQueryBuffer.e_date.getFullYear()}-${timeQueryBuffer.e_date.getMonth() + 1}-${timeQueryBuffer.e_date.getDate()}` : '&infin;' }}</span> 之间</span>
    </el-button>
  </div>
</template>

<script>
  export default {
    props: {
      timeQuery: Object
    },

    data () {
      return {
        timeQueryBuffer: this.timeQuery
      }
    },

    watch: {
      timeQueryBuffer: {
        handler (val) {
          this.$emit('change-timequery', { val })
        },
        deep: true
      }
    }
  }
</script>

<style>
  .time-query {
    position: absolute;
    top: 16px;
    right: 20px;
    z-index: 99;
  }
</style>