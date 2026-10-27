<script setup>
import { ref, onMounted } from 'vue';
import { IconSun, IconMoon } from '@tabler/icons-vue';

const isDark = ref(false);

onMounted(() => {
    const savedTheme = localStorage.getItem('theme');

    if (
        savedTheme === 'dark' ||
        (!savedTheme &&
            window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
        isDark.value = true;
        document.documentElement.classList.add('dark');
    } else {
        isDark.value = false;
        document.documentElement.classList.remove('dark');
    }
});

const toggleDark = () => {
    isDark.value = !isDark.value;

    if (isDark.value) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }
};
</script>

<template>
    <button @click="toggleDark"
        class="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition shadow-xs"
        :title="isDark ? 'Light Mode' : 'Dark Mode'"
        :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
        <IconSun v-if="isDark" :size="20" :stroke="1.8" class="text-yellow-400" />

        <IconMoon v-else :size="20" :stroke="1.8" class="text-gray-700 dark:text-gray-200" />
    </button>
</template>
