<template>
    <b-container>
        <b-row>
          <b-col v-for="post in posts" v-bind:key="post._id" lg="4">
            <b-img center thumbnail fluid block rounded v-bind:src="post.image"/>
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
          image: 'http://localhost:3000/uploads/1633292779196.jpg'
        },
        {
          _id: '6138862842fb9851638791b7',
          title: 'testT2',
          image: 'http://localhost:3000/uploads/1633292904721.jpg'
        },
        {
          _id: '6138862842fb9851638791b7',
          title: 'testT2',
          image: 'http://localhost:3000/uploads/1633292904721.jpg'
        },
        {
          _id: '6138862842fb9851638791b7',
          title: 'testT2',
          image: 'http://localhost:3000/uploads/1633292904721.jpg'
        },
        {
          _id: '6138862842fb9851638791b7',
          title: 'testT2',
          image: 'http://localhost:3000/uploads/1633292904721.jpg'
        },
        {
          _id: '6138862842fb9851638791b7',
          title: 'testT2',
          image: 'http://localhost:3000/uploads/1633292904721.jpg'
        },
        {
          _id: '6138862842fb9851638791b7',
          title: 'testT2',
          image: 'http://localhost:3000/uploads/1633292904721.jpg'
        },
        {
          _id: '6138862842fb9851638791b7',
          title: 'testT2',
          image: 'http://localhost:3000/uploads/1633292904721.jpg'
        },
        {
          _id: '6138862842fb9851638791b7',
          title: 'testT2',
          image: 'http://localhost:3000/uploads/1633292904721.jpg'
        }
      ]
    }
  }
}

</script>
