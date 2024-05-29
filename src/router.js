import Vue from 'vue';
import Router from 'vue-router';

import Account from '@/pages/accountPage.vue';
import Admin from '@/pages/adminPage.vue';
import Booking from '@/pages/bookingPage.vue';
import Camping from '@/pages/campingPage.vue';
import Home from '@/pages/homePage.vue';
import Map from '@/pages/mapPage.vue';
import BookingSuccess from '@/pages/BookingSuccessPage.vue';


Vue.use(Router);

// Define a function to check if the user has the admin role
const isAdmin = () => {
  // Check if the isAdmin flag is set in localStorage
  const isAdminFlag = localStorage.getItem('isAdmin');
  // If isAdminFlag is true, return true; otherwise, return false
  return isAdminFlag === 'true';
};

const router = new Router({
  mode: 'history',
  routes: [
    { path: '/', name: 'Home', component: Home },
    { path: '/account', name: 'Account', component: Account },
    {
      path: '/bookCampers',
      name: 'bookcampers',
      component: () => import('@/pages/bookCamperPage.vue'),
      beforeEnter: (to, from, next) => {
        const selectedCamping = localStorage.getItem('selectedCamping'); 
        if (!selectedCamping || selectedCamping === 'null' || selectedCamping === 'undefined') {
          // Redirect to home if selectedCamping doesn't exist or is empty
          next('/');
        } else {
          // Proceed to the route
          next();
        }
        
      }
    },
    { path: '/bookings', name: 'Bookings', component: Booking },
    { path: '/camping', name: 'Camping', component: Camping },

    { path: '/map', name: 'Map', component: Map },

   
    // Secure the admin route with a route guard
    { 
      path: '/admin', 
      name: 'Admin', 
      component: Admin, 
      beforeEnter: (to, from, next) => {
        if (isAdmin()) {
          next();
        } else {
          next('/'); // Redirect to home if not authorized
        }
      }
    },
    { path: '/booking-success', name: 'booking-sucess', component: BookingSuccess },

  ]
});

export default router;
