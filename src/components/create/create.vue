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
                name="title"
                label="Title"
                id="title"
                v-model="title"
                required>
              </v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field
                name="description"
                label="Description"
                id="description"
                v-model="description"
                required>
              </v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field
                name="url"
                label="URL"
                id="url"
                v-model="url"
                required>
              </v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm-3>
              <v-btn
                :disabled="!formIsValid"
                type="submit">
                <social-sharing :url='url'
                                :quote='title'
                                :description='description'
                                inline-template
                                hashtags="">
                  <network
                    network="facebook"
                    class="fa fa-fw fa-facebook">Create Post
                  </network>
                </social-sharing>
              </v-btn>
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
        title: '',
        description: '',
        url: ''
      }
    },

    computed: {
      formIsValid () {
        return this.title !== '' &&
        this.description !== '' &&
        this.url !== ''
      }
    },

    methods: {
      onCreatePost () {
        const postData = {
          title: this.title,
          description: this.description,
          url: this.url,
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
