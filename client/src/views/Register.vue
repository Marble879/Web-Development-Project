<template>
  <div class="vue-tempalte">
    <form @submit.prevent="submitForm">
      <h3>Registration</h3>

      <div class="form-group">
        <label>Username</label>
        <input
          type="text"
          class="form-control form-control-lg"
          v-model="username"
          placeholder="Username"
        />
      </div>

      <div class="form-group">
        <label>Password</label>
        <input
          type="password"
          class="form-control form-control-lg"
          v-model="password"
          placeholder="Password"
        />
      </div>

      <div class="form-group">
        <label>Bio</label>
        <input
          type="text"
          class="form-control form-control-lg"
          v-model="bio"
          placeholder="Describe a bit about yourself (Optional)"
        />
      </div>

      <button type="submit" class="btn btn-dark btn-lg btn-block">
        Sign Up
      </button>

      <p class="forgot-password text-right">
        Already registered
        <router-link :to="{ name: 'login' }">sign in?</router-link>
      </p>
    </form>
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
      icon: ''
    }
  },
  methods: {
    submitForm() {
      Api.post('/usersAuth/register', {
        username: this.username,
        password: this.password,
        bio: this.bio,
        icon: this.icon
      })
        .then(() => {
          console.log('Registration Successful')
          this.$router.push({ name: 'login' })
        })
        .catch((error) => {
          const message = error.response.data.message
          console.log(message)
        })
    }
  }
}
</script>
