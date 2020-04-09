const state = {
  status: false
}

const mutations = {
  UPDATE_RELOAD: (state, status) => {
    state.status = status
  }
}

const actions = {
  updateReload({ commit }, status) {
    commit('UPDATE_RELOAD', status)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
