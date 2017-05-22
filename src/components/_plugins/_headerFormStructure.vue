<template>
  <div>
    <div class="form-block" v-for="formBlock in formData">
      <h4>{{formBlock.name}}</h4>
      <div class="headerform">
        <span v-for="formItem in formBlock.value">
          <form-body :item="item" :form-item="formItem" :whole="whole" :header="true"></form-body>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  import formBody from './_formBody'
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
      formBody
    }
  }
</script>
