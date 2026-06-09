/**
 * 旅行计划页面
 * 提供旅行计划列表、详情、待办/行李清单管理、每日行程等功能
 */
var travelService = require('../../services/travel-service')
var themeBehavior = require('../../behaviors/theme-behavior')

Page({
  behaviors: [themeBehavior],

  data: {
    plans: [],
    selectedPlan: null,
    showDetail: false,
    showAddForm: false,
    detailTab: 0,
    detailTabs: ['待办清单', '行李清单', '每日行程'],
    loading: true,
    newPlan: {
      title: '',
      destination: '',
      startDate: '',
      endDate: '',
      budget: ''
    },
    newTodoText: '',
    newPackingText: '',
    // 统计
    totalPlans: 0,
    upcomingCount: 0,
    nearestDays: 0
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
    that.setData({ loading: true })

    travelService.getPlans().then(function(plans) {
      var now = new Date()
      now.setHours(0, 0, 0, 0)
      var upcoming = plans.filter(function(p) { return p.status === 'planning' })
      var nearestDays = 0
      if (upcoming.length > 0) {
        var nearest = upcoming.reduce(function(min, p) {
          var start = new Date(p.startDate)
          start.setHours(0, 0, 0, 0)
          var diff = Math.ceil((start - now) / 86400000)
          return diff < min ? diff : min
        }, Infinity)
        nearestDays = nearest > 0 ? nearest : 0
      }

      // 计算每个计划的 daysUntil
      plans = plans.map(function(p) {
        var start = new Date(p.startDate)
        start.setHours(0, 0, 0, 0)
        var diff = Math.ceil((start - now) / 86400000)
        p.daysUntil = diff > 0 ? diff : 0
        var todoTotal = p.todos ? p.todos.length : 0
        var todoDone = p.todos ? p.todos.filter(function(t) { return t.done }).length : 0
        p.todoProgress = todoTotal > 0 ? Math.round(todoDone / todoTotal * 100) : 0
        var packTotal = p.packingList ? p.packingList.length : 0
        var packDone = p.packingList ? p.packingList.filter(function(t) { return t.done }).length : 0
        p.packProgress = packTotal > 0 ? Math.round(packDone / packTotal * 100) : 0
        return p
      })

      that.setData({
        plans: plans,
        totalPlans: plans.length,
        upcomingCount: upcoming.length,
        nearestDays: nearestDays,
        loading: false
      })
    }).catch(function(e) {
      console.error('[travel] 加载数据失败:', e)
      that.setData({ loading: false })
    })
  },

  // ========== 计划详情 ==========
  onPlanTap: function(e) {
    var id = e.currentTarget.dataset.id
    var plan = this.data.plans.find(function(p) { return p.id === id })
    if (plan) {
      this.setData({ selectedPlan: plan, showDetail: true, detailTab: 0, newTodoText: '', newPackingText: '' })
    }
  },

  onCloseDetail: function() {
    this.setData({ showDetail: false, selectedPlan: null })
  },

  onDetailTabChange: function(e) {
    this.setData({ detailTab: parseInt(e.currentTarget.dataset.index) })
  },

  // ========== 待办操作 ==========
  onToggleTodo: function(e) {
    var planId = this.data.selectedPlan.id
    var todoId = e.currentTarget.dataset.id
    var that = this
    travelService.toggleTodo(planId, todoId).then(function() {
      that._refreshPlan(planId)
    }).catch(function() {
      wx.showToast({ title: '操作失败', icon: 'none' })
    })
  },

  onNewTodoInput: function(e) {
    this.setData({ newTodoText: e.detail.value })
  },

  onAddTodo: function() {
    var text = this.data.newTodoText.trim()
    if (!text) return
    var that = this
    var planId = this.data.selectedPlan.id
    var plan = this.data.plans.find(function(p) { return p.id === planId })
    if (!plan) return

    var todos = plan.todos || []
    todos.push({ id: 'todo_' + Date.now(), text: text, done: false })

    travelService.updatePlan(planId, { todos: todos }).then(function() {
      that.setData({ newTodoText: '' })
      that._refreshPlan(planId)
    }).catch(function() {
      wx.showToast({ title: '添加失败', icon: 'none' })
    })
  },

  onDeleteTodo: function(e) {
    var todoId = e.currentTarget.dataset.id
    var planId = this.data.selectedPlan.id
    var that = this
    var plan = this.data.plans.find(function(p) { return p.id === planId })
    if (!plan) return

    plan.todos = (plan.todos || []).filter(function(t) { return t.id !== todoId })
    travelService.updatePlan(planId, { todos: plan.todos }).then(function() {
      that._refreshPlan(planId)
    }).catch(function() {
      wx.showToast({ title: '删除失败', icon: 'none' })
    })
  },

  // ========== 行李操作 ==========
  onTogglePacking: function(e) {
    var planId = this.data.selectedPlan.id
    var itemId = e.currentTarget.dataset.id
    var that = this
    travelService.togglePacking(planId, itemId).then(function() {
      that._refreshPlan(planId)
    }).catch(function() {
      wx.showToast({ title: '操作失败', icon: 'none' })
    })
  },

  onNewPackingInput: function(e) {
    this.setData({ newPackingText: e.detail.value })
  },

  onAddPacking: function() {
    var text = this.data.newPackingText.trim()
    if (!text) return
    var that = this
    var planId = this.data.selectedPlan.id
    var plan = this.data.plans.find(function(p) { return p.id === planId })
    if (!plan) return

    var items = plan.packingList || []
    items.push({ id: 'pack_' + Date.now(), text: text, done: false })

    travelService.updatePlan(planId, { packingList: items }).then(function() {
      that.setData({ newPackingText: '' })
      that._refreshPlan(planId)
    }).catch(function() {
      wx.showToast({ title: '添加失败', icon: 'none' })
    })
  },

  onDeletePacking: function(e) {
    var itemId = e.currentTarget.dataset.id
    var planId = this.data.selectedPlan.id
    var that = this
    var plan = this.data.plans.find(function(p) { return p.id === planId })
    if (!plan) return

    plan.packingList = (plan.packingList || []).filter(function(t) { return t.id !== itemId })
    travelService.updatePlan(planId, { packingList: plan.packingList }).then(function() {
      that._refreshPlan(planId)
    }).catch(function() {
      wx.showToast({ title: '删除失败', icon: 'none' })
    })
  },

  // ========== 新建计划 ==========
  toggleAddForm: function() {
    this.setData({ showAddForm: !this.data.showAddForm })
  },

  onNewPlanInput: function(e) {
    var field = e.currentTarget.dataset.field
    var obj = {}
    obj['newPlan.' + field] = e.detail.value
    this.setData(obj)
  },

  onStartDateChange: function(e) {
    this.setData({ 'newPlan.startDate': e.detail.value })
  },

  onEndDateChange: function(e) {
    this.setData({ 'newPlan.endDate': e.detail.value })
  },

  confirmAddPlan: function() {
    var plan = this.data.newPlan
    if (!plan.title) {
      wx.showToast({ title: '请输入旅行标题', icon: 'none' })
      return
    }
    if (!plan.destination) {
      wx.showToast({ title: '请输入目的地', icon: 'none' })
      return
    }
    if (!plan.startDate) {
      wx.showToast({ title: '请选择出发日期', icon: 'none' })
      return
    }
    var that = this
    travelService.addPlan({
      title: plan.title,
      destination: plan.destination,
      startDate: plan.startDate,
      endDate: plan.endDate || plan.startDate,
      budget: parseInt(plan.budget) || 0
    }).then(function() {
      that.setData({
        showAddForm: false,
        newPlan: { title: '', destination: '', startDate: '', endDate: '', budget: '' }
      })
      wx.showToast({ title: '创建成功', icon: 'success' })
      that.loadData()
    }).catch(function() {
      wx.showToast({ title: '创建失败', icon: 'none' })
    })
  },

  onDeletePlan: function() {
    var planId = this.data.selectedPlan.id
    var that = this
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个旅行计划吗？',
      confirmColor: '#EF5350',
      success: function(res) {
        if (res.confirm) {
          travelService.deletePlan(planId).then(function() {
            that.setData({ showDetail: false, selectedPlan: null })
            wx.showToast({ title: '已删除', icon: 'success' })
            that.loadData()
          }).catch(function() {
            wx.showToast({ title: '删除失败', icon: 'none' })
          })
        }
      }
    })
  },

  // ========== 内部方法 ==========
  _refreshPlan: function(planId) {
    var that = this
    that.loadData()
    travelService.getPlanById(planId).then(function(plan) {
      if (plan) {
        var todos = plan.todos || []
        var done = todos.filter(function(t) { return t.done }).length
        plan.todoProgress = todos.length > 0 ? Math.round(done / todos.length * 100) : 0
        var items = plan.packingList || []
        var packDone = items.filter(function(t) { return t.done }).length
        plan.packProgress = items.length > 0 ? Math.round(packDone / items.length * 100) : 0
        that.setData({ selectedPlan: plan })
      }
    }).catch(function() {})
  }
})
