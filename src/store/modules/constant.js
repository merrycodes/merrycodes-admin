const state = {
  status: false,
  tagsStaus: false,
  categoryStaus: false
}

const mutations = {
  UPDATE_RELOAD: (state, status) => {
    state.status = status
  },
  RELOAD_TAGS: (state, status) => {
    state.tagsStaus = status
  },
  RELOAD_CATEGORY: (state, status) => {
    state.categoryStaus = status
  }
}

const actions = {
  updateReload({ commit }, status) {
    commit('UPDATE_RELOAD', status)
  },
  reloadTags({ commit }, status) {
    commit('RELOAD_TAGS', status)
  },
  reloadCategory({ commit }, status) {
    commit('RELOAD_CATEGORY', status)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
