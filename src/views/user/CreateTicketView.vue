<template>
  <section class="create-ticket-page">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <RouterLink :to="{ name: 'user-dashboard' }">Dashboard</RouterLink>
      <span>/</span>
      <span>Create IT Ticket</span>
    </nav>

    <header class="page-header">
      <div>
        <p class="eyebrow">IT SUPPORT</p>
        <h1>Create IT Ticket</h1>
        <p>Tell us what happened. Your troubleshooting details are already included.</p>
      </div>
    </header>

    <form class="ticket-form" @submit.prevent="submitTicket">
      <section class="form-card">
        <h2>Contact Information</h2>
        <div class="form-grid two-columns">
          <label>
            Full name
            <input v-model.trim="form.name" type="text" autocomplete="name" required />
          </label>
          <label>
            Division
            <input v-model.trim="form.division" type="text" required />
          </label>
        </div>
      </section>

      <section class="form-card">
        <h2>Issue Details</h2>
        <div class="form-grid">
          <label>
            Issue title
            <input v-model.trim="form.issue_title" type="text" maxlength="255" required />
          </label>
          <label>
            Description
            <textarea v-model.trim="form.description" rows="5" maxlength="10000" required></textarea>
          </label>
          <div class="form-grid two-columns">
            <label>
              Category
              <select v-model="form.category" required>
                <option v-for="category in categories" :key="category.value" :value="category.value">
                  {{ category.label }}
                </option>
              </select>
            </label>
            <label>
              Priority
              <select v-model="form.priority" required>
                <option v-for="priority in priorities" :key="priority" :value="priority">{{ priority }}</option>
              </select>
            </label>
          </div>
          <label v-if="requiresDeviceCode">
            Device code
            <input v-model.trim="form.device_code" type="text" maxlength="255" required />
            <small>Required for laptop, PC, and printer issues.</small>
          </label>
        </div>
      </section>

      <section class="form-card">
        <h2>Troubleshooting Already Attempted</h2>
        <div class="attempted-steps">
          <p v-if="attemptedSteps.length === 0">No verified troubleshooting steps were recorded.</p>
          <ol v-else>
            <li v-for="step in attemptedSteps" :key="step">{{ step }}</li>
          </ol>
        </div>
      </section>

      <section class="form-card">
        <h2>Screenshot / Attachment <span>(optional)</span></h2>
        <label class="file-picker">
          <i class="ri-upload-cloud-2-line"></i>
          <span>{{ attachment?.name || 'Choose a file to attach' }}</span>
          <input type="file" accept="image/*,.pdf,.txt,.log" @change="selectAttachment" />
        </label>
        <small>Attach a screenshot or log file to help the technician.</small>
      </section>

      <p v-if="error" class="form-error" role="alert">{{ error }}</p>

      <footer class="form-actions">
        <RouterLink class="cancel-button" :to="{ name: 'user-dashboard' }">Cancel</RouterLink>
        <button class="submit-button" type="submit" :disabled="submitting">
          {{ submitting ? 'Submitting...' : 'Submit Ticket' }}
          <i class="ri-arrow-right-line"></i>
        </button>
      </footer>
    </form>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ticketService, type TicketPriority } from '@/services/ticketService'
import { useTroubleshootingStore } from '@/stores/troubleshooting'

const router = useRouter()
const authStore = useAuthStore()
const troubleshootingStore = useTroubleshootingStore()
const result = troubleshootingStore.lastResult

const categories = [
  { value: 'wifi_network', label: 'Wi-Fi / Network' },
  { value: 'windows', label: 'Windows' },
  { value: 'laptop_pc', label: 'Laptop / PC' },
  { value: 'printer', label: 'Printer' },
  { value: 'basic_software_issues', label: 'Basic Software Issues' },
]
const priorities: TicketPriority[] = ['Low', 'Medium', 'High', 'Urgent']
const attachment = ref<File | null>(null)
const submitting = ref(false)
const error = ref('')

const form = reactive({
  name: authStore.user?.name || '',
  division: authStore.user?.division || '',
  issue_title: result?.article?.title || 'IT support request',
  description: result?.issue_summary || '',
  category: result?.category || 'wifi_network',
  priority: 'Medium' as TicketPriority,
  device_code: '',
})

const attemptedSteps = computed(() => {
  if (result?.article?.steps?.length) return result.article.steps
  if (result?.general_guidance) return [result.general_guidance]
  return []
})
const requiresDeviceCode = computed(() => ['laptop_pc', 'printer'].includes(form.category))

function selectAttachment(event: Event) {
  attachment.value = (event.target as HTMLInputElement).files?.[0] || null
}

async function submitTicket() {
  error.value = ''
  if (!result) {
    error.value = 'Troubleshooting details expired. Start a new troubleshooting request.'
    return
  }
  submitting.value = true
  try {
    const ticket = await ticketService.create({
      name: form.name,
      division: form.division,
      issue_title: form.issue_title,
      description: form.description,
      category: form.category,
      priority: form.priority,
      ...(form.device_code ? { device_code: form.device_code } : {}),
      troubleshooting_result_id: result.id,
    })
    await router.push({ name: 'user-ticket-success', params: { ticketNumber: ticket.ticket_number } })
  } catch {
    error.value = 'The ticket could not be submitted. Please check the form and try again.'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.create-ticket-page { max-width: 820px; margin: 0 auto; }
.breadcrumb { display: flex; gap: 8px; margin-bottom: 22px; color: #8291a8; font-size: 12px; }
.breadcrumb a { color: #1f5eff; text-decoration: none; }
.page-header { margin-bottom: 22px; }
.eyebrow { margin: 0 0 6px; color: #1f5eff; font-size: 11px; font-weight: 700; letter-spacing: .08em; }
h1 { margin: 0 0 7px; color: #172b4d; font-size: 25px; }
.page-header p:last-child { margin: 0; color: #71809a; font-size: 13px; }
.ticket-form { display: grid; gap: 16px; }
.form-card { border: 1px solid #dce4ed; border-radius: 11px; background: #fff; padding: 22px 24px; box-shadow: 0 1px 3px rgb(23 43 77 / 7%); }
h2 { margin: 0 0 17px; color: #172b4d; font-size: 14px; }
h2 span { color: #8291a8; font-size: 11px; font-weight: 400; }
.form-grid { display: grid; gap: 15px; }
.two-columns { grid-template-columns: repeat(2, minmax(0, 1fr)); }
label { display: grid; gap: 7px; color: #344054; font-size: 12px; font-weight: 600; }
input, textarea, select { width: 100%; box-sizing: border-box; border: 1px solid #cbd6e4; border-radius: 7px; background: #fff; color: #172b4d; font: inherit; font-size: 13px; outline: 0; padding: 10px 11px; }
textarea { resize: vertical; }
input:focus, textarea:focus, select:focus { border-color: #1f5eff; box-shadow: 0 0 0 3px #dbe7ff; }
small { color: #8291a8; font-size: 11px; font-weight: 400; }
.attempted-steps { border-radius: 8px; background: #f7f9fc; color: #526783; font-size: 13px; line-height: 1.6; padding: 13px 16px; }
.attempted-steps p { margin: 0; }
.attempted-steps ol { margin: 0; padding-left: 20px; }
.attempted-steps li + li { margin-top: 5px; }
.file-picker { display: flex; align-items: center; gap: 9px; min-height: 48px; border: 1px dashed #b8c7da; border-radius: 8px; color: #526783; cursor: pointer; font-weight: 400; padding: 0 14px; }
.file-picker:hover { border-color: #1f5eff; color: #1f5eff; }
.file-picker i { font-size: 20px; }
.file-picker input { display: none; }
.form-error { margin: 0; border-radius: 8px; background: #fef2f2; color: #b42318; font-size: 12px; padding: 11px 13px; }
.form-actions { display: flex; justify-content: flex-end; gap: 10px; padding-top: 2px; }
.cancel-button, .submit-button { display: inline-flex; align-items: center; gap: 7px; min-height: 38px; border-radius: 7px; cursor: pointer; font: inherit; font-size: 12px; font-weight: 600; padding: 0 16px; text-decoration: none; }
.cancel-button { border: 1px solid #d5deea; background: #fff; color: #526783; }
.submit-button { border: 0; background: #1f5eff; color: #fff; }
.submit-button:hover { background: #174bd1; }
.submit-button:disabled { cursor: wait; opacity: .65; }
@media (max-width: 560px) { .two-columns { grid-template-columns: 1fr; } .form-card { padding: 18px; } h1 { font-size: 22px; } .form-actions { justify-content: stretch; } .cancel-button, .submit-button { flex: 1; justify-content: center; } }
</style>
