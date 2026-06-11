/**
 * AI生活助手服务
 * 基于关键词匹配 + 动态数据的智能建议引擎
 * 不依赖真实 API，未来可接入大模型
 */

var mockUtils = require('../utils/mock-utils')

var STORAGE_KEY = 'assistant_history'

/**
 * 动态获取用户数据
 * @returns {Object} 用户生活数据摘要
 */
function _getUserContext() {
  var today = new Date()
  var todayStr = mockUtils.formatDate(today)
  var ctx = {
    todayStr: todayStr,
    todoCount: 0,
    choreCount: 0,
    expiringFood: [],
    habitsTotal: 0,
    habitsTodayDone: 0,
    overdueBills: 0,
    pendingShopping: 0,
    petReminders: [],
    upcomingTrips: [],
    monthExpense: 0,
    monthBudget: 3000
  }

  try {
    // 任务
    var chores = mockUtils.getFromStorage('chores', [])
    ctx.choreCount = chores.filter(function(c) {
      return c.scheduledDate === todayStr && c.status !== 'completed'
    }).length

    // 冰箱临期
    var fridge = mockUtils.getFromStorage('fridge_items', [])
    ctx.expiringFood = fridge.filter(function(f) {
      if (!f.expiryDate) return false
      var diff = (new Date(f.expiryDate) - today) / 86400000
      return diff >= 0 && diff <= 3
    }).map(function(f) { return f.name }).slice(0, 5)

    // 习惯
    var habits = mockUtils.getFromStorage('habits', [])
    ctx.habitsTotal = habits.length
    ctx.habitsTodayDone = habits.filter(function(h) {
      return h.completedDates && h.completedDates.indexOf(todayStr) >= 0
    }).length

    // 账单
    var bills = mockUtils.getFromStorage('bills', [])
    ctx.overdueBills = bills.filter(function(b) {
      return !b.paid && b.dueDate && new Date(b.dueDate) < today
    }).length

    // 购物
    var shopping = mockUtils.getFromStorage('shopping_items', [])
    ctx.pendingShopping = shopping.filter(function(s) { return !s.purchased }).length

    // 宠物
    var petData = mockUtils.getFromStorage('pet_data', null)
    if (petData && petData.reminders) {
      ctx.petReminders = petData.reminders.filter(function(r) { return r.enabled })
    }

    // 旅行
    var trips = mockUtils.getFromStorage('travel_plans', [])
    ctx.upcomingTrips = trips.filter(function(p) { return p.status === 'planning' }).map(function(p) {
      var diff = Math.ceil((new Date(p.startDate) - today) / 86400000)
      return { title: p.title, daysUntil: diff > 0 ? diff : 0 }
    }).slice(0, 3)

    // 本月支出
    var expenses = mockUtils.getFromStorage('budget_records', [])
    var month = today.getMonth()
    ctx.monthExpense = expenses.filter(function(e) {
      return e.type === 'expense' && new Date(e.date).getMonth() === month
    }).reduce(function(s, e) { return s + (e.amount || 0) }, 0)
  } catch (e) {
    // 数据读取失败时使用默认值
  }

  return ctx
}

/**
 * 规则引擎：关键词匹配 + 动态数据整合
 */
var keywordRules = [
  {
    keywords: ['忙', '安排', '时间', '来不及'],
    module: '时间管理',
    getDynamicAnswer: function(ctx) {
      var lines = ['看起来你需要更好地管理时间呢！']
      if (ctx.choreCount > 0) {
        lines.push('\n📌 你今天还有 ' + ctx.choreCount + ' 项家务待完成')
      }
      if (ctx.habitsTotal > 0) {
        lines.push('✅ 今日习惯进度：' + ctx.habitsTodayDone + '/' + ctx.habitsTotal)
      }
      lines.push('\n💡 时间管理建议：')
      lines.push('1. 试试番茄工作法：专注25分钟，休息5分钟')
      lines.push('2. 每天早上花5分钟规划今日待办事项')
      lines.push('3. 把最重要的事情放在上午精力最好的时候做')
      lines.push('4. 学会说"不"，减少不必要的应酬')
      if (ctx.overdueBills > 0) {
        lines.push('\n⚠️ 别忘了处理 ' + ctx.overdueBills + ' 笔逾期账单哦！')
      }
      return lines.join('\n')
    },
    suggestions: ['查看今日待办', '设定一个番茄钟', '整理本周计划']
  },
  {
    keywords: ['冰箱', '做饭', '吃什么', '烹饪', '做菜', '下厨'],
    module: '菜谱推荐',
    getDynamicAnswer: function(ctx) {
      var lines = ['让我帮你看看冰箱里有什么：']
      if (ctx.expiringFood.length > 0) {
        lines.push('\n⚠️ 以下食材快过期了，优先使用：')
        ctx.expiringFood.forEach(function(name) {
          lines.push('  · ' + name)
        })
        lines.push('\n🍳 建议优先用这些食材做饭，避免浪费！')
      } else {
        lines.push('\n冰箱里的食材都挺新鲜的。')
      }
      lines.push('\n📋 简单推荐：')
      lines.push('1. 有鸡蛋和番茄？来一盘番茄炒蛋')
      lines.push('2. 有剩米饭？蛋炒饭最简单快手')
      lines.push('3. 有土豆？酸辣土豆丝开胃又下饭')
      lines.push('4. 想简单点？一碗热汤面也是好选择')
      lines.push('5. 不知道吃啥？试试可乐鸡翅')
      return lines.join('\n')
    },
    suggestions: ['查看冰箱食材', '看看推荐菜谱', '浏览快手菜']
  },
  {
    keywords: ['旅行', '带什么', '行李', '出行', '出差'],
    module: '旅行打包',
    getDynamicAnswer: function(ctx) {
      var lines = ['出行准备要注意这些：']
      if (ctx.upcomingTrips.length > 0) {
        lines.push('\n✈️ 你有即将到来的旅行：')
        ctx.upcomingTrips.forEach(function(t) {
          lines.push('  · ' + t.title + '（还有 ' + t.daysUntil + ' 天）')
        })
      }
      lines.push('\n🧳 行李清单参考：')
      lines.push('证件：身份证、护照、驾照（如需）')
      lines.push('电子：手机、充电宝、充电线、转换插头')
      lines.push('衣物：根据天气准备，别忘了睡衣和内衣')
      lines.push('洗漱：牙刷牙膏、毛巾、防晒霜')
      lines.push('药品：感冒药、创可贴、晕车药')
      lines.push('其他：雨伞、水杯、零食')
      return lines.join('\n')
    },
    suggestions: ['查看旅行计划', '生成行李清单', '查看目的地天气']
  },
  {
    keywords: ['宠物', '狗', '猫', '喂', '遛', '毛孩'],
    module: '宠物照顾',
    getDynamicAnswer: function(ctx) {
      var lines = ['毛孩子的照顾可不能马虎：']
      if (ctx.petReminders.length > 0) {
        lines.push('\n🐾 今日宠物待办：')
        ctx.petReminders.slice(0, 5).forEach(function(r) {
          lines.push('  · ' + (r.title || r.name))
        })
      }
      lines.push('\n💡 照顾小贴士：')
      lines.push('1. 定时定量喂食，成年宠物一般每天2顿')
      lines.push('2. 保证充足的饮用水，每天更换新鲜的水')
      lines.push('3. 每天至少遛狗30分钟，猫咪也需要互动')
      lines.push('4. 定期驱虫和疫苗接种很重要')
      lines.push('5. 注意观察食欲和精神状态的变化')
      return lines.join('\n')
    },
    suggestions: ['查看今日宠物提醒', '记录宠物日记', '查看宠物档案']
  },
  {
    keywords: ['省钱', '预算', '花销', '存钱', '理财', '花钱'],
    module: '理财建议',
    getDynamicAnswer: function(ctx) {
      var lines = ['理财从小事做起：']
      var budgetUsed = ctx.monthBudget > 0 ? Math.round(ctx.monthExpense / ctx.monthBudget * 100) : 0
      lines.push('\n💰 本月支出：¥' + ctx.monthExpense.toFixed(0) + '（预算的 ' + budgetUsed + '%）')
      if (budgetUsed > 80) {
        lines.push('⚠️ 本月预算已使用超过80%，注意控制开支！')
      } else if (budgetUsed > 50) {
        lines.push('📊 预算使用适中，继续保持。')
      } else {
        lines.push('✅ 预算使用良好，攒钱计划顺利！')
      }
      if (ctx.overdueBills > 0) {
        lines.push('\n⚠️ 你有 ' + ctx.overdueBills + ' 笔逾期账单，尽快处理！')
      }
      lines.push('\n💡 省钱技巧：')
      lines.push('1. 记账是第一步：了解钱花在哪里了')
      lines.push('2. 购物前列清单，避免冲动消费')
      lines.push('3. 自己做饭比外卖省一半以上')
      lines.push('4. 取消不用的订阅服务')
      return lines.join('\n')
    },
    suggestions: ['查看本月账单', '查看订阅服务', '设置预算目标']
  },
  {
    keywords: ['习惯', '打卡', '坚持', '养成'],
    module: '习惯养成',
    getDynamicAnswer: function(ctx) {
      var lines = ['养成好习惯需要方法和坚持：']
      if (ctx.habitsTotal > 0) {
        lines.push('\n📊 今日习惯进度：' + ctx.habitsTodayDone + '/' + ctx.habitsTotal)
        var rate = Math.round(ctx.habitsTodayDone / ctx.habitsTotal * 100)
        if (rate === 100) {
          lines.push('🎉 太棒了！今天的习惯全部完成！')
        } else if (rate >= 50) {
          lines.push('💪 进展不错，继续加油！')
        } else {
          lines.push('⏰ 还有几个习惯没完成，抓紧时间吧！')
        }
      }
      lines.push('\n💡 习惯养成技巧：')
      lines.push('1. 从小目标开始：比如先坚持喝水3天')
      lines.push('2. 绑定已有习惯：刷完牙就做5分钟拉伸')
      lines.push('3. 看到连续打卡天数会更有动力')
      lines.push('4. 允许偶尔中断，但不要连续中断两天')
      lines.push('\n坚持21天就能初步形成习惯，加油！')
      return lines.join('\n')
    },
    suggestions: ['查看习惯打卡', '添加新习惯', '查看连续打卡记录']
  },
  {
    keywords: ['家务', '清洁', '整理', '打扫'],
    module: '家务建议',
    getDynamicAnswer: function(ctx) {
      var lines = ['家务也可以很有条理：']
      if (ctx.choreCount > 0) {
        lines.push('\n📌 今天还有 ' + ctx.choreCount + ' 项家务待完成')
      }
      lines.push('\n💡 家务小技巧：')
      lines.push('1. 每天做一点不累：周一洗衣服，周二擦桌面...')
      lines.push('2. 用"一进一出"原则控制物品数量')
      lines.push('3. 随手整理，用完的东西立刻放回原处')
      lines.push('4. 做家务时听音乐或播客，心情更好')
      lines.push('5. 大扫除可以每季度来一次')
      return lines.join('\n')
    },
    suggestions: ['查看家务清单', '添加家务任务', '查看本周安排']
  },
  {
    keywords: ['购物', '买', '采购', '超市'],
    module: '购物建议',
    getDynamicAnswer: function(ctx) {
      var lines = ['聪明购物，把钱花在刀刃上：']
      if (ctx.pendingShopping > 0) {
        lines.push('\n🛒 你的购物清单还有 ' + ctx.pendingShopping + ' 项待购')
      }
      if (ctx.expiringFood.length > 0) {
        lines.push('\n🥬 冰箱有临期食材，暂时不需要买同类的了')
      }
      lines.push('\n💡 购物建议：')
      lines.push('1. 列好清单再去，只买需要的')
      lines.push('2. 大件商品多比较，不着急下单')
      lines.push('3. 生鲜食材按需购买，避免浪费')
      return lines.join('\n')
    },
    suggestions: ['查看购物清单', '查看需要补充的物品', '查看预算余额']
  },
  {
    keywords: ['账单', '缴费', '水电', '房租'],
    module: '账单管理',
    getDynamicAnswer: function(ctx) {
      var lines = ['账单管理要细心：']
      if (ctx.overdueBills > 0) {
        lines.push('\n🔴 你有 ' + ctx.overdueBills + ' 笔逾期账单，请尽快处理！')
      }
      lines.push('\n💡 账单管理建议：')
      lines.push('1. 设置自动扣款，避免遗忘')
      lines.push('2. 账单到期前3天设置提醒')
      lines.push('3. 每月初检查所有订阅和固定支出')
      lines.push('4. 保留付款凭证，以备查证')
      return lines.join('\n')
    },
    suggestions: ['查看账单列表', '查看未付账单', '查看本月支出']
  },
  {
    keywords: ['状态', '总结', '摘要', '报告', '今天', '怎么样'],
    module: '生活摘要',
    getDynamicAnswer: function(ctx) {
      var lines = ['📊 你的生活状态报告：']
      lines.push('')
      lines.push('📝 待做家务：' + ctx.choreCount + ' 项')
      lines.push('✅ 今日习惯：' + ctx.habitsTodayDone + '/' + ctx.habitsTotal)
      lines.push('🧊 临期食材：' + ctx.expiringFood.length + ' 件')
      lines.push('💳 逾期账单：' + ctx.overdueBills + ' 笔')
      lines.push('🛒 待购商品：' + ctx.pendingShopping + ' 项')
      lines.push('💰 本月支出：¥' + ctx.monthExpense.toFixed(0))

      if (ctx.upcomingTrips.length > 0) {
        lines.push('\n✈️ 即将到来的旅行：')
        ctx.upcomingTrips.forEach(function(t) {
          lines.push('  · ' + t.title + '（' + t.daysUntil + ' 天后）')
        })
      }

      // 综合评分
      var score = 100
      if (ctx.overdueBills > 0) score -= ctx.overdueBills * 10
      if (ctx.expiringFood.length > 0) score -= 5
      var habitRate = ctx.habitsTotal > 0 ? ctx.habitsTodayDone / ctx.habitsTotal : 1
      score -= Math.round((1 - habitRate) * 20)
      score = Math.max(0, Math.min(100, score))

      lines.push('\n🏆 今日生活管理评分：' + score + ' 分')
      if (score >= 80) lines.push('状态很棒！继续保持！')
      else if (score >= 60) lines.push('还不错，再加把劲！')
      else lines.push('有些方面需要关注，加油！')

      return lines.join('\n')
    },
    suggestions: ['查看详细报告', '查看习惯打卡', '查看账单']
  }
]

var defaultRule = {
  module: '通用建议',
  answer: '你好！我是你的 AI 生活助手 🤖\n\n你可以问我这些：\n\n🍽️ "今天吃什么" - 根据冰箱食材推荐菜谱\n⏰ "太忙了" - 时间管理建议\n🧳 "出门带什么" - 行李清单参考\n🐾 "宠物今天做什么" - 宠物照顾提醒\n💰 "怎么省钱" - 理财小技巧\n✅ "养成好习惯" - 习惯养成建议\n🧹 "做家务" - 家务整理建议\n📊 "今天怎么样" - 生活状态摘要\n💳 "账单" - 账单管理建议\n🛒 "购物" - 购物建议\n\n有什么想问的，尽管说吧！',
  suggestions: ['今天吃什么', '帮我安排时间', '今天怎么样', '出门要带什么', '怎么省钱']
}

/**
 * 向AI助手提问
 * @param {string} question - 用户问题
 * @returns {Promise<{answer: string, suggestions: Array, relatedModule: string}>}
 */
function ask(question) {
  var q = question || ''

  // 获取用户上下文数据
  var ctx = _getUserContext()

  var matchedRule = null
  for (var i = 0; i < keywordRules.length; i++) {
    var rule = keywordRules[i]
    var hasMatch = rule.keywords.some(function(kw) {
      return q.indexOf(kw) > -1
    })
    if (hasMatch) {
      matchedRule = rule
      break
    }
  }

  var result
  if (matchedRule) {
    // 使用动态数据生成回答
    var answer = matchedRule.getDynamicAnswer
      ? matchedRule.getDynamicAnswer(ctx)
      : matchedRule.answer
    result = {
      answer: answer,
      suggestions: matchedRule.suggestions,
      relatedModule: matchedRule.module
    }
  } else {
    result = {
      answer: defaultRule.answer,
      suggestions: defaultRule.suggestions,
      relatedModule: defaultRule.module
    }
  }

  // 记录对话历史
  try {
    var history = mockUtils.getFromStorage(STORAGE_KEY, [])
    history.push({
      id: mockUtils.generateId(),
      question: question,
      answer: result.answer,
      relatedModule: result.relatedModule,
      timestamp: mockUtils.formatDateTime(new Date())
    })
    if (history.length > 50) {
      history = history.slice(history.length - 50)
    }
    mockUtils.setToStorage(STORAGE_KEY, history)
  } catch (e) {
    // 历史记录失败不影响主功能
  }

  return mockUtils.mockAsync(result)
}

module.exports = {
  ask: ask
}
