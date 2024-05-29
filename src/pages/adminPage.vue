<template>
  <div class="container mx-auto p-4">
    <!-- Camping div -->
    <div v-if="campings.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="camping in campings" :key="camping.id" class="bg-white border border-gray-200 rounded-lg shadow-md p-6">
        <!-- Camping details -->
        <h1 class="text-2xl font-semibold mb-2">{{ camping.title }}</h1>
        <h2 class="text-xl text-gray-600 mb-4">{{ camping.location }}</h2>
        <img v-if="camping.imageURL" :src="getImageUrl(camping.imageURL)" class="w-full h-48 object-cover rounded-lg mb-4" alt="Camping Image">
        <p class="text-gray-700 mb-4">{{ camping.description }}</p>
        <div class="flex justify-between mb-4">
          <div>
            <h2 class="text-sm font-semibold text-gray-500">Available From</h2>
            <span class="text-gray-700">{{ camping.availableFrom }}</span>
          </div>
          <div>
            <h2 class="text-sm font-semibold text-gray-500">Available To</h2>
            <span class="text-gray-700">{{ camping.availableTo }}</span>
          </div>
        </div>
        <div class="mb-4">
          <h2 class="text-sm font-semibold text-gray-500">Price Per Night</h2>
          <span class="text-gray-700">{{ camping.pricePerNight }}</span>
        </div>
        <div class="mb-4">
          <h2 class="text-sm font-semibold text-gray-500">Available</h2>
          <span class="text-gray-700">{{ camping.availableSpots }}</span>
        </div>
        
        <!-- Edit button -->
        <button @click="toggleEditForm(camping)" class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Edit</button>
        <!-- Delete button -->
        <button @click="confirmDelete(camping.id)" class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">Delete</button>

        <!-- Edit form -->
        <div v-if="editingCamping && editingCamping.id === camping.id" class="mt-4">
          <h2 class="text-lg font-semibold mb-2">Edit Camping</h2>
          <form @submit.prevent="saveEditedCamping" class="space-y-4">
            <div>
              <label class="block text-gray-700">Title:</label>
              <input type="text" v-model="editedCamping.title" required class="w-full p-2 border border-gray-300 rounded">
            </div>
            <div>
              <label class="block text-gray-700">Location:</label>
              <input type="text" v-model="editedCamping.location" required class="w-full p-2 border border-gray-300 rounded">
            </div>
            <div>
              <label class="block text-gray-700">Description:</label>
              <textarea v-model="editedCamping.description" class="w-full p-2 border border-gray-300 rounded"></textarea>
            </div>
            <div>
              <label class="block text-gray-700">Available From:</label>
              <input type="date" v-model="editedCamping.availableFrom" required class="w-full p-2 border border-gray-300 rounded">
            </div>
            <div>
              <label class="block text-gray-700">Available To:</label>
              <input type="date" v-model="editedCamping.availableTo" required class="w-full p-2 border border-gray-300 rounded">
            </div>
            <div>
              <label class="block text-gray-700">Price per Night:</label>
              <input type="number" v-model="editedCamping.pricePerNight" required class="w-full p-2 border border-gray-300 rounded">
            </div>
            <div>
              <label class="block text-gray-700">Available:</label>
              <input type="number" v-model="editedCamping.availableSpots" required class="w-full p-2 border border-gray-300 rounded">
            </div>
            
            <div>
              <label class="block text-gray-700">Image URL:</label>
              <input type="text" v-model="editedCamping.imageURL" class="w-full p-2 border border-gray-300 rounded">
            </div>
            <div class="flex space-x-4">
              <button type="submit" class="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">Save Changes</button>
              <button @click="cancelEdit" class="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div v-else>
      <p class="text-gray-500 text-center">No campings available.</p>
    </div>
    <!-- Form to add camping -->
    <div v-if="showAddForm" class="mt-10 bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-4">Add Camping</h2>
      <form @submit.prevent="addCamping" class="space-y-4">
        <div>
          <label class="block text-gray-700">Title:</label>
          <input type="text" v-model="newCamping.title" required class="w-full p-2 border border-gray-300 rounded">
        </div>
        <div>
          <label class="block text-gray-700">Location:</label>
          <input type="text" v-model="newCamping.location" required class="w-full p-2 border border-gray-300 rounded">
        </div>
        <div>
          <label class="block text-gray-700">Description:</label>
          <textarea v-model="newCamping.description" class="w-full p-2 border border-gray-300 rounded"></textarea>
        </div>
        <div>
          <label class="block text-gray-700">Available From:</label>
          <input type="date" v-model="newCamping.availableFrom" required class="w-full p-2 border border-gray-300 rounded">
        </div>
        <div>
          <label class="block text-gray-700">Available To:</label>
          <input type="date" v-model="newCamping.availableTo" required class="w-full p-2 border border-gray-300 rounded">
        </div>
        <div>
          <label class="block text-gray-700">Price per Night:</label>
          <input type="number" v-model="newCamping.pricePerNight" required class="w-full p-2 border border-gray-300 rounded">
        </div>
        <div>
          <label class="block text-gray-700">Available:</label>
          <input type="number" v-model="newCamping.availableSpots" required class="w-full p-2 border border-gray-300 rounded">
        </div>
        <div>
          <label class="block text-gray-700">Image URL:</label>
          <input type="text" v-model="newCamping.imageURL" required class="w-full p-2 border border-gray-300 rounded">
        </div>
        
        <button type="submit" class="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">Add Camping</button>
      </form>
    </div>
    <!-- Button to toggle add camping form -->
    <button @click="toggleAddForm" class="mt-10 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
      {{ showAddForm ? 'Cancel' : 'Add Camping' }}
    </button>

    <!-- Confirmation Modal -->
    <div v-if="showConfirmDelete" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-4">Confirm Deletion</h2>
        <p class="mb-4">Are you sure you want to delete this camping?</p>
        <div class="flex justify-end space-x-4">
          <button @click="cancelDelete" class="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">Cancel</button>
          <button @click="deleteCamping" class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      campings: [],
      showAddForm: false,
      newCamping: {
        title: '',
        location: '',
        description: '',
        availableFrom: '',
        availableTo: '',
        pricePerNight: 0,
        availableSpots: 0,
        imageUrl: '',
        group: null
      },
      editingCamping: null,
      editedCamping: {
        title: '',
        location: '',
        description: '',
        availableFrom: '',
        availableTo: '',
        pricePerNight: 0,
        availableSpots: 0,
        imageUrl: '',
        group: null
      },
      showConfirmDelete: false,
      campingToDelete: null
    };
  },
  mounted() {
    this.fetchCampings();
  },
  methods: {
    // Method to fetch campings
    fetchCampings() {
      const url = `https://sunwoodsapi.azurewebsites.net/Camping`;
      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch campings');
          }
          return response.json();
        })
        .then(data => {
          this.campings = data;
        })
        .catch(error => {
          console.error('Error fetching campings:', error);
        });
    },
    // Method to add a new camping
    addCamping() {
      const formattedAvailableFrom = this.formatDate(this.newCamping.availableFrom);
    const formattedAvailableTo = this.formatDate(this.newCamping.availableTo);

      // Check if availableFrom is before availableTo
      if (this.newCamping.availableFrom >= this.newCamping.availableTo) {
        console.error('Available From date must be before Available To date');
        alert('Available From date must be before Available To date');
        return; // Exit addCamping if dates are not in the correct order
      }

      this.newCamping.availableFrom = formattedAvailableFrom;
    this.newCamping.availableTo = formattedAvailableTo;
      
      fetch("https://sunwoodsapi.azurewebsites.net/Camping", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(this.newCamping)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to add camping");
        }
        return response.text(); // Read response as text
      })
      .then(data => {
        console.log("Camping has been added: ", data); // Log response as text
        // If response indicates success, you can handle it accordingly
        // For example, update UI or fetch campings again

        this.fetchCampings();
        this.toggleAddForm(); // Hide the form after successful addition


      })
      .catch(error => {
        console.error("Error adding camping:", error);
      });
    },

    // Method to toggle display of add camping form
    toggleAddForm() {
      this.showAddForm = !this.showAddForm;
      if (!this.showAddForm) {
        // Reset form fields when hiding the form
        this.newCamping = {
          title: '',
          location: '',
          description: '',
          availableFrom: '',
          availableTo: '',
          pricePerNight: 0,
          availableSpots: 0,
          imageUrl: '',
          group: null
        };
      }
    },
    // Method to get the image URL
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

    // Method to toggle edit form
    toggleEditForm(camping) {
      this.editingCamping = camping;
      this.editedCamping = { ...camping }; // Create a copy to prevent direct mutation
    },

    formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
},
    // Method to save edited camping
    saveEditedCamping() {
      const formattedAvailableFrom = this.formatDate(this.editedCamping.availableFrom);
    const formattedAvailableTo = this.formatDate(this.editedCamping.availableTo);

      // Check if availableFrom is before availableTo
      if (this.editedCamping.availableFrom >= this.editedCamping.availableTo) {
        console.error('Available From date must be before Available To date');
        alert('Available From date must be before Available To date');
        return; // Exit if dates are not in the correct order
      }

      this.editedCamping.availableFrom = formattedAvailableFrom;
    this.editedCamping.availableTo = formattedAvailableTo;
      fetch(`https://sunwoodsapi.azurewebsites.net/Camping/${this.editingCamping.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(this.editedCamping)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to save changes");
        }
        return response.text(); // Read response as text
      })
      .then(data => {
        console.log("Changes saved: ", data); // Log response as text
        // If response indicates success, you can handle it accordingly
        // For example, update UI or fetch campings again
        this.fetchCampings(); // Assuming you have a method to fetch campings
        this.editingCamping = null; // Exit editing mode

      })
      .catch(error => {
        console.error("Error saving changes:", error);
      });
    },

    // Method to cancel editing
    cancelEdit() {
      this.editingCamping = null;
      this.editedCamping = { ...this.editingCamping }; // Reset editedCamping to original
    },

    // Method to confirm deletion
    confirmDelete(campingId) {
      this.showConfirmDelete = true;
      this.campingToDelete = campingId;
    },

    // Method to cancel deletion
    cancelDelete() {
      this.showConfirmDelete = false;
      this.campingToDelete = null;
    },

    // Method to delete camping
    deleteCamping() {
      fetch(`https://sunwoodsapi.azurewebsites.net/Camping/${this.campingToDelete}`, {
        method: "DELETE"
      })
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to delete camping");
        }
        return response.text(); // Read response as text
      })
      .then(data => {
        console.log("Camping deleted: ", data); // Log response as text
        // If response indicates success, you can handle it accordingly
        // For example, update UI or fetch campings again
        this.fetchCampings(); // Assuming you have a method to fetch campings
        this.showConfirmDelete = false; // Hide the confirmation dialog
        this.campingToDelete = null; // Reset the campingToDelete
      })
      .catch(error => {
        console.error("Error deleting camping:", error);
      });
    }
  }
};
</script>