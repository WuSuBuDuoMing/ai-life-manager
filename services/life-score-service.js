/**
 * 生活积分服务
 * 综合评估用户的生活管理状况，给出积分和等级
 */
var mockUtils = require('../utils/mock-utils')

/**
 * 计算生活积分
 * @returns {Promise<Object>}
 */
function getLifeScore() {
  var chores = mockUtils.getFromStorage('chores', [])
  var shopping = mockUtils.getFromStorage('shopping_items', [])
  var fridge = mockUtils.getFromStorage('fridge_items', [])
  var room = mockUtils.getFromStorage('room_tasks', [])
  var expenses = mockUtils.getFromStorage('budget_records', [])
  var wardrobe = mockUtils.getFromStorage('wardrobe_items', [])
  var habits = mockUtils.getFromStorage('habits', [])
  var bills = mockUtils.getFromStorage('bills', [])

  var today = new Date()
  var todayStr = mockUtils.formatDate(today)

  // 家务积分 (0-20)
  var choreDone = chores.filter(function(c) { return c.status === 'completed' }).length
  var choreTotal = chores.length || 1
  var choreScore = Math.min(20, Math.round(choreDone / choreTotal * 20))

  // 习惯积分 (0-20) - 今日打卡比例
  var habitsTodayDone = habits.filter(function(h) {
    return h.completedDates && h.completedDates.indexOf(todayStr) >= 0
  }).length
  var habitsTotal = habits.length || 1
  var habitsScore = Math.min(20, Math.round(habitsTodayDone / habitsTotal * 20))

  // 冰箱管理积分 (0-15) - 过期越少分越高
  var expiredCount = fridge.filter(function(f) {
    if (!f.expiryDate) return false
    return new Date(f.expiryDate) < today
  }).length
  var fridgeScore = Math.max(0, Math.min(15, 15 - expiredCount * 2))

  // 房间整理积分 (0-10)
  var roomDone = room.filter(function(r) { return r.status === 'completed' }).length
  var roomTotal = room.length || 1
  var roomScore = Math.min(10, Math.round(roomDone / roomTotal * 10))

  // 预算管理积分 (0-10)
  var monthExpenses = expenses.filter(function(e) {
    return e.type === 'expense' && new Date(e.date).getMonth() === today.getMonth()
  }).reduce(function(s, e) { return s + (e.amount || 0) }, 0)
  var budgetSettings = mockUtils.getFromStorage('budget_settings', { monthly: 3000 })
  var budgetUsage = monthExpenses / (budgetSettings.monthly || 3000)
  var budgetScore = budgetUsage <= 1 ? Math.round(10 * (1 - budgetUsage * 0.5)) : Math.max(0, Math.round(10 * (1.5 - budgetUsage)))

  // 账单管理积分 (0-15) - 无逾期高分
  var overdueBills = bills.filter(function(b) {
    return !b.paid && b.dueDate && new Date(b.dueDate) < today
  }).length
  var billsScore = Math.max(0, Math.min(15, 15 - overdueBills * 3))

  // 购物管理积分 (0-10)
  var shoppingDone = shopping.filter(function(s) { return s.purchased }).length
  var shoppingTotal = shopping.length || 1
  var shoppingScore = Math.min(10, Math.round(shoppingDone / shoppingTotal * 10))

  var totalScore = choreScore + habitsScore + fridgeScore + roomScore + budgetScore + billsScore + shoppingScore

  // 等级计算
  var level = 1
  var levelName = '生活新手'
  var levelIcon = '🌱'
  if (totalScore >= 90) { level = 5; levelName = '生活大师'; levelIcon = '👑' }
  else if (totalScore >= 75) { level = 4; levelName = '生活达人'; levelIcon = '⭐' }
  else if (totalScore >= 60) { level = 3; levelName = '生活能手'; levelIcon = '💪' }
  else if (totalScore >= 40) { level = 2; levelName = '生活学徒'; levelIcon = '📚' }
  else { level = 1; levelName = '生活新手'; levelIcon = '🌱' }

  // 评语
  var comment = ''
  if (totalScore >= 90) comment = '太棒了！你的生活管理堪称完美！继续保持！'
  else if (totalScore >= 75) comment = '很不错！你的生活井井有条，再加把劲就满分啦！'
  else if (totalScore >= 60) comment = '做得好！生活管理正在步入正轨，继续努力！'
  else if (totalScore >= 40) comment = '还不错！有一些方面可以改进，试试完成更多家务吧！'
  else comment = '刚开始管理生活，别着急，慢慢来！先从完成家务开始吧！'

  return mockUtils.mockAsync({
    totalScore: totalScore,
    level: level,
    levelName: levelName,
    levelIcon: levelIcon,
    comment: comment,
    breakdown: {
      chores: { score: choreScore, max: 20, label: '家务完成' },
      habits: { score: habitsScore, max: 20, label: '习惯打卡' },
      fridge: { score: fridgeScore, max: 15, label: '冰箱管理' },
      room: { score: roomScore, max: 10, label: '房间整理' },
      budget: { score: budgetScore, max: 10, label: '预算管理' },
      bills: { score: billsScore, max: 15, label: '账单管理' },
      shopping: { score: shoppingScore, max: 10, label: '购物管理' }
    }
  }, 150)
}

module.exports = {
  getLifeScore: getLifeScore
}
