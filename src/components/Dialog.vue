<template>
  <q-dialog v-model="show">
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ title }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">{{ message }}</q-card-section>

      <q-card-actions align="right">
        <q-btn v-close-popup flat label="Ok" color="primary" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      default: 'Operational'
    },
    message: {
      type: String,
      required: true
    }
  }
};
</script>
