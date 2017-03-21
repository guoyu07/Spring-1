<!-- bpmn.io License -->

<!-- Copyright (c) 2014-2016 camunda Services GmbH

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

The source code responsible for displaying the bpmn.io logo (two green cogwheels in a box) that links back to http://bpmn.io as part of rendered diagrams MUST NOT be removed or changed. When this software is being used in a website or application, the logo must stay fully visible and not visually overlapped by other elements.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. -->

<style scoped>
  #bpmn-editor, #bpmn-canvas {
    height: 100%;
    overflow: hidden;
    position: relative;
  }

  #bpmn-editor {
    border: 1px solid #d1dbe5;
    border-radius: 4px;
    background-color: #fff;
    overflow: hidden;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
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
    position: absolute;
    bottom: 20px;
    right: 280px;
  }
</style>

<template>
  <div id="bpmn-editor">
    <div id="bpmn-canvas"></div>
    <div id="properties-panel"></div>
    <el-button type="success" icon="check" @click="saveToXML" :loading="committing" class="save-btn">保存</el-button>
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
      bpmnModeler: null,
      committing: false
    }
  },

  computed: {
    isNew () {
      return !this.$route.params.pkey  // 是否新建
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
      // 导入 BPMN
      this.loadXML()
    })
  },

  methods: {
    loadXML () {
      if (this.isNew) {
        _importXML(diagramXML)
      } else {
        let postData = {
          action: 'process/bpmn/data',
          method: 'GET',
          data: { pkey: this.$route.params.pkey }
        }
        this.http.post('', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            _importXML(res.data.data)
          }
        })
      }
      const _importXML = (xml) => {
        this.bpmnModeler.importXML(xml, err => {
          if (err) console.log(err)
          document.getElementsByClassName('bjs-powered-by')[0].outerHTML = ''
          this.bpmnModeler.get('canvas').zoom('fit-viewport')
        })
      }
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
          this.committing = true
          this.http.post('', this.parseData(postData)).then((res) => {
            if (res.status === 200 || res.status === 201) {
              this.$message.success('保存成功！')
              this.$router.replace('/custom')
            }
            this.committing = false
          }).catch(() => {
            this.committing = false
          })
        }
      })
    }
  }
}
</script>
