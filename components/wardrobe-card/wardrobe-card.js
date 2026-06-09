/**
 * wardrobe-card 组件
 * 功能：衣物卡片，展示衣物名、分类、颜色、季节、穿着次数、洗涤状态
 * launderStatus=dirty 时显示洗涤图标和橙色背景
 */
Component({
  properties: {
    item: {
      type: Object,
      value: { id: '', name: '', category: '', color: '', season: '', wearCount: 0, launderStatus: 'clean' }
    }
  },
  methods: {
    onToggleLaundry() {
      this.triggerEvent('toggleLaundry', { id: this.data.item.id, launderStatus: this.data.item.launderStatus })
    },
    onEdit() {
      this.triggerEvent('edit', { id: this.data.item.id })
    }
  }
})
