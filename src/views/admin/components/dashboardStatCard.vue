<script setup lang="ts">
type StatColor = 'blue' | 'orange' | 'green' | 'dark'

const props = withDefaults(
  defineProps<{
    label: string
    value: number | string
    color?: StatColor
  }>(),
  {
    color: 'blue',
  },
)
</script>


<template>
  <div class="stat-card">
    <span class="stat-label">{{ props.label }}</span>
    <span class="stat-value" :class="'stat-' + props.color">
      {{ props.value }}
    </span>
  </div>
</template>

<style scoped>
.stat-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 20px;
  box-sizing: border-box;
  background: #fff;
  border-radius: 12px;
}

.stat-label {
  color: #64748b;
  font-size: 13px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
}

.stat-blue {
  color: #3b73ec;
}

.stat-orange {
  color: #ea580c;
}

.stat-green {
  color: #16a34a;
}

.stat-dark {
  color: #1e293b;
}
</style>
