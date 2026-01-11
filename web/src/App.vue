<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

const navItems = [
  { path: '/', label: 'Dashboard' },
  { path: '/books', label: 'Books' },
  { path: '/authors', label: 'Authors' },
  { path: '/members', label: 'Members' },
  { path: '/loans', label: 'Loans' },
]
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <nav class="bg-slate-800 text-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-8">
            <span class="text-xl font-bold">Library System</span>
            <div class="flex gap-1">
              <RouterLink
                v-for="item in navItems"
                :key="item.path"
                :to="item.path"
                class="px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-slate-700"
                active-class="bg-slate-700"
              >
                {{ item.label }}
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto px-4 py-8">
      <RouterView />
    </main>
  </div>
</template>
