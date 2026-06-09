/**
 * 主题行为模块
 * 提供暗黑模式切换、主题检测、自定义 tabBar 选中状态管理
 * 混入 Page 即可使用
 */
var themeBehavior = Behavior({
  data: {
    isDark: false,
    themeClass: ''
  },

  lifetimes: {
    attached: function() {
      this._checkTheme()
    }
  },

  pageLifetimes: {
    show: function() {
      this._checkTheme()
      this._setTabBarIndex()
    }
  },

  methods: {
    /**
     * 检查并应用当前主题
     */
    _checkTheme: function() {
      try {
        var theme = wx.getStorageSync('theme') || 'light'
        var isDark = theme === 'dark'
        var themeClass = isDark ? 'dark' : ''
        if (this.data.isDark !== isDark) {
          this.setData({ isDark: isDark, themeClass: themeClass })
        }
      } catch (e) {
        console.warn('[theme-behavior] 检查主题失败:', e)
      }
    },

    /**
     * 切换暗黑模式
     */
    toggleTheme: function() {
      try {
        var current = wx.getStorageSync('theme') || 'light'
        var next = current === 'dark' ? 'light' : 'dark'
        wx.setStorageSync('theme', next)
        this._checkTheme()
        var app = getApp()
        if (app) {
          app.globalData.theme = next
        }
        // 通知所有页面刷新主题
        wx.showToast({
          title: next === 'dark' ? '已切换深色模式' : '已切换浅色模式',
          icon: 'none',
          duration: 1500
        })
      } catch (e) {
        console.error('[theme-behavior] 切换主题失败:', e)
      }
    },

    /**
     * 设置主题（不切换，直接设置）
     * @param {string} theme - 'light' 或 'dark'
     */
    setTheme: function(theme) {
      try {
        wx.setStorageSync('theme', theme)
        this._checkTheme()
        var app = getApp()
        if (app) {
          app.globalData.theme = theme
        }
      } catch (e) {
        console.error('[theme-behavior] 设置主题失败:', e)
      }
    },

    /**
     * 获取当前主题 class 名
     * @returns {string}
     */
    getThemeClass: function() {
      return this.data.isDark ? 'dark' : ''
    },

    /**
     * 设置自定义 tabBar 选中状态
     * 根据当前页面路径自动匹配
     */
    _setTabBarIndex: function() {
      try {
        var pages = getCurrentPages()
        if (!pages || pages.length === 0) return
        var currentPage = pages[pages.length - 1]
        var route = '/' + currentPage.route

        var tabRoutes = [
          '/pages/index/index',
          '/pages/chores/chores',
          '/pages/shopping/shopping',
          '/pages/profile/profile'
        ]

        var index = tabRoutes.indexOf(route)
        if (index >= 0) {
          var tabBar = this.getTabBar()
          if (tabBar && tabBar.setData) {
            tabBar.setData({ selected: index })
          }
        }
      } catch (e) {
        // 非 tabBar 页面，忽略
      }
    }
  }
})

module.exports = themeBehavior
