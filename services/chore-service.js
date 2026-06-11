/**
 * 家务数据服务
 */
var mockUtils = require('../utils/mock-utils')

var DEFAULT_MEMBERS = ['我', '室友A', '室友B']

var MEMBER_AVATARS = {
  '我': '🧑',
  '室友A': '👩',
  '室友B': '👨'
}

var CHORE_CATEGORIES = ['清洁', '洗衣', '做饭', '采购', '维修', '整理', '其他']

/**
 * 安全获取家庭成员列表
 * @returns {Array<string>}
 */
function _getMembers() {
  try {
    var app = getApp()
    if (app && app.globalData && app.globalData.familyMembers) {
      return app.globalData.familyMembers
    }
  } catch (e) {
    // getApp 不可用时使用默认值
  }
  return DEFAULT_MEMBERS
}

function generateMockChores() {
  var members = _getMembers()
  var weekDates = mockUtils.getWeekDates()
  var chores = []
  var choreNames = [
    '扫地拖地', '洗碗', '倒垃圾', '擦桌子', '洗衣服',
    '晾衣服', '叠衣服', '做晚饭', '买菜', '整理客厅',
    '擦窗户', '清洁卫生间', '整理冰箱', '浇花', '换床单',
    '拖走廊', '清理猫砂', '擦地板', '整理鞋柜', '清洗空调滤网'
  ]

  for (var i = 0; i < 50; i++) {
    var dateIndex = mockUtils.randomInt(0, 6)
    var statusOptions = ['pending', 'in_progress', 'completed']
    var status = mockUtils.randomPick(statusOptions)
    chores.push({
      id: mockUtils.generateId(),
      title: mockUtils.randomPick(choreNames),
      assignedTo: mockUtils.randomPick(members),
      category: mockUtils.randomPick(CHORE_CATEGORIES),
      scheduledDate: weekDates[dateIndex],
      status: status,
      points: mockUtils.randomInt(5, 20),
      completedAt: status === 'completed' ? mockUtils.formatDateTime(new Date()) : null
    })
  }
  return chores
}

/**
 * 获取所有家务
 * @returns {Promise<Array>} 家务列表
 */
function getChores() {
  var data = mockUtils.initData('chores', generateMockChores)
  return mockUtils.mockAsync(data)
}

/**
 * 获取积分排行榜
 * @returns {Promise<Array>} 排行榜数据
 */
function getLeaderboard() {
  var chores = mockUtils.initData('chores', generateMockChores)
  var members = _getMembers()
  var board = members.map(function(name) {
    var completed = chores.filter(function(c) { return c.assignedTo === name && c.status === 'completed' })
    var points = completed.reduce(function(sum, c) { return sum + (c.points || 0) }, 0)
    return {
      name: name,
      avatar: MEMBER_AVATARS[name] || '👤',
      completedCount: completed.length,
      points: points
    }
  })
  var result = board.sort(function(a, b) { return b.points - a.points })
  return mockUtils.mockAsync(result)
}

/**
 * 获取本周排班表
 * @returns {Promise<Array>} 每日家务安排
 */
function getWeeklySchedule() {
  var chores = mockUtils.initData('chores', generateMockChores)
  var weekDates = mockUtils.getWeekDates()
  var weekDayNames = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  var result = weekDates.map(function(date, index) {
    return {
      date: date,
      dayName: weekDayNames[index],
      chores: chores.filter(function(c) { return c.scheduledDate === date }).map(function(c) {
        return { id: c.id, title: c.title, assignedTo: c.assignedTo, status: c.status }
      })
    }
  })
  return mockUtils.mockAsync(result)
}

/**
 * 完成家务
 * @param {string} choreId - 家务ID
 * @returns {Promise<Object>} 完成的家务和更新后的列表
 */
function completeChore(choreId) {
  var chores = mockUtils.initData('chores', generateMockChores)
  var index = chores.findIndex(function(c) { return c.id === choreId })
  var completedChore = null
  if (index !== -1) {
    chores[index].status = 'completed'
    chores[index].completedAt = mockUtils.formatDateTime(new Date())
    completedChore = chores[index]
    mockUtils.setToStorage('chores', chores)
  }
  return mockUtils.mockAsync({ chore: completedChore, all: chores })
}

/**
 * 生成本周家务计划
 * @returns {Promise<Array>} 新生成的家务列表
 */
function generateWeeklyPlan() {
  var members = _getMembers()
  var weekDates = mockUtils.getWeekDates()
  var choreNames = ['扫地', '洗碗', '倒垃圾', '做晚饭', '洗衣服', '整理客厅', '清洁卫生间']
  var newChores = []
  weekDates.forEach(function(date, dayIndex) {
    var dailyCount = mockUtils.randomInt(2, 3)
    for (var i = 0; i < dailyCount; i++) {
      var memberIndex = (dayIndex + i) % members.length
      newChores.push({
        id: mockUtils.generateId(),
        title: mockUtils.randomPick(choreNames),
        assignedTo: members[memberIndex],
        category: mockUtils.randomPick(CHORE_CATEGORIES),
        scheduledDate: date,
        status: 'pending',
        points: mockUtils.randomInt(5, 20),
        completedAt: null
      })
    }
  })
  mockUtils.setToStorage('chores', newChores)
  return mockUtils.mockAsync(newChores)
}

module.exports = {
  getChores: getChores,
  getLeaderboard: getLeaderboard,
  getWeeklySchedule: getWeeklySchedule,
  completeChore: completeChore,
  generateWeeklyPlan: generateWeeklyPlan
}
