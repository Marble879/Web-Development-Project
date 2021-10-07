<template>
    <b-container>
          <b-container class="h1 mb-3">
          <h1>{{ title }}</h1>
              <b-dropdown variant="outline-secondary" v-bind:disabled="isDefault" class="mr-3">
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
              <b-button v-on:click="deleteCollection" type="submit" title="Delete Collection" variant="outline-secondary" v-bind:disabled="isDefault" class="mr-3">
                <b-icon-trash variant="danger"></b-icon-trash>
              </b-button>
          </b-container>

            <b-card-group columns>
              <b-card v-for="post in posts" v-bind:key="post._id" v-bind:title="post.title"
              v-bind:img-src="getImageUrl(post.image)"
              img-alt="Image"
              img-top>
                <b-button href="/" variant="primary">Go to post</b-button>
              </b-card>
            </b-card-group>
    </b-container>
</template>

<script>
import { Api } from '@/Api'

export default {
  name: 'InsideCollection',
  data() {
    return {
      posts: [],
      currentCollection: null,
      isDefault: false,
      host: Api.defaults.baseURL.replace('/api', ''),
      title: null,
      newTitle: null
    }
  },
  async mounted() {
    await this.getPosts()
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
        // todo ERROR HANDLING/DISPLAY ERROR LIKE CREATEPOST SCREEN
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
      postIds.forEach(async (post) => {
        await Api.get('/posts/' + post)
          .then(response => {
            console.log(response.data)
            this.posts.push(response.data)
          })
          .catch(error => {
            // todo ERROR HANDLING/DISPLAY ERROR LIKE CREATEPOST SCREEN
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
        this.isDefault = true
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
          // todo ERROR HANDLING/DISPLAY ERROR LIKE CREATEPOST SCREEN
          console.log(error)
        })
    },
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
          console.log(error)
          // TODO error handling
        })
    }
  }

}

</script>
