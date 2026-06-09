/**
 * 生活账本页面
 */
var budgetService = require('../../services/budget-service')
var themeBehavior = require('../../behaviors/theme-behavior')

Page({
  behaviors: [themeBehavior],

  data: {
    tabs: ['账单', '统计', '预算'],
    currentTab: 0,
    records: [],
    monthlyTotal: 0,
    yearlyTotal: 0,
    budgetInfo: { monthly: 3000, spent: 0, remaining: 0, usage: 0 },
    categoryBreakdown: [],
    weeklyTrend: [],
    anomalies: [],
    weeklySummary: '',
    isDark: false,
    loading: true,
    showAddForm: false,
    newRecord: {
      type: 'expense',
      amount: '',
      category: '饭钱',
      note: '',
      date: ''
    },
    sortOrder: 'newest',
    categories: ['房租', '饭钱', '交通', '购物', '娱乐', '日用', '订阅', '其他'],
    categoryIcons: {
      '房租': '🏠',
      '饭钱': '🍚',
      '交通': '🚌',
      '购物': '🛒',
      '娱乐': '🎮',
      '日用': '🧴',
      '订阅': '📱',
      '其他': '📦'
    }
  },

  onLoad: function() {
    this._initDate()
    this.loadRecords()
  },

  onShow: function() {
    this._checkTheme()
    this.loadRecords()
  },

  _initDate: function() {
    var now = new Date()
    var y = now.getFullYear()
    var m = String(now.getMonth() + 1).padStart(2, '0')
    var d = String(now.getDate()).padStart(2, '0')
    this.setData({
      'newRecord.date': y + '-' + m + '-' + d
    })
  },

  onTabChange: function(e) {
    var tab = parseInt(e.currentTarget.dataset.tab)
    this.setData({ currentTab: tab })
    if (tab === 1) {
      this._loadStatistics()
    } else if (tab === 2) {
      this._loadBudgetInfo()
    }
  },

  loadRecords: function() {
    var that = this
    that.setData({ loading: true })
    budgetService.getRecords().then(function(records) {
      var monthlyTotal = budgetService.getMonthlyTotal(records)
      var yearlyTotal = budgetService.getYearlyTotal(records)
      that.setData({
        records: records,
        monthlyTotal: monthlyTotal,
        yearlyTotal: yearlyTotal,
        loading: false
      })
    }).catch(function() {
      that.setData({ loading: false })
    })
  },

  _loadStatistics: function() {
    var that = this
    budgetService.getCategoryBreakdown().then(function(categoryBreakdown) {
      that.setData({ categoryBreakdown: categoryBreakdown })
    }).catch(function() {})
    budgetService.getWeeklyTrend().then(function(weeklyTrend) {
      that.setData({ weeklyTrend: weeklyTrend })
    }).catch(function() {})
    budgetService.getAnomalies().then(function(anomalies) {
      that.setData({ anomalies: anomalies })
    }).catch(function() {})
    budgetService.getWeeklySummary().then(function(weeklySummary) {
      that.setData({ weeklySummary: weeklySummary })
    }).catch(function() {})
  },

  _loadBudgetInfo: function() {
    var that = this
    budgetService.getBudgetInfo().then(function(budgetInfo) {
      that.setData({ budgetInfo: budgetInfo })
    }).catch(function() {})
  },

  toggleAddForm: function() {
    this.setData({ showAddForm: !this.data.showAddForm })
  },

  onAddRecord: function() {
    this.setData({ showAddForm: true })
  },

  confirmAddRecord: function() {
    var that = this
    var newRecord = this.data.newRecord
    if (!newRecord.amount || parseFloat(newRecord.amount) <= 0) {
      wx.showToast({ title: '请输入金额', icon: 'none' })
      return
    }
    budgetService.addRecord({
      type: newRecord.type,
      amount: parseFloat(newRecord.amount),
      category: newRecord.category,
      note: newRecord.note,
      date: newRecord.date
    }).then(function() {
      that.setData({
        showAddForm: false,
        'newRecord.amount': '',
        'newRecord.note': ''
      })
      wx.showToast({ title: '添加成功', icon: 'success' })
      that.loadRecords()
    }).catch(function() {
      wx.showToast({ title: '添加失败', icon: 'none' })
    })
  },

  onRecordInput: function(e) {
    var field = e.currentTarget.dataset.field
    this.setData({
      ['newRecord.' + field]: e.detail.value
    })
  },

  onTypeSwitch: function(e) {
    var type = e.currentTarget.dataset.type
    this.setData({ 'newRecord.type': type })
  },

  onCategorySelect: function(e) {
    var category = e.currentTarget.dataset.category
    this.setData({ 'newRecord.category': category })
  },

  getCategoryIcon: function(category) {
    return this.data.categoryIcons[category] || '📦'
  },

  onSortChange: function(e) {
    var sort = e.currentTarget.dataset.sort
    this.setData({ sortOrder: sort })
  },

  getMonthLabel: function(month) {
    var labels = ['', '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
    return labels[month] || ''
  },

  onRecordTap: function(e) {
    wx.showToast({ title: '查看账单详情', icon: 'none' })
  }
})
