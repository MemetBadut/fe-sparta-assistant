<template>
  <div class="admin-layout">
    <div v-if="sidebarOpen" class="backdrop" @click="sidebarOpen = false"></div>

    <aside class="sidebar" :class="{ open: sidebarOpen }">
      <div class="brand">
        <span>Desk Assistant</span>
        <button
          class="collapse-btn"
          type="button"
          aria-label="Close sidebar"
          @click="sidebarOpen = false"
        >
          <i class="ri-arrow-drop-left-line"></i>
        </button>
      </div>

      <nav>
        <RouterLink to="/admin/dashboard"><i class="ri-dashboard-line"></i> Dashboard</RouterLink>
        <RouterLink to="/admin/tickets"><i class="ri-ticket-line"></i> Tickets</RouterLink>
        <RouterLink to="/admin/knowledge"><i class="ri-brain-line"></i> Knowledge Base</RouterLink>
      </nav>

      <div class="sidebar-footer">
        <div class="profile-row">
          <div class="admin-avatar">CR</div>
          <div>
            <div class="admin-name">Carlos Reyes</div>
            <div class="admin-role">IT Support</div>
          </div>
        </div>

        <button class="logout" type="button">
          <i class="ri-logout-box-r-line"></i>
        </button>
      </div>
    </aside>

    <div class="main-area">
      <div v-if="!sidebarOpen" class="toolbar">
        <button class="menu-toggle" type="button" aria-label="Open sidebar" @click="sidebarOpen = true">
          <i class="ri-menu-line"></i>
        </button>
      </div>

      <main class="content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const sidebarOpen = ref(true)

onMounted(() => {
  if (window.innerWidth <= 768) sidebarOpen.value = false
})
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 240px;
  flex-shrink: 0;
  background: #1b2431;
  color: #cbd5e1;
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
  box-sizing: border-box;
  position: sticky;
  top: 0;
  left: 0;
  height: 100vh;
  overflow: hidden auto;
  transition:
    width 0.2s ease,
    padding 0.2s ease;
}

.main-area {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.toolbar {
  display: none;
  flex-shrink: 0;
  padding: 16px;
  background: #1b2431;
}

.toolbar button{
  background-color: #204085;
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.08);
}

.toolbar i {
  color: white;
}

.menu-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  color: #1f2937;
  cursor: pointer;
  font-size: 18px;
}

.backdrop {
  display: none;
}

.brand {
  font-weight: 700;
  font-size: 18px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 32px;
}

.collapse-btn {
  display: none;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  cursor: pointer;
  font-size: 18px;
  flex-shrink: 0;
}

.collapse-btn:hover {
  background: rgba(255, 255, 255, 0.16);
}

.brand-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #2563eb;
}

nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

nav a {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #cbd5e1;
  text-decoration: none;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 14px;
}

nav a i {
  font-size: 18px;
}

nav a:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
}

nav a.router-link-active {
  background: #2563eb;
  color: #fff;
  font-weight: 600;
}

.sidebar-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 16px;
}

.profile-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.admin-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #2563eb;
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 700;
  flex-shrink: 0;
}

.admin-name {
  font-size: 13px;
  font-weight: 600;
  color: #fff;
}

.admin-role {
  font-size: 12px;
  color: #60a5fa;
}

.logout {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 13px;
  cursor: pointer;
  padding: 0;
}

.logout i {
  font-size: 16px;
}

.logout:hover {
  color: #fff;
}

.content {
  flex: 1;
  min-width: 0;
  background: #f3f4f6;
  padding: 24px;
  box-sizing: border-box;
}

@media (max-width: 500px) {
  .content {
    padding: 16px;
  }
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 20;
  }

  .sidebar:not(.open) {
    width: 0;
    padding-left: 0;
    padding-right: 0;
  }

  .collapse-btn {
    display: flex;
  }

  .toolbar {
    display: block;
  }

  .backdrop {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 10;
    background: rgba(15, 23, 42, 0.45);
  }
}
</style>
