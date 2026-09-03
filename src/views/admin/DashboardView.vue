<template>
  <div>
    <h1 class="page-title">IT-HELP DESK ASSISTANT</h1>

    <p v-if="dashboard.loading" class="muted">Loading…</p>
    <p v-else-if="dashboard.error" class="error">{{ dashboard.error }}</p>

    <template v-else-if="dashboard.data">
      <section class="stats">
        <div class="stat-card">
          <span class="stat-label">Open Tickets</span>
          <span class="stat-value stat-blue">{{ dashboard.data.summary.open_tickets }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">In Progress</span>
          <span class="stat-value stat-orange">{{ dashboard.data.summary.in_progress_tickets }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Resolved</span>
          <span class="stat-value stat-green">{{ dashboard.data.summary.resolved_tickets }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Knowledge Articles</span>
          <span class="stat-value stat-dark">{{ dashboard.data.summary.knowledge_articles }}</span>
        </div>
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

      <section class="card volume-card">
        <h2>Ticket Volume by Category</h2>
        <div v-if="dashboard.volumeByCategory.length === 0" class="muted">No data</div>
        <div v-else class="volume-layout">
          <div class="bars">
            <div v-for="row in dashboard.volumeByCategory" :key="row.category" class="bar-row">
              <span class="bar-label">{{ categoryLabel(row.category) }}</span>
              <div class="bar-track">
                <div class="bar-fill" :style="{ width: row.pct + '%' }">
                  <span class="bar-count">{{ row.count }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="table-wrap">
            <table class="volume-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Tickets</th>
                  <th>%</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in dashboard.volumeByCategory" :key="row.category">
                  <td data-label="Category">{{ categoryLabel(row.category) }}</td>
                  <td data-label="Tickets">{{ row.count }}</td>
                  <td data-label="%">{{ Math.round(row.pct) }}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAdminDashboardStore } from '@/stores/adminDashboard'

const dashboard = useAdminDashboardStore()

onMounted(() => {
  dashboard.fetch()
})

const recentTickets = computed(() => dashboard.data?.recent_tickets.slice(0, 5) ?? [])
const recentArticles = computed(() => dashboard.data?.recent_articles.slice(0, 5) ?? [])

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

<style scoped>
.page-title {
  font-size: 22px;
  color: #1f2937;
  margin: 0 0 20px;
  background-color: #f3f4f4;
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
  margin-bottom: 20px;
}

.stat-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
}

.stat-blue {
  color: #2563eb;
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

.stat-label {
  font-size: 13px;
  color: #64748b;
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

.volume-card {
  margin-top: 20px;
}

.volume-layout {
  display: grid;
  grid-template-columns: 1fr 260px;
  gap: 24px;
}

.volume-layout .bars {
  min-width: 0;
}

.volume-table {
  width: 100%;
  border-collapse: collapse;
  align-self: start;
}

.volume-table th {
  text-align: left;
  font-size: 12px;
  color: #94a3b8;
  padding-bottom: 8px;
}

.volume-table td {
  font-size: 13px;
  color: #1f2937;
  padding: 6px 0;
  border-top: 1px solid #f1f5f9;
}

.volume-table td:not(:first-child) {
  text-align: right;
}

@media (max-width: 700px) {
  .volume-layout {
    grid-template-columns: 1fr;
  }
}

.card h2 {
  font-size: 15px;
  color: #1f2937;
  margin: 0 0 16px;
}

.bar-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
  min-width: 0;
}

.bar-label {
  width: 90px;
  font-size: 13px;
  color: #1f2937;
  flex-shrink: 0;
}

.bar-track {
  flex: 1;
  min-width: 0;
  background: #f1f5f9;
  border-radius: 6px;
  height: 22px;
}

.bar-fill {
  height: 100%;
  min-width: 28px;
  background: #3b82f6;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 8px;
  box-sizing: border-box;
}

.bar-count {
  font-size: 12px;
  font-weight: 600;
  color: #fff;
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
