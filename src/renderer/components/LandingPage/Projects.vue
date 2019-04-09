<template>
  <div class="doc-container doc-clients">
    <div class="doc clients">
      <div class="title"><span>PROJECTS</span></div>
      <ul>
        <li v-for="client in clients" :key="client.id" @click="changeCurrentClientName(client.name)" v-bind:class="currentClient && currentClient.id === client.id ? 'selected' : ''">
          {{ client.name }}
        </li>
      </ul>
      <div class="search-clients">
        <input type="text" class="" v-model="clientsFilter">
        <!-- <div class="last-changed" v-if="currentClient">{{ new Date(currentClient.changed).toLocaleString("pt-PT") }}</div> -->
        <div class="last-changed" v-if="currentClient">{{ dateChanged }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'
  import lang from 'date-fns/locale'

  export default {
    name: 'projects',
    props: [],
    data () {
      return {
        clientsFilter: ''
      }
    },
    computed: {
      ...mapState(['allData', 'currentClientName']),
      // ...mapActions(['changeCurrentClientName']),
      ...mapGetters(['allClients', 'currentClient']),
      clients () {
        return this.allClients(this.clientsFilter)
      },
      dateChanged () {
        if (this.$store.state.config.locale) {
          // let language = require(`date-fns/locale/${this.$store.state.config.locale}`)
          let format = require('date-fns/format')
          return format(
            new Date(this.currentClient.changed),
            'dd/MM/uuuu, HH:mm:ss',
            {locale: lang[this.$store.state.config.locale]}
          )
        } else {
          return null
        }
      }
    },
    mounted () {
    },
    watch: {
    },
    methods: {
      changeCurrentClientName (clientName) {
        this.$store.dispatch('changeCurrentClientName', clientName)
      }
    }
  }
</script>

<style>
</style>
