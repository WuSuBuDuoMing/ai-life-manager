/**
 * 宠物生活服务
 * 提供宠物档案管理、提醒、日记、疫苗记录等功能
 */

var mockUtils = require('../utils/mock-utils')

var STORAGE_KEY = 'pet_data'

function getToday() {
  return mockUtils.formatDate(new Date())
}

function generateMockData() {
  var today = getToday()
  return {
    pet: {
      id: 'pet_01',
      name: '豆豆',
      type: '狗',
      breed: '柯基',
      birthday: '2024-03-15',
      weight: 12,
      icon: '🐕',
      gender: '公',
      neutered: false,
      microchip: '',
      vetName: '阳光宠物医院',
      vetPhone: '010-88886666'
    },
    reminders: [
      { id: 'reminder_01', petId: 'pet_01', type: 'feed', title: '早餐喂食', time: '08:00', frequency: '每天', enabled: true, lastDone: today },
      { id: 'reminder_02', petId: 'pet_01', type: 'feed', title: '晚餐喂食', time: '18:00', frequency: '每天', enabled: true, lastDone: today },
      { id: 'reminder_03', petId: 'pet_01', type: 'water', title: '更换饮用水', time: '09:00', frequency: '每天', enabled: true, lastDone: today },
      { id: 'reminder_04', petId: 'pet_01', type: 'walk', title: '上午遛狗', time: '07:30', frequency: '每天', enabled: true, lastDone: today },
      { id: 'reminder_05', petId: 'pet_01', type: 'walk', title: '下午遛狗', time: '17:00', frequency: '每天', enabled: true, lastDone: today },
      { id: 'reminder_06', petId: 'pet_01', type: 'clean', title: '清理狗窝', time: '10:00', frequency: '每周', enabled: true, lastDone: '2026-06-08' },
      { id: 'reminder_07', petId: 'pet_01', type: 'clean', title: '洗澡', time: '14:00', frequency: '每周', enabled: true, lastDone: '2026-06-07' },
      { id: 'reminder_08', petId: 'pet_01', type: 'vaccine', title: '狂犬疫苗加强', time: '09:00', frequency: '每年', enabled: true, lastDone: '2025-06-15' },
      { id: 'reminder_09', petId: 'pet_01', type: 'checkup', title: '年度体检', time: '10:00', frequency: '每年', enabled: true, lastDone: '2025-09-01' },
      { id: 'reminder_10', petId: 'pet_01', type: 'checkup', title: '驱虫', time: '09:00', frequency: '每月', enabled: true, lastDone: '2026-06-01' }
    ],
    diary: [
      { id: 'diary_01', petId: 'pet_01', date: '2026-06-09', content: '今天豆豆在公园追蝴蝶玩得特别开心，跑了好久都不肯回家', mood: 'happy', photo: '' },
      { id: 'diary_02', petId: 'pet_01', date: '2026-06-08', content: '带豆豆去宠物店洗了澡，洗完香喷喷的，毛蓬蓬的好可爱', mood: 'happy', photo: '' },
      { id: 'diary_03', petId: 'pet_01', date: '2026-06-07', content: '豆豆今天食欲不太好，狗粮只吃了一半，观察一下明天的情况', mood: 'normal', photo: '' },
      { id: 'diary_04', petId: 'pet_01', date: '2026-06-05', content: '豆豆学会了新技能——握手！训练了大概半小时就会了，真聪明', mood: 'happy', photo: '' },
      { id: 'diary_05', petId: 'pet_01', date: '2026-06-03', content: '豆豆有点拉肚子，可能是昨天偷吃了桌上的水果，喂了益生菌', mood: 'sick', photo: '' }
    ],
    vaccines: [
      { id: 'vaccine_01', name: '犬六联疫苗', date: '2024-05-10', nextDate: '2025-05-10', hospital: '阳光宠物医院', notes: '首次接种，无不良反应', completed: true },
      { id: 'vaccine_02', name: '狂犬疫苗', date: '2024-06-15', nextDate: '2025-06-15', hospital: '阳光宠物医院', notes: '首次接种', completed: true },
      { id: 'vaccine_03', name: '犬六联疫苗加强', date: '2025-05-10', nextDate: '2026-05-10', hospital: '阳光宠物医院', notes: '年度加强针', completed: true },
      { id: 'vaccine_04', name: '狂犬疫苗加强', date: '2025-06-15', nextDate: '2026-06-15', hospital: '阳光宠物医院', notes: '年度加强针', completed: true },
      { id: 'vaccine_05', name: '犬六联疫苗加强', date: '', nextDate: '2026-05-10', hospital: '阳光宠物医院', notes: '待接种', completed: false },
      { id: 'vaccine_06', name: '狂犬疫苗加强', date: '', nextDate: '2026-06-15', hospital: '阳光宠物医院', notes: '待接种', completed: false }
    ],
    weightHistory: [
      { date: '2024-03-15', weight: 3.5, note: '领养时' },
      { date: '2024-06-15', weight: 6.0, note: '3个月' },
      { date: '2024-09-15', weight: 8.5, note: '6个月' },
      { date: '2024-12-15', weight: 10.5, note: '9个月' },
      { date: '2025-03-15', weight: 11.8, note: '1岁' },
      { date: '2025-09-15', weight: 12.0, note: '1岁半' },
      { date: '2026-03-15', weight: 12.2, note: '2岁' },
      { date: '2026-06-01', weight: 12.0, note: '当前' }
    ]
  }
}

function loadData() {
  return mockUtils.initData(STORAGE_KEY, generateMockData)
}

function getPet() {
  var data = loadData()
  return mockUtils.mockAsync(data.pet)
}

function updatePet(info) {
  var data = mockUtils.getFromStorage(STORAGE_KEY, generateMockData())
  data.pet = Object.assign({}, data.pet, info)
  mockUtils.setToStorage(STORAGE_KEY, data)
  return mockUtils.mockAsync(data.pet)
}

function getReminders() {
  var data = loadData()
  return mockUtils.mockAsync(data.reminders)
}

function addReminder(reminder) {
  var data = mockUtils.getFromStorage(STORAGE_KEY, generateMockData())
  var newReminder = Object.assign({
    id: mockUtils.generateId(),
    petId: data.pet ? data.pet.id : 'pet_01',
    type: 'other',
    title: '',
    time: '09:00',
    frequency: '每天',
    enabled: true,
    lastDone: ''
  }, reminder)
  data.reminders.push(newReminder)
  mockUtils.setToStorage(STORAGE_KEY, data)
  return mockUtils.mockAsync(newReminder)
}

function deleteReminder(id) {
  var data = mockUtils.getFromStorage(STORAGE_KEY, generateMockData())
  data.reminders = data.reminders.filter(function(r) { return r.id !== id })
  mockUtils.setToStorage(STORAGE_KEY, data)
  return mockUtils.mockAsync({ success: true })
}

function toggleReminder(id) {
  var data = mockUtils.getFromStorage(STORAGE_KEY, generateMockData())
  var reminder = mockUtils.findById(data.reminders, id)
  if (!reminder) {
    return mockUtils.mockAsync({ success: false, message: '提醒不存在' })
  }
  reminder.enabled = !reminder.enabled
  mockUtils.setToStorage(STORAGE_KEY, data)
  return mockUtils.mockAsync(reminder)
}

function doneReminder(id) {
  var data = mockUtils.getFromStorage(STORAGE_KEY, generateMockData())
  var reminder = mockUtils.findById(data.reminders, id)
  if (!reminder) {
    return mockUtils.mockAsync({ success: false, message: '提醒不存在' })
  }
  reminder.lastDone = getToday()
  mockUtils.setToStorage(STORAGE_KEY, data)
  return mockUtils.mockAsync(reminder)
}

function getDiary() {
  var data = loadData()
  return mockUtils.mockAsync(data.diary)
}

function addDiary(entry) {
  var data = mockUtils.getFromStorage(STORAGE_KEY, generateMockData())
  var newEntry = Object.assign({
    id: mockUtils.generateId(),
    petId: data.pet ? data.pet.id : 'pet_01',
    date: getToday(),
    content: '',
    mood: 'happy',
    photo: ''
  }, entry)
  data.diary.unshift(newEntry)
  mockUtils.setToStorage(STORAGE_KEY, data)
  return mockUtils.mockAsync(newEntry)
}

function deleteDiary(id) {
  var data = mockUtils.getFromStorage(STORAGE_KEY, generateMockData())
  data.diary = data.diary.filter(function(d) { return d.id !== id })
  mockUtils.setToStorage(STORAGE_KEY, data)
  return mockUtils.mockAsync({ success: true })
}

function getTodayReminders() {
  var data = loadData()
  var todayStr = getToday()
  var todayReminders = data.reminders.filter(function(r) {
    if (!r.enabled) return false
    if (r.lastDone === todayStr) return false
    return true
  })
  return mockUtils.mockAsync(todayReminders)
}

// ========== 疫苗记录 ==========

function getVaccines() {
  var data = loadData()
  return mockUtils.mockAsync(data.vaccines || [])
}

function addVaccine(vaccine) {
  var data = mockUtils.getFromStorage(STORAGE_KEY, generateMockData())
  if (!data.vaccines) data.vaccines = []
  var newVaccine = Object.assign({
    id: mockUtils.generateId(),
    name: '',
    date: '',
    nextDate: '',
    hospital: '',
    notes: '',
    completed: false
  }, vaccine)
  data.vaccines.push(newVaccine)
  mockUtils.setToStorage(STORAGE_KEY, data)
  return mockUtils.mockAsync(newVaccine)
}

function markVaccineDone(id) {
  var data = mockUtils.getFromStorage(STORAGE_KEY, generateMockData())
  if (!data.vaccines) return mockUtils.mockAsync({ success: false, message: '记录不存在' })
  var vaccine = mockUtils.findById(data.vaccines, id)
  if (!vaccine) return mockUtils.mockAsync({ success: false, message: '记录不存在' })
  vaccine.completed = true
  vaccine.date = getToday()
  mockUtils.setToStorage(STORAGE_KEY, data)
  return mockUtils.mockAsync(vaccine)
}

function deleteVaccine(id) {
  var data = mockUtils.getFromStorage(STORAGE_KEY, generateMockData())
  if (!data.vaccines) return mockUtils.mockAsync({ success: true })
  data.vaccines = data.vaccines.filter(function(v) { return v.id !== id })
  mockUtils.setToStorage(STORAGE_KEY, data)
  return mockUtils.mockAsync({ success: true })
}

// ========== 体重记录 ==========

function getWeightHistory() {
  var data = loadData()
  return mockUtils.mockAsync(data.weightHistory || [])
}

function addWeight(entry) {
  var data = mockUtils.getFromStorage(STORAGE_KEY, generateMockData())
  if (!data.weightHistory) data.weightHistory = []
  var newEntry = Object.assign({
    date: getToday(),
    weight: 0,
    note: ''
  }, entry)
  data.weightHistory.push(newEntry)
  // 更新宠物当前体重
  if (data.pet) {
    data.pet.weight = newEntry.weight
  }
  mockUtils.setToStorage(STORAGE_KEY, data)
  return mockUtils.mockAsync(newEntry)
}

module.exports = {
  getPet: getPet,
  updatePet: updatePet,
  getReminders: getReminders,
  addReminder: addReminder,
  deleteReminder: deleteReminder,
  toggleReminder: toggleReminder,
  doneReminder: doneReminder,
  getDiary: getDiary,
  addDiary: addDiary,
  deleteDiary: deleteDiary,
  getTodayReminders: getTodayReminders,
  getVaccines: getVaccines,
  addVaccine: addVaccine,
  markVaccineDone: markVaccineDone,
  deleteVaccine: deleteVaccine,
  getWeightHistory: getWeightHistory,
  addWeight: addWeight
}
