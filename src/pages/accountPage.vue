<template>
  <div class="max-w-screen-xl mx-auto px-8 py-12">
    <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl mx-auto">
      <div class="flex items-center mb-8">
        <img src="../assets/profile.jpg" alt="Profile Picture" class="w-24 h-24 rounded-full mr-6">
        <div>
          <h2 class="text-2xl font-semibold">{{ editedUser.userName }}</h2>
          <p class="text-gray-600">{{ editedUser.email }}</p>
        </div>
      </div>
      <button @click="toggleEditMode" class="bg-blue-500 text-white py-2 px-4 rounded-lg mb-4">{{ readOnly ? 'Edit' : 'Cancel' }}</button>
      <form @submit.prevent="saveChanges" v-if="!readOnly">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <div>
            <label for="firstName" class="block text-lg font-semibold mb-2">First Name</label>
            <input id="firstName" type="text" v-model="editedUser.firstName" class="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:border-blue-500">
          </div>
          <div>
            <label for="lastName" class="block text-lg font-semibold mb-2">Last Name</label>
            <input id="lastName" type="text" v-model="editedUser.lastName" class="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:border-blue-500">
          </div>
          <div>
            <label for="userName" class="block text-lg font-semibold mb-2">User Name</label>
            <input id="userName" type="text" v-model="editedUser.userName" class="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:border-blue-500">
          </div>
          <div>
            <label for="email" class="block text-lg font-semibold mb-2">Email</label>
            <input id="email" type="email" v-model="editedUser.email" class="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:border-blue-500">
          </div>
        </div>
        <button type="submit" class="bg-blue-500 text-white py-2 px-4 rounded-lg mt-6">Save</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      readOnly: true,
      editedUser: this.getUser() // Load the user data
    };
  },
  methods: {
    getUser() {
      const userFromParams = this.$route.params.user;
      if (userFromParams) {
        return userFromParams;
      }
      const userFromLocalStorage = JSON.parse(localStorage.getItem('user'));
      if (userFromLocalStorage) {
        return userFromLocalStorage;
      }
      return {}; // Return an empty object if no user data is found
    },
    toggleEditMode() {
      if (this.readOnly) {
        // If entering edit mode, create a new copy of the user object
        this.editedUser = { ...this.getUser() };
      }
      this.readOnly = !this.readOnly;
    },
    async saveChanges() {
      try {
        console.log('Saving changes...');
        // Send a PUT request to update the user via the API endpoint
        await axios.put(`https://sunwoodsapi.azurewebsites.net/User/${this.editedUser.id}`, this.editedUser);
        console.log('Changes saved successfully.');

        // Update the user object in localStorage
        localStorage.setItem('user', JSON.stringify(this.editedUser));

        this.readOnly = true; // After saving, switch back to read-only mode
        location.reload();
      } catch (error) {
        console.error('Failed to save changes:', error);
        // Handle error appropriately
      }
    }
  }
};
</script>

<style scoped>
/* Add custom styles here if needed */
</style>
