import variables from '@/styles/element-variables.scss'
import defaultSettings from '@/settings'

const { tagsView } = defaultSettings

const state = {
  theme: variables.theme,
  tagsView: tagsView
}

export default {
  namespaced: true,
  state
}
