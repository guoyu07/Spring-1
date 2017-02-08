<template>
	<div id="flow-editor">
		<!-- 头部 -->
		<el-row>
			<el-col :span="12">
				<el-breadcrumb separator="/">
				  <el-breadcrumb-item :to="{ path: '/part1' }">创建流程表单</el-breadcrumb-item>
				  <!-- <el-breadcrumb-item>新建</el-breadcrumb-item> -->
				</el-breadcrumb>
			</el-col>
		</el-row>
		<!-- 主体 -->
		<el-row>
			<router-view></router-view>
		</el-row>
	</div>
</template>

<script>
  export default {}
</script>
