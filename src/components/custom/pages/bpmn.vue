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

  .save-btn {
    position: fixed;
    bottom: 20px;
    right: 280px;
  }
</style>

<template>
  <div id="bpmn-editor">
    <div id="bpmn-canvas"></div>
    <div id="properties-panel"></div>
    <el-button type="success" icon="check" @click="saveToXML" class="save-btn">保存</el-button>
  </div>
</template>

<script>
import diagramXML from './../bpmn.XML'
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

  computed: {
    isNew () {
      return !window.localStorage.getItem('bpmn') || !this.$route.params.pkey  // 是否新建
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
      // 导入响应而来的 BPMN
      if (this.isNew) {
        this.loadXML(diagramXML)
      } else {
        this.loadXML(window.localStorage.getItem('bpmn'))
      }
    })
  },

  methods: {
    loadXML (xml) {
      this.bpmnModeler.importXML(xml, err => {
        if (err) console.log(err)
        document.getElementsByClassName('bjs-powered-by')[0].outerHTML = ''
        this.bpmnModeler.get('canvas').zoom('fit-viewport')
      })
    },

    saveToXML () {
      this.bpmnModeler.saveXML({ format: true }, (err, xml) => {
        if (err) {
          this.$message.error(`发生错误：${err}`)
        } else {
          console.info(xml)
          let postData
          if (this.isNew) {
            postData = {
              action: 'process/bpmn/data',
              method: 'POST',
              data: { bpmn_data: xml }
            }
          } else {
            postData = {
              action: 'process/bpmn/data',
              method: 'PUT',
              data: {
                pkey: this.$route.params.pkey,
                bpmn_data: xml
              }
            }
          }
          this.http.post('', this.parseData(postData)).then((res) => {
            if (res.status === 200) {
              this.$message.success('保存成功！')
              this.$router.replace('/custom')
            }
          })
        }
      })
    }
  }
}
</script>
