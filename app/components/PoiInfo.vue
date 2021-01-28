<template>

  <v-card
      class='position'
      v-if="showMe" >
 
    <v-card-text
      v-html="createTextHtml()"
    > 
    </v-card-text>
  </v-card>

</template>

<script>

import { Mapable } from '../../src/mixins/Mapable';
import { WguEventBus } from '../../src/WguEventBus';

export default {
  mixins: [Mapable],
  data () {
    return {
      showMe: false,
      branche: null,
      unternehmen: null
    }
  },
  props: {
    value: {type: Boolean}
  },
  mounted () {
    var me = this;

    WguEventBus.$on('wsr-feature-click', function (feature) {
      if (feature) {
        me.showMe = true;
        me.unternehmen = feature.get('unternehmen_html');
        me.branche = feature.get('branche_html');
      } else {
        me.showMe = false;
      }
    }
    )
  },
  methods: {
    createTextHtml () {
      if (!this.unternehmen || !this.branche) {
        return 'Default Text'
      }
      if (!this.branche) {
        return this.unternehmen
      }
      return this.unternehmen + '</br></br>' + '<b>Branche</b></br>' + this.branche;
    },
    /**
     * This function is executed, after the map is bound (see mixins/Mapable)
     */
    onMapBound () {
      var me = this;

      me.map.on('singleclick', function (evt) {
        let feature = me.map.forEachFeatureAtPixel(evt.pixel,
          (feature, layer) => {
            return feature;
          },
          {
            hitTolerance: 5
          });

        WguEventBus.$emit('wsr-feature-click', feature);
      });
    }
  }
}
</script>

<style>

  .position{
    width: 300px;
    position: absolute;
    top: 75px;
    left: 10px;
    z-index:100;
  }

  @media only screen and (max-width: 600px) {
    .position{
      width: 100%;
      top: 56px;
      max-height: 40%;
      bottom: unset;
      left: unset;
      overflow-y: scroll
    }
  }

</style>
