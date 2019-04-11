<template>
  <span>
    <span :title="getTaskTimer()">
      <span v-if="task.timer.length && task.timer[task.timer.length - 1].end === 0" class="green" @click="taskTimerStop(task.id)"></span>
      <span v-if="!task.timer.length || task.timer[task.timer.length - 1].end != 0" class="red" @click="taskTimerStart(task.id)"></span>
    </span>
    <span @click="showDetails = !showDetails" class="task-text">{{ task.text }}</span>
    (<a href="" @click.prevent="deleteTask(task.id)">X</a>)
    <span class="task-edit-box" v-if="showDetails">
      <input type="text" v-model="editTask.text" class="task-edit-text" @keyup.enter="saveConfig">
      <span class="change-task-group" style="position:relative;"> 
        Change Group: &#x25BC;
        <span class="task-group">
          <ul>
            <li v-for="taskg in currentClient.tasks" :key="taskg.id">
              <a href="#" @click.prevent="changeTaskGroup(taskg.id)">{{ taskg.name }}</a>
            </li>
          </ul>
        </span>
      </span>
      Set priority: <span @click="setPriority(task)" class="priority">{{ task.priority }}
      </span>
      <div class="timer-block info-buttons" v-if="timerStart">
        <input type="text" v-model="timerStart">
        <input type="text" v-model="timerEnd">
        <button href="" @click="saveTimer()">Save</button>
      </div>
    </span>
  </span>
</template>

<script>
  import { mapGetters } from 'vuex'
  import lang from 'date-fns/locale'
  import parse from 'date-fns/parse'
  import getTime from 'date-fns/getTime'
  
  export default {
    name: 'task',
    props: ['task', 'currentClient'],
    data () {
      return {
        showDetails: false,
        timerStart: 0,
        timerEnd: 0,
        editTask: {}
      }
    },
    computed: {
      ...mapGetters(['currentGroupTaskId']),
      tStart () {
        return this.task.timer.length ? this.task.timer[this.task.timer.length - 1].start : 0
      },
      tEnd () {
        return this.task.timer.length ? this.task.timer[this.task.timer.length - 1].end : 0
      }
    },
    mounted () {
      this.editTask = JSON.parse(JSON.stringify(this.task))
      // this.timerEnd = this.task.timer.length ? new Date(this.task.timer[this.task.timer.length - 1].end).toLocaleString('pt-PT') : 0
      this.updateLocalTimes()
    },
    watch: {
      tStart: function (val, newval) {
        this.updateLocalTimes()
      },
      tEnd: function (val, newval) {
        this.updateLocalTimes()
      },
      deep: true
    },
    methods: {
      updateLocalTimes () {
        let format = require('date-fns/format')

        this.timerEnd = this.task.timer.length ? format(
          new Date(this.task.timer[this.task.timer.length - 1].end),
          'dd/MM/uuuu, HH:mm:ss',
          {locale: lang[this.$store.state.config.locale]}
        ) : 0

        this.timerStart = this.task.timer.length ? format(
          new Date(this.task.timer[this.task.timer.length - 1].start),
          'dd/MM/uuuu, HH:mm:ss',
          {locale: lang[this.$store.state.config.locale]}
        ) : 0
      },
      saveTimer () {
        // const blocksStart = this.timerStart.split(',')
        // const dateStart = blocksStart[0].split('/')
        // const timeStart = blocksStart[1].split(':')
        // this.editTask.timer[this.editTask.timer.length - 1].start = Date.parse(new Date(+dateStart[2], +dateStart[1] - 1, +dateStart[0], +timeStart[0], +timeStart[1], +timeStart[2]))
        this.editTask.timer[this.editTask.timer.length - 1].start = getTime(parse(this.timerStart, 'dd/MM/uuuu, HH:mm:ss', new Date(), {locale: lang[this.$store.state.config.locale]}))

        // const blocksEnd = this.timerEnd.split(',')
        // const dateEnd = blocksEnd[0].split('/')
        // const timeEnd = blocksEnd[1].split(':')
        // this.editTask.timer[this.editTask.timer.length - 1].end = Date.parse(new Date(+dateEnd[2], +dateEnd[1] - 1, +dateEnd[0], +timeEnd[0], +timeEnd[1], +timeEnd[2]))
        this.editTask.timer[this.editTask.timer.length - 1].end = getTime(parse(this.timerEnd, 'dd/MM/uuuu, HH:mm:ss', new Date(), {locale: lang[this.$store.state.config.locale]}))
        this.saveConfig()
      },
      deleteTask () {
        this.$store.dispatch('deleteTask', this.task)
        this.$emit('save-data')
      },
      changeTaskGroup (toTaskGroupId) {
        this.$store.dispatch('changeTaskGroup', {toTaskGroupId: toTaskGroupId, task: this.task})
        this.$emit('save-data')
      },
      setPriority () {
        this.$store.dispatch('setPriority', this.task.id)
        this.$emit('save-data')
      },
      taskTimerStart (taskId) {
        this.$store.dispatch('startTimer', taskId)
        this.$emit('save-data')
      },
      taskTimerStop (taskId) {
        this.$store.dispatch('stopTimer', taskId)
        this.$emit('save-data')
      },
      getTaskTimer () {
        if (this.task.hasOwnProperty('timer')) {
          let diff = 0
          this.task.timer.forEach(e => {
            if (e.end !== 0) {
              diff += Math.floor(((e.end - e.start) / 1000) / 60)
            }
          })
          return Math.floor(diff / 60) + 'h' + diff + 'm'
        } else {
          this.currentClient.tasks.filter((e) => e.id === this.currentGroupTaskId)[0].tasks.map((e) => {
            if (e.id === this.task.id) {
              e.timer = []
            }
          })
          return '0'
        }
      },
      saveConfig () {
        this.$store.dispatch('setTask', this.editTask)
        this.$emit('save-data')
      }
    }
  }
</script>

<style>
.task-edit-box{
  clear: both;
  width: 100%;
  height: auto;
  /* border: 1px solid #96d1d1;
  border-top: 0px solid #96d1d1; */
  display: block;
  padding: 10px 20px;
}

.task-edit-text{
  width: 90%;
  display: block;
  clear: both;
  margin-bottom: 10px;
}

.task-text{
  cursor: pointer;
}

.timer-block{
  margin-top: 10px !important;
}

.task-group ul li {
  backdrop-filter: blur(10px);
}
</style>
