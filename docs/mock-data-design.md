# Mock 数据设计文档

> AI 生活管家 - 微信小程序
> 版本：v1.0
> 更新日期：2026-06-09

---

## 一、设计原则

### 1.1 核心原则

| 原则 | 说明 | 示例 |
|------|------|------|
| **真实自然** | 所有数据贴近真实生活场景，不使用 test/demo/test123 等占位符 | 人名使用"小明"、"小红"而非"user1"、"user2" |
| **日期合理** | 所有日期围绕 2026 年 6 月当前时间线分布，过去和未来合理分配 | 创建日期在 2026 年 3-5 月，截止日期在 6-7 月 |
| **金额合理** | 金额在正常消费范围内，不出现离谱数值 | 餐饮单笔 15-80 元，月消费 2000-6000 元 |
| **中文命名** | 所有名称、备注、描述使用中文，符合微信小程序用户习惯 | "去超市买牛奶"而非"Buy milk at supermarket" |
| **数据关联** | 跨模块数据保持逻辑一致，如冰箱临期食材出现在购物清单中 | 冰箱中的"牛奶"临期 → 购物清单中出现"牛奶 x2" |
| **分布合理** | 状态分布符合真实比例，不全是已完成或全未完成 | 家务任务中 60% 已完成、20% 进行中、20% 待处理 |

### 1.2 数据生成策略

- 每个模块独立生成 Mock 数据，通过 ID 建立跨模块引用
- 使用确定性种子（seed）生成，确保每次初始化结果一致
- 日期从当前日期往前推算，确保数据的时间线合理
- 金额使用浮点数并保留两位小数

---

## 二、数据模型定义

### 2.1 家务任务（Chore）

```javascript
{
  id: String,            // 唯一标识，格式 "chore_001"
  title: String,         // 任务名称，如 "拖地"、"洗碗"
  room: String,          // 所属房间，枚举：客厅/卧室/厨房/卫生间/阳台/书房
  assignee: String,      // 负责人，如 "小明"、"小红"
  frequency: String,     // 执行频率，枚举：每天/每周/每两周/每月
  points: Number,        // 完成积分，范围 5-30
  status: String,        // 状态，枚举：pending/in_progress/completed
  dueDate: String,       // 截止日期，格式 "YYYY-MM-DD"
  completedAt: String,   // 完成时间，格式 "YYYY-MM-DD HH:mm"，未完成为 null
  repeat: Boolean,       // 是否循环任务
  createdAt: String      // 创建时间，ISO 格式
}
```

**字段说明：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | String | 是 | 全局唯一，Mock 中使用 "chore_XXX" 格式 |
| title | String | 是 | 家务名称，8个字以内 |
| room | String | 是 | 房间类型，6种枚举值 |
| assignee | String | 是 | 成员名称 |
| frequency | String | 是 | 执行频率，4种枚举值 |
| points | Number | 是 | 积分值，5的倍数 |
| status | String | 是 | 当前状态 |
| dueDate | String | 是 | ISO日期格式 |
| completedAt | String | 否 | 完成时间戳 |
| repeat | Boolean | 是 | 是否自动重复 |
| createdAt | String | 是 | ISO时间戳 |

### 2.2 生活清单（Checklist）

```javascript
{
  id: String,            // 唯一标识，格式 "checklist_001"
  name: String,          // 清单名称，如 "搬家清单"、"旅行准备"
  category: String,      // 分类，枚举：日常/工作/旅行/搬家/学习/其他
  templateType: String,  // 模板类型，null 表示自定义创建
  deadline: String,      // 截止日期，格式 "YYYY-MM-DD"
  items: [               // 清单项目列表
    {
      id: String,        // 项目ID，格式 "item_001"
      text: String,      // 项目内容
      checked: Boolean,  // 是否已完成
      completedAt: String // 完成时间
    }
  ],
  createdAt: String,     // 创建时间
  updatedAt: String      // 最后更新时间
}
```

**字段说明：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | String | 是 | 全局唯一 |
| name | String | 是 | 清单标题，20字以内 |
| category | String | 是 | 6种分类枚举 |
| templateType | String | 否 | 从模板创建时填入模板名 |
| deadline | String | 否 | 可选截止日期 |
| items | Array | 是 | 至少1项，最多50项 |
| items[].text | String | 是 | 单项描述 |
| items[].checked | Boolean | 是 | 完成状态 |

### 2.3 购物项（ShoppingItem）

```javascript
{
  id: String,            // 唯一标识，格式 "shop_001"
  name: String,          // 商品名称，如 "牛奶"、"洗洁精"
  category: String,      // 分类，枚举：食品/生鲜/日用品/零食/饮品/调味品/其他
  quantity: Number,      // 数量
  unit: String,          // 单位，如 "盒"、"瓶"、"袋"
  estimatedPrice: Number,// 预计单价（元）
  brand: String,         // 品牌，可选
  checked: Boolean,      // 是否已购买
  purchasedAt: String,   // 购买时间
  note: String,          // 备注
  linkedFridgeId: String,// 关联冰箱食材ID，用于联动
  createdAt: String      // 创建时间
}
```

**字段说明：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | String | 是 | 全局唯一 |
| name | String | 是 | 商品名称 |
| category | String | 是 | 7种分类枚举 |
| quantity | Number | 是 | 正整数 |
| unit | String | 是 | 计量单位 |
| estimatedPrice | Number | 是 | 单位元，保留两位小数 |
| brand | String | 否 | 品牌名称 |
| checked | Boolean | 是 | 购买状态 |
| linkedFridgeId | String | 否 | 关联冰箱食材 |

### 2.4 订阅服务（Subscription）

```javascript
{
  id: String,            // 唯一标识，格式 "sub_001"
  name: String,          // 服务名称，如 "Spotify"、"爱奇艺VIP"
  category: String,      // 分类，枚举：娱乐/工具/学习/云存储/社交/其他
  price: Number,         // 单次费用（元）
  billingCycle: String,  // 计费周期，枚举：monthly/quarterly/yearly
  currency: String,      // 货币，默认 "CNY"
  nextBillingDate: String,// 下次续费日期
  startDate: String,     // 开始订阅日期
  autoRenew: Boolean,    // 是否自动续费
  status: String,        // 状态，枚举：active/paused/cancelled
  icon: String,          // 图标 emoji
  note: String           // 备注
}
```

**字段说明：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | String | 是 | 全局唯一 |
| name | String | 是 | 订阅名称 |
| category | String | 是 | 6种分类 |
| price | Number | 是 | 单位元 |
| billingCycle | String | 是 | 3种周期 |
| nextBillingDate | String | 是 | ISO日期 |
| autoRenew | Boolean | 是 | 自动续费标记 |
| status | String | 是 | 3种状态 |
| icon | String | 是 | 表情符号 |

### 2.5 账本记录（FinanceRecord）

```javascript
{
  id: String,            // 唯一标识，格式 "fin_001"
  type: String,          // 类型，枚举：expense/income
  amount: Number,        // 金额（元），保留两位小数
  category: String,      // 分类
  subCategory: String,   // 子分类，可选
  date: String,          // 日期，格式 "YYYY-MM-DD"
  time: String,          // 时间，格式 "HH:mm"
  note: String,          // 备注说明
  paymentMethod: String, // 支付方式，枚举：微信/支付宝/现金/银行卡
  isRecurring: Boolean,  // 是否定期支出
  linkedSubscriptionId: String // 关联订阅ID，可选
}
```

**字段说明：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | String | 是 | 全局唯一 |
| type | String | 是 | 收入或支出 |
| amount | Number | 是 | 金额，>0 |
| category | String | 是 | 消费/收入分类 |
| date | String | 是 | ISO日期 |
| note | String | 是 | 交易描述 |
| paymentMethod | String | 是 | 4种支付方式 |
| linkedSubscriptionId | String | 否 | 关联订阅 |

**消费分类枚举：** 餐饮、交通、购物、娱乐、居住、医疗、教育、通讯、服饰、其他
**收入分类枚举：** 工资、奖金、兼职、红包、理财、退款、其他

### 2.6 冰箱食材（FridgeItem）

```javascript
{
  id: String,            // 唯一标识，格式 "food_001"
  name: String,          // 食材名称，如 "牛奶"、"鸡胸肉"
  category: String,      // 分类，枚举：肉类/蔬菜/水果/乳制品/主食/调味品/饮品/零食/冷冻食品
  quantity: Number,      // 数量
  unit: String,          // 单位，如 "盒"、"斤"、"个"
  storageLocation: String,// 存放位置，枚举：冷藏室/冷冻室/保鲜层/门架
  expiryDate: String,    // 保质期截止日
  addedDate: String,     // 入库日期
  status: String,        // 状态，枚举：fresh/expiring/expired/used/discarded
  icon: String,          // 图标 emoji
  brand: String,         // 品牌，可选
  note: String           // 备注
}
```

**字段说明：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | String | 是 | 全局唯一 |
| name | String | 是 | 食材名称 |
| category | String | 是 | 9种分类 |
| quantity | Number | 是 | 正数 |
| storageLocation | String | 是 | 4种位置 |
| expiryDate | String | 是 | ISO日期 |
| status | String | 是 | 5种状态，由系统根据日期自动判断 |
| icon | String | 是 | 表情符号 |

### 2.7 衣橱衣物（WardrobeItem）

```javascript
{
  id: String,            // 唯一标识，格式 "cloth_001"
  name: String,          // 衣物名称，如 "白色T恤"、"黑色牛仔裤"
  type: String,          // 类型，枚举：上衣/裤子/裙子/外套/内衣/鞋子/配饰
  color: String,         // 颜色
  season: String,        // 适用季节，枚举：春季/夏季/秋季/冬季/四季通用
  occasion: String,      // 场合，枚举：日常/运动/正式/居家
  wearCount: Number,     // 穿着次数
  maxWearBeforeWash: Number, // 穿几次需要洗
  laundryStatus: String, // 洗衣状态，枚举：clean/worn/dirty/in_laundry
  lastWornDate: String,  // 上次穿着日期
  storedLocation: String,// 存放位置
  imageUrl: String,      // 图片URL，可选
  addedDate: String      // 入库日期
}
```

**字段说明：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | String | 是 | 全局唯一 |
| name | String | 是 | 衣物名称 |
| type | String | 是 | 7种类型 |
| color | String | 是 | 颜色描述 |
| season | String | 是 | 5种季节 |
| wearCount | Number | 是 | 累计穿着次数 |
| laundryStatus | String | 是 | 4种状态 |

### 2.8 房间区域与任务（RoomArea / RoomTask）

**RoomArea：**
```javascript
{
  id: String,            // 唯一标识，格式 "area_001"
  name: String,          // 区域名称，如 "书桌"、"衣柜"
  room: String,          // 所属房间
  icon: String,          // 图标 emoji
  totalTasks: Number,    // 总任务数
  completedTasks: Number,// 已完成任务数
  lastCleanDate: String, // 上次整理日期
  priority: Number       // 优先级 1-5
}
```

**RoomTask：**
```javascript
{
  id: String,            // 唯一标识，格式 "rtask_001"
  title: String,         // 任务名称
  areaId: String,        // 所属区域ID
  areaName: String,      // 所属区域名称（冗余，方便展示）
  status: String,        // 状态，枚举：pending/in_progress/completed
  priority: String,      // 优先级，枚举：high/medium/low
  dueDate: String,       // 截止日期
  completedAt: String,   // 完成时间
  icon: String,          // 图标 emoji
  note: String           // 备注
}
```

### 2.9 成员（Member）

```javascript
{
  id: String,            // 唯一标识，格式 "member_001"
  name: String,          // 成员名称
  avatar: String,        // 头像 emoji
  totalScore: Number,    // 总积分
  weeklyScore: Number,   // 本周积分
  completedTasks: Number,// 已完成任务数
  joinDate: String       // 加入日期
}
```

---

## 三、各模块数据量

| 模块 | 实体 | 数据量 | Storage Key | 说明 |
|------|------|--------|-------------|------|
| 家务分工 | Chore | 50 条 | `housework_tasks` | 覆盖6个房间，3-4个成员 |
| 生活清单 | Checklist | 30 条 | `checklist_lists` | 含模板清单和自定义清单 |
| 购物清单 | ShoppingItem | 80 条 | `shopping_items` | 含已购和未购 |
| 订阅管理 | Subscription | 20 条 | `subscription_items` | 含活跃/暂停/已取消 |
| 生活账本 | FinanceRecord | 100 条 | `finance_records` | 近3个月收支记录 |
| 冰箱食材 | FridgeItem | 60 条 | `fridge_items` | 含新鲜/临期/过期 |
| 衣橱衣物 | WardrobeItem | 40 条 | `wardrobe_items` | 含不同季节和状态 |
| 房间整理 | RoomArea + RoomTask | 8 + 30 条 | `room_areas` / `room_tasks` | 8个区域，30个任务 |
| 成员 | Member | 4 条 | `housework_members` | 家庭/室友成员 |

**数据量设计说明：**

- **50条家务任务**：覆盖客厅12条、卧室10条、厨房12条、卫生间8条、阳台4条、书房4条
- **30条清单**：6个模板清单（搬家/出差/旅行/考试/采购/年终总结）+ 24个用户清单
- **80条购物项**：食品类30条、日用品20条、生鲜类15条、其他15条，其中已购买约40条
- **100条账本记录**：支出80条 + 收入20条，覆盖近3个月，每月约33条
- **60条食材**：新鲜食材35条、临期食材15条、过期食材10条
- **40条衣物**：上衣12条、裤子8条、外套6条、裙子4条、鞋子5条、内衣3条、配饰2条

---

## 四、数据存储方案

### 4.1 wx.storage Key 对照表

| Storage Key | 数据类型 | 数据格式 | 预估大小 | 所属模块 |
|-------------|---------|---------|---------|---------|
| `housework_tasks` | Array<Chore> | JSON 数组 | ~15KB | 家务分工 |
| `housework_members` | Array<Member> | JSON 数组 | ~2KB | 家务分工 |
| `checklist_lists` | Array<Checklist> | JSON 数组 | ~20KB | 生活清单 |
| `shopping_items` | Array<ShoppingItem> | JSON 数组 | ~18KB | 购物清单 |
| `subscription_items` | Array<Subscription> | JSON 数组 | ~5KB | 订阅管理 |
| `finance_records` | Array<FinanceRecord> | JSON 数组 | ~25KB | 生活账本 |
| `finance_budget` | Object | JSON 对象 | ~1KB | 生活账本 |
| `fridge_items` | Array<FridgeItem> | JSON 数组 | ~12KB | 冰箱食材 |
| `wardrobe_items` | Array<WardrobeItem> | JSON 数组 | ~10KB | 衣橱衣物 |
| `room_areas` | Array<RoomArea> | JSON 数组 | ~3KB | 房间整理 |
| `room_tasks` | Array<RoomTask> | JSON 数组 | ~8KB | 房间整理 |
| `app_theme` | String | "light"/"dark" | ~1B | 设置 |
| `app_version` | String | 版本号 | ~5B | 设置 |
| `mock_initialized` | Boolean | true/false | ~5B | 系统 |

**总预估大小：约 119KB**（远低于 wx.storage 10MB 上限）

### 4.2 存储读写封装

```javascript
// utils/storage.js 中统一使用以下接口

// 读取
storage.get('housework_tasks')   // 返回 Array 或 null

// 写入
storage.set('housework_tasks', tasksArray)

// 删除
storage.remove('housework_tasks')

// 清空全部（设置页面使用）
storage.clear()
```

---

## 五、数据初始化策略

### 5.1 初始化流程

```
小程序启动 (app.js onLaunch)
        |
        v
检查 mock_initialized 标志
        |
        +-- 已初始化 (true) --> 跳过，直接进入首页
        |
        +-- 未初始化 (undefined/false)
                |
                v
        调用 mock/index.js 的 initAllMockData()
                |
                v
        依次初始化各模块 Mock 数据
                +-- initHouseworkData()      --> 写入 housework_tasks, housework_members
                +-- initChecklistData()      --> 写入 checklist_lists
                +-- initShoppingData()       --> 写入 shopping_items
                +-- initSubscriptionData()   --> 写入 subscription_items
                +-- initFinanceData()        --> 写入 finance_records, finance_budget
                +-- initFridgeData()         --> 写入 fridge_items
                +-- initWardrobeData()       --> 写入 wardrobe_items
                +-- initRoomData()           --> 写入 room_areas, room_tasks
                |
                v
        设置 mock_initialized = true
                |
                v
        进入首页
```

### 5.2 初始化代码示例

```javascript
// mock/index.js

const houseworkMock = require('./housework.mock')
const checklistMock = require('./checklist.mock')
const shoppingMock = require('./shopping.mock')
const subscriptionMock = require('./subscription.mock')
const financeMock = require('./finance.mock')
const fridgeMock = require('./fridge.mock')
const wardrobeMock = require('./wardrobe.mock')
const roomMock = require('./room.mock')
const storage = require('../utils/storage')

const INIT_KEY = 'mock_initialized'

module.exports = {
  /**
   * 初始化所有 Mock 数据
   * 仅在首次启动时执行
   */
  initAllMockData() {
    if (storage.get(INIT_KEY)) {
      console.log('[Mock] 数据已初始化，跳过')
      return
    }

    console.log('[Mock] 开始初始化数据...')

    try {
      // 初始化各模块数据
      houseworkMock.init()
      checklistMock.init()
      shoppingMock.init()
      subscriptionMock.init()
      financeMock.init()
      fridgeMock.init()
      wardrobeMock.init()
      roomMock.init()

      // 标记初始化完成
      storage.set(INIT_KEY, true)
      console.log('[Mock] 数据初始化完成')
    } catch (e) {
      console.error('[Mock] 数据初始化失败:', e)
    }
  },

  /**
   * 重置所有 Mock 数据（开发调试用）
   */
  resetAllData() {
    storage.clear()
    console.log('[Mock] 数据已清除，下次启动将重新初始化')
  }
}
```

### 5.3 app.js 中的调用

```javascript
// app.js
const mock = require('./mock/index')

App({
  onLaunch() {
    // 初始化 Mock 数据
    mock.initAllMockData()

    // 初始化主题
    const theme = require('./utils/theme')
    theme.init()
  }
})
```

---

## 六、数据更新流程

### 6.1 标准 CRUD 流程

**创建（Create）：**
```
用户操作（点击添加按钮）
        |
        v
Page 接收表单数据
        |
        v
调用 Service.createItem(data)
        |
        v
Service 内部:
  1. storage.get(key) 获取列表
  2. 生成新项（带ID和时间戳）
  3. unshift 追加到列表头部
  4. storage.set(key, list) 写回
  5. return Promise.resolve(newItem)
        |
        v
Page.setData 更新视图
```

**读取（Read）：**
```
页面 onLoad / onShow
        |
        v
调用 Service.getAllItems()
        |
        v
Service 内部:
  1. storage.get(key) 获取列表
  2. 如果为空，调用 Mock 生成初始数据
  3. return Promise.resolve(list)
        |
        v
Page.setData 渲染列表
```

**更新（Update）：**
```
用户操作（编辑后点击保存）
        |
        v
调用 Service.updateItem(id, updates)
        |
        v
Service 内部:
  1. storage.get(key) 获取列表
  2. findIndex 找到目标项
  3. 合并更新字段: { ...old, ...updates }
  4. storage.set(key, list) 写回
  5. return Promise.resolve(updatedItem)
        |
        v
Page.setData 更新视图
```

**删除（Delete）：**
```
用户操作（左滑点击删除）
        |
        v
弹出确认弹窗
        |
        v（确认后）
调用 Service.deleteItem(id)
        |
        v
Service 内部:
  1. storage.get(key) 获取列表
  2. filter 过滤掉目标项
  3. storage.set(key, filteredList) 写回
  4. return Promise.resolve(true)
        |
        v
Page.setData 更新视图
```

### 6.2 跨模块数据联动更新

当一个模块的数据变化可能影响另一个模块时，通过 Service 层协调：

```
示例：冰箱食材标记为"已过期" -> 购物清单自动添加

fridgeService.markAsExpired(foodId)
        |
        v
更新 fridge_items 中该食材状态为 'expired'
        |
        v
检查是否有 linkedShoppingId
        |
        +-- 无 --> shoppingService.addItem({
        |           name: food.name,
        |           category: food.category,
        |           quantity: food.quantity,
        |           unit: food.unit,
        |           linkedFridgeId: food.id
        |         })
        |
        +-- 有 --> 跳过（已关联，不重复添加）
```

---

## 七、示例数据

### 7.1 家务任务示例

```json
[
  {
    "id": "chore_001",
    "title": "拖地",
    "room": "客厅",
    "assignee": "小明",
    "frequency": "每周",
    "points": 15,
    "status": "completed",
    "dueDate": "2026-06-08",
    "completedAt": "2026-06-08 14:30",
    "repeat": true,
    "createdAt": "2026-05-01T10:00:00"
  },
  {
    "id": "chore_002",
    "title": "洗碗",
    "room": "厨房",
    "assignee": "小红",
    "frequency": "每天",
    "points": 10,
    "status": "pending",
    "dueDate": "2026-06-09",
    "completedAt": null,
    "repeat": true,
    "createdAt": "2026-05-01T10:00:00"
  },
  {
    "id": "chore_003",
    "title": "清理猫砂盆",
    "room": "阳台",
    "assignee": "小明",
    "frequency": "每天",
    "points": 10,
    "status": "in_progress",
    "dueDate": "2026-06-09",
    "completedAt": null,
    "repeat": true,
    "createdAt": "2026-05-15T10:00:00"
  }
]
```

### 7.2 清单示例

```json
[
  {
    "id": "checklist_001",
    "name": "端午节出游准备",
    "category": "旅行",
    "templateType": null,
    "deadline": "2026-06-14",
    "items": [
      { "id": "item_001", "text": "订酒店", "checked": true, "completedAt": "2026-06-05" },
      { "id": "item_002", "text": "买防晒霜", "checked": true, "completedAt": "2026-06-06" },
      { "id": "item_003", "text": "准备充电宝", "checked": false, "completedAt": null },
      { "id": "item_004", "text": "查天气预报", "checked": false, "completedAt": null },
      { "id": "item_005", "text": "打印行程单", "checked": false, "completedAt": null }
    ],
    "createdAt": "2026-06-03T09:00:00",
    "updatedAt": "2026-06-06T15:30:00"
  },
  {
    "id": "checklist_002",
    "name": "618购物节囤货",
    "category": "日常",
    "templateType": null,
    "deadline": "2026-06-18",
    "items": [
      { "id": "item_006", "text": "卫生纸 x3提", "checked": false, "completedAt": null },
      { "id": "item_007", "text": "洗衣液补充装", "checked": false, "completedAt": null },
      { "id": "item_008", "text": "猫粮 10kg", "checked": true, "completedAt": "2026-06-07" }
    ],
    "createdAt": "2026-06-01T20:00:00",
    "updatedAt": "2026-06-07T19:00:00"
  }
]
```

### 7.3 购物项示例

```json
[
  {
    "id": "shop_001",
    "name": "鸡蛋",
    "category": "生鲜",
    "quantity": 1,
    "unit": "盒",
    "estimatedPrice": 15.90,
    "brand": "正大",
    "checked": false,
    "purchasedAt": null,
    "note": "30枚装",
    "linkedFridgeId": null,
    "createdAt": "2026-06-08T10:00:00"
  },
  {
    "id": "shop_002",
    "name": "洗洁精",
    "category": "日用品",
    "quantity": 2,
    "unit": "瓶",
    "estimatedPrice": 12.50,
    "brand": "立白",
    "checked": true,
    "purchasedAt": "2026-06-07T16:30:00",
    "note": null,
    "linkedFridgeId": null,
    "createdAt": "2026-06-05T09:00:00"
  },
  {
    "id": "shop_003",
    "name": "牛奶",
    "category": "饮品",
    "quantity": 2,
    "unit": "盒",
    "estimatedPrice": 8.90,
    "brand": "蒙牛",
    "checked": false,
    "purchasedAt": null,
    "note": "冰箱快没了",
    "linkedFridgeId": "food_003",
    "createdAt": "2026-06-09T08:00:00"
  }
]
```

### 7.4 订阅服务示例

```json
[
  {
    "id": "sub_001",
    "name": "Spotify Premium",
    "category": "娱乐",
    "price": 15.00,
    "billingCycle": "monthly",
    "currency": "CNY",
    "nextBillingDate": "2026-06-15",
    "startDate": "2025-01-15",
    "autoRenew": true,
    "status": "active",
    "icon": "🎵",
    "note": "学生优惠"
  },
  {
    "id": "sub_002",
    "name": "iCloud 200GB",
    "category": "云存储",
    "price": 21.00,
    "billingCycle": "monthly",
    "currency": "CNY",
    "nextBillingDate": "2026-06-20",
    "startDate": "2024-08-20",
    "autoRenew": true,
    "status": "active",
    "icon": "☁️",
    "note": null
  },
  {
    "id": "sub_003",
    "name": "爱奇艺VIP",
    "category": "娱乐",
    "price": 218.00,
    "billingCycle": "yearly",
    "currency": "CNY",
    "nextBillingDate": "2026-12-01",
    "startDate": "2024-12-01",
    "autoRenew": false,
    "status": "active",
    "icon": "📺",
    "note": "年费"
  }
]
```

### 7.5 账本记录示例

```json
[
  {
    "id": "fin_001",
    "type": "expense",
    "amount": 32.00,
    "category": "餐饮",
    "subCategory": "午餐",
    "date": "2026-06-09",
    "time": "12:15",
    "note": "公司楼下黄焖鸡",
    "paymentMethod": "微信",
    "isRecurring": false,
    "linkedSubscriptionId": null
  },
  {
    "id": "fin_002",
    "type": "expense",
    "amount": 6.00,
    "category": "交通",
    "subCategory": "地铁",
    "date": "2026-06-09",
    "time": "08:30",
    "note": "地铁通勤",
    "paymentMethod": "微信",
    "isRecurring": true,
    "linkedSubscriptionId": null
  },
  {
    "id": "fin_003",
    "type": "income",
    "amount": 12000.00,
    "category": "工资",
    "subCategory": null,
    "date": "2026-06-05",
    "time": "10:00",
    "note": "6月工资",
    "paymentMethod": "银行卡",
    "isRecurring": true,
    "linkedSubscriptionId": null
  },
  {
    "id": "fin_004",
    "type": "expense",
    "amount": 599.00,
    "category": "购物",
    "subCategory": "数码配件",
    "date": "2026-06-08",
    "time": "20:30",
    "note": "AirPods保护壳 + 清洁套装",
    "paymentMethod": "支付宝",
    "isRecurring": false,
    "linkedSubscriptionId": null
  }
]
```

### 7.6 冰箱食材示例

```json
[
  {
    "id": "food_001",
    "name": "鸡胸肉",
    "category": "肉类",
    "quantity": 2,
    "unit": "块",
    "storageLocation": "冷冻室",
    "expiryDate": "2026-07-15",
    "addedDate": "2026-06-01",
    "status": "fresh",
    "icon": "🍗",
    "brand": null,
    "note": "健身餐用"
  },
  {
    "id": "food_002",
    "name": "酸奶",
    "category": "乳制品",
    "quantity": 4,
    "unit": "杯",
    "storageLocation": "冷藏室",
    "expiryDate": "2026-06-11",
    "addedDate": "2026-06-05",
    "status": "expiring",
    "icon": "🥛",
    "brand": "光明",
    "note": "快过期了，优先喝掉"
  },
  {
    "id": "food_003",
    "name": "西蓝花",
    "category": "蔬菜",
    "quantity": 1,
    "unit": "颗",
    "storageLocation": "保鲜层",
    "expiryDate": "2026-06-08",
    "addedDate": "2026-06-05",
    "status": "expired",
    "icon": "🥦",
    "brand": null,
    "note": "已变色，需要丢弃"
  }
]
```

### 7.7 衣橱衣物示例

```json
[
  {
    "id": "cloth_001",
    "name": "白色纯棉T恤",
    "type": "上衣",
    "color": "白色",
    "season": "夏季",
    "occasion": "日常",
    "wearCount": 8,
    "maxWearBeforeWash": 1,
    "laundryStatus": "clean",
    "lastWornDate": "2026-06-06",
    "storedLocation": "衣柜上层",
    "imageUrl": null,
    "addedDate": "2026-04-15"
  },
  {
    "id": "cloth_002",
    "name": "黑色牛仔裤",
    "type": "裤子",
    "color": "黑色",
    "season": "四季通用",
    "occasion": "日常",
    "wearCount": 25,
    "maxWearBeforeWash": 3,
    "laundryStatus": "dirty",
    "lastWornDate": "2026-06-07",
    "storedLocation": "脏衣篮",
    "imageUrl": null,
    "addedDate": "2025-11-20"
  }
]
```

### 7.8 房间区域与任务示例

**区域示例：**
```json
[
  {
    "id": "area_001",
    "name": "书桌",
    "room": "书房",
    "icon": "📚",
    "totalTasks": 5,
    "completedTasks": 2,
    "lastCleanDate": "2026-06-01",
    "priority": 2
  },
  {
    "id": "area_002",
    "name": "衣柜",
    "room": "卧室",
    "icon": "👔",
    "totalTasks": 4,
    "completedTasks": 1,
    "lastCleanDate": "2026-05-20",
    "priority": 3
  }
]
```

**任务示例：**
```json
[
  {
    "id": "rtask_001",
    "title": "整理书桌上的文件",
    "areaId": "area_001",
    "areaName": "书桌",
    "status": "pending",
    "priority": "high",
    "dueDate": "2026-06-10",
    "completedAt": null,
    "icon": "📄",
    "note": "把上个月的资料归档"
  },
  {
    "id": "rtask_002",
    "title": "换季衣物整理",
    "areaId": "area_002",
    "areaName": "衣柜",
    "status": "completed",
    "priority": "medium",
    "dueDate": "2026-06-05",
    "completedAt": "2026-06-04 16:00",
    "icon": "👗",
    "note": "冬装收纳，夏装挂出"
  }
]
```

### 7.9 成员示例

```json
[
  {
    "id": "member_001",
    "name": "小明",
    "avatar": "👨",
    "totalScore": 285,
    "weeklyScore": 45,
    "completedTasks": 28,
    "joinDate": "2026-01-01"
  },
  {
    "id": "member_002",
    "name": "小红",
    "avatar": "👩",
    "totalScore": 310,
    "weeklyScore": 60,
    "completedTasks": 32,
    "joinDate": "2026-01-01"
  },
  {
    "id": "member_003",
    "name": "阿杰",
    "avatar": "🧑",
    "totalScore": 195,
    "weeklyScore": 30,
    "completedTasks": 20,
    "joinDate": "2026-03-01"
  },
  {
    "id": "member_004",
    "name": "小美",
    "avatar": "👧",
    "totalScore": 150,
    "weeklyScore": 20,
    "completedTasks": 15,
    "joinDate": "2026-03-01"
  }
]
```
