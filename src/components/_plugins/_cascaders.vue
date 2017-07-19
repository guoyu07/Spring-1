<template>
  <div>
    <!-- hello cascaders -->
    {{strucData.value.regex[0].attr}}
    <el-select
      v-model="selectValue[0]"
      @change="onChange"
      :placeholder="strucData.value.regex[0].attr">
      <el-option
        v-for="item in strucData.value.regex"
        :key="item.value"
        :label="item.label"
        :value="item">
      </el-option>
    </el-select>
    <template
      v-for="(selected, index) in selectValue"
      v-if="selected && selected.children">
      {{selected.children[0].attr}}
      <el-select
        v-model="selectValue[index + 1]"
        @change="onChange"
        :placeholder="selected.children[0].attr">
        <el-option
          v-for="item in selected.children"
          :key="item.value"
          :label="item.label"
          :value="item">
        </el-option>
      </el-select>
    </template>
  </div>
</template>
<script>
  export default {
    props: {
      vmodel: { type: Object },
      whole: { type: Object },
      message: { type: Object },
      strucData: { type: Object },
      index: { type: Number },
      tableIndex: { type: Number },
      bodyTable: { type: Boolean },
      headerTable: { type: Boolean }
    },
    data () {
      return {
        selectValue: []
      }
    },
    created () {
    },
    watch: {
      // 'selectValue': 'groupChange'
    },
    methods: {
      onChange (val) {
        console.log(val)
        if (!val) return
        this.vmodel[this.strucData.id] = []
        this.selectValue.map((selected, index) => {
          if (selected.attr === val.attr) { // 用 attr 区分当前选值，所以 attr 在当前字段需唯一
            this.selectValue.splice(index + 1, this.selectValue.length - index - 1)
          }
          this.vmodel[this.strucData.id].push({
            label: selected.label,
            value: selected.value,
            attr: selected.attr
          })
        })
      }
    }
  }
</script>
