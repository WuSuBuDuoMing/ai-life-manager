/**
 * empty-state 组件
 * 功能：空状态占位组件，展示图标、标题、副标题和可选操作按钮
 * 适用于列表为空、无数据、搜索无结果等场景
 * 通过 properties 接收显示内容，通过 triggerEvent 发送 action 事件
 */
Component({
  /**
   * 组件属性
   */
  properties: {
    /** 大emoji图标 */
    icon: {
      type: String,
      value: ''
    },
    /** 主标题 */
    title: {
      type: String,
      value: ''
    },
    /** 副标题/描述文字 */
    subtitle: {
      type: String,
      value: ''
    },
    /** 按钮文字 */
    buttonText: {
      type: String,
      value: ''
    },
    /** 是否显示按钮 */
    showButton: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件方法
   */
  methods: {
    /**
     * 按钮点击事件
     * 向父组件触发 action 事件
     */
    onAction() {
      this.triggerEvent('action')
    }
  }
})
