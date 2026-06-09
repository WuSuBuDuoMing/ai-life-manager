/**
 * 冰箱食材管理页面
 */
var fridgeService = require('../../services/fridge-service')
var shoppingService = require('../../services/shopping-service')
var themeBehavior = require('../../behaviors/theme-behavior')

Page({
  behaviors: [themeBehavior],

  data: {
    items: [],
    filteredItems: [],
    tabs: ['全部', '临期', '已过期', '菜谱'],
    currentTab: 0,
    categories: ['全部', '蔬菜', '水果', '肉类', '海鲜', '乳制品', '调味品', '饮料', '冷冻', '零食', '干货'],
    selectedCategory: '全部',
    expiringCount: 0,
    expiredCount: 0,
    freshCount: 0,
    totalCount: 0,
    recipeRecommendations: [],
    weeklyMenu: [],
    isDark: false,
    loading: true,
    searchKeyword: '',
    showAddForm: false,
    newItem: { name: '', category: '蔬菜', quantity: '', unit: '份', expiryDate: '', storageLocation: '冷藏室' }
  },

  onLoad: function() {
    this.loadItems()
  },

  onShow: function() {
    this._checkTheme()
    this.loadItems()
  },

  onPullDownRefresh: function() {
    this.loadItems()
    wx.stopPullDownRefresh()
  },

  loadItems: function() {
    var that = this
    this.setData({ loading: true })

    fridgeService.getItems().then(function(items) {
      var today = new Date()
      var expiringCount = 0, expiredCount = 0, freshCount = 0

      items.forEach(function(item) {
        if (!item.expiryDate) { freshCount++; return }
        var exp = new Date(item.expiryDate)
        var diff = Math.ceil((exp - today) / 86400000)
        if (diff < 0) { item._status = 'expired'; expiredCount++ }
        else if (diff <= 3) { item._status = 'expiring'; expiringCount++ }
        else { item._status = 'fresh'; freshCount++ }
        item._daysLeft = diff
      })

      that.setData({
        items: items,
        totalCount: items.length,
        expiringCount: expiringCount,
        expiredCount: expiredCount,
        freshCount: freshCount,
        loading: false
      })
      that._filterItems()
    }).catch(function(e) {
      console.error('[fridge] 加载失败:', e)
      that.setData({ loading: false })
    })
  },

  onTabChange: function(e) {
    var tab = parseInt(e.currentTarget.dataset.tab)
    this.setData({ currentTab: tab })
    if (tab === 3) this._loadRecipes()
    this._filterItems()
  },

  onCategoryFilter: function(e) {
    this.setData({ selectedCategory: e.currentTarget.dataset.category })
    this._filterItems()
  },

  onSearchInput: function(e) {
    this.setData({ searchKeyword: e.detail.value })
    this._filterItems()
  },

  onSearchClear: function() {
    this.setData({ searchKeyword: '' })
    this._filterItems()
  },

  _filterItems: function() {
    var tab = this.data.currentTab
    var items = this.data.items
    var cat = this.data.selectedCategory
    var keyword = this.data.searchKeyword.toLowerCase()

    var filtered = items.filter(function(item) {
      var matchTab = true
      if (tab === 1) matchTab = item._status === 'expiring'
      else if (tab === 2) matchTab = item._status === 'expired'
      var matchCat = cat === '全部' || item.category === cat
      var matchSearch = !keyword || (item.name && item.name.toLowerCase().indexOf(keyword) >= 0)
      return matchTab && matchCat && matchSearch
    })

    this.setData({ filteredItems: filtered })
  },

  _loadRecipes: function() {
    var that = this
    fridgeService.getRecipeRecommendations().then(function(recipes) {
      that.setData({ recipeRecommendations: recipes || [] })
    }).catch(function() {})
    fridgeService.getWeeklyMenu().then(function(menu) {
      that.setData({ weeklyMenu: menu || [] })
    }).catch(function() {})
  },

  toggleAddForm: function() {
    this.setData({ showAddForm: !this.data.showAddForm })
  },

  onNewItemInput: function(e) {
    var field = e.currentTarget.dataset.field
    var value = e.detail.value !== undefined ? e.detail.value : e.currentTarget.dataset.value
    if (value === undefined) return
    var obj = {}
    obj['newItem.' + field] = value
    this.setData(obj)
  },

  confirmAddItem: function() {
    var item = this.data.newItem
    if (!item.name) { wx.showToast({ title: '请输入食材名称', icon: 'none' }); return }
    var that = this
    fridgeService.addItem({
      name: item.name, category: item.category,
      quantity: parseFloat(item.quantity) || 1, unit: item.unit,
      expiryDate: item.expiryDate, storageLocation: item.storageLocation
    }).then(function() {
      that.setData({
        showAddForm: false,
        newItem: { name: '', category: '蔬菜', quantity: '', unit: '份', expiryDate: '', storageLocation: '冷藏室' }
      })
      wx.showToast({ title: '添加成功', icon: 'success' })
      that.loadItems()
    }).catch(function() {
      wx.showToast({ title: '添加失败', icon: 'none' })
    })
  },

  onAddToShopping: function(e) {
    var id = e.currentTarget.dataset.id
    var item = this.data.items.find(function(i) { return i.id === id })
    if (item) {
      shoppingService.addItem({
        name: item.name,
        category: item.category || '食品饮料',
        price: 0,
        quantity: 1,
        purchased: false
      }).then(function() {
        wx.showToast({ title: '已加入购物清单', icon: 'success' })
      }).catch(function() {})
    }
  },

  markAsUsed: function(e) {
    var id = e.currentTarget.dataset.id
    var that = this
    fridgeService.markAsUsed(id).then(function() {
      wx.showToast({ title: '已标记使用', icon: 'success' })
      that.loadItems()
    }).catch(function() {
      wx.showToast({ title: '操作失败', icon: 'none' })
    })
  },

  onDeleteItem: function(e) {
    var id = e.currentTarget.dataset.id
    var that = this
    wx.showModal({
      title: '确认删除',
      content: '确定要从冰箱中移除该食材吗？',
      confirmColor: '#EF5350',
      success: function(res) {
        if (res.confirm) {
          fridgeService.removeItem(id).then(function() {
            wx.showToast({ title: '已移除', icon: 'success' })
            that.loadItems()
          }).catch(function() {
            wx.showToast({ title: '删除失败', icon: 'none' })
          })
        }
      }
    })
  },

  onRecipeTap: function(e) {
    var recipe = e.currentTarget.dataset.recipe
    if (recipe) {
      wx.showModal({
        title: recipe.name || '菜谱',
        content: '食材: ' + (recipe.ingredients || '未知') + '\n做法: ' + (recipe.steps || '暂无详细步骤'),
        showCancel: false
      })
    }
  },

  onMenuDayTap: function(e) {
    var menu = e.currentTarget.dataset.menu
    if (menu) {
      wx.showModal({
        title: menu.day + ' 菜单',
        content: '早餐: ' + (menu.breakfast || '-') + '\n午餐: ' + (menu.lunch || '-') + '\n晚餐: ' + (menu.dinner || '-'),
        showCancel: false
      })
    }
  }
})
