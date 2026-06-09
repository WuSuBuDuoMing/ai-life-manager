/**
 * 订阅管理页面
 */
var subscriptionService = require('../../services/subscription-service')
var themeBehavior = require('../../behaviors/theme-behavior')

Page({
  behaviors: [themeBehavior],

  data: {
    subscriptions: [],
    monthlyTotal: 0,
    yearlyTotal: 0,
    upcomingRenewals: [],
    categoryBreakdown: [],
    loading: true,
    isDark: false,
    viewMode: 'list',
    sortBy: 'nextBilling',
    showAddForm: false,
    newSub: { name: '', price: '', billingCycle: 'monthly', category: '娱乐', nextBillingDate: '', autoRenew: true },
    categoryOptions: ['娱乐', '工具', '云存储', '学习', '音乐', '视频', '社交', '其他'],
    cycleOptions: [
      { id: 'monthly', name: '月付' },
      { id: 'yearly', name: '年付' }
    ]
  },

  onLoad: function() {
    this.loadData()
  },

  onShow: function() {
    this._checkTheme()
    this.loadData()
  },

  onPullDownRefresh: function() {
    this.loadData()
    wx.stopPullDownRefresh()
  },

  loadData: function() {
    var that = this
    this.setData({ loading: true })

    subscriptionService.getSubscriptions().then(function(subs) {
      that.setData({ subscriptions: subs || [], loading: false })
      that._calcCategoryBreakdown()
    }).catch(function(e) {
      console.error('[subscriptions] 加载订阅失败:', e)
      that.setData({ loading: false })
    })

    subscriptionService.calculateMonthlyTotal().then(function(cost) {
      that.setData({ monthlyTotal: cost || 0 })
    }).catch(function() {})

    subscriptionService.calculateYearlyTotal().then(function(cost) {
      that.setData({ yearlyTotal: cost || 0 })
    }).catch(function() {})

    subscriptionService.getUpcomingRenewals(7).then(function(items) {
      that.setData({ upcomingRenewals: items || [] })
    }).catch(function() {})
  },

  _calcCategoryBreakdown: function() {
    var subs = this.data.subscriptions
    var map = {}
    subs.forEach(function(s) {
      var cat = s.category || '其他'
      map[cat] = (map[cat] || 0) + (s.price || 0)
    })
    var breakdown = []
    for (var k in map) {
      if (map.hasOwnProperty(k)) {
        breakdown.push({ label: k, value: Math.round(map[k] * 100) / 100, color: '' })
      }
    }
    breakdown.sort(function(a, b) { return b.value - a.value })
    this.setData({ categoryBreakdown: breakdown })
  },

  toggleViewMode: function() {
    this.setData({ viewMode: this.data.viewMode === 'list' ? 'stats' : 'list' })
  },

  onSortChange: function(e) {
    var sortBy = e.currentTarget.dataset.sort
    this.setData({ sortBy: sortBy })
  },

  getSortedSubscriptions: function() {
    var subs = this.data.subscriptions.slice()
    var sortBy = this.data.sortBy
    if (sortBy === 'price') {
      subs.sort(function(a, b) { return (b.price || 0) - (a.price || 0) })
    } else if (sortBy === 'name') {
      subs.sort(function(a, b) { return (a.name || '').localeCompare(b.name || '') })
    } else {
      subs.sort(function(a, b) { return new Date(a.nextBillingDate || '9999') - new Date(b.nextBillingDate || '9999') })
    }
    return subs
  },

  toggleAddForm: function() {
    this.setData({ showAddForm: !this.data.showAddForm })
  },

  onNewSubInput: function(e) {
    var field = e.currentTarget.dataset.field
    var obj = {}
    obj['newSub.' + field] = e.detail.value
    this.setData(obj)
  },

  onCycleSelect: function(e) {
    this.setData({ 'newSub.billingCycle': e.currentTarget.dataset.cycle })
  },

  onCategorySelect: function(e) {
    this.setData({ 'newSub.category': e.currentTarget.dataset.category })
  },

  onAutoRenewToggle: function() {
    this.setData({ 'newSub.autoRenew': !this.data.newSub.autoRenew })
  },

  confirmAddSub: function() {
    var sub = this.data.newSub
    if (!sub.name) { wx.showToast({ title: '请输入订阅名称', icon: 'none' }); return }
    if (!sub.price) { wx.showToast({ title: '请输入价格', icon: 'none' }); return }
    var that = this
    subscriptionService.addSubscription({
      name: sub.name, price: parseFloat(sub.price),
      billingCycle: sub.billingCycle, category: sub.category,
      nextBillingDate: sub.nextBillingDate, autoRenew: sub.autoRenew
    }).then(function() {
      that.setData({
        showAddForm: false,
        newSub: { name: '', price: '', billingCycle: 'monthly', category: '娱乐', nextBillingDate: '', autoRenew: true }
      })
      wx.showToast({ title: '添加成功', icon: 'success' })
      that.loadData()
    }).catch(function() {
      wx.showToast({ title: '添加失败', icon: 'none' })
    })
  },

  onDeleteSubscription: function(e) {
    var id = e.detail ? e.detail.id : e.currentTarget.dataset.id
    var that = this
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个订阅吗？',
      confirmColor: '#EF5350',
      success: function(res) {
        if (res.confirm) {
          subscriptionService.deleteSubscription(id).then(function() {
            that.loadData()
            wx.showToast({ title: '已删除', icon: 'success' })
          }).catch(function() {
            wx.showToast({ title: '删除失败', icon: 'none' })
          })
        }
      }
    })
  },

  getAISavingTips: function() {
    subscriptionService.getAISavingTips().then(function(tips) {
      wx.showModal({ title: '💡 AI 省钱建议', content: (tips || []).join('\n'), showCancel: false })
    }).catch(function() {
      wx.showToast({ title: '获取建议失败', icon: 'none' })
    })
  }
})
