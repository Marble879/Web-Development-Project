<template>
  <b-container fluid="md">
    <h4 class="m-3 text-dark font-weight-bold">Filter</h4>
    <b-row>
      <b-col>
        <b-button class="btn-style mb-4 ml-3" v-on:click="getAllImages()"
          >None</b-button
        >
        <b-button
          class="btn-style btn-dog mb-4 ml-3"
          v-on:click=";(selectedTag = 'dog'), sortByTag()"
          >Dog</b-button
        >
        <b-button
          class="btn-style btn-cat mb-4 ml-3"
          v-on:click=";(selectedTag = 'cat'), sortByTag()"
          >Cat</b-button
        >
        <b-button
          class="btn-style btn-landscape mb-4 ml-3"
          v-on:click=";(selectedTag = 'landscape'), sortByTag()"
          >Landscape</b-button
        >
        <b-button
          class="btn-style btn-painting mb-4 ml-3"
          v-on:click=";(selectedTag = 'drawings/paintings'), sortByTag()"
          >Painting</b-button
        >
      </b-col>
    </b-row>
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
      posts: [],
      selectedTag: ''
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
  },
  methods: {
    async sortByTag() {
      this.posts = []
      await Api.get('/posts?tag=' + this.selectedTag)
        .then((response) => {
          this.posts = response.data.posts
          console.log(response)
        })
        .catch((error) => {
          console.log(error)
        })
    },
    async getAllImages() {
      this.posts = []
      await Api.get('/posts')
        .then((response) => {
          this.posts = response.data.posts
          console.log(response)
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }
}
</script>

<style>
.btn-style {
  background-size: cover;
  font-family: 'Arial Black';
  width: 125px;
  height: 50px;
  outline: none;
}

.btn-dog {
  background-image: url('../Images/dog.png');
}

.btn-cat {
  background-image: url('../Images/cat.png');
}

.btn-landscape {
  background-image: url('../Images/landscape.png');
}

.btn-painting {
  background-image: url('../Images/painting.png');
}
</style>
