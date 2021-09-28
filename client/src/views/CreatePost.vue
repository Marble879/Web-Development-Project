<template>
    <div>
        <b-container>
            <h1> Create a Post </h1>
            <b-row>
                <b-col>
                    <h1> {{ form.uploadedImage}} </h1>
                    <img v-bind:src="form.uploadedImage">
                </b-col>
                <b-col>
                    <b-form>
                        <b-form-group id="input-group-image" label="Upload image:" label-for="input-image">

                            <b-form-file id="input-image" label="Upload Image" v-model="form.uploadedImage"
                            v-on:change="onImageSelected"
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
  methods: {
    onSubmit(event) {
      event.preventDefault()
      alert('NEED TO SEND TO BACKEND' + JSON.stringify(this.form))
    },
    onImageSelected(event) {
      console.log(this.form.uploadedImage)
    }
  }
}
</script>
