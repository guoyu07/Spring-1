<template>
  <div>
    <div class="form-block" v-for="formBlock in formData">
      <h4>{{formBlock.name}}</h4>
      <div class="headerform">
        <span v-for="formItem in formBlock.value">
          <header-form :item="item" :form-item="formItem" :whole="whole"></header-form>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  import headerForm from './_headerForm'
  export default {
    props: {
      item: { type: Object },
      whole: { type: Object },
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
      headerForm
    }
  }
</script>
