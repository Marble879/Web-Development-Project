<template>
  <div>
    <b-container fluid>
      <b-row>
        <b-col class="col-md-4 mt-4 register-img">
          <b-img
            v-bind:src="require('../Images/Artsy-text-top.png')"
            center
            thumbnail
            fluid
            block
            rounded
            alt="logo"
          />
        </b-col>
        <b-col class="col-md-8 px-3 mt-4">
          <b-card
            header="Create your account"
            header-bg-variant="dark"
            header-text-variant="white"
          >
            <b-card-text>
              <b-form @submit="onSubmit">
                <b-form-group
                  id="input-group-username"
                  description="Create username"
                  label="Username"
                  label-for="input-username"
                >
                  <b-form-input
                    id="input-username"
                    v-model="form.username"
                    required
                  ></b-form-input>
                </b-form-group>
                <b-form-group
                  id="input-group-password"
                  description="Create password"
                  label="Password"
                  label-for="input-password"
                >
                  <b-form-input
                    id="input-password"
                    v-model="form.password"
                    type="password"
                    required
                  ></b-form-input>
                </b-form-group>
                <b-form-group
                  id="input-group-bio"
                  description="Describe a bit about yourself (Optional)"
                  label="About you"
                  label-form="input-bio"
                >
                  <b-form-textarea
                    id="input-bio"
                    v-model="form.bio"
                    type="text"
                  ></b-form-textarea>
                </b-form-group>
                <b-form-group
                  id="input-group-icon"
                  label="Upload icon"
                  label-for="input-icon"
                >
                  <b-form-file
                    id="input-icon"
                    label="Upload icon"
                    v-model="form.uploadedIcon"
                    required
                  />
                </b-form-group>
                <b-form-group>
                  <b-button
                    type="submit"
                    variant="danger"
                    v-bind:disabled="acceptableSubmission"
                    >Get started!</b-button
                  >
                </b-form-group>
                <b-form-group>
                  <b-form-text class="text-left"
                    >Already signed up?
                    <b-link to="login"> Log in</b-link>
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
      form: {
        username: '',
        password: '',
        bio: '',
        uploadedIcon: null
      },
      user_id: null,
      hasError: false
    }
  },
  methods: {
    async onSubmit(event) {
      event.preventDefault()
      await this.checkBackendStatus()
      if (!this.hasError) {
        const userFD = await this.createUserFormData()
        await this.submitForm(userFD)
        const collectionFD1 = await this.createFirstCollectionFormData()
        const collectionFD2 = await this.createSecondCollectionFormData()
        await this.postCollectionsFormData(collectionFD1, collectionFD2)
      }
      await this.resetErrorStatus()
    },
    async createUserFormData() {
      const userFD = new FormData()
      userFD.append('username', this.form.username)
      userFD.append('password', this.form.password)
      userFD.append('bio', this.form.bio)
      userFD.append('event', 'icon')
      userFD.append('icon', this.form.uploadedIcon)
      return userFD
    },
    async createFirstCollectionFormData() {
      const collectionFD1 = new FormData()
      collectionFD1.append('title', 'MyPhotos')
      return collectionFD1
    },
    async createSecondCollectionFormData() {
      const collectionFD2 = new FormData()
      collectionFD2.append('title', 'FavoritedImages')
      return collectionFD2
    },

    async submitForm(userFD) {
      await Api.post('/usersAuth/register', userFD)
        .then((response) => {
          this.user_id = response.data._id
          console.log(response)
          this.$router.push({ name: 'login' })
          alert('Registration successful!')
        })
        .catch((error) => {
          const message = error.response.data.message
          console.log(message)
        })
    },

    async postCollectionsFormData(collectionFD1, collectionFD2) {
      await this.submitForm()
      Api.post('/users/' + this.user_id + '/collections', collectionFD1)
        .then((response) => {
          console.log(response)
        })
        .catch((error) => {
          const message = error.response.data.message
          console.log(message)
        })

      Api.post('/users/' + this.user_id + '/collections', collectionFD2)
        .then((response) => {
          console.log(response)
        })
        .catch((error) => {
          const message = error.response.data.message
          console.log(message)
        })
    },
    async checkBackendStatus() {
      await Api.get('/')
        .then((response) => {
          console.log('Backend is avaliable')
        })
        .catch((error) => {
          alert(error)
          this.hasError = true
        })
    },
    async resetErrorStatus() {
      this.hasError = false
    }
  },
  computed: {
    acceptableSubmission() {
      return !(
        this.form.username.length > 0 &&
        this.form.password.length > 0 &&
        !!this.form.uploadedIcon
      )
    }
  }
}
</script>

<style>
@media screen and (max-width: 768px) {
  .register-img {
    display: none;
  }
}
</style>
