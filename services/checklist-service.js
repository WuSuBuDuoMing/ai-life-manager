/**
 * @module services/checklist-service
 * @description 清单数据服务
 * 提供生活清单的完整管理功能，包括：
 * - 30+ 场景模板（旅行、搬家、大扫除、健身等）
 * - 自定义清单创建
 * - 从模板快速创建清单
 * - 清单项的勾选/取消勾选
 * - 清单删除
 */
var mockUtils = require('../utils/mock-utils')

var CHECKLIST_TEMPLATES = [
  { id: 'tpl_travel', name: '旅行准备清单', icon: '✈️', items: ['护照/身份证', '充电器', '换洗衣物', '洗漱用品', '药品', '钱包', '耳机'] },
  { id: 'tpl_move', name: '搬家清单', icon: '📦', items: ['打包箱', '气泡膜', '胶带', '标记笔', '断网/过户', '地址变更通知', '钥匙交接'] },
  { id: 'tpl_clean', name: '大扫除清单', icon: '🧹', items: ['擦窗户', '清洗油烟机', '整理衣柜', '清洁冰箱', '拖地', '擦家具', '清洗窗帘'] },
  { id: 'tpl_grocery', name: '每周采购清单', icon: '🛒', items: ['蔬菜', '水果', '肉类', '牛奶', '鸡蛋', '面包', '日用品'] },
  { id: 'tpl_birthday', name: '生日聚会准备', icon: '🎂', items: ['蛋糕', '气球', '彩带', '礼物', '餐具', '音乐播放', '拍照'] },
  { id: 'tpl_workout', name: '健身计划清单', icon: '💪', items: ['跑步30分钟', '拉伸10分钟', '核心训练', '蛋白质补充', '记录体重', '喝水2L'] },
  { id: 'tpl_study', name: '期末复习清单', icon: '📖', items: ['整理笔记', '刷真题', '重点公式背诵', '错题回顾', '小组讨论', '考前冲刺'] },
  { id: 'tpl_camping', name: '露营准备清单', icon: '⛺', items: ['帐篷', '睡袋', '手电筒', '驱蚊液', '食物和水', '急救包', '防晒霜'] },
  { id: 'tpl_party', name: '家庭聚会清单', icon: '🎉', items: ['菜单规划', '饮料采购', '场地布置', '音乐准备', '游戏道具', '拍照设备'] },
  { id: 'tpl_spring', name: '春季大扫除', icon: '🌸', items: ['清洗窗帘', '擦拭灯具', '整理鞋柜', '清洁空调', '洗地毯', '整理储物间'] },
  { id: 'tpl_cooking', name: '周末做饭清单', icon: '🍳', items: ['确定菜谱', '采购食材', '准备调料', '腌制食材', '烹饪', '摆盘上桌'] },
  { id: 'tpl_wardrobe', name: '换季衣橱整理', icon: '👗', items: ['分类过季衣物', '清洗待收纳衣物', '整理当季衣物', '淘汰旧衣', '补充缺少的单品'] },
  { id: 'tpl_pets', name: '宠物护理清单', icon: '🐱', items: ['喂食', '清理猫砂', '洗澡', '剪指甲', '驱虫', '体检预约'] },
  { id: 'tpl_digital', name: '数码设备维护', icon: '💻', items: ['备份手机数据', '清理电脑垃圾', '更新系统', '检查电池健康', '整理文件夹'] },
  { id: 'tpl_morning', name: '晨间例行清单', icon: '🌅', items: ['起床喝水', '晨练20分钟', '健康早餐', '阅读15分钟', '规划今日任务'] },
  { id: 'tpl_evening', name: '晚间放松清单', icon: '🌙', items: ['整理房间', '准备明天衣物', '泡脚/热水澡', '阅读30分钟', '23点前入睡'] },
  { id: 'tpl_garden', name: '阳台花园养护', icon: '🌻', items: ['浇水', '施肥', '修剪枯叶', '除虫', '更换花盆', '补充新植物'] },
  { id: 'tpl_travel_domestic', name: '国内旅行清单', icon: '🚄', items: ['身份证', '充电宝', '换洗衣物', '洗漱包', '常用药品', '零食饮料'] },
  { id: 'tpl_backpack', name: '背包远足清单', icon: '🎒', items: ['登山鞋', '雨衣', '水壶', '能量棒', '急救包', '地图导航', '头灯'] },
  { id: 'tpl_home_office', name: '居家办公清单', icon: '🖥️', items: ['整理书桌', '检查网络', '准备笔记本', '水杯', '耳机', '待办事项确认'] },
  { id: 'tpl_gym', name: '健身房准备', icon: '🏋️', items: ['运动衣裤', '运动鞋', '毛巾', '水壶', '锁', '耳机', '蛋白粉'] },
  { id: 'tpl_movie', name: '电影之夜准备', icon: '🎬', items: ['选片', '准备零食', '调暗灯光', '准备毯子', '手机静音'] },
  { id: 'tpl_beach', name: '海边出游清单', icon: '🏖️', items: ['泳衣', '防晒霜', '沙滩巾', '墨镜', '拖鞋', '防水袋', '饮用水'] },
  { id: 'tpl_exam', name: '考试准备清单', icon: '📝', items: ['准考证', '身份证', '文具', '手表', '水杯', '纸巾', '提前踩点'] },
  { id: 'tpl_newyear', name: '新年大扫除', icon: '🧧', items: ['擦窗户', '清洗窗帘', '整理储物间', '清洗油烟机', '扔旧物', '贴春联'] },
  { id: 'tpl_baby', name: '宝宝出门清单', icon: '👶', items: ['尿布', '奶瓶', '湿巾', '换洗衣物', '小毯子', '零食', '玩具'] },
  { id: 'tpl_car', name: '自驾出行检查', icon: '🚗', items: ['检查油量', '胎压检测', '带驾照', '充电线', '应急工具', '饮用水'] },
  { id: 'tpl_clean_weekly', name: '每周清洁计划', icon: '🧽', items: ['周一拖地', '周二擦桌面', '周三洗衣服', '周四清洁卫生间', '周五整理厨房'] },
  { id: 'tpl_project', name: '项目启动清单', icon: '📋', items: ['需求确认', '分工安排', '时间节点', '工具准备', '首次会议', '进度表'] },
  { id: 'tpl_seasonal', name: '季节性衣物收纳', icon: '🧸', items: ['清洗待收纳衣物', '真空袋收纳', '防虫防潮处理', '分类标签', '整理存储空间'] }
]

function generateMockChecklists() {
  return [
    {
      id: mockUtils.generateId(),
      name: '本周待办',
      icon: '📋',
      items: [
        { id: mockUtils.generateId(), text: '缴纳水电费', checked: true },
        { id: mockUtils.generateId(), text: '预约牙科检查', checked: false },
        { id: mockUtils.generateId(), text: '购买生日礼物', checked: false },
        { id: mockUtils.generateId(), text: '整理书架', checked: true }
      ],
      createdAt: mockUtils.formatDateTime(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000))
    },
    {
      id: mockUtils.generateId(),
      name: '健康打卡',
      icon: '🏃',
      items: [
        { id: mockUtils.generateId(), text: '早起喝温水', checked: true },
        { id: mockUtils.generateId(), text: '步行30分钟', checked: false },
        { id: mockUtils.generateId(), text: '吃水果', checked: true },
        { id: mockUtils.generateId(), text: '23点前入睡', checked: false }
      ],
      createdAt: mockUtils.formatDateTime(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000))
    },
    {
      id: mockUtils.generateId(),
      name: '学习计划',
      icon: '📚',
      items: [
        { id: mockUtils.generateId(), text: '阅读30页', checked: false },
        { id: mockUtils.generateId(), text: '复习笔记', checked: false },
        { id: mockUtils.generateId(), text: '练习口语', checked: true }
      ],
      createdAt: mockUtils.formatDateTime(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000))
    }
  ]
}

/**
 * 获取所有清单
 * @returns {Promise<Array>} 清单列表
 */
function getChecklists() {
  var data = mockUtils.initData('checklists', generateMockChecklists)
  return mockUtils.mockAsync(data)
}

/**
 * 获取清单模板列表
 * @returns {Promise<Array>} 模板列表
 */
function getTemplates() {
  return mockUtils.mockAsync(CHECKLIST_TEMPLATES)
}

/**
 * 创建新清单
 * @param {string} name - 清单名称
 * @param {string} icon - 图标
 * @returns {Promise<Object>} 新清单
 */
function createChecklist(name, icon) {
  var checklists = mockUtils.initData('checklists', generateMockChecklists)
  var newChecklist = {
    id: mockUtils.generateId(),
    name: name || '新清单',
    icon: icon || '📝',
    items: [],
    createdAt: mockUtils.formatDateTime(new Date())
  }
  checklists.push(newChecklist)
  mockUtils.setToStorage('checklists', checklists)
  return mockUtils.mockAsync(newChecklist)
}

/**
 * 从模板创建清单
 * @param {string} templateId - 模板ID
 * @returns {Promise<Object|null>} 新清单
 */
function createFromTemplate(templateId) {
  var template = CHECKLIST_TEMPLATES.find(function(t) { return t.id === templateId })
  if (!template) return mockUtils.mockAsync(null)

  // 创建清单并复制模板的所有 items
  var checklists = mockUtils.initData('checklists', generateMockChecklists)
  var newChecklist = {
    id: mockUtils.generateId(),
    name: template.name,
    icon: template.icon,
    items: (template.items || []).map(function(text) {
      return { id: mockUtils.generateId(), text: text, checked: false }
    }),
    createdAt: mockUtils.formatDateTime(new Date())
  }
  checklists.push(newChecklist)
  mockUtils.setToStorage('checklists', checklists)
  return mockUtils.mockAsync(newChecklist)
}

/**
 * 切换清单项勾选状态
 * @param {string} checklistId - 清单ID
 * @param {string} itemId - 项目ID
 * @returns {Promise<Array>} 更新后的清单列表
 */
function toggleChecklistItem(checklistId, itemId) {
  var checklists = mockUtils.initData('checklists', generateMockChecklists)
  var checklist = checklists.find(function(c) { return c.id === checklistId })
  if (checklist) {
    var item = checklist.items.find(function(i) { return i.id === itemId })
    if (item) {
      item.checked = !item.checked
      mockUtils.setToStorage('checklists', checklists)
    }
  }
  return mockUtils.mockAsync(checklists)
}

/**
 * 删除清单
 * @param {string} checklistId - 清单ID
 * @returns {Promise<Array>} 更新后的列表
 */
function deleteChecklist(checklistId) {
  var checklists = mockUtils.initData('checklists', generateMockChecklists)
  checklists = checklists.filter(function(c) { return c.id !== checklistId })
  mockUtils.setToStorage('checklists', checklists)
  return mockUtils.mockAsync(checklists)
}

module.exports = {
  getChecklists: getChecklists,
  getTemplates: getTemplates,
  createChecklist: createChecklist,
  createFromTemplate: createFromTemplate,
  toggleChecklistItem: toggleChecklistItem,
  deleteChecklist: deleteChecklist
}
