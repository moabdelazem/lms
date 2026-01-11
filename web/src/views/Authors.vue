<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { authorsApi } from '../api/client'

interface Author {
  id: number
  name: string
  bio: string | null
}

const authors = ref<Author[]>([])
const loading = ref(true)
const showModal = ref(false)
const editingAuthor = ref<Author | null>(null)

const form = ref({ name: '', bio: '' })

const loadData = async () => {
  loading.value = true
  try {
    const res = await authorsApi.getAll()
    authors.value = res.data.data
  } finally {
    loading.value = false
  }
}

const openCreate = () => {
  editingAuthor.value = null
  form.value = { name: '', bio: '' }
  showModal.value = true
}

const openEdit = (author: Author) => {
  editingAuthor.value = author
  form.value = { name: author.name, bio: author.bio || '' }
  showModal.value = true
}

const save = async () => {
  if (editingAuthor.value) {
    await authorsApi.update(editingAuthor.value.id, form.value)
  } else {
    await authorsApi.create(form.value)
  }
  showModal.value = false
  await loadData()
}

const deleteAuthor = async (id: number) => {
  if (!confirm('Delete this author?')) return
  await authorsApi.delete(id)
  await loadData()
}

onMounted(loadData)
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-slate-800">Authors</h1>
      <button @click="openCreate" class="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700">
        Add Author
      </button>
    </div>

    <div v-if="loading" class="text-slate-500">Loading...</div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="author in authors" :key="author.id"
        class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 class="text-lg font-semibold text-slate-800">{{ author.name }}</h3>
        <p class="text-slate-500 text-sm mt-1">{{ author.bio || 'No bio' }}</p>
        <div class="flex gap-3 mt-4">
          <button @click="openEdit(author)" class="text-blue-600 text-sm hover:underline">Edit</button>
          <button @click="deleteAuthor(author.id)" class="text-red-600 text-sm hover:underline">Delete</button>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h2 class="text-xl font-bold text-slate-800 mb-4">{{ editingAuthor ? 'Edit' : 'Add' }} Author</h2>
        <form @submit.prevent="save" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Name</label>
            <input v-model="form.name" required
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Bio</label>
            <textarea v-model="form.bio" rows="3"
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500"></textarea>
          </div>
          <div class="flex justify-end gap-3 pt-4">
            <button type="button" @click="showModal = false" class="px-4 py-2 text-slate-600">Cancel</button>
            <button type="submit" class="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
