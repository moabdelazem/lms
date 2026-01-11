<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { loansApi, booksApi, membersApi } from '../api/client'

interface Loan {
  id: number
  status: string
  borrowDate: string
  dueDate: string
  returnDate: string | null
  book: { id: number; title: string }
  member: { id: number; name: string }
}

interface Book { id: number; title: string }
interface Member { id: number; name: string }

const loans = ref<Loan[]>([])
const books = ref<Book[]>([])
const members = ref<Member[]>([])
const loading = ref(true)
const showModal = ref(false)

const form = ref({ bookId: 0, memberId: 0 })

const loadData = async () => {
  loading.value = true
  try {
    const [loansRes, booksRes, membersRes] = await Promise.all([
      loansApi.getAll(),
      booksApi.getAll(),
      membersApi.getAll(),
    ])
    loans.value = loansRes.data.data
    books.value = booksRes.data.data
    members.value = membersRes.data.data
  } finally {
    loading.value = false
  }
}

const openBorrow = () => {
  form.value = { bookId: books.value[0]?.id || 0, memberId: members.value[0]?.id || 0 }
  showModal.value = true
}

const borrow = async () => {
  await loansApi.borrow(form.value)
  showModal.value = false
  await loadData()
}

const returnBook = async (id: number) => {
  await loansApi.return(id)
  await loadData()
}

const formatDate = (d: string) => new Date(d).toLocaleDateString()

onMounted(loadData)
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-slate-800">Loans</h1>
      <button @click="openBorrow" class="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700">
        Borrow Book
      </button>
    </div>

    <div v-if="loading" class="text-slate-500">Loading...</div>

    <div v-else class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <table class="w-full">
        <thead class="bg-slate-50 border-b border-slate-200">
          <tr>
            <th class="text-left px-6 py-3 text-sm font-medium text-slate-500">Book</th>
            <th class="text-left px-6 py-3 text-sm font-medium text-slate-500">Member</th>
            <th class="text-left px-6 py-3 text-sm font-medium text-slate-500">Borrowed</th>
            <th class="text-left px-6 py-3 text-sm font-medium text-slate-500">Due</th>
            <th class="text-left px-6 py-3 text-sm font-medium text-slate-500">Status</th>
            <th class="text-right px-6 py-3 text-sm font-medium text-slate-500">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200">
          <tr v-for="loan in loans" :key="loan.id" class="hover:bg-slate-50">
            <td class="px-6 py-4 font-medium text-slate-800">{{ loan.book.title }}</td>
            <td class="px-6 py-4 text-slate-600">{{ loan.member.name }}</td>
            <td class="px-6 py-4 text-slate-600">{{ formatDate(loan.borrowDate) }}</td>
            <td class="px-6 py-4 text-slate-600">{{ formatDate(loan.dueDate) }}</td>
            <td class="px-6 py-4">
              <span :class="[
                'px-2 py-1 text-xs font-medium rounded-full',
                loan.status === 'BORROWED' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
              ]">
                {{ loan.status }}
              </span>
            </td>
            <td class="px-6 py-4 text-right">
              <button v-if="loan.status === 'BORROWED'" @click="returnBook(loan.id)"
                class="text-green-600 hover:underline">Return</button>
              <span v-else class="text-slate-400">-</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h2 class="text-xl font-bold text-slate-800 mb-4">Borrow Book</h2>
        <form @submit.prevent="borrow" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Book</label>
            <select v-model="form.bookId" required
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500">
              <option v-for="book in books" :key="book.id" :value="book.id">{{ book.title }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Member</label>
            <select v-model="form.memberId" required
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500">
              <option v-for="member in members" :key="member.id" :value="member.id">{{ member.name }}</option>
            </select>
          </div>
          <div class="flex justify-end gap-3 pt-4">
            <button type="button" @click="showModal = false" class="px-4 py-2 text-slate-600">Cancel</button>
            <button type="submit" class="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700">Borrow</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
