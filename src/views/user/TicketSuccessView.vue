<template>
  <section class="success-page">
    <article class="success-card">
      <div class="success-icon" aria-hidden="true"><i class="ri-check-line"></i></div>
      <p class="eyebrow">TICKET SUBMITTED</p>
      <h1>Your IT ticket has been created</h1>
      <p class="message">The IT team will review your issue and follow up with you through the helpdesk.</p>
      <div class="ticket-reference">
        <span>Ticket number</span>
        <strong>{{ ticketNumber }}</strong>
      </div>
      <div class="actions">
        <RouterLink class="primary-button" :to="{ name: 'user-ticket-detail', params: { ticketNumber } }">View Ticket</RouterLink>
        <RouterLink class="secondary-button" :to="{ name: 'user-dashboard' }">Back to Dashboard</RouterLink>
      </div>
    </article>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const ticketNumber = computed(() => String(route.params.ticketNumber || ''))
</script>

<style scoped>
.success-page { display: grid; place-items: center; min-height: 58vh; }
.success-card { width: min(520px, 100%); box-sizing: border-box; border: 1px solid #dce4ed; border-radius: 13px; background: #fff; padding: 38px 32px; box-shadow: 0 4px 15px rgb(23 43 77 / 8%); text-align: center; }
.success-icon { display: grid; place-items: center; width: 54px; height: 54px; margin: 0 auto 17px; border-radius: 50%; background: #eafaf1; color: #078346; font-size: 28px; }
.eyebrow { margin: 0 0 8px; color: #078346; font-size: 11px; font-weight: 700; letter-spacing: .08em; }
h1 { margin: 0; color: #172b4d; font-size: 22px; line-height: 1.25; }
.message { margin: 12px auto 22px; color: #71809a; font-size: 13px; line-height: 1.55; }
.ticket-reference { display: grid; gap: 5px; margin-bottom: 25px; border-radius: 8px; background: #f5f8fc; padding: 13px; }
.ticket-reference span { color: #8291a8; font-size: 11px; }
.ticket-reference strong { color: #172b4d; font-family: ui-monospace, monospace; font-size: 16px; }
.actions { display: flex; justify-content: center; flex-wrap: wrap; gap: 10px; }
.primary-button, .secondary-button { min-height: 37px; display: inline-flex; align-items: center; justify-content: center; border-radius: 7px; font-size: 12px; font-weight: 600; padding: 0 15px; text-decoration: none; }
.primary-button { background: #1f5eff; color: #fff; }
.primary-button:hover { background: #174bd1; }
.secondary-button { border: 1px solid #d5deea; color: #526783; }
@media (max-width: 480px) { .success-card { padding: 30px 20px; } .actions { flex-direction: column; } .primary-button, .secondary-button { width: 100%; box-sizing: border-box; } }
</style>
