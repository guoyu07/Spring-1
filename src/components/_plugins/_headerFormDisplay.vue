<template>
      <!-- 新建应用时，是一个字符串，非选取的对象 -->
  <el-form-item
    :label="formItem.name"
    :class="formItem.value.type === 'search_bar' || formItem.value.type === 'table' ? 'blockElement' : ''">
    <!-- {{typeof item[formItem.id]}} -->
    <template v-if="item[formItem.id]">
      <span v-if="formItem.value.type === 'dict'">
        <span v-if="item && typeof item[formItem.id] === 'string'">{{ item && item[formItem.id] }}</span>
        <span v-else>
          {{ item && item[formItem.id][formItem.value.source.res.show_key] }}
        </span>
      </span>

      <span v-else-if="formItem.value.type === 'dicts'">
        <span v-for="(span, spanindex) in item && item[formItem.id]">
          {{ span[formItem.value.source.res.show_key] }}
          <span v-if="spanindex === (item[formItem.id].length - 1)"></span>
          <span v-else> | </span>
        </span>
      </span>

      <span v-else-if="formItem.value.type === 'FKs'">
        <span v-for="(span, spanindex) in item && item[formItem.id]">
          {{ span.name }}
          <span v-if="spanindex === (item[formItem.id].length - 1)"></span>
          <span v-else> | </span>
        </span>
      </span>

      <span v-else-if="formItem.value.type === 'arr' || formItem.value.type === 'enums'">
        <span v-for="(span, spanindex) in item && item[formItem.id]">
          {{ span }}
          <span v-if="spanindex === (item[formItem.id].length - 1)"></span>
          <span v-else> | </span>
        </span>
      </span>

      <span v-else-if="formItem.value.type === 'str' || formItem.value.type==='enum' || formItem.value.type==='int' || formItem.value.type==='date' || formItem.value.type==='datetime'">
        {{  item && item[formItem.id] }}
      </span>

      <el-table
        v-else-if="formItem.value.type === 'table'"
        :data="item[formItem.id]">
        <el-table-column
          v-for="col in formItem.value.attr_list"
          :prop="col.id"
          :label="col.name">
        </el-table-column>
      </el-table>

      <el-table
        class="margin-bottom"
        v-else-if="formItem.value.type === 'search_bar'"
        :data="item[formItem.id]">
        <el-table-column
          v-for="col in formItem.value.source.data.params.filter(param => {return param.value.type === 'input'})"
          :prop="col.id"
          :label="col.name">
        </el-table-column>
      </el-table>
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
