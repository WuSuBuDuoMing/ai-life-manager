/**
 * 家务分工页面
 */
var choreService = require('../../services/chore-service')
var themeBehavior = require('../../behaviors/theme-behavior')

Page({
  behaviors: [themeBehavior],

  data: {
    tabs: ['全部', '待完成', '进行中', '已完成'],
    currentTab: 0,
    chores: [],
    filteredChores: [],
    searchedChores: [],
    leaderboard: [],
    weeklySchedule: [],
    showSchedule: false,
    totalPoints: 0,
    memberPoints: {},
    loading: true,
    searchKeyword: '',
    isDark: false,
    showStats: true
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

    choreService.getChores().then(function(chores) {
      // 计算统计
      var completed = chores.filter(function(c) { return c.status === 'completed' }).length
      var pending = chores.filter(function(c) { return c.status === 'pending' }).length

      that.setData({
        chores: chores,
        filteredChores: chores,
        searchedChores: chores,
        completedCount: completed,
        pendingCount: pending,
        loading: false
      })
      that._applyFilter()
    }).catch(function(e) {
      console.error('[chores] 加载家务数据失败:', e)
      that.setData({ loading: false })
    })

    choreService.getLeaderboard().then(function(leaderboard) {
      var totalPoints = leaderboard.reduce(function(sum, m) { return sum + (m.points || 0) }, 0)
      var memberPoints = {}
      leaderboard.forEach(function(m) { memberPoints[m.name] = m.points })
      that.setData({
        leaderboard: leaderboard,
        totalPoints: totalPoints,
        memberPoints: memberPoints
      })
    }).catch(function() {})

    choreService.getWeeklySchedule().then(function(weeklySchedule) {
      that.setData({ weeklySchedule: weeklySchedule })
    }).catch(function() {})
  },

  onTabChange: function(e) {
    var index = parseInt(e.currentTarget.dataset.index)
    this.setData({ currentTab: index })
    this._applyFilter()
  },

  _applyFilter: function() {
    var tab = this.data.currentTab
    var chores = this.data.chores
    var keyword = this.data.searchKeyword.toLowerCase()
    var filtered

    if (tab === 0) {
      filtered = chores
    } else if (tab === 1) {
      filtered = chores.filter(function(c) { return c.status === 'pending' })
    } else if (tab === 2) {
      filtered = chores.filter(function(c) { return c.status === 'in_progress' })
    } else {
      filtered = chores.filter(function(c) { return c.status === 'completed' })
    }

    // 搜索过滤
    if (keyword) {
      filtered = filtered.filter(function(c) {
        return (c.title && c.title.toLowerCase().indexOf(keyword) >= 0) ||
          (c.assignedTo && c.assignedTo.toLowerCase().indexOf(keyword) >= 0) ||
          (c.category && c.category.toLowerCase().indexOf(keyword) >= 0)
      })
    }

    this.setData({ filteredChores: filtered, searchedChores: filtered })
  },

  onSearchInput: function(e) {
    this.setData({ searchKeyword: e.detail.value })
    this._applyFilter()
  },

  onSearchClear: function() {
    this.setData({ searchKeyword: '' })
    this._applyFilter()
  },

  onChoreComplete: function(e) {
    var choreId = e.currentTarget.dataset.id
    var that = this
    choreService.completeChore(choreId).then(function() {
      wx.vibrateShort({ type: 'medium' })
      wx.showToast({ title: '完成！+积分', icon: 'success' })
      that.loadData()
    }).catch(function() {
      wx.showToast({ title: '操作失败', icon: 'none' })
    })
  },

  onChoreTap: function(e) {
    var choreId = e.currentTarget.dataset.id
    wx.showToast({ title: '查看详情', icon: 'none' })
  },

  onGenerateWeekly: function() {
    var that = this
    wx.showModal({
      title: '生成本周安排',
      content: '将自动为每位成员分配本周家务，是否继续？',
      success: function(res) {
        if (res.confirm) {
          choreService.generateWeeklyPlan().then(function() {
            that.loadData()
            wx.showToast({ title: '本周安排已生成', icon: 'success' })
          }).catch(function() {
            wx.showToast({ title: '生成失败', icon: 'none' })
          })
        }
      }
    })
  },

  onAddChore: function() {
    wx.showToast({ title: '添加家务功能', icon: 'none' })
  },

  toggleSchedule: function() {
    this.setData({ showSchedule: !this.data.showSchedule })
  },

  toggleStats: function() {
    this.setData({ showStats: !this.data.showStats })
  },

  onMemberTap: function(e) {
    var member = e.currentTarget.dataset.member
    if (member) {
      this.setData({
        currentTab: 0,
        searchKeyword: member
      })
      this._applyFilter()
    }
  }
})
