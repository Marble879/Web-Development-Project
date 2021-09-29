<template>
    <div>
        <b-container>
            <h1> Create a Post </h1>
            <b-row>
                <b-col>

                    <b-img v-if="hasImage" v-bind:src="previewImage" center thumbnail fluid block rounded alt='Image preview'/>

                </b-col>
                <b-col>
                    <b-form>
                        <b-form-group id="input-group-image" label="Upload image:" label-for="input-image">

                            <b-form-file id="input-image" label="Upload Image"
                            v-model="form.uploadedImage"
                            required/>

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
                            v-model.lazy="form.description"
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

                        <b-button type="submit" variant="primary">Post</b-button>
                    </b-form>
                </b-col>
            </b-row>
        </b-container>

    </div>
</template>

<script>
// @ is an alias to /src
// import { Api } from '@/Api'

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
      show: true
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
        console.log('here')
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
      alert('NEED TO SEND TO BACKEND' + JSON.stringify(this.form))
    }
  }
}
</script>
