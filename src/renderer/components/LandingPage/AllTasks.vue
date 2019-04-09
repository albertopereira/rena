<template>
  <div>
    <div v-for="(task, idx) in allTasks" :key="idx" class="task-block">
      <div class="task-c task-priority">{{ task.priority }}</div>
      <div class="task-c task-client">{{ task.client }}</div>
      <div class="task-c task-text">{{ task.text }}</div>
    </div>
  </div>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'

  export default {
    components: {
    },
    data () {
      return {
      }
    },
    computed: {
      ...mapState(['config', 'currentClientName']),
      ...mapGetters(['allClients', 'currentClient']),
      allTasksGroups () {
        return this.config.allTasksGroups ? this.config.allTasksGroups : []
      },
      allTasks () {
        const allT = []
        let that = this

        this.allClients().forEach(e => {
          e.tasks.forEach((t) => {
            if (that.allTasksGroups.includes(t.name)) {
              t.tasks.forEach((tt) => {
                tt.client = e.name
                allT.push(tt)
              })
            }
          })
        })

        return allT.sort((a, b) => b.priority - a.priority)
      }
    },
    mounted () {
    },
    methods: {
    }
  }
</script>

<style scoped>

.task-block{
  display: flex;
}

.task-c{
  display: inline-block;
  min-width: 20px;
  cursor: text;
}

.task-client{
  min-width: 100px;
}

</style>
