import { shallowMount } from '@vue/test-utils';
import LayerPreviewImage from '@/components/bglayerswitcher/LayerPreviewImage';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import View from 'ol/View';

const osmLayer = new TileLayer({
  source: new OSM()
});

const view = new View({
  projection: 'EPSG:3857',
  center: [0, 0],
  zoom: 2
});

const moduleProps = {
  'mapView': view,
  'layer': osmLayer,
  'width': 152,
  'height': 114,
  'previewIcon': 'map'
};

describe('bglayerswitcher/LayerPreviewImage.vue', () => {
  it('is defined', () => {
    expect(LayerPreviewImage).to.not.be.an('undefined');
  });

  describe('props', () => {
    let comp;
    let vm;
    beforeEach(() => {
      comp = shallowMount(LayerPreviewImage, {
        propsData: moduleProps
      });
      vm = comp.vm;
    });

    it('has correct props', () => {
      expect(vm.mapView).to.equal(view);
      expect(vm.layer).to.equal(osmLayer);
      expect(vm.width).to.equal(152);
      expect(vm.height).to.equal(114);
      expect(vm.previewIcon).to.equal('map');
    });

    afterEach(() => {
      comp.destroy();
    });
  });

  describe('data', () => {
    let comp;
    let vm;
    beforeEach(() => {
      comp = shallowMount(LayerPreviewImage, {
        propsData: moduleProps
      });
      vm = comp.vm;
    });

    it('has correct default data', () => {
      expect(vm.imgLoaded).to.equal(false);
    });

    afterEach(() => {
      comp.destroy();
    });
  });

  describe('computed properties', () => {
    let comp;
    let vm;
    beforeEach(() => {
      comp = shallowMount(LayerPreviewImage, {
        propsData: moduleProps
      });
      vm = comp.vm;
    });

    it('has correct previewURL for OSM', () => {
      expect(vm.previewURL).to.equal('https://b.tile.openstreetmap.org/2/2/2.png');
    });

    it('has correct previewURL for static layer image', () => {
      const osmLayer2 = new TileLayer({
        source: new OSM(),
        previewImage: 'http://my-image.png'
      });

      comp.setProps({ layer: osmLayer2 });
      expect(vm.previewURL).to.equal('http://my-image.png');
    });

    afterEach(() => {
      comp.destroy();
    });
  });
});
