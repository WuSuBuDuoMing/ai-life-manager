/**
 * 菜谱速查页面
 * 支持分类筛选、搜索、收藏、快速/详细模式、烹饪计时器
 */
var recipeService = require('../../services/recipe-service')
var themeBehavior = require('../../behaviors/theme-behavior')

Page({
  behaviors: [themeBehavior],

  data: {
    recipes: [],
    filteredRecipes: [],
    categories: ['全部', '早餐', '正餐', '甜品', '咖啡', '饮品'],
    selectedCategory: '全部',
    searchKeyword: '',
    viewMode: 'normal',
    showDetail: false,
    selectedRecipe: null,
    loading: true,
    // 计时器
    timerRunning: false,
    timerSeconds: 0,
    timerDisplay: '00:00',
    timerPreset: 0
  },

  _timerInterval: null,

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

  onUnload: function() {
    // 页面销毁时清除计时器
    if (this._timerInterval) {
      clearInterval(this._timerInterval)
      this._timerInterval = null
    }
  },

  loadData: function() {
    var that = this
    that.setData({ loading: true })

    recipeService.getRecipes().then(function(recipes) {
      that.setData({
        recipes: recipes,
        loading: false
      })
      that.getFilteredRecipes()
    }).catch(function(e) {
      console.error('[recipes] 加载数据失败:', e)
      that.setData({ loading: false })
    })
  },

  onCategoryFilter: function(e) {
    this.setData({ selectedCategory: e.currentTarget.dataset.category })
    this.getFilteredRecipes()
  },

  onSearchInput: function(e) {
    this.setData({ searchKeyword: e.detail.value })
    this.getFilteredRecipes()
  },

  onSearchClear: function() {
    this.setData({ searchKeyword: '' })
    this.getFilteredRecipes()
  },

  onRecipeTap: function(e) {
    var id = e.currentTarget.dataset.id
    var recipe = this.data.recipes.find(function(r) { return r.id === id })
    if (recipe) {
      this.setData({ selectedRecipe: recipe, showDetail: true })
    }
  },

  onCloseDetail: function() {
    this.setData({ showDetail: false, selectedRecipe: null })
    this._stopTimer()
  },

  toggleViewMode: function() {
    this.setData({
      viewMode: this.data.viewMode === 'normal' ? 'quick' : 'normal'
    })
  },

  onToggleFavorite: function(e) {
    var id = e.currentTarget.dataset.id
    var that = this
    recipeService.toggleFavorite(id).then(function() {
      that.loadData()
    }).catch(function() {
      wx.showToast({ title: '操作失败', icon: 'none' })
    })
  },

  getFilteredRecipes: function() {
    var category = this.data.selectedCategory
    var keyword = this.data.searchKeyword.toLowerCase()
    var recipes = this.data.recipes

    var filtered = recipes

    if (category !== '全部') {
      filtered = filtered.filter(function(r) {
        return r.category === category
      })
    }

    if (keyword) {
      filtered = filtered.filter(function(r) {
        return (r.name && r.name.toLowerCase().indexOf(keyword) > -1) ||
          (r.tags && r.tags.some(function(t) { return t.toLowerCase().indexOf(keyword) > -1 })) ||
          (r.ingredients && r.ingredients.some(function(i) { return i.toLowerCase().indexOf(keyword) > -1 }))
      })
    }

    this.setData({ filteredRecipes: filtered })
  },

  getDifficultyLabel: function(difficulty) {
    var map = { easy: '简单', medium: '中等', hard: '困难' }
    return map[difficulty] || difficulty
  },

  // ========== 烹饪计时器 ==========

  onTimerPreset: function(e) {
    var minutes = parseInt(e.currentTarget.dataset.minutes)
    if (!minutes) return
    this._startTimer(minutes * 60)
  },

  onTimerStart: function() {
    // 默认 5 分钟
    this._startTimer(300)
  },

  onTimerStop: function() {
    this._stopTimer()
  },

  onTimerReset: function() {
    this._stopTimer()
    this.setData({ timerSeconds: 0, timerDisplay: '00:00', timerPreset: 0 })
  },

  _startTimer: function(seconds) {
    var that = this
    if (that._timerInterval) {
      clearInterval(that._timerInterval)
    }
    that.setData({
      timerRunning: true,
      timerSeconds: seconds,
      timerDisplay: that._formatTimer(seconds),
      timerPreset: seconds
    })

    that._timerInterval = setInterval(function() {
      var remaining = that.data.timerSeconds - 1
      if (remaining <= 0) {
        that._stopTimer()
        that.setData({ timerSeconds: 0, timerDisplay: '00:00' })
        // 计时结束提醒
        wx.vibrateLong()
        wx.showModal({
          title: '⏰ 计时结束',
          content: '烹饪时间到了！',
          showCancel: false
        })
        return
      }
      that.setData({
        timerSeconds: remaining,
        timerDisplay: that._formatTimer(remaining)
      })
    }, 1000)
  },

  _stopTimer: function() {
    if (this._timerInterval) {
      clearInterval(this._timerInterval)
      this._timerInterval = null
    }
    this.setData({ timerRunning: false })
  },

  _formatTimer: function(seconds) {
    var m = Math.floor(seconds / 60)
    var s = seconds % 60
    return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s
  }
})
