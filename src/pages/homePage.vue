<template>
  <div>
    <!-- Existing Banner Section -->
    <div class="relative" style="height: calc(100vh - 4rem);">
      <img src="../assets/bannerHome.jpg" class="w-full h-full object-cover" alt="Home Banner">
      <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-70"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center font-bold text-5xl shadow-lg">
          <span class="font-black text-shadow">Sun Woods</span>
      </div>
      <div id="scroll-down-button" class="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white cursor-pointer animate-bounce">
        <span class="text-lg">Click to Scroll Down</span>
        <svg class="w-6 h-6 mx-auto mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
    </div>
    
    
  
    </div>

    <!-- About Section -->
    <div id="about" class="flex flex-col items-center justify-center py-24 px-8 bg-white text-black text-center shadow-lg transition-opacity duration-1000 ease-in-out opacity-0">
      <img src="../assets/c_logo.png" alt="Logo" class="mb-6 w-48 h-48 animate-zoom-in"> 
      <h2 class="text-3xl font-bold mb-4 animate-fade-in-down">Welcome to Sun Woods</h2> 
      <p class="max-w-2xl text-lg leading-relaxed animate-slide-in-up">SunWoods is an Airbnb camping site that offers a serene and unique outdoor experience. Escape the hustle and bustle of the city and immerse yourself in nature with our comfortable and eco-friendly accommodations.</p>
      <router-link to="/camping" class="mt-8 bg-blue-500 text-white py-3 px-6 rounded-full hover:bg-blue-600 transition-colors duration-300">Explore Our Campings</router-link> 
    </div>

      <!-- Ratings Slideshow Section -->
      <div class="relative mt-16 w-full h-96 overflow-hidden">
        <h2 class="text-center text-3xl font-bold mb-4">Top 3 Recent Ratings</h2>
        <div v-if="ratings.length" class="relative h-full">
          <transition-group name="fade" tag="div">
            <div :key="currentSlide" class="absolute w-full h-full flex flex-col items-center justify-center bg-cover bg-center transition-opacity duration-1000" :style="{ backgroundImage: `url(${getImageUrl(ratings[currentSlide].camping.imageURL)})` }">
              <div class="bg-white bg-opacity-90 text-black p-6 rounded-lg shadow-xl max-w-lg text-center backdrop-filter backdrop-blur-md">
                <h3 class="text-2xl font-bold text-gray-800">{{ ratings[currentSlide].camping.title }}</h3>
                <p class="mt-2 italic text-lg text-gray-600">"{{ ratings[currentSlide].comment }}"</p>
                <div class="mt-4 flex items-center justify-center space-x-2">
                  <span class="text-lg font-semibold text-gray-700">Rating: </span><span class="text-lg text-yellow-500">{{ ratings[currentSlide].rate }}</span>
                </div>
                <div class="mt-4 flex items-center justify-center space-x-2">
                  <img :src="getUserImage(ratings[currentSlide].user.profileImage)" alt="User Profile" class="w-10 h-10 rounded-full shadow-md">
                  <span class="text-lg font-semibold text-gray-700">{{ ratings[currentSlide].user.userName }}</span>
                </div>
              </div>
            </div>
          </transition-group>
          <button @click="prevSlide" class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-700 bg-opacity-75 text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition duration-300">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          <button @click="nextSlide" class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-700 bg-opacity-75 text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition duration-300">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
        <div v-else class="text-center p-6">
          <p>No ratings available.</p>
        </div>
      </div>
    </div>
  </template>
  
  <style>
  .fade-enter-active, .fade-leave-active {
    transition: opacity 1s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
    opacity: 0;
  }
  
  @keyframes fade-in-down {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes slide-in-up {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes zoom-in {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  @keyframes bounce {
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-10px);
    }
}
#scroll-down-button {
  /* Ensure the button is centered horizontally */
  left: 45%;
  /* Shift the button upward slightly to compensate for the bounce effect */
  bottom: 40px;
}
  .animate-fade-in-down {
    animation: fade-in-down 1s ease-out;
  }
  
  .animate-slide-in-up {
    animation: slide-in-up 1s ease-out;
  }
  
  .animate-zoom-in {
    animation: zoom-in 1s ease-out;
  }
  
  .animate-bounce {
    animation: bounce 1.5s infinite;
}
  
  .text-shadow {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); /* Adjust shadow properties as needed */
  }
  
  #about.in-view {
    opacity: 1;
  }
  
  .backdrop-filter {
    backdrop-filter: blur(10px);
  }
  
  .shadow-xl {
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  </style>
  
  <script>
  export default {
    data() {
      return {
        ratings: [],
        currentSlide: 0,
        interval: null
      };
    },
    mounted() {
      this.fetchData().then(() => {
        this.startAutoSlide();
      });
      this.initializeObserver();
      this.initializeEventListeners();
    },
    methods: {
      async fetchData() {
        try {
          const [ratingsRes, usersRes, campingsRes] = await Promise.all([
            fetch('https://localhost:43203/Rating/Top3Ratings').then(res => res.json()),
            fetch('https://localhost:43203/User').then(res => res.json()),
            fetch('https://localhost:43203/Camping').then(res => res.json())
          ]);
  
          this.ratings = ratingsRes.map(rating => ({
            ...rating,
            user: usersRes.find(user => user.id === rating.userId),
            camping: campingsRes.find(camping => camping.id === rating.campingId)
          }));
  
          // Ensure the first slide is shown immediately after data is fetched
          this.currentSlide = 0;
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      },
      getImageUrl(imageName) {
        // Check if the requested image exists
        try {
          return require(`../assets/${imageName}`);
        } catch (error) {
          // If the image doesn't exist, return the URL of the default image
          console.error(`Image ${imageName} not found. Using default image.`);
          return require(`../assets/empty.jpg`);
        }
      },
      getUserImage(imageName) {
        return imageName ? require(`../assets/${imageName}`) : require(`../assets/profile.jpg`);
      },
      initializeObserver() {
        const aboutSection = document.getElementById('about');
        const observer = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              aboutSection.classList.add('in-view');
              observer.unobserve(aboutSection);
            }
          });
        });
        observer.observe(aboutSection);
        this.$once('hook:beforeDestroy', () => {
          observer.disconnect();
        });
      },
      initializeEventListeners() {
        const scrollButton = document.getElementById('scroll-down-button');
        const aboutSection = document.getElementById('about');
        const handleScrollButtonClick = () => {
          aboutSection.scrollIntoView({ behavior: 'smooth' });
        };
        scrollButton.addEventListener('click', handleScrollButtonClick);
        this.$once('hook:beforeDestroy', () => {
          scrollButton.removeEventListener('click', handleScrollButtonClick);
        });
      },
      startAutoSlide() {
        this.interval = setInterval(() => {
          this.nextSlide();
        }, 5000);
      },
      stopAutoSlide() {
        clearInterval(this.interval);
      },
      nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.ratings.length;
      },
      prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.ratings.length) % this.ratings.length;
      }
    },
    watch: {
      $route() {
        this.stopAutoSlide();
        this.startAutoSlide();
      }
    },
    beforeDestroy() {
      this.stopAutoSlide();
    }
  };
  </script>