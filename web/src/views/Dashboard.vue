<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { booksApi, authorsApi, membersApi, loansApi } from '../api/client'

const stats = ref({
  books: 0,
  authors: 0,
  members: 0,
  activeLoans: 0,
})

const loading = ref(true)

onMounted(async () => {
  try {
    const [books, authors, members, loans] = await Promise.all([
      booksApi.getAll(),
      authorsApi.getAll(),
      membersApi.getAll(),
      loansApi.getAll(),
    ])
    stats.value = {
      books: books.data.data.length,
      authors: authors.data.data.length,
      members: members.data.data.length,
      activeLoans: loans.data.data.filter((l: { status: string }) => l.status === 'BORROWED').length,
    }
  } catch (err) {
    console.error('Failed to load stats', err)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold text-slate-800 mb-8">Dashboard</h1>

    <div v-if="loading" class="text-slate-500">Loading...</div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
        <div class="text-sm font-medium text-slate-500">Total Books</div>
        <div class="text-3xl font-bold text-slate-800 mt-2">{{ stats.books }}</div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
        <div class="text-sm font-medium text-slate-500">Authors</div>
        <div class="text-3xl font-bold text-slate-800 mt-2">{{ stats.authors }}</div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
        <div class="text-sm font-medium text-slate-500">Members</div>
        <div class="text-3xl font-bold text-slate-800 mt-2">{{ stats.members }}</div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
        <div class="text-sm font-medium text-slate-500">Active Loans</div>
        <div class="text-3xl font-bold text-amber-600 mt-2">{{ stats.activeLoans }}</div>
      </div>
    </div>
  </div>
</template>
