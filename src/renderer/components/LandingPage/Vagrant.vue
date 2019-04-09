<template>
  <div class="vagrant-container">
    <div v-if="!vagrantStatus.length" class="lds-dual-ring"></div>
    <ul>
      <li v-for="v in vagrantStatus" :key="v.id">
        {{ v.id }}  {{ v.name }}  {{ v.m }} {{ v.status }}  {{ v.dir }}  
        <span v-if="v.color === 'green'" class="green" @click="stopVagrant(v.id)"></span>
        <span v-else-if="v.color === 'yellow'">Stopping...</span>
        <span v-else-if="v.color === 'blue'">Starting...</span>
        <span v-else class="red" @click="startVagrant(v.id)"></span>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    components: {
    },
    data () {
      return {
        vagrantStatus: []
      }
    },
    computed: {
    },
    mounted () {
      this.checkVagrant()
      setInterval(() => {
        this.checkVagrant()
      }, 100000)
    },
    methods: {
      checkVagrant () {
        const exec = require('child_process').exec

        exec(`vagrant global-status`, (error, stdout, stderr) => {
          if (error !== null) {
            console.log(error)
          }

          const n = stdout.split('\n')
          this.vagrantStatus = []

          n.forEach(e => {
            let s = {}
            const l = e.replace(/\s\s+/g, ' ').split(' ')
            if (l[0].length === 7 && l.length === 6) {
              s = {
                id: l[0],
                name: l[1],
                m: l[2],
                status: l[3],
                dir: l[4],
                color: l[3] === 'running' ? 'green' : 'red'
              }
              this.vagrantStatus.push(s)
            }
          })
        })
      },
      stopVagrant (id) {
        this.vagrantStatus.filter((e) => e.id === id)[0].color = 'yellow'

        const exec = require('child_process').exec

        exec(`vagrant halt ${id}`, (error, stdout, stderr) => {
          if (error !== null) {
            console.log(error)
          }
          this.vagrantStatus.filter((e) => e.id === id)[0].color = 'red'

          console.log(stdout)
        })
      },
      startVagrant (id) {
        this.vagrantStatus.filter((e) => e.id === id)[0].color = 'blue'

        const exec = require('child_process').exec

        exec(`vagrant up ${id}`, (error, stdout, stderr) => {
          if (error !== null) {
            console.log(error)
          }
          this.vagrantStatus.filter((e) => e.id === id)[0].color = 'green'

          console.log(stdout)
        })
      }
    }
  }
</script>

<style scoped>
.vagrant-container ul li{
  list-style-type: none;
}
</style>
