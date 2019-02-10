<template>
  <div class="container">
    <div id="dashboard">
      <h1>That's the dashboard!</h1>
      <p>You should only get here if you're authenticated!</p>
      <p v-if="email">Your email address: {{ email }}</p>
      <v-btn
        @click="getUserPosts">Get Posts
      </v-btn>
      <table-post />
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import TablePost from "../../components/table/TablePost";
  export default {
    components: {
      'table-post': TablePost
    },

    data() {
      return {
        posts: []
      }
    },

    computed: {
      email () {
        return !this.$store.getters.user ? false : this.$store.getters.user.email
      }
    },

    created () {
      this.$store.dispatch('fetchUser')
    },

    methods: {
      getUserPosts(response) {
        FB.api('me/posts?fields=picture,name,message,comments{created_time,from,message}', res => {
          console.log(`${res}.`)
          let posts = [];
          if (res.error && res.error.code == 2500) {
            return console.log(res.error.message)
          }
          res.data.forEach(item => {
            posts.push({
              id: item.id,
              name: item.name || '',
              picture: item.picture || '',
              comments: item.comments || {},
              status: 'posted'
            });
          });
          this.$store.dispatch('storePosts', posts)
        })
      }
    }
  }
</script>

<style scoped>
  h1, p {
    text-align: center;
  }

  p {
    color: red;
  }

  .form-control {
    width: 50%;
  }
</style>
