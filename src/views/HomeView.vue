<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Navbar from '../components/layout/Navbar.vue';
import FlightSearch from '../components/common/FlightSearch.vue';
import FlightList from '../components/common/FlightList.vue';
import { IconPlane, IconChevronLeft, IconChevronRight } from '@tabler/icons-vue';

const flights = ref([]);
const filteredFlights = ref([]);
const airports = ref([]);
const loading = ref(true);

const pagination = ref({
    current_page: 1,
    last_page: 1,
    prev_page_url: null,
    next_page_url: null,
    total: 0
});

const searchForm = ref({
    departure_airport_id: '',
    arrival_airport_id: '',
    date: ''
});

const fetchData = async (page = 1) => {
    loading.value = true;
    try {
        const [flightRes, airportRes] = await Promise.all([
            axios.get(`http://127.0.0.1:8000/api/v1/flights?page=${page}`),
            axios.get('http://127.0.0.1:8000/api/v1/airports')
        ]);

        const responseData = flightRes.data;

        if (responseData && responseData.success && responseData.data) {
            const paginated = responseData.data;

            flights.value = paginated.data || [];
            filteredFlights.value = flights.value;

            pagination.value = {
                current_page: paginated.current_page || 1,
                last_page: paginated.last_page || 1,
                prev_page_url: paginated.prev_page_url || null,
                next_page_url: paginated.next_page_url || null,
                total: paginated.total || 0
            };
        }

        const airportData = airportRes.data;
        airports.value = Array.isArray(airportData)
            ? airportData
            : (airportData.data?.data || airportData.data || []);

    } catch (error) {
        console.error('Maglumat çekmekde ýalňyşlyk:', error);
    } finally {
        loading.value = false;
    }
};

const handleSearch = () => {
    filteredFlights.value = flights.value.filter(flight => {
        const matchesDep = searchForm.value.departure_airport_id
            ? flight.departure_airport_id === Number(searchForm.value.departure_airport_id)
            : true;

        const matchesArr = searchForm.value.arrival_airport_id
            ? flight.arrival_airport_id === Number(searchForm.value.arrival_airport_id)
            : true;

        const flightDate = flight.departure_time ? flight.departure_time.split(' ')[0] : '';
        const matchesDate = searchForm.value.date
            ? flightDate === searchForm.value.date
            : true;

        return matchesDep && matchesArr && matchesDate;
    });
};

const changePage = (page) => {
    if (page >= 1 && page <= pagination.value.last_page) {
        fetchData(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

onMounted(() => {
    fetchData(1);
});
</script>

<template>
    <div
        class="min-h-screen bg-gray-100/80 dark:bg-gray-950 text-gray-800 dark:text-gray-100 transition-colors duration-300">

        <Navbar />

        <main class="max-w-7xl mx-auto px-4 py-8">
            <header class="mb-8 text-center">
                <h1
                    class="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 pt-6 inline-flex items-center justify-center gap-2">
                    <IconPlane :size="30" :stroke="2" /> Gezegen
                </h1>
                <p class="text-gray-500 dark:text-gray-400 mt-2">Iň oňaýly uçar biletlerini gözläň we tapyň</p>
            </header>

            <FlightSearch :airports="airports" :searchForm="searchForm" @search="handleSearch" />

            <div v-if="loading" class="text-center text-gray-600 dark:text-gray-400 text-lg py-10">Loading...</div>

            <template v-else>
                <FlightList :flights="filteredFlights" />

                <div v-if="pagination.last_page > 1" class="mt-5 pt-5 flex flex-col items-end justify-end gap-4">

                    <div
                        class="flex items-center justify-center gap-2 flex-wrap p-3 rounded-full bg-white/60 dark:bg-gray-900/40 backdrop-blur-2xl border border-white/80 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)]">

                        <button @click="changePage(pagination.current_page - 1)"
                            :disabled="pagination.current_page <= 1"
                            class="w-10 h-10 rounded-2xl bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl border border-white dark:border-white/10 text-gray-800 dark:text-gray-200 font-bold shadow-sm hover:bg-white dark:hover:bg-gray-700 hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer flex items-center justify-center">
                            <IconChevronLeft :size="20" />
                        </button>

                        <button v-for="page in pagination.last_page" :key="page" @click="changePage(page)" :class="[
                            'w-10 h-10 rounded-full font-bold text-sm backdrop-blur-xl border transition-all duration-300 flex items-center justify-center cursor-pointer shadow-sm hover:scale-105 active:scale-95',
                            pagination.current_page === page
                                ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/30 scale-105'
                                : 'bg-white/80 dark:bg-gray-800/60 text-gray-800 dark:text-gray-200 border-white dark:border-white/10 hover:bg-white dark:hover:bg-gray-700'
                        ]">
                            {{ page }}
                        </button>

                        <button @click="changePage(pagination.current_page + 1)"
                            :disabled="pagination.current_page >= pagination.last_page"
                            class="w-10 h-10 rounded-full bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl border border-white dark:border-white/10 text-gray-800 dark:text-gray-200 font-bold shadow-sm hover:bg-white dark:hover:bg-gray-700 hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer flex items-center justify-center">
                            <IconChevronRight :size="20" />
                        </button>

                    </div>
                </div>
            </template>
        </main>

    </div>
</template>