<script setup>
import { ref } from 'vue';
import ToggleDarkMode from '../common/ToggleDarkMode.vue';
import { IconPlane, IconMenu2, IconX, IconBookmark } from '@tabler/icons-vue';

const isMobileMenuOpen = ref(false);
const activeTab = ref('home');

const setActiveTab = (tab) => {
    activeTab.value = tab;
    isMobileMenuOpen.value = false;
};
</script>

<template>
    <header class="sticky top-4 z-30 w-[calc(100%-2rem)] max-w-7xl mx-auto
           rounded-3xl md:rounded-full
           bg-white/40 dark:bg-gray-900/40
           backdrop-blur-xl
           border border-white/60 dark:border-white/10
           shadow-[0_8px_32px_0_rgba(31,38,135,0.08),inset_0_1px_1px_rgba(255,255,255,0.6)]
           dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37),inset_0_1px_1px_rgba(255,255,255,0.1)]
           transition-all duration-300">
        <!-- Esasy Navbar Hatary -->
        <div class="flex items-center justify-between h-16 px-6">

            <!-- Logo we Desktop Navigation (Liquid Pill Style) -->
            <div class="flex items-center gap-8">
                <a href="#" @click="setActiveTab('home')"
                    class="text-xl font-extrabold tracking-tight text-indigo-600 dark:text-indigo-400 flex items-center gap-2 drop-shadow-sm">
                    <IconPlane :size="25" :stroke="2" />
                    Gezegen
                </a>

                <!-- 3. Aktiv Linkiň Şekili (Liquid Pill Style) -->
                <nav
                    class="hidden items-center gap-1.5 md:flex p-1 bg-gray-200/40 dark:bg-gray-800/40 rounded-full border border-white/40 dark:border-white/5 backdrop-blur-sm">
                    <a href="#" @click.prevent="setActiveTab('home')" :class="[
                        'px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300',
                        activeTab === 'home'
                            ? 'bg-white/80 dark:bg-gray-700/80 text-indigo-600 dark:text-indigo-400 shadow-sm border border-white/60 dark:border-white/10 backdrop-blur-sm'
                            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    ]">
                        Home
                    </a>

                    <a href="#" @click.prevent="setActiveTab('tickets')" :class="[
                        'px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300',
                        activeTab === 'tickets'
                            ? 'bg-white/80 dark:bg-gray-700/80 text-indigo-600 dark:text-indigo-400 shadow-sm border border-white/60 dark:border-white/10 backdrop-blur-sm'
                            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    ]">
                        Tickets
                    </a>

                    <a href="#" @click.prevent="setActiveTab('about')" :class="[
                        'px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300',
                        activeTab === 'about'
                            ? 'bg-white/80 dark:bg-gray-700/80 text-indigo-600 dark:text-indigo-400 shadow-sm border border-white/60 dark:border-white/10 backdrop-blur-sm'
                            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    ]">
                        About
                    </a>
                </nav>
            </div>

            <!-- Sag tarapdaky Düwmeler (Desktop) -->
            <div class="hidden md:flex items-center gap-4">
                <a href="#"
                    class="flex items-center gap-1.5 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                    <IconBookmark size="18" stroke="1.5" />
                    Saved Tickets
                </a>

                <div class="h-4 w-px bg-gray-300/60 dark:bg-gray-700"></div>

                <ToggleDarkMode />
            </div>

            <!-- Mobil Düwmeler we Hamburger Menu -->
            <div class="flex items-center gap-3 md:hidden">
                <ToggleDarkMode />

                <button @click="isMobileMenuOpen = !isMobileMenuOpen"
                    class="p-2 rounded-xl bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-200 border border-white/60 dark:border-white/10 cursor-pointer transition">
                    <IconMenu2 v-if="!isMobileMenuOpen" size="22" />
                    <IconX v-else size="22" />
                </button>
            </div>

        </div>

        <!-- Mobil Açylýan Menýu (Birleşdirilen) -->
        <transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 -translate-y-2"
            enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-200 ease-in"
            leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-2">
            <div v-if="isMobileMenuOpen"
                class="md:hidden px-6 pb-6 pt-2 border-t border-white/40 dark:border-white/10 flex flex-col gap-3 bg-white/20 dark:bg-gray-900/20 backdrop-blur-sm">

                <div class="flex flex-col gap-2 pt-2">
                    <a href="#" @click.prevent="setActiveTab('home')" :class="[
                        'px-4 py-2 rounded-xl text-sm font-bold transition-all',
                        activeTab === 'home'
                            ? 'bg-indigo-600/10 dark:bg-indigo-400/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50'
                    ]">
                        Home
                    </a>

                    <a href="#" @click.prevent="setActiveTab('tickets')" :class="[
                        'px-4 py-2 rounded-xl text-sm font-bold transition-all',
                        activeTab === 'tickets'
                            ? 'bg-indigo-600/10 dark:bg-indigo-400/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50'
                    ]">
                        Tickets
                    </a>

                    <a href="#" @click.prevent="setActiveTab('about')" :class="[
                        'px-4 py-2 rounded-xl text-sm font-bold transition-all',
                        activeTab === 'about'
                            ? 'bg-indigo-600/10 dark:bg-indigo-400/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50'
                    ]">
                        About
                    </a>
                </div>

                <div class="border-t border-white/40 dark:border-white/10 pt-3">
                    <a href="#"
                        class="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 py-1">
                        <IconBookmark size="18" /> Saved Tickets
                    </a>
                </div>
            </div>
        </transition>

    </header>
</template>