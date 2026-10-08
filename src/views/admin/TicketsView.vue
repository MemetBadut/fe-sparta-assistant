<template>
  <section class="tickets-page">
    <header class="page-header">
      <h1>Tickets</h1>
      <span class="ticket-count">{{ tickets.length }} tickets</span>
    </header>

    <section class="filter-card" aria-label="Ticket filters">
      <label class="search-field">
        <i class="ri-search-line" aria-hidden="true"></i>
        <input v-model="filters.search" type="search" placeholder="Search ticket ID, issue, or employee..." aria-label="Search tickets" />
      </label>
      <select v-model="filters.category" aria-label="Filter by category">
        <option value="">All categories</option>
        <option v-for="category in categoryOptions" :key="category.value" :value="category.value">{{ category.label }}</option>
      </select>
      <select v-model="filters.status" aria-label="Filter by status">
        <option value="">All statuses</option>
        <option v-for="status in statuses" :key="status" :value="status">{{ status }}</option>
      </select>
      <select v-model="filters.priority" aria-label="Filter by priority">
        <option value="">All priorities</option>
        <option v-for="priority in priorities" :key="priority" :value="priority">{{ priority }}</option>
      </select>
    </section>

    <section class="table-card">
      <div v-if="loading" class="table-state">Loading tickets...</div>
      <div v-else-if="error" class="table-state error">{{ error }}</div>
      <div v-else class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Issue</th>
              <th>Employee</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Created</th>
              <th>Assigned</th>
              <th><span class="sr-only">Action</span></th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="tickets.length === 0">
              <td class="empty-cell" colspan="9">Data unavailable</td>
            </tr>
            <tr v-for="ticket in tickets" :key="ticket.ticket_number">
              <td class="ticket-id">{{ ticket.ticket_number }}</td>
              <td class="issue-cell">{{ ticket.issue_title }}</td>
              <td>
                <strong class="employee-name">{{ ticket.name }}</strong>
                <span class="division">{{ ticket.division }}</span>
              </td>
              <td><span class="category">{{ categoryLabel(ticket.category) }}</span></td>
              <td><span class="priority" :class="priorityClass(ticket.priority)">{{ ticket.priority }}</span></td>
              <td><span class="status" :class="statusClass(ticket.status)">{{ ticket.status }}</span></td>
              <td class="date">{{ formatDate(ticket.created_at) }}</td>
              <td class="assigned">{{ ticket.assigned_technician || 'Unassigned' }}</td>
              <td><RouterLink class="view-link" :to="{ name: 'admin-ticket-detail', params: { ticketNumber: ticket.ticket_number } }">View →</RouterLink></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import { adminTicketService } from '@/services/adminTicketService'
import type { Ticket, TicketPriority, TicketStatus } from '@/services/ticketService'

const statuses: TicketStatus[] = ['Open', 'In Progress', 'Resolved', 'Closed']
const priorities: TicketPriority[] = ['Low', 'Medium', 'High', 'Urgent']
const categoryOptions = [
  { value: 'wifi_network', label: 'Wi-Fi / Network' },
  { value: 'windows', label: 'Windows' },
  { value: 'laptop_pc', label: 'Laptop / PC' },
  { value: 'printer', label: 'Printer' },
  { value: 'basic_software_issues', label: 'Basic Software Issues' },
]

const filters = reactive<{ search: string; category: string; status: TicketStatus | ''; priority: TicketPriority | '' }>({
  search: '', category: '', status: '', priority: '',
})
const tickets = ref<Ticket[]>([])
const loading = ref(true)
const error = ref('')
let requestId = 0

async function fetchTickets() {
  const currentRequest = ++requestId
  loading.value = true
  error.value = ''
  try {
    const response = await adminTicketService.list(filters)
    if (currentRequest === requestId) tickets.value = response.data
  } catch {
    if (currentRequest === requestId) error.value = 'Tickets could not be loaded.'
  } finally {
    if (currentRequest === requestId) loading.value = false
  }
}

function categoryLabel(category: string) { return categoryOptions.find((item) => item.value === category)?.label ?? category }
function priorityClass(priority: TicketPriority) { return priority.toLowerCase() }
function statusClass(status: TicketStatus) { return status.toLowerCase().replace(/ /g, '-') }
function formatDate(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date)
}

let searchTimer: ReturnType<typeof setTimeout> | undefined
watch(filters, () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(fetchTickets, 250)
}, { deep: true })
onMounted(fetchTickets)
</script>

<style scoped>
.tickets-page { max-width: 1180px; margin: 0 auto; }
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 23px; }
h1 { margin: 0; color: #172b4d; font-size: 18px; }
.ticket-count { color: #71809a; font-size: 12px; }
.filter-card, .table-card { border: 1px solid #dce4ed; border-radius: 11px; background: #fff; box-shadow: 0 1px 3px rgb(23 43 77 / 9%); }
.filter-card { display: grid; grid-template-columns: minmax(250px, 1fr) 172px 125px 125px; gap: 10px; margin-bottom: 16px; padding: 14px; }
.search-field { display: flex; align-items: center; gap: 8px; border: 1px solid #cbd8e8; border-radius: 7px; color: #8aa0bc; padding: 0 11px; }
.search-field input, select { width: 100%; box-sizing: border-box; border: 1px solid #cbd8e8; border-radius: 7px; background: #fff; color: #172b4d; font: inherit; font-size: 12px; outline: 0; padding: 9px 10px; }
.search-field input { border: 0; padding: 9px 0; }
.search-field:focus-within, select:focus { border-color: #1f5eff; box-shadow: 0 0 0 3px #dbe7ff; }
.table-card { overflow: hidden; }
.table-wrap { overflow-x: auto; }
table { width: 100%; min-width: 930px; border-collapse: collapse; table-layout: fixed; }
th { border-bottom: 1px solid #edf1f5; background: #fbfcfe; color: #60708a; font-size: 10px; font-weight: 700; padding: 12px 15px; text-align: left; text-transform: uppercase; }
td { border-bottom: 1px solid #edf1f5; color: #526783; font-size: 11px; padding: 13px 15px; vertical-align: middle; }
tbody tr:last-child td { border-bottom: 0; }
th:nth-child(1), td:nth-child(1) { width: 11%; } th:nth-child(2), td:nth-child(2) { width: 16%; } th:nth-child(3), td:nth-child(3) { width: 15%; } th:nth-child(4), td:nth-child(4) { width: 13%; } th:nth-child(5), td:nth-child(5) { width: 9%; } th:nth-child(6), td:nth-child(6) { width: 10%; } th:nth-child(7), td:nth-child(7) { width: 8%; } th:nth-child(8), td:nth-child(8) { width: 10%; } th:nth-child(9), td:nth-child(9) { width: 8%; }
.ticket-id { color: #526783; font-family: ui-monospace, monospace; font-size: 10px; white-space: nowrap; }
.issue-cell { color: #172b4d; line-height: 1.35; }
.employee-name, .division { display: block; line-height: 1.35; }
.employee-name { color: #172b4d; font-weight: 500; }
.division { color: #8291a8; }
.category { display: inline-block; border-radius: 4px; background: #f0f3f7; color: #526783; padding: 4px 7px; white-space: nowrap; }
.priority, .status { display: inline-block; border: 1px solid; border-radius: 5px; padding: 4px 7px; white-space: nowrap; }
.priority.high { border-color: #ffc7c7; background: #fff4f4; color: #e04444; }
.priority.medium { border-color: #ffd973; background: #fffbeb; color: #c26a00; }
.priority.low { border-color: #cbd8e8; background: #f7f9fc; color: #60708a; }
.priority.urgent { border-color: #e5b5ff; background: #fcf3ff; color: #8a30b5; }
.status.open { border-color: #b9d2ff; background: #f2f7ff; color: #145dff; }
.status.in-progress { border-color: #ffd973; background: #fffbeb; color: #c26a00; }
.status.resolved { border-color: #a7ebc6; background: #f1fff7; color: #078346; }
.status.closed { border-color: #d6e0eb; background: #f3f6fa; color: #526783; }
.date { color: #71809a; white-space: nowrap; }
.assigned { overflow-wrap: anywhere; }
.view-link { color: #1f5eff; font-size: 11px; text-decoration: none; white-space: nowrap; }
.view-link:hover { text-decoration: underline; }
.empty-cell { height: 300px; color: #8291a8; font-size: 13px; text-align: center; }
.table-state { padding: 42px; color: #71809a; font-size: 13px; text-align: center; }
.table-state.error { color: #b42318; }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
@media (max-width: 800px) { .filter-card { grid-template-columns: 1fr 1fr; } .search-field { grid-column: 1 / -1; } }
@media (max-width: 480px) { .filter-card { grid-template-columns: 1fr; } .search-field { grid-column: auto; } }
</style>
