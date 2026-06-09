/**
 * dashboard-card 组件
 * 功能：仪表盘入口卡片，展示图标、标题、数值、副标题
 * 通过 properties 接收数据，通过 triggerEvent 向父组件发送事件
 * 支持颜色主题切换和点击反馈效果
 */
Component({
  /**
   * 组件属性
   */
  properties: {
    /** 图标（emoji或文字） */
    icon: {
      type: String,
      value: ''
    },
    /** 卡片标题 */
    title: {
      type: String,
      value: ''
    },
    /** 主要数值 */
    value: {
      type: String,
      value: ''
    },
    /** 副标题/描述文字 */
    subtitle: {
      type: String,
      value: ''
    },
    /** 颜色主题：primary(绿), warning(橙), danger(红), info(灰) */
    color: {
      type: String,
      value: 'primary'
    },
    /** 角标数字 */
    count: {
      type: Number,
      value: 0
    },
    /** 是否显示右侧箭头 */
    showArrow: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件数据
   */
  data: {},

  /**
   * 组件方法
   */
  methods: {
    /**
     * 卡片点击事件
     * 向父组件触发 tap 事件，携带当前组件信息
     */
    onTap() {
      this.triggerEvent('tap', {
        icon: this.data.icon,
        title: this.data.title,
        color: this.data.color
      })
    }
  }
})
