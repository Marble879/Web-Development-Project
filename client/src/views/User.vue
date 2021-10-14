<template>
  <b-container fluid="md">
    <b-row class="justify-content-center">
      <b-col md="5">
        <b-card-group>
          <b-card>
            <b-img
              src="https://i.ibb.co/K78GVMR/UserIcon.png"
              width="100"
              img-alt="User icon"
              img-top
              class="rounded-circle"
            >
            </b-img>
            <b-card-text class="m-3 username">{{ username }}</b-card-text>
            <b-card-text class="bio"
              ><strong>Bio: </strong>{{ bio }}</b-card-text
            >
          </b-card>
        </b-card-group>
      </b-col>
    </b-row>
    <h4 class="m-3 text-dark font-weight-bold change-header">Collections</h4>
    <b-row class="justify-content-center">
      <b-col sm="6" mb="4">
        <b-card-group deck>
          <b-card
            v-for="collection in collections"
            v-bind:key="collection._id"
            v-bind:title="collection.title"
            img-src="https://i.postimg.cc/Ls0Pf72C/folder-icons.png"
            img-alt="Collection icon"
            img-top
          >
          <b-button
                v-on:click="enterCollection(collection._id)"
                type="submit"
                title="Delete Post"
                variant="primary"
                v-bind:disabled="noPostModifyPermission"
                class="text-center">
                  Enter
              </b-button>

          </b-card>
        </b-card-group>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
// @ is an alias to /src
import { Api } from '@/Api'

export default {
  name: 'user',
  props: ['collection'],
  data() {
    return {
      username: '',
      bio: '',
      collections: [],
      userId: null
    }
  },
  async mounted() {
    await this.checkBackendStatus()
    await this.getUserInfo()
    await this.getCollections()
  },
  methods: {
    async getUserInfo() {
      const token = window.localStorage.getItem('auth')
      await Api.get('/usersAuth/data', {
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
        .then((response) => {
          this.username = response.data.authorizedData.id.username
          this.bio = response.data.authorizedData.id.bio
          this.userId = response.data.authorizedData.id._id
          console.log(response)
        })
        .catch((error) => {
          if (error.response.status === 403) {
            alert('Error, not logged in!')
          } else {
            alert(error.response.data.message)
          }
        })
    },
    async getCollections() {
      await this.getUserInfo()
      Api.get('/users/' + this.userId + '/collections')
        .then((response) => {
          console.log(response)
          this.collections = response.data.collections
        })
        .catch((error) => {
          alert(error.response.data.message)
          console.log(error)
        })
    },
    async checkBackendStatus() {
      Api.get('/')
        .then((response) => {
          console.log('Backend is avaliable')
        })
        .catch((error) => {
          alert(error)
        })
    },
    enterCollection(CiD) {
      this.$router.push({ name: 'inside a collection', params: { Uid: this.userId, Cid: CiD } })
    }
  }
}
</script>

<style>
.username {
  font-family: inherit;
  font-size: 2rem;
  font-weight: 700;
}

.bio {
  font-family: inherit;
  font-size: 1.1rem;
}

@media screen and (max-width: 768px) {
  .change-header {
    font-size: 1.2rem;
  }
}
</style>
