// composables/useDoubleClick.js
import { ref, onUnmounted } from 'vue'

// 生成事件绑定对象的辅助函数
export function createEventBindings(handlers) {
    return {
        touchstart: handlers.onTouchstart,
        touchmove: handlers.onTouchmove,
        touchend: handlers.onTouchend,
        touchcancel: handlers.onTouchcancel,
        click: handlers.onClick
    }
}
  
      
export function useDoubleClick(options = {}) {
  const {
    delay = 300, // 双击间隔时间（毫秒）
    onSingleClick = null, // 单击回调
    onDoubleClick = null, // 双击回调
    onLongPress = null, // 长按回调
    longPressDelay = 800 // 长按触发时间
  } = options

  // 状态管理
  const clickCount = ref(0)
  const isLongPress = ref(false)
  const touchStartTime = ref(0)
  const singleClickTimer = ref(null)
  const longPressTimer = ref(null)
  const lastClickTime = ref(0) // 防止重复触发
  const isDoubleClickProcessed = ref(false) // 标记是否已处理双击
  const suppressClickUntil = ref(0) // 抑制click事件的时间戳
  const suppressTimer = ref(null) // 抑制定时器

  // 清除所有定时器
  const clearAllTimers = () => {
    if (singleClickTimer.value) {
      clearTimeout(singleClickTimer.value)
      singleClickTimer.value = null
    }
    if (longPressTimer.value) {
      clearTimeout(longPressTimer.value)
      longPressTimer.value = null
    }
    if (suppressTimer.value) {
      clearTimeout(suppressTimer.value)
      suppressTimer.value = null
    }
  }

  // 重置状态
  const resetState = (preserveSuppression = false) => {
    clickCount.value = 0
    isLongPress.value = false
    touchStartTime.value = 0
    lastClickTime.value = 0
    isDoubleClickProcessed.value = false
    if (!preserveSuppression) {
      suppressClickUntil.value = 0
    }
    clearAllTimers()
  }

  // 处理触摸开始
  const handleTouchStart = (event) => {
    console.log('touchstart 事件触发')
    touchStartTime.value = Date.now()
    isLongPress.value = false
    
    // 设置长按定时器
    if (onLongPress) {
      longPressTimer.value = setTimeout(() => {
        isLongPress.value = true
        clearAllTimers()
        onLongPress(event)
      }, longPressDelay)
    }
  }

  // 处理触摸移动（取消长按）
  const handleTouchMove = () => {
    if (longPressTimer.value) {
      clearTimeout(longPressTimer.value)
      longPressTimer.value = null
    }
  }

  // 处理触摸结束
  const handleTouchEnd = (event) => {
    const currentTime = Date.now()
    console.log('touchend 事件触发，当前点击次数:', clickCount.value, '时间:', currentTime)
    
    // 防止重复触发：如果距离上次点击时间太短（小于50ms），则忽略
    if (currentTime - lastClickTime.value < 50) {
      console.log('忽略重复触发')
      return
    }
    
    lastClickTime.value = currentTime
    const touchDuration = currentTime - touchStartTime.value
    
    // 清除长按定时器
    if (longPressTimer.value) {
      clearTimeout(longPressTimer.value)
      longPressTimer.value = null
    }

    // 如果是长按，则不处理点击事件
    if (isLongPress.value || touchDuration >= longPressDelay) {
      console.log('长按事件，重置状态')
      resetState()
      return
    }

    clickCount.value++
    console.log('触摸结束，点击次数增加到:', clickCount.value)

    if (clickCount.value === 1) {
      // 第一次点击，设置延时判断是否为单击
      console.log('第一次触摸结束，设置延时器')
      singleClickTimer.value = setTimeout(() => {
        if (clickCount.value === 1) {
          // 确认为单击
          console.log('确认为单击')
          if (onSingleClick) {
            onSingleClick(event)
          }
        }
        resetState()
      }, delay)
    } else if (clickCount.value === 2) {
      // 第二次点击，确认为双击
      console.log('确认为双击！')
      isDoubleClickProcessed.value = true
      // 设置抑制click事件的时间，防止双击后的click事件触发
      suppressClickUntil.value = currentTime + 100 // 100ms内抑制click事件
      console.log('设置抑制时间至:', suppressClickUntil.value)
      
      // 先清除其他定时器（不包括suppressTimer）
      if (singleClickTimer.value) {
        clearTimeout(singleClickTimer.value)
        singleClickTimer.value = null
      }
      if (longPressTimer.value) {
        clearTimeout(longPressTimer.value)
        longPressTimer.value = null
      }
      
      // 设置定时器自动清理抑制标志
      suppressTimer.value = setTimeout(() => {
        suppressClickUntil.value = 0
        console.log('抑制时间到期，清理抑制标志')
      }, 100)
      
      if (onDoubleClick) {
        onDoubleClick(event)
      }
      resetState(true) // 保持抑制标志
    }
  }

  // 处理点击事件（PC端）
  const handleClick = (event) => {
    const currentTime = Date.now()
    console.log('click 事件触发，当前点击次数:', clickCount.value, '时间:', currentTime, '抑制时间:', suppressClickUntil.value)
    
    // 如果在抑制时间内，则忽略click事件
    if (currentTime < suppressClickUntil.value) {
      console.log('双击后抑制click事件，当前时间:', currentTime, '抑制至:', suppressClickUntil.value)
      return
    }
    
    // 防止重复触发：如果距离上次点击时间太短（小于50ms），则忽略
    if (currentTime - lastClickTime.value < 50) {
      console.log('忽略重复触发')
      return
    }
    
    lastClickTime.value = currentTime
    
    // 清除长按定时器
    if (longPressTimer.value) {
      clearTimeout(longPressTimer.value)
      longPressTimer.value = null
    }

    // PC端点击事件，直接处理点击逻辑
    clickCount.value++
    console.log('PC端点击，点击次数增加到:', clickCount.value)

    if (clickCount.value === 1) {
      // 第一次点击，设置延时判断是否为单击
      console.log('第一次PC端点击，设置延时器')
      singleClickTimer.value = setTimeout(() => {
        if (clickCount.value === 1) {
          // 确认为单击
          console.log('确认为单击')
          if (onSingleClick) {
            onSingleClick(event)
          }
        }
        resetState()
      }, delay)
    } else if (clickCount.value === 2) {
      // 第二次点击，确认为双击
      console.log('确认为双击！')
      clearAllTimers()
      if (onDoubleClick) {
        onDoubleClick(event)
      }
      resetState()
    }
  }

  // 处理触摸取消
  const handleTouchCancel = () => {
    clearAllTimers()
    resetState()
  }

  // 组件卸载时清理
  onUnmounted(() => {
    clearAllTimers()
  })

  // 返回事件处理器对象
  return {
    // 触摸事件（移动端）
    onTouchstart: handleTouchStart,
    onTouchmove: handleTouchMove,
    onTouchend: handleTouchEnd,
    onTouchcancel: handleTouchCancel,
    // 点击事件（PC端）
    onClick: handleClick,
    // 状态
    clickCount,
    // 重置方法
    reset: resetState
  }
}