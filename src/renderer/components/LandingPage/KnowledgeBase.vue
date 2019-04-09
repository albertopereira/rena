<template>
  <div>
    <input type="text" class="search-kb" id="kb1" v-model="kb1Filter">
    <input type="text" class="search-kb" id="kb2" v-model="kb2Filter">
    <input type="text" class="search-kb" id="kb3" v-model="kb3Filter">
    <button class="add-kb" @click="addKb">+</button>
    <div class="content">
      <ul>
        <li v-for="(kb, i) in kbList" :key="i">
          <div @click="filter(kb.category)" class="kb-category">({{ kb.category }})</div> 
          <div class="kb-title" @click.prevent="showKbDetails(kb.id)">
            <vue-markdown :source="kb.title"></vue-markdown>
          </div>
          <div>[{{ kb.tags }}]</div>
          <!-- <div><a href="#" class="show-task" @click.prevent="showKbDetails(kb.id)">(*)</a></div> -->
        </li>
      </ul>
    </div>

    <div class="kb-dialog" v-if="showDialog">
      <div class="dialog-close" @click="closeDetails">x</div>
      <div class="dialog-content">
        <div class="kb-details" v-if="!editing">
          <div class="dialog-category-tags">
            <span class="dialog-categories">{{ current.category }}</span> | 
            <span class="dialog-tags">{{ current.tags }}</span> | 
            <span class="dialog-date">{{ Date(current.date).toLocaleString("pt-PT") }}</span>
          </div>
          <div class="dialog-title">
            <vue-markdown>{{ current.title }}</vue-markdown>
          </div>
          <div class="dialog-body">
            <vue-markdown>{{ current.content }}</vue-markdown>
          </div>
          <button class="button" @click="edit()">EDIT</button>
          <button class="button" @click="deleteKb()">DELETE <span v-if="deleting">(click again)</span></button>
        </div>

        <div class="kb-editing" v-if="editing">
          <span>Category</span>
          <input type="text" class="editing-fields" v-model="current.category">

          <span>Title</span>
          <input type="text" class="editing-fields" v-model="current.title">

          <span>Tags</span>
          <input type="text" class="editing-fields" v-model="current.tags">

          <span>Content</span>
          <textarea id="" class="editing-fields" cols="30" rows="10" v-model="current.content"></textarea>

          <button class="button" @click="save()">SAVE</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import VueMarkdown from 'vue-markdown'
  import { mapState, mapGetters } from 'vuex'

  export default {
    components: {
      VueMarkdown
    },
    data () {
      return {
        showDialog: false,
        dialogText: '',
        kb1Filter: '',
        kb2Filter: '',
        kb3Filter: '',
        currentKb: '',
        allKb: [],
        newKb: {
          id: -1,
          category: '',
          tags: '',
          title: '',
          content: '',
          date: ''
        },
        editing: false,
        editingKb: {},
        deleting: false
      }
    },
    watch: {
      kb: function (oldVal, newVal) {
        this.allKb = JSON.parse(JSON.stringify(this.kb))
      },
      deep: true
    },
    computed: {
      ...mapState(['allData', 'currentClientName']),
      ...mapGetters(['allClients', 'currentClient']),
      kb () {
        return this.allData.kb
      },
      kbList () {
        let kb1 = this.allKb ? this.allKb.filter((e) => e.title.toLowerCase().includes(this.kb1Filter.toLowerCase()) || e.tags.toLowerCase().includes(this.kb1Filter.toLowerCase()) || e.content.toLowerCase().includes(this.kb1Filter.toLowerCase()) || e.category.toLowerCase().includes(this.kb1Filter.toLowerCase())) : null

        if (kb1) {
          kb1 = kb1.filter((e) => e.title.toLowerCase().includes(this.kb2Filter.toLowerCase()) || e.tags.toLowerCase().includes(this.kb2Filter.toLowerCase()) || e.content.toLowerCase().includes(this.kb2Filter.toLowerCase()) || e.category.toLowerCase().includes(this.kb2Filter.toLowerCase()))
          kb1 = kb1.filter((e) => e.title.toLowerCase().includes(this.kb3Filter.toLowerCase()) || e.tags.toLowerCase().includes(this.kb3Filter.toLowerCase()) || e.content.toLowerCase().includes(this.kb3Filter.toLowerCase()) || e.category.toLowerCase().includes(this.kb3Filter.toLowerCase()))
        }

        return kb1
      },
      current () {
        return this.allKb ? this.allKb.filter((e) => e.id === this.currentKb)[0] : null
      }
    },
    mounted () {
      this.allKb = JSON.parse(JSON.stringify(this.kb))
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.closeDetails()
        }
      })
    },
    methods: {
      showKbDetails (id) {
        this.currentKb = id
        this.showDialog = true
      },
      edit () {
        this.editing = true
        this.deleting = false
      },
      save () {
        this.$store.dispatch('setKb', this.current)
        this.$emit('save')
        this.editing = false
      },
      addKb () {
        const newKb = {
          id: -1,
          category: '',
          tags: '',
          title: '',
          content: '',
          date: +(new Date())
        }

        const maxId = Math.max.apply(Math, this.kb.map(function (o) { return o.id }))

        newKb.id = isFinite(maxId) ? maxId + 1 : 1

        this.$store.dispatch('addKb', newKb)

        this.currentKb = newKb.id

        this.showDialog = true

        this.editing = true
      },
      filter (exp) {
        if (this.kb1Filter === '') {
          this.kb1Filter = exp
        } else if (this.kb2Filter === '') {
          this.kb2Filter = exp
        } else if (this.kb3Filter === '') {
          this.kb3Filter = exp
        }
      },
      deleteKb () {
        if (!this.deleting) {
          this.deleting = true
        } else {
          // let id = this.current.id
          // this.kb.splice(this.kb.findIndex((e) => e.id === id), 1)
          this.$store.dispatch('deleteKb', this.current.id)
          this.deleting = false
          this.showDialog = false
          this.save()
        }
      },
      closeDetails () {
        this.editing = false
        this.showDialog = false
        this.deleting = false
      }
    }
  }
</script>

<style scoped>

  .kb-dialog{
    position: fixed;
    left: 0px;
    top: 10px;
    width: 50%;
    height: 95%;
    backdrop-filter: brightness(60%) blur(5px);
  }

  .dialog-content{
    padding: 30px;
    font-size: 10px;
    height: 100%;
  }

  .dialog-title{
    font-weight: bold;
  }

  .dialog-body{
    margin-top: 10px;
    height: 470px;
    overflow: auto;
    margin-right: 10px;
  }
</style>
