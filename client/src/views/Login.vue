<template>
  <div class="vue-tempalte">
    <form @submit.prevent="submitForm">
      <h3>Log in</h3>

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

      <button type="submit" class="btn btn-dark btn-lg btn-block">
        Sign Up
      </button>

      <p class="forgot-password text-right">
        Register new account
        <router-link :to="{ name: 'login' }">here!</router-link>
      </p>
    </form>
  </div>
</template>

<script>
import { Api } from '@/Api'

export default {
  data: () => ({
    username: '',
    password: ''
  }),
  methods: {
    submitForm() {
      Api.post('/users/login', {
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
    }
  }
}
</script>
