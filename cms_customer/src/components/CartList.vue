<template>
  <v-container>
    <v-col
    class="col-12">
      <h2>Your Carts</h2>
      <hr>
    </v-col>
    <v-col
      v-if="!carts.length"
      class="col-12"
    >
      <h2>Cart anda Kosong</h2>
    </v-col>
    <div v-else-if="carts.length">
      <v-row
      v-for="item in carts"
      :key="item.id">
          <v-col
          class="col-4"
          >
            <v-img
            :contain="true"
            :src="item.Product.image_url"
            height="200px"
            />
          </v-col>
          <v-col
          class="col-4"
          >
            <h3>{{ item.Product.name }}</h3>
            <span>Total : {{ item.total }}</span><br>
            <v-btn
            class="error mr-3"
            @click.prevent="showConfirm(item.Product)"
            >
              <v-icon>
                mdi-delete
              </v-icon>
            </v-btn>
            <v-btn
            class="primary"
            @click.prevent="showEdit(item.Product, item.total)"
            >
              <v-icon>
                mdi-pencil
              </v-icon>
            </v-btn>
          </v-col>
          <v-col
          class="col-4"
          >
            <span>{{ formatHarga(item.Product.price * item.total) }}</span>
          </v-col>
      </v-row>
      <v-row>
        <v-col
        class="col-12">
          <hr>
        </v-col>
          <v-col
          class="col-8">
            <h3>Grand Total: </h3>
          </v-col>
          <v-col
          class="col-4">
            <h3>{{ formatHarga(grandtotal) }}</h3>
          </v-col>
      </v-row>
      <v-row>
        <v-col
        class="col-6">
          <router-link to="/checkout">
            <v-btn
            class="success"
            >
              Checkout
            </v-btn>
          </router-link>
        </v-col>
      </v-row>
    </div>
    <v-dialog
      v-model="dialogdelete"
      :product="product"
      max-width="500px"
      >
      <v-card>
        <v-card-text>
          <v-form @submit.prevent="removeItem(product.id)">
            <v-card-title>Hapus item dari Cart?</v-card-title><br>
            <v-btn
            class="primary mr-3"
            type="submit"
            >
            Delete
            </v-btn>
            <v-btn
            class="error"
            @click.prevent="dialogdelete=false"
            >
            Cancel
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
      </v-dialog>
      <v-dialog
      v-model="dialogedit"
      :product="product"
      max-width="500px"
      >
      <v-card>
        <v-card-text>
          <v-card-title>
            Edit Cart
          </v-card-title>
          <v-form
          v-model="valid"
          @submit.prevent="editItem">
            <v-text-field
            label="Total"
            type="number"
            v-model="total"
            :rules="totalRules"
            required>
            </v-text-field>
            <v-text-field
            label="Notes"
            v-model="notes"
            required>
            </v-text-field>
            <v-btn
            :disabled="!valid"
            class="primary mr-3"
            type="submit"
            >
            Edit
            </v-btn>
            <v-btn
            class="error"
            @click.prevent="dialogedit=false"
            >
            Cancel
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
      </v-dialog>
  </v-container>
</template>

<script>
import server from '../api'

export default {
  name: 'CartList',
  data () {
    return {
      product: {},
      dialogdelete: false,
      dialogedit: false,
      total: 0,
      notes: '',
      valid: true,
      totaledit: 0,
      totalRules: [
        v => !!v || 'Total is required',
        v => {
          if (!isNaN(parseInt(v)) && v >= 0) return true
          else return 'Total cannot less than 0'
        },
        v => v <= this.product.stock || 'Stock kurang dari jumlah yang diinginkan'
      ]
    }
  },
  created () {
    if (!this.isLogin) {
      this.$router.push({ name: 'Login' })
    }
    this.$store.dispatch('getCarts')
  },
  methods: {
    showConfirm (product) {
      this.product = product
      this.dialogdelete = true
    },
    showEdit (product, total) {
      this.product = product
      this.total = total
      this.totaledit = total
      this.dialogedit = true
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
    removeItem (id) {
      server.delete('/carts', {
        data: {
          ProductId: id
        },
        headers: {
          token: localStorage.token
        }
      })
        .then(({ data }) => {
          this.$store.dispatch('getCarts')
          this.dialogdelete = false
        })
        .catch(err => {
          this.$store.commit('SET_ERROR', err.response.data.errors.message)
        })
    },
    editItem () {
      if (parseInt(this.total) === 0) {
        this.removeItem(this.product.id)
      } else {
        const total = this.total - this.totaledit
        server.post('/carts', {
          ProductId: this.product.id,
          total,
          notes: this.notes
        }, {
          headers: {
            token: localStorage.token
          }
        })
          .then(response => {
            this.$store.dispatch('getCarts')
            this.dialogedit = false
          })
          .catch(err => {
            this.$store.commit('SET_ERROR', err.response.data.errors.message)
          })
      }
    }
  },
  computed: {
    carts () {
      return this.$store.state.carts
    },
    isLogin () {
      return this.$store.state.isLogin
    },
    grandtotal () {
      return this.$store.state.grandtotal
    }
  }
}
</script>

<style scoped>
  a {
    text-decoration: none;
  }
</style>
