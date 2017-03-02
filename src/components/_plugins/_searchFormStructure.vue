<template>
  <div>
    <!-- <div class="form-block" v-show="!isAdvanceSearch">
      <el-form-item label="关键词">
        <el-input
          v-model="searchKeys.searchKey"
          size="small"></el-input>
      </el-form-item>
    </div> -->
    <!-- v-show="isAdvanceSearch" -->
    <div class="form-block">
      <el-form-item v-for="formItem in searchKeyList" :label="formItem.name" :prop="formItem.id">
        <el-input
          v-if="formItem.value.type === 'str' || formItem.value.type === 'arr'"
          v-model="searchKeys[formItem.id]"
          size="small">
        </el-input>

        <el-input
          v-else-if="formItem.value.type === 'int'"
          v-model="searchKeys[formItem.id]"
          type="number"
          size="small">
        </el-input>

        <el-select
          v-else-if="formItem.value.type === 'enum'"
          v-model="searchKeys[formItem.id]"
          size="small">
          <el-option v-for="option in formItem.value.regex"
            :label="option"
            :value="option"></el-option>
        </el-select>

        <!-- <el-select
          v-else-if="formItem.value.type === 'arr'"
          v-model="searchKeys[formItem.id]"
          multiple
          filterable=""
          allow-create
          placeholder="请创建">
        </el-select> -->

        <div class="form-unit"
          v-else-if="formItem.value.type === 'FK' || formItem.value.type === 'FKs'">
          <el-select
            v-model="searchKeys[formItem.id][0]"
            size="small">
            <el-option v-for="option in formItem.value.external"
              :label="option.name"
              :value="option.org_attr"></el-option>
          </el-select>
          <el-input
            :disabled="!searchKeys[formItem.id][0]"
            v-model="searchKeys[formItem.id][1]"
            size="small">
          </el-input>
        </div>

        <el-date-picker
          v-else="formItem.value.type === 'datetime' || formItem.value.type === 'date'"
          v-model="searchKeys[formItem.id]"
          :type="formItem.value.type === 'datetime' ? 'datetime' : 'date'"
          placeholder="选择时间"
          size="small">
        </el-date-picker>
      </el-form-item>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      searchKeyList: { type: Array },
      searchKeys: { type: Object },
      isAdvanceSearch: { type: Boolean },
      deviceType: { type: String }
    },

    data () {
      return {}
    },
    methods: {
    }
  }
</script>
