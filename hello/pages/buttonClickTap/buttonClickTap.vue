<template>
	<view @click="handleClickView">
		<!-- 微信小程序输出: handleTap handleClickView  -->
		<!-- H5输出: handleClick handleTap handleClickView -->
		<button @click="handleClick" @tap="handleTap">click和tap时</button> 
		<!-- 微信小程序输出: handleTap handleClickView  -->
		<!-- H5输出: handleClick handleTap  -->
		<button @click="handleClick" @tap.stop="handleTap">click和tap时，@tap.stop使得h5不会冒泡，小程序会冒泡</button> 
		<!-- 微信小程序输出: handleTap handleClickView  -->
		<!-- H5输出: handleClick handleTap handleClickView -->
		<button @click="handleClick" @tap.prevent="handleTap">handleClick</button> 
		<!-- 微信小程序输出: handleClick handleClickView  -->
		<!-- H5输出: handleClick handleTap  -->
		<button @click.stop="handleClick" @tap="handleTap">click和tap时，click.stop使得h5不会冒泡，小程序会冒泡</button> 
		<!-- 微信小程序输出: handleClick handleClickView  -->
		<!-- H5输出: handleClick handleTap handleClickView -->
		<button @click.prevent="handleClick" @tap="handleTap">handleClick</button>
		<!-- 微信小程序输出: handleTap handleClickView  -->
		<!-- H5输出: handleClick handleTap -->
		<button @click="handleClick" @tap.native.stop="handleTap">h5会阻止冒泡</button>
		<!-- 微信小程序输出: handleTap  -->
		<!-- H5输出: handleClick handleTap -->
		<button @click.stop="handleClick" @tap.stop="handleTap">微信小程序和H5都会阻止冒泡</button>
		
		
		<!-- 微信小程序输出: handleTap handleClickView  -->
		<!-- H5输出: handleClick handleTap -->
		<button @tap.native.stop="handleTap">只有tap,native.stop微信小程序和H5都会阻止冒泡</button>
		<!-- 微信小程序输出: handleTap  -->
		<!-- H5输出: handleTap -->
		<button @tap.stop="handleTap">只有tap,stop微信小程序和H5都会阻止冒泡</button>
	</view>
</template>

<script setup>
	const handleClick = () => {
		console.log('handleClick')
	}

	const handleTap = () => {
		console.log('handleTap')
	}

	const handleClickView = () => {
		console.log('handleClickView')
	}
</script>

<style>
	       
</style>
