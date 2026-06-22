/**
 * @module services/budget-service
 * @description 生活账本服务
 * 提供收支管理的完整功能，包括：
 * - 收支记录的 CRUD 操作
 * - 月度/年度收支统计
 * - 分类支出明细（按金额降序）
 * - 预算概况（已用/剩余/使用率）
 * - 近7天消费趋势
 * - 异常大额消费检测（>500元）
 * - 本周消费摘要报告
 */
var mockUtils = require('../utils/mock-utils')

var STORAGE_KEY = 'budget_records'

var CATEGORY_CONFIG = {
  '房租': { icon: '🏠', min: 1500, max: 3500, type: 'expense' },
  '饭钱': { icon: '🍚', min: 15, max: 80, type: 'expense' },
  '交通': { icon: '🚌', min: 5, max: 50, type: 'expense' },
  '学费': { icon: '📚', min: 2000, max: 6000, type: 'expense' },
  '购物': { icon: '🛒', min: 20, max: 500, type: 'expense' },
  '订阅': { icon: '📱', min: 10, max: 200, type: 'expense' },
  '娱乐': { icon: '🎮', min: 30, max: 200, type: 'expense' },
  '日用品': { icon: '🧴', min: 10, max: 100, type: 'expense' },
  '医疗': { icon: '🏥', min: 50, max: 500, type: 'expense' },
  '通讯': { icon: '📞', min: 30, max: 100, type: 'expense' },
  '兼职': { icon: '💼', min: 500, max: 3000, type: 'income' },
  '生活费': { icon: '💰', min: 2000, max: 5000, type: 'income' }
}

var EXPENSE_NOTES = {
  '房租': ['月租金', '房租续费'],
  '饭钱': ['食堂午餐', '外卖晚餐', '早餐豆浆油条', '麻辣烫', '奶茶', '食堂早饭', '烤肉饭', '便利店便当', '沙县小吃', '黄焖鸡米饭'],
  '交通': ['地铁充值', '公交卡', '打车回家', '共享单车月卡', '高铁票'],
  '学费': ['春季学期学费', '秋季学期学费', '补考费', '教材费'],
  '购物': ['超市采购', '网购衣服', '买书', '数码配件', '日用百货', '换季衣服', '运动鞋'],
  '订阅': ['视频会员月费', '音乐会员', '网盘会员', '学习APP', '云服务器'],
  '娱乐': ['电影票', 'KTV', '密室逃脱', '剧本杀', '游戏充值', '景区门票'],
  '日用品': ['洗衣液', '纸巾', '牙膏牙刷', '洗发水', '沐浴露', '毛巾'],
  '医疗': ['感冒药', '挂号费', '体检', '眼镜维修', '牙科检查'],
  '通讯': ['手机话费', '流量包', '宽带月费']
}

var INCOME_NOTES = {
  '兼职': ['家教收入', '周末兼职', '线上翻译', '设计外包', '发传单', '摄影兼职'],
  '生活费': ['父母打款', '生活费转账', '月底生活费']
}

/**
 * 生成模拟收支记录数据（约100条，覆盖2025年9月至2026年6月）
 * @returns {Array<Object>} 收支记录列表
 * @private
 */
function generateMockRecords() {
  var records = []
  var categories = Object.keys(CATEGORY_CONFIG)

  // 生成2025年9月到2026年6月的数据
  var startYear = 2025
  var startMonth = 9
  var endYear = 2026
  var endMonth = 6

  for (var year = startYear; year <= endYear; year++) {
    var mStart = (year === startYear) ? startMonth : 1
    var mEnd = (year === endYear) ? endMonth : 12

    for (var month = mStart; month <= mEnd; month++) {
      // 每月固定：房租、通讯、订阅
      var rent = CATEGORY_CONFIG['房租']
      records.push({
        id: mockUtils.generateId(),
        type: 'expense',
        amount: mockUtils.randomInt(rent.min, rent.max),
        category: '房租',
        date: year + '-' + String(month).padStart(2, '0') + '-01',
        note: mockUtils.randomPick(EXPENSE_NOTES['房租']),
        icon: rent.icon
      })

      var comm = CATEGORY_CONFIG['通讯']
      records.push({
        id: mockUtils.generateId(),
        type: 'expense',
        amount: mockUtils.randomInt(comm.min, comm.max),
        category: '通讯',
        date: year + '-' + String(month).padStart(2, '0') + '-05',
        note: mockUtils.randomPick(EXPENSE_NOTES['通讯']),
        icon: comm.icon
      })

      // 每月1-2次订阅
      var sub = CATEGORY_CONFIG['订阅']
      var subCount = mockUtils.randomInt(1, 2)
      for (var si = 0; si < subCount; si++) {
        records.push({
          id: mockUtils.generateId(),
          type: 'expense',
          amount: mockUtils.randomInt(sub.min, sub.max),
          category: '订阅',
          date: year + '-' + String(month).padStart(2, '0') + '-' + String(mockUtils.randomInt(1, 28)).padStart(2, '0'),
          note: mockUtils.randomPick(EXPENSE_NOTES['订阅']),
          icon: sub.icon
        })
      }

      // 每月饭钱 8-12 条
      var mealCount = mockUtils.randomInt(8, 12)
      for (var mi = 0; mi < mealCount; mi++) {
        var food = CATEGORY_CONFIG['饭钱']
        records.push({
          id: mockUtils.generateId(),
          type: 'expense',
          amount: mockUtils.randomInt(food.min, food.max),
          category: '饭钱',
          date: year + '-' + String(month).padStart(2, '0') + '-' + String(mockUtils.randomInt(1, 28)).padStart(2, '0'),
          note: mockUtils.randomPick(EXPENSE_NOTES['饭钱']),
          icon: food.icon
        })
      }

      // 每月交通 3-6 条
      var transCount = mockUtils.randomInt(3, 6)
      for (var ti = 0; ti < transCount; ti++) {
        var trans = CATEGORY_CONFIG['交通']
        records.push({
          id: mockUtils.generateId(),
          type: 'expense',
          amount: mockUtils.randomInt(trans.min, trans.max),
          category: '交通',
          date: year + '-' + String(month).padStart(2, '0') + '-' + String(mockUtils.randomInt(1, 28)).padStart(2, '0'),
          note: mockUtils.randomPick(EXPENSE_NOTES['交通']),
          icon: trans.icon
        })
      }

      // 每月购物 2-4 条
      var shopCount = mockUtils.randomInt(2, 4)
      for (var shi = 0; shi < shopCount; shi++) {
        var shop = CATEGORY_CONFIG['购物']
        records.push({
          id: mockUtils.generateId(),
          type: 'expense',
          amount: mockUtils.randomInt(shop.min, shop.max),
          category: '购物',
          date: year + '-' + String(month).padStart(2, '0') + '-' + String(mockUtils.randomInt(1, 28)).padStart(2, '0'),
          note: mockUtils.randomPick(EXPENSE_NOTES['购物']),
          icon: shop.icon
        })
      }

      // 每月娱乐 1-3 条
      var funCount = mockUtils.randomInt(1, 3)
      for (var fi = 0; fi < funCount; fi++) {
        var fun = CATEGORY_CONFIG['娱乐']
        records.push({
          id: mockUtils.generateId(),
          type: 'expense',
          amount: mockUtils.randomInt(fun.min, fun.max),
          category: '娱乐',
          date: year + '-' + String(month).padStart(2, '0') + '-' + String(mockUtils.randomInt(1, 28)).padStart(2, '0'),
          note: mockUtils.randomPick(EXPENSE_NOTES['娱乐']),
          icon: fun.icon
        })
      }

      // 每月日用品 1-3 条
      var dailyCount = mockUtils.randomInt(1, 3)
      for (var di = 0; di < dailyCount; di++) {
        var daily = CATEGORY_CONFIG['日用品']
        records.push({
          id: mockUtils.generateId(),
          type: 'expense',
          amount: mockUtils.randomInt(daily.min, daily.max),
          category: '日用品',
          date: year + '-' + String(month).padStart(2, '0') + '-' + String(mockUtils.randomInt(1, 28)).padStart(2, '0'),
          note: mockUtils.randomPick(EXPENSE_NOTES['日用品']),
          icon: daily.icon
        })
      }

      // 每月收入：生活费
      var income = CATEGORY_CONFIG['生活费']
      records.push({
        id: mockUtils.generateId(),
        type: 'income',
        amount: mockUtils.randomInt(income.min, income.max),
        category: '生活费',
        date: year + '-' + String(month).padStart(2, '0') + '-28',
        note: mockUtils.randomPick(INCOME_NOTES['生活费']),
        icon: income.icon
      })

      // 部分月份有兼职收入
      if (Math.random() > 0.4) {
        var partJob = CATEGORY_CONFIG['兼职']
        records.push({
          id: mockUtils.generateId(),
          type: 'income',
          amount: mockUtils.randomInt(partJob.min, partJob.max),
          category: '兼职',
          date: year + '-' + String(month).padStart(2, '0') + '-' + String(mockUtils.randomInt(15, 27)).padStart(2, '0'),
          note: mockUtils.randomPick(INCOME_NOTES['兼职']),
          icon: partJob.icon
        })
      }

      // 偶尔医疗
      if (Math.random() > 0.75) {
        var med = CATEGORY_CONFIG['医疗']
        records.push({
          id: mockUtils.generateId(),
          type: 'expense',
          amount: mockUtils.randomInt(med.min, med.max),
          category: '医疗',
          date: year + '-' + String(month).padStart(2, '0') + '-' + String(mockUtils.randomInt(1, 28)).padStart(2, '0'),
          note: mockUtils.randomPick(EXPENSE_NOTES['医疗']),
          icon: med.icon
        })
      }

      // 偶尔学费
      if (month === 9 || month === 2) {
        var tuition = CATEGORY_CONFIG['学费']
        records.push({
          id: mockUtils.generateId(),
          type: 'expense',
          amount: mockUtils.randomInt(tuition.min, tuition.max),
          category: '学费',
          date: year + '-' + String(month).padStart(2, '0') + '-03',
          note: mockUtils.randomPick(EXPENSE_NOTES['学费']),
          icon: tuition.icon
        })
      }
    }
  }

  // 确保总数接近100：裁剪或补足
  if (records.length > 100) {
    records = records.slice(records.length - 100)
  }

  return records
}

/**
 * 获取所有收支记录
 * @returns {Promise<Array>} 记录列表
 */
function getRecords() {
  var data = mockUtils.initData(STORAGE_KEY, generateMockRecords)
  return mockUtils.mockAsync(data)
}

/**
 * 添加收支记录
 * @param {Object} record - 记录信息（category, amount, type, date, note 等）
 * @returns {Promise<Object>} 新记录
 */
function addRecord(record) {
  var records = mockUtils.initData(STORAGE_KEY, generateMockRecords)
  var newRecord = Object.assign({
    id: mockUtils.generateId()
  }, record)
  if (!newRecord.icon && CATEGORY_CONFIG[newRecord.category]) {
    newRecord.icon = CATEGORY_CONFIG[newRecord.category].icon
  }
  records.push(newRecord)
  mockUtils.setToStorage(STORAGE_KEY, records)
  return mockUtils.mockAsync(newRecord)
}

/**
 * 更新收支记录
 * @param {string} id - 记录ID
 * @param {Object} updates - 更新字段
 * @returns {Promise<Object|null>} 更新后的记录
 */
function updateRecord(id, updates) {
  var records = mockUtils.initData(STORAGE_KEY, generateMockRecords)
  var index = records.findIndex(function(r) { return r.id === id })
  if (index !== -1) {
    records[index] = Object.assign(records[index], updates)
    mockUtils.setToStorage(STORAGE_KEY, records)
  }
  return mockUtils.mockAsync(records[index] || null)
}

/**
 * 删除收支记录
 * @param {string} id - 记录ID
 * @returns {Promise<Array>} 更新后的列表
 */
function deleteRecord(id) {
  var records = mockUtils.initData(STORAGE_KEY, generateMockRecords)
  var filtered = records.filter(function(r) { return r.id !== id })
  mockUtils.setToStorage(STORAGE_KEY, filtered)
  return mockUtils.mockAsync(filtered)
}

/**
 * 获取月度支出总计
 * @param {number} month - 月份（1-12）
 * @param {number} year - 年份
 * @returns {Promise<number>} 月度总支出
 */
function getMonthlyTotal(month, year) {
  var records = mockUtils.initData(STORAGE_KEY, generateMockRecords)
  var prefix = year + '-' + String(month).padStart(2, '0')
  var total = 0
  records.forEach(function(r) {
    if (r.date.indexOf(prefix) === 0 && r.type === 'expense') {
      total += r.amount
    }
  })
  return mockUtils.mockAsync(total)
}

/**
 * 获取年度收支汇总
 * @param {number} year - 年份
 * @returns {Promise<Object>} { expense, income, balance }
 */
function getYearlyTotal(year) {
  var records = mockUtils.initData(STORAGE_KEY, generateMockRecords)
  var totalExpense = 0
  var totalIncome = 0
  records.forEach(function(r) {
    if (r.date.indexOf(String(year)) === 0) {
      if (r.type === 'expense') {
        totalExpense += r.amount
      } else {
        totalIncome += r.amount
      }
    }
  })
  var result = { expense: totalExpense, income: totalIncome, balance: totalIncome - totalExpense }
  return mockUtils.mockAsync(result)
}

/**
 * 获取月度分类支出明细
 * @param {number} month - 月份（1-12）
 * @param {number} year - 年份
 * @returns {Promise<Array>} 按金额降序的分类明细
 */
function getCategoryBreakdown(month, year) {
  var records = mockUtils.initData(STORAGE_KEY, generateMockRecords)
  var prefix = year + '-' + String(month).padStart(2, '0')
  var breakdown = {}
  records.forEach(function(r) {
    if (r.date.indexOf(prefix) === 0 && r.type === 'expense') {
      if (!breakdown[r.category]) {
        breakdown[r.category] = {
          category: r.category,
          icon: r.icon,
          total: 0,
          count: 0
        }
      }
      breakdown[r.category].total += r.amount
      breakdown[r.category].count += 1
    }
  })
  var result = []
  for (var k in breakdown) {
    if (breakdown.hasOwnProperty(k)) result.push(breakdown[k])
  }
  result.sort(function(a, b) { return b.total - a.total })
  return mockUtils.mockAsync(result)
}

/**
 * 获取本月预算概况
 * @returns {Promise<Object>} { monthly, spent, remaining, usage }
 */
function getBudgetInfo() {
  var now = new Date()
  var month = now.getMonth() + 1
  var year = now.getFullYear()
  var records = mockUtils.initData(STORAGE_KEY, generateMockRecords)
  var prefix = year + '-' + String(month).padStart(2, '0')
  var spent = 0
  records.forEach(function(r) {
    if (r.date.indexOf(prefix) === 0 && r.type === 'expense') {
      spent += r.amount
    }
  })
  var monthly = 3000
  var result = {
    monthly: monthly,
    spent: spent,
    remaining: Math.max(0, monthly - spent),
    usage: Math.round((spent / monthly) * 100)
  }
  return mockUtils.mockAsync(result)
}

/**
 * 获取近7天每日消费数据（内部通用方法）
 * @param {Array} records - 收支记录列表
 * @returns {Array<{date: string, day: string, total: number}>} 每日消费数据
 * @private
 */
function _getWeeklyDailyData(records) {
  var now = new Date()
  var weekdays = ['日', '一', '二', '三', '四', '五', '六']
  var days = []
  for (var i = 6; i >= 0; i--) {
    var d = new Date(now)
    d.setDate(now.getDate() - i)
    var dateStr = mockUtils.formatDate(d)
    var dayTotal = 0
    records.forEach(function(r) {
      if (r.date === dateStr && r.type === 'expense') {
        dayTotal += r.amount
      }
    })
    days.push({
      date: dateStr,
      day: '周' + weekdays[d.getDay()],
      total: dayTotal
    })
  }
  return days
}

/**
 * 获取近7天消费趋势
 * @returns {Promise<Array>} 每日消费数据（date, day, total）
 */
function getWeeklyTrend() {
  var records = mockUtils.initData(STORAGE_KEY, generateMockRecords)
  var days = _getWeeklyDailyData(records)
  return mockUtils.mockAsync(days)
}

/**
 * 获取异常大额消费
 * @returns {Promise<Array>} 超过500元的消费记录
 */
function getAnomalies() {
  var records = mockUtils.initData(STORAGE_KEY, generateMockRecords)
  var anomalies = records.filter(function(r) {
    return r.type === 'expense' && r.amount > 500
  })
  anomalies.sort(function(a, b) { return b.amount - a.amount })
  return mockUtils.mockAsync(anomalies)
}

/**
 * 获取本周消费摘要（含文字总结）
 * @returns {Promise<string>} 消费摘要文本
 */
function getWeeklySummary() {
  var records = mockUtils.initData(STORAGE_KEY, generateMockRecords)
  var days = _getWeeklyDailyData(records)

  var total = 0
  var maxDay = days[0]
  var minDay = days[0]
  days.forEach(function(d) {
    total += d.total
    if (d.total > maxDay.total) maxDay = d
    if (d.total < minDay.total) minDay = d
  })
  var avg = Math.round(total / 7)
  var summary = '本周共消费 ¥' + total + '，日均 ¥' + avg + '。' +
    '最高消费日是' + maxDay.day + '（¥' + maxDay.total + '），' +
    '最低消费日是' + minDay.day + '（¥' + minDay.total + '）。' +
    (total > 500 ? '本周开销较大，建议适当控制。' : '本周消费控制良好。')
  return mockUtils.mockAsync(summary)
}

module.exports = {
  getRecords: getRecords,
  addRecord: addRecord,
  updateRecord: updateRecord,
  deleteRecord: deleteRecord,
  getMonthlyTotal: getMonthlyTotal,
  getYearlyTotal: getYearlyTotal,
  getCategoryBreakdown: getCategoryBreakdown,
  getBudgetInfo: getBudgetInfo,
  getWeeklyTrend: getWeeklyTrend,
  getAnomalies: getAnomalies,
  getWeeklySummary: getWeeklySummary
}
