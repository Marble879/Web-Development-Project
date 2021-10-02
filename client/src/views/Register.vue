<template>
  <div>
    <b-container fluid>
      <b-row class="justify-content-md-center mt-4">
        <b-col col md="6">
          <b-card
            header="Create your account"
            header-bg-variant="primary"
            header-text-variant="white"
          >
            <b-card-text>
              <b-form @submit.prevent="submitForm">
                <b-form-group description="Create username" label="Username">
                  <b-form-input v-model="username" required></b-form-input>
                </b-form-group>
                <b-form-group description="Create password" label="Password">
                  <b-form-input
                    v-model="password"
                    type="password"
                    required
                  ></b-form-input>
                </b-form-group>
                <b-form-group
                  description="Describe a bit about yourself (Optional)"
                  label="About you"
                >
                  <b-form-input v-model="bio"></b-form-input>
                </b-form-group>
                <b-form-group>
                  <b-button
                    type="submit"
                    variant="outline-primary"
                    :disabled="acceptableSubmission"
                    >Get started, it's free!</b-button
                  >
                </b-form-group>
                <b-form-group>
                  <b-form-text class="text-left"
                    >Already registered:
                    <b-link to="login"> Sign in</b-link>
                  </b-form-text>
                </b-form-group>
              </b-form>
            </b-card-text>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { Api } from '@/Api'

export default {
  name: 'register',
  data() {
    return {
      username: '',
      password: '',
      bio: '',
      icon: '',
      collections: []
    }
  },
  methods: {
    async postCollections() {
      await Api.post('/users/:id/collections', {
        title: 'MyPhotos',
        thumbnail: ''
      })
        .then((response) => {
          console.log(response)
          this.collections.push(response.data._id)
        })
        .catch((error) => {
          const message = error.response.data.message
          console.log(message)
        })

      await Api.post('/users/:id/collections', {
        title: 'FavoritedImages',
        thumbnail: ''
      })
        .then((response) => {
          console.log(response)
          this.collections.push(response.data._id)
        })
        .catch((error) => {
          const message = error.response.data.message
          console.log(message)
        })
    },

    async submitForm() {
      await this.postCollections()
      Api.post('/usersAuth/register', {
        username: this.username,
        password: this.password,
        bio: this.bio,
        icon: this.icon,
        collections: this.collections
      })
        .then(() => {
          this.$router.push({ name: 'login' })
          alert('Registration successful!')
        })
        .catch((error) => {
          alert(error.response.data.message)
        })
    }
  },
  computed: {
    acceptableSubmission() {
      return !(this.username.length > 0 && this.password.length > 0)
    }
  }
}
</script>
