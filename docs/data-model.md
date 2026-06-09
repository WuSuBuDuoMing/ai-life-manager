# 数据结构文档

> AI 生活管家 - 本地存储数据结构定义

## 存储方式

所有数据通过 `wx.Storage` 本地持久化，使用 `mock-utils.js` 封装的 `getFromStorage` / `setToStorage` / `initData` 方法。

## 数据表一览

| Storage Key | 类型 | 说明 |
|-------------|------|------|
| `chores` | Array | 家务任务列表 |
| `habits` | Array | 习惯列表 |
| `shopping_items` | Array | 购物清单 |
| `checklists` | Array | 生活清单 |
| `subscriptions` | Array | 订阅服务列表 |
| `budget_records` | Array | 收支记录 |
| `budget_settings` | Object | 预算配置 |
| `fridge_items` | Array | 冰箱食材 |
| `recipes` | Array | 菜谱列表 |
| `wardrobe_items` | Array | 衣物列表 |
| `room_tasks` | Array | 房间整理任务 |
| `pet_data` | Object | 宠物数据（档案+提醒+日记） |
| `travel_plans` | Array | 旅行计划列表 |
| `bills` | Array | 账单列表 |
| `assistant_history` | Array | AI 助手对话历史 |
| `search_history` | Array | 搜索历史 |
| `user_settings` | Object | 用户设置 |
| `theme` | String | 主题（`light` / `dark`） |
| `data_version` | String | 数据版本号 |

## 数据结构详情

### chores - 家务任务

```javascript
{
  id: 'id_xxx',           // 唯一标识
  title: '拖地',          // 任务标题
  assignee: '我',         // 负责人
  status: 'pending',      // 状态: pending | in_progress | completed
  priority: 'medium',     // 优先级: low | medium | high
  dueDate: '2026-06-10',  // 截止日期
  category: '清洁',       // 分类
  points: 10,             // 积分
  createdAt: '2026-06-01' // 创建时间
}
```

### habits - 习惯

```javascript
{
  id: 'habit_01',                              // 唯一标识
  name: '早起',                                // 习惯名称
  icon: '🌅',                                  // 图标
  category: '健康',                             // 分类: 健康 | 学习 | 工作 | 生活 | 宠物
  targetDays: 7,                               // 目标天数
  currentStreak: 5,                            // 当前连续天数
  bestStreak: 12,                              // 最佳连续天数
  completedDates: ['2026-06-08', '2026-06-07'], // 已打卡日期
  createdAt: '2026-05-01'                      // 创建时间
}
```

### shopping_items - 购物清单

```javascript
{
  id: 'id_xxx',           // 唯一标识
  name: '牛奶',           // 商品名称
  category: '食品饮料',    // 分类
  price: 8.5,             // 单价
  quantity: 2,            // 数量
  checked: false,         // 是否已购买
  addedDate: '2026-06-09' // 添加日期
}
```

### fridge_items - 冰箱食材

```javascript
{
  id: 'id_xxx',           // 唯一标识
  name: '西红柿',         // 食材名称
  category: '蔬菜',       // 分类: 蔬菜 | 水果 | 肉类 | 海鲜 | 乳制品 | 调味品 | 饮料 | 冷冻 | 零食
  expiryDate: '2026-06-15', // 过期日期
  quantity: 3,            // 数量
  unit: '个',             // 单位
  storageLocation: '冷藏室', // 存放位置: 冷藏室 | 冷冻室 | 常温
  icon: '🥬',             // 图标
  addedDate: '2026-06-01' // 添加日期
}
```

### recipes - 菜谱

```javascript
{
  id: 'recipe_01',                    // 唯一标识
  name: '番茄炒蛋',                   // 菜谱名称
  icon: '🍅',                         // 图标
  category: '正餐',                   // 分类: 早餐 | 正餐 | 甜品 | 咖啡 | 饮品
  difficulty: 'easy',                 // 难度: easy | medium | hard
  time: '15分钟',                     // 制作时间
  servings: 2,                        // 份量
  ingredients: ['番茄2个', '鸡蛋3个'], // 食材列表
  steps: ['鸡蛋打散...', '番茄切块...'], // 步骤
  tips: '番茄要炒出汁才好吃',          // 小贴士
  tags: ['家常', '快手', '下饭'],      // 标签
  favorited: false                    // 是否收藏
}
```

### pet_data - 宠物数据

```javascript
{
  pet: {
    id: 'pet_01',        // 唯一标识
    name: '豆豆',        // 名字
    type: '狗',          // 类型
    breed: '柯基',       // 品种
    birthday: '2024-03-15', // 生日
    weight: 12,          // 体重(kg)
    icon: '🐕'           // 图标
  },
  reminders: [
    {
      id: 'reminder_01',   // 唯一标识
      petId: 'pet_01',     // 关联宠物
      type: 'feed',        // 类型: feed | water | walk | clean | vaccine | checkup
      title: '早餐喂食',   // 标题
      time: '08:00',       // 时间
      frequency: '每天',   // 频率: 每天 | 每周 | 每月 | 每年
      enabled: true,       // 是否启用
      lastDone: '2026-06-09' // 最后完成日期
    }
  ],
  diary: [
    {
      id: 'diary_01',      // 唯一标识
      petId: 'pet_01',     // 关联宠物
      date: '2026-06-09',  // 日期
      content: '今天很开心', // 内容
      mood: 'happy',       // 心情: happy | normal | sad | sick | excited
      photo: ''            // 照片URL
    }
  ]
}
```

### travel_plans - 旅行计划

```javascript
{
  id: 'plan_01',           // 唯一标识
  title: '暑假日本行',     // 标题
  destination: '东京',     // 目的地
  startDate: '2026-07-15', // 出发日期
  endDate: '2026-07-22',   // 返回日期
  budget: 15000,           // 预算
  spent: 0,                // 已花费
  status: 'planning',      // 状态: planning | ongoing | completed
  todos: [
    { id: 'todo_01', text: '办理签证', done: true }
  ],
  packingList: [
    { id: 'pack_01', text: '护照和签证', done: true }
  ],
  dailyPlans: [
    { day: 1, title: '抵达东京', activities: ['到达机场', '酒店入住'] }
  ],
  notes: '记得提前研究好交通卡'
}
```

### bills - 账单

```javascript
{
  id: 'bill_01',           // 唯一标识
  name: '房租',            // 账单名称
  amount: 2500,            // 金额
  dueDate: '2026-06-28',   // 到期日期
  category: '住房',        // 分类: 住房 | 水电 | 通讯 | 订阅 | 贷款 | 保险 | 其他
  paid: false,             // 是否已付
  recurring: true,         // 是否周期性
  frequency: '每月',       // 频率: 一次性 | 每月 | 每季 | 每年
  icon: '🏠'              // 图标
}
```

### subscriptions - 订阅服务

```javascript
{
  id: 'sub_01',            // 唯一标识
  name: 'Netflix',         // 服务名称
  price: 45,               // 价格
  billingCycle: 'monthly', // 周期: monthly | yearly
  category: '娱乐',        // 分类
  nextBillingDate: '2026-06-18', // 下次扣费日
  icon: '🎬',              // 图标
  active: true             // 是否活跃
}
```

### budget_records - 收支记录

```javascript
{
  id: 'id_xxx',            // 唯一标识
  type: 'expense',         // 类型: income | expense
  amount: 35.5,            // 金额
  category: '饭钱',        // 分类
  note: '午餐',            // 备注
  date: '2026-06-09'       // 日期
}
```

### assistant_history - AI 助手对话

```javascript
{
  id: 'id_xxx',            // 唯一标识
  question: '今天吃什么',   // 用户问题
  answer: '...',           // AI 回答
  relatedModule: '菜谱推荐', // 关联模块
  timestamp: '2026-06-09 14:30' // 时间戳
}
```

## 数据版本管理

通过 `data_version` 字段管理数据迁移，当前版本 `1.0.0`。
