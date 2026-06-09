/**
 * 生活清单页面
 */
var checklistService = require('../../services/checklist-service')
var themeBehavior = require('../../behaviors/theme-behavior')

Page({
  behaviors: [themeBehavior],

  data: {
    tabs: ['我的清单', '模板库'],
    currentTab: 0,
    checklists: [],
    templates: [],
    totalCount: 0,
    completedCount: 0,
    loading: true,
    isDark: false,
    searchKeyword: '',
    showCreateForm: false,
    newName: '',
    selectedTemplate: null
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

    checklistService.getChecklists().then(function(checklists) {
      var total = checklists.length
      var completed = checklists.filter(function(c) {
        return c.items && c.items.length > 0 && c.items.every(function(i) { return i.checked })
      }).length
      that.setData({ checklists: checklists, totalCount: total, completedCount: completed, loading: false })
    }).catch(function(e) {
      console.error('[checklists] 加载失败:', e)
      that.setData({ loading: false })
    })

    checklistService.getTemplates().then(function(templates) {
      that.setData({ templates: templates || [] })
    }).catch(function() {})
  },

  onTabChange: function(e) {
    this.setData({ currentTab: parseInt(e.currentTarget.dataset.index) })
  },

  onSearchInput: function(e) {
    this.setData({ searchKeyword: e.detail.value })
  },

  onSearchClear: function() {
    this.setData({ searchKeyword: '' })
  },

  getFilteredChecklists: function() {
    var keyword = this.data.searchKeyword.toLowerCase()
    if (!keyword) return this.data.checklists
    return this.data.checklists.filter(function(c) {
      return c.name && c.name.toLowerCase().indexOf(keyword) >= 0
    })
  },

  onCreateChecklist: function() {
    this.setData({ showCreateForm: true, newName: '', selectedTemplate: null })
  },

  toggleCreateForm: function() {
    this.setData({ showCreateForm: !this.data.showCreateForm })
  },

  onNameInput: function(e) {
    this.setData({ newName: e.detail.value })
  },

  confirmCreate: function() {
    var name = this.data.newName
    if (!name) { wx.showToast({ title: '请输入清单名称', icon: 'none' }); return }
    var that = this
    checklistService.createChecklist(name, '📝').then(function() {
      that.setData({ showCreateForm: false, newName: '' })
      wx.showToast({ title: '创建成功', icon: 'success' })
      that.loadData()
    }).catch(function() {
      wx.showToast({ title: '创建失败', icon: 'none' })
    })
  },

  onUseTemplate: function(e) {
    var template = e.currentTarget.dataset.item
    if (!template) return
    var that = this
    wx.showModal({
      title: '使用模板',
      content: '将基于「' + template.name + '」创建新清单，是否继续？',
      success: function(res) {
        if (res.confirm) {
          checklistService.createFromTemplate(template.id).then(function() {
            wx.showToast({ title: '已创建', icon: 'success' })
            that.setData({ currentTab: 0 })
            that.loadData()
          }).catch(function() {
            wx.showToast({ title: '创建失败', icon: 'none' })
          })
        }
      }
    })
  },

  onChecklistTap: function(e) {
    var id = e.currentTarget.dataset.id
    wx.showToast({ title: '查看详情', icon: 'none' })
  },

  onToggleItem: function(e) {
    var checklistId = e.currentTarget.dataset.checklistId
    var itemId = e.currentTarget.dataset.itemId
    var that = this
    checklistService.toggleChecklistItem(checklistId, itemId).then(function() {
      that.loadData()
    }).catch(function() {})
  },

  onDeleteChecklist: function(e) {
    var id = e.currentTarget.dataset.id
    var that = this
    wx.showModal({
      title: '删除清单',
      content: '确定要删除这个清单吗？',
      confirmColor: '#EF5350',
      success: function(res) {
        if (res.confirm) {
          checklistService.deleteChecklist(id).then(function() {
            wx.showToast({ title: '已删除', icon: 'success' })
            that.loadData()
          }).catch(function() {
            wx.showToast({ title: '删除失败', icon: 'none' })
          })
        }
      }
    })
  }
})
