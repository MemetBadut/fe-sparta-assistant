<template>
  <section class="tickets-page">
    <header class="page-header">
      <h1>My Tickets</h1>
      <RouterLink class="new-button" :to="{ name: 'user-dashboard' }">
        <i class="ri-add-line"></i>
        New Troubleshooting
      </RouterLink>
    </header>

    <div class="filters" role="tablist" aria-label="Filter tickets by status">
      <button
        v-for="filter in filters"
        :key="filter.value"
        class="filter-button"
        :class="{ active: activeFilter === filter.value }"
        type="button"
        role="tab"
        :aria-selected="activeFilter === filter.value"
        @click="activeFilter = filter.value"
      >
        {{ filter.label }}
      </button>
      <span class="ticket-count">{{ tickets.length }} tickets</span>
    </div>

    <div v-if="loading" class="state">Loading tickets...</div>
    <div v-else-if="error" class="state error">{{ error }}</div>
    <div v-else-if="filteredTickets.length === 0" class="state">No tickets found.</div>
    <div v-else class="table-card">
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Issue</th>
              <th>Category</th>
              <th>Status</th>
              <th>Created</th>
              <th>Updated</th>
              <th><span class="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="ticket in filteredTickets" :key="ticket.ticket_number">
              <td class="ticket-id">{{ ticket.ticket_number }}</td>
              <td class="issue-cell">{{ ticket.issue_title }}</td>
              <td><span class="category">{{ categoryLabel(ticket.category) }}</span></td>
              <td><span class="status" :class="statusClass(ticket.status)">{{ ticket.status }}</span></td>
              <td class="date">{{ formatDate(ticket.created_at) }}</td>
              <td class="date">{{ formatDate(ticket.updated_at) }}</td>
              <td class="action-cell">
                <RouterLink :to="{ name: 'user-ticket-detail', params: { ticketNumber: ticket.ticket_number } }">View</RouterLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ticketService, type Ticket, type TicketStatus } from '@/services/ticketService'

type Filter = 'all' | TicketStatus

const filters: { label: string; value: Filter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Open', value: 'Open' },
  { label: 'In Progress', value: 'In Progress' },
  { label: 'Resolved', value: 'Resolved' },
  { label: 'Closed', value: 'Closed' },
]

const tickets = ref<Ticket[]>([])
const activeFilter = ref<Filter>('all')
const loading = ref(true)
const error = ref('')

const filteredTickets = computed(() =>
  activeFilter.value === 'all'
    ? tickets.value
    : tickets.value.filter((ticket) => ticket.status === activeFilter.value),
)

const labels: Record<string, string> = {
  wifi_network: 'Wi-Fi / Network',
  basic_software_issues: 'Basic Software Issues',
}

function categoryLabel(category: string) {
  return labels[category] ?? category
}

function statusClass(status: Ticket['status']) {
  return status.toLowerCase().replace(' ', '-')
}

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date)
}

onMounted(async () => {
  try {
    tickets.value = await ticketService.list()
  } catch {
    error.value = 'Tickets could not be loaded.'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.tickets-page {
  max-width: 1120px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 22px;
}

h1 {
  margin: 0;
  color: #182b49;
  font-size: 18px;
  font-weight: 700;
}

.new-button {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border-radius: 8px;
  background: #1f5eff;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  padding: 9px 14px;
  text-decoration: none;
  transition: background 0.15s ease;
}

.new-button:hover { background: #174bd1; }
.new-button i { font-size: 15px; }

.filters {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 17px;
}

.filter-button {
  border: 1px solid #dce4ed;
  border-radius: 7px;
  background: #fff;
  color: #526783;
  cursor: pointer;
  font: inherit;
  font-size: 11px;
  padding: 6px 11px;
}

.filter-button:hover { border-color: #aac3f5; color: #1f5eff; }
.filter-button.active { border-color: #1f5eff; background: #1f5eff; color: #fff; }
.ticket-count { margin-left: 5px; color: #94a3b8; font-size: 11px; }

.table-card {
  overflow: hidden;
  border: 1px solid #dce4ed;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 1px 3px rgb(15 23 42 / 9%);
}

.table-wrapper { overflow-x: auto; }

table {
  width: 100%;
  min-width: 760px;
  border-collapse: collapse;
  table-layout: fixed;
}

th {
  background: #f8fafc;
  border-bottom: 1px solid #e7edf4;
  color: #60708a;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.04em;
  padding: 11px 18px;
  text-align: left;
  text-transform: uppercase;
}

td {
  border-bottom: 1px solid #edf1f5;
  color: #526783;
  font-size: 12px;
  height: 67px;
  padding: 10px 18px;
  vertical-align: middle;
}

tbody tr:last-child td { border-bottom: 0; }
tbody tr:hover { background: #fbfdff; }
th:nth-child(1), td:nth-child(1) { width: 12%; }
th:nth-child(2), td:nth-child(2) { width: 25%; }
th:nth-child(3), td:nth-child(3) { width: 17%; }
th:nth-child(4), td:nth-child(4) { width: 14%; }
th:nth-child(5), td:nth-child(5), th:nth-child(6), td:nth-child(6) { width: 12%; }
th:nth-child(7), td:nth-child(7) { width: 8%; }

.ticket-id {
  color: #526783;
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: 11px;
  line-height: 1.8;
  overflow-wrap: anywhere;
}

.issue-cell {
  overflow: hidden;
  color: #172b4d;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.category {
  display: inline-block;
  max-width: 130px;
  border-radius: 3px;
  background: #f1f4f8;
  color: #526783;
  line-height: 1.5;
  padding: 2px 5px;
}

.status {
  display: inline-block;
  border: 1px solid;
  border-radius: 5px;
  font-size: 11px;
  line-height: 1.4;
  padding: 5px 8px;
  white-space: normal;
}

.status.open { border-color: #b9d2ff; background: #f2f7ff; color: #145dff; }
.status.in-progress { border-color: #ffd36f; background: #fffaf0; color: #b56a00; }
.status.resolved { border-color: #a7ebc6; background: #f1fff7; color: #078346; }
.status.closed { border-color: #d5dee9; background: #f6f8fb; color: #60708a; }

.date { color: #71809a; line-height: 1.4; }
.action-cell { text-align: right; }
td a { color: #1f5eff; font-size: 12px; text-decoration: none; }
td a:hover { text-decoration: underline; }

.state {
  border: 1px solid #dce4ed;
  border-radius: 12px;
  background: #fff;
  color: #71809a;
  padding: 40px;
  text-align: center;
}
.state.error { color: #b42318; }
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0, 0, 0, 0); }

@media (max-width: 700px) {
  .page-header { align-items: flex-start; flex-direction: column; }
  .new-button { width: 100%; justify-content: center; box-sizing: border-box; }
  .filters { flex-wrap: wrap; }
  .ticket-count { width: 100%; margin: 2px 0 0; }
  td, th { padding-left: 12px; padding-right: 12px; }
}
</style>
