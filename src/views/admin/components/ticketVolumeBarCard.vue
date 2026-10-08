<script setup lang="ts">
defineProps<{
  rows: {
    category: string
    label: string
    count: number
    pct: number
  }[]
}>()
</script>

<template>
  <section class="card volume-card">
    <h2>Ticket Volume by Category</h2>

    <div v-if="rows.length === 0" class="muted">No Data</div>

    <div v-else class="volume-layout">
      <div class="bars">
        <div v-for="row in rows" :key="row.category" class="bar-row">
          <span class="bar-label">{{ row.label }}</span>
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
            <tr v-for="row in rows" :key="row.category">
              <td data-label="Category">{{ row.label }}</td>
              <td data-label="Tickets">{{ row.count }}</td>
              <td data-label="%">{{ Math.round(row.pct) }}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<style scoped>
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

.muted {
  color: #64748b;
  font-size: 14px;
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
  border-radius: 999px;
  height: 20px;
}

.bar-fill {
  height: 100%;
  min-width: 28px;
  background: #3b82f6;
  border-radius: 999px;
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

.table-wrap {
  overflow-x: auto;
}

.volume-table {
  width: 100%;
  /* min-width: 500px; */
  border-collapse: collapse;
  align-self: start;
}

.volume-table th {
  text-align: left;
  font-size: 12px;
  color: #94a3b8;
  padding-bottom: 8px;
  text-transform: uppercase;
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
</style>
