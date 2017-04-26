<template>
      <!-- 新建应用时，是一个字符串，非选取的对象 -->
  <el-form-item
    :label="formItem.name">
    <!-- {{typeof item[formItem.id]}} -->
    <template v-if="item[formItem.id]">
      <span v-if="formItem.value.type === 'dict'">
        <span v-if="item && typeof item[formItem.id] === 'string'">{{ item && item[formItem.id] }}</span>
        <span v-else>
          {{ item && item[formItem.id][formItem.value.source.res.show_key] }}
        </span>
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
    </template>
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
