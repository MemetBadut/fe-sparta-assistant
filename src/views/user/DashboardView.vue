<template>
  <div class="dashboard-page">
    <header class="page-heading">
      <div>
        <h1>What IT problem are you experiencing?</h1>
        <p>Describe your issue and get instant troubleshooting guidance.</p>
      </div>
    </header>

    <section class="help-card">
      <label for="issue-description">Describe your issue</label>
      <textarea
        id="issue-description"
        v-model="description"
        rows="4"
        placeholder="e.g. My laptop cannot connect to the office Wi-Fi..."
      ></textarea>

      <div v-if="candidates.length" class="category-heading">
        <span>Which category best matches your issue?</span>
        <small>Select one option so we can show the right solution</small>
      </div>

      <div v-if="candidates.length" class="categories">
        <button
          v-for="category in candidateCategories"
          :key="category.id"
          class="category-card"
          :class="{ selected: selectedCategory === category.id }"
          type="button"
          @click="selectedCategory = category.id"
        >
          <i :class="category.icon"></i>
          <span>{{ category.label }}</span>
        </button>
      </div>

      <p v-if="error" class="error" role="alert">{{ error }}</p>
      <button
        class="troubleshoot-button"
        type="button"
        :disabled="loading || (!!candidates.length && !selectedCategory)"
        @click="findTroubleshooting"
      >
        <i class="ri-search-line"></i>
        {{ loading ? 'Finding guidance...' : candidates.length ? 'Show Solution' : 'Find Troubleshooting' }}
      </button>
    </section>

    <section class="tickets-section">
      <header class="section-heading">
        <h2>Recent Tickets</h2>
        <RouterLink :to="{ name: 'user-tickets' }">View all <span>→</span></RouterLink>
      </header>

      <div v-if="ticketsLoading" class="state">Loading tickets...</div>
      <div v-else-if="tickets.length === 0" class="state">No tickets yet.</div>
      <div v-else class="tickets-card">
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Ticket</th>
                <th>Issue</th>
                <th>Status</th>
                <th>Updated</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="ticket in tickets.slice(0, 5)" :key="ticket.ticket_number">
                <td class="ticket-number">{{ ticket.ticket_number }}</td>
                <td class="issue-cell">{{ ticket.issue_title }}</td>
                <td>
                  <span class="status" :class="statusClass(ticket.status)">{{
                    ticket.status
                  }}</span>
                </td>
                <td class="date">{{ formatDate(ticket.updated_at) }}</td>
                <td>
                  <RouterLink
                    class="view-link"
                    :to="{
                      name: 'user-ticket-detail',
                      params: { ticketNumber: ticket.ticket_number },
                    }"
                    >View<br />Ticket</RouterLink
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTroubleshootingStore } from '@/stores/troubleshooting'
import { categoryService, type Category } from '@/services/categoryService'
import { ticketService, type Ticket } from '@/services/ticketService'
import { troubleshootingService, type TroubleshootingResult } from '@/services/troubleshootingService'

const router = useRouter()
const troubleshootingStore = useTroubleshootingStore()
const description = ref('')
const selectedCategory = ref('')
const candidates = ref<string[]>([])
const categories = ref<(Category & { icon: string })[]>([])
const tickets = ref<Ticket[]>([])
const loading = ref(false)
const ticketsLoading = ref(true)
const error = ref('')

const candidateCategories = computed(() =>
  categories.value.filter((category) => candidates.value.includes(category.id)),
)

const icons: Record<string, string> = {
  wifi_network: 'ri-wifi-line',
  windows: 'ri-windows-line',
  laptop_pc: 'ri-macbook-line',
  printer: 'ri-printer-line',
  basic_software_issues: 'ri-apps-line',
}

const canSearch = computed(() => description.value.trim().length >= 3)

async function findTroubleshooting() {
  if (!canSearch.value) {
    error.value = 'Describe your issue in at least 3 characters.'
    return
  }
  loading.value = true
  error.value = ''
  try {
    const response = await troubleshootingService.create({
      ...(selectedCategory.value ? { category: selectedCategory.value } : {}),
      description: description.value.trim(),
    })
    if ('status' in response && response.status === 'needs_category') {
      candidates.value = response.candidates
      selectedCategory.value = ''
      return
    }
    const result = response as TroubleshootingResult
    troubleshootingStore.setResult(result)
    router.push({ name: 'user-troubleshooting', params: { id: result.id } })
  } catch {
    error.value = 'Troubleshooting could not be loaded. Please try again.'
  } finally {
    loading.value = false
  }
}

function statusClass(status: Ticket['status']) {
  return status.toLowerCase().replace(' ', '-')
}

function formatDate(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? '—'
    : new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date)
}

onMounted(async () => {
  try {
    const [loadedCategories, loadedTickets] = await Promise.all([
      categoryService.list(),
      ticketService.list(),
    ])
    categories.value = loadedCategories.map((category) => ({
      ...category,
      icon: icons[category.id] || 'ri-question-line',
    }))
    tickets.value = loadedTickets
  } catch {
    error.value = 'Some dashboard data could not be loaded.'
  } finally {
    ticketsLoading.value = false
  }
})
</script>

<style scoped>
.dashboard-page {
  max-width: 1000px;
  margin: 0 auto;
}
.page-heading {
  margin-bottom: 28px;
}
h1 {
  margin: 0 0 8px;
  color: #172b4d;
  font-size: clamp(23px, 3vw, 30px);
  letter-spacing: -0.02em;
}
.page-heading p {
  margin: 0;
  color: #71809a;
  font-size: 14px;
}
.help-card,
.tickets-card {
  border: 1px solid #e1e7ef;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 2px 8px rgb(15 23 42 / 4%);
}
.help-card {
  padding: 26px;
}
.help-card label,
.category-heading span {
  display: block;
  color: #344054;
  font-size: 14px;
  font-weight: 600;
}
textarea {
  width: 100%;
  min-height: 112px;
  margin-top: 9px;
  box-sizing: border-box;
  resize: vertical;
  border: 1px solid #cbd6e4;
  border-radius: 8px;
  color: #172b4d;
  font: inherit;
  font-size: 14px;
  outline: 0;
  padding: 12px;
}
textarea:focus {
  border-color: #1f5eff;
  box-shadow: 0 0 0 3px #dbe7ff;
}
.category-heading {
  margin-top: 23px;
}
.category-heading small {
  display: block;
  margin-top: 4px;
  color: #8291a8;
  font-size: 12px;
}
.categories {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  margin-top: 13px;
}
.category-card {
  min-height: 106px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 1px solid #dce4ef;
  border-radius: 9px;
  background: #fff;
  color: #526783;
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  padding: 10px 6px;
  text-align: center;
}
.category-card i {
  color: #4778dd;
  font-size: 26px;
}
.category-card:hover,
.category-card.selected {
  border-color: #1f5eff;
  background: #f5f8ff;
  color: #1f5eff;
}
.troubleshoot-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 22px;
  border: 0;
  border-radius: 8px;
  background: #1f5eff;
  color: #fff;
  cursor: pointer;
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  padding: 13px;
}
.troubleshoot-button:hover {
  background: #174bd1;
}
.troubleshoot-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
.error {
  margin: 14px 0 0;
  color: #b42318;
  font-size: 13px;
}
.tickets-section {
  margin-top: 39px;
}
.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}
h2 {
  margin: 0;
  color: #172b4d;
  font-size: 18px;
}
.section-heading a {
  color: #1f5eff;
  font-size: 12px;
  text-decoration: none;
}
.section-heading a:hover {
  text-decoration: underline;
}
.table-wrapper {
  overflow-x: auto;
}
table {
  width: 100%;
  min-width: 630px;
  border-collapse: collapse;
  table-layout: fixed;
}
th {
  background: #f8fafc;
  border-bottom: 1px solid #edf1f5;
  color: #60708a;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.04em;
  padding: 12px 18px;
  text-align: left;
  text-transform: uppercase;
}
td {
  border-top: 1px solid #edf1f5;
  color: #526783;
  font-size: 12px;
  height: 63px;
  padding: 10px 18px;
  vertical-align: middle;
}
th:nth-child(1),
td:nth-child(1) {
  width: 17%;
}
th:nth-child(2),
td:nth-child(2) {
  width: 40%;
}
th:nth-child(3),
td:nth-child(3) {
  width: 17%;
}
th:nth-child(4),
td:nth-child(4) {
  width: 16%;
}
th:nth-child(5),
td:nth-child(5) {
  width: 10%;
}
.ticket-number {
  color: #526783;
  font-family: ui-monospace, monospace;
  font-size: 11px;
  line-height: 1.8;
  overflow-wrap: anywhere;
}
.issue-cell {
  max-width: 260px;
  overflow: hidden;
  color: #172b4d;
  font-weight: 500;
  line-height: 1.55;
  text-overflow: ellipsis;
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
.status.open {
  border-color: #b9d2ff;
  background: #f2f7ff;
  color: #145dff;
}
.status.in-progress {
  border-color: #ffd36f;
  background: #fffaf0;
  color: #b56a00;
}
.status.resolved,
.status.closed {
  border-color: #a7ebc6;
  background: #f1fff7;
  color: #078346;
}
.date {
  color: #71809a;
  white-space: nowrap;
}
.view-link {
  color: #1f5eff;
  font-size: 12px;
  line-height: 1.45;
  text-decoration: none;
}
.view-link:hover {
  text-decoration: underline;
}
.state {
  padding: 36px;
  border: 1px solid #e1e7ef;
  border-radius: 12px;
  background: #fff;
  color: #8291a8;
  font-size: 14px;
  text-align: center;
}
@media (max-width: 760px) {
  .help-card {
    padding: 20px;
  }
  .categories {
    grid-template-columns: repeat(3, 1fr);
  }
  .category-card {
    min-height: 92px;
  }
}
@media (max-width: 480px) {
  .categories {
    grid-template-columns: repeat(2, 1fr);
  }
  .category-card:last-child {
    grid-column: span 2;
  }
  .section-heading {
    align-items: flex-start;
    gap: 12px;
  }
  .page-heading {
    margin-bottom: 20px;
  }
}
</style>
