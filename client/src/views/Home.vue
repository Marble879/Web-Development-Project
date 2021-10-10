<template>
  <b-container fluid="md">
    <h4 class="m-3 text-dark font-weight-bold">Filter</h4>
    <b-row>
      <b-col>
        <b-button
          class="btn-style mb-4 ml-3"
          title="No filter"
          v-on:click="getAllImages()"
          >None</b-button
        >
        <b-button
          class="btn-style btn-dog mb-4 ml-3"
          title="Filter by dogs"
          v-on:click=";(selectedTag = 'dog'), sortByTag()"
          >Dog</b-button
        >
        <b-button
          class="btn-style btn-cat mb-4 ml-3"
          title="Filter by cats"
          v-on:click=";(selectedTag = 'cat'), sortByTag()"
          >Cat</b-button
        >
        <b-button
          class="btn-style btn-landscape mb-4 ml-3"
          title="Filter by landscapes"
          v-on:click=";(selectedTag = 'landscape'), sortByTag()"
          >Landscape</b-button
        >
        <b-button
          class="btn-style btn-painting mb-4 ml-3"
          title="Filter by paintings"
          v-on:click=";(selectedTag = 'drawings/paintings'), sortByTag()"
          >Painting</b-button
        >
        <b-button
          class="btn-style btn-trash mb-4 ml-3"
          title="Delete all posts"
          v-on:click="deleteAllPosts()"
          >Delete All</b-button
        >
      </b-col>
    </b-row>

    <b-card-group columns>
      <b-card
        v-for="post in posts"
        v-bind:key="post._id"
        v-bind:title="post.title"
        v-bind:img-src="getImageUrl(post.image)"
        img-alt="Image"
        img-top
      >
        <b-button
          variant="light"
          v-on:click="addPostToFavorites(post._id)"
          type="submit"
          title="Add to favorites"
          class="text-center"
        >
          <b-icon-heart-fill variant="danger"></b-icon-heart-fill>
        </b-button>
      </b-card>
    </b-card-group>
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
      selectedTag: '',
      host: Api.defaults.baseURL.replace('/api', ''),
      userId: null,
      collectionId: null
    }
  },
  async mounted() {
    await this.retrieveAllPosts()
    await this.getUserId()
    await this.getFavoritesCollectionId()
  },
  methods: {
    async retrieveAllPosts() {
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
    },
    getImageUrl(postImage) {
      console.log(postImage)
      console.log(`${this.host}/${postImage}`)
      return `${this.host}/${postImage}`
    },
    async getUserId() {
      const token = window.localStorage.getItem('auth')
      await Api.get('/usersAuth/data', {
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
        .then((response) => {
          this.userId = response.data.authorizedData.id._id
        })
        .catch((error) => {
          if (error.response.status === 403) {
            alert('Error, not logged in!')
          } else {
            alert(error.response.data.message)
          }
        })
    },
    async getFavoritesCollectionId() {
      await this.getUserId()
      Api.get('/users/' + this.userId + '/collections')
        .then((response) => {
          console.log(response)
          this.collectionId = response.data.collections[1]._id
          console.log(this.collectionId)
        })
        .catch((error) => {
          alert(error.response.data.message)
          console.log(error)
        })
    },
    async addPostToFavorites(postId) {
      await this.getFavoritesCollectionId()
      Api.patch('/collections/' + this.collectionId, {
        post_id: `${postId}`
      })
        .then((response) => {
          console.log(response)
          alert('Post added to favorites')
        })
        .catch((error) => {
          console.log(error)
          alert(error.response.data.message)
        })
    },
    async deleteAllPosts() {
      await Api.delete('/posts')
        .then((response) => {
          console.log(response)
          this.posts = []
          alert('All posts deleted')
        })
        .catch((error) => {
          console.log(error)
          alert(error.response.data.message)
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
.btn-trash {
  background-image: url('../Images/trash.png');
}
</style>
