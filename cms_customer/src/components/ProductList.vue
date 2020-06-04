<template>
  <v-row>
      <h1 v-if="!product.length"></h1>
      <v-col
      class="col-3"
      v-for="product in products"
      :key="product.id"
      >
        <v-card>
          <v-img
          :contain="true"
          :src="product.image_url"
          height="200px"
          />
          <v-card-title>
            {{ product.name }}
          </v-card-title>
          <v-card-subtitle>
            {{ formatHarga(product.price) }}
          </v-card-subtitle>
          <v-card-actions>
            <v-btn class="primary" @click.prevent="showModal(product)">
               Add to Cart
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-dialog
      v-model="dialog"
      :product="product"
      max-width="500px"
      >
      <v-card>
        <v-card-text>
          <v-card-title>
            Add to Cart {{ product.name }}
          </v-card-title>
          <v-form @submit.prevent="addToCart">
            <v-text-field
            label="Total"
            type="number"
            v-model="total"
            required>
            </v-text-field>
            <v-text-field
            label="Notes"
            v-model="notes"
            required>
            </v-text-field>
            <v-btn
            class="primary mr-3"
            type="submit"
            >
            Add
            </v-btn>
            <v-btn
            class="error"
            @click.prevent="dialog=false"
            >
            Cancel
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
      </v-dialog>
      <v-dialog
      v-model="dialogsuccess"
      max-width="500px"
      >
        <v-card>
          <v-card-title>
            <span class="success--text">{{ successMessage }}</span>
          </v-card-title>
        </v-card>
      </v-dialog>
    </v-row>
</template>

<script>
import server from '../api'

export default {
  name: 'ProductList',
  data () {
    return {
      dialog: false,
      product: {},
      total: 1,
      notes: '',
      dialogsuccess: false
    }
  },
  computed: {
    products () {
      return this.$store.state.products
    },
    carts () {
      return this.$store.state.carts
    },
    successMessage () {
      return this.$store.state.successMessage
    }
  },
  methods: {
    showModal (product) {
      this.product = product
      this.dialog = true
    },
    addToCart () {
      if (localStorage.token) {
        server.post('/carts', {
          ProductId: this.product.id,
          total: this.total,
          notes: this.notes
        }, {
          headers: {
            token: localStorage.token
          }
        })
          .then(response => {
            this.$store.dispatch('getCarts')
            this.$store.commit('SET_SUCCESS', 'Berhasil Menambahkan Item')
            this.dialogsuccess = true
            setTimeout(() => {
              this.dialogsuccess = false
            }, 3000)
            this.dialog = false
          })
          .catch(err => {
            this.$store.commit('SET_ERROR', err.response.data.errors.message)
          })
      } else {
        this.$router.push({ name: 'Login' })
      }
    },
    formatHarga (number) {
      var rupiah = ''
      var angkarev = number.toString().split('').reverse().join('')
      for (var i = 0; i < angkarev.length; i++) {
        if (i % 3 === 0) {
          rupiah += angkarev.substr(i, 3) + '.'
        }
      }
      return 'Rp. ' + rupiah.split('', rupiah.length - 1).reverse().join('')
    }
  },
  created () {
    this.$store.dispatch('getProducts')
    if (localStorage.token) {
      this.$store.dispatch('getCarts')
    }
  }
}
</script>

<style>

</style>
