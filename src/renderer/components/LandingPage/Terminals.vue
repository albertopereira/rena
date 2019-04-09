<template>
  <div class="doc-terminals">
    <div class="nav">
      <button @click="changeContainer(idx)" v-for="(container, idx) in containers" :key="container.id" :class="viewContainer === idx ? 'selected' : ''">TERM {{ idx + 1 }}</button>
      <!-- <button @click="changeContainer(1)" :class="viewContainer === 1 ? 'selected' : ''">SSH1</button> -->
      <button @click="addContainer()" class="addContainer">+</button>
    </div>
    <div v-for="container in containers" class="terminalContainer" :id="container.id" :key="container.id" :ref="container.id"></div>
  </div>
</template>

<script>
  import * as pty from 'node-pty-prebuilt'
  import { Terminal } from 'xterm'
  import { fit } from 'xterm/lib/addons/fit/fit'
  import _ from 'lodash'

  export default {
    props: ['command', 'bc', 'cssloaded', 'refit'],
    data () {
      return {
        containers: [],
        viewContainer: 0,
        ptyProc: null,
        ptyProc2: null,
        xterm: null,
        xterm2: null,
        electron: process.versions.electron,
        name: this.$route.name,
        node: process.versions.node,
        path: this.$route.path,
        platform: require('os').platform(),
        vue: require('vue/package.json').version,
        properties: {
          cols: 40,
          rows: Math.round(window.innerHeight * 0.030),
          cursorBlink: true,
          cursorStyle: 'block',
          allowTransparency: true,
          fontFamily: 'Fira Mono',
          fontSize: 11,
          fontWeight: 'normal',
          fontWeightBold: 'bold',
          letterSpacing: 0,
          lineHeight: 1,
          scrollback: 1500,
          bellStyle: 'none',
          theme: {
            foreground: '#ffffff',
            // background: '#05080d',
            background: 'rgba(0,0,0,0.5)',
            cursor: '#aacfd1',
            cursorAccent: '#aacfd1',
            selection: 'rgba(170,207,209,0.3)',
            black: '#000000',
            red: '#cc0000',
            green: '#4e9a06',
            yellow: '#c4a000',
            blue: '#3465a4',
            magenta: '#75507b',
            cyan: '#06989a',
            white: '#d3d7cf',
            brightBlack: '#555753',
            brightRed: '#ef2929',
            brightGreen: '#8ae234',
            brightYellow: '#fce94f',
            brightBlue: '#729fcf',
            brightMagenta: '#ad7fa8',
            brightCyan: '#34e2e2',
            brightWhite: '#eeeeec'
          }
        }
      }
    },
    watch: {
      command: function (val, newval) {
        this.containers[this.viewContainer].ptyProc.write(val + '\r\n')
      },
      bc: function (val, newVal) {
        // this.properties.theme.background = val
      },
      cssloaded: function (old, newVal) {
        this.properties.theme.background = this.bc.backgroundColor
        this.properties.theme.foreground = this.bc.color
        for (let i = 0; i < this.containers.length; i++) {
          this.containers[i].xterm.setOption('theme', {
            background: this.bc.backgroundColor,
            foreground: this.bc.color
          })
        }
        this.$forceUpdate()
      },
      refit: function (val, newVal) {
        fit(this.containers[0].xterm)
      },
      deep: true
    },
    mounted () {
      this.addContainer()
      // this.containers[0].xterm.setOption('theme', { background: '#fdf6e3' })
    },
    methods: {
      addContainer () {
        const currContainer = this.containers.length

        this.containers.push({
          xterm: new Terminal(this.properties),
          id: `terminalContainer${currContainer + 1}`,
          ptyProc: null
        })

        this.$nextTick(function () {
          const tc = document.getElementById(this.containers[currContainer].id)

          if (tc) {
            this.containers[currContainer].xterm.open(tc)
          }

          this.containers[currContainer].ptyProc = pty.spawn((process.platform === 'win32') ? 'cmd.exe' : 'bash', [], {
            cols: this.containers[currContainer].xterm.cols,
            rows: this.containers[currContainer].xterm.rows
          })

          const fitDebounced = _.debounce(() => {
            fit(this.containers[currContainer].xterm)
          }, 17)

          this.containers[currContainer].xterm.on('data', (data) => {
            this.containers[currContainer].ptyProc.write(data)
          })

          this.containers[currContainer].xterm.on('resize', (size) => {
            this.containers[currContainer].ptyProc.resize(
              Math.max(size ? size.cols : this.containers[currContainer].xterm.cols, 1),
              Math.max(size ? size.rows : this.containers[currContainer].xterm.rows, 1)
            )
          })

          this.containers[currContainer].ptyProc.on('data', (data) => {
            this.containers[currContainer].xterm.write(data)
          })

          window.onresize = () => {
            fitDebounced()
          }

          const terms = document.querySelectorAll('.xterm-viewport')

          terms.forEach((e) => {
            e.style.overflow = 'hidden'
          })

          this.viewContainer = currContainer
          this.changeContainer(currContainer)
          Array.from(document.getElementsByClassName('xterm')).forEach((el) => {
            el.style.padding = '10px'
            el.style.margin = '-10px'
          })

          fitDebounced()
        })
      },
      changeContainer (ct) {
        this.viewContainer = ct
        for (let i = 0; i < this.containers.length; i++) {
          if (i === ct) {
            document.getElementById(this.containers[i].id).style.display = 'block'
          } else {
            document.getElementById(this.containers[i].id).style.display = 'none'
          }
        }
        fit(this.containers[ct].xterm)
      }
    }
  }
</script>

<style scoped>
</style>
