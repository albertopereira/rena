<template>
  <div class="doc-container doc-info">
    <div class="doc info-doc" v-if="currentClient">
      <div class="title alt"><span>INFO</span></div>
      <div class="current-client-data development" v-if="currentClient.development">
        <table>
          <thead>
            <th colspan="2">DEVELOPMENT</th>
          </thead>
          <tbody>
            <tr>
              <td><span @click="toggleInput('development-domain')">DOMAIN</span><span class="copy-clipboard" @click="copyToClipboard(currentClient.development.domain)">(c)</span></td>
              <td>
                {{ currentClient.development.domain }}
                <input type="text" id="development-domain" v-model="client.development.domain" @keyup.enter="toggleInput('development-domain')">
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <table>
                  <tr>
                    <td><span @click="toggleInput('development-ftp-user')">FTP&nbsp;USER</span><span class="copy-clipboard" @click="copyToClipboard(currentClient.development.ftp_user)">(c)</span></td>
                    <td>
                      {{ currentClient.development.ftp_user }}
                      <input type="text" id="development-ftp-user" v-model="client.development.ftp_user" @keyup.enter="toggleInput('development-ftp-user')">
                    </td>
                    <td><span @click="toggleInput('development-ftp-pass')">FTP&nbsp;PASS</span><span class="copy-clipboard" @click="copyToClipboard(currentClient.development.ftp_pass)">(c)</span></td>
                    <td>
                      <input type="text" id="development-ftp-pass" v-model="client.development.ftp_pass" @keyup.enter="toggleInput('development-ftp-pass')">
                    </td>
                  </tr>
                  <tr>
                    <td><span @click="toggleInput('development-ssh-user')">SSH&nbsp;USER</span><span class="copy-clipboard" @click="copyToClipboard(currentClient.development.ssh_user)">(c)</span></td>
                    <td>{{ currentClient.development.ssh_user }}
                      <input type="text" id="development-ssh-user" v-model="client.development.ssh_user" @keyup.enter="toggleInput('development-ssh-user')">                    
                    </td>
                    <td><span @click="toggleInput('development-ssh-pass')">SSH&nbsp;PASS</span><span class="copy-clipboard" @click="copyToClipboard(currentClient.development.ssh_pass)">(c)</span></td>
                    <td>
                      <input type="text" id="development-ssh-pass" v-model="client.development.ssh_pass" @keyup.enter="toggleInput('development-ssh-pass')">
                    </td>
                  </tr>
                </table>
              </td>
            </tr>                 

            <tr>
              <td><span @click="toggleInput('development-scp-session')">SCP&nbsp;SESSION</span><span class="copy-clipboard" @click="copyToClipboard(currentClient.development.scp_session)">(c)</span></td>
              <td>{{ currentClient.development.scp_session }}
                <input type="text" id="development-scp-session" v-model="client.development.scp_session" @keyup.enter="toggleInput('development-scp-session')">
              </td>
            </tr>
            <tr>
              <td><span @click="toggleInput('development-folder')">FOLDER</span><span class="copy-clipboard" @click="copyToClipboard(currentClient.development.folder)">(c)</span></td>
              <td>{{ currentClient.development.folder }}
                <input type="text" id="development-folder" v-model="client.development.folder" @keyup.enter="toggleInput('development-folder')">
              </td>
            </tr>  
            <tr>
              <td><span @click="toggleInput('development-folder-server')">SERVER</span><span class="copy-clipboard" @click="copyToClipboard(currentClient.development.folder_server)">(c)</span></td>
              <td>{{ currentClient.development.folder_server }}
                <input type="text" id="development-folder-server" v-model="client.development.folder_server" @keyup.enter="toggleInput('development-folder-server')">
              </td>
            </tr>

            <tr>
              <td colspan=2>
                <div class="info-buttons">
                  <button href="" v-if="infoButtons.includes('ssh') && currentClient.development.domain" @click="ssh(currentClient.development.domain, currentClient.development.ssh_user, currentClient.development.ssh_pass, 1)">SSH</button>
                  <button href="" v-if="infoButtons.includes('sftp') && currentClient.development.scp_session" @click="openScp(currentClient.development.scp_session)">SFTP</button>
                  <button href="" v-if="infoButtons.includes('folder') && currentClient.development.folder" @click="openFolder(currentClient.development.folder)">FOLDER</button>
                  <button href="" v-if="infoButtons.includes('folder') && currentClient.development.folder" @click="openCode(currentClient.development.folder)">CODE</button>
                  <button href="" v-if="infoButtons.includes('info')" @click="showDInfo('d')">i</button>                      
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="current-client-data" v-if="currentClient.production">
        <table>
          <thead>
            <th colspan="2">PRODUCTION</th>
          </thead>
          <tbody>
            <tr>
              <td><span @click="toggleInput('production-domain')">DOMAIN</span><span class="copy-clipboard" @click="copyToClipboard(currentClient.production.domain)">(c)</span></td>
              <td>
                {{ currentClient.production.domain }}
                <input type="text" id="production-domain" v-model="client.production.domain" @keyup.enter="toggleInput('production-domain')">
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <table>
                  <tr>
                    <td><span @click="toggleInput('production-ftp-user')">FTP&nbsp;USER</span><span class="copy-clipboard" @click="copyToClipboard(currentClient.production.ftp_user)">(c)</span></td>
                    <td>
                      {{ currentClient.production.ftp_user }}
                      <input type="text" id="production-ftp-user" v-model="client.production.ftp_user" @keyup.enter="toggleInput('production-ftp-user')">
                    </td>
                    <td><span @click="toggleInput('production-ftp-pass')">FTP&nbsp;PASS</span><span class="copy-clipboard" @click="copyToClipboard(currentClient.production.ftp_pass)">(c)</span></td>
                    <td>
                      <input type="text" id="production-ftp-pass" v-model="client.production.ftp_pass" @keyup.enter="toggleInput('production-ftp-pass')">
                    </td>
                  </tr>
                  <tr>
                    <td><span @click="toggleInput('production-ssh-user')">SSH&nbsp;USER</span><span class="copy-clipboard" @click="copyToClipboard(currentClient.production.ssh_user)">(c)</span></td>
                    <td>{{ currentClient.production.ssh_user }}
                      <input type="text" id="production-ssh-user" v-model="client.production.ssh_user" @keyup.enter="toggleInput('production-ssh-user')">                    
                    </td>
                    <td><span @click="toggleInput('production-ssh-pass')">SSH&nbsp;PASS</span><span class="copy-clipboard" @click="copyToClipboard(currentClient.production.ssh_pass)">(c)</span></td>
                    <td>
                      <input type="text" id="production-ssh-pass" v-model="client.production.ssh_pass" @keyup.enter="toggleInput('production-ssh-pass')">
                    </td>
                  </tr>
                </table>
              </td>
            </tr>                 

            <tr>
              <td><span @click="toggleInput('production-scp-session')">SCP&nbsp;SESSION</span><span class="copy-clipboard" @click="copyToClipboard(currentClient.production.scp_session)">(c)</span></td>
              <td>{{ currentClient.production.scp_session }}
                <input type="text" id="production-scp-session" v-model="client.production.scp_session" @keyup.enter="toggleInput('production-scp-session')">
              </td>
            </tr>
            <tr>
              <td><span @click="toggleInput('production-folder')">FOLDER</span><span class="copy-clipboard" @click="copyToClipboard(currentClient.production.folder)">(c)</span></td>
              <td>{{ currentClient.production.folder }}
                <input type="text" id="production-folder" v-model="client.production.folder" @keyup.enter="toggleInput('production-folder')">
              </td>
            </tr>  
            <tr>
              <td><span @click="toggleInput('production-folder-server')">SERVER</span><span class="copy-clipboard" @click="copyToClipboard(currentClient.production.folder_server)">(c)</span></td>
              <td>{{ currentClient.production.folder_server }}
                <input type="text" id="production-folder-server" v-model="client.production.folder_server" @keyup.enter="toggleInput('production-folder-server')">
              </td>
            </tr>             

            <tr>
              <td colspan=2>
                <div class="info-buttons">
                  <button href="" v-if="infoButtons.includes('ssh') && currentClient.production.domain" @click="ssh(currentClient.production.domain, currentClient.production.ssh_user, currentClient.production.ssh_pass, 1)">SSH</button>
                  <button href="" v-if="infoButtons.includes('sftp') && currentClient.production.scp_session" @click="openScp(currentClient.production.scp_session)">SFTP</button>
                  <button href="" v-if="infoButtons.includes('folder') && currentClient.production.folder" @click="openFolder(currentClient.production.folder)">FOLDER</button>
                  <button href="" v-if="infoButtons.includes('folder') && currentClient.production.folder" @click="openCode(currentClient.production.folder)">CODE</button>
                  <button href="" v-if="infoButtons.includes('info')" @click="showDInfo('p')">i</button>                      
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
    <div class="dialog" v-if="showDialogInfo">
      <div class="dialog-close" @click="closeDialog">x</div>
      <div class="dialog-content">
        <div v-if="dialogInfoTextParsed === ''" @click="editing = !editing">[click to edit]</div>
        <div v-html="dialogInfoTextParsed" @click="editing = !editing"></div>
        <textarea v-if="editing && dialogInfoTextContext === 'p'" class="info-edit" v-model="client.production.info" @keyup.enter="saveConfig()"></textarea>
        <textarea v-if="editing && dialogInfoTextContext === 'd'" class="info-edit" v-model="client.development.info" @keyup.enter="saveConfig()"></textarea>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'

  export default {
    name: 'info',
    props: [],
    data () {
      return {
        showDialogInfo: false,
        dialogInfoText: '',
        dialogInfoTextContext: 'p',
        editing: false,
        'client': {
          'development': {
            'info': '',
            'ssh_user': '',
            'ssh_pass': '',
            'ftp_user': '',
            'ftp_pass': '',
            'domain': '',
            'scp_session': '',
            'folder': ''
          },
          'production': {
            'info': '',
            'ssh_user': '',
            'ssh_pass': '',
            'ftp_user': '',
            'ftp_pass': '',
            'domain': '',
            'scp_session': '',
            'folder': ''
          }
        }
      }
    },
    computed: {
      ...mapState(['config', 'currentClientName']),
      ...mapGetters(['allClients', 'currentClient']),
      dialogInfoTextParsed () {
        return this.dialogInfoText.replace(/(?:\r\n|\r|\n)/g, '<br />')
      },
      clients () {
        return this.allClients(this.clientsFilter)
      },
      infoButtons () {
        return this.config ? this.config.infoButtons : []
      },
      development () {
        return this.currentClient ? this.currentClient.development : {}
      },
      production () {
        return this.currentClient ? this.currentClient.production : {}
      }
    },
    mounted () {
    },
    watch: {
      development: function (oldVal, newVal) {
        this.client.development = JSON.parse(JSON.stringify(this.development))
      },
      production: function (oldVal, newVal) {
        this.client.production = JSON.parse(JSON.stringify(this.production))
      }
    },
    methods: {
      showDInfo (c) {
        if (c === 'p') {
          this.dialogInfoText = this.currentClient.production.info
          this.dialogInfoTextContext = 'p'
        } else {
          this.dialogInfoText = this.currentClient.development.info
          this.dialogInfoTextContext = 'd'
        }
        this.showDialogInfo = true
      },
      closeDialog () {
        this.showDialogInfo = false
        this.editing = false
      },
      saveConfig () {
        this.$store.dispatch('setDevelopment', this.client.development)
        this.$store.dispatch('setProduction', this.client.production)

        this.$emit('save-config')
      },
      toggleInput (id) {
        if (document.getElementById(id).style.display === 'block') {
          document.getElementById(id).style.display = 'none'
        } else {
          document.getElementById(id).style.display = 'block'
        }
        this.saveConfig()
      },
      copyToClipboard (val) {
        var dummy = document.createElement('input')
        document.body.appendChild(dummy)
        dummy.setAttribute('value', val)
        dummy.select()
        document.execCommand('copy')
        document.body.removeChild(dummy)
        // this.command = 'dir'
      },
      ssh (domain, user, pass, term) {
        this.$emit('set-command', `ssh ${user}@${domain}`)

        let that = this

        setTimeout(function () {
          that.$emit('set-command', pass)
        }, 2000)
      },
      openScp (session) {
        var child = require('child_process').execFile
        var executablePath = 'C:\\Program Files (x86)\\WinSCP\\WinSCP.exe'
        var parameters = [session]

        child(executablePath, parameters, function (err, data) {
          if (err) {
            console.error(err)
            return
          }
          console.log(data.toString())
        })
      },
      openCode (folder) {
        var child = require('child_process').execFile
        var executablePath = 'C:\\Program Files\\Microsoft VS Code\\Code.exe'
        var parameters = [folder]

        child(executablePath, parameters, function (err, data) {
          if (err) {
            console.error(err)
            return
          }
          console.log(data.toString())
        })
      },
      openFolder (folder) {
        var child = require('child_process').execFile
        var executablePath = 'C:\\Windows\\explorer.exe'
        var parameters = [folder]

        child(executablePath, parameters, function () {
        })
      }
    }
  }
</script>

<style>
</style>
