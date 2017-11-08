<template>
  <el-form label-width="80px">
    <el-form-item
      label="按钮类型">{{ selectedAction.type }}</el-form-item>
    <el-form-item
      label="下载 URL"
      v-if="selectedAction.type === 'target'">
      <el-input size="small" v-model="selectedAction.url"></el-input>
    </el-form-item>
    <el-form-item
      label="按钮名称">
      <el-input size="small" v-model="selectedAction.name"></el-input>
    </el-form-item>
    <el-form-item
      label="触发类型"
      v-if="['auto', 'manual'].includes(selectedAction.type)">
      <el-select
        v-model="preset"
        @change="onActionChange(selectedAction)"
        value-key="name">
        <el-option
          v-for="(ac, index) of actionDefs"
          :key="index"
          :label="ac.name"
          :value="ac"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    props: {
      selectedAction: Object,
      actionDefs: Array,
      formActions: Array
    },

    data () {
      return {
        preset: {}
      }
    },

    watch: {
      actionDefs () {
        this.initPreset()
      }
    },

    methods: {
      initPreset () {
        this.preset = this.actionDefs.find((def) => {
          return this.formActions.some(ac => ac.id === def.id && ac.name === this.selectedAction.name)
        })
      },

      onActionChange (button) {
        let { id, desc } = this.preset
        console.log(`${this.selectedAction.name} - ${id}`)
        Object.assign(this.selectedAction, { id, desc })
      }
    }
  }
</script>
