<template>
  <div class="user-layout">
    <header class="topbar">
      <RouterLink class="brand" :to="{ name: 'user-dashboard' }">
        <span class="brand-icon"><i class="ri-grid-fill"></i></span>
        <span>IT Helpdesk Assistant</span>
      </RouterLink>

      <div ref="mobileProfileMenu" class="mobile-profile profile-menu">
        <button
          ref="mobileProfileTrigger"
          class="profile-trigger"
          type="button"
          aria-label="Open profile menu"
          aria-haspopup="menu"
          :aria-expanded="mobileProfileOpen"
          aria-controls="mobile-profile-menu"
          @click="toggleMobileProfile"
        >
          <div class="profile-copy">
            <strong>{{ authStore.user?.name || 'Employee' }}</strong>
            <span>{{ authStore.user?.division || 'Employee' }}</span>
          </div>
          <div class="avatar">{{ initials }}</div>
        </button>
        <div v-if="mobileProfileOpen" id="mobile-profile-menu" class="profile-dropdown" role="menu">
          <button ref="mobileLogout" class="logout" type="button" role="menuitem" @click="handleLogout">
            <i class="ri-logout-box-r-line"></i> Logout
          </button>
        </div>
      </div>

      <button class="menu-toggle" type="button" aria-label="Toggle navigation" @click="toggleMenu">
        <i :class="menuOpen ? 'ri-close-line' : 'ri-menu-line'"></i>
      </button>

      <nav class="nav-links" :class="{ open: menuOpen }" @click="menuOpen = false">
        <RouterLink :to="{ name: 'user-dashboard' }"><i class="ri-dashboard-line"></i> Dashboard</RouterLink>
        <RouterLink :to="{ name: 'user-tickets' }"><i class="ri-ticket-line"></i> My Tickets</RouterLink>
      </nav>

      <div ref="desktopProfileMenu" class="account profile-menu">
        <button
          ref="desktopProfileTrigger"
          class="profile-trigger desktop-profile-trigger"
          type="button"
          aria-label="Open profile menu"
          aria-haspopup="menu"
          :aria-expanded="desktopProfileOpen"
          aria-controls="desktop-profile-menu"
          @click="toggleDesktopProfile"
        >
          <div class="profile-copy">
            <strong>{{ authStore.user?.name || 'Employee' }}</strong>
            <span>{{ authStore.user?.division || 'Employee' }}</span>
          </div>
          <div class="avatar">{{ initials }}</div>
        </button>
        <div v-if="desktopProfileOpen" id="desktop-profile-menu" class="profile-dropdown" role="menu">
          <button class="profile-action" type="button" role="menuitem" disabled aria-disabled="true">
            <i class="ri-settings-3-line"></i> Account Settings
          </button>
          <button ref="desktopLogout" class="logout profile-action" type="button" role="menuitem" @click="handleLogout">
            <i class="ri-logout-box-r-line"></i> Logout
          </button>
        </div>
      </div>
    </header>

    <main class="content"><RouterView /></main>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const menuOpen = ref(false)
const mobileProfileOpen = ref(false)
const desktopProfileOpen = ref(false)
const mobileProfileTrigger = ref<HTMLButtonElement | null>(null)
const desktopProfileTrigger = ref<HTMLButtonElement | null>(null)
const mobileLogout = ref<HTMLButtonElement | null>(null)
const mobileProfileMenu = ref<HTMLElement | null>(null)
const desktopProfileMenu = ref<HTMLElement | null>(null)
const desktopLogout = ref<HTMLButtonElement | null>(null)

const initials = computed(() =>
  (authStore.user?.name || 'User')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase(),
)

function toggleMenu() {
  menuOpen.value = !menuOpen.value
  if (menuOpen.value) {
    mobileProfileOpen.value = false
    desktopProfileOpen.value = false
  }
}

function toggleMobileProfile() {
  mobileProfileOpen.value = !mobileProfileOpen.value
  if (!mobileProfileOpen.value) return
  menuOpen.value = false
  desktopProfileOpen.value = false
  nextTick(() => mobileLogout.value?.focus())
}

function toggleDesktopProfile() {
  desktopProfileOpen.value = !desktopProfileOpen.value
  if (!desktopProfileOpen.value) return
  menuOpen.value = false
  mobileProfileOpen.value = false
  nextTick(() => desktopLogout.value?.focus())
}

function closeMenus() {
  menuOpen.value = false
  mobileProfileOpen.value = false
  desktopProfileOpen.value = false
}

function handleOutsideClick(event: PointerEvent) {
  const target = event.target as Node
  if (!mobileProfileMenu.value?.contains(target)) mobileProfileOpen.value = false
  if (!desktopProfileMenu.value?.contains(target)) desktopProfileOpen.value = false
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key !== 'Escape') return
  if (mobileProfileOpen.value) {
    mobileProfileOpen.value = false
    nextTick(() => mobileProfileTrigger.value?.focus())
  } else if (desktopProfileOpen.value) {
    desktopProfileOpen.value = false
    nextTick(() => desktopProfileTrigger.value?.focus())
  } else {
    menuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('pointerdown', handleOutsideClick)
  document.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handleOutsideClick)
  document.removeEventListener('keydown', handleKeydown)
})

watch(() => router.currentRoute.value.fullPath, closeMenus)

async function handleLogout() {
  closeMenus()
  await authStore.logout()
  router.push({ name: 'login' })
}
</script>

<style scoped>
.user-layout {
  min-height: 100vh;
  background: #f5f7fb;
  color: #172b4d;
}

.topbar {
  min-height: 72px;
  display: flex;
  align-items: center;
  gap: 34px;
  padding: 0 7vw;
  background: #fff;
  border-bottom: 1px solid #e5eaf1;
  box-sizing: border-box;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #172b4d;
  font-size: 17px;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
}

.brand-icon {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #1f5eff;
  color: #fff;
  font-size: 17px;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 26px;
  flex: 1;
}

.nav-links a {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 12px;
  border: 0;
  border-radius: 8px;
  color: #172b4d;
  font-size: 14px;
  text-decoration: none;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  background: #eaf2ff;
  color: #1f5eff;
}

.nav-links a:focus-visible,
.menu-toggle:focus-visible,
.profile-trigger:focus-visible,
.logout:focus-visible {
  outline: 2px solid #1f5eff;
  outline-offset: 2px;
}

.account,
.profile,
.logout {
  display: flex;
  align-items: center;
}

.account {
  gap: 22px;
}

.profile {
  gap: 10px;
}

.profile-copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.profile-copy strong,
.profile-copy span {
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.profile-copy strong {
  color: #172b4d;
  font-size: 13px;
  font-weight: 600;
}

.profile-copy span {
  color: #8291a8;
  font-size: 12px;
  font-weight: 400;
}

.avatar {
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #dbe7ff;
  color: #1f5eff;
  font-size: 13px;
  font-weight: 700;
}

.logout {
  gap: 6px;
  border: 0;
  background: transparent;
  color: #71809a;
  cursor: pointer;
  font: inherit;
  font-size: 13px;
}

.logout:hover {
  color: #1f5eff;
}

.content {
  width: min(1120px, calc(100% - 48px));
  margin: 0 auto;
  padding: 42px 0 64px;
  box-sizing: border-box;
}

.mobile-profile,
.menu-toggle {
  display: none;
}

.profile-trigger {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font: inherit;
}

.profile-menu {
  position: relative;
}

.profile-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  z-index: 3;
  min-width: 160px;
  padding: 5px;
  border: 1px solid #e5eaf1;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 6px 18px rgb(23 43 77 / 12%);
}

.profile-action {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  min-height: 40px;
  padding: 0 10px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: #172b4d;
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  text-align: left;
}

.profile-action:hover,
.profile-action:active {
  background: #eaf2ff;
}

.profile-action:disabled {
  color: #8291a8;
  cursor: not-allowed;
}

@media (max-width: 900px) {
  .topbar {
    gap: 20px;
    padding: 0 24px;
  }
}

@media (max-width: 700px) {
  .topbar {
    position: relative;
    z-index: 2;
    min-height: 64px;
    flex-wrap: wrap;
    gap: 8px;
    padding: 0 18px;
  }

  .brand {
    flex: 1 1 auto;
    min-width: 0;
    font-size: 15px;
  }

  .brand > span:last-child {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .mobile-profile {
    position: relative;
    display: flex;
    flex: 0 1 auto;
    min-width: 0;
    order: 2;
  }

  .profile-trigger {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 44px;
    min-height: 44px;
    max-width: 150px;
    padding: 0;
    border: 0;
    background: transparent;
    color: inherit;
    cursor: pointer;
    font: inherit;
  }

  .profile-trigger .profile-copy {
    align-items: flex-end;
    min-width: 0;
  }

  .profile-trigger .profile-copy strong,
  .profile-trigger .profile-copy span {
    max-width: 100px;
  }

  .profile-trigger .avatar {
    width: 36px;
    height: 36px;
  }

  .profile-dropdown {
    min-width: 116px;
  }

  .profile-trigger .profile-copy {
    align-items: flex-end;
    min-width: 0;
  }

  .profile-trigger .profile-copy strong,
  .profile-trigger .profile-copy span {
    max-width: 100px;
  }

  .profile-trigger .avatar {
    width: 36px;
    height: 36px;
  }

  .menu-toggle {
    display: grid;
    flex: 0 0 auto;
    place-items: center;
    width: 44px;
    height: 44px;
    border: 1px solid #dce3eb;
    border-radius: 8px;
    background: #fff;
    color: #172b4d;
    cursor: pointer;
    font-size: 20px;
    order: 3;
  }

  .nav-links,
  .account {
    display: none;
    width: 100%;
  }

  .nav-links.open {
    display: flex;
  }

  .nav-links {
    align-items: stretch;
    flex-direction: column;
    gap: 0;
    order: 4;
    border-top: 1px solid #edf1f5;
  }

  .nav-links a {
    height: auto;
    padding: 13px 12px;
  }

  .content {
    width: calc(100% - 32px);
    padding: 26px 0 42px;
  }
}

@media (max-width: 380px) {
  .brand > span:last-child {
    display: none;
  }

  .profile-trigger .profile-copy strong,
  .profile-trigger .profile-copy span {
    max-width: 82px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .nav-links a {
    transition: none;
  }
}
</style>
