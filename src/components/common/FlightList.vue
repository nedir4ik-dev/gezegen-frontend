<script setup>
import { ref } from 'vue';
import BookingForm from './BookingForm.vue';

defineProps({
    flights: {
        type: Array,
        default: () => []
    }
});

const selectedFlightId = ref(null);

const toggleSelectFlight = (flightId) => {
    if (selectedFlightId.value === flightId) {
        selectedFlightId.value = null;
    } else {
        selectedFlightId.value = flightId;
    }
};
</script>

<template>
    <div>
        <div v-if="flights.length === 0"
            class="text-center text-gray-500 dark:text-gray-400 py-12 bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl rounded-3xl border border-white/40 dark:border-white/10 shadow-sm">
            Saýlanan şertlere görä hiç hili uçar tapylmady.
        </div>

        <div v-else class="grid gap-6">
            <div v-for="flight in flights" :key="flight.id"
                class="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-white/60 dark:border-white/10 flex flex-col gap-5 transition-all duration-300">

                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div class="flex items-center gap-2">
                            <span
                                class="text-xs font-bold uppercase bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-3.5 py-1 rounded-full border border-indigo-500/20">
                                {{ flight.flight_number }}
                            </span>
                            <span
                                class="text-xs font-medium px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                {{ flight.status }}
                            </span>
                        </div>

                        <div class="mt-3 text-xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
                            <span>{{ flight.departure_airport?.city }} <span
                                    class="text-gray-500 dark:text-gray-400 text-base font-normal">({{
                                    flight.departure_airport?.code }})</span></span>
                            <span class="text-indigo-500 font-bold">➔</span>
                            <span>{{ flight.arrival_airport?.city }} <span
                                    class="text-gray-500 dark:text-gray-400 text-base font-normal">({{
                                    flight.arrival_airport?.code }})</span></span>
                        </div>

                        <div class="text-sm text-gray-600 dark:text-gray-300 mt-2 flex flex-wrap gap-4">
                            <div>Ugraýan ýerli wagt: <span class="font-semibold text-gray-900 dark:text-white">{{
                                flight.formatted_times?.departure_local }}</span></div>
                            <div>Barýan ýerli wagt: <span class="font-semibold text-gray-900 dark:text-white">{{
                                flight.formatted_times?.arrival_local }}</span></div>
                        </div>
                    </div>

                    <div
                        class="text-left md:text-right w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-white/40 dark:border-white/10 flex md:flex-col justify-between items-center md:items-end gap-3">
                        <div>
                            <span class="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                                ${{ flight.price }}
                            </span>
                            <div class="text-xs text-gray-500 dark:text-gray-400">Baza baha</div>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-xs text-gray-500 dark:text-gray-400">Boş ýer:</span>
                            <span
                                class="text-xs font-bold px-2.5 py-1 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-white/50 dark:border-white/10 text-gray-800 dark:text-gray-200">
                                {{ flight.available_seats }}
                            </span>
                        </div>

                        <button @click="toggleSelectFlight(flight.id)" :disabled="flight.available_seats <= 0"
                            class="px-5 py-2.5 rounded-2xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all cursor-pointer disabled:opacity-50">
                            {{ selectedFlightId === flight.id ? 'Cancel' : 'Select Flight' }}
                        </button>
                    </div>
                </div>

                <BookingForm v-if="selectedFlightId === flight.id" :flight="flight"
                    @cancel="toggleSelectFlight(flight.id)" />

            </div>
        </div>
    </div>
</template>