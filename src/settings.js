module.exports = {
  /**
   * 网站标题
   */
  title: 'MerryCodes Admin',

  /**
   * 前端Url
   * 本地/服务器 前端地址
   */
  blogUrl: process.env.NODE_ENV === 'production' ? '服务器' : '本地',

  /**
   * @ {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: ['production', 'development']
}
