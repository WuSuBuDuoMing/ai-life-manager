/**
 * 房间整理页面
 */
var roomService = require('../../services/room-service')
var themeBehavior = require('../../behaviors/theme-behavior')

Page({
  behaviors: [themeBehavior],

  data: {
    zones: [],
    tasks: [],
    filteredTasks: [],
    weeklyChallenge: {},
    selectedZone: null,
    overallProgress: 0,
    completedCount: 0,
    pendingCount: 0,
    totalCount: 0,
    isDark: false,
    loading: true,
    showAddForm: false,
    newTask: { title: '', zone: 'zone_desk', priority: 'normal' },
    zoneOptions: [
      { id: 'zone_desk', name: '桌面', icon: '🖥️' },
      { id: 'zone_wardrobe', name: '衣柜', icon: '👔' },
      { id: 'zone_kitchen', name: '厨房', icon: '🍳' },
      { id: 'zone_bathroom', name: '卫生间', icon: '🚿' },
      { id: 'zone_bedside', name: '床边', icon: '🛏️' }
    ],
    priorityOptions: [
      { id: 'high', name: '高', color: '#EF5350' },
      { id: 'normal', name: '中', color: '#FF9800' },
      { id: 'low', name: '低', color: '#4CAF50' }
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

    // 加载区域
    roomService.getZones().then(function(zones) {
      that.setData({ zones: zones || [] })
      that._calcProgress()
    }).catch(function() {})

    // 加载任务
    roomService.getTasks().then(function(tasks) {
      var completed = tasks.filter(function(task) { return task.status === 'completed' }).length
      var pending = tasks.filter(function(task) { return task.status !== 'completed' }).length
      that.setData({
        tasks: tasks,
        totalCount: tasks.length,
        completedCount: completed,
        pendingCount: pending,
        loading: false
      })
      that._filterTasks()
    }).catch(function(e) {
      console.error('[room] 加载任务失败:', e)
      that.setData({ loading: false })
    })

    // 加载挑战
    roomService.getWeeklyChallenge().then(function(challenge) {
      that.setData({ weeklyChallenge: challenge || {} })
    }).catch(function() {})
  },

  _calcProgress: function() {
    var zones = this.data.zones
    if (!zones || zones.length === 0) { this.setData({ overallProgress: 0 }); return }
    var total = zones.reduce(function(sum, z) { return sum + (z.progress || 0) }, 0)
    this.setData({ overallProgress: Math.round(total / zones.length) })
  },

  _filterTasks: function() {
    var tasks = this.data.tasks
    var zone = this.data.selectedZone
    var filtered = zone ? tasks.filter(function(t) { return t.zone === zone }) : tasks
    this.setData({ filteredTasks: filtered })
  },

  onZoneTap: function(e) {
    var zone = e.currentTarget.dataset.zone
    this.setData({ selectedZone: this.data.selectedZone === zone ? null : zone })
    this._filterTasks()
  },

  onCompleteTask: function(e) {
    var id = e.currentTarget.dataset.id
    var that = this
    roomService.completeTask(id).then(function() {
      wx.vibrateShort({ type: 'medium' })
      wx.showToast({ title: '完成！+积分', icon: 'success' })
      that.loadData()
    }).catch(function() {
      wx.showToast({ title: '操作失败', icon: 'none' })
    })
  },

  toggleAddForm: function() {
    this.setData({ showAddForm: !this.data.showAddForm })
  },

  onTaskInput: function(e) {
    var field = e.currentTarget.dataset.field
    var obj = {}
    obj['newTask.' + field] = e.detail.value
    this.setData(obj)
  },

  onZoneSelect: function(e) {
    this.setData({ 'newTask.zone': e.currentTarget.dataset.zone })
  },

  onPrioritySelect: function(e) {
    this.setData({ 'newTask.priority': e.currentTarget.dataset.priority })
  },

  confirmAddTask: function() {
    var task = this.data.newTask
    if (!task.title) { wx.showToast({ title: '请输入任务标题', icon: 'none' }); return }
    var that = this
    roomService.addTask({
      title: task.title,
      zone: task.zone,
      priority: task.priority,
      status: 'pending'
    }).then(function() {
      that.setData({ showAddForm: false, newTask: { title: '', zone: 'zone_desk', priority: 'normal' } })
      wx.showToast({ title: '添加成功', icon: 'success' })
      that.loadData()
    }).catch(function() {
      wx.showToast({ title: '添加失败', icon: 'none' })
    })
  },

  onDeleteTask: function(e) {
    var id = e.currentTarget.dataset.id
    var that = this
    wx.showModal({
      title: '确认删除',
      content: '确定要删除该任务吗？',
      confirmColor: '#EF5350',
      success: function(res) {
        if (res.confirm) {
          roomService.deleteTask(id).then(function() {
            wx.showToast({ title: '已删除', icon: 'success' })
            that.loadData()
          }).catch(function() {
            wx.showToast({ title: '删除失败', icon: 'none' })
          })
        }
      }
    })
  },

  onChallengeTap: function() {
    var c = this.data.weeklyChallenge
    if (c && c.title) {
      wx.showModal({
        title: '🏆 ' + c.title,
        content: c.description + '\n\n进度: ' + (c.completedCount || 0) + '/' + (c.totalCount || 0) + '\n奖励: ' + (c.reward || '无'),
        showCancel: false
      })
    }
  }
})
