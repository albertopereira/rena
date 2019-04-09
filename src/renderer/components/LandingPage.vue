<template>
  <div>
    <div class="preload-container">
      <div class="preload">RENA</div>
    </div>
    <div id="wrapper" class="animated fadeIn" v-bind:style="{ 'background-image': 'url(' + imagePath + ')' }">
      <main>
        <div class="left-side">
          <div class="terminals">
            <terminals :refit=refitTerminal :cssloaded=cssLoaded :bc=terminalCSS :command=command></terminals>
          </div>
          <div class="alt-blocks">
            <alt-block v-on:save-config="saveData()"></alt-block>
          </div>
        </div>

        <div class="right-side">

          <system-info v-on:save-config="saveData()"></system-info>

          <projects></projects>

          <info  v-on:save-config="saveData()" v-on:set-command="setCommand"></info>

          <tasks v-on:save-data="saveData()"></tasks>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
  import { mapState, mapActions, mapGetters } from 'vuex'

  import Terminals from './LandingPage/Terminals'
  import AltBlock from './LandingPage/AltBlock'
  import Tasks from './LandingPage/Tasks'
  import SystemInfo from './LandingPage/SystemInfo'
  import Projects from './LandingPage/Projects'
  import Info from './LandingPage/Info'
  // import { remote } from 'electron'
  // import * as jsonClients from '../assets/config.json'
  const electron = require('electron')
  const path = require('path')
  const fs = require('fs')

  export default {
    name: 'landing-page',
    components: {
      Terminals,
      AltBlock,
      Tasks,
      SystemInfo,
      Projects,
      Info
    },
    data () {
      return {
        showDialog: false,
        dialogText: '',
        path: '',
        pathConfig: '',
        data: null,
        config: null,
        terminalCSS: null,
        cssLoaded: false,
        command: '',
        systemInfo: {},
        refitTerminal: false
      }
    },
    computed: {
      ...mapState(['currentClientName', 'currentGroupTaskId', 'allData']),
      ...mapGetters(['allClients', 'kb', 'lastChangedClient']),
      imagePath () {
        return this.background ? require(`@/assets/b${this.background}.jpg`) : null
      },
      clients () {
        if (this.data !== null) {
          return this.allClients(this.clientsFilter)
        } else {
          return null
        }
      },
      currentClient () {
        return this.clients !== null ? this.clients.filter(e => e.name === this.currentClientName)[0] : {}
      },
      background: {
        get () {
          return this.config ? this.config.bgImage : null
        },
        set (i) {
          this.config.bgImage = i
          this.saveConfig()
        }
      }
    },
    mounted () {
      this.setup()
      if (this.lastChangedClient) {
        this.$store.dispatch('changeCurrentClientName', this.lastChangedClient.name)
      }

      // const themePath = (electron.app || electron.remote.app).getPath('userData') + `/themes/${this.config.theme}/main.css`
      // const themePath = path.join((electron.app || electron.remote.app).getPath('userData'), 'themes', this.config.theme, 'main.css')

      // require(themePath)

      window.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.keyCode === 37) {
          this.background = this.background === 1 ? 21 : this.background - 1
        }
        if (e.ctrlKey && e.keyCode === 39) {
          this.background = this.background === 21 ? 1 : this.background + 1
        }
      })

      this.animateCSS(document.querySelector('.preload'), 'fadeIn', () => {
        document.querySelector('.preload').style.opacity = 1
        document.querySelector('.preload-container').style.display = 'none'
        this.refitTerminal = true
      })

      this.animateCSS(document.querySelector('.doc-system-info'), 'fadeInRightBig', () => {
        document.querySelector('.doc-system-info').style.opacity = 1
      })
      this.animateCSS(document.querySelector('.doc-clients'), 'fadeInRightBig', () => {
        document.querySelector('.doc-clients').style.opacity = 1
      })
      this.animateCSS(document.querySelector('.doc-info'), 'fadeInRightBig', () => {
        document.querySelector('.doc-info').style.opacity = 1
      })
      this.animateCSS(document.querySelector('.doc-tasks'), 'fadeInRightBig', () => {
        document.querySelector('.doc-tasks').style.opacity = 1
      })
      this.animateCSS(document.querySelector('.doc-terminals'), 'fadeInLeftBig', () => {
        document.querySelector('.doc-terminals').style.opacity = 1
      })
      this.animateCSS(document.querySelector('.doc-alt-block'), 'fadeInLeftBig', () => {
        document.querySelector('.doc-alt-block').style.opacity = 1
      })
    },
    watch: {
    },
    methods: {
      ...mapActions(['setData', 'setConfig']),
      setup () {
        this.readConfig()
        this.readData()

        require(`@/assets/themes/${this.config.theme}.css`)

        this.setCSS()
      },
      setCSS () {
        let that = this
        Array.from(document.styleSheets).forEach(function (e) {
          if (e.href === null) {
            Array.from(e.cssRules).forEach(function (e) {
              if (e.selectorText === '.xterm-background') {
                that.terminalCSS = {
                  backgroundColor: e.style.backgroundColor,
                  color: that.config.color !== 'default' ? that.config.color : e.style.color
                }
                that.cssLoaded = true
              }
            })
          }
        })

        if (this.config.color !== 'default') {
          var s = document.createElement('style')
          s.innerHTML = `
          #wrapper, .title  { 
            color: ${this.config.color};
          }

          .doc{
            border-top: 1px solid ${this.config.color};
            color: ${this.config.color};
          }

          .doc:before{
            border-left: 1px solid ${this.config.color};
          }

          .doc:after{
            border-left: 1px solid ${this.config.color};
          }

          .current-client-data{
            border: 1px solid ${this.config.color};
          }


          .current-client-data table th{
            color: ${this.config.color};
          }

          .info-buttons button{
            border: 1px solid ${this.config.color};
            color:${this.config.color}; 
          }

          button{
            border: 1px solid ${this.config.color};
            color:${this.config.color}; 
          }

          .info-buttons button:hover, button:hover{
            background-color:${this.config.color};
          }

          .nav button{
            color: ${this.config.color};
          }


          a{
            color: ${this.config.color};
          }

          .tasks .nav .title-task{
            color: ${this.config.color};
          }

          .tasks .nav span .title-task{
            border: 1px solid ${this.config.color};
          }

          .tasks .nav .title-task:hover, .tasks .nav .title-task.selected, .clients .selected{
            background-color: ${this.config.color};
          }

          .tasks .nav .new-task-group input, .tasks .nav .new-task-group input:hover{
            color: ${this.config.color};
            border: 1px solid ${this.config.color};
          }


          .new-task{
            border: 1px solid ${this.config.color};
            color: ${this.config.color};
          }

          .search-clients{
            color: ${this.config.color};
          }

          .dialog{
            border: 1px solid ${this.config.color};
          }

          code{
            border: 1px solid ${this.config.color};
          }

          ::-webkit-scrollbar-thumb:window-inactive,
          ::-webkit-scrollbar-thumb {
            border: 1px solid ${this.config.color};
          }


          .task-group li, input{
            border: 1px solid ${this.config.color};
            color: ${this.config.color};
          }

          .task-group li:hover{
            background-color:  ${this.config.color};
            border: 1px solid ${this.config.color};
          }

          .info-edit{
            border: 1px solid ${this.config.color};
            color: ${this.config.color};
          }

          .doc-alt-block .title {
            color: ${this.config.color};
          }

          .search-kb{
            border: 1px solid ${this.config.color};
            color: ${this.config.color};
          }

          .kb-title{
            color: ${this.config.color};
          }

          .editing-fields{
            border: 1px solid ${this.config.color};
            color: ${this.config.color};
          }

          .content ul li{
            border-bottom: 1px solid ${this.config.color};
          }

          .show-task{
            color: ${this.config.color};
          }

          .dialog-close{
            color: ${this.config.color};
          }

          .doc p {
            color: ${this.config.color};
          }

          .terminalContainer{
            border: 1px solid ${this.config.theme !== 'default' ? this.config.color : '0px solid #000000'};
          }
          `
          document.getElementsByTagName('head')[0].appendChild(s)
        }
      },
      readData () {
        let defaultData = {
          'kb': [],
          'clients': []
        }
        const userDataPath = (electron.app || electron.remote.app).getPath('userData')
        this.path = path.join(userDataPath, 'data.json')
        if (!fs.existsSync(this.path)) {
          fs.writeFileSync(this.path, JSON.stringify(defaultData))
        }
        this.data = JSON.parse(fs.readFileSync(this.path))
        this.setData(JSON.parse(fs.readFileSync(this.path)))
      },
      readConfig () {
        let defaultConfig =
        {
          'altBlocks': ['kb', 'meteo', 'vagrant', 'tasks'],
          'locale': 'pt_PT',
          'allTasksGroups': ['TO DO'],
          'infoButtons': [
            'ssh',
            'sftp',
            'folder',
            'code',
            'info'
          ],
          'theme': 'default',
          'bgImage': 5,
          'color': 'default'
        }

        const userConfigPath = (electron.app || electron.remote.app).getPath('userData')
        this.pathConfig = path.join(userConfigPath, 'config.json')
        if (!fs.existsSync(this.pathConfig)) {
          fs.writeFileSync(this.pathConfig, JSON.stringify(defaultConfig))
        }
        this.config = JSON.parse(fs.readFileSync(this.pathConfig))
        this.setConfig(JSON.parse(fs.readFileSync(this.pathConfig)))
      },
      setCommand (command) {
        this.command = command
      },
      setUpdatedAt () {
        this.$store.dispatch('setUpdatedAt')
      },
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      saveData () {
        this.setUpdatedAt()
        fs.writeFileSync(this.path, JSON.stringify(this.allData))
        fs.writeFileSync(this.path + `${+(new Date())}`, JSON.stringify(this.allData))
      },
      saveConfig () {
        fs.writeFileSync(this.pathConfig, JSON.stringify(this.config))
        fs.writeFileSync(this.pathConfig + `${+(new Date())}`, JSON.stringify(this.config))
      },
      showD (i) {
        this.dialogText = i
        this.showDialog = true
      }
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Jura:400,700');
  @import url('https://fonts.googleapis.com/css?family=Space+Mono:400,700');
  @import url('https://fonts.googleapis.com/css?family=Fira+Mono:400,700');
  @import url('https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.0/animate.min.css');
  @import url('~@/assets/xterm.css');


  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  #wrapper { font-family: 'Jura'; color: #96d1d1;
    background-color: #000000;
    background-size: 22px 22px;
    background-repeat:no-repeat; 
    background-position:center center fixed; 
    background-size: cover;
    overflow: hidden;
    animation-delay: 4s;
    height: 100vh;
    width: 100vw;
    opacity: 0;
  }

  #logo {
    height: auto;
    margin-bottom: 20px;
    width: 420px;
  }

  main {
    display: flex;
    justify-content: space-between;
  }

  main > div { flex-basis: 50%; }

  .left-side {
    display: flex;
    flex-direction: column;
    padding: 10px;
    height: 100%;
    width: 50%;
  }

  .right-side {
    display: flex;
    flex-direction: column;
    padding: 10px;
  }

  .title {
    color: #96d1d1;
    font-size: .6rem;
    font-weight: bold;
    /* background-color: #000000; */
    position: absolute;
    top: -15px;
    width: auto;
    display: inline-block;
    padding: 0px;
  }

  .doc-container{
    padding: 20px 10px;
    backdrop-filter: brightness(60%) blur(5px);
    margin-bottom: 5px;
    z-index:1001; 
    opacity: 0;
  }

  .preload-container{
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .preload{
    font-family: 'Jura';
    animation-delay: 0s;
    animation-duration: 3s;
    color: #ffffff;
    font-size: 4rem;
    /* border: 1px solid #ffffff; */
    border-radius: 5px;
    height: 75px;
    width: 195px;
    padding: 0px 10px;
    position: fixed;
    margin: auto;
    right:100px;
    bottom:100px;
    opacity: 0;
  }

  .doc-terminals{
    opacity: 0;
  }

  .doc-system-info, .doc-terminals{
    animation-delay: 5s;
    animation-duration: 1.5s;
  }

  .doc-clients, .doc-alt-block{
    animation-delay: 5.5s;
    animation-duration: 1.5s;
  }

  .doc-info{
    animation-delay: 6s;
    animation-duration: 1.5s;
  }

  .doc-tasks{
    z-index: 1;
    animation-delay: 6.5s;
    animation-duration: 1.5s;
  }

  .doc{
    border-top: 1px solid #96d1d1;
    color: #96d1d1;
    padding: 5px 10px 0px 5px;
    position: relative;
    font-size:12px;
  }

  .doc:before{
    content: '';
    height:6px;
    border-left: 1px solid #96d1d1;
    width: 1px;
    position: absolute;
    top: -4px;
    left: 0px;
  }

  .doc:after{
    content: '';
    height:6px;
    border-left: 1px solid #96d1d1;
    width: 1px;
    position: absolute;
    top: -4px;
    right: -2px;
  }

  .doc.clients ul{
    float: left;
    width: 80%;
  }

  .doc.clients ul li{
    list-style-type: none;
    float: left;
    margin-right: 15px;
    margin-bottom: 5px;
    cursor: pointer;
    width: 10%;
  }

  .doc p {
    color:#96d1d1;
  }

  .info-doc{
    display: flex;
  }

  .current-client-data{
    border: 1px solid #96d1d1;
    width: 49%;
    margin-right: 5px;
    float:left;
    margin-top: 15px;
  }

  .current-client-data table {
    padding: 5px;
    font-size: 10px;
    width: 100%;
    table-layout: fixed;
    height: 100%;
  }

  .current-client-data table th, .current-client-data table td{
    padding: 3px 10px 3px 0px;
    text-align: left;
    min-width: 95px;
    vertical-align: top;
    word-wrap: break-word;
  }

  .current-client-data table th{
    position: absolute;
    top: 5px;
    display: block;
    color: #96d1d1;
    width: auto;
    display: inline-block;
    padding: 0px;
  }

  .current-client-data input{
    display: none;
    width: 100%;
  }

  .copy-clipboard{
    cursor: pointer;
    float: right;
  }

  .current-client-tasks{
    height: auto;
    max-height: 300px;
    overflow: auto;
  }

  .current-client-tasks ul li{
    list-style-type: none;
  }

  .info-buttons{
    margin-top: 5px;
  }

  .info-buttons button{
    background-color:rgba(0,0,0,0);
    border: 1px solid #96d1d1;
    color:#96d1d1; 
    padding: 5px 10px;
    font-size: 10px;
  }

  .info-buttons button:hover{
    background-color:#96d1d1;
    color:black; 
    cursor: pointer;
  }

  a{
    color: #96d1d1;
    text-decoration: none;
  }

  .tasks .nav{
    width: 100%;
    display: block;
    margin-bottom: 0px;
  }

  .tasks .nav .title-task{
    margin-top: 5px;
    cursor: pointer;
    position: relative;
    font-weight: 100;
    background-color: rgba(0,0,0,0);
    color: #96d1d1;
    border: 1px solid #96d1d1;
    padding: 0px 5px;
  }

  .delete-task-group{
    margin-right: 5px;
  }

  .tasks .nav .title-task:hover, .tasks .nav .title-task.selected, .clients .selected{
    background-color: #96d1d1;
    color: #000000;
  }


  .tasks .nav .new-task-group, .tasks .nav .new-task-group:hover{
    margin-top: 5px;
    margin-right: 5px;
    position: relative;
    font-weight: 100;
    cursor: none;
    border:0px;
    padding:0px;
    background-color: rgba(0,0,0,0);
  }

  .tasks .nav .new-task-group input,  .tasks .nav .new-task-group input:hover{
    background-color: rgba(0,0,0,0);
    color: #96d1d1;
    border: 1px solid #96d1d1;
    padding: 1px 0px 0px 0px;
  }


  .new-task{
    width: 100%;
    background-color: rgba(0,0,0,0);
    border: 1px solid #96d1d1;
    color: #96d1d1;
    padding: 5px;
    margin-top: 20px;
  }

  .search-clients{
    position: relative;
    float: right;
    background-color: rgba(0,0,0,0);
    color: #96d1d1;
    padding: 3px;
    width: 20%;
  }

  .search-clients input{
    width: 100%;
  }

  .dialog{
    position: fixed;
    z-index: 1002;
    top: 10%;
    left: 10%;
    width: 70%;
    height: 70%;
    border: 1px solid #96d1d1;
    backdrop-filter: brightness(60%) blur(5px);
  }


  .dialog-content{
    padding: 30px;
  }

  .dialog-content textarea{
    background-color: rgba(0,0,0,0);
    margin-top: 15px;
  }

  .system-info{
    font-size: 20px;
  }

  .system-info div{
    display: inline-block;
    margin-right: 20px;
  }

  .system-info div.time{
    width: 25%;
  }

  code{
    display: block;
    margin: 10px;
    border: 1px solid #96d1d1;
    padding: 10px;
  }

  ::-webkit-scrollbar {     
    background-color: rgba(0,0,0,0);
    width: .8em;
  }

  ::-webkit-scrollbar-thumb:window-inactive,
  ::-webkit-scrollbar-thumb {
    background:  rgba(0,0,0,0);
    border: 1px solid #96d1d1;
  }

  .change-task-group{
    position: relative;
  }

  .change-task-group:hover .task-group{
    display: inline-block;
  }

  .task-group{
    position:absolute;
    left: -20px;
    padding-top: 20px;
    padding-left: 20px;
    display:none;
    z-index: 999;
  }

  .dialog-close{
    float: right;
    margin-right: 15px;
    font-size: 1.5rem;
    color: #96d1d1;
    cursor: pointer;
  }

  .task-group ul li{
    height: 25px;
    min-width: 100px;
  }

  .task-group li, input{
    padding:2px;
    background: rgba(0,0,0,0);
    border: 1px solid #96d1d1;
    color: #96d1d1;
  }

  .task-group li:hover{
    padding:2px;
    background-color:  #96d1d1;
    border: 1px solid #96d1d1;
  }

  .task-group li:hover a{
    color: #000000;
  }

  .new-project{
    position: relative;
    float: right;
    width: 20%;
    margin-right: 0px !important;
  }

  .new-project input{
    width: 100%;
  }

  .last-changed{
    position: relative;
    float: right;
    margin-top: 5px;
  }

  .priority{
    cursor: pointer;
  }

  .info-edit{
    padding:3px;
    background:  #000000;
    border: 1px solid #96d1d1;
    color: #96d1d1;
    width: 100%;
    height: 300px;
  }

  .green, .red{
    font-size: 1rem;
    cursor: pointer;
  }

  .green:after{
    content: ' \25CF';
    color: green;
  }

  .red:after{
    content: ' \25CF';
    color: red;
  }

.terminalContainer{
  box-sizing: border-box;
  width: 100%;
  /* height: 410px;
  max-height: 410px; */
  /* border: 1px solid #96d1d1; */
  border-radius: 3px;
  padding: 10px 10px;
  float:left;
  /* backdrop-filter: brightness(60%) blur(5px); */
  margin-bottom: 3px;
}

.nav button{
  cursor: pointer;
  position: relative;
  font-weight: 100;
  background-color: rgba(0,0,0,0);
  color: #96d1d1;
   border: 0px solid #96d1d1; 
  padding: 2px 10px;
  margin: 0px;
  font-family: 'Space Mono', monospace;
  outline: 0px;
}

.nav button.addContainer{
  margin-left: -4px;
}

.nav button:hover, .nav button.selected{
  background-color: rgba(0,0,0,0.5);
   /* color: #000000;*/ 
}

.addContainer{
  font-weight: bold;
}

.terminals{
  z-index: 1;
  margin-bottom: 2px;
}

.alt-blocks{
  z-index: 2;
}
.lds-dual-ring {
  display: inline-block;
  width: 64px;
  height: 64px;
  margin-left: calc(50% - 32px);
}
.lds-dual-ring:after {
  content: " ";
  display: block;
  width: 36px;
  height: 36px;
  margin: 1px;
  border-radius: 50%;
  border: 5px solid #fff;
  border-color: rgba(255,255,255,0.3) transparent rgba(255,255,255,0.3) transparent;
  animation: lds-dual-ring 1.2s linear infinite;
}
@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

</style>
