<template>
  <div>
    <div class="form-block" v-for="formBlock in formData">
      <h4>{{formBlock.name}}</h4>
      <div class="headerform">
        <span v-for="formItem in formBlock.value">
          <header-form-display :item="item" :form-item="formItem"></header-form-display>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  import headerFormDisplay from './_headerFormDisplay'
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
    },

    components: {
      headerFormDisplay
    }
  }
</script>
