/**
 * Unit tests for services/habit-service.js
 * Run: node tests/habit-service.test.js
 */
var mock = require('./wx-mock')
global.wx = mock.wx
global.getApp = mock.getApp

var habitService = require('../services/habit-service')

var passed = 0
var failed = 0

function assert(condition, message) {
  if (condition) {
    passed++
    console.log('  PASS: ' + message)
  } else {
    failed++
    console.log('  FAIL: ' + message)
  }
}

function reset() {
  mock.resetStorage()
}

console.log('\n=== habit-service.test.js ===\n')

// getHabits returns mock data
console.log('getHabits:')
reset()
habitService.getHabits().then(function(habits) {
  assert(Array.isArray(habits), 'returns array')
  assert(habits.length === 15, 'has 15 mock habits')
  assert(habits[0].id === 'habit_01', 'first habit id')
  assert(habits[0].name === '早起', 'first habit name')
  assert(Array.isArray(habits[0].completedDates), 'has completedDates')

  // addHabit
  console.log('addHabit:')
  return habitService.addHabit({ name: '新习惯', icon: '🎯', category: '自定义' })
}).then(function(newHabit) {
  assert(newHabit.name === '新习惯', 'new habit name')
  assert(newHabit.currentStreak === 0, 'initial streak is 0')
  assert(newHabit.bestStreak === 0, 'initial best streak is 0')
  assert(Array.isArray(newHabit.completedDates), 'has completedDates')
  assert(typeof newHabit.id === 'string', 'has id')

  // toggleToday
  console.log('toggleToday:')
  return habitService.toggleToday('habit_01')
}).then(function(updated) {
  assert(updated.completedDates.length > 0, 'date added to completedDates')

  // toggleToday again (untoggle)
  return habitService.toggleToday(updated.id)
}).then(function(updated2) {
  var today = new Date()
  var todayStr = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0')
  var hasToday = updated2.completedDates.indexOf(todayStr) > -1
  assert(!hasToday, 'date removed from completedDates')

  // toggleToday nonexistent
  console.log('toggleToday (nonexistent):')
  return habitService.toggleToday('nonexistent')
}).then(function(result) {
  assert(result.success === false, 'returns failure')

  // deleteHabit
  console.log('deleteHabit:')
  return habitService.deleteHabit('habit_15')
}).then(function(result) {
  assert(result.success === true, 'delete succeeds')

  // getHabitStats
  console.log('getHabitStats:')
  return habitService.getHabitStats()
}).then(function(stats) {
  assert(stats.totalHabits > 0, 'total habits > 0')
  assert(typeof stats.todayDone === 'number', 'todayDone is number')
  assert(typeof stats.totalCheckins === 'number', 'totalCheckins is number')

  // getWeeklyData
  console.log('getWeeklyData:')
  return habitService.getWeeklyData('habit_01')
}).then(function(weekData) {
  assert(Array.isArray(weekData), 'returns array')
  assert(weekData.length === 7, 'has 7 days')
  assert(typeof weekData[0].done === 'boolean', 'done is boolean')
  assert(typeof weekData[0].date === 'string', 'date is string')

  // getWeeklyData nonexistent
  return habitService.getWeeklyData('nonexistent')
}).then(function(result) {
  assert(result.success === false, 'nonexistent returns failure')

  // Summary
  console.log('\n--- Results: ' + passed + ' passed, ' + failed + ' failed ---')
  process.exit(failed > 0 ? 1 : 0)
}).catch(function(err) {
  console.error('Test error:', err)
  process.exit(1)
})
