<template>
  <el-dialog
    title="修改流程样式"
    v-model="styleProps.visible">
    <el-form label-width="80px">
      <el-form-item label="背景色">
        <color-picker v-model="colors"></color-picker>
      </el-form-item>
      <el-form-item label="图标">
        <el-input v-model="icon" style="width: 320px"></el-input>
      </el-form-item>
      <el-form-item label="预览">
        <div class="entry__icon">
          <span :class="`el-icon-${icon}`" :style="{ backgroundColor: colors.hex }"></span>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" icon="check" @click="onChangeStyle">OK</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { Swatches } from 'vue-color'

  // const defaultColor = {
  //   hex: '#167be0',
  //   a: 1
  // }

  export default {
    props: {
      styleProps: Object
    },

    data () {
      return {
        colors: this.styleProps.color,
        icon: this.styleProps.icon || 'fa-star'
      }
    },

    // computed: {
    //   colors: {
    //     getter () {
    //       return this.styleProps.color
    //     },
    //     setter (val) {}
    //   },
    //   icon () {
    //     return this.styleProps.icon || 'fa-star'
    //   }
    // },

    methods: {
      onChangeStyle () {
        let postData = {
          action: 'process/define',
          method: 'PUT',
          data: {
            pkey: this.styleProps.pkey,
            icon: this.icon,
            color: this.colors
          }
        }
        this.http.post('/activiti/', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.$message.success('已修改')
            this.styleProps.visible = false
          }
        })
      }
    },

    components: {
      colorPicker: Swatches
    }
  }
</script>

<style scoped>
  .entry__icon {
    justify-content: flex-start;
  }
</style>
