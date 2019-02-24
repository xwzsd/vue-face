<template>
  <div id="table-post">
    <v-app id="inspire">
    <pre> {{ post }} </pre>
    <!-- <pre> {{ comments }} </pre> -->
    <v-data-table :headers="mainHeaders"
                  :items="mainItems"
                  item-key="name"
                  schow-actions
                  expand
                  class="elevation-1">
    <template slot="items" slot-scope="props">
      <tr @click="props.expanded = !props.expanded && getSubItem(props.item.id)">
        <td class="text-xs">{{ props.item.id }}</td>
        <td class="text-xs">{{ props.item.name }}</td>
        <td class="text-xs">{{ props.item.status }}</td>
        <td class="text-xs">
          <v-img :src="props.item.picture"
            max-height="125"
            max-weight="125"
            class="grey darken-4">
          </v-img>
        </td>
      </tr>
    </template>
    <template slot="expand" slot-scope="props">
      <v-card class="elevation-10">
        <v-card-text>

          <v-data-table :headers="subHeaders"
                        :items="subItems"
                        item-key="name"
                        hide-actions
                        class="elevation-10">
            <template slot="items" slot-scope="props">
              <td class="text-xs">{{ props.item.id }}</td>
              <td class="text-xs">{{ props.item.name }}</td>
              <td class="text-xs">{{ props.item.message }}</td>
              <td class="text-xs">{{ props.item.created_time }}</td>
            </template>
          </v-data-table>

        </v-card-text>
      </v-card>
    </template>
   </v-data-table> </v-app>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        mainHeaders: [
          { text: 'ID', value: 'id' },
          { text: 'Name', value: 'name' },
          { text: 'Status', value: 'status' },
          { text: 'Picture', value: 'picture' }
        ],
        subHeaders: [
          { text: 'ID', value: 'id' },
          { text: 'Name', value: 'name' },
          { text: 'Message', value: 'message' },
          { text: 'Created time', value: 'created_time' }
        ],
        subItems: []
      }
    },

    computed: {
      post () {
        return this.localPosts
      },

      localPosts () {
        this.$store.getters.localPosts.map(item => {
          const local_posts = Object.assign({}, item)
          this.mainItems.push(local_posts)
        });
      },

      mainItems () {
        return this.$store.getters.posts.slice(-1)[0].map(item => {
          return {
            id: item.id,
            name: item.name,
            status: item.status,
            picture: item.picture
          };
        });
      }
    },

    created () {
      this.$store.dispatch('fetchPosts');
      this.$store.dispatch('fetchLocalPosts');
    },

    methods: {
      getSubItem (item_id) {
        const result = [];
        this.$store.getters.posts[0]
        .filter(item => item.comments != null && item_id.split('_')[1] === item.comments.data[0].id.split('_')[0])
        .map(item => {
          const copy = Object.assign({}, item.comments.data[0], item.comments.data[0]['from'])
          result.push(copy);
        });
        return this.subItems = result
      },
    }
  }
</script>
<style>
  .theme--light.application {
    background: #ffffff;
  }
</style>
