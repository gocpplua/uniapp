<template>
	<view @click="handleClickView">
		<!-- 双击测试 -->
		<!-- 微信小程序输出: handleClick handleClickView  -->
		<!-- H5输出: handleClick handleClickView handleDblClick -->
		<image src="/static/static/images/xiefang.jpg" @dblclick="handleDblClick" @click="handleClick"></image>
	</view>
</template>

<script setup>
	
	const handleDblClick = () => {
		console.log('handleDblClick')
	}

	const handleClick = () => {
		console.log('handleClick')
	}

	const handleClickView = () => {
		console.log('handleClickView')
	}
</script>

<style>
	       
</style>
