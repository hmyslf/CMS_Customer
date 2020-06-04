<template>
  <v-container class="container-login">
    <v-row
    class="justify-center align-center"
    >
      <v-col
      class="col-4 border"
      >
        <h3 class="text-center">Register</h3><br>
        <span v-if="errorMessage" class="red--text">{{ errorMessage }}</span>
        <v-form
        ref="form"
        v-model="valid"
        lazy-validation
        @submit.prevent="register"
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
          <v-text-field
          v-model="confirmpassword"
          label="Confirm Password"
          :append-icon="showconfirm ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append="() => (showconfirm = !showconfirm)"
          :type="showconfirm ? 'text' : 'password'"
          required
          outlined
          >
          </v-text-field>
          <v-btn
          class="success"
          type="submit">
          Register
          </v-btn>
        </v-form>
        <span>Already have an account? <router-link to="/login">Login</router-link></span>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import server from '../api'

export default {
  name: 'Register',
  data () {
    return {
      email: '',
      password: '',
      valid: true,
      show: false,
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
      ],
      confirmpassword: '',
      showconfirm: false
    }
  },
  methods: {
    register () {
      if (this.password !== this.confirmpassword) {
        this.$store.commit('SET_ERROR', 'password and confirm password did not match')
        setTimeout(() => {
          this.$store.commit('SET_ERROR', '')
        }, 2000)
      } else {
        server.post('/register', {
          email: this.email,
          password: this.password
        })
          .then(results => {
            this.$store.commit('SET_SUCCESS', 'Register Success, you can login now')
            this.$router.push({ name: 'Login' })
          })
          .catch(err => {
            this.$store.commit('SET_ERROR', err.response.data.errors[0].message)
            setTimeout(() => {
              this.$store.commit('SET_ERROR', '')
            }, 2000)
          })
      }
    }
  },
  created () {
    if (this.isLogin) {
      this.$router.push({ name: 'LandingPage' })
    }
  },
  computed: {
    isLogin () {
      return this.$store.state.isLogin
    },
    errorMessage () {
      return this.$store.state.errorMessage
    },
    successMessage () {
      return this.$store.state.successMessage
    }
  }
}
</script>

<style>

</style>
