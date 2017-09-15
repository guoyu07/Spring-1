<template>
      <!-- 新建应用时，是一个字符串，非选取的对象 -->
  <!-- <div class="history-block"> -->
    <el-form-item
      :label="hideName ? '' : formItem.name"
      :class="['search_bar','table', 'richtext'].includes(formItem.value.type) ? 'blockElement' : ''">
      <!-- {{typeof item[formItem.id]}} -->
      <template v-if="item[formItem.id]">
        <span v-if="formItem.value.type === 'dict'">
          <span v-if="item && typeof item[formItem.id] === 'string'">{{ item && item[formItem.id] }}</span>
          <span v-else>
            {{ item && item[formItem.id][formItem.value.source.res.show_key[0]] }}
          </span>
        </span>

        <span v-else-if="formItem.value.type === 'dicts'">
          <span v-for="(span, spanindex) in item && item[formItem.id]">
            {{ span[formItem.value.source.res.show_key[0]] }}
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
          {{ item && item[formItem.id] }}
        </span>

        <span v-else-if="formItem.value.type === 'users'">
          <template v-if="!isEditing || !editing[formItem.id]">
            <span v-if="item[formItem.id] && item[formItem.id].user && item[formItem.id].user.code" class="tooltip-link">{{item[formItem.id].user.userId}} <i class="el-icon-fa-user-circle"></i></span>
            <span v-else-if="item[formItem.id] && item[formItem.id].group && item[formItem.id].group.name" class="tooltip-link">{{ item[formItem.id].group.name}} <i class="el-icon-fa-users"></i></span>
            <span v-else>未指定</span>
            <i v-if="isEditing" @click="toggleEditable(formItem.id)" class="editable-field__indicator el-icon-edit text-info"></i>
          </template>
          <div v-if="isEditing && editing[formItem.id]">
            <span>
              <member-select
                :vmodel="item"
                :strucData="formItem">
              </member-select>
            </span>
            <i class="editable-field__indicator el-icon-check text-success" @click="onConfirmEdit(formItem.id)"></i>
            <i class="editable-field__indicator el-icon-close text-error" @click="toggleEditable(formItem.id)"></i>
          </div>
        </span>

        <span class="ql-editor" v-else-if="formItem.value.type === 'richtext'">
          <span v-html="item && item[formItem.id]">{{item && item[formItem.id]}}</span>
        </span>

        <el-table
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
      </template>
    </el-form-item>
  <!-- </div> -->
</template>

<script>
  import memberSelect from './_memberSelect'
  export default {
    props: {
      item: { type: Object },
      hideName: { type: Boolean },
      formItem: { type: Object },
      isEditing: { type: Boolean },
      keyData: { type: Object }
    },

    data () {
      return {
        editing: {},
        itemBuffer: ''
      }
    },
    created () {
      // console.log(this.keyData)
      this.$set(this.editing, this.formItem.id, false)
      this.itemBuffer = JSON.stringify(this.item)
    },

    methods: {
      toggleEditable (key) {
        this.editing[key] = !this.editing[key]
        const buffer = JSON.parse(this.itemBuffer)
        if (!this.editing[key]) this.item[key] = buffer[key]
      },
      onConfirmEdit (key) {
        this.editing[key] = false
        let data = {}
        data[key] = this.item[key]
        this.realtimeSubmit(data)
      },
      realtimeSubmit (data) {
        let postData = {
          action: 'modify/form/data',
          method: 'POST',
          data: {
            pid: this.keyData.pid,
            pkey: this.keyData.pkey,
            tkey: this.keyData.tkey,
            form: {
              header: data
            }
          }
        }
        this.http.post('/flow/', postData).then((res) => {
          if (res.status === 200) {
            this.$message.success('已修改！')
          }
        })
      }
    },

    components: {
      memberSelect
    }
  }
</script>
