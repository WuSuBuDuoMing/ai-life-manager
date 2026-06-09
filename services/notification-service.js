/**
 * 通知提醒服务
 * 提供过期提醒、续费提醒、任务到期提醒等
 */
var mockUtils = require('../utils/mock-utils')

/**
 * 获取所有待提醒项
 * @returns {Promise<Array>}
 */
function getAllReminders() {
  var reminders = []

  // 从冰箱获取过期/临期食材
  var fridge = mockUtils.getFromStorage('fridge_items', [])
  var today = new Date()
  fridge.forEach(function(item) {
    if (!item.expiryDate) return
    var exp = new Date(item.expiryDate)
    var diff = Math.ceil((exp - today) / 86400000)
    if (diff < 0) {
      reminders.push({ type: 'food_expired', icon: '🔴', title: item.name + ' 已过期', subtitle: '过期' + Math.abs(diff) + '天', date: item.expiryDate, level: 'danger', module: 'fridge' })
    } else if (diff <= 3) {
      reminders.push({ type: 'food_expiring', icon: '🟠', title: item.name + ' 即将过期', subtitle: '还剩' + diff + '天', date: item.expiryDate, level: 'warning', module: 'fridge' })
    }
  })

  // 从订阅获取即将续费
  var subs = mockUtils.getFromStorage('subscriptions', [])
  subs.forEach(function(sub) {
    if (!sub.nextBillingDate) return
    var billing = new Date(sub.nextBillingDate)
    var diff = Math.ceil((billing - today) / 86400000)
    if (diff >= 0 && diff <= 7) {
      reminders.push({ type: 'sub_renew', icon: '🔄', title: sub.name + ' 即将续费', subtitle: sub.price + '元/' + (sub.billingCycle === 'monthly' ? '月' : '年'), date: sub.nextBillingDate, level: 'warning', module: 'subscriptions' })
    }
  })

  // 从家务获取逾期任务
  var chores = mockUtils.getFromStorage('chores', [])
  chores.forEach(function(chore) {
    if (chore.status === 'completed' || !chore.scheduledDate) return
    var due = new Date(chore.scheduledDate)
    if (due < today) {
      reminders.push({ type: 'chore_overdue', icon: '⏰', title: chore.title + ' 已逾期', subtitle: '负责人: ' + (chore.assignedTo || '未分配'), date: chore.scheduledDate, level: 'warning', module: 'chores' })
    }
  })

  // 从房间获取逾期任务
  var roomTasks = mockUtils.getFromStorage('room_tasks', [])
  var roomZones = mockUtils.getFromStorage('room_zones', [])
  var zoneMap = {}
  roomZones.forEach(function(z) { zoneMap[z.id] = z.name })
  roomTasks.forEach(function(task) {
    if (task.status === 'completed' || !task.dueDate) return
    var due = new Date(task.dueDate)
    if (due < today) {
      var zoneName = zoneMap[task.zone] || task.zone || ''
      reminders.push({ type: 'room_overdue', icon: '🏠', title: task.title + ' 待整理', subtitle: zoneName, date: task.dueDate, level: 'info', module: 'room' })
    }
  })

  // 从账单获取未付/逾期账单
  var bills = mockUtils.getFromStorage('bills', [])
  bills.forEach(function(bill) {
    if (bill.paid || !bill.dueDate) return
    var due = new Date(bill.dueDate)
    var diff = Math.ceil((due - today) / 86400000)
    if (diff < 0) {
      reminders.push({ type: 'bill_overdue', icon: '💳', title: bill.name + ' 已逾期', subtitle: '¥' + bill.amount + ' · 逾期' + Math.abs(diff) + '天', date: bill.dueDate, level: 'danger', module: 'bills' })
    } else if (diff <= 7) {
      reminders.push({ type: 'bill_due', icon: '💰', title: bill.name + ' 即将到期', subtitle: '¥' + bill.amount + ' · ' + diff + '天后到期', date: bill.dueDate, level: 'warning', module: 'bills' })
    }
  })

  // 从宠物获取未完成提醒
  try {
    var petData = mockUtils.getFromStorage('pet_data', null)
    if (petData && petData.reminders) {
      var todayStr = mockUtils.formatDate(today)
      petData.reminders.forEach(function(r) {
        if (!r.enabled) return
        if (r.lastDone === todayStr) return
        var typeMap = { feed: '🍖', walk: '🦮', water: '💧', clean: '🧹', vaccine: '💉', checkup: '🩺' }
        reminders.push({ type: 'pet_reminder', icon: typeMap[r.type] || '🐾', title: r.title, subtitle: r.time + ' · ' + r.frequency, date: todayStr, level: 'info', module: 'pets' })
      })
    }
  } catch (e) {}

  // 按严重程度排序
  var levelOrder = { danger: 0, warning: 1, info: 2 }
  reminders.sort(function(a, b) { return (levelOrder[a.level] || 2) - (levelOrder[b.level] || 2) })

  return mockUtils.mockAsync(reminders, 100)
}

/**
 * 获取提醒数量
 * @returns {Promise<Object>}
 */
function getReminderCounts() {
  return getAllReminders().then(function(reminders) {
    return {
      total: reminders.length,
      danger: reminders.filter(function(r) { return r.level === 'danger' }).length,
      warning: reminders.filter(function(r) { return r.level === 'warning' }).length,
      info: reminders.filter(function(r) { return r.level === 'info' }).length
    }
  })
}

/**
 * 获取每日提醒摘要（用于首页展示）
 * @returns {Promise<string>}
 */
function getDailySummary() {
  return getAllReminders().then(function(reminders) {
    if (reminders.length === 0) return '今日一切正常，继续保持！🎉'
    var danger = reminders.filter(function(r) { return r.level === 'danger' }).length
    var warning = reminders.filter(function(r) { return r.level === 'warning' }).length
    var parts = []
    if (danger > 0) parts.push(danger + '项需要紧急处理')
    if (warning > 0) parts.push(warning + '项需要注意')
    return '你有 ' + reminders.length + ' 条提醒：' + parts.join('，')
  })
}

module.exports = {
  getAllReminders: getAllReminders,
  getReminderCounts: getReminderCounts,
  getDailySummary: getDailySummary
}
