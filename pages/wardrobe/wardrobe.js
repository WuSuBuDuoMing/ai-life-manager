/**
 * 衣橱洗衣助手页面
 */
var wardrobeService = require('../../services/wardrobe-service')
var themeBehavior = require('../../behaviors/theme-behavior')

Page({
  behaviors: [themeBehavior],

  data: {
    clothes: [],
    filteredClothes: [],
    tabs: ['全部衣物', '脏衣篮', '季节收纳', '穿搭建议'],
    currentTab: 0,
    categories: ['全部', 'T恤', '衬衫', '牛仔裤', '运动裤', '外套', '卫衣', '裙子', '内衣', '袜子', '帽子', '围巾', '睡衣'],
    selectedCategory: '全部',
    cleanCount: 0,
    dirtyCount: 0,
    totalCount: 0,
    seasonalCollection: [],
    wearStats: [],
    weeklyOutfit: [],
    washingReminders: [],
    isDark: false,
    loading: true,
    searchKeyword: ''
  },

  onLoad: function() {
    this.loadClothes()
  },

  onShow: function() {
    this._checkTheme()
    this.loadClothes()
  },

  onPullDownRefresh: function() {
    this.loadClothes()
    wx.stopPullDownRefresh()
  },

  loadClothes: function() {
    var that = this
    this.setData({ loading: true })

    wardrobeService.getClothes().then(function(clothes) {
      var dirtyCount = 0
      var cleanCount = 0
      clothes.forEach(function(item) {
        if (item.launderStatus === 'dirty') dirtyCount++
        else cleanCount++
      })

      that.setData({
        clothes: clothes,
        totalCount: clothes.length,
        dirtyCount: dirtyCount,
        cleanCount: cleanCount,
        loading: false
      })
      that._filterClothes()
    }).catch(function(e) {
      console.error('[wardrobe] 加载失败:', e)
      that.setData({ loading: false })
    })
  },

  onTabChange: function(e) {
    var tab = parseInt(e.currentTarget.dataset.tab)
    this.setData({ currentTab: tab })
    this._filterClothes()
    if (tab === 3) this._loadOutfitSuggestions()
    if (tab === 2) this._loadSeasonalCollection()
  },

  onCategoryFilter: function(e) {
    this.setData({ selectedCategory: e.currentTarget.dataset.category })
    this._filterClothes()
  },

  onSearchInput: function(e) {
    this.setData({ searchKeyword: e.detail.value })
    this._filterClothes()
  },

  onSearchClear: function() {
    this.setData({ searchKeyword: '' })
    this._filterClothes()
  },

  _filterClothes: function() {
    var tab = this.data.currentTab
    var clothes = this.data.clothes
    var cat = this.data.selectedCategory
    var keyword = this.data.searchKeyword.toLowerCase()

    var filtered = clothes.filter(function(item) {
      var matchTab = true
      if (tab === 1) matchTab = item.launderStatus === 'dirty'
      else if (tab === 2) matchTab = item.season && item.season.indexOf('冬') >= 0
      var matchCat = cat === '全部' || item.category === cat
      var matchSearch = !keyword || (item.name && item.name.toLowerCase().indexOf(keyword) >= 0)
      return matchTab && matchCat && matchSearch
    })

    this.setData({ filteredClothes: filtered })
  },

  _loadOutfitSuggestions: function() {
    var that = this
    wardrobeService.getWeeklyOutfit().then(function(outfit) {
      that.setData({ weeklyOutfit: outfit || [] })
    }).catch(function() {})
    wardrobeService.getWearStats().then(function(stats) {
      that.setData({ wearStats: stats || [] })
    }).catch(function() {})
    wardrobeService.getWashingReminder().then(function(reminders) {
      that.setData({ washingReminders: reminders || [] })
    }).catch(function() {})
  },

  _loadSeasonalCollection: function() {
    var that = this
    wardrobeService.getSeasonalCollection('summer').then(function(collection) {
      that.setData({ seasonalCollection: collection || [] })
    }).catch(function() {})
  },

  onToggleLaundry: function(e) {
    var id = e.currentTarget.dataset.id
    var that = this
    var item = this.data.clothes.find(function(c) { return c.id === id })
    var promise
    if (item && item.launderStatus === 'dirty') {
      promise = wardrobeService.removeFromLaundry(id)
    } else {
      promise = wardrobeService.addToLaundry(id)
    }
    promise.then(function() {
      wx.showToast({ title: '操作成功', icon: 'success' })
      that.loadClothes()
    }).catch(function() {
      wx.showToast({ title: '操作失败', icon: 'none' })
    })
  },

  onAddClothes: function() {
    wx.showToast({ title: '添加衣物', icon: 'none' })
  },

  onDeleteClothes: function(e) {
    var id = e.currentTarget.dataset.id
    var that = this
    wx.showModal({
      title: '确认删除',
      content: '确定要删除该衣物吗？',
      confirmColor: '#EF5350',
      success: function(res) {
        if (res.confirm) {
          wardrobeService.removeClothes(id).then(function() {
            wx.showToast({ title: '已删除', icon: 'success' })
            that.loadClothes()
          }).catch(function() {
            wx.showToast({ title: '删除失败', icon: 'none' })
          })
        }
      }
    })
  },

  onOutfitTap: function(e) {
    var outfit = e.currentTarget.dataset.outfit
    if (outfit) {
      wx.showModal({
        title: outfit.day + ' 穿搭建议',
        content: '上装: ' + (outfit.top || '-') + '\n下装: ' + (outfit.bottom || '-') + '\n鞋子: ' + (outfit.shoes || '-') + '\n' + (outfit.tip || ''),
        showCancel: false
      })
    }
  }
})
