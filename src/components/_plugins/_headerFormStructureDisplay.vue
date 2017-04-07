<template>
  <div>
    <div class="form-block" v-for="formBlock in formData">
      <h4>{{formBlock.name}}</h4>
      <div class="headerform">
        <el-form-item
          v-for="formItem in formBlock.value"
          :label="formItem.name">
          <span v-if="formItem.value.type === 'dict'"> {{ item && item[formItem.id].name }}</span>

          <span v-else-if="formItem.value.type === 'dicts' || formItem.value.type === 'FKs'">
            <span v-for="span in item && item[formItem.id]">{{ span.name }}</span>
          </span>

          <span v-else-if="formItem.value.type === 'arr'">
            <span v-for="span in item && item[formItem.id]">{{ span }}</span>
          </span>

          <span v-else>{{ item && item[formItem.id] }}</span>
        </el-form-item>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      item: { type: Object },
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
