<template>
    <b-container>
        <b-container>
          <h1>Collection name</h1>
        </b-container>

        <b-row>
          <b-col v-for="post in posts" v-bind:key="post._id" lg="4" class="mb-3">
            <b-card v-bind:title="post.title"
            v-bind:img-src="post.image"
            img-alt="Image"
            img-top>
            <b-button href="/" variant="primary">Go to post</b-button>
            </b-card>
          </b-col>
        </b-row>
    </b-container>
</template>

<script>

export default {
  name: 'InsideCollection',
  data() {
    return {
      posts: [
        {
          _id: '613885d342fb9851638791b5',
          title: 'testT1',
          image: 'http://localhost:3000/uploads/1633296835563.jpg'
        },
        {
          _id: '6138862842fb9851638791b7',
          title: 'testT2',
          image: 'http://localhost:3000/uploads/1633296835563.jpg'
        },
        {
          _id: '6138862842fb9851638791b7',
          title: 'testT2',
          image: 'http://localhost:3000/uploads/1633296835563.jpg'
        },
        {
          _id: '6138862842fb9851638791b7',
          title: 'testT2',
          image: 'http://localhost:3000/uploads/1633296857055.jpg'
        },
        {
          _id: '6138862842fb9851638791b7',
          title: 'testT2',
          image: 'http://localhost:3000/uploads/1633296857055.jpg'
        },
        {
          _id: '6138862842fb9851638791b7',
          title: 'testT2',
          image: 'http://localhost:3000/uploads/1633296857055.jpg'
        },
        {
          _id: '6138862842fb9851638791b7',
          title: 'testT2',
          image: 'http://localhost:3000/uploads/1633296835563.jpg'
        },
        {
          _id: '6138862842fb9851638791b7',
          title: 'testT2',
          image: 'http://localhost:3000/uploads/1633296835563.jpg'
        },
        {
          _id: '6138862842fb9851638791b7',
          title: 'testT2',
          image: 'http://localhost:3000/uploads/1633296835563.jpg'
        }
      ]
    }
  }
}

</script>
