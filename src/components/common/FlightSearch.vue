<script setup>
import { ref, computed } from 'vue';
import { IconSearch, IconRotateDot } from '@tabler/icons-vue';

const props = defineProps({
    airports: {
        type: Array,
        default: () => []
    },
    searchForm: {
        type: Object,
        default: () => ({ departure_airport_id: '', arrival_airport_id: '', date: '' })
    }
});

const emit = defineEmits(['search']);
const localError = ref('');

const availableArrivalAirports = computed(() => {
    if (!props.airports || !Array.isArray(props.airports)) return [];

    if (!props.searchForm?.departure_airport_id) {
        return props.airports;
    }

    return props.airports.filter(
        airport => airport.id !== props.searchForm.departure_airport_id
    );
});

const handleDepartureChange = () => {
    if (props.searchForm?.departure_airport_id &&
        props.searchForm.departure_airport_id === props.searchForm.arrival_airport_id) {
        props.searchForm.arrival_airport_id = '';
    }
    localError.value = '';
};

const resetFilters = () => {
    if (props.searchForm) {
        props.searchForm.departure_airport_id = '';
        props.searchForm.arrival_airport_id = '';
        props.searchForm.date = '';
    }
    localError.value = '';
    emit('search');
};

const handleSearchClick = () => {
    localError.value = '';
    emit('search');
};
</script>

<template>
    <div
        class="bg-white/30 dark:bg-gray-900/30 backdrop-blur-md p-6 rounded-2xl shadow-lg shadow-gray-200/40 dark:shadow-gray-900/50 border border-gray-300/80 dark:border-gray-700/80 mb-8 transition-all duration-300">

        <div v-if="localError"
            class="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-semibold">
            {{ localError }}
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">

            <div>
                <label class="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase mb-1">
                    From (Ugraýan)
                </label>
                <select v-model="searchForm.departure_airport_id" @change="handleDepartureChange"
                    class="w-full border border-gray-300/80 dark:border-gray-700 rounded-xl p-2.5 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-colors cursor-pointer">
                    <option value="">Ähli howa menzilleri</option>
                    <option v-for="airport in airports" :key="airport.id" :value="airport.id">
                        {{ airport.city }} ({{ airport.code }})
                    </option>
                </select>
            </div>

            <div>
                <label class="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase mb-1">
                    To (Barýan)
                </label>
                <select v-model="searchForm.arrival_airport_id"
                    class="w-full border border-gray-300/80 dark:border-gray-700 rounded-xl p-2.5 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-colors cursor-pointer">
                    <option value="">Ähli howa menzilleri</option>
                    <option v-for="airport in availableArrivalAirports" :key="airport.id" :value="airport.id">
                        {{ airport.city }} ({{ airport.code }})
                    </option>
                </select>
            </div>

            <div>
                <label class="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase mb-1">Date</label>
                <input type="date" v-model="searchForm.date"
                    class="w-full border border-gray-300/80 dark:border-gray-700 rounded-xl p-2.5 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-colors" />
            </div>

        </div>

        <div class="flex flex-col sm:flex-row gap-3">
            <button @click="handleSearchClick"
                class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 cursor-pointer">
                <IconSearch stroke="1.5" size="20" /> Search Flights
            </button>

            <button v-if="searchForm?.departure_airport_id || searchForm?.arrival_airport_id || searchForm?.date"
                @click="resetFilters" type="button"
                class="px-5 py-3 bg-gray-200/80 hover:bg-gray-300/80 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-xl transition duration-200 flex items-center justify-center gap-2 cursor-pointer">
                <IconRotateDot stroke="1.5" size="18" /> Reset
            </button>
        </div>
    </div>
</template>