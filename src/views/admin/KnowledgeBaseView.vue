<template>
  <div class="knowledge-page">
    <header class="page-header">
      <h1>Knowledge Base</h1>

      <button class="add-button" type="button" @click="openCreate">
        <span class="add-icon">+</span>
        Add Article
      </button>
    </header>

    <div v-if="store.error" class="alert" role="alert">
      {{ store.error }}
    </div>

    <section class="filter-card">
      <label class="search-box">
        <span class="search-icon" aria-hidden="true">⌕</span>

        <input
          v-model="search"
          type="search"
          placeholder="Search articles..."
          aria-label="Search articles"
        />
      </label>

      <select v-model="categoryFilter" aria-label="Filter by category">
        <option value="all">All categories</option>

        <option v-for="category in store.categories" :key="category" :value="category">
          {{ category }}
        </option>
      </select>

      <select v-model="statusFilter" aria-label="Filter by status">
        <option value="all">All statuses</option>
        <option value="published">Published</option>
        <option value="draft">Draft</option>
      </select>
    </section>

    <section class="table-card">
      <div v-if="store.loading" class="state-message">Loading articles...</div>

      <div v-else-if="filteredArticles.length === 0" class="state-message">No articles found.</div>

      <div v-else class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Article<br />Title</th>
              <th>Category</th>
              <th>Symptoms</th>
              <th>Status</th>
              <th>Updated</th>
              <th>Updated<br />By</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="article in filteredArticles" :key="article.id">
              <td class="article-cell">
                <strong>{{ article.title }}</strong>
                <span>{{ article.id }}</span>
              </td>

              <td>
                <span class="category-badge">
                  {{ article.category }}
                </span>
              </td>

              <td class="symptoms-cell">
                {{ getSymptoms(article.content) }}
              </td>

              <td>
                <span class="status-badge" :class="article.published ? 'published' : 'draft'">
                  {{ article.published ? 'Published' : 'Draft' }}
                </span>
              </td>

              <td class="date-cell">
                {{ formatDate(article.updatedAt) }}
              </td>

              <td class="author-cell">
                {{ article.authorName || 'Admin' }}
              </td>

              <td>
                <div class="actions">
                  <button class="edit-button" type="button" @click="openEdit(article)">Edit</button>

                  <span class="action-divider"></span>

                  <button class="delete-button" type="button" @click="deleteArticle(article)">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <dialog ref="dialogRef" class="article-dialog">
      <form class="dialog-card" @submit.prevent="saveArticle">
        <header class="dialog-header">
          <div>
            <span class="dialog-label">
              {{ editingId ? 'EDIT ARTICLE' : 'NEW ARTICLE' }}
            </span>

            <h2>
              {{ editingId ? 'Edit Article' : 'Add Article' }}
            </h2>
          </div>

          <button class="close-button" type="button" aria-label="Close dialog" @click="closeDialog">
            ×
          </button>
        </header>

        <div class="form-fields">
          <label>
            Article title

            <input
              v-model="form.title"
              type="text"
              maxlength="160"
              placeholder="Laptop connected to Wi-Fi but no internet"
              required
            />
          </label>

          <label>
            Category

            <input
              v-model="form.category"
              type="text"
              maxlength="80"
              placeholder="Wi-Fi / Network"
              required
            />
          </label>

          <label>
            Symptoms / content

            <textarea
              v-model="form.content"
              rows="8"
              placeholder="Describe the symptoms and troubleshooting steps..."
              required
            ></textarea>
          </label>

          <label class="checkbox-field">
            <input v-model="form.published" type="checkbox" />
            <span>Publish this article</span>
          </label>
        </div>

        <p v-if="store.error" class="form-error">
          {{ store.error }}
        </p>

        <footer class="dialog-actions">
          <button class="cancel-button" type="button" @click="closeDialog">Cancel</button>

          <button class="save-button" type="submit" :disabled="store.saving">
            {{ store.saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Article' }}
          </button>
        </footer>
      </form>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useKnowledgeStore } from '@/stores/knowledgeBase'
import type { KnowledgeArticle } from '@/services/knowledgeService'

type StatusFilter = 'all' | 'published' | 'draft'

const store = useKnowledgeStore()
const dialogRef = ref<HTMLDialogElement | null>(null)
const editingId = ref<string | null>(null)

const search = ref('')
const categoryFilter = ref('all')
const statusFilter = ref<StatusFilter>('all')

const emptyForm = {
  title: '',
  category: '',
  content: '',
  published: true,
}

const form = reactive({ ...emptyForm })

const filteredArticles = computed(() => {
  const keyword = search.value.trim().toLowerCase()

  return store.articles.filter((article) => {
    const matchesSearch =
      !keyword ||
      article.title.toLowerCase().includes(keyword) ||
      article.category.toLowerCase().includes(keyword) ||
      article.content.toLowerCase().includes(keyword)

    const matchesCategory =
      categoryFilter.value === 'all' || article.category === categoryFilter.value

    const matchesStatus =
      statusFilter.value === 'all' ||
      (statusFilter.value === 'published' && article.published) ||
      (statusFilter.value === 'draft' && !article.published)

    return matchesSearch && matchesCategory && matchesStatus
  })
})

function openCreate() {
  editingId.value = null
  Object.assign(form, emptyForm)
  store.error = ''
  dialogRef.value?.showModal()
}

function openEdit(article: KnowledgeArticle) {
  editingId.value = article.id

  Object.assign(form, {
    title: article.title,
    category: article.category,
    content: article.content,
    published: article.published,
  })

  store.error = ''
  dialogRef.value?.showModal()
}

function closeDialog() {
  dialogRef.value?.close()
  editingId.value = null
  Object.assign(form, emptyForm)
}

async function saveArticle() {
  if (!form.title.trim() || !form.category.trim() || !form.content.trim()) {
    return
  }

  const payload = {
    title: form.title.trim(),
    category: form.category.trim(),
    content: form.content.trim(),
    published: form.published,
  }

  const result = editingId.value
    ? await store.updateArticle(editingId.value, payload)
    : await store.createArticle(payload)

  if (result) {
    closeDialog()
  }
}

async function deleteArticle(article: KnowledgeArticle) {
  const confirmed = window.confirm(`Delete "${article.title}"? This action cannot be undone.`)

  if (!confirmed) return

  await store.deleteArticle(article.id)
}

function getSymptoms(content: string) {
  const normalized = content.replace(/\s+/g, ' ').trim()

  if (normalized.length <= 34) {
    return normalized
  }

  return `${normalized.slice(0, 34)}...`
}

function formatDate(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '—'
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

onMounted(() => {
  store.fetchArticles()
})
</script>

<style scoped>
.knowledge-page {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 26px;
}

.page-header h1 {
  margin: 0;
  color: #101828;
  font-size: 22px;
  font-weight: 700;
}

.add-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 0;
  border-radius: 9px;
  background: #1f5eff;
  color: #fff;
  cursor: pointer;
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  padding: 11px 17px;
  transition: background 0.2s ease;
}

.add-button:hover {
  background: #174bd1;
}

.add-icon {
  font-size: 23px;
  font-weight: 300;
  line-height: 15px;
}

.alert {
  margin-bottom: 16px;
  border-radius: 8px;
  background: #fef2f2;
  color: #b42318;
  font-size: 13px;
  padding: 12px 14px;
}

.filter-card,
.table-card {
  border: 1px solid #dce3eb;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 2px 4px rgb(15 23 42 / 7%);
}

.filter-card {
  display: flex;
  align-items: center;
  gap: 13px;
  margin-bottom: 22px;
  padding: 16px 18px;
}

.search-box {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 180px;
  gap: 8px;
  border: 1px solid #bfd0e8;
  border-radius: 8px;
  color: #8ca0bc;
  padding: 0 12px;
}

.search-icon {
  font-size: 25px;
  line-height: 1;
  transform: rotate(-20deg);
}

.search-box input {
  width: 100%;
  border: 0;
  outline: 0;
  color: #172b4d;
  font: inherit;
  font-size: 14px;
  padding: 10px 0;
}

.search-box input::placeholder {
  color: #8294ad;
}

.filter-card select {
  min-width: 212px;
  border: 1px solid #bfd0e8;
  border-radius: 8px;
  background: #fff;
  color: #172b4d;
  cursor: pointer;
  font: inherit;
  font-size: 14px;
  outline: 0;
  padding: 10px 12px;
}

.search-box:focus-within,
.filter-card select:focus {
  border-color: #1f5eff;
  box-shadow: 0 0 0 3px #dbe7ff;
}

.table-card {
  overflow: hidden;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  min-width: 920px;
  border-collapse: collapse;
  table-layout: fixed;
}

th {
  background: #fbfcfe;
  border-bottom: 1px solid #e5eaf0;
  color: #60708a;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
  line-height: 1.35;
  padding: 13px 18px;
  text-align: left;
  text-transform: uppercase;
  vertical-align: middle;
}

td {
  border-bottom: 1px solid #edf1f5;
  color: #172b4d;
  font-size: 13px;
  padding: 14px 18px;
  vertical-align: middle;
}

tbody tr:last-child td {
  border-bottom: 0;
}

tbody tr:hover {
  background: #fbfdff;
}

th:nth-child(1),
td:nth-child(1) {
  width: 15%;
}

th:nth-child(2),
td:nth-child(2) {
  width: 20%;
}

th:nth-child(3),
td:nth-child(3) {
  width: 15%;
}

th:nth-child(4),
td:nth-child(4) {
  width: 13%;
}

th:nth-child(5),
td:nth-child(5) {
  width: 13%;
}

th:nth-child(6),
td:nth-child(6) {
  width: 11%;
}

th:nth-child(7),
td:nth-child(7) {
  width: 13%;
}

.article-cell strong,
.article-cell span {
  display: block;
}

.article-cell strong {
  display: -webkit-box;
  max-width: 150px;
  overflow: hidden;
  color: #172b4d;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.3;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.article-cell span {
  margin-top: 5px;
  color: #98a6b9;
  font-family: ui-monospace, monospace;
  font-size: 11px;
}

.category-badge {
  display: inline-block;
  border-radius: 5px;
  background: #f0f3f7;
  color: #526783;
  font-size: 12px;
  line-height: 1.3;
  padding: 4px 8px;
}

.symptoms-cell {
  max-width: 145px;
  overflow: hidden;
  color: #5f789b;
  line-height: 1.45;
  text-overflow: ellipsis;
}

.status-badge {
  display: inline-block;
  border: 1px solid;
  border-radius: 6px;
  font-size: 12px;
  line-height: 1.3;
  padding: 4px 9px;
  white-space: nowrap;
}

.status-badge.published {
  border-color: #9cefc1;
  background: #f0fff6;
  color: #079447;
}

.status-badge.draft {
  border-color: #d6e0eb;
  background: #f3f6fa;
  color: #526783;
}

.date-cell,
.author-cell {
  color: #60708a;
  white-space: nowrap;
}

.author-cell {
  white-space: normal;
}

.actions {
  display: flex;
  align-items: center;
  gap: 9px;
  white-space: nowrap;
}

.edit-button,
.delete-button {
  border: 0;
  background: transparent;
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  padding: 0;
}

.edit-button {
  color: #145dff;
}

.delete-button {
  color: #f04438;
}

.edit-button:hover,
.delete-button:hover {
  text-decoration: underline;
}

.action-divider {
  width: 1px;
  height: 18px;
  background: #d4dce7;
}

.state-message {
  color: #60708a;
  font-size: 14px;
  padding: 55px 20px;
  text-align: center;
}

.article-dialog {
  width: min(560px, calc(100% - 32px));
  border: 0;
  border-radius: 14px;
  padding: 0;
  box-shadow: 0 24px 80px rgb(15 23 42 / 22%);
}

.article-dialog::backdrop {
  background: rgb(15 23 42 / 45%);
}

.dialog-card {
  padding: 24px;
}

.dialog-header,
.dialog-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.dialog-header {
  margin-bottom: 24px;
}

.dialog-label {
  display: block;
  margin-bottom: 6px;
  color: #1f5eff;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.dialog-header h2 {
  margin: 0;
  color: #101828;
  font-size: 20px;
}

.close-button {
  border: 0;
  background: transparent;
  color: #60708a;
  cursor: pointer;
  font-size: 27px;
  line-height: 1;
}

.close-button:hover {
  color: #101828;
}

.form-fields {
  display: grid;
  gap: 16px;
}

.form-fields label {
  display: grid;
  gap: 7px;
  color: #344054;
  font-size: 13px;
  font-weight: 600;
}

.form-fields input,
.form-fields textarea {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #bfd0e8;
  border-radius: 8px;
  color: #172b4d;
  font: inherit;
  font-size: 13px;
  outline: 0;
  padding: 10px 12px;
}

.form-fields textarea {
  resize: vertical;
}

.form-fields input:focus,
.form-fields textarea:focus {
  border-color: #1f5eff;
  box-shadow: 0 0 0 3px #dbe7ff;
}

.checkbox-field {
  display: flex !important;
  align-items: center;
  gap: 8px !important;
  font-weight: 400 !important;
}

.checkbox-field input {
  width: auto;
}

.form-error {
  margin: 16px 0 0;
  border-radius: 8px;
  background: #fef2f2;
  color: #b42318;
  font-size: 13px;
  padding: 10px 12px;
}

.dialog-actions {
  justify-content: flex-end;
  margin-top: 24px;
}

.cancel-button,
.save-button {
  border-radius: 8px;
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  padding: 10px 16px;
}

.cancel-button {
  border: 1px solid #d0d9e5;
  background: #fff;
  color: #526783;
}

.save-button {
  border: 0;
  background: #1f5eff;
  color: #fff;
  font-weight: 600;
}

.save-button:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

@media (max-width: 760px) {
  .page-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .filter-card {
    align-items: stretch;
    flex-direction: column;
  }

  .search-box,
  .filter-card select {
    width: 100%;
    box-sizing: border-box;
  }
}
</style>
