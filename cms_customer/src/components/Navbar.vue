<template>
    <v-app-bar
    app
    dark
  >
    <v-menu offset-y>
      <template v-slot:activator="{ on }">
        <v-btn
          dark
          v-on="on"
        >
          Category
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          v-for="category in categories"
          :key="category.id"
        >
          <v-list-item-title><router-link :to="`/category/${category.id}`">{{ category.name }}</router-link></v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-spacer></v-spacer>
    <div class="d-flex align-center">
      <router-link to="/"><h3 class="page-title">RuangToko</h3></router-link>
    </div>

    <v-spacer></v-spacer>

    <v-btn
      target="_blank"
      v-if="!isLogin"
      text
    >
      <router-link to="/login"><span class="mr-2">Login</span></router-link>
      <v-icon>mdi-user</v-icon>
    </v-btn>
    <router-link to='/orders' v-if="isLogin">
        <v-icon
        class="mr-2">
          mdi-shopping
        </v-icon>
      </router-link>
    <v-badge
    color="blue"
    :content="total"
    v-if="isLogin"
    >
      <router-link to='/carts'>
        <v-icon>
          mdi-cart-outline
        </v-icon>
      </router-link>
    </v-badge>
    <v-btn
    class="error ml-5"
    v-if="isLogin"
    @click.prevent="logout"
    >Logout</v-btn>
  </v-app-bar>
</template>

<script>
export default {
  name: 'Navbar',
  created () {
    if (localStorage.token) {
      this.$store.commit('SET_LOGIN', true)
      this.$store.dispatch('getCarts')
    }
  },
  methods: {
    countItem () {
      let count = 0
      for (let i = 0; i < this.carts.length; i++) {
        count += this.carts[i].total
      }
      return count.toString()
    },
    logout () {
      localStorage.clear()
      this.$store.commit('SET_LOGIN', false)
      this.$router.push({ name: 'Login' })
    }
  },
  computed: {
    isLogin () {
      return this.$store.state.isLogin
    },
    carts () {
      return this.$store.state.carts
    },
    total () {
      return this.countItem()
    },
    categories () {
      return this.$store.state.categories
    }
  }
}
</script>

<style scoped>
  a {
    text-decoration: none;
    color: white
  }
  .page-title {
    color: white;
  }
  span {
    color: white;
  }
</style>
