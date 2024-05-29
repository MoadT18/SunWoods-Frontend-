<template>
  <div class="flex flex-col lg:flex-row overflow-hidden">
    <button @click="toggleFilterVisibility" class="lg:hidden bg-gray-200 text-gray-800 px-4 py-2 rounded-md mb-4 mx-auto">
      {{ filterVisible ? 'Collapse Filter' : 'Expand Filter' }}
    </button>
    <!-- FILTER -->
    <div v-show="filterVisible" class="border border-gray-300 bg-white shadow-md rounded-lg w-full lg:w-72 p-4 mb-4 lg:mb-0 lg:mr-4">
      <h3 class="text-center text-gray-800 font-semibold text-lg mb-4">Filter</h3>

      <!-- Price Range Slider -->
      <div class="mb-6">
        <label for="price-range" class="block text-gray-700 font-semibold mb-2">Price Range</label>
        <input type="range" id="price-range" class="w-full bg-gray-200 rounded-lg" min="0" max="100" value="0" @input="updatePrice">
        <div class="flex justify-between text-gray-600 mt-2">
          <span id="minPrice">€0</span>
          <span id="maxPrice">€100</span>
        </div>
      </div>

      <!-- Available From Slider -->
      <div class="mb-6">
        <label for="available-from-slider" class="block text-gray-700 font-semibold mb-2">Available From</label>
        <input type="date" id="available-from-slider" class="w-full bg-gray-200 rounded-lg" v-model="availableFrom" @input="applyDateFilter">
      </div>

      <!-- Available To Slider -->
      <div class="mb-6">
        <label for="available-to-slider" class="block text-gray-700 font-semibold mb-2">Available To</label>
        <input type="date" id="available-to-slider" class="w-full bg-gray-200 rounded-lg" v-model="availableTo" @input="applyDateFilter">
      </div>

      <!-- Reset Button -->
      <button class="bg-red-600 text-white px-4 py-2 rounded-full mt-4 w-full font-semibold" @click="resetFilters">Reset Filters</button>
    </div>

    <!-- Camping div -->
    <div v-if="campings.length > 0" class="overflow-y-auto w-full lg:w-4/5 p-4">
      <div v-for="camping in campings" :key="camping.id" class="bg-white shadow-lg rounded-lg mb-6 p-6">
        <h1 class="text-2xl font-bold mb-2">{{ camping.title }}</h1>
        <h2 class="text-xl text-gray-700 mb-4">{{ camping.location }}</h2>

        <!-- Display image if imageURL is available -->
        <img v-if="camping.imageURL" :src="getImageUrl(camping.imageURL)" class="w-full h-80 object-cover rounded mb-4" alt="Camping Image">

        <p class="text-gray-600 mb-4">{{ camping.description }}</p>

        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <h2 class="font-semibold">Available From</h2>
            <span class="text-gray-600">{{ camping.availableFrom }}</span>
          </div>
          <div>
            <h2 class="font-semibold">Available To</h2>
            <span class="text-gray-600">{{ camping.availableTo }}</span>
          </div>
          <div>
            <h2 class="font-semibold">Price Per Night</h2>
            <span class="text-lg text-gray-600">{{ camping.pricePerNight }}</span>
          </div>
          <div>
            <h2 class="font-semibold">Available</h2>
            <span class="text-lg text-gray-600">{{ camping.availableSpots }}</span>
          </div>
        </div>

        <div class="flex justify-between items-center mb-4">
          <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
            <a href="#" @click="goToBookCamperPage(camping)">Book Now!</a>
          </button>
        </div>

       <!-- Comments and Ratings Section for each camping -->
<div class="bg-gray-50 p-4 rounded shadow-inner">
  <h3 class="font-semibold mb-2">Comments and Ratings</h3>

  <!-- Display ratings for the current camping -->
  <div v-if="ratings[camping.id] && ratings[camping.id].length > 0">
    <div v-for="rating in displayedRatings(camping.id)" :key="rating.id" class="border-b border-gray-200 py-2 rating-item">
      <div class="flex justify-between mb-1">
        <span class="font-semibold">{{ getUserName(rating.userId) }}</span>
        <span class="text-yellow-500">Rating: {{ rating.rate }}/5</span>
      </div>
      <p class="text-gray-400 text-sm">{{rating.date}}</p>
      <p class="text-gray-600">{{ rating.comment }}</p>
    </div>
    <button v-if="ratings[camping.id].length > 1" @click="toggleRatings" class="bg-slate-700 text-white px-4 py-2 rounded hover:bg-slate-900 transition mt-2">
      {{ showAllRatings ? 'Show Less' : 'Show All' }}
    </button>
  </div>
  <div v-else>
    <p class="text-gray-500">No ratings yet.</p>
  </div>


          <!-- Add new comment and rating section -->
          <div v-if="userLoggedIn" class="mt-4">
            <textarea v-model="newComment" placeholder="Add a comment..." class="w-full p-2 border rounded mb-2"></textarea>
            <select v-model="newRating" class="w-full p-2 border rounded mb-2">
              <option disabled value="">Select a rating</option>
              <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
            </select>
            <button @click="addComment(camping.id)" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">Submit</button>
          </div>
          <div v-else>
            <p class="text-gray-500">You need to log in to add a comment.</p>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p class="text-center">No campings available.</p>
    </div>
  </div>
</template>



<script>

export default {

  
  data() {
    return {
      campings: [],
      ratings: [],
      users: {}, // Store user details with userId as the key


      userLoggedIn: false, // Add this property
      availableFrom: '', // New data property for available from date
      availableTo: '', //
      newComment: '',
      newRating: '',
      showAllRatings: false, // Add this property
      filterVisible: true,
      clickInProgress: false, // Flag to track if a click event is in progress




    };
  },
  mounted() {
    this.checkUserLoggedIn();
    this.fetchCampings();
    //this.fetchRatings();
  },
  methods: {

    toggleFilterVisibility() {
      this.filterVisible = !this.filterVisible;
    },
    async goToBookCamperPage(camping) {
  if (localStorage.getItem('user') !== null) {
    if (camping.availableSpots > 0) {
      // Save camping details to local storage
      localStorage.setItem('selectedCamping', JSON.stringify(camping));
      try {
        // Set clickInProgress to true to prevent multiple clicks
        this.clickInProgress = true;
        
        // Wait for a short delay to ensure localStorage data retrieval
        setTimeout(() => {
          this.$router.push({ 
            name: 'bookcampers', 
            params: { campingDetails: camping }
          }).catch(error => {
            console.error('Error navigating to booking page:', error);
          }).finally(() => {
            // Reset clickInProgress flag after navigation is complete
            this.clickInProgress = false;
          });
        }, 100); // Adjust the delay as needed
      } catch (error) {
        console.error('Error navigating to booking page:', error);
      }
    } else {
      alert("There are no available spots for this camping.");
    }
  } else {
    alert("You need to log in first!");
  }
},
    // Fetch campings data
    fetchCampings() {
      const url = `https://sunwoodsapi.azurewebsites.net/Camping`;
      fetch(url)
        .then(response => response.json())
        .then(data => {
          this.campings = data;
          this.campings.forEach(camping => {
            this.fetchRatings(camping.id);
          });
        })
        .catch(error => {
          console.error('Error fetching campings:', error);
        });
    },
    fetchRatings(campingId) {
      const url = `https://sunwoodsapi.azurewebsites.net/Rating/Camping/${campingId}`;
      fetch(url)
        .then(response => response.json())
        .then(data => {
          this.$set(this.ratings, campingId, data);
          data.forEach(rating => {
            if (!this.users[rating.userId]) {
              this.fetchUser(rating.userId);
            }
          });
        })
        .catch(error => {
          console.error('Error fetching ratings:', error);
        });
    },
    fetchUser(userId) {
      if (this.users[userId]) {
        return Promise.resolve(this.users[userId]);
      }
      const url = `https://sunwoodsapi.azurewebsites.net/User/${userId}`;
      return fetch(url)
        .then(response => response.json())
        .then(data => {
          this.$set(this.users, userId, data);
          return data;
        })
        .catch(error => {
          console.error('Error fetching user:', error);
        });
    },
    getUserName(userId) {
      return this.users[userId] ? this.users[userId].userName : 'Unknown User';
    },

    // Check if user is logged in
    checkUserLoggedIn() {
      const user = JSON.parse(localStorage.getItem('user'));
      this.userLoggedIn = !!user;
    },
    addComment(campingId) {
  if (this.newComment.trim() === '' || !this.newRating) {
    alert('Please provide a comment and a rating.');
    return;
  }
  
  const user = JSON.parse(localStorage.getItem('user'));
  
  // Get the current date in the format "dd/MM/yyyy"
  const currentDate = new Date().toLocaleDateString('en-GB');

  const newRatingData = {
    userId: user.id,
    campingId: campingId,
    comment: this.newComment,
    rate: this.newRating,
    date: currentDate // Include the current date
  };
  
  fetch(`https://sunwoodsapi.azurewebsites.net/Rating`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newRatingData)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to add comment.');
      }
      return response.text();
    })
    .then(() => {
      const camping = this.campings.find(c => c.id === campingId);
      if (camping) {
        if (!camping.comments) {
          camping.comments = [];
        }
        camping.comments.push(newRatingData);
      }
      this.newComment = '';
      this.newRating = '';
      this.fetchRatings(campingId);
    })
    .catch(error => {
      console.error('Error adding comment:', error);
      alert('Failed to add comment. Please try again later.');
    });
},

    // Toggle ratings visibility
    toggleRatings() {
      this.showAllRatings = !this.showAllRatings;
    },
    // Displayed ratings based on toggle state
    displayedRatings(campingId) {
      if (!this.ratings[campingId]) return [];
      return this.showAllRatings ? this.ratings[campingId] : this.ratings[campingId].slice(0, 1);
    },
    


    getImageUrl(imageName) {
      // Check if the requested image exists
      try {
        return require(`../assets/${imageName}`);
      } catch (error) {
        // If the image doesn't exist, return the URL of the default image
        console.error(`Image ${imageName} not found. Using default image.`);
        return require(`../assets/empty.png`);
      }
    },

    applyDateFilter() {
  // Fetch campings with date filter
  const minPrice = document.getElementById("price-range").value;
  const formattedFromDate = this.formatDate(this.availableFrom, 'dd-MM-yyyy');
  const formattedToDate = this.availableTo ? this.formatDate(this.availableTo, 'dd-MM-yyyy') : null; // Check if availableTo is not null
  if (formattedFromDate === null || formattedToDate === null) {
    console.error('Invalid date format for availableFrom or availableTo');
    return; // Exit fetchCampings if dates are invalid
  }

  // Ensure availableFrom is before availableTo
  if (formattedFromDate >= formattedToDate) {
    console.error('Available From date must be before Available To date');
    return; // Exit fetchCampings if dates are not in the correct order
  }

  let url = `https://sunwoodsapi.azurewebsites.net/Camping?availableFrom=${formattedFromDate}&availableTo=${formattedToDate}`;
  if (minPrice) {
    url += `&minPrice=${minPrice}`;
  }

  console.log("URL:", url); // Debugging log

  fetch(url)
    .then(response => response.json())
    .then(data => {
      this.campings = data;
    })
    .catch(error => {
      console.error('Error fetching campings:', error);
    });
},

formatDate(dateString, format) {
  // Check if dateString is not empty and has the expected format
  if (!dateString || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return null; // Return null if dateString is invalid
  }

  // Split the dateString and get year, month, and day components
  const [year, month, day] = dateString.split('-');

  // Check if year, month, and day are valid numbers
  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    return null; // Return null if any component is not a number
  }

  // Define month names array for formatting
  const monthNames = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

  // Get the formatted date based on the specified format
  let formattedDate;
  switch (format) {
    case 'dd-MM-yyyy':
      formattedDate = `${day}-${monthNames[parseInt(month, 10) - 1]}-${year}`;
      break;
    // Add more cases for other formats if needed
    default:
      formattedDate = `${year}-${month}-${day}`;
      break;
  }

  return formattedDate;
},


    updatePrice(event) {
      // Update price range slider
      const value = event.target.value;
      document.getElementById("minPrice").textContent = "Є" + value;

      const minPrice = value; // Use value instead of this.minPrice

      const formattedFromDate = this.formatDate(this.availableFrom);
      const formattedToDate = this.availableTo ? this.formatDate(this.availableTo) : null; // Check if availableTo is not null

      let url = `https://sunwoodsapi.azurewebsites.net/Camping?minPrice=${minPrice}`;



      if (formattedFromDate && formattedToDate) {
        url += `&availableFrom=${formattedFromDate}&availableTo=${formattedToDate}`;
      }


      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch campings');
          }
          return response.json();
        })
        .then(data => {
          this.campings = data;
          data.forEach(camping => {
            console.log('Camping fetched:', camping); // Log each camping fetched
          });
          console.log('Camping data fetched successfully:', data); // Console log when data is fetched successfully
        })
        .catch(error => {
          console.error('Error fetching campings:', error);
        });
    },
    resetFilters() {
      // Reset all filter values
      this.minPrice = 0;
      this.availableFrom = '';
      this.availableTo = '';
      document.getElementById("price-range").value = 0;
      document.getElementById("minPrice").textContent = "Є0"; // Update minPrice span to display 0


      // Fetch all campings
      this.fetchCampings();
    },


    // Other methods for handling slider interaction
  },
};
</script>


