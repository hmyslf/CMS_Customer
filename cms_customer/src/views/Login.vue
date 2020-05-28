<template>
  <v-container class="container-login">
    <v-row
    class="justify-center align-center"
    >
      <v-col
      class="col-4 border"
      >
        <h3 class="text-center">Login</h3><br>
        <span v-if="successMessage" class="green--text">{{ successMessage }}</span>
        <v-form
        ref="form"
        v-model="valid"
        lazy-validation
        @submit.prevent="login"
        >
          <v-text-field
          v-model="email"
          :rules="emailRules"
          label="Email"
          required
          outlined
          >
          </v-text-field>
          <v-text-field
          v-model="password"
          label="Password"
          :append-icon="show ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append="() => (show = !show)"
          :type="show ? 'text' : 'password'"
          required
          outlined
          >
          </v-text-field>
          <v-btn
          class="success"
          type="submit">
          Login
          </v-btn>
        </v-form><br>
        <span>Don't have an account? <router-link to="/register">Register</router-link></span>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import server from '../api'

export default {
  name: 'Login',
  data () {
    return {
      valid: true,
      show: false,
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
      ],
      password: ''
    }
  },
  methods: {
    login () {
      server.post('/login', {
        email: this.email,
        password: this.password
      })
        .then(results => {
          localStorage.setItem('token', results.data.token)
          this.$store.commit('SET_LOGIN', true)
          this.$router.push({ name: 'LandingPage' })
        })
        .catch(err => {
          console.log(err.response)
        })
    }
  },
  created () {
    if (this.isLogin) {
      this.$router.push({ name: 'LandingPage' })
    }
    if (this.successMessage) {
      setTimeout(() => {
        this.$store.commit('SET_SUCCESS', '')
      }, 2000)
    }
  },
  computed: {
    isLogin () {
      return this.$store.state.isLogin
    },
    successMessage () {
      return this.$store.state.successMessage
    }
  }
}
</script>

<style scoped>
</style>
