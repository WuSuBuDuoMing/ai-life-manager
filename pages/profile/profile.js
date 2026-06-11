/**
 * 个人中心页面
 */
var themeBehavior = require('../../behaviors/theme-behavior')
var exportService = require('../../services/export-service')
var notificationService = require('../../services/notification-service')
var lifeScoreService = require('../../services/life-score-service')

Page({
  behaviors: [themeBehavior],

  data: {
    userInfo: { nickname: '生活家', avatar: '' },
    reminderCount: 0,
    reminderSummary: '',
    lifeScore: { totalScore: 0, level: 1, levelName: '生活新手', levelIcon: '🌱', comment: '', breakdown: {} },
    stats: {
      chores: { done: 0, total: 0, rate: 0, points: 0 },
      habits: { total: 0, todayDone: 0, bestStreak: 0 },
      shopping: { done: 0, total: 0, spent: 0 },
      budget: { monthExpense: 0, balance: 0 },
      fridge: { total: 0, expiring: 0 },
      bills: { total: 0, unpaid: 0, unpaidAmount: 0, overdue: 0 },
      subscriptions: { total: 0, monthlyCost: 0 },
      wardrobe: { total: 0, dirty: 0 },
      room: { done: 0, total: 0, rate: 0 },
      travel: { total: 0, upcoming: 0 }
    },
    menuGroups: [
      {
        title: '生活管理',
        items: [
          { icon: '🧹', title: '家务分工', page: '/pages/chores/chores' },
          { icon: '✅', title: '习惯打卡', page: '/pages/habits/habits' },
          { icon: '📋', title: '生活清单', page: '/pages/checklists/checklists' },
          { icon: '🛒', title: '购物清单', page: '/pages/shopping/shopping' },
          { icon: '💳', title: '账单提醒', page: '/pages/bills/bills' }
        ]
      },
      {
        title: '家与生活',
        items: [
          { icon: '💰', title: '生活账本', page: '/pages/budget/budget' },
          { icon: '🧊', title: '冰箱食材', page: '/pages/fridge/fridge' },
          { icon: '🍳', title: '菜谱速查', page: '/pages/recipes/recipes' },
          { icon: '👔', title: '衣橱洗衣', page: '/pages/wardrobe/wardrobe' },
          { icon: '🏠', title: '房间整理', page: '/pages/room/room' }
        ]
      },
      {
        title: '特别功能',
        items: [
          { icon: '🐕', title: '宠物生活', page: '/pages/pets/pets' },
          { icon: '✈️', title: '旅行计划', page: '/pages/travel/travel' },
          { icon: '🤖', title: 'AI 助手', page: '/pages/assistant/assistant' },
          { icon: '🔍', title: '全局搜索', page: '/pages/search/search' }
        ]
      },
      {
        title: '设置',
        items: [
          { icon: '🌙', title: '深色模式', action: 'toggleTheme' },
          { icon: '🔔', title: '提醒通知', action: 'showReminders' },
          { icon: '📤', title: '数据导出', action: 'exportData' },
          { icon: '🗑️', title: '清除缓存', action: 'clearCache' },
          { icon: '❓', title: '使用帮助', action: 'showHelp' },
          { icon: 'ℹ️', title: '关于', action: 'showAbout' }
        ]
      }
    ],
    version: '1.0.0'
  },

  onLoad: function() {
    this._loadUserInfo()
    this.loadStats()
    this.loadReminders()
    this.loadLifeScore()
  },

  onShow: function() {
    this._loadUserInfo()
    this.loadStats()
    this.loadReminders()
    this.loadLifeScore()
  },

  _loadUserInfo: function() {
    var app = getApp()
    var userInfo = app.globalData.userInfo || this.data.userInfo
    this.setData({ userInfo: userInfo })
  },

  /**
   * 加载统计数据
   */
  loadStats: function() {
    var that = this
    exportService.getLifeOverview().then(function(data) {
      that.setData({ stats: data })
    }).catch(function(e) {
      console.error('[profile] 加载统计失败:', e)
    })
  },

  /**
   * 加载提醒数据
   */
  loadReminders: function() {
    var that = this
    notificationService.getReminderCounts().then(function(counts) {
      that.setData({ reminderCount: counts.total })
    }).catch(function() {})
    notificationService.getDailySummary().then(function(summary) {
      that.setData({ reminderSummary: summary })
    }).catch(function() {})
  },

  /**
   * 加载生活积分
   */
  loadLifeScore: function() {
    var that = this
    lifeScoreService.getLifeScore().then(function(score) {
      that.setData({ lifeScore: score })
    }).catch(function(e) {
      console.error('[profile] 加载积分失败:', e)
    })
  },

  /**
   * 菜单项点击
   */
  onMenuTap: function(e) {
    var menu = e.currentTarget.dataset.menu
    if (menu.action && typeof this[menu.action] === 'function') {
      this[menu.action]()
    } else if (menu.page) {
      wx.navigateTo({ url: menu.page })
    }
  },



  /**
   * 显示提醒通知
   */
  showReminders: function() {
    var that = this
    notificationService.getAllReminders().then(function(reminders) {
      if (reminders.length === 0) {
        wx.showModal({ title: '提醒通知', content: '目前没有任何提醒，一切正常！🎉', showCancel: false })
        return
      }
      var content = reminders.slice(0, 8).map(function(r) {
        return r.icon + ' ' + r.title
      }).join('\n')
      if (reminders.length > 8) content += '\n...还有' + (reminders.length - 8) + '条'
      wx.showModal({ title: '提醒通知 (' + reminders.length + '条)', content: content, showCancel: false })
    }).catch(function() {})
  },

  /**
   * 数据导出
   */
  exportData: function() {
    var that = this
    wx.showActionSheet({
      itemList: ['导出为文本摘要', '导出原始数据'],
      success: function(res) {
        if (res.tapIndex === 0) {
          exportService.exportAsText().then(function(text) {
            wx.setClipboardData({
              data: text,
              success: function() {
                wx.showToast({ title: '已复制到剪贴板', icon: 'success' })
              }
            })
          }).catch(function() {
            wx.showToast({ title: '导出失败', icon: 'none' })
          })
        } else {
          that._exportRawData()
        }
      }
    })
  },

  _exportRawData: function() {
    try {
      var data = {
        exportTime: new Date().toISOString(),
        version: this.data.version,
        chores: wx.getStorageSync('chores') || [],
        habits: wx.getStorageSync('habits') || [],
        shopping: wx.getStorageSync('shopping_items') || [],
        expenses: wx.getStorageSync('budget_records') || [],
        subscriptions: wx.getStorageSync('subscriptions') || [],
        fridge: wx.getStorageSync('fridge_items') || [],
        wardrobe: wx.getStorageSync('wardrobe_items') || [],
        room: wx.getStorageSync('room_tasks') || [],
        pets: wx.getStorageSync('pet_data') || null,
        travel: wx.getStorageSync('travel_plans') || [],
        bills: wx.getStorageSync('bills') || []
      }
      var jsonStr = JSON.stringify(data, null, 2)
      wx.setClipboardData({
        data: jsonStr,
        success: function() {
          wx.showToast({ title: '数据已复制到剪贴板', icon: 'success' })
        }
      })
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' })
    }
  },

  /**
   * 清除缓存（保留主题设置，重新初始化默认数据）
   */
  clearCache: function() {
    var that = this
    wx.showModal({
      title: '清除缓存',
      content: '将清除所有本地数据并恢复默认，主题设置会保留。确定继续？',
      confirmColor: '#EF5350',
      success: function(res) {
        if (res.confirm) {
          // 保留主题设置
          var theme = wx.getStorageSync('theme') || 'light'
          wx.clearStorageSync()
          // 恢复主题
          wx.setStorageSync('theme', theme)
          // 重新初始化应用默认数据
          var app = getApp()
          if (app && app._initDefaultData) {
            app._initDefaultData()
          }
          wx.showToast({ title: '缓存已清除', icon: 'success' })
          that.loadStats()
          that.loadReminders()
          that.loadLifeScore()
        }
      }
    })
  },

  /**
   * 使用帮助
   */
  showHelp: function() {
    wx.showModal({
      title: '使用帮助',
      content: '🏠 AI 生活管家 v1.2.0\n\n📝 任务管理 - 今日待办和提醒\n✅ 习惯打卡 - 每日打卡和连续统计\n🛒 购物清单 - 智能分类和补货\n🧊 冰箱食材 - 过期提醒和菜谱推荐\n🍳 菜谱速查 - 20+菜谱和收藏\n🐕 宠物生活 - 喂食/遛宠/日记\n✈️ 旅行计划 - 行程和行李管理\n💳 账单提醒 - 付款提醒和统计\n🤖 AI助手 - 智能生活建议\n🔍 全局搜索 - 跨模块搜索\n\n💡 支持深色模式\n📤 支持数据导出',
      showCancel: false
    })
  },

  /**
   * 关于
   */
  showAbout: function() {
    wx.showModal({
      title: '关于 AI 生活管家',
      content: 'AI 生活管家 v1.2.0\n\n一款本地优先的一站式生活管理小程序，整合任务、习惯、饮食、冰箱、宠物、旅行、账单等15+功能模块。\n\n让生活更有条理，让家更温馨 🏠',
      showCancel: false
    })
  },

  /**
   * 头像点击
   */
  onAvatarTap: function() {
    wx.showToast({ title: '个人设置', icon: 'none' })
  }
})
