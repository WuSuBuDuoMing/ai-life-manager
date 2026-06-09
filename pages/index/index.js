/**
 * 首页生活仪表盘
 * 聚合展示所有模块的关键数据
 */
var dashboardService = require('../../services/dashboard-service')
var notificationService = require('../../services/notification-service')
var themeBehavior = require('../../behaviors/theme-behavior')

Page({
  behaviors: [themeBehavior],

  data: {
    statusBarHeight: 0,
    navHeight: 0,
    greeting: '',
    dateStr: '',
    dashboardData: {
      todoCount: 0,
      choreCount: 0,
      expiringFood: 0,
      monthlyExpense: '0.00',
      upcomingSubscriptions: 0,
      pendingShopping: 0,
      weeklyTidyProgress: 0,
      dailyTip: ''
    },
    todayChores: [],
    todayHabits: [],
    todayPetReminders: [],
    upcomingTrips: [],
    unpaidBills: [],
    reminders: [],
    reminderCount: 0,
    weeklySummary: { habitRate: 0, choreRate: 0, totalTasks: 0, completedTasks: 0 },
    quickActions: [
      { icon: '📝', title: '任务', page: '/pages/chores/chores' },
      { icon: '✅', title: '习惯', page: '/pages/habits/habits' },
      { icon: '🛒', title: '购物', page: '/pages/shopping/shopping' },
      { icon: '🧊', title: '冰箱', page: '/pages/fridge/fridge' },
      { icon: '🍳', title: '菜谱', page: '/pages/recipes/recipes' },
      { icon: '🐕', title: '宠物', page: '/pages/pets/pets' },
      { icon: '✈️', title: '旅行', page: '/pages/travel/travel' },
      { icon: '💳', title: '账单', page: '/pages/bills/bills' },
      { icon: '🤖', title: 'AI助手', page: '/pages/assistant/assistant' },
      { icon: '🔍', title: '搜索', page: '/pages/search/search' }
    ],
    loading: true,
    isDark: false
  },

  onLoad: function() {
    var sysInfo = wx.getSystemInfoSync()
    this.setData({
      statusBarHeight: sysInfo.statusBarHeight || 20,
      navHeight: (sysInfo.statusBarHeight || 20) + 44
    })
    this._initGreeting()
    this.loadData()
  },

  onShow: function() {
    this._checkTheme()
    this.loadData()
    try {
      var tabBar = this.getTabBar()
      if (tabBar && tabBar.setData) {
        tabBar.setData({ selected: 0 })
      }
    } catch (e) {}
  },

  onPullDownRefresh: function() {
    var that = this
    this.loadData()
    setTimeout(function() { wx.stopPullDownRefresh() }, 500)
  },

  _initGreeting: function() {
    try {
      var dateUtils = require('../../utils/date-utils')
      this.setData({
        greeting: dateUtils.getGreeting(),
        dateStr: this._getDateStr()
      })
    } catch (e) {
      this.setData({
        greeting: dashboardService.getGreeting ? dashboardService.getGreeting() : '你好',
        dateStr: dashboardService.getDateStr ? dashboardService.getDateStr() : ''
      })
    }
  },

  _getDateStr: function() {
    var now = new Date()
    var weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
    return (now.getMonth() + 1) + '月' + now.getDate() + '日 ' + weekDays[now.getDay()]
  },

  loadData: function() {
    var that = this
    this.setData({ loading: true })

    // 主数据：仪表盘聚合
    dashboardService.getDashboardData().then(function(dashboardData) {
      that.setData({ dashboardData: dashboardData, loading: false })
    }).catch(function(e) {
      console.error('[index] 加载仪表盘数据失败:', e)
      that.setData({ loading: false })
    })

    // 今日家务
    dashboardService.getTodayChores().then(function(todayChores) {
      that.setData({ todayChores: todayChores || [] })
    }).catch(function() {})

    // 本周家务完成率
    try {
      var choreService = require('../../services/chore-service')
      choreService.getChores().then(function(chores) {
        var completed = (chores || []).filter(function(c) { return c.status === 'completed' }).length
        var total = (chores || []).length || 1
        var choreRate = Math.round(completed / total * 100)
        that.setData({
          'weeklySummary.choreRate': choreRate,
          'weeklySummary.totalTasks': total,
          'weeklySummary.completedTasks': completed
        })
      }).catch(function() {})
    } catch (e) {}

    // 提醒数据
    notificationService.getReminderCounts().then(function(counts) {
      that.setData({ reminderCount: counts.total })
    }).catch(function() {})

    notificationService.getAllReminders().then(function(reminders) {
      that.setData({ reminders: (reminders || []).slice(0, 5) })
    }).catch(function() {})

    // 今日习惯 + 本周完成率
    try {
      var habitService = require('../../services/habit-service')
      habitService.getHabits().then(function(habits) {
        var today = new Date().toISOString().substring(0, 10)
        var todayHabits = (habits || []).filter(function(h) {
          return h.completedDates && h.completedDates.indexOf(today) >= 0
        })
        // 本周习惯完成率
        var now = new Date()
        var day = now.getDay() || 7
        var totalCheckins = 0
        var possibleCheckins = (habits || []).length * day
        ;(habits || []).forEach(function(h) {
          for (var i = 1; i <= day; i++) {
            var d = new Date(now)
            d.setDate(now.getDate() - day + i)
            var dateStr = d.toISOString().substring(0, 10)
            if (h.completedDates && h.completedDates.indexOf(dateStr) >= 0) totalCheckins++
          }
        })
        var habitRate = possibleCheckins > 0 ? Math.round(totalCheckins / possibleCheckins * 100) : 0
        that.setData({
          todayHabits: todayHabits,
          'weeklySummary.habitRate': habitRate
        })
      }).catch(function() {})
    } catch (e) {}

    // 宠物提醒
    try {
      var petService = require('../../services/pet-service')
      petService.getTodayReminders().then(function(reminders) {
        that.setData({ todayPetReminders: (reminders || []).slice(0, 3) })
      }).catch(function() {})
    } catch (e) {}

    // 旅行计划
    try {
      var travelService = require('../../services/travel-service')
      travelService.getPlans().then(function(plans) {
        var now = new Date()
        now.setHours(0, 0, 0, 0)
        var upcoming = (plans || []).filter(function(p) { return p.status === 'planning' })
        upcoming = upcoming.map(function(p) {
          var start = new Date(p.startDate)
          start.setHours(0, 0, 0, 0)
          var diff = Math.ceil((start - now) / 86400000)
          p.daysUntil = diff > 0 ? diff : 0
          return p
        }).sort(function(a, b) { return a.daysUntil - b.daysUntil })
        that.setData({ upcomingTrips: upcoming.slice(0, 2) })
      }).catch(function() {})
    } catch (e) {}

    // 未付账单
    try {
      var billService = require('../../services/bill-service')
      billService.getUnpaidBills().then(function(bills) {
        that.setData({ unpaidBills: (bills || []).slice(0, 3) })
      }).catch(function() {})
    } catch (e) {}
  },

  onQuickAction: function(e) {
    var page = e.currentTarget.dataset.page
    if (page) {
      wx.switchTab({
        url: page,
        fail: function() {
          wx.navigateTo({ url: page })
        }
      })
    }
  },

  onChoreTap: function(e) {
    var choreId = e.currentTarget.dataset.id
    wx.navigateTo({ url: '/pages/chores/chores?highlight=' + choreId })
  },

  onReminderTap: function(e) {
    var module = e.currentTarget.dataset.module
    if (module) {
      var pageMap = {
        'fridge': '/pages/fridge/fridge',
        'subscriptions': '/pages/subscriptions/subscriptions',
        'chores': '/pages/chores/chores',
        'room': '/pages/room/room'
      }
      var page = pageMap[module]
      if (page) {
        wx.switchTab({
          url: page,
          fail: function() { wx.navigateTo({ url: page }) }
        })
      }
    }
  },

  onViewAllReminders: function() {
    wx.navigateTo({ url: '/pages/profile/profile' })
  },

  onSearch: function() {
    wx.navigateTo({ url: '/pages/search/search' })
  },

  onGoHabits: function() {
    wx.navigateTo({ url: '/pages/habits/habits' })
  },

  onGoPets: function() {
    wx.navigateTo({ url: '/pages/pets/pets' })
  },

  onGoTravel: function() {
    wx.navigateTo({ url: '/pages/travel/travel' })
  }
})
