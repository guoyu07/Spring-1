# Spring
> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

## Maintenance

### `/src/assets`

* `/css`
  * `main.less`: 重置样式，跨组件的样式宜在此定义、而非在组件内局部定义
  * `variables.less`: 全局变量，在其他 .less 文件里以 `@import` 引入之，可使用其定义的样式常量
  * `transitions.less`: 路由过渡动效样式，譬如 `<transition name="zoomIn">` 将在动态组件发生路由变化时使用 `.zoomIn-enter-active` 及 `.zoomIn-leave-active` 动效
* `/js`: 无关 Vue 控制流的外部脚本，会被 ESLint 忽视
* `/img`: 图片资源

### `/src/utils`

* `eventHub.js`: 一个 Vue 实例化对象，作为事件枢纽，可在组件中引入并调用其 `$emit`、`$on` 及 `$off` 来分别分发、监听和取消监听事件

### 其他

* `/src/auth.js`: 登录验证机制的脚本，组件可引入并调用其 `login`、`logout`、`checkAuth` 及 `getAuthHeader` 等方法来分别登录、注销、检查验证状态及获取验证头部