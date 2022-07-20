<template>
  <div class="countdown">
    <div class="block">
      <p class="digit">{{ days }}</p>
      <div class="divider"></div>
      <p class="text">{{ $t('days') }}</p>
    </div>
    <div class="block">
      <p class="digit">{{ hours }}</p>
      <div class="divider"></div>
      <p class="text">{{ $t('hours') }}</p>
    </div>
    <div class="block">
      <p class="digit">{{ minutes }}</p>
      <div class="divider"></div>
      <p class="text">{{ $t('minutes') }}</p>
    </div>
    <div class="block">
      <p class="digit">{{ seconds }}</p>
      <div class="divider"></div>
      <p class="text">{{ $t('seconds') }}</p>
    </div>
  </div>
</template>

<style lang="scss">
.countdown {
  display: flex;
  min-width: 500px;
  justify-content: space-between;

  .block {
    display: flex !important;
    flex-direction: column;
    align-items: center;
    margin: 10px;
  }

  .text {
    color: white;
    font-size: 35px;
    font-family: "Clicker Script", cursive;
    font-weight: 100;
    margin-top: 10px;
    margin-bottom: 10px;
    text-align: center;
  }

  .divider {
    width: 50px;
    height: 1px;
    background-color: var(--q-secondary);
  }

  .digit {
    color: white;
    font-size: 70px;
    line-height: 70px;
    font-weight: 100;
    font-family: "Roboto", serif;
    margin: 10px;
    text-align: center;
  }
}
</style>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "countdown",
  props: {
    date: {
      type: String
    }
  },
  data() {
    return {
      intervalId: undefined,
      dateInSec: Math.trunc(Date.parse(this.date) / 1000),
      now: Math.trunc(new Date().getTime() / 1000),
      seconds: "00",
      minutes: "00",
      hours: "00",
      days: "00"
    };
  },
  mounted() {
    var that = this;
    this.intervalId = setInterval(() => {
      that.now = Math.trunc(new Date().getTime() / 1000);
    }, 1000);
  },
  unmounted() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  },
  watch: {
    now: function (val) {
      const diff = this.dateInSec - val;

      this.seconds = this.towDigits(diff % 60);
      this.minutes = this.towDigits((diff / 60) % 60);
      this.hours = this.towDigits((diff / 60 / 60) % 24);
      this.days = this.towDigits(diff / 60 / 60 / 24);
    }
  },
  methods: {
    towDigits(value) {
      value = Math.trunc(value);

      if (value <= 0) {
        return "00";
      }

      if (value.toString().length <= 1) {
        return `0${value}`;
      }
      return value.toString();
    }
  }
});
</script>
