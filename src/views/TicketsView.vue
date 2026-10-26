<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Navbar from '../components/layout/Navbar.vue';
import { IconTicket, IconCalendar, IconUser } from '@tabler/icons-vue';

const tickets = ref([]);
const loading = ref(true);

const fetchTickets = async () => {
    try {
        const response = await axios.get('http://127.0.0.1:8000/api/v1/tickets');
        const result = response.data;
        // Paginated ýa-data massiw görnüşine görä alýarys
        tickets.value = result.data?.data || result.data || [];
    } catch (error) {
        console.error('Biletleri çekmekde ýalňyşlyk:', error);
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
            <header class="mb-8 text-center">
                <h1
                    class="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 inline-flex items-center justify-center gap-2">
                    <IconTicket :size="30" :stroke="2" /> Meniň Sargyt Eden Biletlerim
                </h1>
                <p class="text-gray-500 dark:text-gray-400 mt-2">Satyn alan ähli uçar biletleriňizi şu ýerden görüp
                    bilersiňiz</p>
            </header>

            <div v-if="loading" class="text-center text-gray-600 dark:text-gray-400 text-lg py-10">Ýüklenýär...</div>

            <div v-else-if="tickets.length === 0" class="text-center text-gray-500 dark:text-gray-400 py-16">
                <p class="text-xl">Häzirlikçe satyn alnan bilet ýok.</p>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div v-for="ticket in tickets" :key="ticket.id"
                    class="p-6 rounded-3xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-xl flex flex-col justify-between gap-4">

                    <div class="flex justify-between items-start">
                        <div>
                            <span
                                class="text-xs font-bold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                {{ ticket.ticket_code }}
                            </span>
                            <h3 class="text-xl font-extrabold mt-3 flex items-center gap-2">
                                {{ ticket.flight?.departure_airport?.code }} ➔ {{ ticket.flight?.arrival_airport?.code
                                }}
                            </h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400">
                                {{ ticket.flight?.departure_airport?.city }} ({{
                                    ticket.flight?.departure_airport?.country }}) — {{ ticket.flight?.arrival_airport?.city
                                }}
                            </p>
                        </div>
                        <div class="text-right">
                            <span class="text-2xl font-black text-indigo-600 dark:text-indigo-400">${{ ticket.price
                            }}</span>
                            <p
                                class="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1 uppercase tracking-wider">
                                {{ ticket.status }}</p>
                        </div>
                    </div>

                    <div
                        class="border-t border-gray-200 dark:border-gray-800 pt-4 flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <div class="flex items-center gap-2">
                            <IconUser :size="18" class="text-indigo-500" />
                            <span>Ýolagçy: <strong>{{ ticket.passenger?.first_name }} {{ ticket.passenger?.last_name
                            }}</strong></span>
                        </div>
                        <!-- Ugradyş we Geliş wagty bilelikde görkezilýär -->
                        <div class="flex items-center gap-2">
                            <IconCalendar :size="18" class="text-indigo-500" />
                            <span>Uçuş wagty: <strong>{{ ticket.flight?.departure_time }}</strong> ➔ <strong>{{
                                    ticket.flight?.arrival_time }}</strong></span>
                        </div>
                        <div class="flex items-center gap-2 mt-1">
                            <span class="text-xs font-semibold bg-gray-200 dark:bg-gray-800 px-2.5 py-1 rounded-lg">
                                Orun: {{ ticket.seat_number }}
                            </span>
                            <span
                                class="text-xs font-semibold bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 px-2.5 py-1 rounded-lg">
                                {{ ticket.flight?.airline }} — {{ ticket.flight?.flight_number }}
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    </div>
</template>