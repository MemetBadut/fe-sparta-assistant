<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <div class="brand">
        <span class="brand-dot"></span>
        Desk Assistant
      </div>

      <nav>
        <RouterLink to="/admin/dashboard">Dashboard</RouterLink>
        <RouterLink to="/admin/tickets">Tickets</RouterLink>
        <RouterLink to="/admin/knowledge">Knowledge Base</RouterLink>
      </nav>

      <div class="sidebar-footer">
        <div class="admin-avatar">A</div>
        <div>
          <div class="admin-name">Admin</div>
          <button class="logout" type="button">Logout</button>
        </div>
      </div>
    </aside>

    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

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
  position: sticky;
  top: 0;
  height: 100vh;
  box-sizing: border-box;
}

.brand {
  font-weight: 700;
  font-size: 18px;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 32px;
}

.brand-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #f97316;
}

nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

nav a {
  color: #cbd5e1;
  text-decoration: none;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 14px;
}

nav a:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
}

nav a.router-link-active {
  background: #f97316;
  color: #fff;
  font-weight: 600;
}

.sidebar-footer {
  display: flex;
  align-items: center;
  gap: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 16px;
}

.admin-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f97316;
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 700;
  flex-shrink: 0;
}

.admin-name {
  font-size: 13px;
  color: #fff;
}

.logout {
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 12px;
  cursor: pointer;
  padding: 0;
}

.logout:hover {
  color: #fff;
}

.content {
  flex: 1;
  background: #f3f4f6;
  padding: 24px;
  min-width: 0;
}

@media (max-width: 768px) {
  .sidebar {
    width: 64px;
    padding: 16px 8px;
  }

  .brand,
  .admin-name,
  .logout {
    display: none;
  }

  .sidebar-footer {
    justify-content: center;
  }
}
</style>
