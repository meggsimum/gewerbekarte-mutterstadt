<template>
<!--remove <v-toolbar-side> -->
  <v-card class="wgu-helpwin">
    <v-toolbar :color="color" dark>
      <v-icon>{{ icon }}</v-icon>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-icon @click="onWinXClose">close</v-icon>
    </v-toolbar>

    <v-card-title primary-title>
      <div>
        <h3 class="headline mb-0">{{ headline }}</h3>
      </div>
    </v-card-title>
    <v-card-text>
      <div class="text--primary">
        Diese Anwendung stellt die auf der Webseite von <a href="http://www.mutterstadt.de/gv_mutterstadt/Wirtschaft/">Mutterstadt</a> aufgeführten Gewerbe auf einer interaktiven Landkarte dar. Durch das Klicken auf einen Punkt wird eine kurze Beschreibung eingeblendet. 
      </div>
    </v-card-text>
  </v-card>

</template>

<script>
  export default {
    props: {
      color: {type: String, required: false, default: 'red darken-3'},
      icon: {type: String, required: false, default: 'help'},
      title: {type: String, required: false, default: 'Info'},
      headline: {type: String, required: false, default: 'Gewerbe in Mutterstadt'}
    },
    data () {
      return {
        show: false
      }
    },
    methods: {
      onWinXClose: function () {
        this.$emit('winxclose');
      }
    }
  }
</script>

<style>
</style>
