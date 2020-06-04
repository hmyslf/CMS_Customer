import Vue from 'vue'
import Vuex from 'vuex'
import server from '../api'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    carts: [],
    products: [],
    categories: [],
    paymentchannels: [],
    isLogin: '',
    errorMessage: '',
    successMessage: '',
    grandtotal: 0,
    orders: []
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
      setTimeout(() => {
        state.errorMessage = ''
      }, 4000)
    },
    SET_SUCCESS (state, payload) {
      state.successMessage = payload
    },
    SET_CATEGORIES (state, payload) {
      state.categories = payload
    },
    SET_CARTS (state, payload) {
      state.carts = payload
    },
    SET_PAYMENT_CHANNELS (state, payload) {
      state.paymentchannels = payload
    },
    SET_GRANDTOTAL (state, payload) {
      state.grandtotal = payload
    },
    SET_ORDERS (state, payload) {
      state.orders = payload
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
          let grandtotal = 0
          for (let i = 0; i < data.Carts.length; i++) {
            grandtotal += (data.Carts[i].total * data.Carts[i].Product.price)
          }
          commit('SET_GRANDTOTAL', grandtotal)
          commit('SET_CARTS', data.Carts)
        })
    },
    getPaymentChannels ({ commit }) {
      return server.get('/payments')
        .then(({ data }) => {
          commit('SET_PAYMENT_CHANNELS', data.PaymentChannel)
        })
    },
    getOrders ({ commit }) {
      return server.get('/orders', {
        headers: {
          token: localStorage.token
        }
      })
        .then(({ data }) => {
          commit('SET_ORDERS', data.Orders)
        })
    }
  },
  modules: {
  }
})
