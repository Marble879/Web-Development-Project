<template>
  <b-container fluid="md">
    <b-row>
      <b-col
        class="col-lg-4 col-md-12 mb-4 mb-lg-0"
        v-for="post in posts"
        v-bind:key="post._id"
        v-bind:img-src="post.image"
        img-alt="Image"
      >
        <b-img
          class="w-100 shadow-1-strong rounded mb-4"
          v-bind:src="'http://localhost:3000/' + post.image"
        ></b-img>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
// @ is an alias to /src
import { Api } from '@/Api'

export default {
  name: 'home',
  props: ['post'],
  data() {
    return {
      posts: []
    }
  },
  mounted() {
    Api.get('/posts')
      .then((response) => {
        this.posts = response.data.posts
        console.log(response)
      })
      .catch((error) => {
        alert(error.response.data.message)
        console.log(error)
      })
  }
}
</script>
