/**
 * 数据导出服务
 * 提供数据统计汇总和导出功能
 */
var mockUtils = require('../utils/mock-utils')

/**
 * 获取生活数据总览
 * @returns {Promise<Object>}
 */
function getLifeOverview() {
  var chores = mockUtils.getFromStorage('chores', [])
  var shopping = mockUtils.getFromStorage('shopping_items', [])
  var expenses = mockUtils.getFromStorage('budget_records', [])
  var fridge = mockUtils.getFromStorage('fridge_items', [])
  var subs = mockUtils.getFromStorage('subscriptions', [])
  var wardrobe = mockUtils.getFromStorage('wardrobe_items', [])
  var room = mockUtils.getFromStorage('room_tasks', [])
  var habits = mockUtils.getFromStorage('habits', [])
  var bills = mockUtils.getFromStorage('bills', [])
  var travelPlans = mockUtils.getFromStorage('travel_plans', [])

  // 家务统计
  var choreDone = chores.filter(function(c) { return c.status === 'completed' }).length
  var choreTotal = chores.length
  var chorePoints = chores.filter(function(c) { return c.status === 'completed' })
    .reduce(function(s, c) { return s + (c.points || 0) }, 0)

  // 购物统计
  var shoppingDone = shopping.filter(function(s) { return s.purchased }).length
  var shoppingTotal = shopping.length
  var shoppingSpent = shopping.filter(function(s) { return s.purchased })
    .reduce(function(s, i) { return s + (i.price || 0) * (i.quantity || 1) }, 0)

  // 账本统计
  var month = new Date().getMonth() + 1
  var monthExpenses = expenses.filter(function(e) {
    return e.type === 'expense' && new Date(e.date).getMonth() + 1 === month
  })
  var monthIncome = expenses.filter(function(e) {
    return e.type === 'income' && new Date(e.date).getMonth() + 1 === month
  })
  var monthExpenseTotal = monthExpenses.reduce(function(s, e) { return s + (e.amount || 0) }, 0)
  var monthIncomeTotal = monthIncome.reduce(function(s, e) { return s + (e.amount || 0) }, 0)

  // 冰箱统计
  var today = new Date()
  var expiringFood = fridge.filter(function(f) {
    if (!f.expiryDate) return false
    var diff = (new Date(f.expiryDate) - today) / 86400000
    return diff >= 0 && diff <= 3
  }).length
  var expiredFood = fridge.filter(function(f) {
    if (!f.expiryDate) return false
    return new Date(f.expiryDate) < today
  }).length

  // 订阅统计
  var monthlySubCost = subs.reduce(function(s, sub) {
    if (sub.billingCycle === 'yearly') return s + (sub.price || 0) / 12
    return s + (sub.price || 0)
  }, 0)

  // 衣橱统计
  var dirtyClothes = wardrobe.filter(function(w) { return w.launderStatus === 'dirty' }).length

  // 房间统计
  var roomDone = room.filter(function(r) { return r.status === 'completed' }).length

  // 习惯统计
  var todayStr = mockUtils.formatDate(today)
  var habitsTodayDone = habits.filter(function(h) {
    return h.completedDates && h.completedDates.indexOf(todayStr) >= 0
  }).length
  var bestStreak = habits.reduce(function(max, h) {
    return Math.max(max, h.bestStreak || 0)
  }, 0)

  // 账单统计
  var unpaidBills = bills.filter(function(b) { return !b.paid })
  var unpaidTotal = unpaidBills.reduce(function(s, b) { return s + (b.amount || 0) }, 0)
  var overdueBills = unpaidBills.filter(function(b) {
    return b.dueDate && new Date(b.dueDate) < today
  }).length

  // 旅行统计
  var upcomingTrips = travelPlans.filter(function(p) { return p.status === 'planning' })

  return mockUtils.mockAsync({
    chores: { done: choreDone, total: choreTotal, rate: choreTotal ? Math.round(choreDone / choreTotal * 100) : 0, points: chorePoints },
    shopping: { done: shoppingDone, total: shoppingTotal, spent: shoppingSpent },
    budget: { monthExpense: monthExpenseTotal, monthIncome: monthIncomeTotal, balance: monthIncomeTotal - monthExpenseTotal },
    fridge: { total: fridge.length, expiring: expiringFood, expired: expiredFood },
    subscriptions: { total: subs.length, monthlyCost: monthlySubCost },
    wardrobe: { total: wardrobe.length, dirty: dirtyClothes },
    room: { done: roomDone, total: room.length, rate: room.length ? Math.round(roomDone / room.length * 100) : 0 },
    habits: { total: habits.length, todayDone: habitsTodayDone, bestStreak: bestStreak },
    bills: { total: bills.length, unpaid: unpaidBills.length, unpaidAmount: unpaidTotal, overdue: overdueBills },
    travel: { total: travelPlans.length, upcoming: upcomingTrips.length },
    generatedAt: mockUtils.formatDateTime(new Date())
  }, 200)
}

/**
 * 导出数据为文本格式（可用于分享）
 * @returns {Promise<string>}
 */
function exportAsText() {
  return getLifeOverview().then(function(data) {
    var lines = [
      '📊 AI 生活管家 - 生活数据报告',
      '生成时间: ' + data.generatedAt,
      '',
      '🧹 家务分工',
      '  完成: ' + data.chores.done + '/' + data.chores.total + ' (' + data.chores.rate + '%)',
      '  积分: ' + data.chores.points,
      '',
      '🛒 购物清单',
      '  已购: ' + data.shopping.done + '/' + data.shopping.total,
      '  已花费: ¥' + data.shopping.spent.toFixed(2),
      '',
      '💰 本月账本',
      '  支出: ¥' + data.budget.monthExpense.toFixed(2),
      '  收入: ¥' + data.budget.monthIncome.toFixed(2),
      '  结余: ¥' + data.budget.balance.toFixed(2),
      '',
      '🧊 冰箱食材',
      '  总计: ' + data.fridge.total + ' 件',
      '  临期: ' + data.fridge.expiring + ' 件',
      '  过期: ' + data.fridge.expired + ' 件',
      '',
      '📱 订阅服务',
      '  总计: ' + data.subscriptions.total + ' 个',
      '  月均: ¥' + data.subscriptions.monthlyCost.toFixed(2),
      '',
      '👔 衣橱衣物',
      '  总计: ' + data.wardrobe.total + ' 件',
      '  待洗: ' + data.wardrobe.dirty + ' 件',
      '',
      '🏠 房间整理',
      '  完成: ' + data.room.done + '/' + data.room.total + ' (' + data.room.rate + '%)',
      '',
      '✅ 习惯打卡',
      '  总习惯: ' + data.habits.total + ' 个',
      '  今日完成: ' + data.habits.todayDone + '/' + data.habits.total,
      '  最佳连续: ' + data.habits.bestStreak + ' 天',
      '',
      '💳 账单管理',
      '  未付: ' + data.bills.unpaid + ' 笔 (¥' + data.bills.unpaidAmount.toFixed(2) + ')',
      '  逾期: ' + data.bills.overdue + ' 笔',
      '',
      '✈️ 旅行计划',
      '  总计划: ' + data.travel.total + ' 个',
      '  筹备中: ' + data.travel.upcoming + ' 个'
    ]
    return lines.join('\n')
  })
}

module.exports = {
  getLifeOverview: getLifeOverview,
  exportAsText: exportAsText
}
