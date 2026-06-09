/**
 * 搜索栏组件
 * 支持暗色模式
 */
Component({
  properties: {
    placeholder: { type: String, value: '搜索...' },
    value: { type: String, value: '' },
    showCancel: { type: Boolean, value: false },
    focus: { type: Boolean, value: false },
    bgColor: { type: String, value: '' }
  },
  data: {
    isFocused: false,
    isDark: false
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
    _checkTheme: function() {
      try {
        var theme = wx.getStorageSync('theme') || 'light'
        this.setData({ isDark: theme === 'dark' })
      } catch (e) {}
    },

    onInput: function(e) {
      this.setData({ value: e.detail.value })
      this.triggerEvent('input', { value: e.detail.value })
    },
    onFocus: function() {
      this.setData({ isFocused: true })
      this.triggerEvent('focus')
    },
    onBlur: function() {
      this.setData({ isFocused: false })
      this.triggerEvent('blur')
    },
    onClear: function() {
      this.setData({ value: '' })
      this.triggerEvent('clear')
      this.triggerEvent('input', { value: '' })
    },
    onSearch: function() {
      this.triggerEvent('search', { value: this.data.value })
    },
    onCancel: function() {
      this.setData({ value: '', isFocused: false })
      this.triggerEvent('cancel')
    }
  }
})
