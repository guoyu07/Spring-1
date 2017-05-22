<template>
  <div>
    <div class="form-block" v-for="formBlock in formData">
      <h5>{{formBlock.name}}</h5>
      <span v-for="formItem in formBlock.value">
        <form-body
          :item="item"
          :form-item="formItem"
          :whole="whole"
          :index="index"
          :message="message"
          :body-table="bodyTable"
          :header-table="headerTable"
          :value-id="valueId">
        </form-body>
      </span>
    </div>
  </div>
</template>

<script>
  import formBody from './_formBody'
  export default {
    props: {
      item: { type: Object },
      whole: { type: Object },
      message: { type: Object },
      formData: { type: Array },
      headerTable: { type: Boolean },
      bodyTable: { type: Boolean },
      index: { type: Number },
      valueId: { type: String }
    },

    data () {
      return {
      }
    },
    created () {},

    methods: {},

    components: {
      formBody
    }
  }
</script>
<style>
  .blockElement {
    width: 100%;
    display: flex;
  }
  .blockElement .el-form-item__content {
    width: 50%;
    width:-moz-calc(100% - 85px);
    width:-webkit-calc(100% - 85px);
    width: calc(100% - 85px);
  }
  .help-block {
    font-size: 12px;
    color: #666;
    margin: 0.5em 0 0;
    line-height: 1.2;
  }
</style>
