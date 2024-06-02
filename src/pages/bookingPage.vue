<template>
  <div class="max-h-screen overflow-y-auto p-6">
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-semibold mb-6">Your Bookings</h2>

      <div v-if="bookings.length > 0">
        <ul>
          <li v-for="(booking, index) in bookings" :key="index" class="border-b border-gray-200 py-4">
            <div>
              <p class="text-lg font-semibold mb-2" v-if="campsiteTitles[booking.campsiteId]">Campsite: {{ campsiteTitles[booking.campsiteId] }}</p>
              <p class="text-gray-600 mb-2" v-else>Campsite: Loading...</p>
              
              <p class="text-gray-600">Booking ID: {{ booking.id }}</p>
              <p class="text-gray-600">Check-In: {{ formatDate(booking.checkInDate) }}</p>
              <p class="text-gray-600">Check-Out: {{ formatDate(booking.checkOutDate) }}</p>
              <p class="text-gray-600">Total Nights: {{ booking.totalNights }}</p>
              <p class="text-gray-600">Total Price: {{ booking.totalPrice }}</p>
              <p class="text-gray-600">Booked on: {{ booking.date }}</p>

              <!-- Cancel Button -->
              <button @click="confirmCancel(booking.id)" class="text-red-600 hover:underline mt-2">Cancel Booking</button>

              <!-- Confirmation Div
              <div v-if="cancellationPending === booking.id" class="mt-4 bg-white border border-gray-200 rounded-lg shadow-md p-6">
                <p class="text-red-600 mb-4">Are you sure you want to cancel this booking?</p>
                <div class="flex justify-end space-x-4">
                  <button @click="cancelBooking(booking.id)" class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">Yes</button>
                  <button @click="cancellationPending = null" class="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">No</button>
                </div>
              </div> -->



              <!-- Confirmation Modal -->
    <div v-if="cancellationPending === booking.id" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-4">Confirm Cancellation</h2>
        <p class="mb-4">Are you sure you want to cancel this booking?</p>
        <div class="flex justify-end space-x-4">
          <button @click="cancellationPending = null" class="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">No</button>
          <button @click="cancelBooking(booking.id)" class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">Cancel</button>
        </div>
      </div>
    </div>



            </div>
          </li>
        </ul>
      </div>

      <div v-else>
        <p class="text-lg text-gray-600">No bookings found for this user.</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      bookings: [],
      campsiteTitles: {},
      cancellationPending: null
    };
  },
  mounted() {
    this.fetchBookings();
  },
  methods: {
    async fetchBookings() {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const response = await axios.get(`https://localhost:43203/Booking/User/${user.id}`);
        this.bookings = response.data;
        await this.fetchCampsiteTitles();
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      }
    },
    async fetchCampsiteTitles() {
      try {
        for (const booking of this.bookings) {
          const response = await axios.get(`https://localhost:43203/Camping/${booking.campsiteId}`);
          this.$set(this.campsiteTitles, booking.campsiteId, response.data.title);
        }
      } catch (error) {
        console.error('Failed to fetch campsite titles:', error);
      }
    },
    formatDate(dateTimeString) {
      const date = new Date(dateTimeString);
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    },
    confirmCancel(bookingId) {
      this.cancellationPending = bookingId;
    },
    async cancelBooking(bookingId) {
      try {
        await axios.delete(`https://localhost:43203/Booking/${bookingId}`);
        this.bookings = this.bookings.filter(booking => booking.id !== bookingId);
        this.cancellationPending = null;
      } catch (error) {
        console.error('Failed to cancel booking:', error);
      }
    }
  }
};
</script>

<style scoped>
/* Add custom styles here if needed */
</style>
