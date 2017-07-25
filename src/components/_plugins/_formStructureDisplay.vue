<template>
  <div>
    <div class="form-block" v-for="formBlock in formData">
      <!-- <h5>{{formBlock.name}}</h5> -->
      <template v-for="formItem in formBlock.value">
        <el-form-item
          v-if="(showFormItem(formItem, postForm, messageData, historyTask, currentTask, index) && item[formItem.id]) || currentTask === 'current'"
          :label="formItem.name"
          :class="formItem.value.type === 'search_bar' || formItem.value.type === 'table' || (formItem.isAlias && formItem.value.type !== 'users') ? 'blockElement' : ''">

          <span v-if="formItem.value.type === 'dict'">
            {{ item && item[formItem.id][formItem.value.source.res.show_key] }}
          </span>

          <span v-else-if="formItem.value.type === 'dicts'">
            <span v-for="(span, spanindex) in item && item[formItem.id]">
              {{ span[formItem.value.source.res.show_key] }}
              <span v-if="spanindex === (item[formItem.id].length - 1)"></span>
              <span v-else> | </span>
            </span>
          </span>

          <!-- <span v-else-if="formItem.value.type==='FK'"> {{ item[formItem.id]['name'] }}</span>

          <span v-else-if="formItem.value.type === 'FKs'">
            <span v-for="span in item[formItem.id]">
              {{ span.name }}
              <span v-if="spanindex === (item[formItem.id].length - 1)"></span>
              <span v-else> | </span>
            </span>
          </span> -->

          <template v-else-if="formItem.value.type === 'arr'">
            <span class="arr-span" v-for="(span, spanindex) in item[formItem.id]">
              {{ span }}
              <span v-if="spanindex === (item[formItem.id].length - 1)"></span>
              <span v-else> | </span>
            </span>
          </template>

          <template v-else-if="formItem.value.type === 'cascade'">
            <span v-for="(span, spanindex) in item[formItem.id]">
              {{ span }}
              <span v-if="spanindex === (item[formItem.id].length - 1)"></span>
              <span v-else> /</span>
            </span>
          </template>

          <!-- <span v-else-if="formItem.value.type === 'search_bar'">
            <pre>{{ item[formItem.id] }}</pre>
          </span> -->

          <span v-else-if="formItem.value.type === 'str' || formItem.value.type==='enum' || formItem.value.type==='int' || formItem.value.type==='date' || formItem.value.type==='datetime'">
            {{ item[formItem.id] }}
          </span>

          <el-table
            v-else-if="formItem.value.type === 'table'"
            :data="item[formItem.id]">
            <el-table-column
              v-for="col in formItem.value.attr_list"
              :label="col.name">
              <template scope="scope">
                <!-- <pre>{{scope.row}}</pre> -->
                <span v-if="col.value.type === 'dict'">
                  <span v-if="typeof Object.assign({}, scope.row[col.id]) === 'object'">
                    {{ Object.assign({}, Object.assign({}, scope.row[col.id]))[col.value.source.res.show_key[0]] }}
                  </span>
                  <span v-else>{{ Object.assign({}, scope.row.header)[col.id] }}</span>
                </span>
                <span v-else-if="col.value.type === 'dicts'">
                  <span v-for="span in Object.assign({}, scope.row.header)[col.id]">{{span.name}}</span>
                </span>
                <span v-else-if="col.value.type === 'enums'">
                  <span v-for="span in Object.assign({}, scope.row.header)[col.id]">{{span}}</span>
                </span>
                <span v-else>{{ scope.row[col.id] }}</span>
                <!-- <span v-else>{{ Object.assign({}, scope.row.header)[col.id] }}</span> -->
              </template>
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

        </el-form-item>
      </template>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      item: { type: Object }, // item === messagerData.body[index]
      index: { type: Number },
      formData: { type: Array },
      postForm: { type: Object },
      messageData: { type: Object },
      currentTask: { type: String },
      historyTask: { type: String }
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
    background-color: #fbfcfd;
    border-radius: 12px;
    padding: 10px;
    h5 {
      font-size: 12px;
      padding: 5px;
    }
    .el-form-item {
      margin: 0;
      // width: 33.33%;
      min-width: 280px;
      display: inline-flex;
      // .el-form-item__content {
      //   line-height: 36px;
      // }
    }
    .arr-span {
      margin-right: 10px;
    }
  }

</style>
