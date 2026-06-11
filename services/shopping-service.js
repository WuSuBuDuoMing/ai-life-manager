/**
 * 购物清单数据服务
 */
var mockUtils = require('../utils/mock-utils')

var SHOPPING_CATEGORIES = ['食品饮料', '日用品', '电子产品', '服饰', '家居', '美妆', '其他']

var SHOPPING_DB = {
  '食品饮料': ['牛奶', '苹果', '鸡蛋', '面包', '酸奶', '矿泉水', '橙汁', '可乐', '咖啡豆', '茶叶', '酱油', '食醋', '食盐', '白糖', '蜂蜜', '花生酱', '果酱', '麦片', '方便面', '火腿肠'],
  '日用品': ['洗衣液', '纸巾', '牙膏', '洗发水', '沐浴露', '垃圾袋', '保鲜膜', '清洁剂', '洗手液', '消毒液', '海绵', '抹布', '厨房纸', '棉签', '创可贴'],
  '电子产品': ['USB数据线', '充电宝', '耳机', '鼠标垫', '手机壳', '屏幕保护膜', '小夜灯', '插座', '电池'],
  '服饰': ['袜子', '内裤', 'T恤', '运动鞋', '拖鞋', '帽子', '围巾', '手套'],
  '家居': ['衣架', '收纳盒', '垃圾桶', '靠枕', '地毯', '台灯', '相框', '花瓶'],
  '美妆': ['面膜', '防晒霜', '唇膏', '护手霜', '卸妆水', '化妆棉'],
  '其他': ['快递袋', '标签纸', '笔记本', '圆珠笔', '书签']
}

function generateMockItems() {
  var items = []
  var categories = Object.keys(SHOPPING_DB)

  categories.forEach(function(cat) {
    var names = SHOPPING_DB[cat]
    names.forEach(function(name) {
      var isPurchased = Math.random() < 0.35
      var daysAgo = mockUtils.randomInt(0, 30)
      items.push({
        id: mockUtils.generateId(),
        name: name,
        category: cat,
        price: mockUtils.randomFloat(1, 200),
        quantity: mockUtils.randomInt(1, 5),
        purchased: isPurchased,
        createdAt: mockUtils.formatDateTime(new Date(Date.now() - daysAgo * 86400000))
      })
    })
  })

  // Shuffle and take exactly 80
  items.sort(function() { return 0.5 - Math.random() })
  if (items.length > 80) {
    items = items.slice(0, 80)
  }
  return items
}

/**
 * 获取所有购物项
 * @returns {Promise<Array>} 购物列表
 */
function getItems() {
  var data = mockUtils.initData('shopping_items', generateMockItems)
  return mockUtils.mockAsync(data)
}

/**
 * 获取购物分类列表
 * @returns {Promise<Array>} 分类列表（含"全部"）
 */
function getCategories() {
  return mockUtils.mockAsync(['全部'].concat(SHOPPING_CATEGORIES))
}

/**
 * 添加购物项
 * @param {Object} item - 商品信息
 * @returns {Promise<Array>} 更新后的列表
 */
function addItem(item) {
  var items = mockUtils.initData('shopping_items', generateMockItems)
  items.unshift({
    id: mockUtils.generateId(), name: item.name, category: item.category || '食品饮料',
    price: parseFloat(item.price) || 0, quantity: parseInt(item.quantity) || 1,
    purchased: false, createdAt: mockUtils.formatDateTime(new Date())
  })
  mockUtils.setToStorage('shopping_items', items)
  return mockUtils.mockAsync(items)
}

/**
 * 切换购买状态
 * @param {string} itemId - 商品ID
 * @returns {Promise<Array>} 更新后的列表
 */
function togglePurchased(itemId) {
  var items = mockUtils.initData('shopping_items', generateMockItems)
  var item = items.find(function(i) { return i.id === itemId })
  if (item) { item.purchased = !item.purchased }
  mockUtils.setToStorage('shopping_items', items)
  return mockUtils.mockAsync(items)
}

/**
 * 删除购物项
 * @param {string} itemId - 商品ID
 * @returns {Promise<Array>} 更新后的列表
 */
function deleteItem(itemId) {
  var items = mockUtils.initData('shopping_items', generateMockItems)
  items = items.filter(function(i) { return i.id !== itemId })
  mockUtils.setToStorage('shopping_items', items)
  return mockUtils.mockAsync(items)
}

/**
 * 更新购物项
 * @param {string} itemId - 商品ID
 * @param {Object} updates - 更新字段
 * @returns {Promise<Array>} 更新后的列表
 */
function updateItem(itemId, updates) {
  var items = mockUtils.initData('shopping_items', generateMockItems)
  var index = items.findIndex(function(i) { return i.id === itemId })
  if (index !== -1) { items[index] = Object.assign({}, items[index], updates) }
  mockUtils.setToStorage('shopping_items', items)
  return mockUtils.mockAsync(items)
}

/**
 * 从冰箱临期食材自动添加到购物清单
 * @returns {Promise<Array>} 更新后的购物列表
 */
function addFromFridge() {
  var fridgeItems = mockUtils.getFromStorage('fridge_items', [])
  var shoppingItems = mockUtils.initData('shopping_items', generateMockItems)
  var threeDaysLater = new Date(Date.now() + 3 * 86400000)
  fridgeItems.filter(function(item) {
    return item.expiryDate && new Date(item.expiryDate) <= threeDaysLater
  }).forEach(function(item) {
    if (!shoppingItems.find(function(s) { return s.name === item.name })) {
      shoppingItems.unshift({
        id: mockUtils.generateId(), name: item.name, category: item.category || '食品饮料',
        price: 0, quantity: 1, purchased: false, createdAt: mockUtils.formatDateTime(new Date())
      })
    }
  })
  mockUtils.setToStorage('shopping_items', shoppingItems)
  return mockUtils.mockAsync(shoppingItems)
}

module.exports = {
  getItems: getItems,
  getCategories: getCategories,
  addItem: addItem,
  togglePurchased: togglePurchased,
  deleteItem: deleteItem,
  updateItem: updateItem,
  addFromFridge: addFromFridge
}
