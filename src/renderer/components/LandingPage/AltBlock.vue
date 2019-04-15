<template>
  <div class="doc-container doc-alt-block">
    <div class="doc">
      <div class="title" v-if="altBlocks.includes('kb')" @click="ct = 'kb'">KNOWLEDGE BASE</div>
      <div class="title tasks-title" v-if="altBlocks.includes('tasks')" @click="ct = 'tasks'">TASKS</div>
      <div class="title meteo-title" v-if="altBlocks.includes('meteo')" @click="ct = 'meteo'">METEO</div>
      <div class="title vagrant-title" v-if="altBlocks.includes('vagrant')" @click="ct = 'vagrant'">VAGRANT</div>

      <div class="alt-blocks-content">
        <knowledge-base v-if="altBlocks.includes('kb') && container === 'kb'" @save="saveConfig()"></knowledge-base>

        <all-tasks v-if="altBlocks.includes('tasks') && container === 'tasks'"></all-tasks>

        <meteo v-if="altBlocks.includes('meteo') && container === 'meteo'"></meteo>

        <vagrant v-if="altBlocks.includes('vagrant') && container === 'vagrant'"></vagrant>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import KnowledgeBase from './KnowledgeBase'
  import AllTasks from './AllTasks'
  import Meteo from './Meteo'
  import Vagrant from './Vagrant'

  export default {
    components: {
      KnowledgeBase,
      AllTasks,
      Meteo,
      Vagrant
    },
    data () {
      return {
        ct: null
      }
    },
    computed: {
      ...mapState(['config']),
      container () {
        return this.ct === null ? this.config.altBlocks[0] : this.ct
      },
      altBlocks () {
        return this.config.altBlocks ? this.config.altBlocks : []
      }
    },
    mounted () {
      // FUTURE MODULE SYSTEM
      // const files = require.context(`@/assets/plugins`, true, /\.json$/)
      // const modules = []

      // files.keys().forEach(key => {
      //   const config = require(`@/assets/plugins/${key.substring(2)}`)
      //   const main = require(`@/assets/plugins/${config.pluginName + '/' + config.main}`)
      //   modules.push({
      //     config: config,
      //     main: main
      //   })
      // })
      // console.log(modules[0].main.default.main())
    },
    methods: {
      saveConfig () {
        this.$emit('save-config')
      }
    }
  }
</script>

<style>
  .doc{
    border-top: 1px solid #96d1d1;
    color: #96d1d1;
    padding: 20px 10px 10px 10px;
    position: relative;
    font-size: 12px;
  }

  .doc:before{
    content: '';
    height: 11px;
    border-left: 1px solid #96d1d1;
    width: 1px;
    position: absolute;
    top: -6px;
    left: 0px;
  }

  .doc:after{
    content: '';
    height: 11px;
    border-left: 1px solid #96d1d1;
    width: 1px;
    position: absolute;
    top: -6px;
    right: -2px;
  }

  .doc-alt-block .title {
    color: #96d1d1;
    font-size: .6rem;
    font-weight: bold;
    position: relative;
    top: -22px;
    width: auto;
    padding: 0px 0px;
    cursor: pointer;
    float: left;
    margin-right: 20px;
  }

  .content ul li div.kb-title div{
    width: 100%;
    cursor: pointer;
  }

  .alt-blocks-content{
    height: 100%;
    max-height: 360px;
    overflow-y: auto;
    display: flex;
    width: 100%;
  }

  .search-kb{
    background-color: rgba(0,0,0,0);
    border: 1px solid #96d1d1;
    color: #96d1d1;
    padding: 2px;
  }

  .editing-fields{
    background-color: rgba(0,0,0,0);
    border: 1px solid #96d1d1;
    color: #96d1d1;
    padding: 3px;
    width: 100%;
    margin-bottom: 10px;
  }

  .content{
    padding-right: 10px;
    margin-top: 10px;
    max-height: 300px;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .content ul li{
    position: relative;
    display: flex;
    padding: 5px 0px;
    border-bottom: 1px solid #96d1d1;
  }

  .content ul li div{
    float:left;
  }

  .content ul li div:nth-child(1){
    width: 15%;
  }

  .content ul li div:nth-child(2){
    width: 55%;
  }

  .content ul li div:nth-child(3){
    width: 30%;
  }
  .show-task{
    float:right;
  }

  button{
    background-color:rgba(0,0,0,0);
    border: 1px solid #96d1d1;
    color:#96d1d1; 
    padding: 5px 10px;
    font-size: 10px;
    margin-top: 0px;
  }

  button:hover{
    background-color:#96d1d1;
    color:black; 
    cursor: pointer;
  }

  .show-task{
    color: #96d1d1;
    text-decoration: none;
  }

  .kb-category{
    cursor: pointer;
  }

  /* .tasks-title{
    margin-left: 150px;
  }

  .meteo-title{
    margin-left: 250px;
  }

  .vagrant-title{
    margin-left: 350px;
  } */

</style>
