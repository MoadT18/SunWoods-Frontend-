<template>
  <div class="flex-grow overflow-hidden"> <!-- Ensure content doesn't overflow -->
    <img ref="mapImage" src="../assets/interactiveMap.png" class="w-full object-fit rounded-lg shadow-lg" :style="{ height: imageHeight + 'px' }">

    <!-- Location icons --> 
    <div v-for="(location, index) in locations" :key="index" 
      class="absolute cursor-pointer icon-container"
      :style="{ top: location.y + '%', left: location.x + '%' }" 
      @click="showLocationInfo(index + 1)">
      <img :src="getIconUrl(location.group)" class="icon">
    </div>

   <!-- Info div -->
   <div v-if="showInfo" class="absolute bg-white p-4 rounded shadow-md max-w-xs z-50" 
   :style="{ top: infoPosition.y + 'px', left: infoPosition.x + 'px', transform: infoPosition.transform }">
   <button @click="closeInfo" class="absolute top-0 right-0 mt-2 mr-2 bg-gray-300 text-gray-700 rounded-full w-6 h-6 flex items-center justify-center">
     &times;
   </button>
   <h2 class="text-xl font-bold">{{ selectedCamping.title }}</h2>
   <!-- Apply conditional styling based on location -->
   <p class="text-sm" :style="{ color: getLocationColor(selectedCamping.location) }">Location: <b>{{ selectedCamping.location }}</b></p>
   <p class="text-sm">Available From: {{ selectedCamping.availableFrom }}</p>
   <p class="text-sm">Available To: {{ selectedCamping.availableTo }}</p>
   <p class="text-sm">Price Per Night: {{ selectedCamping.pricePerNight }}</p>
   <img v-if="selectedCamping.imageURL" :src="getImageUrl(selectedCamping.imageURL)" class="w-full h-auto mt-4 border border-gray-300 rounded-lg shadow-md" alt="Camping Image">
 </div>

    <!-- Legend div -->
    <div class="absolute top-24 left-2 bg-white p-2 rounded shadow-md">
      <h3 class="text-lg font-bold mb-2">Legend</h3>
      <div class="flex flex-col space-y-1">
        <div class="flex items-center">
          <img src="../assets/black_location.png" class="w-4 h-4 mr-2">
          <span>Odyssey Outdoors</span>
        </div>
        <div class="flex items-center">
          <img src="../assets/red_location.png" class="w-4 h-4 mr-2">
          <span>SunTrail Tribe</span>
        </div>
        <div class="flex items-center">
          <img src="../assets/blue_location.png" class="w-4 h-4 mr-2">
          <span>Echo Ridge</span>
        </div>
        <div class="flex items-center">
          <img src="../assets/yellow_location.png" class="w-4 h-4 mr-2">
          <span>Valley Vista</span>
        </div>
        <div class="flex items-center">
          <img src="../assets/green_location.png" class="w-4 h-4 mr-2">
          <span>Hidden Hollows</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // Add this variable to store navigation bar height
        
      locations: [
        { x: 15, y: 15, group: 0 },
        { x: 25, y: 17, group: 0 },
        { x: 41, y: 18, group: 0 },
        { x: 37, y: 27, group: 0 },
        { x: 42, y: 38, group: 0 },
        { x: 23, y: 66, group: 1 },
        { x: 31, y: 54, group: 1 },
        { x: 40, y: 60, group: 1 },
        { x: 60, y: 65, group: 2 },
        { x: 69, y: 66, group: 2 },
        { x: 71, y: 87, group: 3 },
        { x: 93, y: 73, group: 3 },
        { x: 83, y: 53, group: 3 },
        { x: 68, y: 22, group: 4 },
        { x: 83, y: 22, group: 4 },
      ],
      showInfo: false,
      infoPosition: { x: 0, y: 0, transform: 'translate(-50%, -100%)' },
      selectedCamping: null,
      imageHeight: 0,
      navHeight: 0 
    };
  },
  methods: {
    getLocationColor(location) {
      switch (location) {
        case 'Odyssey Outdoors':
          return 'black';
        case 'SunTrail Tribe':
          return 'red';
        case 'Echo Ridge':
          return 'blue';
        case 'Valley Vista':
          return '#FFD700';
        case 'Hidden Hollows':
          return 'green';
        default:
          return 'black'; // Default color
      }
    },
    getIconUrl(group) {
      switch(group) {
        case 0: return require("../assets/black_location.png");
        case 1: return require("../assets/red_location.png");
        case 2: return require("../assets/blue_location.png");
        case 3: return require("../assets/yellow_location.png");
        case 4: return require("../assets/green_location.png");
      }
    },
    async showLocationInfo(id) {
  try {
    const response = await fetch(`https://localhost:43203/Camping/${id}`);
    if (!response.ok) throw new Error('Failed to fetch camping data');
    
    this.selectedCamping = await response.json();
    const iconX = this.locations[id - 1].x;
    const iconY = this.locations[id - 1].y;
    
    // Adjust the position of the info div based on the icon position
    const image = this.$refs.mapImage;
    const imageWidth = image.clientWidth;
    const imageHeight = image.clientHeight;
    
    // Calculate the position relative to the image width and height
    const xPosition = (iconX / 100) * imageWidth;
    const yPosition = (iconY / 100) * imageHeight;
    
    // Adjust the position of the info div
    let xOffset = -20;
    let yOffset = 400;
    if (yPosition > 300) {
      xOffset = -180;
      yOffset = 80;
    }

    this.infoPosition = { 
      x: xPosition + xOffset, // Adjust as needed
      y: yPosition + yOffset, // Adjust as needed
      transform: 'translate(-50%, -100%)' 
    };
    
    this.showInfo = true;
  } catch (error) {
    console.error('Error fetching camping data:', error);
  }
},
    getImageUrl(imageName) {
      try {
        return require(`../assets/${imageName}`);
      } catch (error) {
        console.error(`Image ${imageName} not found. Using default image.`);
        return require(`../assets/empty.jpg`);
      }
    },
    closeInfo() {
      this.showInfo = false;
      this.selectedCamping = null;
    }
  },
  mounted() {
    const nav = document.querySelector('nav');
    this.navHeight = nav.offsetHeight; // Get the height of the navigation bar

    // Calculate the remaining height for the image
    this.imageHeight = window.innerHeight - this.navHeight;

    const image = this.$refs.mapImage;
    console.log("Image width:", image.clientWidth, "Image height:", image.clientHeight);
  }
};
</script>
<style scoped>
html, body {
  margin: 0;
  padding: 0;
}

/* Scoped CSS */
.map-container {
  position: relative;
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 0;
}

.map-image {
  width: 100%;
  height: auto; /* Let the browser handle the height to maintain aspect ratio */
  display: block;
}

.icon-container {
  width: 24px;
  height: 24px;
}

.icon {
  width: 100%;
  height: 100%;
}

@media (max-width: 768px) {
  .icon-container {
    width: 16px;
    height: 16px;
  }

  .icon {
    width: 100%;
    height: 100%;
  }
}
</style>