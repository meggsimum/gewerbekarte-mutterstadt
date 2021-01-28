<!-- Created by init-app.js at Tue Mar 10 2020 16:02:41 GMT+0100 (GMT+01:00) -->
<template>
  <wgu-app-tpl>
    <!-- insert your app slots here  -->

    <PoiInfo slot="wgu-before-content">
    </PoiInfo>

  </wgu-app-tpl>
</template>

<script>
  import WguAppTemplate from './WguAppTemplate.vue';
  import PoiInfo from './components/PoiInfo';
  import { Mapable } from '../src/mixins/Mapable';
  import LayerUtil from '../src/util/Layer';
  import {Style, Fill, Text, Stroke} from 'ol/style';
  import VectorLayer from 'ol/layer/Vector'
  import VectorSource from 'ol/source/Vector'

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
        const poiLayer = LayerUtil.getLayerByLid('gewerbe', me.map);
        if (!poiLayer) {
          return;
        }
        poiLayer.setStyle(me.poiStyle);

        const labelLayer = new VectorLayer({
          name: 'LabelLayer',
          lid: 'labellayer',
          source: new VectorSource(),
          style: function (feature, resolution) {
            return new Style({
              text: new Text({
                font: '15px sans-serif',
                text: feature.get('title'),
                padding: [5, 5, 5, 5],
                fill: new Fill({
                  color: 'black'
                }),
                offsetY: -30,
                backgroundFill: new Fill({
                  color: 'white'
                }),
                backgroundStroke: new Stroke({
                  color: 'black'
                }
                )
              })
            })
          }
        });
        me.map.addLayer(labelLayer)

        me.map.on('pointermove', function (e) {
          labelLayer.getSource().clear();
          me.map.forEachFeatureAtPixel(e.pixel, function (feature) {
            labelLayer.getSource().addFeature(feature);
            return true;
          },
          {
            hitTolerance: 5
          }
          );
        });
      },
      poiStyle (feature, resolution) {
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
            icon: 'support_agent',
            color: '#386cb0'
          },
          elektronik_computer: {
            icon: 'support_agent',
            color: '#386cb0'
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
            color: '#f0027f'
          }
        };
        const category = feature.get('kategorie');

        let style = new Style({
          text: new Text({
            text: symbols[category].icon,
            font: 'normal 30px Material Icons',
            fill: new Fill({
              color: symbols[category].color
            })
          })
        });

        return style;
      }
    }
  }
</script>
