<!-- Created by init-app.js at Tue Mar 10 2020 16:02:41 GMT+0100 (GMT+01:00) -->
<template>
  <wgu-app-tpl>
    <!-- insert your app slots here  -->

    <PoiInfo slot='wgu-before-content'> </PoiInfo>
  </wgu-app-tpl>
</template>

<script>
import WguAppTemplate from './WguAppTemplate.vue';
import PoiInfo from './components/PoiInfo';
import { Mapable } from '../src/mixins/Mapable';
import LayerUtil from '../src/util/Layer';
import { Circle, Style, Fill, Text, Icon, Stroke } from 'ol/style';
import { WguEventBus } from '../src/WguEventBus';
import SelectInteraction from 'ol/interaction/Select';

export default {
  name: 'my-wgu-app',
  mixins: [Mapable],
  components: {
    'wgu-app-tpl': WguAppTemplate,
    PoiInfo
  },
  methods: {
    onMapBound () {
      const me = this;

      me.addCustomPoiStyle();
    },

    /**
     * Replaces the original style of the POI layer
     * with a custom style.
     * We also create a custom select Interaction that
     * extends the custom style with a highlighting.
     *
     * NOTE: This is not yet possible in Wegue. That's why
     *       we setup this behavior here.
     */
    addCustomPoiStyle: function () {
      const me = this;

      const lid = 'gewerbe';

      const poiLayer = LayerUtil.getLayerByLid(lid, me.map);
      if (!poiLayer) {
        return;
      }
      poiLayer.setStyle(me.poiStyle);

      const theme = this.$vuetify.theme.currentTheme;

      let primary = theme.primary;

      // define style for selection
      const selectStyle = new Style({
        image: new Circle({
          radius: 20,
          fill: new Fill({
            // TODO: currently white, make configurable
            color: 'rgb(255, 255, 255, 0.3)'
          }),
          stroke: new Stroke({
            color: primary,
            width: 4
          })
        })
      });

      // we create a combination of the existing style and the
      // selection style
      const selectClick = new SelectInteraction({
        layers: [poiLayer],
        hitTolerance: 5,
        style: function (feature, resolution) {
          // we need to call layer again in case it has
          // changed since initialisation
          const layer = LayerUtil.getLayerByLid(lid, me.map);
          if (!layer) {
            return;
          }
          const layerStyleFunction = layer.getStyle();
          // we return an array of the selection style and the features style
          return [selectStyle, layerStyleFunction(feature, resolution)];
        }
      });

      // forward an event if feature selection changes
      selectClick.on('select', function (evt) {
        // TODO use identifier for layer (once its implemented)
        WguEventBus.$emit(
          'map-selectionchange',
          lid,
          evt.selected,
          evt.deselected
        );
      });
      // register/activate interaction on map
      me.map.addInteraction(selectClick);
    },

    /**
     * The style for the POI layer.
     */
    poiStyle (feature) {
      // styles: https://material.io/resources/icons/?style=baseline
      const symbols = {
        apotheken: {
          icon: 'local_pharmacy',
          color: '#beaed4'
        },
        banken_versicherungen: {
          icon: 'account_balance',
          color: '#fdc086'
        },
        steuerberater_rechtsanwaelte: {
          icon: 'account_balance',
          color: '#fdc086'
        },
        bauwesen: {
          icon: 'handyman',
          color: '#7fc97f'
        },
        handwerk: {
          icon: 'handyman',
          color: '#7fc97f'
        },
        dienstleistungen: {
          isSvg: true,
          src: './static/icon/handshake.svg',
          scale: 3.5
        },
        elektronik_computer: {
          isSvg: true,
          src: './static/icon/handshake.svg',
          scale: 3.5
        },
        einzelhandel: {
          icon: 'shopping_basket',
          color: '#666666'
        },
        kraftfahrzeuge: {
          icon: 'directions_car',
          color: '#bf5b17'
        },
        postdienste: {
          icon: 'email',
          color: '#FCE94F'
        }
      };
      const category = feature.get('kategorie');

      // styles can be provided as 'material design' font icon
      // or as SVG icon
      let style;
      if (symbols[category].isSvg) {
        style = new Style({
          image: new Icon({
            src: symbols[category].src,
            scale: symbols[category].scale
          })
        });
      } else {
        style = new Style({
          text: new Text({
            text: symbols[category].icon,
            font: 'normal 30px Material Icons',
            fill: new Fill({
              color: symbols[category].color
            })
          })
        });
      }

      return style;
    }
  }
};
</script>
