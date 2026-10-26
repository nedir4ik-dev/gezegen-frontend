<script setup>
import { IconMail } from '@tabler/icons-vue';
import { ref, reactive, computed } from 'vue';

const props = defineProps({
    flights: Array
});

const selectedFlightId = ref(null);

const passengerCounts = reactive({
    adults: 1,
    children: 0,
    infants: 0
});

const passengers = ref([
    { type: 'adult', first_name: '', last_name: '', email: '', phone: '', passport_number: '' }
]);

const isSubmitting = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const totalPassengers = computed(() => {
    return passengerCounts.adults + passengerCounts.children + passengerCounts.infants;
});

// Bäbek Logikasy: Her uly adam üçin 1 bäbek mugt, artykmaç bäbekler çaga bahasyndan (%75)
const calculateTotalPrice = (basePrice) => {
    const freeInfants = Math.min(passengerCounts.infants, passengerCounts.adults);
    const paidInfants = passengerCounts.infants - freeInfants;
    const totalChildRatePassengers = passengerCounts.children + paidInfants;

    let total = (passengerCounts.adults * basePrice) +
        (totalChildRatePassengers * (basePrice * 0.75));

    return total.toFixed(2);
};

const syncPassengersArray = () => {
    let current = [...passengers.value];
    let updated = [];

    const syncType = (type, count) => {
        let existing = current.filter(p => p.type === type);
        for (let i = 0; i < count; i++) {
            if (existing[i]) {
                updated.push(existing[i]);
            } else {
                updated.push({
                    type: type,
                    first_name: '',
                    last_name: '',
                    email: type === 'adult' ? '' : undefined,
                    phone: type === 'adult' ? '' : undefined,
                    passport_number: ''
                });
            }
        }
    };

    syncType('adult', passengerCounts.adults);
    syncType('child', passengerCounts.children);
    syncType('infant', passengerCounts.infants);

    passengers.value = updated;
};

const incrementPassenger = (type, flight) => {
    if (totalPassengers.value >= flight.available_seats) {
        errorMessage.value = `Bagyşlaň, bu uçuşda diňe ${flight.available_seats} sany boş ýer galdy!`;
        return;
    }
    errorMessage.value = '';
    passengerCounts[type]++;
    syncPassengersArray();
};

const decrementPassenger = (type) => {
    if (type === 'adults' && passengerCounts.adults <= 1) return;
    if (type !== 'adults' && passengerCounts[type] <= 0) return;

    errorMessage.value = '';
    passengerCounts[type]--;
    syncPassengersArray();
};

const toggleSelectFlight = (flightId) => {
    if (selectedFlightId.value === flightId) {
        selectedFlightId.value = null;
    } else {
        selectedFlightId.value = flightId;
        successMessage.value = '';
        errorMessage.value = '';
        passengerCounts.adults = 1;
        passengerCounts.children = 0;
        passengerCounts.infants = 0;
        passengers.value = [
            { type: 'adult', first_name: '', last_name: '', email: '', phone: '', passport_number: '' }
        ];
    }
};

const handleBooking = async (flight) => {
    for (let i = 0; i < passengers.value.length; i++) {
        const p = passengers.value[i];
        if (!p.first_name || !p.last_name || !p.passport_number) {
            errorMessage.value = `${i + 1}-nji ýolagçynyň adyny, familiýasyny we pasport/şahadatnama belgisini dolduryň!`;
            return;
        }
        if (p.type === 'adult' && (!p.email || !p.phone)) {
            errorMessage.value = `${i + 1}-nji uly ýolagçynyň email we telefon belgisini dolduryň!`;
            return;
        }
    }
    isSubmitting.value = true;
    errorMessage.value = '';
    try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                flight_id: flight.id,
                passengers: passengers.value
            })
        });
        const data = await response.json();
        if (response.ok && data.success) {
            successMessage.value = `Ähli biletler üstünlikli sargyt edildi!`;
            flight.available_seats -= totalPassengers.value;
        } else {
            errorMessage.value = data.message || 'Sargyt etmekde ýalňyşlyk çykdy.';
        }
    } catch (err) {
        console.error('Booking Error:', err);
        errorMessage.value = 'Backend serwere baglanyp bolmady.';
    } finally {
        isSubmitting.value = false;
    }
};
</script>

<template>
    <div>
        <!-- Uçar tapylmadyk ýagdaýy -->
        <div v-if="flights.length === 0"
            class="text-center text-gray-500 dark:text-gray-400 py-12 bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl rounded-3xl border border-white/40 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]">
            Saýlanan şertlere görä hiç hili uçar tapylmady.
        </div>

        <div v-else class="grid gap-6">
            <div v-for="flight in flights" :key="flight.id"
                class="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl p-6 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/60 dark:border-white/10 flex flex-col gap-5 transition-all duration-300 hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]">

                <!-- Uçuş maglumaty -->
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div class="flex items-center gap-2">
                            <span
                                class="text-xs font-bold uppercase bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-3.5 py-1 rounded-full border border-indigo-500/20 backdrop-blur-md">
                                {{ flight.flight_number }}
                            </span>
                            <span
                                class="text-xs font-medium px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 backdrop-blur-md">
                                {{ flight.status }}
                            </span>
                        </div>

                        <div
                            class="mt-3 text-xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3 drop-shadow-sm">
                            <span>{{ flight.departure_airport?.city }} <span
                                    class="text-gray-500 dark:text-gray-400 text-base font-normal">({{
                                        flight.departure_airport?.code
                                    }})</span></span>
                            <span class="text-indigo-500 font-bold">➔</span>
                            <span>{{ flight.arrival_airport?.city }} <span
                                    class="text-gray-500 dark:text-gray-400 text-base font-normal">({{
                                        flight.arrival_airport?.code
                                    }})</span></span>
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
                            <span class="text-2xl font-black text-indigo-600 dark:text-indigo-400 drop-shadow-sm">
                                ${{ calculateTotalPrice(flight.price) }}
                            </span>
                            <div class="text-xs text-gray-500 dark:text-gray-400">Jemi baha ({{ totalPassengers }}
                                ýolagçy)</div>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-xs text-gray-500 dark:text-gray-400">Boş ýer:</span>
                            <span
                                class="text-xs font-bold px-2.5 py-1 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-md border border-white/50 dark:border-white/10 text-gray-800 dark:text-gray-200">
                                {{ flight.available_seats }}
                            </span>
                        </div>

                        <button @click="toggleSelectFlight(flight.id)" :disabled="flight.available_seats <= 0"
                            class="px-5 py-2.5 rounded-2xl text-sm font-bold text-white bg-indigo-600/90 hover:bg-indigo-600 backdrop-blur-md shadow-[0_4px_20px_rgba(79,70,229,0.4)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer border border-indigo-400/30">
                            {{ selectedFlightId === flight.id ? 'Cancel' : 'Select Flight' }}
                        </button>
                    </div>
                </div>

                <!-- EXPANDABLE FORM: Ýolagçy Sany we Maglumatlary -->
                <div v-if="selectedFlightId === flight.id"
                    class="mt-2 pt-5 border-t border-white/40 dark:border-white/10 bg-white/30 dark:bg-gray-800/30 p-6 rounded-3xl backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]">

                    <h3 class="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <span>👥</span> Ýolagçy sanyny saýlaň
                    </h3>

                    <!-- Ýolagçy sanyny saýlaýan paneller (+ / -) -->
                    <div
                        class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-white/40 dark:bg-gray-900/40 rounded-2xl backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-sm">

                        <!-- Ulylar -->
                        <div class="flex justify-between items-center">
                            <div>
                                <div class="text-sm font-bold text-gray-900 dark:text-white">Ulylar</div>
                                <div class="text-xs text-gray-500 dark:text-gray-400">12 ýaşdan uly (%100)</div>
                            </div>
                            <div class="flex items-center gap-3">
                                <button @click="decrementPassenger('adults')"
                                    class="w-9 h-9 rounded-xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-md font-bold text-gray-800 dark:text-white flex items-center justify-center border border-white/80 dark:border-white/10 shadow-sm hover:bg-white dark:hover:bg-gray-700 transition active:scale-95 cursor-pointer">-</button>
                                <span class="font-bold text-gray-900 dark:text-white w-4 text-center">{{
                                    passengerCounts.adults }}</span>
                                <button @click="incrementPassenger('adults', flight)"
                                    class="w-9 h-9 rounded-xl bg-indigo-600/90 hover:bg-indigo-600 backdrop-blur-md font-bold text-white flex items-center justify-center shadow-[0_2px_10px_rgba(79,70,229,0.3)] transition active:scale-95 cursor-pointer border border-indigo-400/30">+</button>
                            </div>
                        </div>

                        <!-- Çagalar -->
                        <div class="flex justify-between items-center">
                            <div>
                                <div class="text-sm font-bold text-gray-900 dark:text-white">Çagalar</div>
                                <div class="text-xs text-gray-500 dark:text-gray-400">5-12 ýaş (%75 baha)</div>
                            </div>
                            <div class="flex items-center gap-3">
                                <button @click="decrementPassenger('children')"
                                    class="w-9 h-9 rounded-xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-md font-bold text-gray-800 dark:text-white flex items-center justify-center border border-white/80 dark:border-white/10 shadow-sm hover:bg-white dark:hover:bg-gray-700 transition active:scale-95 cursor-pointer">-</button>
                                <span class="font-bold text-gray-900 dark:text-white w-4 text-center">{{
                                    passengerCounts.children }}</span>
                                <button @click="incrementPassenger('children', flight)"
                                    class="w-9 h-9 rounded-xl bg-indigo-600/90 hover:bg-indigo-600 backdrop-blur-md font-bold text-white flex items-center justify-center shadow-[0_2px_10px_rgba(79,70,229,0.3)] transition active:scale-95 cursor-pointer border border-indigo-400/30">+</button>
                            </div>
                        </div>

                        <!-- Bäbekler -->
                        <div class="flex justify-between items-center">
                            <div>
                                <div class="text-sm font-bold text-gray-900 dark:text-white">Bäbekler</div>
                                <div class="text-xs text-gray-500 dark:text-gray-400">1-nji bäbek mugt, artykmaç %75
                                </div>
                            </div>
                            <div class="flex items-center gap-3">
                                <button @click="decrementPassenger('infants')"
                                    class="w-9 h-9 rounded-xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-md font-bold text-gray-800 dark:text-white flex items-center justify-center border border-white/80 dark:border-white/10 shadow-sm hover:bg-white dark:hover:bg-gray-700 transition active:scale-95 cursor-pointer">-</button>
                                <span class="font-bold text-gray-900 dark:text-white w-4 text-center">{{
                                    passengerCounts.infants }}</span>
                                <button @click="incrementPassenger('infants', flight)"
                                    class="w-9 h-9 rounded-xl bg-indigo-600/90 hover:bg-indigo-600 backdrop-blur-md font-bold text-white flex items-center justify-center shadow-[0_2px_10px_rgba(79,70,229,0.3)] transition active:scale-95 cursor-pointer border border-indigo-400/30">+</button>
                            </div>
                        </div>
                    </div>

                    <h3 class="text-base font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <span>📝</span> Ýolagçy maglumatlaryny dolduryň
                    </h3>

                    <!-- Status habarlary -->
                    <div v-if="successMessage"
                        class="mb-4 p-4 rounded-2xl bg-emerald-500/10 backdrop-blur-xl border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-semibold shadow-sm">
                        {{ successMessage }}
                    </div>
                    <div v-if="errorMessage"
                        class="mb-4 p-4 rounded-2xl bg-red-500/10 backdrop-blur-xl border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-semibold shadow-sm">
                        {{ errorMessage }}
                    </div>

                    <!-- Dinamiki Ýolagçy Formasy -->
                    <div v-if="!successMessage" class="space-y-4 mb-4">
                        <div v-for="(p, index) in passengers" :key="index"
                            class="p-5 rounded-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-sm">
                            <div
                                class="text-xs font-bold uppercase text-indigo-600 dark:text-indigo-400 mb-3 tracking-wider">
                                {{ index + 1 }}-nji Ýolagçy ({{ p.type === 'adult' ? 'Uly adam' : (p.type === 'child' ?
                                    'Çaga' : 'Bäbek') }})
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label
                                        class="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase mb-1">Adyňyz</label>
                                    <input type="text" v-model="p.first_name" placeholder="Ady"
                                        class="w-full border border-white/60 dark:border-white/10 rounded-2xl p-3 text-sm bg-white/60 dark:bg-gray-900/60 backdrop-blur-md text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition shadow-inner" />
                                </div>

                                <div>
                                    <label
                                        class="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase mb-1">Familiýaňyz</label>
                                    <input type="text" v-model="p.last_name" placeholder="Familiýasy"
                                        class="w-full border border-white/60 dark:border-white/10 rounded-2xl p-3 text-sm bg-white/60 dark:bg-gray-900/60 backdrop-blur-md text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition shadow-inner" />
                                </div>

                                <template v-if="p.type === 'adult'">
                                    <div>
                                        <label
                                            class="flex text-xs font-bold text-gray-600 dark:text-gray-300 uppercase mb-1 items-center gap-1">
                                            <IconMail size="16" stroke="2" /> Email Poçta
                                        </label>
                                        <input type="email" v-model="p.email" placeholder="example@gmail.com"
                                            class="w-full border border-white/60 dark:border-white/10 rounded-2xl p-3 text-sm bg-white/60 dark:bg-gray-900/60 backdrop-blur-md text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition shadow-inner" />
                                    </div>
                                    <div>
                                        <label
                                            class="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase mb-1">Telefon
                                            Belgisi</label>
                                        <input type="text" v-model="p.phone" placeholder="+99365000000"
                                            class="w-full border border-white/60 dark:border-white/10 rounded-2xl p-3 text-sm bg-white/60 dark:bg-gray-900/60 backdrop-blur-md text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition shadow-inner" />
                                    </div>
                                </template>

                                <div :class="p.type === 'adult' ? 'md:col-span-2' : 'md:col-span-2'">
                                    <label
                                        class="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase mb-1">
                                        {{ p.type === 'adult' ? 'Pasport Belgisi' : 'Dogluş Şahadatnamasy / Pasport Belgisi' }}
                                    </label>
                                    <input type="text" v-model="p.passport_number" placeholder="Belgini giriziň"
                                        class="w-full border border-white/60 dark:border-white/10 rounded-2xl p-3 text-sm bg-white/60 dark:bg-gray-900/60 backdrop-blur-md text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition shadow-inner" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Tassyklamak düwmeleri -->
                    <div v-if="!successMessage" class="flex justify-end gap-3 pt-2">
                        <button @click="toggleSelectFlight(flight.id)" type="button"
                            class="px-5 py-2.5 rounded-2xl text-sm font-semibold text-gray-800 dark:text-gray-200 bg-white/70 hover:bg-white/90 dark:bg-gray-800/60 dark:hover:bg-gray-700/80 backdrop-blur-md border border-gray-200/80 dark:border-white/10 shadow-sm transition-all duration-200 cursor-pointer">
                            Ýatyr
                        </button>

                        <button @click="handleBooking(flight)" :disabled="isSubmitting" type="button"
                            class="px-6 py-2.5 rounded-2xl text-sm font-bold text-white bg-emerald-600/90 hover:bg-emerald-600 backdrop-blur-md shadow-[0_4px_20px_rgba(5,150,105,0.4)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 cursor-pointer disabled:opacity-50 border border-emerald-400/30">
                            <span v-if="isSubmitting">Loading...</span>
                            <span v-else>Confirm & Book Tickets</span>
                        </button>
                    </div>

                </div>

            </div>
        </div>
    </div>
</template>