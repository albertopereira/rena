<template>
  <div>
    <div v-for="(task, idx) in allTasks" :key="idx" class="task-block">
      <div class="task-c task-priority">{{ task.priority }}</div>
      <div class="all-tasks-timer">
        <span v-if="task.timer.length && task.timer[task.timer.length - 1].end === 0" class="green"></span>
        <span v-if="!task.timer.length || task.timer[task.timer.length - 1].end != 0" class="red"></span>
      </div>
      <div class="task-c task-client">{{ task.client }}</div>
      <div class="task-c task-text">{{ task.text }}</div>
      <div class="task-c task-deadline">{{ deadline(task.deadline) }}</div>
    </div>
  </div>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'
  import lang from 'date-fns/locale'

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
      deadline (t) {
        let format = require('date-fns/format')

        return t ? format(
          new Date(t),
          `dd/MM/uuuu, HH:mm:ss ${this.$store.state.config.day12 ? 'a' : ''}`,
          {locale: lang[this.$store.state.config.locale]}
        ) : ''
      }
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
  margin-left: 10px;
}

.task-client{
  min-width: 100px;
}

.all-tasks-timer{
  margin-top: -4px;
}

</style>
