<template>
  <v-container>
    <v-row>
        <v-breadcrumbs :items="breadcrumbs">
          <template v-slot:divider>
            <v-icon>mdi-chevron-right</v-icon>
          </template>
        </v-breadcrumbs>
        <v-col
        class="col-12">
          <h1>{{ category }}</h1>
        <hr>
        </v-col>
        <h2 v-if="!products.length">Tidak Ada Produk</h2>
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
              class="primary"
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
      </v-row>
  </v-container>
</template>

<script>
import server from '../api'

export default {
  name: 'ProductCategory',
  data () {
    return {
      dialog: false,
      product: {},
      total: 1,
      notes: '',
      category: '',
      categoryid: Number,
      breadcrumbs: [
        {
          text: 'Home',
          disabled: false,
          href: '/'
        },
        {
          text: this.category,
          disabled: true,
          href: `/category/${this.categoryid}`
        }
      ]
    }
  },
  methods: {
    showModal (product) {
      this.product = product
      this.dialog = true
    },
    getProducts () {
      server.get(`/categories/${this.$route.params.id}`)
        .then(({ data }) => {
          this.category = data.Category.name
          this.breadcrumbs[1].text = data.Category.name
          this.categoryid = data.Category.id
          this.$store.commit('SET_PRODUCTS', data.Category.Products)
        })
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
          })
          .catch(err => {
            this.$store.commit('SET_ERROR', err.response.data.errors.message)
          })
      } else {
        this.$router.push({ name: 'Login' })
      }
    }
  },
  created () {
    this.getProducts()
  },
  computed: {
    products () {
      return this.$store.state.products
    }
  }
}
</script>

<style>

</style>
