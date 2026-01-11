<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { membersApi } from '../api/client'

interface Member {
  id: number
  name: string
  email: string
  phone: string | null
}

const members = ref<Member[]>([])
const loading = ref(true)
const showModal = ref(false)
const editingMember = ref<Member | null>(null)

const form = ref({ name: '', email: '', phone: '' })

const loadData = async () => {
  loading.value = true
  try {
    const res = await membersApi.getAll()
    members.value = res.data.data
  } finally {
    loading.value = false
  }
}

const openCreate = () => {
  editingMember.value = null
  form.value = { name: '', email: '', phone: '' }
  showModal.value = true
}

const openEdit = (member: Member) => {
  editingMember.value = member
  form.value = { name: member.name, email: member.email, phone: member.phone || '' }
  showModal.value = true
}

const save = async () => {
  if (editingMember.value) {
    await membersApi.update(editingMember.value.id, form.value)
  } else {
    await membersApi.create(form.value)
  }
  showModal.value = false
  await loadData()
}

const deleteMember = async (id: number) => {
  if (!confirm('Delete this member?')) return
  await membersApi.delete(id)
  await loadData()
}

onMounted(loadData)
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-slate-800">Members</h1>
      <button @click="openCreate" class="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700">
        Add Member
      </button>
    </div>

    <div v-if="loading" class="text-slate-500">Loading...</div>

    <div v-else class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <table class="w-full">
        <thead class="bg-slate-50 border-b border-slate-200">
          <tr>
            <th class="text-left px-6 py-3 text-sm font-medium text-slate-500">Name</th>
            <th class="text-left px-6 py-3 text-sm font-medium text-slate-500">Email</th>
            <th class="text-left px-6 py-3 text-sm font-medium text-slate-500">Phone</th>
            <th class="text-right px-6 py-3 text-sm font-medium text-slate-500">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200">
          <tr v-for="member in members" :key="member.id" class="hover:bg-slate-50">
            <td class="px-6 py-4 font-medium text-slate-800">{{ member.name }}</td>
            <td class="px-6 py-4 text-slate-600">{{ member.email }}</td>
            <td class="px-6 py-4 text-slate-600">{{ member.phone || '-' }}</td>
            <td class="px-6 py-4 text-right">
              <button @click="openEdit(member)" class="text-blue-600 hover:underline mr-3">Edit</button>
              <button @click="deleteMember(member.id)" class="text-red-600 hover:underline">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h2 class="text-xl font-bold text-slate-800 mb-4">{{ editingMember ? 'Edit' : 'Add' }} Member</h2>
        <form @submit.prevent="save" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Name</label>
            <input v-model="form.name" required
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input v-model="form.email" type="email" required
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Phone</label>
            <input v-model="form.phone"
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500" />
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
