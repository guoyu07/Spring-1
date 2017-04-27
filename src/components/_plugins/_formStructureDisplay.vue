<template>
  <div>
    <div class="form-block" v-for="formBlock in formData">
      <!-- <h5>{{formBlock.name}}</h5> -->
      <el-form-item
        v-for="formItem in formBlock.value"
        :label="formItem.name">

        <span v-if="formItem.value.type === 'dict'">
          {{ item && item[formItem.id][formItem.value.source.res.show_key] }}
        </span>

        <span v-else-if="formItem.value.type === 'dicts'">
          <span v-for="span in item && item[formItem.id]">
            {{ span[formItem.value.source.res.show_key] }}
          </span>
        </span>

         <span v-else-if="formItem.value.type==='FK'"> {{ item[formItem.id]['name'] }}</span>

        <span v-else-if="formItem.value.type === 'FKs'">
          <span v-for="span in item[formItem.id]">{{ span.name }}</span>
        </span>

        <template v-else-if="formItem.value.type === 'arr'">
          <span class="arr-span" v-for="span in item[formItem.id]">
            {{ span }}
          </span>
        </template>

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
      // width: 33.33%;
      min-width: 280px;
      display: inline-flex;
    }
    .arr-span {
      margin-right: 10px;
    }
  }

</style>
