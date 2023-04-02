<template>
  <main class="h-screen overflow-x-hidden relative flex flex-col md:flex-row p-10 pb-20 md:pb-10 text-slate-50">
    <section class="w-[100%] md:w-[50%] flex flex-col justify-center mr-5">
      <h1 class="text-6xl font-bold bg-gradient-to-r from-[#c0392b] to-[#8e44ad] bg-clip-text text-transparent">Dreams Interpreter</h1>
      <h3 class="text-lg my-5">Type in your dream below and see what it could mean</h3>
      <textarea
        v-model.trim="dream"
        :maxlength="maxlength"
        @keyup.shift.enter="getInterpretation"
        class="bg-white bg-opacity-20 backdrop-blur-sm
        border-2 border-cyan-200 focus:outline-none focus:border-cyan-500
        rounded-md p-4 h-52"
        placeholder="i dreamt of ..."
        autocomplete="off">
      </textarea>
      <span class="-mb-6 text-right">{{ dream.length }}/{{ maxlength }}</span>
      <button class="bg-orange-500 hover:bg-orange-700 active:scale-95 disabled:active:scale-100 w-fit mx-auto mt-5 py-3 px-4 rounded-lg text-lg disabled:bg-gray-400"
        :disabled="loading"
        @click="getInterpretation"
      >
      <span v-if="loading" class="relative">
        ............<span class="absolute left-0 inline-block animate-write">🖊</span>
      </span>
      <span v-else>Interpret</span>
      </button>
      <p class="font-bold text-center bg-slate-900 bg-opacity-40 backdrop-blur-sm rounded-md p-1 mt-4"
        v-show="error"
      >
        Ran out of uses (2), come back in 3 hours for more
      </p>
    </section>

    <section :class="[
      result? `opacity-100` : `opacity-0 invisible`,
      `w-[100%] md:w-[50%] md:overflow-y-auto transition-all
      border mt-5 md:mt-0 rounded-md p-4
      bg-slate-900 bg-opacity-40 backdrop-blur-sm`
    ]">
      <pre class="whitespace-pre-wrap font-sans">
{{ result }}
      </pre>
    </section>
  </main>

  <!-- <div class="h-96 -mt-10 bg-gradient-to-b from-[#7c5961] to-transparent">

  </div> -->
</template>

<script setup>
import { ref } from 'vue'
const dream = ref('')
const result = ref('')
const maxlength = ref(700)
const loading = ref(false)
const error = ref(false)

const getInterpretation = async () =>  {
  if (dream.value.length < 3) return
  loading.value = true
  result.value = ''

  // return console.log('getInterpretation')
  const response = await fetch("/api/dream", {
    method: "POST",
    body: dream.value // prompt
  })

  if (!response.ok) {
    error.value = true
  } else {
    error.value = false
  }

  // This data is a ReadableStream
  const data = response.body;
  if (!data) {
    return
  }

  const reader = data.getReader()
  const decoder = new TextDecoder()
  let done = false

  while (!done) {
    const { value, done: doneReading } = await reader.read()
    done = doneReading
    const chunkValue = decoder.decode(value)
    result.value += chunkValue
    console.log(chunkValue)
  }
  loading.value = false
}
</script>
