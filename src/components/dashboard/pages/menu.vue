<style lang="less" scoped>
  @import url("../../../assets/css/variables");

  .grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    list-style: none;
    padding: 0;
    margin: .2em 0 1.6em;
  }

  .category {
    font-weight: 400;
    margin-bottom: 0;
  }

  .hot-category {
    font-size: 14px;
    color: #888;
  }

  .entry {
    flex: none;
    padding: 1.5em 0 0 1.5em;
    margin-right: 1.5em;
    color: @eoTextColor;
    width: 100px;

    &__icon {
      display: flex;
      justify-content: center;
      align-items: center;
      line-height: 0;
      margin-bottom: .6em;

      span {
        font-size: 36px !important;
        color: #fff;
        width: 64px;
        height: 64px;
        background: @eoThemeColor;
        border-radius: 100%;
        text-align: center;
        display: inline-flex;
        justify-content: center;
        align-items: center;
      }
    }

    &__title {
      font-size: 14px;
      line-height: 1.3;
      text-align: center;
      max-width: 100px;
    }

    &:hover {
      cursor: pointer;

      .entry__icon span {
        // background-color: @primary;
        opacity: .9;
        // filter: saturate(180%);
        filter: brightness(110%);
      }

      .entry__title {
        color: @textColor;
      }
    }
  }
</style>

<template>
  <div class="wrapper">
    <el-row>
      <el-col :sm="24" :md="24" :lg="20">
        <el-col :sm="24" style="margin-bottom: 20px;">
          <el-col :md="8" :lg="4">
            <el-input
              placeholder="请搜索流程名称"
              icon="search"
              v-model="searchProcedure"
              @change="onChangeSearch">
            </el-input>
          </el-col>
        </el-col>
        <template v-if="!searchProcedure" v-for="top in topList">
          <el-col :sm="24">
            <h4 class="category hot-category">{{top.category}}</h4>
            <ul class="grid">
              <li v-for="child in top.children" class="entry" @click="onEntryClick(child.path)">
                <div class="entry__icon">
                  <span :class="'el-icon-' + child.icon" :style="{ backgroundColor: child.color }"></span>
                </div>
                <div class="entry__title">{{child.title}}</div>
              </li>
            </ul>
          </el-col>
        </template>
        <template v-for="entry in searchResult">
          <el-col :sm="24">
            <h4 class="category">{{entry.category}}</h4>
            <ul class="grid">
              <li v-for="child in entry.children" class="entry" @click="onEntryClick(child.path)">
                <div class="entry__icon">
                  <span :class="'el-icon-' + child.icon" :style="{ backgroundColor: child.color }"></span>
                </div>
                <div class="entry__title">{{child.title}}</div>
              </li>
            </ul>
          </el-col>
        </template>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        searchProcedure: '',
        entries: [],
        searchResult: [],
        topList: []
      }
    },

    created () {
      const postHeadvData = {
        action: 'start/process',
        method: 'get',
        data: {
          group: true
        }
      }
      this.http.post('/flow/', this.parseData(postHeadvData))
      .then((response) => {
        console.log(response.data.data.list)
        const res = response.data.data.list
        res.map(categ => {
          this.entries.push({
            category: categ.category,
            children: []
          })
          this.entries.map(entry => {
            if (entry.category === categ.category) {
              categ.list.map(list => {
                if (list.pkey === 'host_apply') {
                  entry.children.push({
                    icon: list.icon ? list.icon : 'fa-star',
                    color: list.bg_color,
                    title: list.pname,
                    path: `/system/apply`
                  })
                } else if (['appAddCluster', 'systemOnline'].includes(list.pkey)) {
                  entry.children.push({
                    icon: list.icon ? list.icon : 'fa-star',
                    color: list.bg_color,
                    title: list.pname,
                    path: {
                      path: '/system/onlinelist',
                      query: {
                        pkey: list.pkey
                      }
                    }
                  })
                } else {
                  entry.children.push({
                    icon: list.icon ? list.icon : 'fa-star',
                    color: list.bg_color,
                    title: list.pname,
                    path: `/procedure/start/${list.pkey}/${list.pname}`
                  })
                }
              })
            }
          })
          // this.searchResult = this.searchResult.concat(this.entries)
          this.searchResult = this.entries
        })
      })
      const topData = {
        action: 'start/process/top',
        method: 'get',
        data: {
          top: 5
        }
      }
      this.http.post('/flow/', this.parseData(topData))
      .then((response) => {
        const res = response.data.data.list
        this.topList = [{
          category: '最常使用的流程',
          children: []
        }]
        res.map(list => {
          if (list.pkey === 'host_apply') {
            this.topList[0].children.push({
              icon: list.icon ? list.icon : 'fa-star',
              color: list.bg_color,
              title: list.pname,
              path: `/system/apply`
            })
          } else if (['appAddCluster', 'systemOnline'].includes(list.pkey)) {
            this.topList[0].children.push({
              icon: list.icon ? list.icon : 'fa-star',
              color: list.bg_color,
              title: list.pname,
              path: {
                path: '/system/onlinelist',
                query: {
                  pkey: list.pkey
                }
              }
            })
          } else {
            this.topList[0].children.push({
              icon: list.icon ? list.icon : 'fa-star',
              color: list.bg_color,
              title: list.pname,
              path: `/procedure/start/${list.pkey}/${list.pname}`
            })
          }
        })
      })
    },

    methods: {
      onEntryClick (path) {
        this.$router.push(path)
      },
      onChangeSearch () {
        if (this.searchProcedure === '') {
          this.searchResult = this.entries
        } else {
          this.searchResult = []
          this.entries.map(categ => {
            console.log(categ)
            categ.children.map(list => {
              console.log(list)
              if (list.title.includes(this.searchProcedure)) {
                if (this.searchResult.some(result => { return result.category === categ.category })) {
                  this.searchResult.map(result => {
                    if (result.category === categ.category) {
                      result.children.push(list)
                    }
                  })
                } else {
                  this.searchResult.push({
                    category: categ.category,
                    children: [list]
                  })
                }
              }
            })
          })
        }
      }
    }
  }
</script>
