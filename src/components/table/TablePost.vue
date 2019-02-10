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
      <tr @click="props.expanded = !props.expanded">
        <td class="text-xs">{{ props.item.id }}</td>
        <td class="text-xs">{{ props.item.name }}</td>
        <td class="text-xs">{{ props.item.status }}</td>
        <td class="text-xs">
          <img :src="props.item.picture" />
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
        ]
      }
    },

    computed: {
      post () {
        return this.localPosts
      },

      localPosts () {
        return this.$store.getters.localPosts.map(item => {
          return {
            id: item.id,
            name: item.name,
            status: item.status,
            picture: item.imageUrl
          };
        });
      },

      mainItems () {
        return this.$store.getters.posts[0].map(item => {
          return {
            id: item.id,
            name: item.name,
            status: item.status,
            picture: item.picture
          };
        });
      },

      subItems (item) {
        return this.$store.getters.posts[0]
        .filter(item => item.comments != null && item.id.split('_')[1] === item.comments.data[0].id.split('_')[0])
        .map(item => {
          return {
            id: item.comments.data[0].id,
            name: item.comments.data[0].from.name,
            message: item.comments.data[0].message,
            created_time: item.comments.data[0].created_time
          };
        });
      }
    },

    created () {
      this.$store.dispatch('fetchPosts');
      this.$store.dispatch('fetchLocalPosts');
    },

    methods: {

    }
  }
</script>
