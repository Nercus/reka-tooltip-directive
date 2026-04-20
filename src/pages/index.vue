<template>
  <div class="flex flex-col flex-1 justify-center items-center gap-8 bg-linear-to-r from-neutral-100 to-stone-200 h-full">
    <hr class="top-60 fixed border-0 border-neutral-400 border-t-2 border-dashed w-full">
    <hr class="left-60 fixed border-0 border-neutral-400 border-l-2 border-dashed w-px h-full">
    <hr class="right-60 fixed border-0 border-neutral-400 border-r-2 border-dashed w-px h-full">
    <hr class="bottom-60 fixed border-0 border-neutral-400 border-b-2 border-dashed w-full">
    <img v-tooltip="'Hello World'" src="../assets/vue.svg" alt="Vue logo" class="size-40">
    <h1 v-tooltip="{ content: `${counter}`, side: 'left' }" class="text-neutral-800 text-3xl tracking-wide">
      Tooltip Directive
    </h1>
  </div>
</template>

<script setup lang="ts">
const counter = ref(0)
setInterval(() => {
  counter.value++
}, 200)
</script>
