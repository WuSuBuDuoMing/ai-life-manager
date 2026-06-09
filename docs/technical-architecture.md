# 技术架构文档

> AI 生活管家 - 微信小程序
> 版本：v1.0
> 更新日期：2026-06-09

---

## 一、整体架构

### 1.1 架构概览

本项目采用经典的三层架构，自上而下分为 **页面层**、**服务层** 和 **数据层**，各层职责分明，通过标准接口通信，便于后续替换和扩展。

```
┌──────────────────────────────────────────────────────────────┐
│                        用户交互层                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │
│  │ 首页     │ │ 家务     │ │ 清单     │ │ 其他页面 (x7)    │ │
│  │ index    │ │housework │ │checklist │ │                  │ │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────────┬─────────┘ │
│       │ WXML/WXSS   │           │                │           │
│       │ JS事件绑定   │           │                │           │
│       │ 数据绑定     │           │                │           │
├───────┼─────────────┼───────────┼────────────────┼───────────┤
│       └─────────────┴───────────┴────────────────┘           │
│                        服务层 (Service)                        │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  houseworkService  checklistService  shoppingService │    │
│  │  subscriptionService  financeService  fridgeService  │    │
│  │  wardrobeService  roomService  aiService             │    │
│  └──────────────────────┬───────────────────────────────┘    │
│                          │ Promise                           │
├──────────────────────────┼───────────────────────────────────┤
│                          ▼                                    │
│                        数据层 (Data)                          │
│  ┌───────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ wx.Storage│  │ Mock Data    │  │ Utils (date/format)  │  │
│  │ 本地持久化 │  │ 模拟数据生成  │  │ 工具函数             │  │
│  └───────────┘  └──────────────┘  └──────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

### 1.2 层次职责

| 层次 | 职责 | 技术实现 |
|------|------|---------|
| **页面层** | 用户界面展示、用户交互事件处理、数据绑定渲染 | WXML 模板 + WXSS 样式 + JS 事件处理 |
| **服务层** | 业务逻辑封装、数据CRUD操作、跨模块数据协调 | JavaScript Service 模块，返回 Promise |
| **数据层** | 数据持久化、模拟数据生成、通用工具函数 | wx.Storage + Mock 模块 + Utils 工具 |

### 1.3 设计原则

- **单一职责**：每个页面只负责展示和交互，业务逻辑全部下沉到 Service 层
- **依赖倒置**：页面层依赖 Service 接口，不关心数据来源（本地/云端）
- **开闭原则**：新增模块只需添加新的 Service，不影响已有代码
- **可测试性**：Service 层纯函数设计，易于单元测试

---

## 二、目录结构说明

```
AI生活管家-小程序/
│
├── app.js                           # 小程序入口，全局初始化
├── app.json                         # 全局配置：页面路由、窗口样式、TabBar
├── app.wxss                         # 全局样式：CSS Variables 主题变量、基础样式重置
├── project.config.json              # 开发者工具项目配置
├── sitemap.json                     # 小程序搜索收录配置
│
├── pages/                           # 页面目录（每个页面4个文件）
│   │
│   ├── index/                       # 首页仪表盘
│   │   ├── index.wxml               #   模板：今日任务卡片、统计概览、快捷入口
│   │   ├── index.wxss               #   样式：仪表盘布局、卡片样式
│   │   ├── index.js                 #   逻辑：聚合各模块数据、事件处理
│   │   └── index.json               #   配置：页面标题、组件引用
│   │
│   ├── housework/                   # 家务分工模块
│   ├── checklist/                   # 生活清单模块
│   ├── shopping/                    # 购物清单模块
│   ├── subscription/                # 订阅管理模块
│   ├── finance/                     # 生活账本模块
│   ├── fridge/                      # 冰箱食材模块
│   ├── wardrobe/                    # 衣橱洗衣模块
│   ├── room/                        # 房间整理模块
│   └── settings/                    # 设置页面
│
├── components/                      # 公共可复用组件
│   │
│   ├── tab-bar/                     # 自定义底部导航栏
│   │   ├── tab-bar.wxml             #   Tab图标 + 文字
│   │   ├── tab-bar.wxss             #   底部固定定位、图标样式
│   │   ├── tab-bar.js               #   Tab切换逻辑、页面跳转
│   │   └── tab-bar.json
│   │
│   ├── task-card/                   # 通用任务卡片组件
│   ├── progress-ring/               # 环形进度条组件
│   ├── empty-state/                 # 空状态占位组件
│   ├── stat-chart/                  # 统计图表组件（纯CSS实现）
│   ├── modal/                       # 通用弹窗组件
│   ├── list-item/                   # 列表项组件
│   ├── filter-bar/                  # 筛选栏组件
│   └── stat-card/                   # 统计卡片组件
│
├── services/                        # 业务服务层
│   │
│   ├── housework.service.js         # 家务模块：任务CRUD、计划生成、积分计算
│   ├── checklist.service.js         # 清单模块：清单CRUD、模板管理、进度计算
│   ├── shopping.service.js          # 购物模块：商品CRUD、预算计算、分类管理
│   ├── subscription.service.js      # 订阅模块：订阅CRUD、续费检查、费用统计
│   ├── finance.service.js           # 账本模块：记录CRUD、分类统计、预算管理
│   ├── fridge.service.js            # 冰箱模块：食材CRUD、过期检查、库存管理
│   ├── wardrobe.service.js          # 衣橱模块：衣物CRUD、脏衣管理、季节标记
│   ├── room.service.js              # 房间模块：区域CRUD、任务管理、进度追踪
│   └── ai.service.js                # AI服务：数据聚合分析、建议生成、跨模块联动
│
├── utils/                           # 工具函数库
│   │
│   ├── storage.js                   # wx.Storage 封装：get/set/remove/批量操作
│   ├── date.js                      # 日期工具：格式化/相对时间/到期判断
│   ├── format.js                    # 格式化：金额/百分比/文件大小
│   ├── theme.js                     # 主题管理：暗黑模式切换/读取/持久化
│   ├── constants.js                 # 常量定义：颜色/枚举/默认值
│   └── validator.js                 # 输入校验：长度/格式/范围检查
│
├── mock/                            # Mock 模拟数据
│   │
│   ├── index.js                     # Mock 入口，统一初始化所有模块数据
│   ├── housework.mock.js            # 家务模拟数据
│   ├── checklist.mock.js            # 清单模拟数据
│   ├── shopping.mock.js             # 购物模拟数据
│   ├── subscription.mock.js         # 订阅模拟数据
│   ├── finance.mock.js              # 账本模拟数据
│   ├── fridge.mock.js               # 冰箱模拟数据
│   ├── wardrobe.mock.js             # 衣橱模拟数据
│   └── room.mock.js                 # 房间模拟数据
│
├── images/                          # 静态图片资源
│   ├── icons/                       # 功能图标 (PNG)
│   ├── tabbar/                      # TabBar 图标 (选中/未选中)
│   └── empty/                       # 空状态插画 (SVG/PNG)
│
└── docs/                            # 项目文档
    ├── product-requirements.md      # 产品需求文档
    ├── technical-architecture.md    # 本文档
    ├── mock-data-design.md          # Mock 数据设计文档
    ├── manual-test-checklist.md     # 手动测试清单
    └── vibe-coding-pitch.md         # Vibe Coding 包装材料
```

---

## 三、页面路由设计

### 3.1 TabBar 配置（4个Tab）

| Tab 序号 | 页面路径 | 标题 | 图标 | 说明 |
|---------|---------|------|------|------|
| 1 | `/pages/index/index` | 首页 | home | 仪表盘总览 |
| 2 | `/pages/housework/housework` | 家务 | housework | 家务分工管理 |
| 3 | `/pages/checklist/checklist` | 清单 | checklist | 生活清单管理 |
| 4 | `/pages/finance/finance` | 账本 | finance | 生活账本管理 |

### 3.2 完整页面路由（10个页面）

```json
{
  "pages": [
    "pages/index/index",
    "pages/housework/housework",
    "pages/checklist/checklist",
    "pages/shopping/shopping",
    "pages/subscription/subscription",
    "pages/finance/finance",
    "pages/fridge/fridge",
    "pages/wardrobe/wardrobe",
    "pages/room/room",
    "pages/settings/settings"
  ],
  "tabBar": {
    "custom": true,
    "color": "#999999",
    "selectedColor": "#4CAF50",
    "backgroundColor": "#FFFFFF",
    "list": [
      { "pagePath": "pages/index/index", "text": "首页" },
      { "pagePath": "pages/housework/housework", "text": "家务" },
      { "pagePath": "pages/checklist/checklist", "text": "清单" },
      { "pagePath": "pages/finance/finance", "text": "账本" }
    ]
  }
}
```

### 3.3 页面导航关系

```
                          ┌──────────┐
                          │  首页     │
                          │  index   │
                          └──┬──┬──┬─┘
                             │  │  │
              ┌──────────────┘  │  └──────────────┐
              v                 v                  v
        ┌──────────┐     ┌──────────┐       ┌──────────┐
        │  家务     │     │  清单     │       │  账本     │
        │housework │     │checklist │       │ finance  │
        └──────────┘     └──────────┘       └──────────┘
              |                 |                  |
              |                 |                  |
    ┌─────────+────────┬───────+           ┌──────+
    v         v        v       v           v      v
┌───────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
│购物    │ │订阅   │ │冰箱   │ │衣橱   │ │房间   │ │设置   │
│shopping│ │subscr│ │fridge│ │wardrb│ │room  │ │setting│
└───────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘
```

**导航规则：**
- 4个Tab页面通过底部TabBar切换，支持页面保活
- 非Tab页面（购物/订阅/冰箱/衣橱/房间/设置）从首页或对应Tab页面跳转进入
- 非Tab页面左上角显示返回按钮，支持手势右滑返回

---

## 四、组件设计原则

### 4.1 组件通信规范

```
┌─────────────────────────────────────────────┐
│                 父页面 (Page)                 │
│                                              │
│   data: { tasks: [...] }                     │
│                                              │
│   ┌──────────────────────────────────────┐   │
│   │          子组件 (Component)           │   │
│   │                                      │   │
│   │  properties: {                       │   │
│   │    task: Object    ◄── 数据输入       │   │
│   │    showBadge: Boolean                │   │
│   │  }                                   │   │
│   │                                      │   │
│   │  triggerEvent('complete', {id}) ──►  │   │ 事件输出
│   │  triggerEvent('tap', {id})     ──►  │   │
│   │                                      │   │
│   └──────────────────────────────────────┘   │
│                                              │
│   methods: {                                 │
│     onTaskComplete(e) { ... }  ◄── 处理事件   │
│   }                                          │
└─────────────────────────────────────────────┘
```

### 4.2 三条核心原则

**原则一：Properties 输入**
- 组件通过 `properties` 接收外部数据，不直接读取父页面 data
- 属性需声明类型和默认值
- 示例：
```javascript
Component({
  properties: {
    task: {
      type: Object,
      value: {},
      observer(newVal) {
        // 数据变化时的处理
      }
    },
    showBadge: {
      type: Boolean,
      value: false
    }
  }
})
```

**原则二：TriggerEvent 输出**
- 组件通过 `triggerEvent` 向父页面发送事件，不直接调用父页面方法
- 事件名使用 kebab-case，携带必要数据
- 示例：
```javascript
// 组件内部
this.triggerEvent('taskcomplete', { taskId: this.data.task.id })

// 父页面 WXML
<task-card task="{{item}}" bind:taskcomplete="onTaskComplete" />
```

**原则三：不直接操作数据**
- 组件不直接修改 Storage 中的数据
- 组件只负责展示和触发事件
- 数据变更逻辑由页面层调用 Service 层完成

### 4.3 通用组件清单

| 组件名 | 路径 | 输入 (Properties) | 输出 (Events) | 说明 |
|--------|------|-------------------|---------------|------|
| `tab-bar` | `/components/tab-bar/` | current, list | change | 自定义底部导航 |
| `task-card` | `/components/task-card/` | task, showBadge | tap, complete | 通用任务卡片 |
| `progress-ring` | `/components/progress-ring/` | percent, size, color | - | 环形进度条 |
| `empty-state` | `/components/empty-state/` | icon, text, buttonText | action | 空状态占位 |
| `stat-chart` | `/components/stat-chart/` | data[], type, color | - | 纯CSS图表 |
| `modal` | `/components/modal/` | title, content, show | confirm, cancel | 通用弹窗 |
| `list-item` | `/components/list-item/` | data, showArrow, showCheck | tap, swipe | 列表项 |
| `filter-bar` | `/components/filter-bar/` | filters[], active | change | 筛选栏 |
| `stat-card` | `/components/stat-card/` | title, value, icon, trend | tap | 统计数据卡片 |

---

## 五、Service 层设计

### 5.1 设计目标

- 所有 Service 方法返回 `Promise`，统一异步接口
- Service 层可替换后端实现（Mock / 云开发 / 自建 API），页面层无感知
- 每个 Service 对应一个业务模块，职责单一

### 5.2 接口规范

每个 Service 遵循统一的接口模式：

```javascript
// services/housework.service.js

const storage = require('../../utils/storage')
const mock = require('../../mock/housework.mock')
const CONSTANTS = require('../../utils/constants')

const STORAGE_KEY = CONSTANTS.STORAGE_KEYS.HOUSEWORK

module.exports = {
  /**
   * 获取所有家务任务
   * @returns {Promise<Array>} 任务列表
   */
  getAllTasks() {
    return new Promise((resolve) => {
      let tasks = storage.get(STORAGE_KEY.TASKS)
      if (!tasks) {
        tasks = mock.generateTasks()
        storage.set(STORAGE_KEY.TASKS, tasks)
      }
      resolve(tasks)
    })
  },

  /**
   * 根据ID获取单个任务
   * @param {string} id - 任务ID
   * @returns {Promise<Object|null>} 任务对象
   */
  getTaskById(id) {
    return this.getAllTasks().then(tasks => {
      return tasks.find(t => t.id === id) || null
    })
  },

  /**
   * 创建新任务
   * @param {Object} taskData - 任务数据
   * @returns {Promise<Object>} 创建后的任务（含ID）
   */
  createTask(taskData) {
    return this.getAllTasks().then(tasks => {
      const newTask = {
        id: Date.now().toString(),
        ...taskData,
        createdAt: new Date().toISOString(),
        completed: false
      }
      tasks.unshift(newTask)
      storage.set(STORAGE_KEY.TASKS, tasks)
      return newTask
    })
  },

  /**
   * 更新任务
   * @param {string} id - 任务ID
   * @param {Object} updates - 更新字段
   * @returns {Promise<Object>} 更新后的任务
   */
  updateTask(id, updates) {
    return this.getAllTasks().then(tasks => {
      const index = tasks.findIndex(t => t.id === id)
      if (index === -1) throw new Error('Task not found')
      tasks[index] = { ...tasks[index], ...updates }
      storage.set(STORAGE_KEY.TASKS, tasks)
      return tasks[index]
    })
  },

  /**
   * 删除任务
   * @param {string} id - 任务ID
   * @returns {Promise<boolean>}
   */
  deleteTask(id) {
    return this.getAllTasks().then(tasks => {
      const filtered = tasks.filter(t => t.id !== id)
      storage.set(STORAGE_KEY.TASKS, filtered)
      return true
    })
  },

  /**
   * 标记任务完成
   * @param {string} id - 任务ID
   * @param {string} completedBy - 完成人
   * @returns {Promise<Object>} 更新后的任务
   */
  completeTask(id, completedBy) {
    return this.updateTask(id, {
      completed: true,
      completedAt: new Date().toISOString(),
      completedBy
    })
  },

  /**
   * 获取积分排行
   * @returns {Promise<Array>} 排行列表
   */
  getScoreRanking() {
    return this.getAllTasks().then(tasks => {
      const ranking = {}
      tasks.filter(t => t.completed).forEach(t => {
        const name = t.completedBy || '未知'
        ranking[name] = (ranking[name] || 0) + (t.score || 10)
      })
      return Object.entries(ranking)
        .map(([name, score]) => ({ name, score }))
        .sort((a, b) => b.score - a.score)
    })
  }
}
```

### 5.3 后端替换策略

Service 层通过统一的 Promise 接口隔离数据来源，替换后端只需修改 Service 实现，页面层完全无需改动：

```javascript
// === 模式A：当前 - Mock 数据 ===
// services/finance.service.js
getAllRecords() {
  return new Promise((resolve) => {
    let records = storage.get(STORAGE_KEY)
    if (!records) records = mock.generateRecords()
    resolve(records)
  })
}

// === 模式B：未来 - 微信云开发 ===
// services/finance.service.js
getAllRecords() {
  const db = wx.cloud.database()
  return db.collection('finance_records')
    .orderBy('date', 'desc')
    .get()
    .then(res => res.data)
}

// === 模式C：未来 - 自建后端 API ===
// services/finance.service.js
getAllRecords() {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${API_BASE}/finance/records`,
      header: { Authorization: getToken() },
      success: (res) => resolve(res.data),
      fail: (err) => reject(err)
    })
  })
}
```

---

## 六、Utils 层设计

### 6.1 storage.js - 存储封装

```javascript
// utils/storage.js

module.exports = {
  /**
   * 获取存储数据
   * @param {string} key - 存储键名
   * @returns {*} 存储的值，不存在返回 null
   */
  get(key) {
    try {
      const value = wx.getStorageSync(key)
      return value || null
    } catch (e) {
      console.error(`Storage get error [${key}]:`, e)
      return null
    }
  },

  /**
   * 设置存储数据
   * @param {string} key - 存储键名
   * @param {*} value - 存储的值
   */
  set(key, value) {
    try {
      wx.setStorageSync(key, value)
    } catch (e) {
      console.error(`Storage set error [${key}]:`, e)
    }
  },

  /**
   * 删除存储数据
   * @param {string} key - 存储键名
   */
  remove(key) {
    try {
      wx.removeStorageSync(key)
    } catch (e) {
      console.error(`Storage remove error [${key}]:`, e)
    }
  },

  /**
   * 清除所有存储
   */
  clear() {
    try {
      wx.clearStorageSync()
    } catch (e) {
      console.error('Storage clear error:', e)
    }
  },

  /**
   * 获取存储信息（大小等）
   * @returns {Object} 存储信息
   */
  getInfo() {
    try {
      return wx.getStorageInfoSync()
    } catch (e) {
      return { keys: [], currentSize: 0, limitSize: 10240 }
    }
  }
}
```

### 6.2 date.js - 日期工具

```javascript
// utils/date.js

module.exports = {
  /**
   * 格式化日期
   * @param {Date|string} date - 日期对象或ISO字符串
   * @param {string} format - 格式模板 'YYYY-MM-DD HH:mm:ss'
   * @returns {string} 格式化后的日期字符串
   */
  format(date, format = 'YYYY-MM-DD') {
    const d = new Date(date)
    const map = {
      'YYYY': d.getFullYear(),
      'MM': String(d.getMonth() + 1).padStart(2, '0'),
      'DD': String(d.getDate()).padStart(2, '0'),
      'HH': String(d.getHours()).padStart(2, '0'),
      'mm': String(d.getMinutes()).padStart(2, '0'),
      'ss': String(d.getSeconds()).padStart(2, '0')
    }
    let result = format
    Object.entries(map).forEach(([k, v]) => {
      result = result.replace(k, v)
    })
    return result
  },

  /**
   * 获取相对时间描述
   * @param {Date|string} date - 目标日期
   * @returns {string} 如"刚刚"、"5分钟前"、"3天后"
   */
  fromNow(date) {
    const now = Date.now()
    const target = new Date(date).getTime()
    const diff = target - now
    const absDiff = Math.abs(diff)
    const isFuture = diff > 0

    const rules = [
      { threshold: 60000, text: isFuture ? '马上' : '刚刚' },
      { threshold: 3600000, unit: '分钟', divisor: 60000 },
      { threshold: 86400000, unit: '小时', divisor: 3600000 },
      { threshold: 2592000000, unit: '天', divisor: 86400000 },
      { threshold: Infinity, unit: '个月', divisor: 2592000000 }
    ]

    for (const rule of rules) {
      if (absDiff < rule.threshold) {
        if (!rule.unit) return rule.text
        const count = Math.floor(absDiff / rule.divisor)
        return isFuture ? `${count}${rule.unit}后` : `${count}${rule.unit}前`
      }
    }
    return this.format(date)
  },

  /**
   * 判断是否临期（距今天数）
   * @param {Date|string} date - 目标日期
   * @param {number} days - 临期天数阈值
   * @returns {boolean}
   */
  isExpiringSoon(date, days = 3) {
    const target = new Date(date).getTime()
    const deadline = Date.now() + days * 86400000
    return target <= deadline && target >= Date.now()
  },

  /**
   * 判断是否已过期
   * @param {Date|string} date - 目标日期
   * @returns {boolean}
   */
  isExpired(date) {
    return new Date(date).getTime() < Date.now()
  },

  /**
   * 获取今天日期字符串
   * @returns {string} YYYY-MM-DD
   */
  today() {
    return this.format(new Date())
  },

  /**
   * 获取本周起止日期
   * @returns {{ start: string, end: string }}
   */
  thisWeek() {
    const now = new Date()
    const day = now.getDay() || 7
    const start = new Date(now)
    start.setDate(start.getDate() - day + 1)
    const end = new Date(start)
    end.setDate(end.getDate() + 6)
    return { start: this.format(start), end: this.format(end) }
  }
}
```

### 6.3 format.js - 格式化工具

```javascript
// utils/format.js

module.exports = {
  /**
   * 金额格式化
   * @param {number} amount - 金额
   * @param {string} currency - 货币符号
   * @returns {string} 如 "¥128.50"
   */
  money(amount, currency = '¥') {
    return `${currency}${Number(amount).toFixed(2)}`
  },

  /**
   * 百分比格式化
   * @param {number} value - 数值 (0-1 或 0-100)
   * @param {boolean} isDecimal - 是否为小数形式
   * @returns {string} 如 "85%"
   */
  percent(value, isDecimal = false) {
    const p = isDecimal ? value * 100 : value
    return `${Math.round(p)}%`
  },

  /**
   * 数字缩写
   * @param {number} num - 数字
   * @returns {string} 如 "1.2k"
   */
  shortNumber(num) {
    if (num >= 10000) return (num / 10000).toFixed(1) + 'w'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
    return String(num)
  }
}
```

### 6.4 theme.js - 主题管理

```javascript
// utils/theme.js
const storage = require('./storage')
const CONSTANTS = require('./constants')

module.exports = {
  /**
   * 获取当前主题
   * @returns {'light'|'dark'}
   */
  getTheme() {
    return storage.get(CONSTANTS.STORAGE_KEYS.THEME) || 'light'
  },

  /**
   * 切换主题
   * @param {'light'|'dark'} theme
   */
  setTheme(theme) {
    storage.set(CONSTANTS.STORAGE_KEYS.THEME, theme)
    this.applyTheme(theme)
  },

  /**
   * 切换暗黑/亮色
   */
  toggle() {
    const current = this.getTheme()
    this.setTheme(current === 'light' ? 'dark' : 'light')
  },

  /**
   * 应用主题到当前页面
   * @param {'light'|'dark'} theme
   */
  applyTheme(theme) {
    const pages = getCurrentPages()
    if (pages.length > 0) {
      const page = pages[pages.length - 1]
      if (page.setData) {
        page.setData({ theme, isDark: theme === 'dark' })
      }
    }
  },

  /**
   * 在页面 onLoad 时调用，初始化主题
   */
  init() {
    const theme = this.getTheme()
    this.applyTheme(theme)
  }
}
```

### 6.5 constants.js - 常量定义

```javascript
// utils/constants.js

module.exports = {
  // Storage 键名
  STORAGE_KEYS: {
    THEME: 'app_theme',
    HOUSEWORK: {
      TASKS: 'housework_tasks',
      MEMBERS: 'housework_members',
      SCORES: 'housework_scores'
    },
    CHECKLIST: {
      LISTS: 'checklist_lists'
    },
    SHOPPING: {
      ITEMS: 'shopping_items'
    },
    SUBSCRIPTION: {
      ITEMS: 'subscription_items'
    },
    FINANCE: {
      RECORDS: 'finance_records',
      BUDGET: 'finance_budget'
    },
    FRIDGE: {
      ITEMS: 'fridge_items'
    },
    WARDROBE: {
      ITEMS: 'wardrobe_items'
    },
    ROOM: {
      AREAS: 'room_areas',
      TASKS: 'room_tasks'
    }
  },

  // 家务房间类型
  ROOM_TYPES: ['客厅', '卧室', '厨房', '卫生间', '阳台', '书房'],

  // 消费分类
  EXPENSE_CATEGORIES: ['餐饮', '交通', '购物', '娱乐', '居住', '医疗', '教育', '其他'],
  INCOME_CATEGORIES: ['工资', '奖金', '兼职', '红包', '理财', '其他'],

  // 食材分类
  FOOD_CATEGORIES: ['肉类', '蔬菜', '水果', '乳制品', '主食', '调味品', '饮品', '零食', '冷冻食品'],

  // 衣物分类
  CLOTHING_TYPES: ['上衣', '裤子', '裙子', '外套', '内衣', '鞋子', '配饰'],
  SEASONS: ['春季', '夏季', '秋季', '冬季', '四季通用'],

  // 默认预算
  DEFAULT_BUDGET: 5000
}
```

---

## 七、数据流设计

### 7.1 数据流总览

```
┌─────────────────────────────────────────────────────────────────────┐
│                         数据流示意                                    │
│                                                                      │
│  用户操作                                                            │
│      |                                                               │
│      v                                                               │
│  ┌────────────┐    triggerEvent     ┌──────────────────┐            │
│  │  组件       │ ─────────────────►  │  页面 (Page)      │            │
│  │ Component  │                     │  index.js        │            │
│  └────────────┘                     └────────┬─────────┘            │
│                                              |                      │
│                                     调用 Service 方法                │
│                                              |                      │
│                                              v                      │
│                                     ┌──────────────────┐            │
│                                     │  Service         │            │
│                                     │  业务逻辑处理      │            │
│                                     └────────┬─────────┘            │
│                                              |                      │
│                                     读写 wx.Storage                  │
│                                              |                      │
│                                              v                      │
│                                     ┌──────────────────┐            │
│                                     │  wx.Storage      │            │
│                                     │  本地数据持久化    │            │
│                                     └────────┬─────────┘            │
│                                              |                      │
│                                     返回 Promise 结果                │
│                                              |                      │
│                                              v                      │
│                                     ┌──────────────────┐            │
│                                     │  页面 setData     │            │
│                                     │  更新视图渲染      │            │
│                                     └──────────────────┘            │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 7.2 数据流详细步骤

**以「标记家务任务完成」为例：**

```
步骤1: 用户点击任务卡片的「完成」按钮
        |
        v
步骤2: task-card 组件捕获点击事件
        this.triggerEvent('complete', { taskId: '123' })
        |
        v
步骤3: 页面 housework.js 接收事件
        onTaskComplete(e) {
          const { taskId } = e.detail
          houseworkService.completeTask(taskId, this.data.currentUser)
            .then(() => this.refreshList())
        }
        |
        v
步骤4: houseworkService.completeTask() 执行
        - 从 wx.Storage 读取任务列表
        - 找到对应任务，更新 completed 字段
        - 计算积分变更
        - 写回 wx.Storage
        - 返回 Promise.resolve(updatedTask)
        |
        v
步骤5: 页面 refreshList() 方法执行
        houseworkService.getAllTasks()
          .then(tasks => this.setData({ tasks }))
        |
        v
步骤6: WXML 模板自动重新渲染
        - 任务卡片显示已完成状态
        - 积分排行榜更新
        - 首页统计数字更新
```

### 7.3 首页数据聚合

首页需要展示各模块的汇总数据，通过并发调用多个 Service 实现：

```javascript
// pages/index/index.js

const houseworkService = require('../../services/housework.service')
const checklistService = require('../../services/checklist.service')
const shoppingService = require('../../services/shopping.service')
const financeService = require('../../services/finance.service')
const fridgeService = require('../../services/fridge.service')

Page({
  data: {
    todayTasks: [],         // 今日家务任务
    activeLists: [],        // 进行中的清单
    shoppingCount: 0,       // 购物清单待购数量
    monthlyExpense: 0,      // 本月支出
    expiringFoods: [],      // 临期食材
    loading: true
  },

  onLoad() {
    this.loadDashboard()
  },

  onShow() {
    // 每次显示时刷新数据
    this.loadDashboard()
  },

  loadDashboard() {
    this.setData({ loading: true })

    Promise.all([
      houseworkService.getTodayTasks(),
      checklistService.getActiveLists(),
      shoppingService.getPendingCount(),
      financeService.getMonthlySummary(),
      fridgeService.getExpiringItems()
    ]).then(([todayTasks, activeLists, shoppingCount, monthlySummary, expiringFoods]) => {
      this.setData({
        todayTasks: todayTasks.slice(0, 5),
        activeLists: activeLists.slice(0, 3),
        shoppingCount,
        monthlyExpense: monthlySummary.totalExpense,
        expiringFoods: expiringFoods.slice(0, 3),
        loading: false
      })
    }).catch(err => {
      console.error('Dashboard load error:', err)
      this.setData({ loading: false })
    })
  }
})
```

---

## 八、主题系统

### 8.1 CSS Variables 方案

全局样式文件 `app.wxss` 定义所有主题变量，页面通过 CSS 变量引用，切换主题只需变更 class。

```css
/* app.wxss - 亮色主题变量（默认） */
page {
  /* 背景色 */
  --bg-primary: #F5F5F5;
  --bg-secondary: #FFFFFF;
  --bg-card: #FFFFFF;
  --bg-hover: #F0F0F0;

  /* 文字色 */
  --text-primary: #333333;
  --text-secondary: #666666;
  --text-tertiary: #999999;
  --text-inverse: #FFFFFF;

  /* 主题色 */
  --color-primary: #4CAF50;
  --color-primary-light: #E8F5E9;
  --color-accent: #FF9800;
  --color-danger: #F44336;
  --color-info: #2196F3;

  /* 边框和阴影 */
  --border-color: #EEEEEE;
  --shadow-card: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
  --shadow-float: 0 4rpx 24rpx rgba(0, 0, 0, 0.12);

  /* 圆角 */
  --radius-sm: 8rpx;
  --radius-md: 16rpx;
  --radius-lg: 24rpx;

  /* 间距 */
  --spacing-xs: 8rpx;
  --spacing-sm: 16rpx;
  --spacing-md: 24rpx;
  --spacing-lg: 32rpx;
  --spacing-xl: 48rpx;
}

/* 暗黑主题变量 */
page.dark {
  --bg-primary: #1A1A2E;
  --bg-secondary: #16213E;
  --bg-card: #16213E;
  --bg-hover: #1E2A4A;

  --text-primary: #E0E0E0;
  --text-secondary: #B0B0B0;
  --text-tertiary: #808080;
  --text-inverse: #1A1A2E;

  --color-primary: #66BB6A;
  --color-primary-light: #1B3A1D;
  --color-accent: #FFA726;
  --color-danger: #EF5350;
  --color-info: #42A5F5;

  --border-color: #2A2A4A;
  --shadow-card: 0 2rpx 12rpx rgba(0, 0, 0, 0.3);
  --shadow-float: 0 4rpx 24rpx rgba(0, 0, 0, 0.4);
}
```

### 8.2 页面中的使用方式

```css
/* pages/index/index.wxss */
.dashboard {
  background-color: var(--bg-primary);
  min-height: 100vh;
}

.card {
  background-color: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  padding: var(--spacing-lg);
}

.card-title {
  color: var(--text-primary);
  font-size: 32rpx;
  font-weight: 600;
}

.card-subtitle {
  color: var(--text-secondary);
  font-size: 26rpx;
}

.highlight {
  color: var(--color-primary);
}
```

### 8.3 主题切换流程

```
用户点击设置页「暗黑模式」开关
        |
        v
theme.toggle()
        |
        +-- storage.set('app_theme', 'dark')
        |
        +-- applyTheme('dark')
                |
                v
        page.setData({ theme: 'dark', isDark: true })
                |
                v
        WXML: <page class="{{isDark ? 'dark' : ''}}">
                |
                v
        CSS Variables 自动切换为暗黑值
                |
                v
        所有使用 var(--xxx) 的样式自动更新
```

---

## 九、性能优化

### 9.1 页面懒加载

```javascript
// 非Tab页面使用懒加载，首屏只加载Tab页面
// app.json 中 TabBar 页面会自动预加载
// 其他页面在首次访问时加载

// 在页面 onLoad 中按需加载数据
Page({
  data: {
    loaded: false,
    list: []
  },

  onLoad() {
    // 首次进入才加载数据
    if (!this.data.loaded) {
      this.loadData()
    }
  },

  onShow() {
    // 每次显示时，如果已加载则只刷新变化的部分
    if (this.data.loaded) {
      this.refreshIfDirty()
    }
  }
})
```

### 9.2 分包策略

```json
// app.json
{
  "pages": [
    "pages/index/index",
    "pages/housework/housework",
    "pages/checklist/checklist",
    "pages/finance/finance"
  ],
  "subpackages": [
    {
      "root": "pages/subpkg",
      "name": "management",
      "pages": [
        "shopping/shopping",
        "subscription/subscription",
        "fridge/fridge",
        "wardrobe/wardrobe",
        "room/room",
        "settings/settings"
      ]
    }
  ]
}
```

**分包规则：**
- 主包：4个Tab页面 + 公共组件 + Service + Utils（控制在2MB以内）
- 分包A（management）：6个子页面（购物/订阅/冰箱/衣橱/房间/设置）

### 9.3 骨架屏

首页加载时显示骨架屏，提升感知性能：

```xml
<!-- pages/index/index.wxml -->
<view class="dashboard">
  <!-- 加载中显示骨架屏 -->
  <block wx:if="{{loading}}">
    <view class="skeleton-card" wx:for="{{3}}" wx:key="index">
      <view class="skeleton-title"></view>
      <view class="skeleton-text"></view>
      <view class="skeleton-text short"></view>
    </view>
  </block>

  <!-- 加载完成显示真实内容 -->
  <block wx:else>
    <view class="card" wx:for="{{todayTasks}}" wx:key="id">
      <!-- 真实内容 -->
    </view>
  </block>
</view>
```

```css
/* 骨架屏样式 */
.skeleton-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-md);
}

.skeleton-title {
  width: 60%;
  height: 36rpx;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-sm);
  margin-bottom: var(--spacing-sm);
}

.skeleton-text {
  width: 100%;
  height: 28rpx;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-sm);
  margin-bottom: var(--spacing-xs);
}

.skeleton-text.short {
  width: 40%;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

### 9.4 其他优化策略

| 优化策略 | 说明 | 实现方式 |
|---------|------|---------|
| **setData优化** | 减少不必要的渲染 | 合并多次 setData、精确路径更新 |
| **列表虚拟化** | 长列表不全部渲染 | 超过50条使用分页加载 |
| **图片优化** | 减少图片体积 | WebP格式、懒加载、CDN |
| **缓存策略** | 避免重复计算 | Service层内置内存缓存 |
| **节流防抖** | 防止频繁触发 | 搜索输入防抖300ms、滚动节流100ms |
| **预加载** | 提前加载下一页数据 | TabBar页面切换时预加载相邻页面 |

### 9.5 setData 优化示例

```javascript
// 错误：每次 setData 都触发完整 diff
this.setData({ 'list[0].completed': true })
this.setData({ 'list[0].completedAt': new Date() })
this.setData({ stats: newStats })

// 正确：合并为一次 setData
this.setData({
  'list[0].completed': true,
  'list[0].completedAt': new Date(),
  stats: newStats
})

// 进阶：只更新变化的部分，使用路径语法
this.setData({
  [`list[${index}].completed`]: true,
  [`list[${index}].completedAt`]: new Date()
})
```
