import { Notification } from 'element-ui'

/**
 * 默认的获取文章内容标签
 */
const summary_tag = '<!-- read more -->'

const FUNCTIONS = {
  /**
   * 通用提示信息
   */
  notification: {
    success: function(message) {
      Notification({
        title: 'success',
        message: message || '成功',
        type: 'success',
        offset: 100
      })
    },
    warning: function(message) {
      Notification({
        title: 'warning',
        message: message || '警告',
        type: 'warning',
        offset: 100
      })
    },
    info: function(message) {
      Notification({
        title: 'info',
        message: message || '提示',
        type: 'info',
        offset: 100
      })
    },
    error: function(message) {
      Notification({
        title: 'error',
        message: message || '异常',
        type: 'error',
        offset: 100
      })
    }
  },

  /**
   *获取文章概括内容
   */
  getSummary: data => {
    return data.substring(0, data.indexOf(summary_tag))
  }
}

export { FUNCTIONS }
