<template>

  <v-list expand>
    <wgu-layerlistitem
      v-for="layer in displayedLayers"
      :key="layer.get('lid')"
      :layer="layer"
      :mapView="map.getView()"
      :showLegends="showLegends"
      :showOpacityControls="showOpacityControls"
    />
  </v-list> 
</template>

<script>
  import { Mapable } from '../../mixins/Mapable';
  import LayerListItem from './LayerListItem'
  
  export default {
    name: 'wgu-layerlist',
    components: {
      'wgu-layerlistitem': LayerListItem
    },
    mixins: [Mapable],
    props: {
      showLegends: { type: Boolean, required: true },
      showOpacityControls: { type: Boolean, required: true }
    },
    data () {
      return {
        layers: []
      }
    },
    methods: {
      /**
       * This function is executed, after the map is bound (see mixins/Mapable).
       * Bind to the layers from the OpenLayers map.
       */
      onMapBound () {
        this.layers = this.map.getLayers().getArray();
      }
    },
    computed: {
      /**
       * Reactive property to return the OpenLayers layers to be shown in the control.
       * Remarks: The 'displayInLayerList' attribute should default to true per convention.
       */
      displayedLayers () {
        return this.layers
          .filter(layer => layer.get('displayInLayerList') !== false && !layer.get('isBaseLayer'))
          .reverse();
      }
    }
  }
</script>
