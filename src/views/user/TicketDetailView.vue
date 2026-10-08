<template>
  <section class="detail-page">
    <RouterLink class="back" :to="{ name: 'user-tickets' }">← Back to tickets</RouterLink>

    <div v-if="loading" class="state">Loading ticket...</div>
    <div v-else-if="error" class="state error">{{ error }}</div>
    <div v-else-if="ticket" class="card">
      <header>
        <div>
          <span class="number">{{ ticket.ticket_number }}</span>
          <h1>{{ ticket.issue_title }}</h1>
        </div>
        <span class="status" :class="statusClass(ticket.status)">{{ ticket.status }}</span>
      </header>

      <dl>
        <div><dt>Category</dt><dd>{{ ticket.category }}</dd></div>
        <div><dt>Priority</dt><dd>{{ ticket.priority }}</dd></div>
        <div><dt>Assigned technician</dt><dd>{{ ticket.assigned_technician ?? '—' }}</dd></div>
        <div><dt>Updated</dt><dd>{{ formatDate(ticket.updated_at) }}</dd></div>
      </dl>

      <div class="section">
        <h2>Description</h2>
        <p>{{ ticket.description }}</p>
      </div>

      <div v-if="ticket.resolution_notes" class="section">
        <h2>Resolution notes</h2>
        <p>{{ ticket.resolution_notes }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ticketService, type Ticket } from '@/services/ticketService'

const route = useRoute()
const ticket = ref<Ticket | null>(null)
const loading = ref(true)
const error = ref('')

function statusClass(status: Ticket['status']) { return status.toLowerCase().replace(' ', '-') }
function formatDate(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date)
}

onMounted(async () => {
  try { ticket.value = await ticketService.get(route.params.ticketNumber as string) }
  catch { error.value = 'Ticket not found.' }
  finally { loading.value = false }
})
</script>

<style scoped>
.detail-page { max-width: 720px; margin: 0 auto; }
.back { display: inline-block; margin-bottom: 20px; color: #1f5eff; font-size: 13px; text-decoration: none; }
.card { border: 1px solid #e1e7ef; border-radius: 12px; background: #fff; padding: 26px; }
header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 20px; }
.number { color: #8291a8; font-family: ui-monospace, monospace; font-size: 12px; }
h1 { margin: 4px 0 0; color: #172b4d; font-size: 20px; }
.status { border-radius: 12px; font-size: 12px; padding: 5px 11px; white-space: nowrap; }
.status.open { background: #eaf2ff; color: #1f5eff; }.status.in-progress { background: #fff5db; color: #a15c00; }.status.resolved, .status.closed { background: #e7f8ef; color: #087443; }
dl { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin: 0 0 24px; padding: 18px 0; border-top: 1px solid #edf1f5; border-bottom: 1px solid #edf1f5; }
dt { margin: 0 0 3px; color: #8291a8; font-size: 11px; text-transform: uppercase; }
dd { margin: 0; color: #172b4d; font-size: 14px; }
.section { margin-top: 18px; }
.section h2 { margin: 0 0 6px; color: #344054; font-size: 14px; }
.section p { margin: 0; color: #526783; font-size: 14px; line-height: 1.6; white-space: pre-wrap; }
.state { padding: 38px; border: 1px solid #e1e7ef; border-radius: 12px; background: #fff; color: #71809a; text-align: center; }
.state.error { color: #b42318; }
@media (max-width: 500px) { dl { grid-template-columns: 1fr; } }
</style>
