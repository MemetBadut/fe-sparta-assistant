<template>
  <section class="detail-page">
    <RouterLink class="back" :to="{ name: 'admin-tickets' }">← Back to tickets</RouterLink>

    <div v-if="loading" class="state">Loading ticket...</div>
    <div v-else-if="error" class="state error">{{ error }}</div>
    <article v-else-if="ticket" class="card">
      <header>
        <div>
          <span class="number">{{ ticket.ticket_number }}</span>
          <h1>{{ ticket.issue_title }}</h1>
        </div>
        <span class="status" :class="statusClass(ticket.status)">{{ ticket.status }}</span>
      </header>

      <dl>
        <div><dt>Employee</dt><dd>{{ ticket.name }}</dd></div>
        <div><dt>Division</dt><dd>{{ ticket.division }}</dd></div>
        <div><dt>Category</dt><dd>{{ categoryLabel(ticket.category) }}</dd></div>
        <div><dt>Priority</dt><dd>{{ ticket.priority }}</dd></div>
        <div><dt>Assigned technician</dt><dd>{{ ticket.assigned_technician || 'Unassigned' }}</dd></div>
        <div><dt>Updated</dt><dd>{{ formatDate(ticket.updated_at) }}</dd></div>
      </dl>

      <div class="section">
        <h2>Description</h2>
        <p>{{ ticket.description }}</p>
      </div>
    </article>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { adminTicketService } from '@/services/adminTicketService'
import type { Ticket } from '@/services/ticketService'

const route = useRoute()
const ticket = ref<Ticket | null>(null)
const loading = ref(true)
const error = ref('')

const categoryLabels: Record<string, string> = {
  wifi_network: 'Wi-Fi / Network',
  windows: 'Windows',
  laptop_pc: 'Laptop / PC',
  printer: 'Printer',
  basic_software_issues: 'Basic Software Issues',
}

function categoryLabel(category: string) { return categoryLabels[category] ?? category }
function statusClass(status: Ticket['status']) { return status.toLowerCase().replace(/ /g, '-') }
function formatDate(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

onMounted(async () => {
  try {
    ticket.value = await adminTicketService.get(String(route.params.ticketNumber))
  } catch {
    error.value = 'Ticket could not be loaded.'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.detail-page { max-width: 820px; margin: 0 auto; }
.back { display: inline-block; margin-bottom: 20px; color: #1f5eff; font-size: 13px; text-decoration: none; }
.card { border: 1px solid #dce4ed; border-radius: 11px; background: #fff; padding: 24px; box-shadow: 0 1px 3px rgb(23 43 77 / 8%); }
header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 20px; }
.number { color: #8291a8; font-family: ui-monospace, monospace; font-size: 12px; }
h1 { margin: 5px 0 0; color: #172b4d; font-size: 20px; }
.status { border: 1px solid; border-radius: 5px; font-size: 12px; padding: 5px 9px; white-space: nowrap; }
.status.open { border-color: #b9d2ff; background: #f2f7ff; color: #145dff; }
.status.in-progress { border-color: #ffd973; background: #fffbeb; color: #c26a00; }
.status.resolved { border-color: #a7ebc6; background: #f1fff7; color: #078346; }
.status.closed { border-color: #d6e0eb; background: #f3f6fa; color: #526783; }
dl { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin: 0 0 24px; padding: 18px 0; border-top: 1px solid #edf1f5; border-bottom: 1px solid #edf1f5; }
dt { margin-bottom: 4px; color: #8291a8; font-size: 11px; text-transform: uppercase; }
dd { margin: 0; color: #172b4d; font-size: 13px; }
.section h2 { margin: 0 0 7px; color: #344054; font-size: 14px; }
.section p { margin: 0; color: #526783; font-size: 14px; line-height: 1.6; white-space: pre-wrap; }
.state { padding: 38px; border: 1px solid #dce4ed; border-radius: 11px; background: #fff; color: #71809a; text-align: center; }
.state.error { color: #b42318; }
@media (max-width: 520px) { dl { grid-template-columns: 1fr; } header { flex-direction: column; } }
</style>
