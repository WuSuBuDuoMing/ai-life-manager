/**
 * @module services/recipe-service
 * @description 菜谱速查服务
 * 提供菜谱浏览、搜索、收藏、食材推荐等功能，包括：
 * - 20道菜谱（早餐5、正餐5、甜品3、咖啡3、饮品4）
 * - 按分类筛选（早餐/正餐/甜品/咖啡/饮品）
 * - 关键词搜索（名称/标签/食材）
 * - 收藏功能
 * - 根据冰箱食材智能推荐菜谱
 */

var mockUtils = require('../utils/mock-utils')

var STORAGE_KEY = 'recipes'

function generateMockRecipes() {
  return [
    // 早餐 5道
    { id: 'recipe_01', name: '牛奶麦片', icon: '🥛', category: '早餐', difficulty: 'easy', time: '5分钟', servings: 1, ingredients: ['牛奶250ml', '即食燕麦片50g', '蜂蜜适量'], steps: ['将牛奶倒入碗中', '加入燕麦片搅拌均匀', '静置2分钟，淋上蜂蜜即可'], tips: '可以用温牛奶口感更好', tags: ['快手', '低脂'], favorited: false },
    { id: 'recipe_02', name: '三明治', icon: '🥪', category: '早餐', difficulty: 'easy', time: '10分钟', servings: 1, ingredients: ['吐司2片', '鸡蛋1个', '生菜2片', '火腿片2片', '沙拉酱适量'], steps: ['煎一个荷包蛋', '吐司片上依次铺生菜、火腿片、荷包蛋', '挤上沙拉酱，盖上另一片吐司', '对角切开即可'], tips: '可以加番茄片增加口感', tags: ['快手', '饱腹'], favorited: false },
    { id: 'recipe_03', name: '煎蛋', icon: '🍳', category: '早餐', difficulty: 'easy', time: '5分钟', servings: 1, ingredients: ['鸡蛋2个', '盐少许', '食用油适量'], steps: ['平底锅烧热加油', '打入鸡蛋', '小火煎至蛋白凝固，撒盐即可'], tips: '想要溏心蛋可以减少煎制时间', tags: ['快手', '高蛋白'], favorited: false },
    { id: 'recipe_04', name: '酸奶水果杯', icon: '🍓', category: '早餐', difficulty: 'easy', time: '5分钟', servings: 1, ingredients: ['酸奶200g', '草莓5颗', '蓝莓适量', '香蕉半根', '坚果碎适量'], steps: ['草莓切片，香蕉切丁', '杯中倒入一层酸奶', '铺上水果和坚果碎', '再铺一层酸奶和水果装饰即可'], tips: '水果可以根据季节替换', tags: ['快手', '低脂', '高颜值'], favorited: false },
    { id: 'recipe_05', name: '燕麦粥', icon: '🥣', category: '早餐', difficulty: 'easy', time: '15分钟', servings: 1, ingredients: ['燕麦片80g', '牛奶200ml', '红枣3颗', '枸杞适量'], steps: ['红枣去核切碎', '锅中倒入牛奶和燕麦片', '小火煮5分钟，加入红枣和枸杞', '继续煮3分钟至浓稠即可'], tips: '煮的时候要不停搅拌防止糊底', tags: ['养胃', '低脂'], favorited: false },

    // 正餐 5道
    { id: 'recipe_06', name: '番茄炒蛋', icon: '🍅', category: '正餐', difficulty: 'easy', time: '15分钟', servings: 2, ingredients: ['番茄2个', '鸡蛋3个', '葱花适量', '盐1小勺', '糖半勺', '食用油适量'], steps: ['鸡蛋打散加少许盐搅匀', '番茄切块备用', '热锅凉油，倒入蛋液炒至凝固盛出', '锅中留底油，倒入番茄翻炒出汁', '加入炒好的鸡蛋，加盐和糖调味', '翻炒均匀，撒葱花出锅'], tips: '番茄要炒出汁才好吃，可以加一点点水', tags: ['家常', '快手', '下饭'], favorited: false },
    { id: 'recipe_07', name: '可乐鸡翅', icon: '🍗', category: '正餐', difficulty: 'medium', time: '30分钟', servings: 2, ingredients: ['鸡翅中8个', '可乐330ml', '生抽2勺', '老抽1勺', '姜片3片', '料酒1勺'], steps: ['鸡翅划两刀便于入味', '冷水下锅焯水，捞出沥干', '锅中少许油，放入鸡翅煎至两面金黄', '倒入可乐没过鸡翅', '加入生抽、老抽、姜片、料酒', '大火煮开后转小火焖15分钟', '大火收汁即可'], tips: '用普通可乐不要用无糖的，收汁时注意不要糊', tags: ['家常', '下饭', '宴客'], favorited: false },
    { id: 'recipe_08', name: '蛋炒饭', icon: '🍚', category: '正餐', difficulty: 'easy', time: '10分钟', servings: 1, ingredients: ['隔夜米饭1碗', '鸡蛋2个', '葱花适量', '盐适量', '食用油适量'], steps: ['鸡蛋打散', '热锅加油，倒入蛋液快速翻炒', '蛋液半凝固时加入米饭', '大火翻炒至米饭粒粒分明', '加盐调味，撒葱花翻炒出锅'], tips: '用隔夜米饭炒出来更粒粒分明', tags: ['快手', '主食'], favorited: false },
    { id: 'recipe_09', name: '酸辣土豆丝', icon: '🥔', category: '正餐', difficulty: 'easy', time: '15分钟', servings: 2, ingredients: ['土豆2个', '干辣椒3个', '花椒少许', '醋2勺', '盐适量', '葱花适量'], steps: ['土豆去皮切丝，泡水洗去淀粉', '热锅加油，放入花椒和干辣椒爆香', '倒入土豆丝大火翻炒', '加入醋和盐继续翻炒2分钟', '撒葱花出锅'], tips: '土豆丝要泡水去除淀粉才脆', tags: ['家常', '快手', '下饭'], favorited: false },
    { id: 'recipe_10', name: '清炒西兰花', icon: '🥦', category: '正餐', difficulty: 'easy', time: '10分钟', servings: 2, ingredients: ['西兰花1棵', '蒜3瓣', '盐适量', '食用油适量'], steps: ['西兰花掰成小朵，洗净', '烧开水焯烫1分钟捞出', '热锅加油，蒜末爆香', '倒入西兰花大火翻炒', '加盐调味即可出锅'], tips: '焯水时间不要过长，保持翠绿口感', tags: ['快手', '低脂', '健康'], favorited: false },

    // 甜品 3道
    { id: 'recipe_11', name: '草莓奶昔', icon: '🥤', category: '甜品', difficulty: 'easy', time: '5分钟', servings: 1, ingredients: ['草莓8颗', '牛奶200ml', '冰淇淋1勺', '蜂蜜适量'], steps: ['草莓洗净去蒂', '所有材料放入搅拌机', '搅打30秒至顺滑', '倒入杯中即可享用'], tips: '可以加冰块口感更冰爽', tags: ['快手', '高颜值'], favorited: false },
    { id: 'recipe_12', name: '巧克力蛋糕', icon: '🍫', category: '甜品', difficulty: 'hard', time: '60分钟', servings: 6, ingredients: ['低筋面粉150g', '可可粉30g', '鸡蛋3个', '细砂糖100g', '黄油50g', '牛奶50ml'], steps: ['黄油隔水融化', '鸡蛋加糖打发至浓稠', '筛入面粉和可可粉翻拌均匀', '加入融化黄油和牛奶拌匀', '倒入模具，烤箱170度烤35分钟', '取出放凉即可切块'], tips: '蛋白打发是关键，翻拌时不要画圈以免消泡', tags: ['烘焙', '下午茶'], favorited: false },
    { id: 'recipe_13', name: '抹茶拿铁', icon: '🍵', category: '甜品', difficulty: 'easy', time: '5分钟', servings: 1, ingredients: ['抹茶粉2g', '热水30ml', '牛奶200ml', '糖浆适量'], steps: ['抹茶粉加少量热水搅匀至无颗粒', '牛奶加热打发奶泡', '杯中倒入抹茶液', '缓缓倒入牛奶和奶泡', '根据口味加糖浆'], tips: '用茶筅搅抹茶效果最好', tags: ['快手', '下午茶', '高颜值'], favorited: false },

    // 咖啡 3道
    { id: 'recipe_14', name: '美式咖啡', icon: '☕', category: '咖啡', difficulty: 'easy', time: '5分钟', servings: 1, ingredients: ['浓缩咖啡30ml', '热水150ml'], steps: ['萃取一份浓缩咖啡', '加入热水至满杯', '搅拌均匀即可'], tips: '水温控制在90-95度最佳', tags: ['快手', '提神', '低卡'], favorited: false },
    { id: 'recipe_15', name: '拿铁', icon: '☕', category: '咖啡', difficulty: 'medium', time: '8分钟', servings: 1, ingredients: ['浓缩咖啡30ml', '牛奶200ml'], steps: ['萃取一份浓缩咖啡', '牛奶加热并打发奶泡', '将热牛奶缓缓倒入咖啡中', '最后舀入奶泡装饰'], tips: '拉花需要练习，先从简单的心形开始', tags: ['经典', '下午茶'], favorited: false },
    { id: 'recipe_16', name: '卡布奇诺', icon: '☕', category: '咖啡', difficulty: 'medium', time: '8分钟', servings: 1, ingredients: ['浓缩咖啡30ml', '牛奶150ml', '可可粉少许'], steps: ['萃取一份浓缩咖啡', '牛奶加热打发厚奶泡', '倒入热牛奶', '舀入厚厚一层奶泡', '撒上可可粉装饰'], tips: '奶泡要比拿铁更厚实', tags: ['经典', '下午茶'], favorited: false },

    // 饮品 3道
    { id: 'recipe_17', name: '柠檬水', icon: '🍋', category: '饮品', difficulty: 'easy', time: '3分钟', servings: 1, ingredients: ['柠檬半个', '蜂蜜1勺', '凉白开300ml'], steps: ['柠檬切片', '杯中放入柠檬片', '倒入凉白开', '加入蜂蜜搅匀即可'], tips: '用温水泡蜂蜜，不要用开水', tags: ['快手', '低卡', '美白'], favorited: false },
    { id: 'recipe_18', name: '蜂蜜柚子茶', icon: '🍊', category: '饮品', difficulty: 'medium', time: '60分钟', servings: 10, ingredients: ['柚子1个', '蜂蜜200g', '冰糖100g', '盐适量'], steps: ['柚子皮用盐搓洗干净，削下表皮切丝', '柚子肉掰碎', '柚子皮丝加冰糖和水小火熬煮', '煮至粘稠后加入柚子肉继续熬', '放凉后加入蜂蜜搅匀', '装入密封罐冷藏保存'], tips: '柚子皮要去掉白色瓤否则会苦', tags: ['养生', '冬日暖饮'], favorited: false },
    { id: 'recipe_19', name: '水果茶', icon: '🍑', category: '饮品', difficulty: 'easy', time: '10分钟', servings: 2, ingredients: ['红茶包2个', '橙子半个', '苹果半个', '柠檬2片', '蜂蜜适量'], steps: ['红茶包泡5分钟后取出', '水果切片或切块', '将水果放入红茶中', '加入蜂蜜调味', '可以热饮也可以加冰'], tips: '水果可以根据喜好自由搭配', tags: ['快手', '低卡', '高颜值'], favorited: false },
    { id: 'recipe_20', name: '红豆薏米水', icon: '🫘', category: '饮品', difficulty: 'easy', time: '40分钟', servings: 2, ingredients: ['红豆50g', '薏米50g', '冰糖适量'], steps: ['红豆和薏米提前浸泡2小时', '倒入锅中加适量清水', '大火煮开后转小火煮30分钟', '加入冰糖煮至融化即可'], tips: '薏米可以先干炒一下去寒性', tags: ['养生', '祛湿'], favorited: false }
  ];
}

/**
 * 获取所有菜谱
 * @returns {Promise<Array>} 菜谱列表
 */
function getRecipes() {
  var recipes = mockUtils.initData(STORAGE_KEY, generateMockRecipes)
  return mockUtils.mockAsync(recipes)
}

/**
 * 根据ID获取菜谱
 * @param {string} id - 菜谱ID
 * @returns {Promise<Object|null>} 菜谱详情
 */
function getRecipeById(id) {
  var recipes = mockUtils.getFromStorage(STORAGE_KEY, [])
  var recipe = mockUtils.findById(recipes, id)
  return mockUtils.mockAsync(recipe || null)
}

/**
 * 按分类筛选菜谱
 * @param {string} category - 分类名称
 * @returns {Promise<Array>} 筛选结果
 */
function getByCategory(category) {
  var recipes = mockUtils.getFromStorage(STORAGE_KEY, [])
  var filtered = recipes.filter(function (r) {
    return r.category === category
  })
  return mockUtils.mockAsync(filtered)
}

/**
 * 搜索菜谱
 * @param {string} keyword - 搜索关键词
 * @returns {Promise<Array>} 搜索结果
 */
function searchRecipes(keyword) {
  var recipes = mockUtils.getFromStorage(STORAGE_KEY, [])
  var kw = keyword.toLowerCase()
  var results = recipes.filter(function (r) {
    return r.name.indexOf(kw) > -1 ||
      r.tags.some(function (t) { return t.indexOf(kw) > -1 }) ||
      r.ingredients.some(function (i) { return i.indexOf(kw) > -1 })
  })
  return mockUtils.mockAsync(results)
}

/**
 * 切换菜谱收藏状态
 * @param {string} id - 菜谱ID
 * @returns {Promise<Object>} 更新后的菜谱
 */
function toggleFavorite(id) {
  var recipes = mockUtils.getFromStorage(STORAGE_KEY, [])
  var recipe = mockUtils.findById(recipes, id)
  if (!recipe) {
    return mockUtils.mockAsync({ success: false, message: '菜谱不存在' })
  }
  recipe.favorited = !recipe.favorited
  mockUtils.setToStorage(STORAGE_KEY, recipes)
  return mockUtils.mockAsync(recipe)
}

/**
 * 获取收藏的菜谱
 * @returns {Promise<Array>} 收藏列表
 */
function getFavorites() {
  var recipes = mockUtils.getFromStorage(STORAGE_KEY, [])
  var favorites = recipes.filter(function (r) {
    return r.favorited
  })
  return mockUtils.mockAsync(favorites)
}

/**
 * 根据食材推荐菜谱
 * @param {Array<string>} ingredients - 食材列表
 * @returns {Promise<Array>} 推荐菜谱（按匹配度排序）
 */
function getSuggestions(ingredients) {
  var recipes = mockUtils.getFromStorage(STORAGE_KEY, [])
  var results = recipes.filter(function (r) {
    return ingredients.some(function (ing) {
      return r.ingredients.some(function (ri) {
        return ri.indexOf(ing) > -1
      })
    })
  })
  results.sort(function (a, b) {
    var aMatch = ingredients.filter(function (ing) {
      return a.ingredients.some(function (ri) { return ri.indexOf(ing) > -1 })
    }).length
    var bMatch = ingredients.filter(function (ing) {
      return b.ingredients.some(function (ri) { return ri.indexOf(ing) > -1 })
    }).length
    return bMatch - aMatch
  })
  return mockUtils.mockAsync(results)
}

module.exports = {
  getRecipes: getRecipes,
  getRecipeById: getRecipeById,
  getByCategory: getByCategory,
  searchRecipes: searchRecipes,
  toggleFavorite: toggleFavorite,
  getFavorites: getFavorites,
  getSuggestions: getSuggestions
}
