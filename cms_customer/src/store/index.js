import Vue from 'vue'
import Vuex from 'vuex'
import server from '../api'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    carts: [],
    products: [],
    categories: [],
    isLogin: '',
    errorMessage: '',
    successMessage: ''
  },
  mutations: {
    SET_PRODUCTS (state, payload) {
      state.products = payload
    },
    SET_LOGIN (state, payload) {
      state.isLogin = payload
    },
    SET_ERROR (state, payload) {
      state.errorMessage = payload
    },
    SET_SUCCESS (state, payload) {
      state.successMessage = payload
    },
    SET_CATEGORIES (state, payload) {
      state.categories = payload
    },
    SET_CARTS (state, payload) {
      state.carts = payload
    }
  },
  actions: {
    getCategories ({ commit }) {
      return server.get('/categories')
        .then(({ data }) => {
          commit('SET_CATEGORIES', data.Categories)
        })
    },
    getProducts ({ commit }) {
      return server.get('/products/all')
        .then(({ data }) => {
          commit('SET_PRODUCTS', data.Products)
        })
    },
    getCarts ({ commit }) {
      return server.get('/carts', {
        headers: {
          token: localStorage.token
        }
      })
        .then(({ data }) => {
          commit('SET_CARTS', data.Carts)
        })
    }
  },
  modules: {
  }
})
