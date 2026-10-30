<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { IconMail } from '@tabler/icons-vue';

const props = defineProps({
    flight: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['cancel', 'booked', 'update-summary']);

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
    return Number(passengerCounts.adults) + Number(passengerCounts.children) + Number(passengerCounts.infants);
});

const totalPrice = computed(() => {
    const basePrice = Number(props.flight.price) || 0;

    const adultTotal = passengerCounts.adults * basePrice;

    const childTotal = passengerCounts.children * (basePrice * 0.75);

    let extraInfants = 0;
    if (passengerCounts.infants > 1) {
        if (passengerCounts.infants > passengerCounts.adults) {
            extraInfants = passengerCounts.infants - Math.max(1, passengerCounts.adults);
        }
    }
    const infantTotal = extraInfants * (basePrice * 0.75);

    return (adultTotal + childTotal + infantTotal).toFixed(2);
});

watch([totalPrice, totalPassengers], () => {
    emit('update-summary', {
        totalPrice: totalPrice.value,
        totalPassengers: totalPassengers.value
    });
}, { immediate: true });

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

const incrementPassenger = (type) => {
    if (totalPassengers.value >= props.flight.available_seats) {
        errorMessage.value = `Bagyşlaň, bu uçuşda diňe ${props.flight.available_seats} sany boş ýer galdy!`;
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

const handleBooking = async () => {
    for (let i = 0; i < passengers.value.length; i++) {
        const p = passengers.value[i];
        if (!p.first_name || !p.last_name || !p.passport_number) {
            errorMessage.value = `${i + 1}-nji ýolagçynyň adyny, familiýasyny we pasport belgisini dolduryň!`;
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
                flight_id: props.flight.id,
                passengers: passengers.value,
                total_price: totalPrice.value
            })
        });
        const data = await response.json();
        if (response.ok && data.success) {
            successMessage.value = `Ähli biletler üstünlikli sargyt edildi!`;
            props.flight.available_seats -= totalPassengers.value;
            emit('booked', data);
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
    <div
        class="mt-2 pt-5 border-t border-white/40 dark:border-white/10 bg-white/30 dark:bg-gray-800/30 p-6 rounded-3xl backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]">

        <h3 class="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span>👥</span> Ýolagçy sanyny saýlaň
        </h3>

        <div
            class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-white/40 dark:bg-gray-900/40 rounded-2xl backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-sm">
            <div class="flex justify-between items-center">
                <div>
                    <div class="text-sm font-bold text-gray-900 dark:text-white">Ulylar</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">12 ýaşdan uly (%100)</div>
                </div>
                <div class="flex items-center gap-3">
                    <button @click="decrementPassenger('adults')" type="button"
                        class="w-9 h-9 rounded-xl bg-white/70 dark:bg-gray-800/70 font-bold text-gray-800 dark:text-white flex items-center justify-center border border-white/80 dark:border-white/10 shadow-sm cursor-pointer">-</button>
                    <span class="font-bold text-gray-900 dark:text-white w-4 text-center">{{ passengerCounts.adults
                        }}</span>
                    <button @click="incrementPassenger('adults')" type="button"
                        class="w-9 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold text-white flex items-center justify-center shadow-md cursor-pointer">+</button>
                </div>
            </div>

            <div class="flex justify-between items-center">
                <div>
                    <div class="text-sm font-bold text-gray-900 dark:text-white">Çagalar</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">5-12 ýaş (%75 baha)</div>
                </div>
                <div class="flex items-center gap-3">
                    <button @click="decrementPassenger('children')" type="button"
                        class="w-9 h-9 rounded-xl bg-white/70 dark:bg-gray-800/70 font-bold text-gray-800 dark:text-white flex items-center justify-center border border-white/80 dark:border-white/10 shadow-sm cursor-pointer">-</button>
                    <span class="font-bold text-gray-900 dark:text-white w-4 text-center">{{ passengerCounts.children
                        }}</span>
                    <button @click="incrementPassenger('children')" type="button"
                        class="w-9 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold text-white flex items-center justify-center shadow-md cursor-pointer">+</button>
                </div>
            </div>

            <div class="flex justify-between items-center">
                <div>
                    <div class="text-sm font-bold text-gray-900 dark:text-white">Bäbekler</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">1-nji bäbek mugt, ulydan köp bolsa %75</div>
                </div>
                <div class="flex items-center gap-3">
                    <button @click="decrementPassenger('infants')" type="button"
                        class="w-9 h-9 rounded-xl bg-white/70 dark:bg-gray-800/70 font-bold text-gray-800 dark:text-white flex items-center justify-center border border-white/80 dark:border-white/10 shadow-sm cursor-pointer">-</button>
                    <span class="font-bold text-gray-900 dark:text-white w-4 text-center">{{ passengerCounts.infants
                        }}</span>
                    <button @click="incrementPassenger('infants')" type="button"
                        class="w-9 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold text-white flex items-center justify-center shadow-md cursor-pointer">+</button>
                </div>
            </div>
        </div>

        <h3 class="text-base font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <span>📝</span> Ýolagçy maglumatlaryny dolduryň
        </h3>

        <div v-if="successMessage"
            class="mb-4 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
            {{ successMessage }}
        </div>
        <div v-if="errorMessage"
            class="mb-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-semibold">
            {{ errorMessage }}
        </div>

        <div v-if="!successMessage" class="space-y-4 mb-4">
            <div v-for="(p, index) in passengers" :key="index"
                class="p-5 rounded-2xl bg-white/50 dark:bg-gray-900/50 border border-white/60 dark:border-white/10 shadow-sm">
                <div class="text-xs font-bold uppercase text-indigo-600 dark:text-indigo-400 mb-3 tracking-wider">
                    {{ index + 1 }}-nji Ýolagçy ({{ p.type === 'adult' ? 'Uly adam' : (p.type === 'child' ? 'Çaga' :
                        'Bäbek') }})
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label
                            class="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase mb-1">Adyňyz</label>
                        <input type="text" v-model="p.first_name" placeholder="Ady"
                            class="w-full border border-white/60 dark:border-white/10 rounded-2xl p-3 text-sm bg-white/60 dark:bg-gray-900/60 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>

                    <div>
                        <label
                            class="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase mb-1">Familiýaňyz</label>
                        <input type="text" v-model="p.last_name" placeholder="Familiýasy"
                            class="w-full border border-white/60 dark:border-white/10 rounded-2xl p-3 text-sm bg-white/60 dark:bg-gray-900/60 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>

                    <template v-if="p.type === 'adult'">
                        <div>
                            <label
                                class="flex text-xs font-bold text-gray-600 dark:text-gray-300 uppercase mb-1 items-center gap-1">
                                <IconMail :size="16" :stroke="2" /> Email Poçta
                            </label>
                            <input type="email" v-model="p.email" placeholder="example@gmail.com"
                                class="w-full border border-white/60 dark:border-white/10 rounded-2xl p-3 text-sm bg-white/60 dark:bg-gray-900/60 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div>
                            <label
                                class="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase mb-1">Telefon
                                Belgisi</label>
                            <input type="text" v-model="p.phone" placeholder="+99365000000"
                                class="w-full border border-white/60 dark:border-white/10 rounded-2xl p-3 text-sm bg-white/60 dark:bg-gray-900/60 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                    </template>

                    <div class="md:col-span-2">
                        <label class="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase mb-1">
                            {{ p.type === 'adult' ? 'Pasport Belgisi' : 'Dogluş Şahadatnamasy / Pasport Belgisi' }}
                        </label>
                        <input type="text" v-model="p.passport_number" placeholder="Belgini giriziň"
                            class="w-full border border-white/60 dark:border-white/10 rounded-2xl p-3 text-sm bg-white/60 dark:bg-gray-900/60 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                </div>
            </div>
        </div>

        <div v-if="!successMessage" class="flex justify-end gap-3 pt-2">
            <button @click="$emit('cancel')" type="button"
                class="px-5 py-2.5 rounded-2xl text-sm font-semibold text-gray-800 dark:text-gray-200 bg-white/70 hover:bg-white/90 dark:bg-gray-800/60 border border-gray-200 dark:border-white/10 cursor-pointer">
                Cancel
            </button>

            <button @click="handleBooking" :disabled="isSubmitting" type="button"
                class="px-6 py-2.5 rounded-2xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg cursor-pointer disabled:opacity-50">
                <span v-if="isSubmitting">Loading...</span>
                <span v-else>Confirm & Book Tickets</span>
            </button>
        </div>

    </div>
</template>