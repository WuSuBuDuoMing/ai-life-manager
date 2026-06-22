/**
 * @module utils/constants
 * @description 全局常量定义模块
 * 集中管理小程序的所有常量，包括：
 * - 页面路径映射（PAGES）
 * - 本地缓存键名（STORAGE_KEYS）
 * - 家务/购物/订阅/账本/食材/衣物分类常量
 * - 房间区域配置（ROOM_ZONES）
 * - 积分规则（POINTS_RULES）
 * - 动画时间常量（ANIMATION）
 * - 默认预算配置（DEFAULT_BUDGET）
 */

// 页面路径
var PAGES = {
  INDEX: '/pages/index/index',
  CHORES: '/pages/chores/chores',
  CHECKLISTS: '/pages/checklists/checklists',
  SHOPPING: '/pages/shopping/shopping',
  SUBSCRIPTIONS: '/pages/subscriptions/subscriptions',
  BUDGET: '/pages/budget/budget',
  FRIDGE: '/pages/fridge/fridge',
  WARDROBE: '/pages/wardrobe/wardrobe',
  ROOM: '/pages/room/room',
  PROFILE: '/pages/profile/profile'
}

// 存储 Key
var STORAGE_KEYS = {
  THEME: 'theme',
  DATA_VERSION: 'data_version',
  USER_SETTINGS: 'user_settings',
  BUDGET_SETTINGS: 'budget_settings',
  CHORES: 'chores',
  CHECKLISTS: 'checklists',
  CHECKLIST_TEMPLATES: 'checklist_templates',
  SHOPPING_ITEMS: 'shopping_items',
  SUBSCRIPTIONS: 'subscriptions',
  BUDGET_RECORDS: 'budget_records',
  FRIDGE_ITEMS: 'fridge_items',
  WARDROBE_ITEMS: 'wardrobe_items',
  ROOM_TASKS: 'room_tasks',
  TOTAL_POINTS: 'total_points'
}

// 家务频率
var CHORE_FREQUENCIES = ['每天', '每周', '每两周', '每月']

// 购物分类
var SHOPPING_CATEGORIES = ['食品饮料', '日用品', '清洁用品', '文具', '电子产品', '衣物', '零食', '调味品', '个护', '厨房用品']

// 订阅分类
var SUBSCRIPTION_CATEGORIES = ['娱乐', '工具', '云存储', '学习', '音乐', '视频', '社交', '其他']

// 账本分类
var BUDGET_CATEGORIES = [
  { name: '房租', icon: '🏠', color: '#42A5F5' },
  { name: '饭钱', icon: '🍚', color: '#FF9800' },
  { name: '交通', icon: '🚌', color: '#9C27B0' },
  { name: '购物', icon: '🛒', color: '#E91E63' },
  { name: '娱乐', icon: '🎮', color: '#FF5722' },
  { name: '日用', icon: '🧴', color: '#607D8B' },
  { name: '订阅', icon: '📱', color: '#3F51B5' },
  { name: '其他', icon: '📦', color: '#795548' }
]

// 食材分类
var FOOD_CATEGORIES = ['蔬菜', '水果', '肉类', '海鲜', '乳制品', '调味品', '饮料', '冷冻', '零食', '干货']

// 衣物分类
var WARDROBE_CATEGORIES = ['T恤', '衬衫', '牛仔裤', '运动裤', '外套', '卫衣', '裙子', '内衣', '袜子', '帽子', '围巾', '睡衣']

// 房间区域
var ROOM_ZONES = [
  { id: 'zone_desk', name: '桌面', icon: '🖥️' },
  { id: 'zone_wardrobe', name: '衣柜', icon: '👔' },
  { id: 'zone_kitchen', name: '厨房', icon: '🍳' },
  { id: 'zone_bathroom', name: '卫生间', icon: '🚿' },
  { id: 'zone_bedside', name: '床边', icon: '🛏️' }
]

// 积分规则
var POINTS_RULES = {
  CHORE_COMPLETE: 5,
  CHORE_BONUS: 10,
  ROOM_COMPLETE: 3,
  DAILY_LOGIN: 1,
  WEEKLY_ALL_DONE: 20
}

// 动画时间
var ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500
}

// 默认预算
var DEFAULT_BUDGET = {
  monthly: 3000,
  currency: '¥'
}

module.exports = {
  PAGES: PAGES,
  STORAGE_KEYS: STORAGE_KEYS,
  CHORE_FREQUENCIES: CHORE_FREQUENCIES,
  SHOPPING_CATEGORIES: SHOPPING_CATEGORIES,
  SUBSCRIPTION_CATEGORIES: SUBSCRIPTION_CATEGORIES,
  BUDGET_CATEGORIES: BUDGET_CATEGORIES,
  FOOD_CATEGORIES: FOOD_CATEGORIES,
  WARDROBE_CATEGORIES: WARDROBE_CATEGORIES,
  ROOM_ZONES: ROOM_ZONES,
  POINTS_RULES: POINTS_RULES,
  ANIMATION: ANIMATION,
  DEFAULT_BUDGET: DEFAULT_BUDGET
}
