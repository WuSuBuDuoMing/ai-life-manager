/**
 * loading-state 组件
 * 功能：加载状态组件，支持骨架屏和旋转动画两种模式
 * loading=true 时显示加载效果，loading=false 时显示slot内容
 * skeleton 模式：闪烁矩形块模拟加载内容
 * spinner 模式：旋转动画 + 加载文字
 */
Component({
  /**
   * 组件属性
   */
  properties: {
    /** 是否处于加载状态 */
    loading: {
      type: Boolean,
      value: true
    },
    /** 加载提示文字（spinner模式） */
    text: {
      type: String,
      value: '加载中...'
    },
    /** 加载类型：skeleton(骨架屏) | spinner(旋转动画) */
    type: {
      type: String,
      value: 'skeleton'
    }
  }
})
