<template>
    <div>
        <b-container fluid="md">
          <b-jumbotron fluid header="Create a Post"></b-jumbotron>
            <b-row v-on:change="resetErrorStatus" class="vh-50 text-center" align-v="center" align-h="center">
                <b-col cols="12" sm="12" md="5">

                    <b-img v-if="hasImage" v-bind:src="previewImage" center thumbnail fluid block rounded alt='Image preview'/>
                    <b-img v-else v-bind:src="require('../Images/DefaultPostImagePreview.png')" center thumbnail fluid block rounded height="500em" width="500em" alt='Image preview'/>

                </b-col>
                <b-col cols="12" sm="12" md="7">
                    <b-form @submit="onSubmit" class="vh-3">
                        <b-form-group id="input-group-image" label="Upload image:" label-for="input-image">

                            <b-form-file id="input-image" label="Upload Image"
                            v-model="form.uploadedImage"
                            required />

                        </b-form-group>
                        <b-form-group id="input-group-title" label="Insert title:" label-for="input-title">

                            <b-form-input
                            id="input-title"
                            v-model="form.title"
                            placeholder="Enter post title"
                            required/>

                        </b-form-group>
                        <b-form-group id="input-group-description" label="Insert description:" label-for="input-description">

                            <b-form-textarea
                            id="input-description"
                            v-model="form.description"
                            type="text"
                            placeholder="Enter description"/>

                        </b-form-group>
                            <b-form-group id="select-tag" label="Select tag:" label-for="select-tag">

                            <b-form-select
                            id="select-tag"
                            v-model="form.tag"
                            :options="tagOptions"
                            placeholder="Enter description"
                            required/>

                        </b-form-group>

                        <b-button type="submit" variant="primary" v-bind:disabled="hasError">Post</b-button>
                    </b-form>
                </b-col>
            </b-row>
        </b-container>

    </div>
</template>

<style scoped>

form {
  border-width: 0.25rem;
  border: solid;
  border-radius: 1rem;
  padding: 2rem;
}

</style>

<script>
// @ is an alias to /src
import { Api } from '@/Api'

// NOTE: Image upload and preview was referenced from: https://github.com/bootstrap-vue/bootstrap-vue/issues/4382

const base64Encode = data =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(data)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })

export default {
  name: 'create',
  data() {
    return {
      form: {
        uploadedImage: null,
        title: '',
        description: '',
        tag: null
      },
      tagOptions: [{
        value: null,
        text: 'Please select a tag'
      },
      {
        value: 'cat',
        text: 'cat'
      },
      {
        value: 'dog',
        text: 'dog'
      },
      {
        value: 'landscape',
        text: 'landscape'
      },
      {
        value: 'paintings',
        text: 'paintings'
      }],
      previewImage: null,
      show: true,
      hasError: false,
      userId: null,
      defaultCollection: null,
      postId: null
    }
  },
  computed: {
    hasImage() {
      return !!this.form.uploadedImage // !! used to return true or false correctly
    }
  },
  watch: {
    'form.uploadedImage': function (newValue, oldValue) {
      if (newValue !== oldValue) {
        if (newValue) {
          base64Encode(newValue).then(value => {
            this.previewImage = value
          })
            .catch(() => {
              this.previewImage = null
            })
        } else {
          this.previewImage = null
        }
      }
    }
  },
  methods: {
    async onSubmit(event) {
      event.preventDefault()
      await this.checkBackendStatus()
      if (!this.hasError) {
        await this.getUserId()
        await this.getCollectionId()
        if (!this.hasError) {
          const fd = await this.createFormData()
          await this.postFormData(fd)
          if (!this.hasError) { await this.addToDefaultCollection() }
        }
      }
    },
    resetForm() {
      this.form.uploadedImage = null
      this.form.title = ''
      this.form.description = ''
      this.form.tag = null
    },
    async createFormData() {
      const fd = new FormData()
      fd.append('user_id', this.userId)
      fd.append('title', this.form.title)
      fd.append('description', this.form.description)
      fd.append('tags', this.form.tag)
      fd.append('event', 'post')
      fd.append('image', this.form.uploadedImage)
      return fd
    },
    async postFormData(fd) {
      await Api.post('/posts', fd)
        .then(response => {
          console.log()
          this.postId = response.data._id
          alert('Successful submission!')
          this.resetForm()
        })
        .catch(error => {
          alert(error.response.data.message)
          this.hasError = true
        })
    },
    resetErrorStatus() {
      this.hasError = false
    },
    async getUserId() {
      const token = window.localStorage.getItem('auth')
      await Api.get('/usersAuth/data', {
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
        .then(response => {
          this.userId = response.data.authorizedData.id._id
        })
        .catch(error => {
          if (error.response.status === 403) {
            alert('Error, not logged in!')
          } else {
            alert(error.response.data.message)
          }
          this.hasError = true
        })
    },
    async addToDefaultCollection() {
      await Api.patch('/collections/' + this.defaultCollection, {
        post_id: this.postId
      })
        .then(response => {
          console.log(response)
        })
        .catch(error => {
          console.log(error)
          alert(error.response.data.message)
          this.hasError = true
        })
    },
    async getCollectionId() {
      await Api.get('/users/' + this.userId)
        .then(response => {
          console.log(response.data.collections[0])
          this.defaultCollection = response.data.collections[0]
        })
        .catch(error => {
          console.log(error)
          alert(error.response.data.message)
          this.hasError = true
        })
    },
    async checkBackendStatus() {
      await Api.get('/')
        .then((response) => {
          console.log('Backend is available')
        })
        .catch((error) => {
          alert(error)
          this.hasError = true
        })
    }
  }
}
</script>
