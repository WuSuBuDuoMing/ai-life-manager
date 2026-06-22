/**
 * @module services/habit-service
 * @description 习惯打卡服务
 * 提供习惯管理、每日打卡、连续天数统计等功能，包括：
 * - 15个预设习惯（覆盖健康、学习、工作、生活、宠物5大类）
 * - 习惯的添加、删除、今日打卡切换
 * - 连续打卡天数自动计算与最佳记录追踪
 * - 习惯统计数据
 * - 每周打卡数据
 */

var mockUtils = require('../utils/mock-utils')

var STORAGE_KEY = 'habits'

/**
 * 获取今日日期字符串
 * @returns {string} YYYY-MM-DD 格式
 */
function getToday() {
  return mockUtils.formatDate(new Date())
}

function generateMockHabits() {
  var today = getToday()
  return [
    { id: 'habit_01', name: '早起', icon: '🌅', category: '健康', targetDays: 7, currentStreak: 5, bestStreak: 12, completedDates: ['2026-06-08', '2026-06-07', '2026-06-06', '2026-06-05', '2026-06-04'], createdAt: '2026-05-01' },
    { id: 'habit_02', name: '喝水8杯', icon: '💧', category: '健康', targetDays: 7, currentStreak: 3, bestStreak: 21, completedDates: ['2026-06-08', '2026-06-07', '2026-06-06'], createdAt: '2026-04-15' },
    { id: 'habit_03', name: '阅读30分钟', icon: '📖', category: '学习', targetDays: 7, currentStreak: 7, bestStreak: 7, completedDates: ['2026-06-08', '2026-06-07', '2026-06-06', '2026-06-05', '2026-06-04', '2026-06-03', '2026-06-02'], createdAt: '2026-05-10' },
    { id: 'habit_04', name: '运动', icon: '🏃', category: '健康', targetDays: 7, currentStreak: 2, bestStreak: 15, completedDates: ['2026-06-08', '2026-06-07'], createdAt: '2026-03-01' },
    { id: 'habit_05', name: '冥想', icon: '🧘', category: '健康', targetDays: 7, currentStreak: 1, bestStreak: 9, completedDates: ['2026-06-08'], createdAt: '2026-05-20' },
    { id: 'habit_06', name: '学英语', icon: '🇬🇧', category: '学习', targetDays: 7, currentStreak: 4, bestStreak: 10, completedDates: ['2026-06-08', '2026-06-07', '2026-06-06', '2026-06-05'], createdAt: '2026-04-01' },
    { id: 'habit_07', name: '整理桌面', icon: '🗂️', category: '工作', targetDays: 7, currentStreak: 0, bestStreak: 5, completedDates: ['2026-06-05'], createdAt: '2026-05-15' },
    { id: 'habit_08', name: '遛狗', icon: '🐕', category: '宠物', targetDays: 7, currentStreak: 6, bestStreak: 14, completedDates: ['2026-06-08', '2026-06-07', '2026-06-06', '2026-06-05', '2026-06-04', '2026-06-03'], createdAt: '2026-03-15' },
    { id: 'habit_09', name: '写日记', icon: '📝', category: '生活', targetDays: 7, currentStreak: 3, bestStreak: 8, completedDates: ['2026-06-08', '2026-06-07', '2026-06-06'], createdAt: '2026-05-01' },
    { id: 'habit_10', name: '不喝奶茶', icon: '🚫', category: '健康', targetDays: 7, currentStreak: 10, bestStreak: 10, completedDates: ['2026-06-08', '2026-06-07', '2026-06-06', '2026-06-05', '2026-06-04', '2026-06-03', '2026-06-02', '2026-06-01', '2026-05-31', '2026-05-30'], createdAt: '2026-05-01' },
    { id: 'habit_11', name: '练字', icon: '✒️', category: '学习', targetDays: 7, currentStreak: 0, bestStreak: 3, completedDates: ['2026-06-04'], createdAt: '2026-06-01' },
    { id: 'habit_12', name: '背单词', icon: '📚', category: '学习', targetDays: 7, currentStreak: 2, bestStreak: 6, completedDates: ['2026-06-08', '2026-06-07'], createdAt: '2026-05-05' },
    { id: 'habit_13', name: '做饭', icon: '🍳', category: '生活', targetDays: 7, currentStreak: 1, bestStreak: 4, completedDates: ['2026-06-08'], createdAt: '2026-04-20' },
    { id: 'habit_14', name: '早睡', icon: '🌙', category: '健康', targetDays: 7, currentStreak: 0, bestStreak: 7, completedDates: ['2026-06-06', '2026-06-05'], createdAt: '2026-05-10' },
    { id: 'habit_15', name: '护肤', icon: '✨', category: '生活', targetDays: 7, currentStreak: 4, bestStreak: 9, completedDates: ['2026-06-08', '2026-06-07', '2026-06-06', '2026-06-05'], createdAt: '2026-04-01' }
  ]
}

/**
 * 获取所有习惯
 * @returns {Promise<Array>} 习惯列表
 */
function getHabits() {
  var habits = mockUtils.initData(STORAGE_KEY, generateMockHabits)
  return mockUtils.mockAsync(habits)
}

/**
 * 添加新习惯
 * @param {Object} habit - 习惯信息
 * @returns {Promise<Object>} 新习惯
 */
function addHabit(habit) {
  var habits = mockUtils.getFromStorage(STORAGE_KEY, [])
  var newHabit = Object.assign({
    id: mockUtils.generateId(),
    targetDays: 7,
    currentStreak: 0,
    bestStreak: 0,
    completedDates: [],
    createdAt: getToday()
  }, habit)
  habits.push(newHabit)
  mockUtils.setToStorage(STORAGE_KEY, habits)
  return mockUtils.mockAsync(newHabit)
}

/**
 * 切换今日打卡状态
 * @param {string} habitId - 习惯ID
 * @returns {Promise<Object>} 更新后的习惯
 */
function toggleToday(habitId) {
  var habits = mockUtils.getFromStorage(STORAGE_KEY, [])
  var index = mockUtils.findIndexById(habits, habitId)
  if (index === -1) {
    return mockUtils.mockAsync({ success: false, message: '习惯不存在' })
  }
  var habit = habits[index]
  var todayStr = getToday()
  var dateIndex = habit.completedDates.indexOf(todayStr)
  if (dateIndex > -1) {
    habit.completedDates.splice(dateIndex, 1)
    if (habit.currentStreak > 0) {
      habit.currentStreak--
    }
  } else {
    habit.completedDates.push(todayStr)
    habit.currentStreak++
    if (habit.currentStreak > habit.bestStreak) {
      habit.bestStreak = habit.currentStreak
    }
  }
  mockUtils.setToStorage(STORAGE_KEY, habits)
  return mockUtils.mockAsync(habit)
}

/**
 * 删除习惯
 * @param {string} id - 习惯ID
 * @returns {Promise<Object>} 操作结果
 */
function deleteHabit(id) {
  var habits = mockUtils.getFromStorage(STORAGE_KEY, [])
  var index = mockUtils.findIndexById(habits, id)
  if (index === -1) {
    return mockUtils.mockAsync({ success: false, message: '习惯不存在' })
  }
  habits.splice(index, 1)
  mockUtils.setToStorage(STORAGE_KEY, habits)
  return mockUtils.mockAsync({ success: true })
}

/**
 * 获取习惯统计
 * @returns {Promise<Object>} 统计数据
 */
function getHabitStats() {
  var habits = mockUtils.getFromStorage(STORAGE_KEY, [])
  var todayStr = getToday()
  var totalHabits = habits.length
  var todayDone = habits.filter(function (h) {
    return h.completedDates.indexOf(todayStr) > -1
  }).length
  var totalCheckins = habits.reduce(function (sum, h) {
    return sum + h.completedDates.length
  }, 0)
  return mockUtils.mockAsync({
    totalHabits: totalHabits,
    todayDone: todayDone,
    totalCheckins: totalCheckins
  })
}

/**
 * 获取习惯的本周数据
 * @param {string} habitId - 习惯ID
 * @returns {Promise<Array>} 本周打卡数据
 */
function getWeeklyData(habitId) {
  var habits = mockUtils.getFromStorage(STORAGE_KEY, [])
  var habit = mockUtils.findById(habits, habitId)
  if (!habit) {
    return mockUtils.mockAsync({ success: false, message: '习惯不存在' })
  }
  var weekDates = mockUtils.getWeekDates()
  var result = weekDates.map(function (dateStr) {
    return {
      date: dateStr,
      done: habit.completedDates.indexOf(dateStr) > -1
    }
  })
  return mockUtils.mockAsync(result)
}

module.exports = {
  getHabits: getHabits,
  addHabit: addHabit,
  toggleToday: toggleToday,
  deleteHabit: deleteHabit,
  getHabitStats: getHabitStats,
  getWeeklyData: getWeeklyData
}
