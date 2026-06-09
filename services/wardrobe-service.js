/**
 * 衣橱洗衣服务
 */
var mockUtils = require('../utils/mock-utils')

var STORAGE_KEY = 'wardrobe_items'

var CATEGORIES = [
  { name: 'T恤', icon: '👕', iconClean: '👕', iconDirty: '👕' },
  { name: '衬衫', icon: '👔' },
  { name: '牛仔裤', icon: '👖' },
  { name: '运动裤', icon: '👖' },
  { name: '外套', icon: '🧥' },
  { name: '卫衣', icon: '🧥' },
  { name: '裙子', icon: '👗' },
  { name: '内衣', icon: '🩲' },
  { name: '袜子', icon: '🧦' },
  { name: '帽子', icon: '🧢' },
  { name: '围巾', icon: '🧣' },
  { name: '睡衣', icon: '🌙' }
]

var COLORS = ['白', '黑', '蓝', '灰', '红', '绿', '棕', '粉']
var SEASONS = ['春', '夏', '秋', '冬', '四季']
var BRANDS = ['优衣库', '耐克', '阿迪达斯', 'H&M', 'ZARA', '无印良品', '李宁', '彪马', '森马', '美特斯邦威', '无品牌']

var CLOTHES_TEMPLATE = [
  { category: 'T恤', items: ['纯棉圆领T恤', '条纹T恤', '印花短袖', '白色T恤', '黑色T恤'] },
  { category: '衬衫', items: ['蓝色牛津衬衫', '白色衬衫', '格子衬衫', '条纹衬衫', '牛仔衬衫'] },
  { category: '牛仔裤', items: ['直筒牛仔裤', '修身牛仔裤', '宽松牛仔裤', '破洞牛仔裤', '深色牛仔裤'] },
  { category: '运动裤', items: ['黑色运动裤', '束脚运动裤', '灰色运动裤', '速干运动裤'] },
  { category: '外套', items: ['牛仔外套', '轻薄羽绒服', '风衣', '夹克外套', '棒球外套', '皮衣'] },
  { category: '卫衣', items: ['连帽卫衣', '圆领卫衣', '拉链卫衣', '加绒卫衣'] },
  { category: '裙子', items: ['碎花连衣裙', 'A字半裙', '百褶裙', '牛仔裙'] },
  { category: '内衣', items: ['纯棉内裤', '运动内衣', '背心', '打底衫'] },
  { category: '袜子', items: ['白色运动袜', '黑色短袜', '船袜', '长筒袜', '棉质袜'] },
  { category: '帽子', items: ['棒球帽', '渔夫帽', '针织帽', '鸭舌帽'] },
  { category: '围巾', items: ['针织围巾', '毛线围巾', '丝绸围巾'] },
  { category: '睡衣', items: ['棉质睡衣套装', '睡裙', '家居服', '睡裤'] }
]

function generateMockClothes() {
  var clothes = []
  var now = new Date()

  CLOTHES_TEMPLATE.forEach(function(tpl) {
    var catInfo = CATEGORIES.find(function(c) { return c.name === tpl.category })
    tpl.items.forEach(function(name) {
      var color = mockUtils.randomPick(COLORS)
      var season = (tpl.category === 'T恤' || tpl.category === '裙子') ? mockUtils.randomPick(['夏', '四季'])
        : (tpl.category === '外套' || tpl.category === '卫衣' || tpl.category === '围巾' || tpl.category === '帽子') ? mockUtils.randomPick(['冬', '秋', '四季'])
        : mockUtils.randomPick(SEASONS)

      // 脏衣概率30%
      var isDirty = Math.random() < 0.3

      clothes.push({
        id: mockUtils.generateId(),
        name: color + name,
        category: tpl.category,
        color: color,
        season: season,
        wearCount: mockUtils.randomInt(0, 80),
        launderStatus: isDirty ? 'dirty' : 'clean',
        icon: (catInfo && catInfo.icon) || '👕',
        brand: mockUtils.randomPick(BRANDS)
      })
    })
  })

  // Ensure exactly 40 items
  if (clothes.length > 40) {
    clothes = clothes.slice(0, 40)
  }
  // If fewer than 40, add duplicates from random templates
  while (clothes.length < 40) {
    var tpl = mockUtils.randomPick(CLOTHES_TEMPLATE)
    var catInfo2 = CATEGORIES.find(function(c) { return c.name === tpl.category })
    var name = mockUtils.randomPick(tpl.items)
    var color2 = mockUtils.randomPick(COLORS)
    clothes.push({
      id: mockUtils.generateId(),
      name: color2 + name,
      category: tpl.category,
      color: color2,
      season: mockUtils.randomPick(SEASONS),
      wearCount: mockUtils.randomInt(0, 80),
      launderStatus: Math.random() < 0.3 ? 'dirty' : 'clean',
      icon: (catInfo2 && catInfo2.icon) || '👕',
      brand: mockUtils.randomPick(BRANDS)
    })
  }

  return clothes
}

function getClothes() {
  var data = mockUtils.initData(STORAGE_KEY, generateMockClothes)
  return mockUtils.mockAsync(data)
}

function addClothes(item) {
  var items = mockUtils.initData(STORAGE_KEY, generateMockClothes)
  var catInfo = CATEGORIES.find(function(c) { return c.name === item.category })
  var newItem = Object.assign({
    id: mockUtils.generateId(),
    wearCount: 0,
    launderStatus: 'clean',
    icon: (catInfo && catInfo.icon) || '👕',
    brand: '无品牌'
  }, item)
  items.push(newItem)
  mockUtils.setToStorage(STORAGE_KEY, items)
  return mockUtils.mockAsync(newItem)
}

function updateClothes(id, updates) {
  var items = mockUtils.initData(STORAGE_KEY, generateMockClothes)
  var index = items.findIndex(function(it) { return it.id === id })
  if (index !== -1) {
    items[index] = Object.assign(items[index], updates)
    mockUtils.setToStorage(STORAGE_KEY, items)
  }
  return mockUtils.mockAsync(items[index] || null)
}

function removeClothes(id) {
  var items = mockUtils.initData(STORAGE_KEY, generateMockClothes)
  var filtered = items.filter(function(it) { return it.id !== id })
  mockUtils.setToStorage(STORAGE_KEY, filtered)
  return mockUtils.mockAsync(filtered)
}

function getLaundryBasket() {
  var items = mockUtils.initData(STORAGE_KEY, generateMockClothes)
  var result = items.filter(function(it) { return it.launderStatus === 'dirty' })
  return mockUtils.mockAsync(result)
}

function addToLaundry(id) {
  return updateClothes(id, { launderStatus: 'dirty' })
}

function removeFromLaundry(id) {
  return updateClothes(id, { launderStatus: 'clean' })
}

function getSeasonalCollection(season) {
  var items = mockUtils.initData(STORAGE_KEY, generateMockClothes)
  var result = items.filter(function(it) {
    return it.season === season || it.season === '四季'
  })
  return mockUtils.mockAsync(result)
}

function getWearStats() {
  var items = mockUtils.initData(STORAGE_KEY, generateMockClothes)
  var sorted = [].concat(items).sort(function(a, b) { return b.wearCount - a.wearCount })
  var result = sorted.slice(0, 10).map(function(item) {
    return {
      id: item.id,
      name: item.name,
      category: item.category,
      wearCount: item.wearCount,
      icon: item.icon
    }
  })
  return mockUtils.mockAsync(result)
}

function getWeeklyOutfit() {
  var items = mockUtils.initData(STORAGE_KEY, generateMockClothes)
  var cleanItems = items.filter(function(it) { return it.launderStatus === 'clean' })

  var weekDates = mockUtils.getWeekDates()
  var weekDayNames = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

  var seasonNow = function() {
    var m = new Date().getMonth() + 1
    if (m >= 3 && m <= 5) return '春'
    if (m >= 6 && m <= 8) return '夏'
    if (m >= 9 && m <= 11) return '秋'
    return '冬'
  }()

  function pickItem(category) {
    var pool = cleanItems.filter(function(it) { return it.category === category && (it.season === seasonNow || it.season === '四季') })
    if (pool.length === 0) {
      pool = cleanItems.filter(function(it) { return it.category === category })
    }
    return pool.length > 0 ? mockUtils.randomPick(pool) : null
  }

  var result = weekDates.map(function(date, index) {
    var top = pickItem('T恤') || pickItem('衬衫') || pickItem('卫衣')
    var bottom = pickItem('牛仔裤') || pickItem('运动裤') || pickItem('裙子')
    var outer = pickItem('外套')
    var accessories = pickItem('帽子') || pickItem('围巾')

    var outfit = {
      date: date,
      dayName: weekDayNames[index],
      top: top ? top.name : '待选',
      bottom: bottom ? bottom.name : '待选',
      outerwear: outer ? outer.name : '无',
      accessory: accessories ? accessories.name : '无'
    }
    return outfit
  })
  return mockUtils.mockAsync(result)
}

function getWashingReminder() {
  var items = mockUtils.initData(STORAGE_KEY, generateMockClothes)
  var dirtyItems = items.filter(function(it) { return it.launderStatus === 'dirty' })
  var count = dirtyItems.length

  if (count === 0) {
    return mockUtils.mockAsync({ needed: false, message: '衣橱很干净，不需要洗衣服！', count: 0 })
  }

  // 按类别统计
  var categoryCount = {}
  dirtyItems.forEach(function(item) {
    categoryCount[item.category] = (categoryCount[item.category] || 0) + 1
  })

  var categoryList = Object.keys(categoryCount).map(function(cat) {
    return cat + ' ' + categoryCount[cat] + '件'
  }).join('、')

  var message = count >= 10
    ? '脏衣篮快满了！建议尽快洗衣服。'
    : count >= 5
    ? '脏衣篮有 ' + count + ' 件衣物待洗，建议今天洗一批。'
    : '脏衣篮有 ' + count + ' 件衣物，空闲时可以洗一下。'

  var result = {
    needed: true,
    count: count,
    categoryList: categoryList,
    message: message
  }
  return mockUtils.mockAsync(result)
}

module.exports = {
  getClothes: getClothes,
  addClothes: addClothes,
  updateClothes: updateClothes,
  removeClothes: removeClothes,
  getLaundryBasket: getLaundryBasket,
  addToLaundry: addToLaundry,
  removeFromLaundry: removeFromLaundry,
  getSeasonalCollection: getSeasonalCollection,
  getWearStats: getWearStats,
  getWeeklyOutfit: getWeeklyOutfit,
  getWashingReminder: getWashingReminder
}
