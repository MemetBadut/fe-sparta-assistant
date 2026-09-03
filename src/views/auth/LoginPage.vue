<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ApiError } from '@/services/api'

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const authStore = useAuthStore()
const router = useRouter()

async function onSubmit() {
  error.value = ''
  loading.value = true
  try {
    await authStore.login(email.value, password.value)
    router.push('/admin/dashboard')
  } catch (e) {
    error.value = e instanceof ApiError && e.status === 401 ? 'Email atau password salah' : 'Login gagal, coba lagi'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="brand">
      <div class="brand-icon"><i class="ri-grid-fill"></i></div>
      <h1>IT Helpdesk Assistant</h1>
      <p>Self-service IT support</p>
    </div>

    <form class="login-card" @submit.prevent="onSubmit">
      <h2>Sign in to your account</h2>

      <label>
        Email or Employee ID
        <input v-model="email" type="email" placeholder="maria.santos@company.com" required autocomplete="email" />
      </label>

      <label>
        Password
        <input v-model="password" type="password" placeholder="••••••••" required autocomplete="current-password" />
      </label>

      <a href="#" class="forgot">Forgot password?</a>

      <p v-if="error" class="error">{{ error }}</p>

      <button type="submit" :disabled="loading">{{ loading ? 'Signing in…' : 'Login' }}</button>
    </form>

    <p class="footer-links">
      Don't have an account? <a href="../auth/RegisterPage.vue">Create account →</a><br />
      IT staff? <a href="../admin/LoginPage.vue">Admin login →</a>
    </p>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  background: #f3f4f6;
  padding: 24px;
  box-sizing: border-box;
}

.brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 4px;
}

.brand-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #2563eb;
  color: #fff;
  display: grid;
  place-items: center;
  font-size: 22px;
  margin-bottom: 8px;
}

.brand h1 {
  font-size: 20px;
  margin: 0;
}

.brand p {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
}

.login-card {
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #fff;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

h2 {
  font-size: 18px;
  margin: 0 0 8px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 13px;
  color: #374151;
}

input {
  padding: 8px 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
}

.forgot {
  align-self: flex-end;
  font-size: 13px;
  color: #2563eb;
  text-decoration: none;
}

.forgot:hover {
  text-decoration: underline;
}

button {
  margin-top: 8px;
  padding: 10px;
  border: none;
  border-radius: 6px;
  background: #2563eb;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  color: #dc2626;
  font-size: 13px;
  margin: 0;
}

.footer-links {
  text-align: center;
  font-size: 13px;
  color: #6b7280;
  line-height: 1.8;
}

.footer-links a {
  color: #2563eb;
  text-decoration: none;
}

.footer-links a:hover {
  text-decoration: underline;
}
</style>
