<template>
  <v-container>
    <v-row justify="center">
      <v-col
      class="col-12"
      align="center"
      >
        <h1>Checkout</h1>
        <hr>
      </v-col>
      <v-col
      v-if="!carts.length"
      class="col-12"
      >
        <h2>Anda belum menambahkan produk di cart</h2>
      </v-col>
      <v-col
      class="col-6"
      v-if="carts.length"
      >
        <v-form>
          <v-text-field
          v-model="first_name"
          label="First Name"
          required
          outlined
          >
          </v-text-field>
          <v-text-field
          v-model="last_name"
          label="Last Name"
          required
          outlined
          >
          </v-text-field>
          <v-textarea
          v-model="address"
          label="Address"
          required
          outlined
          >
          </v-textarea>
          <v-select
            :items="paymentchannels"
            label="Select Payment"
            v-model="payment"
            item-text="bank_name"
            item-value="id"
            outlined
          >
          </v-select>
          <v-btn
            class="success"
            type="submit"
            @click.prevent="checkout"
          >
            Checkout
          </v-btn>
        </v-form>
      </v-col>
      <v-col
      class="col-6"
      v-if="carts.length"
      >
        <h2>Your Items :</h2>
          <v-card>
            <v-list-item three-line v-for="item in carts" :key="item.id">
              <v-list-item-content>
                <v-list-item-title>{{ item.Product.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ item.total }}</v-list-item-subtitle>
                <v-list-item-subtitle>{{ formatHarga(item.total * item.Product.price) }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-card>
          <v-row>
            <v-col
            class="col-6">
              Total:
            </v-col>
            <v-col
            class="col-6"
            >
              {{ formatHarga(grandtotal) }}
            </v-col>
          </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import server from '../api'

export default {
  name: 'Checkout',
  data () {
    return {
      first_name: '',
      last_name: '',
      address: '',
      payment: ''
    }
  },
  methods: {
    checkout () {
      server.post('/orders', {
        first_name: this.first_name,
        last_name: this.last_name,
        address: this.address,
        PaymentChannelId: this.payment,
        grandtotal: this.grandtotal
      }, {
        headers: {
          token: localStorage.token
        }
      })
        .then(({ data }) => {
          this.$store.commit('SET_SUCCESS', 'Berhasil Checkout')
          this.$router.push({ name: 'Orders' })
        })
        .catch(err => {
          this.$store.commit('SET_ERROR', err.response.data.errors.message)
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
    }
  },
  computed: {
    carts () {
      return this.$store.state.carts
    },
    paymentchannels () {
      return this.$store.state.paymentchannels
    },
    grandtotal () {
      return this.$store.state.grandtotal
    }
  },
  created () {
    if (localStorage.token) {
      this.$store.dispatch('getPaymentChannels')
    } else {
      this.$router.push({ name: 'Login' })
    }
  }
}
</script>

<style>

</style>
