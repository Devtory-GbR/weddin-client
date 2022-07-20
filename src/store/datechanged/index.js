const state = {
  hideWarning: JSON.parse(localStorage.getItem('sama_hideWarning')) || false
}

const getters = {

}

const mutations = {
  update_hideWarining (state, hideWarning) {
    state.hideWarning = hideWarning
    localStorage.setItem('sama_hideWarning', hideWarning)
  }
}

const actions = {

}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
