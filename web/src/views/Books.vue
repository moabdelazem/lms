<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { booksApi, authorsApi } from '../api/client'

interface Author {
  id: number
  name: string
}

interface Book {
  id: number
  title: string
  isbn: string
  quantity: number
  author: Author
}

const books = ref<Book[]>([])
const authors = ref<Author[]>([])
const loading = ref(true)
const showModal = ref(false)
const editingBook = ref<Book | null>(null)

const form = ref({
  title: '',
  isbn: '',
  authorId: 0,
  quantity: 1,
})

const loadData = async () => {
  loading.value = true
  try {
    const [booksRes, authorsRes] = await Promise.all([
      booksApi.getAll(),
      authorsApi.getAll(),
    ])
    books.value = booksRes.data.data
    authors.value = authorsRes.data.data
  } catch (err) {
    console.error('Failed to load data', err)
  } finally {
    loading.value = false
  }
}

const openCreate = () => {
  editingBook.value = null
  form.value = { title: '', isbn: '', authorId: authors.value[0]?.id || 0, quantity: 1 }
  showModal.value = true
}

const openEdit = (book: Book) => {
  editingBook.value = book
  form.value = { title: book.title, isbn: book.isbn, authorId: book.author.id, quantity: book.quantity }
  showModal.value = true
}

const save = async () => {
  try {
    if (editingBook.value) {
      await booksApi.update(editingBook.value.id, form.value)
    } else {
      await booksApi.create(form.value)
    }
    showModal.value = false
    await loadData()
  } catch (err) {
    console.error('Failed to save', err)
  }
}

const deleteBook = async (id: number) => {
  if (!confirm('Delete this book?')) return
  try {
    await booksApi.delete(id)
    await loadData()
  } catch (err) {
    console.error('Failed to delete', err)
  }
}

onMounted(loadData)
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-slate-800">Books</h1>
      <button
        @click="openCreate"
        class="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
      >
        Add Book
      </button>
    </div>

    <div v-if="loading" class="text-slate-500">Loading...</div>

    <div v-else class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <table class="w-full">
        <thead class="bg-slate-50 border-b border-slate-200">
          <tr>
            <th class="text-left px-6 py-3 text-sm font-medium text-slate-500">Title</th>
            <th class="text-left px-6 py-3 text-sm font-medium text-slate-500">ISBN</th>
            <th class="text-left px-6 py-3 text-sm font-medium text-slate-500">Author</th>
            <th class="text-left px-6 py-3 text-sm font-medium text-slate-500">Qty</th>
            <th class="text-right px-6 py-3 text-sm font-medium text-slate-500">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200">
          <tr v-for="book in books" :key="book.id" class="hover:bg-slate-50">
            <td class="px-6 py-4 font-medium text-slate-800">{{ book.title }}</td>
            <td class="px-6 py-4 text-slate-600">{{ book.isbn }}</td>
            <td class="px-6 py-4 text-slate-600">{{ book.author.name }}</td>
            <td class="px-6 py-4 text-slate-600">{{ book.quantity }}</td>
            <td class="px-6 py-4 text-right">
              <button @click="openEdit(book)" class="text-blue-600 hover:underline mr-3">Edit</button>
              <button @click="deleteBook(book.id)" class="text-red-600 hover:underline">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h2 class="text-xl font-bold text-slate-800 mb-4">
          {{ editingBook ? 'Edit Book' : 'Add Book' }}
        </h2>
        <form @submit.prevent="save" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input v-model="form.title" type="text" required
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">ISBN</label>
            <input v-model="form.isbn" type="text" required
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Author</label>
            <select v-model="form.authorId" required
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent">
              <option v-for="author in authors" :key="author.id" :value="author.id">{{ author.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
            <input v-model.number="form.quantity" type="number" min="1" required
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent" />
          </div>
          <div class="flex justify-end gap-3 pt-4">
            <button type="button" @click="showModal = false"
              class="px-4 py-2 text-slate-600 hover:text-slate-800">Cancel</button>
            <button type="submit"
              class="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
