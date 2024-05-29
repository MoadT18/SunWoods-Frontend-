<template>
    <div class="bg-gray-100 h-screen flex items-center justify-center overflow-hidden">
      <div class="bg-white shadow-md rounded-lg p-8 max-w-md mx-auto">
        <h2 class="text-2xl font-bold text-center mb-6">Booking Confirmation</h2>
        <p class="text-lg mb-4">Congratulations!</p>
        <p class="text-lg mb-4">You have successfully booked a camping spot.</p>
        <p class="text-lg mb-4">An overview of your booking has been sent to your email.</p>

        <br>
        <router-link to="/bookings" class="text-blue-600 hover:text-blue-800 underline">
          Go to bookings
        </router-link>
      </div>
    </div>
  </template>
  