/**
 * @module services/fridge-service
 * @description 冰箱食材服务
 * 提供冰箱食材管理功能，包括：
 * - 9大类60+食材的库存管理
 * - 临期/已过期食材检测与排序
 * - 分类统计
 * - 根据现有食材推荐菜谱
 * - 本周菜单推荐
 * - 标记食材已使用/添加到购物清单
 */
var mockUtils = require('../utils/mock-utils')

var STORAGE_KEY = 'fridge_items'

var ITEM_DB = {
  '蔬菜': {
    icon: '🥬',
    storageLocation: '冷藏室',
    items: [
      { name: '白菜', unit: '棵', shelfDays: 7 },
      { name: '菠菜', unit: '把', shelfDays: 4 },
      { name: '胡萝卜', unit: '根', shelfDays: 14 },
      { name: '西红柿', unit: '个', shelfDays: 7 },
      { name: '黄瓜', unit: '根', shelfDays: 5 },
      { name: '土豆', unit: '个', shelfDays: 21 },
      { name: '洋葱', unit: '个', shelfDays: 30 },
      { name: '青椒', unit: '个', shelfDays: 7 },
      { name: '茄子', unit: '个', shelfDays: 5 },
      { name: '生菜', unit: '棵', shelfDays: 4 }
    ]
  },
  '水果': {
    icon: '🍎',
    storageLocation: '冷藏室',
    items: [
      { name: '苹果', unit: '个', shelfDays: 14 },
      { name: '香蕉', unit: '根', shelfDays: 5 },
      { name: '橙子', unit: '个', shelfDays: 14 },
      { name: '葡萄', unit: '串', shelfDays: 5 },
      { name: '草莓', unit: '盒', shelfDays: 3 },
      { name: '芒果', unit: '个', shelfDays: 5 },
      { name: '猕猴桃', unit: '个', shelfDays: 10 }
    ]
  },
  '肉类': {
    icon: '🥩',
    storageLocation: '冷冻室',
    items: [
      { name: '猪肉', unit: '斤', shelfDays: 3 },
      { name: '牛肉', unit: '斤', shelfDays: 3 },
      { name: '鸡胸肉', unit: '块', shelfDays: 3 },
      { name: '羊肉卷', unit: '盒', shelfDays: 7 },
      { name: '排骨', unit: '斤', shelfDays: 3 },
      { name: '五花肉', unit: '斤', shelfDays: 3 }
    ]
  },
  '海鲜': {
    icon: '🦐',
    storageLocation: '冷冻室',
    items: [
      { name: '虾', unit: '斤', shelfDays: 2 },
      { name: '鲈鱼', unit: '条', shelfDays: 2 },
      { name: '螃蟹', unit: '只', shelfDays: 1 },
      { name: '三文鱼', unit: '块', shelfDays: 2 }
    ]
  },
  '乳制品': {
    icon: '🥛',
    storageLocation: '冷藏室',
    items: [
      { name: '纯牛奶', unit: '盒', shelfDays: 30 },
      { name: '酸奶', unit: '杯', shelfDays: 14 },
      { name: '奶酪片', unit: '包', shelfDays: 21 }
    ]
  },
  '调味品': {
    icon: '🧂',
    storageLocation: '常温',
    items: [
      { name: '酱油', unit: '瓶', shelfDays: 180 },
      { name: '食醋', unit: '瓶', shelfDays: 180 },
      { name: '食盐', unit: '袋', shelfDays: 365 },
      { name: '白糖', unit: '袋', shelfDays: 180 },
      { name: '料酒', unit: '瓶', shelfDays: 180 }
    ]
  },
  '饮料': {
    icon: '🥤',
    storageLocation: '冷藏室',
    items: [
      { name: '可乐', unit: '罐', shelfDays: 180 },
      { name: '橙汁', unit: '瓶', shelfDays: 7 },
      { name: '绿茶', unit: '瓶', shelfDays: 90 },
      { name: '矿泉水', unit: '瓶', shelfDays: 180 }
    ]
  },
  '冷冻': {
    icon: '🧊',
    storageLocation: '冷冻室',
    items: [
      { name: '速冻水饺', unit: '袋', shelfDays: 90 },
      { name: '冰淇淋', unit: '盒', shelfDays: 180 },
      { name: '速冻汤圆', unit: '袋', shelfDays: 90 },
      { name: '冷冻薯条', unit: '袋', shelfDays: 120 }
    ]
  },
  '零食': {
    icon: '🍪',
    storageLocation: '常温',
    items: [
      { name: '饼干', unit: '包', shelfDays: 120 },
      { name: '薯片', unit: '包', shelfDays: 90 },
      { name: '坚果', unit: '袋', shelfDays: 60 },
      { name: '巧克力', unit: '块', shelfDays: 180 },
      { name: '果冻', unit: '杯', shelfDays: 120 }
    ]
  }
}

function generateMockItems() {
  var items = []
  var now = new Date()
  var categories = Object.keys(ITEM_DB)

  categories.forEach(function(cat) {
    var config = ITEM_DB[cat]
    config.items.forEach(function(itemDef) {
      var quantity = cat === '调味品' || cat === '饮料' || cat === '零食' || cat === '冷冻'
        ? mockUtils.randomInt(1, 5)
        : mockUtils.randomInt(1, 3)

      // 随机添加日期（30天内）
      var daysAgo = mockUtils.randomInt(0, 30)
      var addedDate = new Date(now)
      addedDate.setDate(now.getDate() - daysAgo)

      var expiryDate = new Date(addedDate)
      expiryDate.setDate(addedDate.getDate() + itemDef.shelfDays)

      items.push({
        id: mockUtils.generateId(),
        name: itemDef.name,
        category: cat,
        expiryDate: mockUtils.formatDate(expiryDate),
        quantity: quantity,
        unit: itemDef.unit,
        storageLocation: config.storageLocation,
        icon: config.icon,
        addedDate: mockUtils.formatDate(addedDate)
      })
    })
  })

  // If we have fewer than 60, duplicate some random items to reach 60
  while (items.length < 60) {
    var sourceCat = mockUtils.randomPick(categories)
    var sourceConfig = ITEM_DB[sourceCat]
    var sourceItem = mockUtils.randomPick(sourceConfig.items)
    var daysAgo2 = mockUtils.randomInt(0, 30)
    var addedDate2 = new Date(now)
    addedDate2.setDate(now.getDate() - daysAgo2)
    var expiryDate2 = new Date(addedDate2)
    expiryDate2.setDate(addedDate2.getDate() + sourceItem.shelfDays)

    items.push({
      id: mockUtils.generateId(),
      name: sourceItem.name,
      category: sourceCat,
      expiryDate: mockUtils.formatDate(expiryDate2),
      quantity: mockUtils.randomInt(1, 3),
      unit: sourceItem.unit,
      storageLocation: sourceConfig.storageLocation,
      icon: sourceConfig.icon,
      addedDate: mockUtils.formatDate(addedDate2)
    })
  }

  // Trim to exactly 60 if over
  if (items.length > 60) {
    items = items.slice(0, 60)
  }

  return items
}

/**
 * 获取所有冰箱食材
 * @returns {Promise<Array>} 食材列表
 */
function getItems() {
  var data = mockUtils.initData(STORAGE_KEY, generateMockItems)
  return mockUtils.mockAsync(data)
}

/**
 * 添加食材到冰箱
 * @param {Object} item - 食材信息（name, category, quantity, unit, expiryDate 等）
 * @returns {Promise<Object>} 新食材
 */
function addItem(item) {
  var items = mockUtils.initData(STORAGE_KEY, generateMockItems)
  var catConfig = ITEM_DB[item.category]
  var newItem = Object.assign({
    id: mockUtils.generateId(),
    addedDate: mockUtils.today(),
    icon: catConfig ? catConfig.icon : '📦',
    storageLocation: catConfig ? catConfig.storageLocation : '常温',
    quantity: 1
  }, item)
  items.push(newItem)
  mockUtils.setToStorage(STORAGE_KEY, items)
  return mockUtils.mockAsync(newItem)
}

/**
 * 更新食材信息
 * @param {string} id - 食材ID
 * @param {Object} updates - 更新字段
 * @returns {Promise<Object|null>} 更新后的食材
 */
function updateItem(id, updates) {
  var items = mockUtils.initData(STORAGE_KEY, generateMockItems)
  var index = items.findIndex(function(it) { return it.id === id })
  if (index !== -1) {
    items[index] = Object.assign(items[index], updates)
    mockUtils.setToStorage(STORAGE_KEY, items)
  }
  return mockUtils.mockAsync(items[index] || null)
}

/**
 * 删除食材
 * @param {string} id - 食材ID
 * @returns {Promise<Array>} 更新后的列表
 */
function removeItem(id) {
  var items = mockUtils.initData(STORAGE_KEY, generateMockItems)
  var filtered = items.filter(function(it) { return it.id !== id })
  mockUtils.setToStorage(STORAGE_KEY, filtered)
  return mockUtils.mockAsync(filtered)
}

/**
 * 获取即将过期的食材
 * @param {number} [days=3] - 天数阈值
 * @returns {Promise<Array>} 即将过期的食材（含 daysLeft 字段）
 */
function getExpiringItems(days) {
  var limit = days || 3
  var items = mockUtils.initData(STORAGE_KEY, generateMockItems)
  var now = new Date()
  var result = []

  items.forEach(function(item) {
    var expiry = new Date(item.expiryDate)
    var diff = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    if (diff >= 0 && diff <= limit) {
      result.push(Object.assign({}, item, { daysLeft: diff }))
    }
  })

  result.sort(function(a, b) { return a.daysLeft - b.daysLeft })
  return mockUtils.mockAsync(result)
}

/**
 * 获取已过期的食材
 * @returns {Promise<Array>} 已过期食材（含 daysExpired 字段）
 */
function getExpiredItems() {
  var items = mockUtils.initData(STORAGE_KEY, generateMockItems)
  var now = new Date()
  var result = []

  items.forEach(function(item) {
    var expiry = new Date(item.expiryDate)
    if (expiry < now) {
      var daysExpired = Math.ceil((now.getTime() - expiry.getTime()) / (1000 * 60 * 60 * 24))
      result.push(Object.assign({}, item, { daysExpired: daysExpired }))
    }
  })

  result.sort(function(a, b) { return b.daysExpired - a.daysExpired })
  return mockUtils.mockAsync(result)
}

/**
 * 获取冰箱食材分类统计
 * @returns {Promise<Array>} 分类列表（含各分类的食材数量和名称）
 */
function getCategories() {
  var items = mockUtils.initData(STORAGE_KEY, generateMockItems)
  var cats = {}
  items.forEach(function(item) {
    if (!cats[item.category]) {
      cats[item.category] = {
        name: item.category,
        icon: ITEM_DB[item.category] ? ITEM_DB[item.category].icon : '📦',
        count: 0,
        items: []
      }
    }
    cats[item.category].count += 1
    cats[item.category].items.push(item.name)
  })
  var result = []
  for (var key in cats) {
    if (cats.hasOwnProperty(key)) result.push(cats[key])
  }
  return mockUtils.mockAsync(result)
}

/**
 * 根据现有食材推荐菜谱
 * @returns {Promise<Array>} 推荐菜谱列表
 */
function getRecipeRecommendations() {
  var recipes = [
    {
      id: 'r1',
      name: '番茄炒蛋',
      icon: '🍳',
      difficulty: '简单',
      time: '15分钟',
      ingredients: ['西红柿', '鸡蛋', '盐', '糖', '葱'],
      steps: '鸡蛋打散炒熟盛出，番茄切块炒出汁，加调料后放入鸡蛋翻炒。'
    },
    {
      id: 'r2',
      name: '蒜蓉西兰花',
      icon: '🥦',
      difficulty: '简单',
      time: '10分钟',
      ingredients: ['西兰花', '蒜', '盐', '蚝油'],
      steps: '西兰花焯水，蒜末爆香，加西兰花翻炒调味即可。'
    },
    {
      id: 'r3',
      name: '红烧排骨',
      icon: '🍖',
      difficulty: '中等',
      time: '45分钟',
      ingredients: ['排骨', '酱油', '料酒', '冰糖', '八角'],
      steps: '排骨焯水，炒糖色后加排骨翻炒，加调料和水炖30分钟收汁。'
    },
    {
      id: 'r4',
      name: '清炒土豆丝',
      icon: '🥔',
      difficulty: '简单',
      time: '10分钟',
      ingredients: ['土豆', '青椒', '醋', '盐', '蒜'],
      steps: '土豆切丝泡水去淀粉，青椒切丝，热锅爆炒加醋调味。'
    },
    {
      id: 'r5',
      name: '水果沙拉',
      icon: '🥗',
      difficulty: '简单',
      time: '5分钟',
      ingredients: ['苹果', '香蕉', '橙子', '酸奶', '草莓'],
      steps: '水果切块，淋上酸奶拌匀即可。'
    }
  ]
  return mockUtils.mockAsync(recipes)
}

/**
 * 获取本周菜单推荐
 * @returns {Promise<Array>} 7天菜单（早/午/晚餐）
 */
function getWeeklyMenu() {
  var weekDates = mockUtils.getWeekDates()
  var weekDayNames = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  var menuPool = [
    { breakfast: '面包+牛奶+鸡蛋', lunch: '番茄炒蛋+米饭', dinner: '清炒时蔬+粥' },
    { breakfast: '豆浆+油条+包子', lunch: '红烧排骨+青菜+米饭', dinner: '面条' },
    { breakfast: '燕麦粥+水果', lunch: '宫保鸡丁+米饭', dinner: '馄饨' },
    { breakfast: '煎饼果子', lunch: '鱼香肉丝+米饭', dinner: '火锅' },
    { breakfast: '三明治+果汁', lunch: '咖喱饭', dinner: '炒饭+紫菜汤' },
    { breakfast: '粥+咸菜+鸡蛋', lunch: '回锅肉+米饭', dinner: '烤鱼+啤酒' },
    { breakfast: '肉夹馍+豆浆', lunch: '麻辣香锅', dinner: '饺子' }
  ]
  var result = weekDates.map(function(date, index) {
    return {
      date: date,
      dayName: weekDayNames[index],
      meals: menuPool[index]
    }
  })
  return mockUtils.mockAsync(result)
}

/**
 * 标记食材已使用（从冰箱移除）
 * @param {string} id - 食材ID
 * @returns {Promise<boolean>} 操作是否成功
 */
function markAsUsed(id) {
  var items = mockUtils.initData(STORAGE_KEY, generateMockItems)
  var index = items.findIndex(function(it) { return it.id === id })
  if (index !== -1) {
    items.splice(index, 1)
    mockUtils.setToStorage(STORAGE_KEY, items)
    return mockUtils.mockAsync(true)
  }
  return mockUtils.mockAsync(false)
}

/**
 * 将食材添加到购物清单（用于补货）
 * @param {string} id - 食材ID
 * @returns {Promise<Array|null>} 更新后的购物清单
 */
function addToShoppingList(id) {
  var items = mockUtils.initData(STORAGE_KEY, generateMockItems)
  var item = items.find(function(it) { return it.id === id })
  if (!item) return mockUtils.mockAsync(null)

  var shoppingKey = 'shopping_list'
  var shoppingList = mockUtils.getFromStorage(shoppingKey, [])
  shoppingList.push({
    id: mockUtils.generateId(),
    name: item.name,
    category: item.category,
    quantity: 1,
    unit: item.unit,
    addedDate: mockUtils.today(),
    status: 'pending',
    icon: item.icon
  })
  mockUtils.setToStorage(shoppingKey, shoppingList)
  return mockUtils.mockAsync(shoppingList)
}

module.exports = {
  getItems: getItems,
  addItem: addItem,
  updateItem: updateItem,
  removeItem: removeItem,
  getExpiringItems: getExpiringItems,
  getExpiredItems: getExpiredItems,
  getCategories: getCategories,
  getRecipeRecommendations: getRecipeRecommendations,
  getWeeklyMenu: getWeeklyMenu,
  markAsUsed: markAsUsed,
  addToShoppingList: addToShoppingList
}
