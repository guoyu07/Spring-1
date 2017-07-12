<style lang="less" scoped>
  .conf-contain {
    min-width: 600px;

    .el-input {
      margin-bottom: 12px;
      width: 33%;
    }

    .el-form-item {
      margin-bottom: 12px;
    }

    .realtime-label {
      padding: 0 6px;
      font-size: 13px;
      color: #48576a;
    }
  }  
</style>

<template>
  <div class="conf-contain">
    <el-collapse>
      <el-collapse-item v-for="(layerA, index) in confArr" :title="layerA.label">
        <el-form label-width="80px">
          <el-form-item label="Label">
            <el-input size="small" v-model="layerA.label" @change="layerA.value = layerA.label"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="small" type="success" icon="plus" @click="addChild(layerA)"></el-button>
            <el-tooltip placement="top">
              <div slot="content"><i class="el-icon-warning"></i> 将移除 {{layerA.label}} 及其所有直系后代</div>
              <el-button size="small" type="danger" icon="minus" @click="removeChild(confArr, index)"></el-button>
            </el-tooltip>
          </el-form-item>
        </el-form>
        <el-collapse v-if="layerA.children">
          <el-collapse-item v-for="(layerB, index) in layerA.children" :title="layerB.label">
            <el-form label-width="80px">
              <el-form-item label="Label">
                <el-input size="small" v-model="layerB.label" @change="layerB.value = layerB.label"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button size="small" type="success" icon="plus" @click="addChild(layerB)"></el-button>
                <el-tooltip placement="top">
                  <div slot="content"><i class="el-icon-warning"></i> 将移除 {{layerB.label}} 及其所有直系后代</div>
                  <el-button size="small" type="danger" icon="minus" @click="removeChild(layerA.children, index)"></el-button>
                </el-tooltip>
              </el-form-item>
            </el-form>
            <el-collapse v-if="layerB.children">
              <el-collapse-item v-for="(layerC, index) in layerB.children" :title="layerC.label">
                <el-form label-width="80px">
                  <el-form-item label="Label">
                    <el-input size="small" v-model="layerC.label" @change="layerC.value = layerC.label"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <!-- <el-button size="small" type="success" icon="plus" @click="addChild(layerC)"></el-button> -->
                    <el-tooltip placement="top">
                      <div slot="content"><i class="el-icon-warning"></i> 将移除 {{layerC.label}}</div>
                      <el-button size="small" type="danger" icon="minus" @click="removeChild(layerB.children, index)"></el-button>
                    </el-tooltip>
                  </el-form-item>
                </el-form>
              </el-collapse-item>
            </el-collapse>
          </el-collapse-item>
        </el-collapse>
      </el-collapse-item>
    </el-collapse>
    <el-button size="small" type="success" icon="plus" @click="addOutsideLayer" style="margin-top: 12px"></el-button>
    <span class="realtime-label">实时预览：</span>
    <el-cascader
      :options="confArr"
      v-model="selectedOptions">
    </el-cascader>
  </div>
</template>

<script>
  export default {
    props: {
      confArr: Array
    },

    data () {
      return {
        selectedOptions: []
      }
    },

    methods: {
      addOutsideLayer () {
        this.confArr.push({ value: '', label: 'New parent' })
      },

      addChild (layer) {
        if (!layer.children) {
          this.$set(layer, 'children', [{ value: '', label: 'New child' }])
        } else {
          layer.children.push({ value: '', label: 'New child' })
        }
      },

      removeChild (parent, index) {
        parent.splice(index, 1)
      }
    }
  }
</script>