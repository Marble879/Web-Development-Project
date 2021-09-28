<template>
    <div>
        <b-container>
            <b-row>
                <b-col>
                    <h1> {{ uploadedImage }} </h1>
                    <img v-bind:src="uploadedImage">
                </b-col>
                <b-col>
                    <h1> This should be form </h1>
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
      uploadedImage: 'Uploaded image should be here',
      show: true
    }
  },
  methods: {
    onSubmit(event) {
      event.preventDefault()
      alert(JSON.stringify(this.form))
    },
    onReset(event) {
      event.preventDefault()
      // Reset our form values
      this.form.email = ''
      this.form.name = ''
      this.form.food = null
      this.form.checked = []
      // Trick to reset/clear native browser form validation state
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    }
  }
}
</script>
