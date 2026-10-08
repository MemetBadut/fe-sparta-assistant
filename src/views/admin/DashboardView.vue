<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAdminDashboardStore } from '@/stores/adminDashboard'
import DashboardStatCard from './components/dashboardStatCard.vue'
import TicketVolumeCard from './components/ticketVolumeBarCard.vue'

const dashboard = useAdminDashboardStore()

onMounted(() => {
  dashboard.fetch()
})

const recentTickets = computed(() => dashboard.data?.recent_tickets.slice(0, 5) ?? [])
const recentArticles = computed(() => dashboard.data?.recent_articles.slice(0, 5) ?? [])
const volumeRows = computed(() =>
  dashboard.volumeByCategory.map((row) => ({
    ...row,
    label: categoryLabel(row.category),
  })),
)

const CATEGORY_LABELS: Record<string, string> = {
  wifi_network: 'Wi-Fi / Network',
  windows: 'Windows',
  laptop_pc: 'Laptop / PC',
  printer: 'Printer',
  basic_software_issues: 'Basic Software Issues',
}
const categoryLabel = (code: string) => CATEGORY_LABELS[code] ?? code

const statusClass = (status: string) => status.toLowerCase().replace(/ /g, '_')
</script>

<template>
  <div>
    <h1 class="page-title">IT-HELP DESK ASSISTANT</h1>

    <p v-if="dashboard.loading" class="muted">Loading…</p>
    <p v-else-if="dashboard.error" class="error">{{ dashboard.error }}</p>

    <template v-else-if="dashboard.data">
      <section class="stats">
        <DashboardStatCard
          label="Open Tickets"
          :value="dashboard.data.summary.open_tickets"
          color="blue"
        />

        <DashboardStatCard
          label="In Progress"
          :value="dashboard.data.summary.in_progress_tickets"
          color="orange"
        />

        <DashboardStatCard
          label="Resolved"
          :value="dashboard.data.summary.resolved_tickets"
          color="green"
        />

        <DashboardStatCard
          label="Knowledge Articles"
          :value="dashboard.data.summary.knowledge_articles"
          color="dark"
        />
      </section>

      <div class="grid">
        <section class="card recent-tickets">
          <div class="card-heading">
            <h2>Recent Tickets</h2>
            <RouterLink to="/admin/tickets">View all →</RouterLink>
          </div>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Ticket</th>
                  <th>Issue</th>
                  <th>Priority</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="t in recentTickets" :key="t.ticket_number">
                  <td data-label="Ticket">{{ t.ticket_number }}</td>
                  <td data-label="Issue">
                    <div>{{ t.issue_title }}</div>
                    <small>{{ t.name }}</small>
                  </td>
                  <td data-label="Priority">
                    <span class="badge" :class="statusClass(t.priority)">{{ t.priority }}</span>
                  </td>
                  <td data-label="Status">
                    <span class="badge" :class="statusClass(t.status)">{{ t.status }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section class="card knowledge-preview">
          <div class="card-heading">
            <h2>Knowledge Base</h2>
            <RouterLink to="/admin/knowledge">Manage →</RouterLink>
          </div>

          <p v-if="recentArticles.length === 0" class="muted">No articles yet.</p>

          <ul v-else class="kb-list">
            <li v-for="article in recentArticles" :key="article.id">
              <span class="pub-tag" :class="{ draft: article.status === 'Draft' }">{{
                article.status === 'Published' ? 'PUB' : 'DRAFT'
              }}</span>
              <div>
                <strong>{{ article.title }}</strong>
                <small>{{ categoryLabel(article.category) }}</small>
              </div>
            </li>
          </ul>
        </section>
      </div>
    </template>

    <TicketVolumeCard v-if="dashboard.data" :rows="volumeRows" />
  </div>
</template>

<style scoped>
.page-title {
  font-size: 22px;
  color: #1f2937;
  margin: 0 0 20px;
  background: #f3f4f4;
  border-radius:12px;
  padding: 20px;
  box-sizing: border-box;
}

.muted {
  color: #64748b;
  font-size: 14px;
}

.error {
  color: #dc2626;
  font-size: 14px;
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
}

.grid > .card {
  min-width: 0;
}

.card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-sizing: border-box;
}

.card h2 {
  font-size: 15px;
  color: #1f2937;
  margin: 0 0 16px;
}

.knowledge-preview {
  min-width: 0;
}

.card-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.card-heading a {
  flex-shrink: 0;
}

.card-heading h2 {
  margin: 0;
}

.card-heading a {
  color: #2563eb;
  font-size: 13px;
  text-decoration: none;
}

.kb-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.kb-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #f1f5f9;
}

.kb-list li > div {
  min-width: 0;
}

.kb-list li:last-child {
  border-bottom: 0;
}

.kb-list strong,
.kb-list small {
  display: block;
}

.kb-list strong {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  color: #1f2937;
  font-size: 13px;
  line-height: 1.4;
}

.kb-list small {
  margin-top: 3px;
  color: #94a3b8;
  font-size: 12px;
}

.pub-tag {
  border-radius: 4px;
  background: #dcfce7;
  color: #15803d;
  font-size: 10px;
  font-weight: 700;
  padding: 3px 6px;
  flex-shrink: 0;
}

.pub-tag.draft {
  background: #f1f5f9;
  color: #64748b;
}

.table-wrap {
  overflow-x: auto;
}

table {
  width: 100%;
  min-width: 500px;
  border-collapse: collapse;
}

th {
  text-align: left;
  font-size: 12px;
  color: #64748b;
  text-transform: uppercase;
  padding: 8px;
  border-bottom: 1px solid #e2e8f0;
}

td {
  font-size: 14px;
  color: #1f2937;
  padding: 12px 8px;
  border-bottom: 1px solid #f1f5f9;
}

.badge {
  display: inline-block;
  font-size: 12px;
  padding: 2px 10px;
  border-radius: 999px;
  background: #f1f5f9;
  color: #475569;
}

.badge.high,
.badge.open {
  background: #fee2e2;
  color: #b91c1c;
}

.badge.medium,
.badge.in_progress {
  background: #fef3c7;
  color: #b45309;
}

.badge.low,
.badge.resolved {
  background: #dcfce7;
  color: #15803d;
}

@media (max-width: 600px) {
  .table-wrap table,
  .table-wrap thead,
  .table-wrap tbody,
  .table-wrap tr,
  .table-wrap td {
    display: block;
    width: auto;
    min-width: 0;
  }

  .table-wrap thead {
    display: none;
  }

  .table-wrap tr {
    padding: 10px 0;
    border-bottom: 1px solid #f1f5f9;
  }

  .table-wrap td {
    padding: 4px 0;
    border: none;
  }

  .table-wrap td::before {
    content: attr(data-label);
    display: block;
    font-size: 11px;
    color: #94a3b8;
    text-transform: uppercase;
  }
}

@media (max-width: 900px) {
  .stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 500px) {
  .stats {
    grid-template-columns: 1fr;
  }
}
</style>
