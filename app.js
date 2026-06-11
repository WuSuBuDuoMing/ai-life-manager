/**
 * AI 生活管家 - 应用入口
 */
App({
  globalData: {
    theme: 'light',
    userInfo: {
      nickname: '生活家',
      avatar: ''
    },
    familyMembers: ['我', '室友A', '室友B'],
    currentWeekStart: '',
    currentWeekEnd: '',
    budget: {
      monthly: 3000,
      currency: '¥'
    },
    version: '1.2.0'
  },

  onLaunch: function() {
    try {
      // 初始化主题
      var theme = wx.getStorageSync('theme') || 'light'
      this.globalData.theme = theme

      // 初始化本周日期范围
      this._initWeekRange()

      // 检查数据版本
      this._checkDataVersion()

      // 初始化默认数据
      this._initDefaultData()

      console.log('[AI生活管家] 小程序启动完成 v' + this.globalData.version)
    } catch (e) {
      console.error('[AI生活管家] 启动异常:', e)
    }
  },

  onShow: function() {
    try {
      var theme = wx.getStorageSync('theme') || 'light'
      if (theme !== this.globalData.theme) {
        this.globalData.theme = theme
      }
    } catch (e) {
      // 静默处理
    }
  },

  /**
   * 初始化本周日期范围
   */
  _initWeekRange: function() {
    var now = new Date()
    var day = now.getDay()
    var diff = now.getDate() - day + (day === 0 ? -6 : 1)
    var monday = new Date(now)
    monday.setDate(diff)
    var sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)
    this.globalData.currentWeekStart = this._formatDate(monday)
    this.globalData.currentWeekEnd = this._formatDate(sunday)
  },

  /**
   * 格式化日期
   */
  _formatDate: function(date) {
    var y = date.getFullYear()
    var m = String(date.getMonth() + 1).padStart(2, '0')
    var d = String(date.getDate()).padStart(2, '0')
    return y + '-' + m + '-' + d
  },

  /**
   * 检查数据版本，处理迁移
   */
  _checkDataVersion: function() {
    var storedVersion = wx.getStorageSync('data_version') || '0.0.0'
    if (storedVersion !== this.globalData.version) {
      console.log('[AI生活管家] 数据版本升级:', storedVersion, '->', this.globalData.version)
      wx.setStorageSync('data_version', this.globalData.version)
    }
  },

  /**
   * 初始化默认配置数据
   */
  _initDefaultData: function() {
    // 初始化预算设置（如果不存在）
    if (!wx.getStorageSync('budget_settings')) {
      wx.setStorageSync('budget_settings', {
        monthly: 3000,
        currency: '¥',
        categories: {
          '房租': 1500, '饭钱': 800, '交通': 200,
          '购物': 300, '订阅': 200
        }
      })
    }

    // 初始化用户设置（如果不存在）
    if (!wx.getStorageSync('user_settings')) {
      wx.setStorageSync('user_settings', {
        nickname: '生活家',
        familyMembers: ['我', '室友A', '室友B'],
        theme: 'light',
        notifications: true
      })
    }
  },

  /**
   * 获取当前主题
   * @returns {string} 'light' 或 'dark'
   */
  getTheme: function() {
    return this.globalData.theme
  },

  /**
   * 获取家庭成员列表
   * @returns {Array}
   */
  getMembers: function() {
    return this.globalData.familyMembers
  },

  /**
   * 获取预算配置
   * @returns {Object}
   */
  getBudgetConfig: function() {
    return this.globalData.budget
  }
})
