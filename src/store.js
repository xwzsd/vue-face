import Vue from 'vue'
import Vuex from 'vuex'
import axios from './axios-auth'
import globalAxios from 'axios'

import router from './router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    idToken: null,
    userId: null,
    user: null,
    posts: null,
    local_posts: null
  },

  mutations: {
    authUser (state, userData) {
      state.idToken = userData.token
      state.userId = userData.userId
    },

    storeUser (state, user) {
      state.user = user
    },

    clearAuthData (state) {
      state.idToken = null
      state.userId = null
    },

    storePosts (state, posts) {
      state.posts = posts
    },

    createPost (state, post) {
      state.post = post
    },

    LocalPosts (state, posts) {
      state.local_posts = posts
    }
  },

  actions: {
    setLogoutTimer ({commit}, expirationTime) {
      setTimeout(() => {
        commit('clearAuthData')
      }, expirationTime * 1000)
    },

    signup ({commit, dispatch}, authData) {
      axios.post('/signupNewUser?key=AIzaSyCWR2YlFr-N2vWdn0tDOslnICaU17QhARU', {
        email: authData.email,
        password: authData.password,
        returnSecureToken: true
      })
        .then(res => {
          console.log(res)
          commit('authUser', {
            token: res.data.idToken,
            userId: res.data.localId
          })
          const now = new Date()
          const expirationDate = new Date(now.getTime() + res.data.expiresIn * 1000)
          localStorage.setItem('token', res.data.idToken)
          localStorage.setItem('userId', res.data.localId)
          localStorage.setItem('expirationDate', expirationDate)
          dispatch('storeUser', authData)
          dispatch('setLogoutTimer', res.data.expiresIn)
        })
        .catch(error => console.log(error))
    },

    login ({commit, dispatch}, authData) {
      axios.post('/verifyPassword?key=AIzaSyCWR2YlFr-N2vWdn0tDOslnICaU17QhARU', {
        email: authData.email,
        password: authData.password,
        returnSecureToken: true
      })
        .then(res => {
          console.log(res)
          const now = new Date()
          const expirationDate = new Date(now.getTime() + res.data.expiresIn * 1000)
          localStorage.setItem('token', res.data.idToken)
          localStorage.setItem('userId', res.data.localId)
          localStorage.setItem('expirationDate', expirationDate)
          commit('authUser', {
            token: res.data.idToken,
            userId: res.data.localId
          })
          dispatch('setLogoutTimer', res.data.expiresIn)
        })
        .catch(error => console.log(error))
    },

    tryAutoLogin ({commit}) {
      const token = localStorage.getItem('token')
      if (!token) {
        return
      }
      const expirationDate = localStorage.getItem('expirationDate')
      const now = new Date()
      if (now >= expirationDate) {
        return
      }
      const userId = localStorage.getItem('userId')
      commit('authUser', {
        token: token,
        userId: userId
      })
    },

    logout ({commit}) {
      commit('clearAuthData')
      localStorage.removeItem('expirationDate')
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      router.replace('/signin')
    },

    storeUser ({commit, state}, userData) {
      if (!state.idToken) {
        return
      }
      globalAxios.post('/users.json' + '?auth=' + state.idToken, userData)
        .then(res => console.log(res))
        .catch(error => console.log(error))
    },

    fetchUser ({commit, state}) {
      if (!state.idToken) {
        return
      }
      globalAxios.get('/users.json' + '?auth=' + state.idToken)
        .then(res => {
          console.log(res)
          const data = res.data
          const users = []
          for (let key in data) {
            const user = data[key]
            user.id = key
            users.push(user)
          }
          console.log(users)
          commit('storeUser', users.slice(-1)[0])
        })
        .catch(error => console.log(error))
    },

    fetchPosts ({commit, state}){
      if (!state.idToken) {
        return
      }
      globalAxios.get('/posts.json' + '?auth=' + state.idToken)
        .then(res => {
          console.log(res)
          const data = res.data
          const posts = []
          for (let key in data) {
            const post = data[key]
            post.id = key
            posts.push(post)
          }
          console.log(posts)
          commit('storePosts', posts)
        })
        .catch(error => console.log(error))
    },

    fetchLocalPosts ({commit, state}){
      if (!state.idToken) {
        return
      }
      globalAxios.get('/post.json' + '?auth=' + state.idToken)
        .then(res => {
          console.log(res)
          const data = res.data
          const posts = []
          for (let key in data) {
            const post = data[key]
            post.id = key
            posts.push(post)
          }
          console.log(posts)
          commit('LocalPosts', posts)
        })
        .catch(error => console.log(error))
    },

    storePosts ({commit, state}, posts) {
      if (!state.idToken) {
        return
      }
      globalAxios.post('/posts.json' + '?auth=' + state.idToken, posts)
        .then(res => console.log(res))
        .catch(error => console.log(error))
    },

    createPost ({commit, state}, payload) {
      const post = {
        name: payload.name,
        imageUrl: payload.imageUrl,
        date: payload.date,
        status: 'not posted'
      }
      if (!state.idToken) {
        return
      }
      globalAxios.post('/post.json' + '?auth=' + state.idToken, post)
        .then(res => console.log(res))
        .catch(error => console.log(error))
    }
  },

  getters: {
    user (state) {
      return state.user
    },

    isAuthenticated (state) {
      return state.idToken !== null
    },

    posts (state) {
      return state.posts
    },

    localPosts (state) {
      return state.local_posts
    }
  }
})
