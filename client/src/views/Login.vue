<template>
  <div>
    <b-container fluid>
      <b-row>
        <b-col class="col-md-4 mt-4 login-img">
          <b-img
            v-bind:src="require('../Images/Artsy.png')"
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
            header="Log in to account"
            header-bg-variant="dark"
            header-text-variant="white"
          >
            <b-card-text>
              <b-form @submit="onSubmit">
                <b-form-group
                  description="Enter your username"
                  label="Username"
                >
                  <b-form-input v-model="username" required></b-form-input>
                </b-form-group>
                <b-form-group
                  description="Enter your password"
                  label="Password"
                >
                  <b-form-input
                    v-model="password"
                    type="password"
                    required
                  ></b-form-input>
                </b-form-group>
                <b-form-group>
                  <b-button
                    type="submit"
                    variant="danger"
                    :disabled="acceptableSubmission"
                    >Log in</b-button
                  >
                </b-form-group>
                <b-form-group>
                  <b-form-text class="text-left"
                    >New to Artsy?
                    <b-link to="register"> Sign Up</b-link>
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
  data: () => ({
    username: '',
    password: '',
    hasError: false
  }),
  methods: {
    async onSubmit(event) {
      event.preventDefault()
      await this.checkBackendStatus()
      if (!this.hasError) {
        await this.submitForm()
      }
      await this.resetErrorStatus()
    },
    async submitForm() {
      await Api.post('/usersAuth/login', {
        username: this.username,
        password: this.password
      })
        .then((response) => {
          window.localStorage.setItem('auth', response.data.token)
          alert('Login Successful')
          this.$router.push({ name: 'home' })
        })
        .catch((error) => {
          alert(error.response.data.message)
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
      return !(this.username.length > 0 && this.password.length > 0)
    }
  }
}
</script>

<style>
@media screen and (max-width: 768px) {
  .login-img {
    display: none;
  }
}
</style>
