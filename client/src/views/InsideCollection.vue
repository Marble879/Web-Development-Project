<template>
    <b-container>
          <b-container class="h1 mb-3">
          <h1>Collection name</h1>
              <b-button title="Delete Collection" variant="outline-secondary" class="mr-3">
                <b-icon-trash variant="danger"></b-icon-trash>
              </b-button>
              <b-button title="Edit Collection Name" variant="outline-secondary" class="mr-3">
                <b-icon-pencil-square></b-icon-pencil-square>
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
      host: Api.defaults.baseURL.replace('/api', '')
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
    }
  }

}

</script>
