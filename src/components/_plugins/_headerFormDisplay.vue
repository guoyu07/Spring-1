<template>
  <el-form-item
    :label="formItem.name">
    <span v-if="formItem.value.type === 'dict'">
      {{ item && item[formItem.id][formItem.value.source.res.show_key] }}
    </span>

    <span v-else-if="formItem.value.type === 'dicts'">
      <span v-for="span in item && item[formItem.id]">
        {{ span[formItem.value.source.res.show_key] }}
      </span>
    </span>

    <span v-else-if="formItem.value.type === 'FKs'">
      <span v-for="span in item && item[formItem.id]">{{ span.name }}</span>
    </span>

    <span v-else-if="formItem.value.type === 'arr'">
      <span v-for="span in item && item[formItem.id]">{{ span }}</span>
    </span>

    <span v-else>{{ item && item[formItem.id] }}</span>
  </el-form-item>
</template>

<script>
  export default {
    props: {
      item: { type: Object },
      formItem: { type: Object }
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
