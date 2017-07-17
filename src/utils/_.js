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
  }
}
