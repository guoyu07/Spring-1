<template>
  <el-row type="flex" justify="end">
    <el-popover
      ref="timeQuery"
      placement="bottom"
      width="600"
      trigger="click">
      <el-select v-model="timeQuery.type" size="small">
        <el-option label="在过去 ${time} 之内" value="before"></el-option>
        <el-option label="超过 ${time} 之前" value="after"></el-option>
        <el-option label="在 ${start} 和 ${end} 之间" value="range"></el-option>
      </el-select>
      <template v-if="['before', 'after'].includes(timeQuery.type)">
        <span>{{ timeQuery.type === 'before' ? '在过去的' : '超过' }}</span>
        <el-input-number v-model="timeQuery.time" :min="1" size="small"></el-input-number>
        <el-select v-model="timeQuery.unit" size="small" style="width: 80px">
          <el-option label="分" value="min">分</el-option>
          <el-option label="小时" value="h"></el-option>
          <el-option label="天" value="d"></el-option>
          <el-option label="周" value="w"></el-option>
          <el-option label="月" value="m"></el-option>
        </el-select>
        <span>{{ timeQuery.type === 'before' ? '之内' : '之前' }}</span>
      </template>
      <template v-else="timeQuery.type === 'range'">
        <el-date-picker
          v-model="timeQuery.s_date"
          type="date"
          placeholder="起始日期"
          ref="startDate"
          size="small"></el-date-picker>
        至
        <el-date-picker
          v-model="timeQuery.e_date"
          type="date"
          placeholder="终止日期"
          ref="endDate"
          size="small"></el-date-picker>
      </template>
    </el-popover>
    <el-button v-popover:timeQuery icon="fa-clock-o" class="margin-bottom">
      <span v-show="timeQuery.type === 'before'">在过去{{timeQuery.time}}{{timeQuery.unit}}之内</span>
      <span v-show="timeQuery.type === 'after'">超过{{timeQuery.time}}{{timeQuery.unit}}之前</span>
      <span v-show="timeQuery.type === 'range'">在{{timeQuery.s_date}}—{{timeQuery.e_date}}之间</span>
    </el-button>
  </el-row>
</template>

<script>
  export default {
    data () {
      return {
        timeQuery: {
          type: 'before',
          time: 1,
          unit: 'min',
          s_date: '',
          e_date: ''
        }
      }
    }
  }
</script>