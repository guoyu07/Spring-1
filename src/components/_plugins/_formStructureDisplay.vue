<template>
  <div>
    <div class="form-block info-block" v-for="formBlock in formData">
      <!-- <h5>{{formBlock.name}}</h5> -->
      <template v-for="formItem in formBlock.value">
        <el-form-item
          v-if="(showFormItem(formItem, postForm, messageData, historyTask, currentTask, index) && item[formItem.id]) || currentTask === 'current'"
          :label="formItem.name"
          :label-width="historyTask === 'switch' ? '160px': ''"
          :class="['search_bar','table', 'richtext'].includes(formItem.value.type) || (formItem.isAlias && formItem.value.type !== 'users') ? 'blockElement' : ''">

          <span v-if="formItem.value.type === 'dict'">
            {{ item && item[formItem.id][formItem.value.source.res.show_key[0]] }}
          </span>

          <span v-else-if="formItem.value.type === 'dicts'">
            <span v-for="(span, spanindex) in item && item[formItem.id]">
              {{ span[formItem.value.source.res.show_key[0]] }}
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

          <span v-else-if="formItem.value.type === 'users'">
            <template v-if="!isEditing || !editing[formItem.id]">
              <span v-if="item[formItem.id] && item[formItem.id].user && item[formItem.id].user.userId" class="tooltip-link">{{item[formItem.id].user.userId}} <i class="el-icon-fa-user-circle"></i></span>
              <span v-else-if="item[formItem.id] && item[formItem.id].group && item[formItem.id].group.name" class="tooltip-link">{{ item[formItem.id].group.name}} <i class="el-icon-fa-users"></i></span>
              <span v-else>未指定</span>
              <!-- <i v-if="isEditing" @click="toggleEditable(formItem.id)" class="editable-field__indicator el-icon-edit text-info"></i> -->
            </template>
            <!-- <div v-if="isEditing && editing[formItem.id]">
              <span>
                <member-select
                  :vmodel="item"
                  :strucData="formItem">
                </member-select>
              </span>
              <i class="editable-field__indicator el-icon-check text-success" @click="onConfirmEdit(formItem.id)"></i>
              <i class="editable-field__indicator el-icon-close text-error" @click="toggleEditable(formItem.id)"></i>
            </div> -->
          </span>

          <span class="ql-editor" v-else-if="formItem.value.type === 'richtext'">
            <span v-html="item && item[formItem.id]">{{item && item[formItem.id]}}</span>
          </span>

          <el-table
            class="margin-bottom"
            v-else-if="formItem.value.type === 'table'"
            :data="item[formItem.id]">
            <el-table-column
              v-for="col in formItem.value.attr_list"
              :key="col.name"
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
            <!-- formItem.respectively_show ? item[formItem.id].slice(index, index + 1) :  -->
            <el-table-column
              v-for="col in formItem.value.source.data.params.filter(param => {return param.value.type === 'input'})"
              :key="col.id"
              :label="col.name">
              <!-- :prop="col.id" -->
              <template scope="scope">
                <span v-if="typeof scope.row[col.id] === 'string'">
                  {{scope.row[col.id]}}
                </span>
                <span v-else>
                  {{ Object.assign({}, scope.row[col.id]).name }}
                </span>
              </template>
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
    // background-color: #fbfcfd;
    // border-radius: 12px;
    // padding: 10px;
    h5 {
      font-size: 12px;
      padding: 5px;
    }
    .el-form-item {
      margin: 0;
      min-width: 280px;
      display: inline-flex;
      .el-form-item__content {
        line-height: 1;
        width: 200px;
        padding: 10px;
      }
    }
    .arr-span {
      margin-right: 10px;
    }
  }

</style>
