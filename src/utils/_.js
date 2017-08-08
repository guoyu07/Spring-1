export default {
  _groupBy (arr, prop) {
    let hash = {}
    for (let i = 0; i < arr.length; i++) {
      if (!hash[arr[i][prop]]) hash[arr[i][prop]] = []
      hash[arr[i][prop]].push(arr[i])
    }
    return hash
  },

  _reverseGroupBy (obj, arr) {
    arr.length = 0
    for (let key in obj) {
      if (obj[key]) arr = [...arr, ...obj[key]]
    }
    return arr
  },

  _isEmpty (obj) {
    var hasOwnProperty = Object.prototype.hasOwnProperty

    if (obj === null) return true

    if (obj.length > 0) return false
    if (obj.length === 0) return true

    if (typeof obj !== 'object') return true

    for (var key in obj) {
      if (hasOwnProperty.call(obj, key)) return false
    }

    return true
  }
}
