<style scoped>
  #bpmn-editor, #bpmn-canvas {
    height: 100%;
    overflow: hidden;
    position: relative;
  }
  #properties-panel {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    width: 260px;
    z-index: 10;
    border-left: 1px solid #ccc;
    overflow: auto;
  }
</style>

<template>
  <div id="bpmn-editor">
    <button @click="saveToXML">发送 XML 给后台</button>
    <div id="bpmn-canvas"></div>
    <div id="properties-panel"></div>
  </div>
</template>

<script>
import diagramXML from './bpmn.XML'
import BpmnModeler from 'bpmn-js/lib/Modeler'
import propertiesPanelModule from 'bpmn-js-properties-panel'
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda'
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda.json'

export default {
  data () {
    return {
      bpmnModeler: null
    }
  },

  mounted () {
    this.$nextTick(() => {
      this.bpmnModeler = new BpmnModeler({
        container: '#bpmn-canvas',
        propertiesPanel: {
          parent: '#properties-panel'
        },
        additionalModules: [
          propertiesPanelModule,
          propertiesProviderModule
        ],
        moddleExtensions: {
          camunda: camundaModdleDescriptor
        }
      })
      this.bpmnModeler.importXML(diagramXML, err => {
        if (err) console.log(err)
        document.getElementsByClassName('bjs-powered-by')[0].outerHTML = ''
        this.bpmnModeler.get('canvas').zoom('fit-viewport')
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
