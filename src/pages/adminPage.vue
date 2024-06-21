<template>
  <div class="container mx-auto p-4">
<!-- Dropdown buttons -->
<div class="flex flex-col items-center space-y-2 mb-4">
  <button
    @click="toggleSection('campings')"
    :class="{
      'bg-gradient-to-r from-blue-500 to-indigo-500 text-white': activeSection === 'campings',
      'bg-gray-100 text-gray-700': activeSection !== 'campings'
    }"
    class="py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105"
    style="width: 200px;"
  >
    Campings
  </button>
  <button
    @click="toggleSection('ratings')"
    :class="{
      'bg-gradient-to-r from-blue-500 to-indigo-500 text-white': activeSection === 'ratings',
      'bg-gray-100 text-gray-700': activeSection !== 'ratings'
    }"
    class="py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105"
    style="width: 200px;"
  >
    Ratings
  </button>
  <button
    @click="toggleSection('usersA')"
    :class="{
      'bg-gradient-to-r from-blue-500 to-indigo-500 text-white': activeSection === 'usersA',
      'bg-gray-100 text-gray-700': activeSection !== 'usersA'
    }"
    class="py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105"
    style="width: 200px;"
  >
    Users
  </button>
</div>


    <!-- Campings section -->
     <div v-if="activeSection === 'campings'">
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
     </div>
     <br>
    <div
      v-if="activeSection === 'campings'"
      class="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
    
      <div
        v-for="camping in campings"
        :key="camping.id"
        class="bg-white border border-gray-200 rounded-lg shadow-md p-6"
      >
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
        <button
          @click="toggleEditForm(camping)"
          class="m-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Edit
        </button>
        <!-- Delete button -->
        <button
          @click="confirmDelete(camping.id, 'campings')"
          class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Delete
        </button>

        <!-- Edit form -->
        <div
          v-if="editingCamping && editingCamping.id === camping.id"
          class="mt-4"
        >
          <h2 class="text-lg font-semibold mb-2">Edit Camping</h2>
          <form @submit.prevent="saveEditedCamping" class="space-y-4">
            <div>
              <label class="block text-gray-700">Title:</label>
              <input
                type="text"
                v-model="editedCamping.title"
                required
                class="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label class="block text-gray-700">Location:</label>
              <input
                type="text"
                v-model="editedCamping.location"
                required
                class="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label class="block text-gray-700">Description:</label>
              <textarea
                v-model="editedCamping.description"
                class="w-full p-2 border border-gray-300 rounded"
              ></textarea>
            </div>
            <div>
              <label class="block text-gray-700">Available From:</label>
              <input
                type="date"
                v-model="editedCamping.availableFrom"
                required
                class="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label class="block text-gray-700">Available To:</label>
              <input
                type="date"
                v-model="editedCamping.availableTo"
                required
                class="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label class="block text-gray-700">Price per Night:</label>
              <input
                type="number"
                v-model="editedCamping.pricePerNight"
                required
                class="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label class="block text-gray-700">Available:</label>
              <input
                type="number"
                v-model="editedCamping.availableSpots"
                required
                class="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label class="block text-gray-700">Image URL:</label>
              <input
                type="text"
                v-model="editedCamping.imageURL"
                class="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div class="flex space-x-4">
              <button
                type="submit"
                class="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
              >
                Save Changes
              </button>
              <button
                @click="cancelEdit"
                class="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
        
        
      </div>
     

  
</div>
    <!-- Ratings section -->
    <div
      v-if="activeSection === 'ratings'"
      class="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      <div
        v-for="rating in ratings"
        :key="rating.id"
        class="bg-white border border-gray-200 rounded-lg shadow-md p-6"
      >
      <h1 class="text-2xl font-semibold mb-2">{{ getCampingName(rating.campingId) }}</h1>

        <h2 class="text-2xl font-semibold mb-2">{{ rating.title }}</h2>
        <h3 class="text-xl text-gray-600 mb-4">{{ rating.comment }}</h3>
        <div class="flex justify-between mb-4">
          <div>
            <h2 class="text-sm font-semibold text-gray-500">Rating</h2>
            <span class="text-gray-700">{{ rating.rate }}</span>
          </div>
          <div>
            <h2 class="text-sm font-semibold text-gray-500">User</h2>
            <span class="text-gray-700">{{ getUserName(rating.userId) }}</span>
          </div>
        </div>

        <!-- Delete button -->
        <button
          @click="confirmDelete(rating.id, 'ratings')"
          class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div
      v-if="showConfirmDelete"
      class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-4">Confirm Deletion</h2>
        <p class="mb-4">Are you sure you want to delete this item?</p>
        <div class="flex justify-end space-x-4">
          <button
            @click="cancelDelete"
            class="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            @click="deleteItem"
            class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
     <!-- Users section -->
     <div v-if="activeSection === 'usersA'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="user in usersA" :key="user.id" class="bg-white border border-gray-200 rounded-lg shadow-md p-6">
        <h1 class="text-2xl font-semibold mb-2">{{ user.userName }}</h1>
        <h2 class="text-xl text-gray-600 mb-4">{{ user.email }}</h2>
        <div class="flex justify-between mb-4">
          <button
            v-if="user.roles === 0"
            @click="confirmRoleChange(user.id, 'makeAdmin')"
            class="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          >
            Make Admin
          </button>
          <button
            v-else
            @click="confirmRoleChange(user.id, 'makeUser')"
            class="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600"
          >
            Make User
          </button>
        </div>
        <!-- Delete button -->
        <button
          @click="confirmDelete(user.id, 'usersA')"
          class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showConfirmRoleChange" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-4">Confirm Role Change</h2>
        <p class="mb-4">{{ roleChangeMessage }}</p>
        <div class="flex justify-end space-x-4">
          <button @click="cancelRoleChange" class="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">
            Cancel
          </button>
          <button @click="changeUserRole" class="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
            Confirm
          </button>
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
      ratings: [],
      usersA: [],

      users: {},
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
        group: null,
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
        group: null,
      },
      showConfirmDelete: false,
      itemToDelete: null,
      itemTypeToDelete: null,
      activeSection: null,
      showConfirmRoleChange: false,
      userIdToChangeRole: null,
      newRole: null,
      roleChangeMessage: '',
    };
  },
  created() {
    this.fetchCampings();
    this.fetchRatings();
    this.fetchUsers();
  },
  methods: {
    confirmRoleChange(userId, action) {
      this.userIdToChangeRole = userId;
      this.newRole = action === 'makeAdmin' ? 1 : 0;
      this.roleChangeMessage = action === 'makeAdmin' 
        ? 'Are you sure you want to make this user an admin?' 
        : 'Are you sure you want to revert this user to a regular user?';
      this.showConfirmRoleChange = true;
    },
    cancelRoleChange() {
      this.showConfirmRoleChange = false;
      this.userIdToChangeRole = null;
      this.newRole = null;
      this.roleChangeMessage = '';
    },
    changeUserRole() {
  const userId = this.userIdToChangeRole;
  fetch(`https://localhost:43203/User/${userId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }
      return response.json();
    })
    .then(user => {
      // Modify the roles field
      user.roles = this.newRole;

      // Send the updated user object
      return fetch(`https://localhost:43203/User/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to change user role');
      }
      return response.text();
    })
    .then(() => {
      // Update the user role in the local usersA array
      const user = this.usersA.find(user => user.id === this.userIdToChangeRole);
      if (user) {
        user.roles = this.newRole;
      }
      this.cancelRoleChange();
    })
    .catch(error => {
      console.error('Error changing user role:', error);
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
      
      fetch("https://localhost:43203/Camping", {
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
    formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
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
    fetchCampings() {
      fetch('https://localhost:43203/Camping')
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch campings');
          }
          return response.json();
        })
        .then((data) => {
          this.campings = data;
        })
        .catch((error) => {
          console.error('Error fetching campings:', error);
        });
    },
    fetchRatings() {
      fetch('https://localhost:43203/Rating')
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch ratings');
          }
          return response.json();
        })
        .then((data) => {
          this.ratings = data;
        })
        .catch((error) => {
          console.error('Error fetching ratings:', error);
        });
    },
    fetchUsers() {
      fetch('https://localhost:43203/User')
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch users');
          }
          return response.json();
        })
        .then((data) => {
          this.usersA = data;

          this.users = data.reduce((acc, user) => {
            acc[user.id] = user.userName;
            return acc;
          }, {});
        })
        .catch((error) => {
          console.error('Error fetching users:', error);
        });
    },
    getUserName(userId) {
      return this.users[userId] || 'Unknown User';
    },
    getCampingName(campingId) {
      const camping = this.campings.find(c => c.id === campingId);
      return camping ? camping.title : 'Unknown Camping';
    },
    toggleEditForm(camping) {
    if (this.editingCamping && this.editingCamping.id === camping.id) {
      this.cancelEdit();
    } else {
      this.editingCamping = camping;
      // Convert API date format (YYYY-MM-DD) to expected format (DD-MM-YYYY) for editing
      this.editedCamping = {
        ...camping,
        availableFrom: this.convertDateFormatForEdit(camping.availableFrom),
        availableTo: this.convertDateFormatForEdit(camping.availableTo)
      };
    }
  },
  saveEditedCamping() {
    // Convert date format back to API format (YYYY-MM-DD)
    const editedCamping = {
      ...this.editedCamping,
      availableFrom: this.convertDateFormatForSave(this.editedCamping.availableFrom),
      availableTo: this.convertDateFormatForSave(this.editedCamping.availableTo)
    };

    fetch(`https://localhost:43203/Camping/${this.editingCamping.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(editedCamping)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to save changes");
      }
      return response.text(); // Assuming API returns JSON response
    })
    .then(data => {
      console.log("Changes saved: ", data);
      this.fetchCampings(); // Fetch updated campings
      this.editingCamping = null; // Exit edit mode
    })
    .catch(error => {
      console.error("Error saving changes:", error);
    });
  },
  convertDateFormatForEdit(dateString) {
    if (!dateString) return ''; // Handle case where date string is null or undefined
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  },

  // Method to convert date format for saving (input type="date" format to API format)
  convertDateFormatForSave(dateString) {
    if (!dateString) return ''; // Handle case where date string is null or undefined
    const [day, month, year] = dateString.split('-');
    return `${year}-${month}-${day}`;
  },


    cancelEdit() {
      this.editingCamping = null;
      this.editedCamping = {
        title: '',
        location: '',
        description: '',
        availableFrom: '',
        availableTo: '',
        pricePerNight: 0,
        availableSpots: 0,
        imageUrl: '',
        group: null,
      };
    },
    confirmDelete(itemId, itemType) {
      this.itemToDelete = itemId;
      this.itemTypeToDelete = itemType;
      this.showConfirmDelete = true;
    },
    cancelDelete() {
      this.showConfirmDelete = false;
      this.itemToDelete = null;
      this.itemTypeToDelete = null;
    },
    deleteItem() {
  let url;

  // Determine the URL based on the item type
  if (this.itemTypeToDelete === 'campings') {
    url = `https://localhost:43203/Camping/${this.itemToDelete}`;
  } else if (this.itemTypeToDelete === 'ratings') {
    url = `https://localhost:43203/Rating/${this.itemToDelete}`;
  } else if (this.itemTypeToDelete === 'usersA') {
    url = `https://localhost:43203/User/${this.itemToDelete}`;
  } else {
    console.error('Invalid item type for deletion');
    return;
  }

  fetch(url, {
    method: 'DELETE',
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error('Failed to delete item');
    }

    // Update the relevant list based on the item type
    if (this.itemTypeToDelete === 'campings') {
      this.campings = this.campings.filter(
        (camping) => camping.id !== this.itemToDelete
      );
    } else if (this.itemTypeToDelete === 'ratings') {
      this.ratings = this.ratings.filter(
        (rating) => rating.id !== this.itemToDelete
      );
    } else if (this.itemTypeToDelete === 'usersA') {
      this.usersA = this.usersA.filter(
        (user) => user.id !== this.itemToDelete
      );
    }

    this.cancelDelete();
  })
  .catch((error) => {
    console.error('Error deleting item:', error);
  });
},
    toggleSection(section) {
      this.activeSection = this.activeSection === section ? null : section;
    },
  },
};
</script>

<style>
/* Add any custom styles here */
</style>
