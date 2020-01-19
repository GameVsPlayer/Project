import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    error: false,
    langs: [],
    commands: [],
  },
  mutations: {
    setError(state, error) {
      state.error = error
    },
    placeLangs(state, langs) {
      state.langs = langs
    },
    placeCommands(state, commands) {
      state.commands = commands
    }
  },
  actions: {

  },
  getters: {
    error: state => state.error,
    langs: state => state.langs,
    commands: state => state.commands
  }
})