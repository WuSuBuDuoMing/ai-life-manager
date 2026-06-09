/**
 * 习惯打卡页面
 */
var habitService = require('../../services/habit-service')
var themeBehavior = require('../../behaviors/theme-behavior')

Page({
  behaviors: [themeBehavior],

  data: {
    habits: [],
    todayCompleted: 0,
    totalHabits: 0,
    totalStreak: 0,
    selectedCategory: '全部',
    categories: ['全部', '健康', '学习', '工作', '生活', '宠物'],
    showAddForm: false,
    newHabit: { name: '', category: '健康', icon: '✅' },
    loading: true,
    filteredHabits: [],
    weeklyTrend: [],
    weeklyTrendMax: 1,
    iconOptions: ['✅', '🌅', '💧', '📖', '🏃', '🧘', '✒️', '📝', '🍳', '🌙', '✨', '🐕', '🗂️', '📚', '🚫', '💪', '🎯', '🧘‍♀️', '🎧', '🌱']
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

    habitService.getHabits().then(function(habits) {
      var today = that._getToday()
      var todayCompleted = habits.filter(function(h) {
        return h.completedDates && h.completedDates.indexOf(today) > -1
      }).length
      var totalStreak = 0
      habits.forEach(function(h) {
        if (h.currentStreak > totalStreak) totalStreak = h.currentStreak
      })

      // 计算本周每天的完成数（用于趋势图）
      var now = new Date()
      var dayOfWeek = now.getDay() || 7
      var weekLabels = ['一', '二', '三', '四', '五', '六', '日']
      var weeklyTrend = []
      var weeklyTrendMax = 1
      for (var i = 1; i <= 7; i++) {
        var d = new Date(now)
        d.setDate(now.getDate() - dayOfWeek + i)
        var dateStr = d.toISOString().substring(0, 10)
        var count = habits.filter(function(h) {
          return h.completedDates && h.completedDates.indexOf(dateStr) > -1
        }).length
        weeklyTrend.push({
          label: weekLabels[i - 1],
          value: count,
          color: i <= dayOfWeek ? '#4CAF50' : '#E0E0E0'
        })
        if (count > weeklyTrendMax) weeklyTrendMax = count
      }

      that.setData({
        habits: habits,
        totalHabits: habits.length,
        todayCompleted: todayCompleted,
        totalStreak: totalStreak,
        weeklyTrend: weeklyTrend,
        weeklyTrendMax: weeklyTrendMax,
        loading: false
      })
      that.getFilteredHabits()
    }).catch(function(e) {
      console.error('[habits] 加载数据失败:', e)
      that.setData({ loading: false })
    })
  },

  onCategoryFilter: function(e) {
    this.setData({ selectedCategory: e.currentTarget.dataset.category })
    this.getFilteredHabits()
  },

  onToggleHabit: function(e) {
    var id = e.currentTarget.dataset.id
    var that = this
    habitService.toggleToday(id).then(function() {
      wx.vibrateShort({ type: 'medium' })
      that.loadData()
    }).catch(function() {
      wx.showToast({ title: '操作失败', icon: 'none' })
    })
  },

  onDeleteHabit: function(e) {
    var id = e.currentTarget.dataset.id
    var that = this
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个习惯吗？打卡记录将丢失。',
      confirmColor: '#EF5350',
      success: function(res) {
        if (res.confirm) {
          habitService.deleteHabit(id).then(function() {
            wx.showToast({ title: '已删除', icon: 'success' })
            that.loadData()
          }).catch(function() {
            wx.showToast({ title: '删除失败', icon: 'none' })
          })
        }
      }
    })
  },

  toggleAddForm: function() {
    this.setData({ showAddForm: !this.data.showAddForm })
  },

  onNewHabitInput: function(e) {
    var field = e.currentTarget.dataset.field
    var obj = {}
    obj['newHabit.' + field] = e.detail.value
    this.setData(obj)
  },

  onIconSelect: function(e) {
    var icon = e.currentTarget.dataset.icon
    this.setData({ 'newHabit.icon': icon })
  },

  onCategorySelect: function(e) {
    var category = e.currentTarget.dataset.category
    this.setData({ 'newHabit.category': category })
  },

  confirmAddHabit: function() {
    var habit = this.data.newHabit
    if (!habit.name) {
      wx.showToast({ title: '请输入习惯名称', icon: 'none' })
      return
    }
    var that = this
    habitService.addHabit({
      name: habit.name,
      category: habit.category,
      icon: habit.icon
    }).then(function() {
      that.setData({
        showAddForm: false,
        newHabit: { name: '', category: '健康', icon: '✅' }
      })
      wx.showToast({ title: '添加成功', icon: 'success' })
      that.loadData()
    }).catch(function() {
      wx.showToast({ title: '添加失败', icon: 'none' })
    })
  },

  getFilteredHabits: function() {
    var category = this.data.selectedCategory
    var habits = this.data.habits
    var today = this._getToday()

    var filtered = habits.map(function(h) {
      h._todayDone = h.completedDates && h.completedDates.indexOf(today) > -1
      return h
    })

    if (category !== '全部') {
      filtered = filtered.filter(function(h) {
        return h.category === category
      })
    }

    this.setData({ filteredHabits: filtered })
  },

  _getToday: function() {
    var d = new Date()
    var y = d.getFullYear()
    var m = String(d.getMonth() + 1).padStart(2, '0')
    var day = String(d.getDate()).padStart(2, '0')
    return y + '-' + m + '-' + day
  }
})
