<template>
  <div class="divider-section">
    <div>{{ text }}</div>
  </div>
</template>
<style lang="scss">
.divider-section {
  padding: 24px;
  background-color: var(--q-accent);

  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  min-height: 160px;
  width: 100%;

  div {
    max-width: 600px;
    padding: 24px 0;
    color: white;
    font-style: italic;
    font-weight: 100;
    text-align: center;
    font-size: 1.5rem;
    line-height: 2rem;
    letter-spacing: normal;
  }
}

@media (max-width: 770px) {
  .divider-section {
    div {
      padding: 12px 0;
      font-size: 1.25rem;
    }
  }
}

@media (max-width: 400px) {
  .divider-section {
    div {
      padding: 12px 0;
      font-size: 1rem;
    }
  }
}
</style>
<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "content-divider",
  props: {
    text: String
  }
});
</script>
