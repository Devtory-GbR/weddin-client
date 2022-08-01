<template>
  <div class="map" ref="map"></div>
</template>

<style lang="scss">
.map {
  height: 250px;
  width: 100%;
}
</style>

<script>
import { getMediaHost } from "src/utils/env-helper";
import { greyStyle, initLibrary } from "src/utils/gmap";
import { defineComponent } from "vue";

export default defineComponent({
  name: "google-map",
  props: {
    locations: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      infowindows: [],
      imagePath: getMediaHost()
    };
  },
  created() {},
  mounted() {
    this.initMap();
  },
  methods: {
    async initMap() {
      if (!this.locations[0].API_KEY) {
        console.error("Map will not work. No Google API Key provided");
      }

      const google = await initLibrary(this.locations[0].API_KEY);
      const mapDom = this.$refs["map"];

      const center = {
        lat: this.locations[0].latitude,
        lng: this.locations[0].lengthening
      };

      const map = new google.maps.Map(
        mapDom,
        Object.assign(
          {
            zoom: 9,
            center: center
          },
          greyStyle
        )
      );

      this.locations.forEach((location) => {
        const icon = location.pin.data
          ? this.imagePath +
            (location.pin.data.attributes.formats?.thumbnail?.url ||
              location.pin.data.attributes.url)
          : `/imgs/pin_placeholder.png`;
        const marker = new google.maps.Marker({
          position: {
            lat: location.latitude,
            lng: location.lengthening
          },
          icon: icon,
          title: location.title
        });

        const infowindow = new google.maps.InfoWindow({
          content: `
            <div>
              <span class="text-bold">${location.title}</span><br>
              ${location.addressLine1}<br>
              ${location.addressLine2}
            </div>`
        });

        this.infowindows.push(infowindow);

        marker.setMap(map);
        marker.addListener("click", () => {
          this.closeAllInfowwindows();
          infowindow.open(map, marker);
        });
      });
    },
    closeAllInfowwindows() {
      this.infowindows.forEach((infowindow) => infowindow.close());
    }
  }
});
</script>
