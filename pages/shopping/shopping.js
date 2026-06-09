var shoppingService = require('../../services/shopping-service')
var themeBehavior = require('../../behaviors/theme-behavior')

Page({
  behaviors: [themeBehavior],

  data: {
    tabs: ['全部', '待购买', '已购买'],
    currentTab: 0,
    items: [],
    filteredItems: [],
    categories: ['全部'],
    selectedCategory: '全部',
    estimatedTotal: 0,
    purchasedCount: 0,
    totalCount: 0,
    loading: true,
    isDark: false,
    showAddForm: false,
    newItem: { name: '', category: '食品饮料', price: '', quantity: 1 }
  },

  onLoad: function () {
    this.loadData()
  },

  onShow: function () {
    this._checkTheme()
    this.loadData()
  },

  loadData: function () {
    var that = this
    this.setData({ loading: true })

    shoppingService.getShoppingItems().then(function (items) {
      var total = 0
      var purchased = 0
      items.forEach(function (i) {
        total += i.price * i.quantity
        if (i.purchased) purchased++
      })
      that.setData({
        items: items,
        filteredItems: items,
        totalCount: items.length,
        purchasedCount: purchased,
        estimatedTotal: total,
        loading: false
      })
      that._filterItems()
    }).catch(function () {
      that.setData({ loading: false })
    })

    if (shoppingService.getCategories) {
      shoppingService.getCategories().then(function (cats) {
        that.setData({ categories: ['全部'].concat(cats) })
      }).catch(function () {})
    }
  },

  onTabChange: function (e) {
    var index = e.currentTarget.dataset.index
    this.setData({ currentTab: index })
    this._filterItems()
  },

  onCategoryFilter: function (e) {
    var category = e.currentTarget.dataset.category
    this.setData({ selectedCategory: category })
    this._filterItems()
  },

  onTogglePurchased: function (e) {
    var id = e.detail ? e.detail.id : e.currentTarget.dataset.id
    var that = this
    shoppingService.togglePurchased(id).then(function () {
      wx.vibrateShort({ type: 'medium' })
      that.loadData()
    }).catch(function () {})
  },

  toggleAddForm: function () {
    this.setData({ showAddForm: !this.data.showAddForm })
  },

  onNewItemInput: function (e) {
    var field = e.currentTarget.dataset.field
    var obj = {}
    obj['newItem.' + field] = e.detail.value
    this.setData(obj)
  },

  confirmAddItem: function () {
    var that = this
    var item = this.data.newItem
    if (!item.name) {
      wx.showToast({ title: '请输入商品名称', icon: 'none' })
      return
    }
    shoppingService.addItem({
      name: item.name,
      category: item.category,
      price: parseFloat(item.price) || 0,
      quantity: item.quantity || 1,
      purchased: false
    }).then(function () {
      that.setData({
        showAddForm: false,
        newItem: { name: '', category: '食品饮料', price: '', quantity: 1 }
      })
      wx.showToast({ title: '添加成功', icon: 'success' })
      that.loadData()
    }).catch(function () {
      wx.showToast({ title: '添加失败', icon: 'none' })
    })
  },

  onDeleteItem: function (e) {
    var id = e.detail ? e.detail.id : e.currentTarget.dataset.id
    var that = this
    shoppingService.deleteItem(id).then(function () {
      wx.showToast({ title: '已删除', icon: 'success' })
      that.loadData()
    }).catch(function () {})
  },

  onPullDownRefresh: function () {
    this.loadData()
    wx.stopPullDownRefresh()
  },

  _filterItems: function () {
    var tab = this.data.currentTab
    var cat = this.data.selectedCategory
    var items = this.data.items
    var filtered = items.filter(function (i) {
      if (tab === 1 && i.purchased) return false
      if (tab === 2 && !i.purchased) return false
      if (cat !== '全部' && i.category !== cat) return false
      return true
    })
    this.setData({ filteredItems: filtered })
  }
})
