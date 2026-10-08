<template>
  <div class="admin-layout">
    <aside>
      <RouterLink to="/admin/dashboard"> Dashboard </RouterLink>
      <RouterLink to="/admin/tickets"> Tickets </RouterLink>
    </aside>

    <main>
      <RouterView />
    </main>
  </div>
</template>
