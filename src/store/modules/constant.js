const state = {
  status: false,
  tagsStaus: false
}

const mutations = {
  UPDATE_RELOAD: (state, status) => {
    state.status = status
  },
  RELOAD_TAGS: (state, status) => {
    state.tagsStaus = status
  }
}

const actions = {
  updateReload({ commit }, status) {
    commit('UPDATE_RELOAD', status)
  },
  reloadTags({ commit }, status) {
    commit('RELOAD_TAGS', status)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
