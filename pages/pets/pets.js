/**
 * 宠物生活页面
 * 功能：宠物档案、提醒管理、宠物日记、疫苗记录、体重追踪
 */
var petService = require('../../services/pet-service')
var themeBehavior = require('../../behaviors/theme-behavior')

Page({
  behaviors: [themeBehavior],

  data: {
    pet: null,
    reminders: [],
    todayReminders: [],
    diary: [],
    vaccines: [],
    weightHistory: [],
    tabs: ['今日任务', '提醒管理', '宠物日记', '疫苗记录'],
    currentTab: 0,
    showDiaryForm: false,
    showPetEditForm: false,
    showVaccineForm: false,
    editPet: {},
    newDiary: { content: '', mood: 'happy' },
    newVaccine: { name: '', nextDate: '', hospital: '', notes: '' },
    loading: true,
    todayTotal: 0,
    todayDone: 0,
    diaryCount: 0,
    moods: [
      { key: 'happy', icon: '😊', label: '开心' },
      { key: 'normal', icon: '😐', label: '一般' },
      { key: 'sad', icon: '😢', label: '难过' },
      { key: 'sick', icon: '🤒', label: '生病' },
      { key: 'excited', icon: '🤩', label: '兴奋' }
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
    that.setData({ loading: true })

    // 并行加载所有数据，避免嵌套 Promise 链
    petService.getPet().then(function(pet) {
      that.setData({ pet: pet, editPet: Object.assign({}, pet) })
    }).catch(function(e) {
      console.error('[pets] 加载宠物数据失败:', e)
    })

    petService.getReminders().then(function(reminders) {
      var today = that._getToday()
      var todayTotal = reminders.filter(function(r) { return r.enabled }).length
      var todayDone = reminders.filter(function(r) {
        return r.enabled && r.lastDone === today
      }).length
      that.setData({ reminders: reminders, todayTotal: todayTotal, todayDone: todayDone })
    }).catch(function() {})

    petService.getTodayReminders().then(function(todayReminders) {
      that.setData({ todayReminders: todayReminders || [] })
    }).catch(function() {})

    petService.getDiary().then(function(diary) {
      that.setData({ diary: diary || [], diaryCount: (diary || []).length, loading: false })
    }).catch(function() {
      that.setData({ loading: false })
    })

    petService.getVaccines().then(function(vaccines) {
      that.setData({ vaccines: vaccines || [] })
    }).catch(function() {})

    petService.getWeightHistory().then(function(weightHistory) {
      that.setData({ weightHistory: weightHistory || [] })
    }).catch(function() {})
  },

  // ========== Tab 切换 ==========
  onTabChange: function(e) {
    var index = parseInt(e.currentTarget.dataset.index)
    this.setData({ currentTab: index })
  },

  // ========== 宠物档案编辑 ==========
  showEditPet: function() {
    var pet = this.data.pet || {}
    this.setData({
      editPet: Object.assign({}, pet),
      showPetEditForm: true
    })
  },

  onEditPetInput: function(e) {
    var field = e.currentTarget.dataset.field
    var value = e.detail.value
    this.setData({ ['editPet.' + field]: value })
  },

  onEditPetSelect: function(e) {
    var field = e.currentTarget.dataset.field
    var value = e.currentTarget.dataset.value
    this.setData({ ['editPet.' + field]: value })
  },

  confirmEditPet: function() {
    var that = this
    var editPet = this.data.editPet
    if (!editPet.name) {
      wx.showToast({ title: '请输入宠物名字', icon: 'none' })
      return
    }
    petService.updatePet(editPet).then(function(pet) {
      that.setData({ pet: pet, showPetEditForm: false })
      wx.showToast({ title: '保存成功', icon: 'success' })
    }).catch(function() {
      wx.showToast({ title: '保存失败', icon: 'none' })
    })
  },

  cancelEditPet: function() {
    this.setData({ showPetEditForm: false })
  },

  onEditPetDateChange: function(e) {
    this.setData({ 'editPet.birthday': e.detail.value })
  },

  // ========== 提醒操作 ==========
  onDoneReminder: function(e) {
    var id = e.currentTarget.dataset.id
    var that = this
    petService.doneReminder(id).then(function() {
      wx.vibrateShort({ type: 'medium' })
      wx.showToast({ title: '已完成', icon: 'success' })
      that.loadData()
    }).catch(function() {
      wx.showToast({ title: '操作失败', icon: 'none' })
    })
  },

  onToggleReminder: function(e) {
    var id = e.currentTarget.dataset.id
    var that = this
    petService.toggleReminder(id).then(function() {
      that.loadData()
    }).catch(function() {
      wx.showToast({ title: '操作失败', icon: 'none' })
    })
  },

  // ========== 日记操作 ==========
  toggleDiaryForm: function() {
    this.setData({ showDiaryForm: !this.data.showDiaryForm })
  },

  onDiaryInput: function(e) {
    this.setData({ 'newDiary.content': e.detail.value })
  },

  onMoodSelect: function(e) {
    var mood = e.currentTarget.dataset.mood
    this.setData({ 'newDiary.mood': mood })
  },

  confirmAddDiary: function() {
    var content = this.data.newDiary.content
    if (!content) {
      wx.showToast({ title: '请输入日记内容', icon: 'none' })
      return
    }
    var that = this
    petService.addDiary({
      content: content,
      mood: that.data.newDiary.mood
    }).then(function() {
      that.setData({
        showDiaryForm: false,
        newDiary: { content: '', mood: 'happy' }
      })
      wx.showToast({ title: '添加成功', icon: 'success' })
      that.loadData()
    }).catch(function() {
      wx.showToast({ title: '添加失败', icon: 'none' })
    })
  },

  onDeleteDiary: function(e) {
    var id = e.currentTarget.dataset.id
    var that = this
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条日记吗？',
      success: function(res) {
        if (res.confirm) {
          petService.deleteDiary(id).then(function() {
            wx.showToast({ title: '已删除', icon: 'success' })
            that.loadData()
          }).catch(function() {})
        }
      }
    })
  },

  // ========== 疫苗记录操作 ==========
  toggleVaccineForm: function() {
    this.setData({
      showVaccineForm: !this.data.showVaccineForm,
      newVaccine: { name: '', nextDate: '', hospital: '', notes: '' }
    })
  },

  onVaccineInput: function(e) {
    var field = e.currentTarget.dataset.field
    this.setData({ ['newVaccine.' + field]: e.detail.value })
  },

  onVaccineDateChange: function(e) {
    this.setData({ 'newVaccine.nextDate': e.detail.value })
  },

  confirmAddVaccine: function() {
    var vaccine = this.data.newVaccine
    if (!vaccine.name) {
      wx.showToast({ title: '请输入疫苗名称', icon: 'none' })
      return
    }
    var that = this
    petService.addVaccine(vaccine).then(function() {
      that.setData({ showVaccineForm: false })
      wx.showToast({ title: '添加成功', icon: 'success' })
      that.loadData()
    }).catch(function() {
      wx.showToast({ title: '添加失败', icon: 'none' })
    })
  },

  onMarkVaccineDone: function(e) {
    var id = e.currentTarget.dataset.id
    var that = this
    wx.showModal({
      title: '确认接种',
      content: '确认已接种该疫苗？',
      success: function(res) {
        if (res.confirm) {
          petService.markVaccineDone(id).then(function() {
            wx.showToast({ title: '已记录', icon: 'success' })
            that.loadData()
          }).catch(function() {})
        }
      }
    })
  },

  onDeleteVaccine: function(e) {
    var id = e.currentTarget.dataset.id
    var that = this
    wx.showModal({
      title: '确认删除',
      content: '确定要删除该疫苗记录吗？',
      success: function(res) {
        if (res.confirm) {
          petService.deleteVaccine(id).then(function() {
            wx.showToast({ title: '已删除', icon: 'success' })
            that.loadData()
          }).catch(function() {})
        }
      }
    })
  },

  // ========== 工具方法 ==========
  getMoodIcon: function(mood) {
    var map = { happy: '😊', normal: '😐', sad: '😢', sick: '🤒', excited: '🤩' }
    return map[mood] || '😐'
  },

  _getToday: function() {
    var d = new Date()
    var y = d.getFullYear()
    var m = String(d.getMonth() + 1).padStart(2, '0')
    var day = String(d.getDate()).padStart(2, '0')
    return y + '-' + m + '-' + day
  }
})
