<template>
  <v-container>
    <v-row>
      <v-col
      class="col-12"
      >
        <h1>Your Order(s) List</h1>
        <span v-if="successMessage" class="success--text">{{ successMessage }}</span>
        <hr>
        <v-data-table
          :headers="headers"
          :items="orders"
          :items-per-page="10"
          class="elevation-1"
        ></v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'OrderList',
  data () {
    return {
      headers: [
        {
          text: 'First Name',
          value: 'first_name'
        },
        {
          text: 'Last Name',
          value: 'last_name'
        },
        {
          text: 'Payment',
          value: 'PaymentChannel.bank_name'
        },
        {
          text: 'Account Number',
          value: 'PaymentChannel.account_number'
        },
        {
          text: 'Total',
          value: 'grandtotal'
        }
      ]
    }
  },
  created () {
    if (localStorage.token) {
      this.$store.dispatch('getOrders')
    } else {
      this.$router.push({ name: 'Login' })
    }

    if (this.successMessage) {
      setTimeout(() => {
        this.$store.commit('SET_SUCCESS', '')
      }, 4000)
    }
  },
  computed: {
    orders () {
      return this.$store.state.orders
    },
    successMessage () {
      return this.$store.state.successMessage
    }
  }
}
</script>

<style>

</style>
