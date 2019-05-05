import { getDocs, delDocs } from '@/api/document'
import { removeObjWithArr } from '@/utils'

const state = {
  docs: []
}

const mutations = {
  SET_DOCS: (state, data) => {
    state.docs = data
  },

  DEL_DOCS: (state, data) => {
    removeObjWithArr(state.docs, data)
  },

  ADD_DOCS: (state, data) => {
    state.docs.push(data)
  }
}

const actions = {
  achieve({ commit, state }) {
    return new Promise((resolve, reject) => {
      getDocs(state.token).then(response => {
        const data = response.data

        commit('SET_DOCS', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  delete({ commit }, name) {
    return new Promise((resolve, reject) => {
      delDocs({ token: state.token, name: name }).then(response => {
        const data = response.data

        commit('DEL_DOCS', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  add({ commit }, data) {
      commit('ADD_DOCS', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}