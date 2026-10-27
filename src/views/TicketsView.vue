<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';
import Navbar from '../components/layout/Navbar.vue';
import { IconTicket, IconCalendar, IconUser, IconPlane } from '@tabler/icons-vue';

const tickets = ref([]);
const loading = ref(true);
const errorMessage = ref('');

const fetchTickets = async () => {
    try {
        const response = await api.get('/tickets');
        const result = response.data;
        tickets.value = result.data?.data || result.data || [];
    } catch (error) {
        console.error('Biletleri çekmekde ýalňyşlyk:', error);
        errorMessage.value = 'Biletleri ýüklemek başartmady. Serwere baglanyşyk baradaky barlaň.';
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchTickets();
});
</script>

<template>
    <div
        class="min-h-screen bg-gray-100/80 dark:bg-gray-950 text-gray-800 dark:text-gray-100 transition-colors duration-300">
        <Navbar />

        <main class="max-w-7xl mx-auto px-4 py-8">
            <!-- Header -->
            <header class="mb-10 text-center">
                <h1
                    class="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 inline-flex items-center justify-center gap-3 drop-shadow-sm">
                    <IconTicket :size="32" :stroke="2" /> Tickets
                </h1>
                <p class="text-gray-500 dark:text-gray-400 mt-2 text-sm md:text-base">
                    Satyn alan ähli uçar biletleriňizi we uçuş maglumatlaryňyzy şu ýerden görüp bilersiňiz
                </p>
            </header>

            <!-- Ýalňyşlyk ýagdaýy -->
            <div v-if="errorMessage"
                class="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-center text-sm font-semibold">
                {{ errorMessage }}
            </div>

            <!-- Ýüklenýär ýagdaýy -->
            <div v-if="loading" class="text-center text-gray-600 dark:text-gray-400 text-base py-16">
                Ýüklenýär...
            </div>

            <!-- Bilet ýok ýagdaýy -->
            <div v-else-if="tickets.length === 0"
                class="text-center text-gray-500 dark:text-gray-400 py-16 bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl rounded-3xl border border-white/40 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]">
                <p class="text-lg font-semibold">Häzirlikçe satyn alnan bilet ýok.</p>
            </div>

            <!-- Biletleriň Sanawy -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div v-for="ticket in tickets" :key="ticket.id"
                    class="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl p-6 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/60 dark:border-white/10 flex flex-col justify-between gap-5 transition-all duration-300 hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]">

                    <!-- Üstki bölek -->
                    <div class="flex justify-between items-start gap-4">
                        <div>
                            <span
                                class="text-xs font-bold uppercase bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-3.5 py-1 rounded-full border border-indigo-500/20 backdrop-blur-md">
                                {{ ticket.ticket_code }}
                            </span>

                            <h3
                                class="mt-3 text-xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2 drop-shadow-sm">
                                <span>{{ ticket.flight?.departure_airport?.code }}</span>
                                <span class="text-indigo-500 font-bold">➔</span>
                                <span>{{ ticket.flight?.arrival_airport?.code }}</span>
                            </h3>

                            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {{ ticket.flight?.departure_airport?.city }} — {{ ticket.flight?.arrival_airport?.city
                                }}
                            </p>
                        </div>

                        <!-- Baha we Status Badge (Aşaklygyna tertipli) -->
                        <div class="text-right flex flex-col items-end gap-1.5">
                            <span class="text-2xl font-black text-indigo-600 dark:text-indigo-400 drop-shadow-sm">
                                ${{ ticket.price }}
                            </span>

                            <!-- Düzeldilen we gowulandyrlan Status Badge -->
                            <div :class="[
                                'text-[11px] font-bold px-3 py-1 rounded-full border backdrop-blur-md uppercase tracking-wider',
                                ticket.status === 'confirmed'
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                            ]">
                                {{ ticket.status }}
                            </div>
                        </div>
                    </div>

                    <!-- Aşaky bölek -->
                    <div
                        class="border-t border-white/40 dark:border-white/10 pt-4 flex flex-col gap-3 bg-white/30 dark:bg-gray-800/30 p-4 rounded-2xl backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] text-sm text-gray-700 dark:text-gray-300">

                        <div class="flex items-center gap-2">
                            <IconUser :size="18" class="text-indigo-500" />
                            <span>Ýolagçy: <strong class="text-gray-900 dark:text-white">{{ ticket.passenger?.first_name
                            }} {{ ticket.passenger?.last_name }}</strong></span>
                        </div>

                        <div class="flex items-center gap-2">
                            <IconCalendar :size="18" class="text-indigo-500" />
                            <span>Uçuş wagty: <strong class="text-gray-900 dark:text-white">{{
                                ticket.flight?.departure_time }}</strong> ➔ <strong
                                    class="text-gray-900 dark:text-white">{{ ticket.flight?.arrival_time
                                    }}</strong></span>
                        </div>

                        <div class="flex flex-wrap items-center gap-2 pt-1">
                            <span
                                class="text-xs font-bold px-3 py-1 rounded-xl bg-white/70 dark:bg-gray-800/60 backdrop-blur-md border-t border-gray-200 dark:border-white/50 text-gray-800 dark:text-gray-200">
                                Orun: {{ ticket.seat_number }}
                            </span>
                            <span v-if="ticket.flight?.airline"
                                class="text-xs font-bold px-3 py-1 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 backdrop-blur-md flex items-center gap-1">
                                <IconPlane :size="14" /> {{ ticket.flight.airline }} ({{ ticket.flight?.flight_number
                                }})
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>