<template>
    <b-container fluid="md">
          <b-container class="h1 mb-3" >
          <h1>{{ title }}</h1>
              <b-dropdown variant="outline-secondary" v-bind:disabled="noCollectionModifyPermission" class="mr-3">
                <template #button-content>
                  <b-icon-pencil-square></b-icon-pencil-square>
                </template>
                <b-dropdown-form>
                   <b-form-group id="input-group-title" label="Insert title:" label-for="input-title">

                            <b-form-input
                            id="input-title"
                            v-model="newTitle"
                            placeholder="Enter new title"
                            required/>

                    </b-form-group>

                    <b-dropdown-item-button v-on:click="updateTitle" variant="primary">Update</b-dropdown-item-button>
                </b-dropdown-form>
              </b-dropdown>
              <b-button v-on:click="deleteCollection" type="submit" title="Delete Collection" variant="outline-secondary" v-bind:disabled="noCollectionModifyPermission" class="mr-3">
                <b-icon-trash variant="danger"></b-icon-trash>
              </b-button>
          </b-container>

            <b-card-group columns>
              <b-card v-for="post in posts" v-bind:key="post._id" v-bind:title="post.title"
              v-bind:img-src="getImageUrl(post.image)"
              img-alt="Image"
              img-top>
                <b-button
                v-on:click="deletePost(post._id)"
                type="submit"
                title="Delete Post"
                variant="outline-secondary"
                v-bind:disabled="noPostModifyPermission"
                class="text-center">
                  <b-icon-trash variant="danger"></b-icon-trash>
              </b-button>
              </b-card>
            </b-card-group>
    </b-container>
</template>

<style scoped>
  @media screen and (max-width: 768px) {
    .card-columns {
      column-count: 2
    }
  }

  @media screen and (max-width: 576px) {
    .card-columns {
      column-count: 1
    }
  }
</style>

<script>
import { Api } from '@/Api'

export default {
  name: 'InsideCollection',
  data() {
    return {
      posts: [],
      currentCollection: null,
      noCollectionModifyPermission: false,
      host: Api.defaults.baseURL.replace('/api', ''),
      title: null,
      newTitle: null,
      noPostModifyPermission: false
    }
  },
  async mounted() {
    await this.checkBackendStatus()
    await this.getPosts()
    await this.checkPostModifyPermission()
    await this.checkAccess()
  },
  methods: {
    async setCurrentCollection() {
      console.log('Page loading confirm')
      const userId = this.$route.params.Uid
      const collectionid = this.$route.params.Cid
      await Api.get('/users/' + userId + '/collections/' + collectionid)
        .then(response => {
          console.log(response)
          this.currentCollection = response
          this.title = this.currentCollection.data.title
          this.isDefaultCollection()
        })
        .catch(error => {
          alert(error.response.data.message)
          this.posts = []
          console.log(error)
        })
    },
    async getPostIds() {
      const postIds = this.currentCollection.data.post_id
      console.log(postIds)
      return postIds
    },
    async getPosts() {
      await this.setCurrentCollection()
      const postIds = await this.getPostIds()
      if (postIds.length === 0) {
        alert('No posts in collection!')
      }
      postIds.forEach(async (post) => {
        await Api.get('/posts/' + post)
          .then(response => {
            console.log(response.data)
            this.posts.push(response.data)
          })
          .catch(error => {
            alert(error.response.data.message)
            this.posts = []
            console.log(error)
          })
      })
    },
    getImageUrl(postImage) {
      console.log(postImage)
      console.log(`${this.host}/${postImage}`)
      return `${this.host}/${postImage}`
    },
    isDefaultCollection() {
      console.log('here: ' + this.title)
      if (this.title === 'MyPhotos' || this.title === 'FavoritedImages') {
        this.noCollectionModifyPermission = true
      }
    },
    async updateTitle() {
      const userId = this.$route.params.Uid
      const collectionId = this.$route.params.Cid
      await Api.patch('/users/' + userId + '/collections/' + collectionId, {
        title: this.newTitle
      })
        .then(response => {
          this.title = this.newTitle
          console.log(response)
        })
        .catch(error => {
          alert(error.response.data.message)
          console.log(error)
        })
    },
    // Once merge other branch, change route to delete a collection with specific id
    async deleteCollection() {
      const userId = this.$route.params.Uid
      const collectionId = this.$route.params.Cid
      await Api.delete('/users/' + userId + '/collections/' + collectionId)
        .then(response => {
          console.log(response)
          alert('Deleted collection, redirecting to the homepage.')
          this.$router.push({ name: 'home' })
        })
        .catch(error => {
          alert(error.response.data.message)
          console.log(error)
        })
    },
    // confirms whether the current logged in user has access to modify the collection and posts
    async checkAccess() {
      const userId = this.$route.params.Uid
      const token = window.localStorage.getItem('auth')
      await Api.get('/usersAuth/data', {
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
        .then(response => {
          if (!(userId === response.data.authorizedData.id._id)) {
            this.noCollectionModifyPermission = true
            this.noPostModifyPermission = true
          } else {
            console.log('has perms')
          }
        })
        .catch(error => {
          if (error.response.status === 403) {
            this.noCollectionModifyPermission = true
            this.noPostModifyPermission = true
          } else {
            alert(error.response.data.message)
          }
          console.log(error)
        })
    },
    async checkPostModifyPermission() {
      if (this.title === 'MyPhotos') {
        this.noPostModifyPermission = false
      } else {
        this.noPostModifyPermission = true
      }
    },
    async deletePost(postId) {
      await this.checkBackendStatus()
      await Api.delete(`/posts/${postId}`)
        .then(response => {
          const index = this.posts.findIndex(post => { return post._id === postId })
          this.posts.splice(index, 1)
          alert('Deleted post')
        })
        .catch(error => {
          console.log(error)
          alert(error.response.data.message)
        })
    },
    async checkBackendStatus() {
      await Api.get('/')
        .then((response) => {
          console.log('Backend is available')
        })
        .catch((error) => {
          alert(error)
          this.noCollectionModifyPermission = true
          this.noPostModifyPermission = true
        })
    }
  }

}

</script>
