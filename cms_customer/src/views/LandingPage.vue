<template>
  <v-container>
    <v-row>
      <v-col
      class="col-2"
      v-for="category in categories"
      :key="category.id">
        <v-card
          class="mx-auto"
        >
          <router-link :to="`/category/${category.id}`">
            <v-card-title>
              {{ category.name }}
            </v-card-title>
          </router-link>
        </v-card>
      </v-col>
    </v-row>
    <ProductList />
  </v-container>
</template>

<script>
import ProductList from '@/components/ProductList.vue'

export default {
  name: 'LandingPage',
  components: {
    ProductList
  },
  created () {
    this.$store.dispatch('getCategories')
  },
  computed: {
    categories () {
      return this.$store.state.categories
    }
  }
}
</script>

<style>

</style>
