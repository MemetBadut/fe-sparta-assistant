<template>
  <section class="result-page">
    <article v-if="result" class="solution-card">
      <header class="solution-header">
        <div>
          <span class="eyebrow">{{ result.article ? 'Article' : 'General guidance' }}</span>
          <h1>Recommended Solution</h1>
          <p>
            {{ result.article
              ? "We found a relevant solution from the company's IT troubleshooting knowledge base."
              : 'Try this general guidance. If the issue continues, contact the IT team.' }}
          </p>
        </div>
        <strong class="article-title">{{ result.article?.title || result.category }}</strong>
      </header>

      <ol v-if="result.article" class="steps">
        <li v-for="(step, index) in result.article.steps" :key="`${index}-${step}`">
          <span class="step-number">{{ index + 1 }}</span>
          <span>{{ step }}</span>
        </li>
      </ol>
      <p v-else class="guidance">{{ result.general_guidance || 'No verified guidance is available.' }}</p>
    </article>

    <div v-if="result && !feedbackState" class="feedback-card">
      <h2>Was this solution helpful?</h2>
      <div class="feedback-actions">
        <button class="yes-button" type="button" :disabled="feedbackLoading" @click="markHelpful">
          <i class="ri-check-line"></i> Yes, issue resolved
        </button>
        <button class="no-button" type="button" :disabled="feedbackLoading" @click="markUnhelpful">
          <i class="ri-close-line"></i> No, issue still exists
        </button>
      </div>
      <p v-if="feedbackError" class="error" role="alert">{{ feedbackError }}</p>
    </div>

    <div v-else-if="feedbackState === 'helpful'" class="feedback-card result-message success">
      <h2><i class="ri-check-line"></i> Great! We're glad the issue is resolved.</h2>
      <RouterLink class="back-link" :to="{ name: 'user-dashboard' }">← Back to dashboard</RouterLink>
    </div>

    <div v-else-if="feedbackState === 'unhelpful'" class="feedback-card result-message failure">
      <h2>No problem. Submit an IT ticket and a technician will look into it.</h2>
      <p>Your issue details and attempted steps will be carried forward automatically.</p>
      <button class="ticket-button" type="button" @click="createTicket">
        <i class="ri-file-list-3-line"></i> Create IT Ticket
      </button>
    </div>

    <div v-if="loading" class="state">Loading solution...</div>
    <div v-else-if="error" class="state error" role="alert">{{ error }}</div>
    <div v-else-if="!result" class="state">No troubleshooting result to show.</div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { troubleshootingService, type TroubleshootingResult } from '@/services/troubleshootingService'
import { useTroubleshootingStore } from '@/stores/troubleshooting'

type FeedbackState = 'helpful' | 'unhelpful' | null

const route = useRoute()
const router = useRouter()
const store = useTroubleshootingStore()
const routeId = Number(route.params.id)
const result = ref<TroubleshootingResult | null>(store.lastResult?.id === routeId ? store.lastResult : null)
const loading = ref(!result.value)
const error = ref('')
const feedbackError = ref('')
const feedbackLoading = ref(false)
const feedbackState = ref<FeedbackState>(null)

async function saveFeedback(helpful: boolean) {
  if (!result.value) return
  feedbackLoading.value = true
  feedbackError.value = ''
  try {
    await troubleshootingService.feedback(result.value.id, helpful)
    feedbackState.value = helpful ? 'helpful' : 'unhelpful'
  } catch {
    feedbackError.value = 'Your feedback could not be saved. Please try again.'
  } finally {
    feedbackLoading.value = false
  }
}

function markHelpful() {
  return saveFeedback(true)
}

function markUnhelpful() {
  return saveFeedback(false)
}

function createTicket() {
  if (!result.value) return
  router.push({ name: 'user-ticket-create' })
}

onMounted(async () => {
  if (result.value) return
  if (!Number.isInteger(routeId)) {
    error.value = 'This troubleshooting result is invalid.'
    loading.value = false
    return
  }
  try {
    result.value = await troubleshootingService.get(routeId)
    store.setResult(result.value)
  } catch {
    error.value = 'This troubleshooting result could not be loaded.'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.result-page { max-width: 760px; margin: 0 auto; }
.solution-card, .feedback-card { border: 1px solid #dce4ed; border-radius: 11px; background: #fff; box-shadow: 0 1px 3px rgb(23 43 77 / 8%); }
.solution-card { overflow: hidden; }
.solution-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 24px; padding: 16px 24px 14px; }
.eyebrow { display: block; color: #71809a; font-size: 11px; text-align: right; }
h1 { margin: 0 0 5px; color: #172b4d; font-size: 15px; }
.solution-header p { max-width: 290px; margin: 0; color: #60708a; font-size: 12px; line-height: 1.35; }
.article-title { max-width: 250px; margin-top: 14px; color: #172b4d; font-size: 12px; font-weight: 500; line-height: 1.35; text-align: right; }
.steps { display: grid; gap: 13px; margin: 0; padding: 18px 24px 18px; border-top: 1px solid #edf1f5; list-style: none; }
.steps li { display: flex; align-items: flex-start; gap: 12px; color: #526783; font-size: 13px; line-height: 1.55; }
.step-number { display: grid; flex: 0 0 auto; place-items: center; width: 21px; height: 21px; border-radius: 50%; background: #1f5eff; color: #fff; font-size: 11px; font-weight: 700; }
.guidance { margin: 0; border-top: 1px solid #edf1f5; color: #526783; font-size: 13px; line-height: 1.6; padding: 18px 24px; }
.feedback-card { margin-top: 16px; padding: 19px 24px; }
.feedback-card h2 { margin: 0 0 12px; color: #172b4d; font-size: 13px; font-weight: 600; }
.feedback-actions { display: flex; flex-wrap: wrap; gap: 10px; }
.feedback-actions button, .ticket-button { min-height: 34px; border-radius: 7px; cursor: pointer; font: inherit; font-size: 12px; font-weight: 600; padding: 0 13px; }
.yes-button { border: 1px solid #00a846; background: #00a846; color: #fff; }
.no-button { border: 1px solid #d5deea; background: #fff; color: #344054; }
.feedback-actions button:disabled { cursor: wait; opacity: .6; }
.result-message h2 i { margin-right: 6px; }
.result-message.success { color: #078346; }
.result-message.success h2 { color: #078346; }
.result-message.failure h2 { color: #172b4d; }
.result-message p { margin: -3px 0 14px; color: #526783; font-size: 12px; line-height: 1.5; }
.back-link { display: inline-block; color: #1f5eff; font-size: 12px; text-decoration: none; }
.ticket-button { border: 0; background: #1f5eff; color: #fff; }
.ticket-button:hover { background: #174bd1; }
.error { margin: 12px 0 0; color: #b42318; font-size: 12px; }
.state { margin-top: 16px; color: #71809a; font-size: 13px; }
@media (max-width: 520px) { .solution-header { flex-direction: column; gap: 8px; padding: 16px 18px 14px; } .article-title { margin-top: 0; text-align: left; } .steps { padding-inline: 18px; } .feedback-card { padding-inline: 18px; } }
</style>
