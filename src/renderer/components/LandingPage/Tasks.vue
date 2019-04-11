<template>
  <div class="doc-container doc-tasks">
    <div class="doc tasks" v-if="currentClient">
      <div class="title alt"><span>TASKS</span></div>
      <div class="nav">
        <span v-for="taskGroup in currentClient.tasks" :key="taskGroup.id">
          <span class="title-task alt" v-bind:class="groupTaskSelected(taskGroup.id) ? 'selected' : ''" @click="changeCurrentGroupTask(taskGroup.id)">
            {{ taskGroup.name }}
          </span>
          <span class="title-task delete-task-group" v-on:dblclick="deleteTaskGroup(taskGroup.id)">X</span>
        </span>
        <span class="title-task new-task-group"><input type="text" @keyup.enter="addTaskGroup" v-model="taskGroupToAdd"></span>
      </div>

      <div class="current-client-tasks" v-for="task in currentTasks" :key="task.id">
        <ul>
          <li>
            {{ currentTotalTimer }}
          </li>
          <li v-for="task in task.tasks" :key="task.id">
            <task v-on:save-data="saveData()" :currentClient=currentClient :task=task></task>
          </li>
          <li>
            <input type="text" class="new-task" @keyup.enter="addTask" v-model="taskToAdd">
          </li>
        </ul>            
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'
  import Task from './Task'

  export default {
    name: 'tasks',
    props: [],
    components: {
      Task
    },
    data () {
      return {
        taskGroupToAdd: '',
        taskToAdd: ''
      }
    },
    computed: {
      ...mapState(['currentClientName', 'allData']),
      ...mapGetters(['allClients', 'currentClient', 'currentGroupTaskId']),
      currentTasks () {
        return this.currentClient.tasks ? this.currentClient.tasks.filter((e) => e.id === this.currentGroupTaskId) : []
      },
      // the total time for the tasks in the current group
      currentTotalTimer () {
        let total = 0

        this.currentTasks[0].tasks.forEach(task => {
          if (task.hasOwnProperty('timer')) {
            let diff = 0
            task.timer.forEach(e => {
              if (e.end !== 0) {
                diff += Math.floor(((e.end - e.start) / 1000) / 60)
              }
            })
            total += diff
          }
        })

        return Math.floor(total / 60) + 'h' + (total % 60) + 'm'
      }
    },
    mounted () {
    },
    watch: {
    },
    methods: {
      groupTaskSelected (id) {
        return this.currentGroupTaskId === id
      },
      changeCurrentGroupTask (id) {
        this.$store.dispatch('changeCurrentGroupTaskID', id)
      },
      deleteTaskGroup (taskGroupId) {
        this.$store.dispatch('deleteTaskGroup', taskGroupId)
        // this.currentClient.tasks.splice(this.currentClient.tasks.findIndex((e) => e.id === taskGroupId), 1)
        this.saveData()
      },
      addTaskGroup () {
        const maxId = Math.max.apply(Math, this.currentClient.tasks.map(function (o) { return o.id }))
        this.$store.dispatch('addTaskGroup', {group: this.taskGroupToAdd, id: maxId})
        this.taskGroupToAdd = ''
        this.saveData()
      },
      addTask () {
        const maxId = Math.max.apply(null,
          this.currentClient.tasks.map((t) => { return Math.max.apply(Math, t.tasks.map(function (o) { return o.id })) })
        )
        this.$store.dispatch('addTask', {task: this.taskToAdd, id: maxId})

        this.taskToAdd = ''
        this.saveData()
      },
      saveData () {
        this.$emit('save-data')
      }
    }
  }
</script>

<style>
</style>
