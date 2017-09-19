<template>
  <el-dialog
    title="修改流程样式"
    v-model="styleProps.visible">
    <el-form label-width="80px">
      <el-form-item label="背景色">
        <span
          class="palette"
          v-for="color in colorOptions"
          :key="color">
          <input
            type="radio"
            v-model="bgColor"
            :value="color"
            name="palette"
            :id="color">
          </input>
          <label :for="color" :style="{ backgroundColor: color }"></label>
        </span>
      </el-form-item>
      <el-form-item label="图标">
        <el-input v-model="icon" style="width: 320px"></el-input>
      </el-form-item>
      <el-form-item label="预览">
        <div class="entry__icon">
          <span :class="`el-icon-${icon}`" :style="{ backgroundColor: bgColor }"></span>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" icon="check" @click="onChangeStyle">OK</el-button>
    </div>
  </el-dialog>
</template>

<script>
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
        colorOptions: ['#ff4949', '#da4d6d', '#f596aa', '#f7ba2a', '#278785', '#13ce66', '#167be0', '#9c90c2', '#947a6d', '#324057', '#8492a6', '#d3dce6'],
        bgColor: this.styleProps.bg_color,
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
            bg_color: this.bgColor
          }
        }
        this.http.post('/activiti/', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.$message.success('已修改')
            this.styleProps.visible = false
          }
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .entry__icon {
    justify-content: flex-start;

    span {
      transition: background-color .3s ease;
    }
  }

  .palette {
    input[type="radio"] {
      display: none;

      &:checked {
        & + label {
          border-radius: 50%;

          &::after {
            display: inline-block;
          }
        }
      }
    }

    label {
      width: 30px;
      height: 30px;
      display: inline-block;
      vertical-align: middle;
      border-radius: 4px;
      position: relative;
      transition: border-radius .3s ease;

      &:hover {
        opacity: .8;
        cursor: pointer;
      }

      &::after {
        content: '\f00c';
        font-family: FontAwesome;
        font-size: 10px;
        color: #fff;
        text-align: center;
        position: absolute;
        left: 0;
        right: 0;
        margin: 0 auto;
        top: 50%;
        transform: translateY(-50%);
        display: none;
      }
    }
  }
</style>
