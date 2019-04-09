<template>
  <div class="doc-container doc-system-info">
    <div class="doc system-info">
      <div class="title"><span>SYSTEM</span></div>
      <div class="time">{{ whatTime }}</div>
      <div>{{ vIp }}</div>
      <div class="new-project"><input type="text" @keyup.enter="addProject" v-model="projectToAdd"></div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import axios from 'axios'
  const si = require('systeminformation')

  export default {
    name: 'systemInfo',
    props: [],
    data () {
      return {
        vTime: '00 : 00 : 00',
        vIp: '0.0.0.0',
        projectToAdd: ''
      }
    },
    computed: {
      ...mapState(['allData']),
      whatTime () {
        return this.vTime
      }
    },
    mounted () {
      setInterval(() => {
        const a = new Date(si.time().current)
        this.vTime = `${('0' + a.getHours()).slice(-2)} : ${('0' + a.getMinutes()).slice(-2)} : ${('0' + a.getSeconds()).slice(-2)}`
      }, 1000)

      axios
        .get('https://api.ipify.org?format=json')
        .then(({ data }) => {
          this.vIp = data.ip
        })
        .catch((err) => { console.log(err) })
    },
    watch: {
    },
    methods: {
      addProject () {
        const maxId = Math.max.apply(Math, this.allData.clients.map(function (o) { return o.id }))

        this.$store.dispatch('addNewProject', {name: this.projectToAdd, id: maxId, changed: +(new Date())})
        this.$store.dispatch('changeCurrentClientName', this.projectToAdd)

        this.projectToAdd = ''

        this.$emit('save-config')
      }
    }
  }
</script>

<style>
</style>
