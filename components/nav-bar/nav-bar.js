/**
 * nav-bar 组件
 * 功能：自定义导航栏，适配状态栏高度
 * 支持返回按钮、首页按钮、自定义背景色和文字颜色
 * 通过 wx.getSystemInfoSync() 获取状态栏高度
 * 通过 triggerEvent 向父组件发送 back 和 home 事件
 */
Component({
  /**
   * 组件属性
   */
  properties: {
    /** 导航栏标题 */
    title: {
      type: String,
      value: ''
    },
    /** 是否显示返回按钮 */
    showBack: {
      type: Boolean,
      value: false
    },
    /** 是否显示首页按钮 */
    showHome: {
      type: Boolean,
      value: false
    },
    /** 背景色 */
    bgColor: {
      type: String,
      value: 'transparent'
    },
    /** 文字颜色 */
    textColor: {
      type: String,
      value: '#333'
    }
  },

  /**
   * 组件内部数据
   */
  data: {
    /** 状态栏高度（px） */
    statusBarHeight: 20,
    /** 标题栏高度（px） */
    titleBarHeight: 44,
    /** 总高度（px，用于占位） */
    totalHeight: 64
  },

  /**
   * 组件生命周期 - 获取系统信息计算高度
   */
  lifetimes: {
    attached: function () {
      try {
        var sysInfo = wx.getSystemInfoSync()
        var statusBarHeight = sysInfo.statusBarHeight || 20
        var titleBarHeight = 44
        this.setData({
          statusBarHeight: statusBarHeight,
          titleBarHeight: titleBarHeight,
          totalHeight: statusBarHeight + titleBarHeight
        })
      } catch (e) {
        // 获取系统信息失败时使用默认值
        this.setData({
          statusBarHeight: 20,
          titleBarHeight: 44,
          totalHeight: 64
        })
      }
    }
  },

  /**
   * 组件方法
   */
  methods: {
    /**
     * 返回按钮点击事件
     * 默认调用 wx.navigateBack，同时向父组件发送事件
     */
    onBack: function () {
      this.triggerEvent('back')
      wx.navigateBack({ delta: 1 })
    },

    /**
     * 首页按钮点击事件
     * 向父组件发送 home 事件
     */
    onHome: function () {
      this.triggerEvent('home')
      wx.switchTab({ url: '/pages/index/index' })
    }
  }
})
