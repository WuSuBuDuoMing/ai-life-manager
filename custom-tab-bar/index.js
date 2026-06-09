/**
 * 自定义底部导航栏
 * 支持暗色模式、选中态高亮、徽标显示
 */
Component({
  data: {
    selected: 0,
    color: '#999999',
    selectedColor: '#4CAF50',
    isDark: false,
    list: [
      { pagePath: '/pages/index/index', text: '首页', icon: '🏠', selectedIcon: '🏡', badge: 0 },
      { pagePath: '/pages/chores/chores', text: '家务', icon: '🧹', selectedIcon: '✨', badge: 0 },
      { pagePath: '/pages/shopping/shopping', text: '购物', icon: '🛒', selectedIcon: '🛍️', badge: 0 },
      { pagePath: '/pages/profile/profile', text: '我的', icon: '👤', selectedIcon: '👩', badge: 0 }
    ]
  },

  lifetimes: {
    attached: function() {
      this._checkTheme()
    }
  },

  pageLifetimes: {
    show: function() {
      this._checkTheme()
    }
  },

  methods: {
    switchTab: function(e) {
      var data = e.currentTarget.dataset
      var url = data.path
      wx.switchTab({ url: url })
    },

    /**
     * 检查当前主题
     */
    _checkTheme: function() {
      try {
        var theme = wx.getStorageSync('theme') || 'light'
        this.setData({ isDark: theme === 'dark' })
      } catch (e) {
        // 静默处理
      }
    }
  }
})
