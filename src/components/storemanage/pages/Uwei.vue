this.applyData && this.applyData.body.map((item, k) => {
  if (this.assignForm.body[k] && this.assignForm.body[k].idcrack) {
    let takedData = {}
    takedData.id = this.assignForm.body[k].idcrack.instanceId
    takedData.taked = []
    const uHeight = this.assignForm.body[k].idcrack.u_info.jgUHeight
    for (let i = 1; i <= uHeight; i++) {
      if (this.assignForm.body[k].idcrack.u_info.assetList.length !== 0) {
        if (this.assignForm.body[k].idcrack.u_info.assetList.every(list => { return i < list.beginU || i > list.endU })) {
          takedData.taked.push(i)
        }
      }
    }
    if (this.idcrackTaked.length === 0) {
      this.idcrackTaked.push(takedData)
    } else if (!this.idcrackTaked.some(item => { return takedData.id === item.id })) {
      this.idcrackTaked.push(takedData)
    }
    for (let i = 1; i <= uHeight; i++) {
      if (this.assignForm.body[k].idcrack.u_info.assetList.length === 0) {
        this.assignForm.body[k].idcracku = 1
      } else {
        for (const takedata of this.idcrackTaked) {
          if (takedata.id === this.assignForm.body[k].idcrack.instanceId) {
            const iend = +this.applyData.header.host_list[k].u_num + i - 1
            // 判断 i iend(U位末端) 都在未被占用的范围内
            if (takedata.taked.includes(i) && takedata.taked.includes(iend)) {
              this.assignForm.body[k].idcracku = i
              for (let a = i; a <= iend; a++) {
                const index = takedata.taked.indexOf(a)
                takedata.taked.splice(index, 1)
              }
              return false
            }
          }
        }
      }
    }
  }
})
