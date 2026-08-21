<template>
  <div>
    <h1 class="page-title">IT-HELP DESK ASSISTANT</h1>

    <p v-if="ticketStore.loading" class="muted">Loading…</p>
    <p v-else-if="ticketStore.error" class="error">{{ ticketStore.error }}</p>

    <template v-else>
      <section class="stats">
        <div class="stat-card">
          <span class="stat-value">{{ ticketStore.stats.total }}</span>
          <span class="stat-label">Total Tickets</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ ticketStore.stats.open }}</span>
          <span class="stat-label">Open</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ ticketStore.stats.inProgress }}</span>
          <span class="stat-label">In Progress</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ ticketStore.stats.resolved }}</span>
          <span class="stat-label">Resolved</span>
        </div>
      </section>

      <div class="grid">
        <section class="card">
          <h2>Ticket Volume by Category</h2>
          <div v-if="ticketStore.volumeByCategory.length === 0" class="muted">No data</div>
          <div v-for="row in ticketStore.volumeByCategory" :key="row.category" class="bar-row">
            <span class="bar-label">{{ row.category }}</span>
            <div class="bar-track">
              <div class="bar-fill" :style="{ width: row.pct + '%' }"></div>
            </div>
            <span class="bar-count">{{ row.count }}</span>
          </div>
        </section>

        <section class="card knowledge-preview">
          <div class="card-heading">
            <h2>Knowledge Base</h2>
            <RouterLink to="/admin/knowledge">Manage →</RouterLink>
          </div>

          <p v-if="knowledgeStore.loading" class="muted">Loading...</p>

          <p v-else-if="knowledgeStore.articles.length === 0" class="muted">No articles yet.</p>

          <ul v-else class="kb-list">
            <li v-for="article in knowledgeStore.articles.slice(0, 5)" :key="article.id">
              <span v-if="article.published" class="pub-tag">PUB</span>

              <div>
                <strong>{{ article.title }}</strong>
                <small> {{ article.category }} · {{ article.authorName || 'Admin' }} </small>
              </div>
            </li>
          </ul>
        </section>
      </div>

      <section class="card">
        <h2>Recent Tickets</h2>
        <table>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Requester</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="t in ticketStore.recent" :key="t.id">
              <td>{{ t.title }}</td>
              <td>{{ t.requesterName }}</td>
              <td>{{ t.category }}</td>
              <td>
                <span class="badge" :class="t.priority">{{ t.priority }}</span>
              </td>
              <td>
                <span class="badge" :class="t.status">{{ t.status }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useTicketStore } from '@/stores/ticket'
import { useKnowledgeStore } from '@/stores/knowledgeBase'

const ticketStore = useTicketStore()
const knowledgeStore = useKnowledgeStore()

onMounted(() => {
  ticketStore.fetchTickets()
  knowledgeStore.fetchArticles()
})
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
  color: #ea580c;
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

.card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
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
}

.bar-label {
  width: 90px;
  font-size: 13px;
  color: #1f2937;
  flex-shrink: 0;
}

.bar-track {
  flex: 1;
  background: #f1f5f9;
  border-radius: 6px;
  height: 12px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: #f97316;
  border-radius: 6px;
}

.bar-count {
  font-size: 13px;
  color: #64748b;
  width: 24px;
  text-align: right;
}

.kb-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.kb-list li {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid #f1f5f9;
}

.kb-list li:last-child {
  border-bottom: none;
}

.kb-title {
  font-size: 14px;
  color: #1f2937;
}

.kb-meta {
  font-size: 12px;
  color: #64748b;
  flex-shrink: 0;
}

table {
  width: 100%;
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

.knowledge-preview {
  min-width: 0;
}

.card-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
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

.kb-list li:last-child {
  border-bottom: 0;
}

.kb-list strong,
.kb-list small {
  display: block;
}

.kb-list strong {
  overflow: hidden;
  color: #1f2937;
  font-size: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
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
}
</style>
