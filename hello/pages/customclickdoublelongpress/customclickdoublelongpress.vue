<template>
  <view class="container">
    <!-- 直接绑定事件处理器进行测试 -->
    <view 
      class="click-area"
      @touchstart="doubleClickHandlers.onTouchstart"
      @touchmove="doubleClickHandlers.onTouchmove"
      @touchend="doubleClickHandlers.onTouchend"
      @touchcancel="doubleClickHandlers.onTouchcancel"
      @click="doubleClickHandlers.onClick"
    >
      <text>双击我！{{ message }}</text>
    </view>
    
    <!-- 调试信息 -->
    <view class="debug-info">
      <text>点击次数: {{ doubleClickHandlers.clickCount }}</text>
      <text class="info-text">当前状态: {{ message }}</text>
    </view>
    
    <!-- 说明信息 -->
    <view class="info-section">
      <text class="title">事件处理说明：</text>
      <text class="info-item">• touchend: 移动端触摸结束事件</text>
      <text class="info-item">• click: PC端点击事件</text>
      <text class="info-item">• 两个事件现在分开处理，避免重复触发</text>
      <text class="info-item">• 双击后会自动抑制100ms内的click事件</text>
      </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { useDoubleClick, createEventBindings } from '@/composables/useDoubleClick.js'

const message = ref('等待操作...')

const doubleClickHandlers = useDoubleClick({
  onSingleClick: (event) => {
    console.log('页面：检测到单击')
    message.value = '检测到单击！'
  },
  onDoubleClick: (event) => {
    console.log('页面：检测到双击！')
    message.value = '检测到双击！'
  },
  onLongPress: (event) => {
    console.log('页面：检测到长按')
    message.value = '检测到长按！'
  }
})

// 直接使用事件处理器，不通过辅助函数
</script>

<style scoped>
.container {
  padding: 20px;
}

.click-area {
  width: 200px;
  height: 200px;
  background-color: #007aff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px auto;
}

.click-area text {
  color: white;
  font-size: 16px;
  text-align: center;
}

.debug-info {
  margin-top: 20px;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 5px;
  text-align: center;
}

.info-text {
  display: block;
  margin-top: 5px;
  font-size: 14px;
  color: #666;
}

.info-section {
  margin-top: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #007aff;
}

.title {
  display: block;
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.info-item {
  display: block;
  font-size: 14px;
  color: #666;
  margin: 5px 0;
  line-height: 1.4;
}
</style>