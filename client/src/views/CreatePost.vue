<template>
    <div>
        <b-container>
          <h2> Post Creation Page</h2>
            <b-row v-on:change="resetErrorStatus" class="vh-100 text-center" align-v="center" align-h="center">
                <b-col>

                    <b-img v-if="hasImage" v-bind:src="previewImage" center thumbnail fluid block rounded alt='Image preview'/>
                    <b-img v-else v-bind:src="require('../Images/DefaultPostImagePreview.png')" center thumbnail fluid block rounded height="500em" width="500em" alt='Image preview'/>

                </b-col>
                <b-col>
                    <b-form @submit="onSubmit">
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
                        <b-form-group id="select-collection" label="Select collection:" label-for="select-collection">

                            <b-form-select
                            id="select-collection"
                            v-model="form.collection"
                            :options="collectionOptions"/>

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

<style></style>

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
        collection: null,
        tag: null
      },
      collectionOptions: [{
        value: null,
        text: 'Please select a collection'
      },
      {
        value: 'NOTE: WILL HAVE TO GET THESE COLLECTIONS FROM THE USER!!!',
        text: 'NOTE: WILL HAVE TO GET THESE COLLECTIONS FROM THE USER!!!'
      },
      {
        value: 'tempcoll1',
        text: 'tempcoll1'
      },
      {
        value: 'tempcoll2',
        text: 'tempcoll2'
      }],
      tagOptions: [{
        value: null,
        text: 'Please select a tag'
      },
      {
        value: 'tag1',
        text: 'tag1'
      },
      {
        value: 'tag2',
        text: 'tag2'
      }],
      previewImage: null,
      show: true,
      hasError: false
    }
  },
  computed: {
    hasImage() {
      return !!this.form.uploadedImage // !! used to return true or false correctly
    }
  },
  watch: {
    'form.uploadedImage': function (newValue, oldValue) {
      console.log(this.form.uploadedImage)
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
    onSubmit(event) {
      event.preventDefault()
      const fd = this.createFormData()
      this.postFormData(fd)
    },
    resetForm() {
      this.form.uploadedImage = null
      this.form.title = ''
      this.form.description = ''
      this.form.collection = null
      this.form.tag = null
    },
    createFormData() {
      const fd = new FormData()
      // fd.append('user_id', '6154972ae17ab3d3ea3eb4aa') // This line is for testing purposes to ensure that posting posts actually works. The user_id will need to be retreived dynamically from user currently logged in.
      fd.append('title', this.form.title)
      fd.append('description', this.form.description)
      fd.append('tag', this.form.tag)
      fd.append('event', 'post')
      fd.append('image', this.form.uploadedImage)
      return fd
    },
    postFormData(fd) {
      Api.post('/posts', fd)
        .then(response => {
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
    }
  }
}
</script>
