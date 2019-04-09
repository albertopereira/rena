import Vue from 'vue'
import Vuex from 'vuex'

// import { createPersistedState } from 'vuex-electron'

// import modules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
  // modules,
  state: {
    currentClientName: '',
    currentGroupTaskId: 0,
    allData: {},
    config: {}
  },

  helpers: {
    currentClient () {
      return this.state.allData.clients.filter(e => e.name === this.state.currentClientName)[0]
    }
  },

  mutations: {
    CHANGE_CURRENT_CLIENT_NAME (state, clientName) {
      state.currentClientName = clientName
      state.currentGroupTaskId = 0
    },
    SET_DATA (state, data) {
      state.allData = data
    },
    SET_CONFIG (state, data) {
      state.config = data
    },
    SET_UPDATED_AT (state) {
      this.getters.currentClient.changed = +(new Date())
    },
    DELETE_TASK_GROUP (state, groupId) {
      this.getters.currentClient.tasks.splice(this.getters.currentClient.tasks.findIndex((e) => e.id === groupId), 1)
    },
    DELETE_KB (state, id) {
      state.allData.kb.splice(state.allData.kb.findIndex((e) => e.id === id), 1)
    },
    ADD_TASK_GROUP (state, group) {
      this.getters.currentClient.tasks.push({ id: isFinite(group.id) ? group.id + 1 : 1, name: group.group, tasks: [] })
    },
    SET_TASK (state, task) {
      this.getters.currentClient.tasks.filter((e) => e.id === state.currentGroupTaskId)[0].tasks.map((e) => {
        if (e.id === task.id) {
          e.text = task.text
          e.timer[e.timer.length - 1].start = task.timer[0].start
          e.timer[e.timer.length - 1].end = task.timer[0].end
        }
      })
    },
    SET_KB (state, kb) {
      let idx = state.allData.kb.findIndex(x => x.id === kb.id)
      state.allData.kb[idx] = kb
    },
    SET_PRIORITY (state, taskId) {
      const tId = this.getters.currentClient.tasks.filter((e) => e.id === state.currentGroupTaskId)[0].tasks.findIndex((e) => e.id === taskId)
      if (this.getters.currentClient.tasks.filter((e) => e.id === state.currentGroupTaskId)[0].tasks[tId].priority === 3) {
        this.getters.currentClient.tasks.filter((e) => e.id === state.currentGroupTaskId)[0].tasks[tId].priority = 1
      } else {
        this.getters.currentClient.tasks.filter((e) => e.id === state.currentGroupTaskId)[0].tasks[tId].priority++
      }
    },
    ADD_TASK (state, task) {
      this.getters.currentClient.tasks.filter((e) => e.id === state.currentGroupTaskId)[0].tasks.push({ id: isFinite(task.id) ? task.id + 1 : 1, text: task.task, details: '', priority: 1, timer: [] })
    },
    DELETE_TASK (state, task) {
      this.getters.currentClient.tasks.filter((e) => e.id === state.currentGroupTaskId)[0].tasks.splice(this.getters.currentClient.tasks.filter((e) => e.id === state.currentGroupTaskId)[0].tasks.findIndex((e) => e.id === task.id), 1)
    },
    CHANGE_TASK_GROUP (state, t) {
      if (!state.currentGroupTaskId) {
        state.currentGroupTaskId = this.getters.firstGroupTaskId
      }
      this.getters.currentClient.tasks.filter((e) => e.id === t.toTaskGroupId)[0].tasks.push(t.task)
      this.getters.currentClient.tasks.filter((e) => e.id === state.currentGroupTaskId)[0].tasks.splice(
        this.getters.currentClient.tasks.filter((e) => e.id === state.currentGroupTaskId)[0].tasks.findIndex(
          (e) => e.id === t.task.id
        )
        , 1)
    },
    ADD_KB (state, kb) {
      state.allData.kb.push(kb)
    },
    SET_DEV (state, dev) {
      this.getters.currentClient.development = dev
    },
    SET_PROD (state, prod) {
      this.getters.currentClient.production = prod
    },
    START_TIMER (state, taskId) {
      this.getters.currentClient.tasks.filter((e) => e.id === state.currentGroupTaskId)[0].tasks.map((e) => {
        if (e.id === taskId) {
          if (!e.hasOwnProperty('timer')) {
            e.timer = []
          }
          e.timer.push({
            start: Date.now(),
            end: 0
          })
        }
      })
    },
    STOP_TIMER (state, taskId) {
      this.getters.currentClient.tasks.filter((e) => e.id === state.currentGroupTaskId)[0].tasks.map((e) => {
        if (e.id === taskId) {
          e.timer[e.timer.length - 1].end = Date.now()
        }
      })
    },
    ADD_PROJECT (state, project) {
      state.allData.clients.push(
        {
          id: isFinite(project.id) ? project.id + 1 : 1,
          name: project.name,
          changed: project.changed,
          development: {
            info: '',
            ssh_user: '',
            ssh_pass: '',
            ftp_user: '',
            ftp_pass: '',
            domain: '',
            scp_session: '',
            folder: ''
          },
          production: {
            info: '',
            ssh_user: '',
            ssh_pass: '',
            ftp_user: '',
            ftp_pass: '',
            domain: '',
            scp_session: '',
            folder: ''
          },
          tasks: []
        })
    },
    CHANGE_CURRENT_GROUP_TASK_ID (state, id) {
      state.currentGroupTaskId = id
    }
  },

  actions: {
    changeCurrentClientName ({ commit }, clientName) {
      commit('CHANGE_CURRENT_CLIENT_NAME', clientName)
    },
    changeCurrentGroupTaskID ({ commit }, id) {
      commit('CHANGE_CURRENT_GROUP_TASK_ID', id)
    },
    addNewProject ({ commit }, project) {
      commit('ADD_PROJECT', project)
    },
    deleteTaskGroup ({ commit }, groupId) {
      commit('DELETE_TASK_GROUP', groupId)
    },
    deleteKb ({ commit }, id) {
      commit('DELETE_KB', id)
    },
    setUpdatedAt ({ commit }) {
      commit('SET_UPDATED_AT')
    },
    setData ({ commit }, data) {
      commit('SET_DATA', data)
    },
    setConfig ({ commit }, data) {
      commit('SET_CONFIG', data)
    },
    addTaskGroup ({ commit }, group) {
      commit('ADD_TASK_GROUP', group)
    },
    addTask ({ commit }, task) {
      commit('ADD_TASK', task)
    },
    addKb ({ commit }, kb) {
      commit('ADD_KB', kb)
    },
    deleteTask ({ commit }, task) {
      commit('DELETE_TASK', task)
    },
    setPriority ({ commit }, taskId) {
      commit('SET_PRIORITY', taskId)
    },
    changeTaskGroup ({ commit }, t) {
      commit('CHANGE_TASK_GROUP', t)
    },
    setTask ({ commit }, task) {
      commit('SET_TASK', task)
    },
    setDevelopment ({ commit }, dev) {
      commit('SET_DEV', dev)
    },
    setProduction ({ commit }, prod) {
      commit('SET_PROD', prod)
    },
    startTimer ({ commit }, taskId) {
      commit('START_TIMER', taskId)
    },
    stopTimer ({ commit }, taskId) {
      commit('STOP_TIMER', taskId)
    },
    setKb ({ commit }, kb) {
      commit('SET_KB', kb)
    }
  },

  getters: {
    allClients: (state) => (filter) => {
      if (state.allData.clients) {
        return filter ? state.allData.clients.filter((e) => e.name.toLowerCase().includes(filter.toLowerCase())).sort((a, b) => new Date(b.changed) - new Date(a.changed)) : state.allData.clients.slice(0).sort((a, b) => new Date(b.changed) - new Date(a.changed))
      } else {
        return []
      }
    },
    kb: (state) => {
      return state.allData.kb
    },
    currentClient: (state) => {
      return state.allData.clients ? state.allData.clients.filter(e => e.name === state.currentClientName)[0] : {}
    },
    lastChangedClient: (state) => {
      return state.allData.clients && state.allData.clients.length ? state.allData.clients.reduce((prev, current) => (prev.changed > current.changed) ? prev : current) : null
    },
    firstGroupTaskId: (state) => {
      return state.allData.clients.filter(e => e.name === state.currentClientName)[0].tasks.reduce((prev, current) => (prev.id < current.id) ? prev : current).id
    }
  },

  plugins: [
    // createPersistedState()
  ],
  strict: process.env.NODE_ENV !== 'production'
})
