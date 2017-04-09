<template>
  <div>
    <div class="form-block" v-for="formBlock in formData">
      <!-- <h5>{{formBlock.name}}</h5> -->
      <el-form-item
        v-for="formItem in formBlock.value"
        :label="formItem.name">

         <span v-if="formItem.value.type === 'dict' || formItem.value.type==='FK'"> {{ item[formItem.id]['name'] }}</span> <!-- 这个name报错，回头看看dict和FK的格式 -->

        <span v-else-if="formItem.value.type === 'dicts' || formItem.value.type === 'FKs'">
          <span v-for="span in item[formItem.id]">{{ span.name }}</span>
        </span>

        <span v-else-if="formItem.value.type === 'arr'">
          <span v-for="span in item[formItem.id]">{{ span }}</span>
        </span>

        <!-- <span v-else-if="formItem.value.type === 'search_bar'">
          <pre>{{ item[formItem.id] }}</pre>
        </span> -->

        <span v-else-if="formItem.value.type === 'str' || formItem.value.type==='enum' || formItem.value.type==='int'">
          {{ item[formItem.id] }}
        </span>

      </el-form-item>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      item: { type: Object },
      index: { type: Number },
      formData: { type: Array }
    },

    data () {
      return {
      }
    },
    created () {
    },

    methods: {
    }
  }
</script>
<style lang="less" scoped>
  .form-block {
    font-size: 0;
    background-color: #f9f9f9;
    border-radius: 12px;
    h5 {
      font-size: 12px;
      padding: 5px;
    }
    .el-form-item {
      margin: 0;
      width: 33.33%;
    }
  }

</style>
