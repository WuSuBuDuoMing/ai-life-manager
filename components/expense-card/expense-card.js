/**
 * expense-card 组件
 * 功能：收支记录卡片，展示分类图标、分类名、金额、日期、备注
 * type=income 金额绿色，type=expense 金额红色
 * 通过 properties 接收 record 对象，通过 triggerEvent 发送事件
 */
Component({
  /**
   * 组件属性
   */
  properties: {
    /** 收支记录对象，包含 id, type, amount, category, date, note, icon */
    record: {
      type: Object,
      value: {
        id: '',
        type: 'expense',
        amount: 0,
        category: '',
        date: '',
        note: '',
        icon: ''
      }
    },
    /** 是否显示日期 */
    showDate: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件方法
   */
  methods: {
    /** 编辑事件 - 点击卡片触发 */
    onEdit() {
      this.triggerEvent('edit', { id: this.data.record.id })
    },
    /** 删除事件 - 点击删除按钮触发（catchtap阻止冒泡） */
    onDelete() {
      this.triggerEvent('delete', { id: this.data.record.id })
    }
  }
})
