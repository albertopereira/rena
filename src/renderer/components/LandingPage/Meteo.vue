<template>
  <div>
    <line-chart :data="dataMeteo" :colors="['#96d1d1', '#c99336', '#dbd579']"></line-chart>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    components: {
    },
    data () {
      return {
        dataMeteo: []
      }
    },
    computed: {
    },
    mounted () {
      this.getMeteo()
      setInterval(() => {
        this.getMeteo()
      }, 600000)
    },
    methods: {
      getMeteo () {
        const t = []
        axios
          .get('http://api.ipma.pt/open-data/forecast/meteorology/cities/daily/1110600.json')
          .then(({ data }) => {
            t.push({
              name: 'Chuva',
              data: {
                [data.data[0].forecastDate]: +data.data[0].precipitaProb,
                [data.data[1].forecastDate]: +data.data[1].precipitaProb,
                [data.data[2].forecastDate]: +data.data[2].precipitaProb,
                [data.data[3].forecastDate]: +data.data[3].precipitaProb,
                [data.data[4].forecastDate]: +data.data[4].precipitaProb
              }
            })
            this.dataMeteo.push({
              name: 'Máximas',
              data: {
                [data.data[0].forecastDate]: +data.data[0].tMax,
                [data.data[1].forecastDate]: +data.data[1].tMax,
                [data.data[2].forecastDate]: +data.data[2].tMax,
                [data.data[3].forecastDate]: +data.data[3].tMax,
                [data.data[4].forecastDate]: +data.data[4].tMax
              }
            })
            this.dataMeteo.push({
              name: 'Mínimas',
              data: {
                [data.data[0].forecastDate]: +data.data[0].tMin,
                [data.data[1].forecastDate]: +data.data[1].tMin,
                [data.data[2].forecastDate]: +data.data[2].tMin,
                [data.data[3].forecastDate]: +data.data[3].tMin,
                [data.data[4].forecastDate]: +data.data[4].tMin
              }
            })
          })
          .catch((err) => { console.log(err) })

        this.dataMeteo = t
      }
    }
  }
</script>

<style scoped>

</style>
