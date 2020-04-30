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
  },

  /**
   * 导出md文件
   * @param title 文章标题
   * @param content 文章内容
   */
  saveMd: (title, content) => {
    // 默认为文章标题，没有文章标题则使用默认的
    const fileName = (title || 'article') + '.md'
    if (content === '') {
      this.notification.error('内容为空，导出失败')
      return
    }
    var pom = document.createElement('a')
    pom.setAttribute('href', 'data:text/plain;charset=UTF-8,' + encodeURIComponent(content))
    pom.setAttribute('download', fileName)
    pom.style.display = 'none'
    if (document.createEvent) {
      const event = document.createEvent('MouseEvents')
      event.initEvent('click', true, true)
      pom.dispatchEvent(event)
    } else {
      pom.click()
    }
  },

  /**
   * 导出md文章
   * @param selectedFile
   * @param _this
   */
  importMd(selectedFile, _this) {
    const fileName = selectedFile.name
    // 全段是否为md文件
    if (fileName.substring(fileName.lastIndexOf('.')) !== '.md') {
      this.notification.error('请导入md文件')
      return
    }
    const reader = new FileReader()
    // 文件内容载入完毕之后的回调。
    reader.onload = e => {
      _this.blogForm.mdContent = e.target.result
    }
    reader.readAsText(selectedFile)
  }
}

export { FUNCTIONS }
