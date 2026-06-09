/**
 * shopping-item 组件
 * 功能：购物清单条目，展示商品信息，支持勾选、删除、编辑
 * 通过 properties 接收 item 对象，通过 triggerEvent 发送事件
 * purchased 状态下显示删除线和淡化效果
 */
Component({
  /**
   * 组件属性
   */
  properties: {
    /** 商品对象，包含 id, name, category, price, quantity, purchased, brand */
    item: {
      type: Object,
      value: {
        id: '',
        name: '',
        category: '',
        price: 0,
        quantity: 1,
        purchased: false,
        brand: ''
      }
    }
  },

  /**
   * 组件内部数据
   */
  data: {
    /** 计算后的总价 */
    totalPrice: '0.00'
  },

  /**
   * 监听属性变化，自动计算总价
   */
  observers: {
    'item.price, item.quantity': function(price, quantity) {
      var total = (price || 0) * (quantity || 1)
      this.setData({
        totalPrice: total.toFixed(2)
      })
    }
  },

  /**
   * 组件生命周期
   */
  lifetimes: {
    attached: function() {
      var price = this.data.item.price || 0
      var quantity = this.data.item.quantity || 1
      this.setData({
        totalPrice: ((price) * (quantity)).toFixed(2)
      })
    }
  },

  /**
   * 组件方法
   */
  methods: {
    /**
     * 切换购买状态
     * 使用 catchtap 阻止冒泡
     * 向父组件触发 toggle 事件
     */
    onToggle: function() {
      this.triggerEvent('toggle', {
        id: this.data.item.id,
        purchased: !this.data.item.purchased
      })
    },

    /**
     * 删除按钮点击
     * 使用 catchtap 阻止冒泡
     * 向父组件触发 delete 事件
     */
    onDelete: function() {
      this.triggerEvent('delete', { id: this.data.item.id })
    },

    /**
     * 编辑按钮点击（点击内容区）
     * 向父组件触发 edit 事件
     */
    onEdit: function() {
      this.triggerEvent('edit', { id: this.data.item.id })
    }
  }
})
