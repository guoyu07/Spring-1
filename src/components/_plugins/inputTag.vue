<style lang="less" scoped>
  .el-input-tag {
    border: 1px solid #bfcbd9;
    border-radius: 4px;
    .el-tag {
      margin-left: 4px;
    }
    input {
      border: none;
      padding-left: 4px;
    }
  }
</style>

<template>
  <div class="el-input-tag" @click="$refs.input.focus()">
    <el-tag v-for="tag in tags" :key="tag"
      :closable="true" :close-transition="true"
      @close="close(tag)"> {{ tag }}
    </el-tag>
    <input type="text" v-model="inputValue" ref="input"
      @keyup.enter="inputConfirm" @blur="inputConfirm"/>
  </div>
</template>

<script>
  export default {
    name: 'elInputTag',
    props: {
      tags: {
        type: Array,
        default: () => []
      }
    },
    data () {
      return {
        inputValue: ''
      }
    },
    methods: {
      close (tag) {
        this.tags.splice(this.tags.indexOf(tag), 1)
      },
      inputConfirm () {
        const tag = this.inputValue
        if (tag && this.tags.indexOf(tag) === -1) {
          this.tags.push(tag)
        }
        this.inputValue = ''
      }
    }
  }
</script>
