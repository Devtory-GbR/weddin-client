<template>
  <div class="fixed-center text-center">
    <h1 class="text-weddin-p font-pretty q-mb-xs">{{ $t("WeddIn") }}</h1>
    <p>
      <img src="~assets/broken.png" style="width:30vw;max-width:150px;" />
    </p>
    <p class="text-default text-body1">
      {{ $t("err404_text") }}
      <br />
      <strong>(404)</strong>
    </p>
    <p class="text-faded"></p>
    <q-btn color="weddin-a" style="width:200px;" to="/" :label="$t('back')" />
  </div>
</template>

<script>
export default {
  name: "Error404"
};
</script>
