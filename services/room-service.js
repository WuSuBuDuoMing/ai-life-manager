/**
 * @module services/room-service
 * @description 房间整理服务
 * 提供区域管理、整理任务 CRUD、进度统计、每周挑战等功能，包括：
 * - 5大房间区域（桌面、衣柜、厨房、卫生间、床边）
 * - 30条整理任务的管理
 * - 区域进度统计
 * - 每周整理挑战系统
 */
var mockUtils = require('../utils/mock-utils')

var STORAGE_KEY = 'room_tasks'

var ZONES = [
  { id: 'zone_desk', name: '桌面', icon: '🖥️', description: '书桌和工作区域' },
  { id: 'zone_wardrobe', name: '衣柜', icon: '👔', description: '衣物收纳区域' },
  { id: 'zone_kitchen', name: '厨房', icon: '🍳', description: '烹饪和储物区域' },
  { id: 'zone_bathroom', name: '卫生间', icon: '🚿', description: '洗漱和卫浴区域' },
  { id: 'zone_bedside', name: '床边', icon: '🛏️', description: '床头和休息区域' }
]

function generateMockTasks() {
  return [
    { id: 'room_001', title: '整理书架', zone: 'zone_desk', status: 'completed', priority: 'normal', dueDate: '2026-06-08', icon: '📚' },
    { id: 'room_002', title: '清理桌面杂物', zone: 'zone_desk', status: 'pending', priority: 'high', dueDate: '2026-06-10', icon: '✏️' },
    { id: 'room_003', title: '整理文具抽屉', zone: 'zone_desk', status: 'pending', priority: 'normal', dueDate: '2026-06-12', icon: '📎' },
    { id: 'room_004', title: '擦拭显示器', zone: 'zone_desk', status: 'completed', priority: 'low', dueDate: '2026-06-07', icon: '🖥️' },
    { id: 'room_005', title: '整理充电线', zone: 'zone_desk', status: 'pending', priority: 'normal', dueDate: '2026-06-11', icon: '🔌' },
    { id: 'room_006', title: '清理垃圾桶', zone: 'zone_desk', status: 'pending', priority: 'high', dueDate: '2026-06-09', icon: '🗑️' },

    { id: 'room_007', title: '按季节分类衣物', zone: 'zone_wardrobe', status: 'completed', priority: 'high', dueDate: '2026-06-08', icon: '👕' },
    { id: 'room_008', title: '整理袜子抽屉', zone: 'zone_wardrobe', status: 'pending', priority: 'normal', dueDate: '2026-06-13', icon: '🧦' },
    { id: 'room_009', title: '处理不穿的旧衣服', zone: 'zone_wardrobe', status: 'pending', priority: 'normal', dueDate: '2026-06-14', icon: '♻️' },
    { id: 'room_010', title: '清洁衣柜表面', zone: 'zone_wardrobe', status: 'pending', priority: 'low', dueDate: '2026-06-15', icon: '🧹' },
    { id: 'room_011', title: '整理外套挂钩', zone: 'zone_wardrobe', status: 'completed', priority: 'normal', dueDate: '2026-06-07', icon: '🧥' },
    { id: 'room_012', title: '整理帽子围巾', zone: 'zone_wardrobe', status: 'pending', priority: 'low', dueDate: '2026-06-16', icon: '🧢' },

    { id: 'room_013', title: '清洁油烟机', zone: 'zone_kitchen', status: 'pending', priority: 'high', dueDate: '2026-06-10', icon: '💨' },
    { id: 'room_014', title: '整理调料架', zone: 'zone_kitchen', status: 'completed', priority: 'normal', dueDate: '2026-06-08', icon: '🧂' },
    { id: 'room_015', title: '清理冰箱表面', zone: 'zone_kitchen', status: 'pending', priority: 'normal', dueDate: '2026-06-11', icon: '🧊' },
    { id: 'room_016', title: '整理碗筷', zone: 'zone_kitchen', status: 'pending', priority: 'high', dueDate: '2026-06-09', icon: '🍽️' },
    { id: 'room_017', title: '清洁水槽', zone: 'zone_kitchen', status: 'completed', priority: 'normal', dueDate: '2026-06-07', icon: '🚿' },
    { id: 'room_018', title: '检查过期调料', zone: 'zone_kitchen', status: 'pending', priority: 'normal', dueDate: '2026-06-12', icon: '🔍' },

    { id: 'room_019', title: '清洁镜子', zone: 'zone_bathroom', status: 'completed', priority: 'normal', dueDate: '2026-06-08', icon: '🪞' },
    { id: 'room_020', title: '整理洗漱用品', zone: 'zone_bathroom', status: 'pending', priority: 'high', dueDate: '2026-06-10', icon: '🧴' },
    { id: 'room_021', title: '更换毛巾', zone: 'zone_bathroom', status: 'pending', priority: 'normal', dueDate: '2026-06-11', icon: '🧴' },
    { id: 'room_022', title: '清理地漏', zone: 'zone_bathroom', status: 'pending', priority: 'high', dueDate: '2026-06-09', icon: '🚿' },
    { id: 'room_023', title: '清洁马桶', zone: 'zone_bathroom', status: 'completed', priority: 'high', dueDate: '2026-06-08', icon: '🚽' },
    { id: 'room_024', title: '整理清洁工具', zone: 'zone_bathroom', status: 'pending', priority: 'low', dueDate: '2026-06-14', icon: '🧹' },

    { id: 'room_025', title: '整理床头柜', zone: 'zone_bedside', status: 'completed', priority: 'normal', dueDate: '2026-06-07', icon: '🗄️' },
    { id: 'room_026', title: '整理充电设备', zone: 'zone_bedside', status: 'pending', priority: 'normal', dueDate: '2026-06-10', icon: '🔌' },
    { id: 'room_027', title: '清洁床头灯', zone: 'zone_bedside', status: 'pending', priority: 'low', dueDate: '2026-06-13', icon: '💡' },
    { id: 'room_028', title: '整理书籍杂志', zone: 'zone_bedside', status: 'pending', priority: 'normal', dueDate: '2026-06-12', icon: '📖' },
    { id: 'room_029', title: '更换床单被套', zone: 'zone_bedside', status: 'pending', priority: 'high', dueDate: '2026-06-09', icon: '🛏️' },
    { id: 'room_030', title: '整理拖鞋', zone: 'zone_bedside', status: 'completed', priority: 'low', dueDate: '2026-06-08', icon: '🩴' }
  ]
}

/**
 * 获取所有区域（含任务统计）
 * @returns {Promise<Array>} 区域列表
 */
function getZones() {
  var tasks = mockUtils.initData(STORAGE_KEY, generateMockTasks)
  var result = ZONES.map(function(z) {
    var zoneTasks = tasks.filter(function(t) { return t.zone === z.id })
    var completed = zoneTasks.filter(function(t) { return t.status === 'completed' })
    return {
      id: z.id, name: z.name, icon: z.icon, description: z.description,
      taskCount: zoneTasks.length, completedCount: completed.length,
      progress: zoneTasks.length > 0 ? Math.round(completed.length / zoneTasks.length * 100) : 0
    }
  })
  return mockUtils.mockAsync(result)
}

/**
 * 获取所有房间任务
 * @returns {Promise<Array>} 任务列表
 */
function getTasks() {
  var data = mockUtils.initData(STORAGE_KEY, generateMockTasks)
  return mockUtils.mockAsync(data)
}

/**
 * 添加房间任务
 * @param {Object} task - 任务信息
 * @returns {Promise<Object>} 新任务
 */
function addTask(task) {
  var tasks = mockUtils.initData(STORAGE_KEY, generateMockTasks)
  task.id = task.id || mockUtils.generateId()
  task.status = task.status || 'pending'
  tasks.push(task)
  mockUtils.setToStorage(STORAGE_KEY, tasks)
  return mockUtils.mockAsync(task)
}

/**
 * 更新房间任务
 * @param {string} id - 任务ID
 * @param {Object} updates - 更新字段
 * @returns {Promise<boolean>}
 */
function updateTask(id, updates) {
  var tasks = mockUtils.initData(STORAGE_KEY, generateMockTasks)
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === id) { tasks[i] = Object.assign({}, tasks[i], updates); break }
  }
  mockUtils.setToStorage(STORAGE_KEY, tasks)
  return mockUtils.mockAsync(true)
}

/**
 * 删除房间任务
 * @param {string} id - 任务ID
 * @returns {Promise<boolean>}
 */
function deleteTask(id) {
  var tasks = mockUtils.initData(STORAGE_KEY, generateMockTasks)
  tasks = tasks.filter(function(t) { return t.id !== id })
  mockUtils.setToStorage(STORAGE_KEY, tasks)
  return mockUtils.mockAsync(true)
}

/**
 * 完成房间任务
 * @param {string} id - 任务ID
 * @returns {Promise<boolean>}
 */
function completeTask(id) {
  return updateTask(id, { status: 'completed' })
}

/**
 * 获取区域进度（别名，等同于 getZones）
 * @returns {Promise<Array>}
 */
function getProgress() {
  return getZones()
}

/**
 * 获取每周整理挑战
 * @returns {Promise<Object>} 挑战详情
 */
function getWeeklyChallenge() {
  return mockUtils.mockAsync({
    id: 'challenge_001',
    title: '本周整理挑战：床边区域大改造',
    description: '本周重点整理床边区域，清理床头柜、整理书籍、更换床单，打造舒适睡眠环境',
    icon: '🏆',
    tasks: ['整理床头柜', '整理充电设备', '更换床单被套', '整理书籍杂志', '清洁床头灯', '整理拖鞋'],
    completedCount: 2,
    totalCount: 6,
    reward: '整理达人徽章 +50积分',
    endDate: '2026-06-15'
  })
}

module.exports = {
  getZones: getZones,
  getTasks: getTasks,
  addTask: addTask,
  updateTask: updateTask,
  deleteTask: deleteTask,
  completeTask: completeTask,
  getProgress: getProgress,
  getWeeklyChallenge: getWeeklyChallenge
}
