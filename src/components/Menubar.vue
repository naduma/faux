<template>
  <header class="navbar">
    <section class="navbar-section">
      <button class="btn btn-link" v-on:click="$emit('config')">config</button>
    </section>
    <section class="navbar-section">
      <button class="btn btn-action btn-sm s-circle" v-on:click="$emit('help')">?</button>
    </section>
  </header>
</template>

<script>
export default {
  name: 'Menubar'
}
</script>

<style scoped lang="scss">
header {
  border-bottom: 1px solid $gray-color;
}
.btn-action {
  margin-right: $control-padding-x;
}
</style>
