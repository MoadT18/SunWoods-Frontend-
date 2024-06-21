<template>
  <div class="flex flex-col h-screen overflow-hidden">
    <div v-if="campingDetails" class="flex flex-col md:flex-row flex-1 overflow-hidden">
      <!-- Calendar Section -->
      <div class="w-full md:w-1/2 h-full overflow-y-auto md:overflow-hidden">
        <vc-date-picker
        is-range
        :value="selectedDates"
        :min-date="parsedAvailableFrom"
        :max-date="parsedAvailableTo"
        @input="handleDateSelection"
        
        style="margin-top: 50px; margin-left: 40px; width: 85%; height: 60%;"
      ></vc-date-picker>
      
      
        
        <div class="mt-8 text-center">
          <button v-if="formattedStartDate < formattedEndDate" 
            :disabled="bookingInProgress" 
            class="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition duration-300 ease-in-out" 
            @click="bookNow">
            <template v-if="!bookingInProgress">
              Book now!
            </template>
            <template v-else>
              Booking in progress...
            </template>
          </button>
        </div>
      </div>

      <!-- Details Section -->
      <div class="w-full md:w-1/2 h-6/7 border border-gray-300 p-3 md:p-6 overflow-y-auto">
        <h2 class="text-xl md:text-lg font-bold mb-2 md:mb-2">{{ campingDetails.title }}</h2>
        <h3 class="text-lg md:text-base mb-2 md:mb-2">{{ campingDetails.location }}</h3>
        <img v-if="campingDetails.imageURL" :src="getImageUrl(campingDetails.imageURL)" alt="Camping Image" class="w-full h-1/3 mb-2 md:mb-4 object-cover" />
        <p class="text-base md:text-base mb-2 md:mb-2">{{ campingDetails.description }}</p>
        <div class="mb-2 md:mb-2">
          <span class="text-base md:text-base"><b>Price Per night:</b> {{ campingDetails.pricePerNight }}</span>
        </div>
        <h3 class="font-bold mb-1 md:mb-2">Selected Date:</h3>
        <span v-if="formattedStartDate < formattedEndDate" class="text-base md:text-base">
          {{ formattedStartDate }} - {{ formattedEndDate }}
        </span>
        <div v-if="formattedStartDate < formattedEndDate" class="mt-2 md:mt-2">
          <span class="font-bold text-base md:text-sm">Number of Nights:</span><br>{{ getCountOfNights() }}<br>
          <span class="font-bold text-base md:text-sm">Total Price:</span><br>{{ getTotalPrice() }} 
        </div>
      </div>
    </div>

    <div v-else>
      <h2 class="font-bold text-center">You don't have access to this page!</h2>
    </div>
  </div>
</template>





<script>
import axios from 'axios'; // Import Axios library

export default {
  data() {
    return {
      selectedDates: [],
      formattedStartDate: '',
      formattedEndDate: '',
      userId: '',
      bookingSuccess: false,
      bookingInProgress: false,
      campingDetails: this.campingDetails || JSON.parse(localStorage.getItem('selectedCamping')) || null
    };
  },
  mounted() {
    if (!this.campingDetails) {
      this.campingDetails = JSON.parse(localStorage.getItem('selectedCamping'));
    }
  },
  computed: {
    parsedAvailableFrom() {
      return this.parseDate(this.campingDetails.availableFrom);
    },
    parsedAvailableTo() {
      return this.parseDate(this.campingDetails.availableTo);
    }
  },
  methods: {
    disableSingleDates(date) {
    if (!this.selectedDates.start || !this.selectedDates.end) {
      // Disable all dates if no range is selected
      return true;
    }
    
    // Convert date to a comparable format
    const selectedStart = new Date(this.selectedDates.start).getTime();
    const selectedEnd = new Date(this.selectedDates.end).getTime();
    const currentDate = new Date(date).getTime();
    
    // Disable single dates within the selected range
    return currentDate < selectedStart || currentDate > selectedEnd;
  },
    getImageUrl(imageName) {
      // Assuming the images are stored in the assets folder
      return require(`@/assets/${imageName}`); // Use "@" alias to reference the "src" directory
    },
    parseDate(dateString) {
      // Expecting dateString in "dd-mm-yyyy" format
      const [day, month, year] = dateString.split('-').map(Number);
      return new Date(year, month - 1, day);
    },
    handleDateSelection(dates) {
      // Update selectedDates
     
    
      // Format dates as "dd/mm/yy"
      const formatDate = (date) => {
        const day = ('0' + date.getDate()).slice(-2);
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const year = date.getFullYear().toString().slice(-2);
        return `${day}/${month}/${year}`;
      };

      // Update formatted start and end dates
      this.formattedStartDate = formatDate(new Date(dates.start));
      this.formattedEndDate = formatDate(new Date(dates.end));

      if (this.formattedStartDate == this.formattedEndDate) {
      // Alert the user to select a date range
      alert('Please select a date range instead of a single day.');
      return;
    } 

    else{
      this.selectedDates = dates;

     
      // Log formatted selected dates to console
      console.log('Selected Dates:', this.formattedStartDate, this.formattedEndDate);
    }
    },
    getTotalPrice() {
      const pricePerNight = this.campingDetails.pricePerNight;
      const countOfNights = this.getCountOfNights();
      return (pricePerNight * countOfNights).toFixed(2);
    },
    getCountOfNights() {
      if (!this.selectedDates || !this.selectedDates.start || !this.selectedDates.end) {
        return 0; // Return 0 if no dates are selected
      }

      const startDate = new Date(this.selectedDates.start);
      const endDate = new Date(this.selectedDates.end);

      // Calculate the difference in milliseconds
      const timeDifference = endDate.getTime() - startDate.getTime();

      // Convert milliseconds to days
      const daysDifference = timeDifference / (1000 * 3600 * 24);

      // Number of nights is the integer part of the days difference
      const nights = Math.floor(daysDifference);

      // Add 1 to account for inclusive start and end dates
      return nights;
    },
    async bookNow() {

      if(!this.formattedStartDate < this.formattedEndDate){
        
        alert("Please select a date range of at least one day.");
        return;
      }
       // Check if dates are selected
       if (!this.selectedDates || !this.selectedDates.start || !this.selectedDates.end) {
        alert('Please select a date range before booking.');
        this.bookingInProgress = false;
        return;
      }
      
      // Ensure the selected date range spans at least two days
      const startDate = new Date(this.selectedDates.start);
      const endDate = new Date(this.selectedDates.end);
      const minDuration = 1; // Minimum duration in days

      const timeDifference = endDate.getTime() - startDate.getTime();
      const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

      if (daysDifference < minDuration) {
        alert('Please select a date range of at least one day.');
        this.bookingInProgress = false;
        return;
      }
      if (this.bookingInProgress) return; // Prevent multiple clicks
      this.bookingInProgress = true;

     

      

      // Retrieve user ID from localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.id) {
        alert('User information not found. Please log in again.');
        this.bookingInProgress = false;
        return;
      }

      // Assign user ID
      this.userId = user.id;

      // Ensure campingDetails is available
      if (!this.campingDetails) {
        alert('Camping details not available.');
        this.bookingInProgress = false;
        return;
      }

      const currentDate = new Date().toLocaleDateString('en-GB');
      console.log(currentDate);

      // Prepare booking object with formatted dates
      const bookingData = {
        userId: this.userId,
        campsiteId: this.campingDetails.id,
        checkInDate: this.selectedDates.start,
        checkOutDate: this.selectedDates.end,
        totalNights: this.getCountOfNights(),
        totalPrice: this.getTotalPrice(),
        date: currentDate // Include current date
      };

      try {
        // Make API call to book the campsite
        const response = await axios.post('https://localhost:43203/Booking', bookingData);
        console.log('Booking successful:', response.data);
        this.bookingSuccess = true; // Set bookingSuccess flag to true

        // Send email with booking details
        await this.sendBookingEmail(user.email);

        // Update available spots for the booked campsite
        await this.updateAvailableSpots(this.campingDetails.id, this.campingDetails.availableSpots);

        // Set activePage to 'BOOKING-SUCCESS' after successful booking
        this.$router.push({ path: `/booking-success` }).catch(err => {
          if (err.name !== 'NavigationDuplicated') {
            throw err;
          }
        });
      } catch (error) {
        console.error('Booking failed:', error);
        alert('Failed to book. Please try again later.');
      } finally {
        // Reset booking in progress
        this.bookingInProgress = false;
      }
    },
    // Define a method to update the available spots for a camping
    async updateAvailableSpots(campingId, availableSpots) {
      // Create a copy of campingDetails and update availableSpots
      const updatedCampingDetails = { ...this.campingDetails, availableSpots: availableSpots - 1 };

      try {
        const response = await axios.put(`https://localhost:43203/Camping/${campingId}`, updatedCampingDetails);
        
        console.log("Camping spot updated:", response.data);
        // You may want to handle the response from the API here
      } catch (error) {
        console.error("Error updating available spots:", error);
        // Handle error updating available spots
      }
    },
    async sendBookingEmail(userEmail) {
      try {
        const emailContent = `
          <html>
          <body>
            <p>You have successfully booked <b>${this.campingDetails.title}</b>.</p>
            <p><b>Date:</b> from ${this.formattedStartDate} to ${this.formattedEndDate}.</p>
            <p><b>Number of Nights:</b> ${this.getCountOfNights()}.</p>
            <p><b>Total Price:</b> ${this.getTotalPrice()}</p>
          </body>
          </html>
        `;

        const emailData = {
          to: userEmail,
          subject: 'Booking Confirmation - ' + this.campingDetails.title,
          body: emailContent
        };

        // Make API call to your backend server to send email
        const response = await axios.post('https://localhost:43203/api/Email/send', emailData);

        console.log('Booking confirmation email sent.');
        console.log('Response:', response.data);
      } catch (error) {
        console.error('Failed to send booking confirmation email:', error);
        // Handle email sending failure
      }
    }
  }
};
</script>
