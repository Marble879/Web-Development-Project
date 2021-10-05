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

        <b-row>
          <b-col v-for="post in posts" v-bind:key="post._id" lg="4" class="mb-3">
            <b-card v-bind:title="post.title"
            v-bind:img-src="post.image"
            img-alt="Image"
            img-top>
            <b-button href="/" variant="primary">Go to post</b-button>
            </b-card>
          </b-col>
        </b-row>
    </b-container>
</template>

<script>
import { Api } from '@/Api'

export default {
  name: 'InsideCollection',
  data() {
    return {
      posts: [],
      currentCollection: null
    }
  },
  async mounted() {
    await this.setCurrentCollection()
  },
  methods: {
    async setCurrentCollection() {
      console.log('Page loading confirm')
      const userId = this.$route.params.Uid
      const collectionid = this.$route.params.Cid
      await Api.get('/users/' + userId + '/collections/' + collectionid)
        .then(response => {
          console.log(response)
          this.currentCollection = response.data.collections
        })
        .catch(error => {
        // todo ERROR HANDLING/DISPLAY ERROR LIKE CREATEPOST SCREEN
          this.posts = []
          console.log(error)
        })
    }
  }

}

</script>
