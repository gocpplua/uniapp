<template>
	<view>
		<button @click="printLog">打印日志</button>
		<button @click="saveLog">保存日志到手机本地</button>
		<button @click="clearLog">清除日志文件</button>
	</view>
</template>

<script setup>
import baseLogger from '../../utils/log/logger.js'
const logger = baseLogger.create('logger')
let logLine = 0;
const printLog = () =>{
	logLine = logLine + 1;
	logger.log("日志" + logLine)
}

const saveLog = () =>{
	logger.info("保存日志到手机本地")
	// TODO：保存日志到手机本地
}

const clearLog = () =>{
	logger.info("清除日志文件")
	// TODO：清除日志
}
</script>

<style>
	       
</style>
