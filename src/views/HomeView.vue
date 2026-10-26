<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Navbar from '../components/layout/Navbar.vue';
import FlightSearch from '../components/common/FlightSearch.vue';
import FlightList from '../components/common/FlightList.vue';
import { IconPlane } from '@tabler/icons-vue';

const flights = ref([]);
const filteredFlights = ref([]);
const airports = ref([]);
const loading = ref(true);

const searchForm = ref({
    departure_airport_id: '',
    arrival_airport_id: '',
    date: ''
});

const fetchData = async () => {
    try {
        const [flightRes, airportRes] = await Promise.all([
            axios.get('http://127.0.0.1:8000/api/v1/flights'),
            axios.get('http://127.0.0.1:8000/api/v1/airports')
        ]);

        const flightData = flightRes.data;
        flights.value = flightData.data?.data || flightData.data || flightData;
        filteredFlights.value = flights.value;

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

onMounted(() => {
    fetchData();
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

            <FlightList v-else :flights="filteredFlights" />
        </main>

    </div>
</template>