<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <h4>Create a new Post</h4>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12>
        <form @submit.prevent="onCreatePost">
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field
                name="name"
                label="Name"
                id="name"
                v-model="name"
                required>
              </v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field
                name="image-url"
                label="Image URL"
                id="image-url"
                v-model="picture"
                required>
              </v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <img :src="picture" height="150">
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm-3>
              <v-btn
              :disabled="!formIsValid"
              type="submit">Create Post</v-btn>
            </v-flex>
          </v-layout>
        </form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    data () {
      return {
        name: '',
        picture: ''
      }
    },

    computed: {
      formIsValid () {
        return this.name !== '' &&
        this.picture !== ''
      }
    },

    methods: {
      onCreatePost () {
        const postData = {
          name: this.name,
          picture: this.picture,
          date: new Date()
        }
        this.$store.dispatch('createPost', postData)
      },

      // sendPostToFb () {
      //   const params = {}
      //   params['message'] = this.name
      //   FB.api('me/feed', 'post', params, response => {
      //     if (!response || response.error)
      //       alert(response.error.message)
      //     else
      //       this.onCreatePost()
      //       alert('Post ID: ' + response.id)
      //   });
      // }
    }
  }
</script>
