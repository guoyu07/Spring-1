<style scoped>
  #bpmn-editor, #bpmn-canvas {
    height: 100%;
    overflow: hidden;
  }
</style>

<template>
  <div id="bpmn-editor">
    <button @click="saveToXML">发送 XML 给后台</button>
    <div id="bpmn-canvas"></div>
  </div>
</template>

<script>
import diagramXML from './bpmn.XML'

const BpmnModeler = window.BpmnJS

export default {
  data () {
    return {
      // clientHeight: '',
      bpmnModeler: null
    }
  },

  mounted () {
    this.$nextTick(() => {
      this.bpmnModeler = new BpmnModeler({ container: '#bpmn-canvas' })
      // import diagram
      this.bpmnModeler.importXML(diagramXML, err => {
        if (err) console.log(err)
        document.getElementsByClassName('bjs-powered-by')[0].outerHTML = ''
        // zoom to fit full viewport
        let canvas = this.bpmnModeler.get('canvas')
        canvas.zoom('fit-viewport')
      })
    })
  },

  methods: {
    saveToXML () {
      this.bpmnModeler.saveXML({ format: true }, (err, xml) => {
        if (err) {
          console.error('diagram save failed', err)
        } else {
          console.info('diagram saved')
          console.info(xml)
        }
      })
    }
  }
}
</script>
