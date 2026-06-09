/**
 * 统计卡片组件
 * 展示统计数据，支持趋势指示和暗色模式
 */
Component({
  properties: {
    title: { type: String, value: '' },
    value: { type: String, value: '0' },
    unit: { type: String, value: '' },
    trend: { type: Number, value: 0 },
    trendLabel: { type: String, value: '较上周' },
    icon: { type: String, value: '📊' },
    color: { type: String, value: '#4CAF50' },
    size: { type: String, value: 'normal' }
  },

  data: {
    iconBgColor: ''
  },

  observers: {
    'color': function(color) {
      // 将 6 位 hex 转换为 rgba 格式，使用 0.12 透明度
      var rgba = this._hexToRgba(color, 0.12)
      this.setData({ iconBgColor: rgba })
    }
  },

  lifetimes: {
    attached: function() {
      var color = this.data.color || '#4CAF50'
      this.setData({ iconBgColor: this._hexToRgba(color, 0.12) })
    }
  },

  methods: {
    onTap: function() { this.triggerEvent('tap') },

    /**
     * 将 hex 颜色转为 rgba
     * @param {string} hex - 颜色值（支持 #RGB 和 #RRGGBB）
     * @param {number} alpha - 透明度 0-1
     * @returns {string} rgba 颜色字符串
     */
    _hexToRgba: function(hex, alpha) {
      if (!hex) return 'rgba(76, 175, 80, ' + alpha + ')'
      // 去掉 # 前缀
      hex = hex.replace('#', '')
      // 处理 3 位 hex
      if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
      }
      if (hex.length !== 6) return 'rgba(76, 175, 80, ' + alpha + ')'
      var r = parseInt(hex.substring(0, 2), 16)
      var g = parseInt(hex.substring(2, 4), 16)
      var b = parseInt(hex.substring(4, 6), 16)
      return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')'
    }
  }
})
