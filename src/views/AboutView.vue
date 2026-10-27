<script setup>
import { IconLoader, IconUser } from '@tabler/icons-vue';
import Navbar from '../components/layout/Navbar.vue';

</script>

<template>
    <div class="min-h-screen bg-gray-100/80 dark:bg-gray-950 text-gray-800
        dark:text-gray-100 transition-colors duration-300">
        <Navbar />
        <main class="max-w-7xl mx-auto px-4 py-8">
            <header class="mb-10 text-center">
                <h1
                    class="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 pt-4 inline-flex items-center justify-center gap-3 drop-shadow-sm">
                    <IconUser :size="32" :stroke="2" /> Biz Barada
                </h1>
                <p class="text-gray-500 dark:text-gray-400 mt-2 text-sm md:text-base">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum aut nihil ullam quidem sint, nulla
                    laboriosam ad? Iste repudiandae fugiat tempora aliquam sit, eum aperiam numquam consequuntur
                    explicabo itaque minima!
                </p>

                <h1>
                    <IconLoader size="50" stroke="3" class="items-center inline-flex justify-center mt-5 drop-shadow-sm" />
                </h1>
            </header>
        </main>
    </div>
</template>