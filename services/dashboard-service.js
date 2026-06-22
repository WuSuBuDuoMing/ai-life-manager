/**
 * @module services/dashboard-service
 * @description 仪表盘数据服务
 * 提供首页所需的聚合数据，从所有模块收集信息，包括：
 * - 今日待办数量（家务 + 购物 + 账单）
 * - 冰箱临期/过期食材统计
 * - 本月支出汇总
 * - 即将续费订阅提醒
 * - 房间整理进度
 * - 今日习惯完成情况
 * - AI 每日生活建议
 */
var mockUtils = require('../utils/mock-utils')

var DAILY_TIPS = [
  '今天有几件待办事项需要处理，加油完成吧！💪',
  '冰箱里有食材即将过期，记得尽快使用哦 🥬',
  '本月预算使用情况良好，继续保持！💰',
  '有一个订阅即将到期，检查是否需要续费 📱',
  '建议今天整理一下衣柜，换季衣物需要归类 👔',
  '购物清单中有几项急需购买的物品 🛒',
  '今天天气不错，适合开窗通风做家务 🌤️',
  '家务积分在增长中，继续保持好习惯！🏆',
  '本周整理进度不错，再完成几项就满分了 🏠',
  '记得查看冰箱食材，合理安排本周菜单 🍳'
]

/**
 * 获取仪表盘聚合数据
 * 从家务、冰箱、账本、订阅、购物、房间、习惯、账单等模块汇总关键指标
 * @returns {Promise<Object>} 仪表盘数据对象
 * @returns {number} return.todoCount - 总待办数量（家务 + 购物 + 账单）
 * @returns {number} return.choreCount - 待完成家务数量
 * @returns {number} return.expiringFood - 临期 + 已过期食材数量
 * @returns {string} return.monthlyExpense - 本月支出金额（保留两位小数）
 * @returns {number} return.upcomingSubscriptions - 7天内即将续费的订阅数量
 * @returns {number} return.pendingShopping - 未购买的购物项数量
 * @returns {number} return.weeklyTidyProgress - 房间整理完成百分比
 * @returns {string} return.dailyTip - 每日生活建议
 * @returns {number} return.choreCompleted - 已完成家务数量
 * @returns {number} return.fridgeTotal - 冰箱食材总数
 * @returns {number} return.habitCompleted - 今日已完成习惯数量
 * @returns {number} return.habitTotal - 习惯总数
 * @returns {number} return.unpaidBills - 未付账单数量
 */
function getDashboardData() {
  var chores = mockUtils.getFromStorage('chores', [])
  var fridge = mockUtils.getFromStorage('fridge_items', [])
  var expenses = mockUtils.getFromStorage('budget_records', [])
  var subscriptions = mockUtils.getFromStorage('subscriptions', [])
  var shopping = mockUtils.getFromStorage('shopping_items', [])
  var room = mockUtils.getFromStorage('room_tasks', [])
  var habits = mockUtils.getFromStorage('habits', [])
  var bills = mockUtils.getFromStorage('bills', [])
  var today = mockUtils.today()
  var now = new Date()

  // 家务统计
  var chorePending = chores.filter(function(c) { return c.status !== 'completed' }).length
  var choreCompleted = chores.filter(function(c) { return c.status === 'completed' }).length

  // 冰箱临期统计
  var threeDaysLater = new Date(now.getTime() + 3 * 86400000)
  var expiringFood = fridge.filter(function(item) {
    if (!item.expiryDate) return false
    var exp = new Date(item.expiryDate)
    return exp <= threeDaysLater && exp >= now
  }).length
  var expiredFood = fridge.filter(function(item) {
    if (!item.expiryDate) return false
    return new Date(item.expiryDate) < now
  }).length

  // 本月支出
  var currentMonth = today.substring(0, 7)
  var monthlyExpense = expenses
    .filter(function(e) { return e.type === 'expense' && e.date && e.date.startsWith(currentMonth) })
    .reduce(function(sum, e) { return sum + (e.amount || 0) }, 0)

  // 即将续费订阅
  var sevenDaysLater = new Date(now.getTime() + 7 * 86400000)
  var upcomingSubscriptions = subscriptions.filter(function(s) {
    if (!s.nextBillingDate) return false
    var billing = new Date(s.nextBillingDate)
    return billing <= sevenDaysLater && billing >= now
  }).length

  // 未完成购物
  var pendingShopping = shopping.filter(function(s) { return !s.purchased }).length

  // 房间整理进度
  var roomCompleted = room.filter(function(r) { return r.status === 'completed' }).length
  var roomTotal = room.length
  var weeklyTidyProgress = roomTotal > 0 ? Math.round(roomCompleted / roomTotal * 100) : 0

  // 今日习惯完成数
  var todayCompleted = habits.filter(function(h) {
    return h.completedDates && h.completedDates.indexOf(today) >= 0
  }).length

  // 未付账单
  var unpaidBills = bills.filter(function(b) { return !b.paid }).length

  // 今日建议
  var tipIndex = (now.getFullYear() + now.getMonth() + now.getDate()) % DAILY_TIPS.length
  var dailyTip = DAILY_TIPS[tipIndex]

  return mockUtils.mockAsync({
    todoCount: chorePending + pendingShopping + unpaidBills,
    choreCount: chorePending,
    expiringFood: expiringFood + expiredFood,
    monthlyExpense: monthlyExpense.toFixed(2),
    upcomingSubscriptions: upcomingSubscriptions,
    pendingShopping: pendingShopping,
    weeklyTidyProgress: weeklyTidyProgress,
    dailyTip: dailyTip,
    // 额外数据
    choreCompleted: choreCompleted,
    fridgeTotal: fridge.length,
    roomProgress: weeklyTidyProgress,
    habitCompleted: todayCompleted,
    habitTotal: habits.length,
    unpaidBills: unpaidBills
  }, 100)
}

/**
 * 获取今日家务（最多5条待完成）
 * @returns {Promise<Array>}
 */
function getTodayChores() {
  var chores = mockUtils.getFromStorage('chores', [])
  var pending = chores
    .filter(function(c) { return c.status !== 'completed' })
    .sort(function(a, b) {
      if (a.scheduledDate && b.scheduledDate) return new Date(a.scheduledDate) - new Date(b.scheduledDate)
      return 0
    })
    .slice(0, 5)
  return mockUtils.mockAsync(pending, 80)
}

/**
 * 获取问候语
 * @returns {string}
 */
function getGreeting() {
  var hour = new Date().getHours()
  if (hour < 6) return '夜深了，注意休息 🌙'
  if (hour < 9) return '早上好，新的一天开始啦 ☀️'
  if (hour < 12) return '上午好，今天也要加油 💪'
  if (hour < 14) return '中午好，吃午饭了吗 🍜'
  if (hour < 18) return '下午好，喝杯茶休息一下 🍵'
  if (hour < 21) return '晚上好，辛苦了一天 🌆'
  return '夜晚好，早点休息哦 🌙'
}

/**
 * 获取日期字符串
 * @returns {string}
 */
function getDateStr() {
  var now = new Date()
  var weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  return (now.getMonth() + 1) + '月' + now.getDate() + '日 ' + weekDays[now.getDay()]
}

module.exports = {
  getDashboardData: getDashboardData,
  getTodayChores: getTodayChores,
  getGreeting: getGreeting,
  getDateStr: getDateStr
}
