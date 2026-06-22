/**
 * @module services/travel-service
 * @description 旅行计划服务
 * 提供旅行计划管理、待办、行李清单、倒计时等功能，包括：
 * - 旅行计划的 CRUD 操作
 * - 待办事项的增删改查与状态切换
 * - 行李清单的增删改查与状态切换
 * - 出发倒计时计算
 * - 每日行程安排
 */

var mockUtils = require('../utils/mock-utils')

var STORAGE_KEY = 'travel_plans'

/**
 * 生成模拟旅行计划数据（3条示例计划）
 * @returns {Array<Object>} 旅行计划列表
 * @private
 */
function generateMockPlans() {
  return [
    {
      id: 'plan_01',
      title: '暑假日本行',
      destination: '东京',
      startDate: '2026-07-15',
      endDate: '2026-07-22',
      budget: 15000,
      spent: 0,
      status: 'planning',
      todos: [
        { id: 'todo_01', text: '办理签证', done: true },
        { id: 'todo_02', text: '预订机票', done: true },
        { id: 'todo_03', text: '预订酒店', done: false },
        { id: 'todo_04', text: '购买旅行保险', done: false },
        { id: 'todo_05', text: '兑换日元', done: false },
        { id: 'todo_06', text: '下载离线地图', done: false }
      ],
      packingList: [
        { id: 'pack_01', text: '护照和签证', done: true },
        { id: 'pack_02', text: '充电宝和充电线', done: false },
        { id: 'pack_03', text: '转换插头', done: false },
        { id: 'pack_04', text: '换洗衣物（8天）', done: false },
        { id: 'pack_05', text: '洗漱用品', done: false },
        { id: 'pack_06', text: '常用药品', done: false },
        { id: 'pack_07', text: '防晒霜和遮阳帽', done: false },
        { id: 'pack_08', text: '雨伞', done: false }
      ],
      dailyPlans: [
        { day: 1, title: '抵达东京，入住酒店', activities: ['到达成田机场', '乘坐N\'EX到新宿', '酒店入住', '新宿周边逛逛'] },
        { day: 2, title: '浅草寺-晴空塔', activities: ['浅草寺参拜', '仲见世通购物', '午餐吃天妇罗', '晴空塔展望台'] },
        { day: 3, title: '秋叶原-银座', activities: ['秋叶原电器街', '动漫周边', '银座购物', '晚餐寿司'] },
        { day: 4, title: '迪士尼乐园', activities: ['全天迪士尼', '花车巡游', '烟花表演'] },
        { day: 5, title: '镰仓一日游', activities: ['江之电', '镰仓大佛', '灌篮高手取景地', '海边散步'] },
        { day: 6, title: '原宿-涩谷', activities: ['明治神宫', '原宿竹下通', '涩谷十字路口', '忠犬八公像'] },
        { day: 7, title: '自由活动', activities: ['台场', '高达', 'teamLab', '台场购物'] },
        { day: 8, title: '返程', activities: ['收拾行李', '退房', '购买伴手礼', '前往机场'] }
      ],
      notes: '记得提前研究好交通卡和路线'
    },
    {
      id: 'plan_02',
      title: '周末露营',
      destination: '千岛湖',
      startDate: '2026-06-14',
      endDate: '2026-06-15',
      budget: 800,
      spent: 0,
      status: 'planning',
      todos: [
        { id: 'todo_07', text: '确认天气预报', done: false },
        { id: 'todo_08', text: '准备露营装备', done: false },
        { id: 'todo_09', text: '采购食物和饮品', done: false },
        { id: 'todo_10', text: '确认同行人员', done: true }
      ],
      packingList: [
        { id: 'pack_09', text: '帐篷和防潮垫', done: false },
        { id: 'pack_10', text: '睡袋', done: false },
        { id: 'pack_11', text: '烧烤炉和炭', done: false },
        { id: 'pack_12', text: '驱蚊液和蚊香', done: false },
        { id: 'pack_13', text: '手电筒', done: false },
        { id: 'pack_14', text: '急救包', done: false }
      ],
      dailyPlans: [
        { day: 1, title: '出发与搭建营地', activities: ['早上7点出发', '到达千岛湖营地', '搭建帐篷', '午餐烧烤', '下午划船', '晚上篝火晚会'] },
        { day: 2, title: '探索与返程', activities: ['看日出', '早餐', '徒步环湖', '收拾营地', '午餐后返程'] }
      ],
      notes: '带够饮用水，附近没有商店'
    },
    {
      id: 'plan_03',
      title: '国庆回家',
      destination: '老家',
      startDate: '2026-10-01',
      endDate: '2026-10-07',
      budget: 2000,
      spent: 0,
      status: 'planning',
      todos: [
        { id: 'todo_11', text: '购买火车票', done: false },
        { id: 'todo_12', text: '给家人买礼物', done: false },
        { id: 'todo_13', text: '安排宠物寄养', done: false },
        { id: 'todo_14', text: '打扫房间（回来时干净）', done: false }
      ],
      packingList: [
        { id: 'pack_15', text: '换洗衣物', done: false },
        { id: 'pack_16', text: '给爸妈的保健品', done: false },
        { id: 'pack_17', text: '充电器和充电宝', done: false },
        { id: 'pack_18', text: '身份证和车票', done: false }
      ],
      dailyPlans: [
        { day: 1, title: '启程回家', activities: ['上午出发', '下午到家', '和家人吃晚饭'] },
        { day: 2, title: '家庭聚餐', activities: ['奶奶家聚餐', '和亲戚聊天'] },
        { day: 3, title: '老友聚会', activities: ['约老同学吃饭', '逛街'] },
        { day: 4, title: '周边游玩', activities: ['和家人去公园', '看电影'] },
        { day: 5, title: '休息日', activities: ['在家陪爸妈', '帮忙做家务'] },
        { day: 6, title: '准备返程', activities: ['收拾行李', '买特产'] },
        { day: 7, title: '返程', activities: ['出发回程', '到家休整'] }
      ],
      notes: '帮妈妈带那个她要的洗面奶'
    }
  ];
}

/**
 * 获取所有旅行计划
 * @returns {Promise<Array>} 计划列表
 */
function getPlans() {
  var plans = mockUtils.initData(STORAGE_KEY, generateMockPlans)
  return mockUtils.mockAsync(plans)
}

/**
 * 根据ID获取旅行计划
 * @param {string} id - 计划ID
 * @returns {Promise<Object|null>} 计划详情
 */
function getPlanById(id) {
  var plans = mockUtils.initData(STORAGE_KEY, generateMockPlans)
  var plan = mockUtils.findById(plans, id)
  return mockUtils.mockAsync(plan || null)
}

/**
 * 添加旅行计划
 * @param {Object} plan - 计划信息
 * @returns {Promise<Object>} 新计划
 */
function addPlan(plan) {
  var plans = mockUtils.initData(STORAGE_KEY, generateMockPlans)
  var newPlan = Object.assign({
    id: mockUtils.generateId(),
    budget: 0,
    spent: 0,
    status: 'planning',
    todos: [],
    packingList: [],
    dailyPlans: [],
    notes: ''
  }, plan)
  plans.push(newPlan)
  mockUtils.setToStorage(STORAGE_KEY, plans)
  return mockUtils.mockAsync(newPlan)
}

/**
 * 更新旅行计划
 * @param {string} id - 计划ID
 * @param {Object} updates - 更新字段
 * @returns {Promise<Object>} 更新后的计划
 */
function updatePlan(id, updates) {
  var plans = mockUtils.initData(STORAGE_KEY, generateMockPlans)
  var plan = mockUtils.findById(plans, id)
  if (!plan) {
    return mockUtils.mockAsync({ success: false, message: '计划不存在' })
  }
  Object.assign(plan, updates)
  mockUtils.setToStorage(STORAGE_KEY, plans)
  return mockUtils.mockAsync(plan)
}

/**
 * 删除旅行计划
 * @param {string} id - 计划ID
 * @returns {Promise<Object>} 操作结果
 */
function deletePlan(id) {
  var plans = mockUtils.initData(STORAGE_KEY, generateMockPlans)
  var index = mockUtils.findIndexById(plans, id)
  if (index === -1) {
    return mockUtils.mockAsync({ success: false, message: '计划不存在' })
  }
  plans.splice(index, 1)
  mockUtils.setToStorage(STORAGE_KEY, plans)
  return mockUtils.mockAsync({ success: true })
}

/**
 * 切换待办项完成状态
 * @param {string} planId - 计划ID
 * @param {string} todoId - 待办项ID
 * @returns {Promise<Object>} 更新后的待办项
 */
function toggleTodo(planId, todoId) {
  var plans = mockUtils.initData(STORAGE_KEY, generateMockPlans)
  var plan = mockUtils.findById(plans, planId)
  if (!plan) {
    return mockUtils.mockAsync({ success: false, message: '计划不存在' })
  }
  var todo = mockUtils.findById(plan.todos, todoId)
  if (!todo) {
    return mockUtils.mockAsync({ success: false, message: '待办不存在' })
  }
  todo.done = !todo.done
  mockUtils.setToStorage(STORAGE_KEY, plans)
  return mockUtils.mockAsync(todo)
}

/**
 * 切换行李项完成状态
 * @param {string} planId - 计划ID
 * @param {string} itemId - 行李项ID
 * @returns {Promise<Object>} 更新后的行李项
 */
function togglePacking(planId, itemId) {
  var plans = mockUtils.initData(STORAGE_KEY, generateMockPlans)
  var plan = mockUtils.findById(plans, planId)
  if (!plan) {
    return mockUtils.mockAsync({ success: false, message: '计划不存在' })
  }
  var item = mockUtils.findById(plan.packingList, itemId)
  if (!item) {
    return mockUtils.mockAsync({ success: false, message: '物品不存在' })
  }
  item.done = !item.done
  mockUtils.setToStorage(STORAGE_KEY, plans)
  return mockUtils.mockAsync(item)
}

/**
 * 计算距离出发的天数
 * @param {string} planId - 计划ID
 * @returns {Promise<Object>} 倒计时信息
 */
function getDaysUntil(planId) {
  var plans = mockUtils.initData(STORAGE_KEY, generateMockPlans)
  var plan = mockUtils.findById(plans, planId)
  if (!plan) {
    return mockUtils.mockAsync({ success: false, message: '计划不存在' })
  }
  var today = new Date()
  today.setHours(0, 0, 0, 0)
  var start = new Date(plan.startDate)
  start.setHours(0, 0, 0, 0)
  var diff = Math.ceil((start - today) / (1000 * 60 * 60 * 24))
  return mockUtils.mockAsync({
    planId: planId,
    title: plan.title,
    daysUntil: diff > 0 ? diff : 0,
    status: diff > 0 ? 'upcoming' : (diff === 0 ? 'today' : 'past')
  })
}

module.exports = {
  getPlans: getPlans,
  getPlanById: getPlanById,
  addPlan: addPlan,
  updatePlan: updatePlan,
  deletePlan: deletePlan,
  toggleTodo: toggleTodo,
  togglePacking: togglePacking,
  getDaysUntil: getDaysUntil
}
