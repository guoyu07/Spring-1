const timeMap = {
  toMonth: 1000 * 60 * 60 * 24 * 30,
  toWeek: 1000 * 60 * 60 * 24 * 7,
  toDay: 1000 * 60 * 60 * 24,
  toHour: 1000 * 60 * 60,
  toMinute: 1000 * 60
}

export default {
  methods: {
    _translateTime (ms) {
      const {
        toMinute,
        toHour,
        toDay,
        toWeek,
        toMonth
      } = timeMap
      if (ms > toMonth) {
        return Math.round(ms / toMonth) + ' 月'
      } else if (ms > toWeek) {
        return Math.round(ms / toWeek) + ' 周'
      } else if (ms > toDay) {
        return Math.round(ms / toDay) + ' 天'
      } else if (ms > toHour) {
        return Math.round(ms / toHour) + ' 小时'
      } else if (ms > toMinute) {
        return Math.round(ms / toMinute) + ' 分'
      } else {
        return Math.round(ms / 1000) + ' 秒'
      }
    }
  }
}
