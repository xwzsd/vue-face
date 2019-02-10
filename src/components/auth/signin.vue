<template>
  <div id="signin">
    <div class="signin-form">
      <form @submit.prevent="onSubmit">
        <div class="input">
          <label for="email">Mail</label>
          <input
            type="email"
            id="email"
            v-model="email">
        </div>
        <div class="input">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            v-model="password">
        </div>
        <div class="submit">
          <button type="submit">Submit</button>
        </div>
      </form>
      <fb-signin-button type="submit"
        :params="fbSignInParams"
        @success="onSignInSuccess"
        @error="onSignInError">
        Sign in with Facebook
      </fb-signin-button>
    </div>
  </div>
</template>

<script>
  import Vue from "vue";
  import FBSignInButton from 'vue-facebook-signin-button'
  Vue.use(FBSignInButton)
  export default {
    components: {
    },

    data () {
      return {
        email: '',
        password: '',
          fbSignInParams: {
          scope: 'email,user_likes',
          return_scopes: true
        }
      }
    },

    created () {
      window.fbAsyncInit = function() {
        FB.init({
          appId      : process.env.VUE_APP_FB_APP_ID,
          cookie     : true,
          xfbml      : true,
          version    : 'v3.2'
        });
      };
      (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    },

    methods: {
      onSignInSuccess (response) {
        FB.api('/me?fields=name,email', fb_user => {
          console.log(`Hello, ${fb_user.name}.`)
          const formData = {
            email: fb_user.email,
            password: fb_user.id,
            confirmPassword: fb_user.id
          }
          this.$store.dispatch('login', { email: formData.email, password: formData.password })
            .then(() => {
            this.$router.push('/dashboard')
          })
          this.$store.dispatch('signup', formData)
        })
      },

      onSignInError (error) {
        console.log('ERROR', error)
      },

      onSubmit () {
        const formData = {
          email: this.email,
          password: this.password,
        }
        console.log(formData)
        this.$store.dispatch('login', {email: formData.email, password: formData.password})
        .then(() => {
          this.$router.push('/dashboard')
        })
      }
    }
  }
</script>

<style scoped>
  .signin-form {
    width: 400px;
    margin: 30px auto;
    border: 1px solid #eee;
    padding: 20px;
    box-shadow: 0 2px 3px #ccc;
  }

  .input {
    margin: 10px auto;
  }

  .input label {
    display: block;
    color: #4e4e4e;
    margin-bottom: 6px;
  }

  .input input {
    font: inherit;
    width: 100%;
    padding: 6px 12px;
    box-sizing: border-box;
    border: 1px solid #ccc;
  }

  .input input:focus {
    outline: none;
    border: 1px solid #521751;
    background-color: #eee;
  }

  .submit button {
    border: 1px solid #521751;
    color: #521751;
    padding: 10px 20px;
    font: inherit;
    cursor: pointer;
  }

  .submit button:hover,
  .submit button:active {
    background-color: #521751;
    color: white;
  }

  .submit button[disabled],
  .submit button[disabled]:hover,
  .submit button[disabled]:active {
    border: 1px solid #ccc;
    background-color: transparent;
    color: #ccc;
    cursor: not-allowed;
  }
  .fb-signin-button {
    margin: 10px auto;
    display: inline-block;
    padding: 4px 8px;
    border-radius: 3px;
    background-color: #4267b2;
    color: #fff;
  }
</style>
