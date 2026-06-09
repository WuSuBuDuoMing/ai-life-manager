/**
 * 全局搜索页面
 * 跨模块搜索：任务、习惯、食材、菜谱、旅行、宠物、账单
 * 支持关键词高亮、搜索历史、热门搜索
 */
var themeBehavior = require('../../behaviors/theme-behavior')
var mockUtils = require('../../utils/mock-utils')

Page({
  behaviors: [themeBehavior],

  data: {
    keyword: '',
    results: [],
    groupedResults: [],
    totalResults: 0,
    searched: false,
    loading: false,
    searchHistory: [],
    hotSearches: ['番茄炒蛋', '房租', '遛狗', '旅行', '早起', 'Netflix'],
    moduleMap: {
      '任务': { icon: '📝', color: '#4CAF50', page: '/pages/chores/chores' },
      '习惯': { icon: '✅', color: '#42A5F5', page: '/pages/habits/habits' },
      '食材': { icon: '🧊', color: '#FF9800', page: '/pages/fridge/fridge' },
      '菜谱': { icon: '🍳', color: '#FF7043', page: '/pages/recipes/recipes' },
      '旅行': { icon: '✈️', color: '#7E57C2', page: '/pages/travel/travel' },
      '宠物': { icon: '🐕', color: '#EF5350', page: '/pages/pets/pets' },
      '账单': { icon: '💳', color: '#F4511E', page: '/pages/bills/bills' },
      '购物': { icon: '🛒', color: '#FF9800', page: '/pages/shopping/shopping' }
    }
  },

  onLoad: function() {
    try {
      var history = mockUtils.getFromStorage('search_history', [])
      this.setData({ searchHistory: history })
    } catch (e) {}
  },

  onShow: function() {
    this._checkTheme()
  },

  onSearchInput: function(e) {
    this.setData({ keyword: e.detail.value })
    if (this._searchTimer) clearTimeout(this._searchTimer)
    var that = this
    if (e.detail.value.length >= 2) {
      this._searchTimer = setTimeout(function() {
        that.doSearch()
      }, 300)
    } else if (e.detail.value.length === 0) {
      this.setData({ results: [], groupedResults: [], totalResults: 0, searched: false })
    }
  },

  onSearchConfirm: function() {
    this.doSearch()
  },

  onClearKeyword: function() {
    this.setData({
      keyword: '',
      results: [],
      groupedResults: [],
      totalResults: 0,
      searched: false
    })
  },

  onHistoryTap: function(e) {
    var keyword = e.currentTarget.dataset.keyword
    this.setData({ keyword: keyword })
    this.doSearch()
  },

  onHotTap: function(e) {
    var keyword = e.currentTarget.dataset.keyword
    this.setData({ keyword: keyword })
    this.doSearch()
  },

  onClearHistory: function() {
    this.setData({ searchHistory: [] })
    mockUtils.setToStorage('search_history', [])
  },

  onResultTap: function(e) {
    var page = e.currentTarget.dataset.page
    if (page) {
      wx.navigateTo({ url: page })
    }
  },

  /**
   * 将标题拆分为高亮和非高亮部分
   * 返回 [{text: '前缀', highlight: false}, {text: '关键词', highlight: true}, ...]
   */
  _splitHighlight: function(text, keyword) {
    if (!text || !keyword) return [{ text: text || '', highlight: false }]
    var lower = text.toLowerCase()
    var kwLower = keyword.toLowerCase()
    var parts = []
    var lastIndex = 0
    var idx = lower.indexOf(kwLower)
    while (idx >= 0) {
      if (idx > lastIndex) {
        parts.push({ text: text.substring(lastIndex, idx), highlight: false })
      }
      parts.push({ text: text.substring(idx, idx + keyword.length), highlight: true })
      lastIndex = idx + keyword.length
      idx = lower.indexOf(kwLower, lastIndex)
    }
    if (lastIndex < text.length) {
      parts.push({ text: text.substring(lastIndex), highlight: false })
    }
    return parts.length > 0 ? parts : [{ text: text, highlight: false }]
  },

  doSearch: function() {
    var keyword = this.data.keyword.trim()
    if (!keyword) return

    var that = this
    that.setData({ loading: true, searched: true })
    var kw = keyword.toLowerCase()
    var results = []

    // 保存搜索历史
    var history = that.data.searchHistory.filter(function(h) { return h !== keyword })
    history.unshift(keyword)
    if (history.length > 15) history = history.slice(0, 15)
    that.setData({ searchHistory: history })
    mockUtils.setToStorage('search_history', history)

    // 搜索任务
    try {
      var chores = mockUtils.getFromStorage('chores', [])
      chores.forEach(function(c) {
        if (c.title && c.title.toLowerCase().indexOf(kw) > -1) {
          results.push({
            module: '任务', title: c.title,
            titleParts: that._splitHighlight(c.title, keyword),
            subtitle: (c.status === 'completed' ? '✅ 已完成' : '⏳ 待完成'),
            id: c.id
          })
        }
      })
    } catch (e) {}

    // 搜索习惯
    try {
      var habits = mockUtils.getFromStorage('habits', [])
      habits.forEach(function(h) {
        if (h.name && h.name.toLowerCase().indexOf(kw) > -1) {
          results.push({
            module: '习惯', title: h.name,
            titleParts: that._splitHighlight(h.name, keyword),
            subtitle: '🔥 连续 ' + (h.currentStreak || 0) + ' 天',
            id: h.id
          })
        }
      })
    } catch (e) {}

    // 搜索食材
    try {
      var fridge = mockUtils.getFromStorage('fridge_items', [])
      fridge.forEach(function(f) {
        if (f.name && f.name.toLowerCase().indexOf(kw) > -1) {
          results.push({
            module: '食材', title: f.name,
            titleParts: that._splitHighlight(f.name, keyword),
            subtitle: f.quantity + (f.unit || '') + ' · ' + (f.category || ''),
            id: f.id
          })
        }
      })
    } catch (e) {}

    // 搜索菜谱
    try {
      var recipes = mockUtils.getFromStorage('recipes', [])
      recipes.forEach(function(r) {
        var match = (r.name && r.name.toLowerCase().indexOf(kw) > -1) ||
          (r.tags && r.tags.some(function(t) { return t.toLowerCase().indexOf(kw) > -1 })) ||
          (r.ingredients && r.ingredients.some(function(i) { return i.toLowerCase().indexOf(kw) > -1 }))
        if (match) {
          results.push({
            module: '菜谱', title: r.name,
            titleParts: that._splitHighlight(r.name, keyword),
            subtitle: (r.difficulty === 'easy' ? '简单' : r.difficulty === 'medium' ? '中等' : '困难') + ' · ' + r.time,
            id: r.id
          })
        }
      })
    } catch (e) {}

    // 搜索旅行
    try {
      var plans = mockUtils.getFromStorage('travel_plans', [])
      plans.forEach(function(p) {
        if ((p.title && p.title.toLowerCase().indexOf(kw) > -1) ||
          (p.destination && p.destination.toLowerCase().indexOf(kw) > -1)) {
          results.push({
            module: '旅行', title: p.title,
            titleParts: that._splitHighlight(p.title, keyword),
            subtitle: '📍 ' + (p.destination || '') + ' · ' + (p.startDate || ''),
            id: p.id
          })
        }
      })
    } catch (e) {}

    // 搜索宠物日记
    try {
      var petData = mockUtils.getFromStorage('pet_data', null)
      if (petData && petData.diary) {
        petData.diary.forEach(function(d) {
          if (d.content && d.content.toLowerCase().indexOf(kw) > -1) {
            var titleText = d.content.substring(0, 30) + (d.content.length > 30 ? '...' : '')
            results.push({
              module: '宠物', title: titleText,
              titleParts: that._splitHighlight(titleText, keyword),
              subtitle: '📅 ' + d.date,
              id: d.id
            })
          }
        })
      }
    } catch (e) {}

    // 搜索账单
    try {
      var bills = mockUtils.getFromStorage('bills', [])
      bills.forEach(function(b) {
        if (b.name && b.name.toLowerCase().indexOf(kw) > -1) {
          results.push({
            module: '账单', title: b.name,
            titleParts: that._splitHighlight(b.name, keyword),
            subtitle: '¥' + b.amount + ' · ' + (b.paid ? '已付' : '未付'),
            id: b.id
          })
        }
      })
    } catch (e) {}

    // 搜索购物清单
    try {
      var shopping = mockUtils.getFromStorage('shopping_items', [])
      shopping.forEach(function(s) {
        if (s.name && s.name.toLowerCase().indexOf(kw) > -1) {
          results.push({
            module: '购物', title: s.name,
            titleParts: that._splitHighlight(s.name, keyword),
            subtitle: (s.purchased ? '✅ 已购' : '🛒 待购'),
            id: s.id
          })
        }
      })
    } catch (e) {}

    // 按模块分组
    var groups = {}
    results.forEach(function(r) {
      if (!groups[r.module]) {
        groups[r.module] = { module: r.module, items: [] }
      }
      groups[r.module].items.push(r)
    })

    var groupedResults = []
    for (var key in groups) {
      if (groups.hasOwnProperty(key)) {
        groupedResults.push(groups[key])
      }
    }
    groupedResults.sort(function(a, b) { return b.items.length - a.items.length })

    // 为每组添加页面路径
    var moduleMap = that.data.moduleMap
    groupedResults.forEach(function(g) {
      var meta = moduleMap[g.module] || {}
      g.icon = meta.icon || '📄'
      g.color = meta.color || '#999'
      g.page = meta.page || ''
    })

    that.setData({
      results: results,
      groupedResults: groupedResults,
      totalResults: results.length,
      loading: false
    })
  }
})
