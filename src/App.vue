<template>
  <div id="app" class="flex flex-col h-screen">
    <nav class="relative bg-gray-900 p-4 sm:p-8 text-center top-0 w-full z-50">
      <div class="absolute left-4 top-2 sm:top-4 flex items-center space-x-2 sm:space-x-4">
        <router-link to="/">
          <img src="../src/assets/c_logo.png" class="w-12 sm:w-16 mr-2">
        </router-link>
        <router-link to="/">
          <h1 class="text-white text-lg sm:text-xl font-bold">Sun Woods</h1>
        </router-link>
      </div>

      <div class="flex justify-center mt-12 sm:mt-0">
        <ul class="flex flex-wrap justify-center items-center space-x-2 sm:space-x-4 lg:space-x-8">
          <li v-if="!isMobile">
            <router-link to="/" class="text-white hover:text-slate-400 font-bold" :style="getActiveStyling('HOME')">
              HOME
            </router-link>
          </li>
          <li v-for="(page, index) in pages" :key="index">
            <router-link
            :to="`/${page.toLowerCase()}`"
            class="text-white font-bold hover:text-slate-400"
            :style="getActiveStyling(page)" @click="changeActivePage(page)" >
            {{ page }}
          </router-link>
          
          
          </li>
          <li v-if="!isMobile">
            <router-link to="/map" class="text-white hover:text-slate-400 font-bold" :style="getActiveStyling('MAP')">
              MAP
            </router-link>
          </li>
          <li v-if="userExists">
            <router-link to="/bookings" class="text-white hover:text-slate-400 font-bold" :style="getActiveStyling('BOOKINGS')">
              BOOKINGS
            </router-link>
          </li>

          <li v-if="isAdmin">
            <router-link to="/admin" class="text-white hover:text-slate-400 font-bold" :style="getActiveStyling('ADMIN')">
              Admin
            </router-link>
          </li>

          <li v-if="!isLoggedIn || !userExists">
            <a class="text-white hover:text-slate-400 font-bold" href="#" @click="showLoginPageM">
              LOGIN
            </a>
          </li>

          <li v-if="userExists || isAuthenticated" class="relative">
            <a class="text-white hover:text-slate-400 font-bold flex items-center cursor-pointer" @click.prevent="showSubmenu = !showSubmenu">
              <span v-if="userExists" class="text-sm">Welcome,<br>{{ user.userName }}</span>
              <span v-if="$auth.isAuthenticated" class="text-sm">Welcome,<br>{{ this.$auth.user.name }}</span>
              <img src="../src/assets/pf_icon.png" class="w-10 h-10 ml-3">
            </a>
            <ul v-if="showSubmenu" class="border border-gray-300 bg-white absolute top-10 left-0 w-32 py-2 z-10 rounded-lg shadow-lg">
              <li>
                <router-link 
                  :to="{ path: '/account', name: 'Account', params: { user: user } }" 
                  class="block text-black hover:text-slate-400 font-semibold px-4 py-2">
                  Account
                </router-link>
              </li>

              <li>
                <router-link to="/bookings" class="block text-black hover:text-slate-400 font-semibold px-4 py-2">Bookings</router-link>
              </li>
              <li>
                <a class="block text-black hover:text-slate-400 font-semibold px-4 py-2" href="#" @click="logOut">Log Out</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>

    <!-- PAGES -->
    <router-view></router-view>

   <!-- LOGIN DIV -->
<div v-if="showLogin" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
  <div class="bg-white p-8 rounded-3xl shadow-lg w-11/12 md:w-96 relative">
    <button @click="showLogin = false" class="absolute top-3 right-3 text-gray-600 hover:text-gray-900 focus:outline-none">
      <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>

    <form @submit.prevent="login" v-show="!showCreateAccount && !showResetPassword" class="space-y-6">
      <h3 class="text-2xl font-semibold text-center">LOG IN</h3>
      <div v-if="loginSuccess" class="text-green-600 text-sm font-semibold">{{ loginStatus }}</div>

      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
        <input v-model="loginForm.email" type="email" placeholder="Email" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2" id="email" required>
      </div>
      
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
        <div class="relative">
          <input v-model="loginForm.password" :type="passwordFieldType" placeholder="Password" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2" id="password" required>
          <button @click="togglePasswordVisibility" type="button" class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 focus:outline-none">
            <!-- Use a condition to show different icons based on passwordFieldType -->
            <svg v-if="passwordFieldType === 'password'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2 12s3-6 10-6 10 6 10 6-3 6-10 6-10-6-10-6z" />
            </svg>
            <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15l-4.586 4.586a2 2 0 01-2.828-2.828L9.172 12l-4.586-4.586a2 2 0 012.828-2.828L12 9.172l4.586-4.586a2 2 0 012.828 2.828L14.828 12l4.586 4.586a2 2 0 01-2.828 2.828L12 14.828l-4.586 4.586a2 2 0 01-2.828-2.828L9.172 12z" />
            </svg>
          </button>
        </div>
      </div>
      
      
      
      
      <div v-if="loginError" class="text-red-600 text-sm">{{ loginStatus }}</div>
      <a href="#" @click="showResetPassword = true" class="text-blue-500 text-sm">Forgot Password?</a>

      <div class="flex justify-between items-center">
        <button type="submit" class="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">Login</button>
        <a href="#" @click="showRegisterM" class="text-blue-500 text-sm">Create Account</a>
      </div>
    </form>

    <!-- Create Account Form -->
    <form v-show="showCreateAccount" @submit.prevent="createAccount" class="space-y-6">
      <h3 class="text-2xl font-semibold text-center">Create Account</h3>
      <div>
        <label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label>
        <input v-model="createAccountForm.firstName" type="text" placeholder="First Name" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2" id="firstName" required>
      </div>

      <div>
        <label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label>
        <input v-model="createAccountForm.lastName" type="text" placeholder="Last Name" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2" id="lastName" required>
      </div>

      <div>
        <label for="userName" class="block text-sm font-medium text-gray-700">UserName</label>
        <input v-model="createAccountForm.userName" type="text" placeholder="UserName" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2" id="userName" required>
      </div>

      <div>
        <label for="emailR" class="block text-sm font-medium text-gray-700">Email</label>
        <input v-model="createAccountForm.email" type="email" placeholder="Email" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2" id="emailR" required>
      </div>
      
      <div>
        <label for="passwordRegister" class="block text-sm font-medium text-gray-700">Password</label>
        <div class="relative">
          <input v-model="createAccountForm.hashedPassword" :type="passwordFieldType" placeholder="Password" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2" id="passwordRegister" required>
          <button @click="togglePasswordVisibility" type="button" class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 focus:outline-none">
            <!-- Use a condition to show different icons based on passwordFieldType -->
            <svg v-if="passwordFieldType === 'password'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2 12s3-6 10-6 10 6 10 6-3 6-10 6-10-6-10-6z" />
            </svg>
            <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15l-4.586 4.586a2 2 0 01-2.828-2.828L9.172 12l-4.586-4.586a2 2 0 012.828-2.828L12 9.172l4.586-4.586a2 2 0 012.828 2.828L14.828 12l4.586 4.586a2 2 0 01-2.828 2.828L12 14.828l-4.586 4.586a2 2 0 01-2.828-2.828L9.172 12z" />
            </svg>
          </button>
        </div>
      </div>
      

      <div>
        <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm Password</label>
        <div class="relative">
          <input v-model="createAccountForm.confirmPassword" :type="passwordFieldType" placeholder="Password" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2" id="confirmPassword" required>
          <button @click="togglePasswordVisibility" type="button" class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 focus:outline-none">
            <!-- Use a condition to show different icons based on passwordFieldType -->
            <svg v-if="passwordFieldType === 'password'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2 12s3-6 10-6 10 6 10 6-3 6-10 6-10-6-10-6z" />
            </svg>
            <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15l-4.586 4.586a2 2 0 01-2.828-2.828L9.172 12l-4.586-4.586a2 2 0 012.828-2.828L12 9.172l4.586-4.586a2 2 0 012.828 2.828L14.828 12l4.586 4.586a2 2 0 01-2.828 2.828L12 14.828l-4.586 4.586a2 2 0 01-2.828-2.828L9.172 12z" />
            </svg>
          </button>
        </div>
      </div>
      

      <div v-if="loginSuccess" class="text-green-600 text-sm">{{ loginStatus }}</div>

      <div v-if="loginError" class="text-red-600 text-sm">{{ loginStatus }}</div>

      <div class="flex justify-between items-center">
        <button type="submit" class="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">Register</button>
        <a href="#" @click="showLoginPageM" class="text-blue-500 text-sm">Back to Login</a>
      </div>
    </form>

       <!-- Reset password form -->
  <form v-show="showResetPassword" @submit.prevent="sendResetPasswordEmail" class="space-y-6">
    <h3 class="text-2xl font-semibold text-center">Reset Password</h3>
    <label for="resetEmail" class="block text-sm font-medium text-gray-700">Email</label>
    <input v-model="resetPasswordForm.email" type="email" placeholder="Email" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2" id="resetEmail" required>

    <!-- Toggle visibility of reset password fields -->
    <template v-if="!showResetCode">
      <button type="submit" class="bg-blue-500 text-white py-2 px-4 rounded mb-4">Send Reset Email</button>
    </template>
  
    <!-- Security code and new password fields -->
    <template v-if="showResetCode">
      <label for="resetCode" class="block text-sm font-medium text-gray-700">Security Code</label>
      <input v-model="resetPasswordForm.code" type="text" placeholder="Security Code" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2" id="resetCode" required>

      <label for="newPassword" class="block text-sm font-medium text-gray-700">New Password</label>
      <div class="relative">
        <input v-model="resetPasswordForm.newPassword" :type="passwordFieldType" placeholder="Password" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2" id="newPassword" required>
        <button @click="togglePasswordVisibility" type="button" class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 focus:outline-none">
          <!-- Use a condition to show different icons based on passwordFieldType -->
          <svg v-if="passwordFieldType === 'password'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2 12s3-6 10-6 10 6 10 6-3 6-10 6-10-6-10-6z" />
          </svg>
          <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15l-4.586 4.586a2 2 0 01-2.828-2.828L9.172 12l-4.586-4.586a2 2 0 012.828-2.828L12 9.172l4.586-4.586a2 2 0 012.828 2.828L14.828 12l4.586 4.586a2 2 0 01-2.828 2.828L12 14.828l-4.586 4.586a2 2 0 01-2.828-2.828L9.172 12z" />
          </svg>
        </button>
      </div>
      
      <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm New Password</label>
      <div class="relative">
        <input v-model="resetPasswordForm.confirmPassword" :type="passwordFieldType" placeholder="Confirm Password" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2" id="confirmPassword" required>
        <button @click="togglePasswordVisibility" type="button" class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 focus:outline-none">
          <!-- Use a condition to show different icons based on passwordFieldType -->
          <svg v-if="passwordFieldType === 'password'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2 12s3-6 10-6 10 6 10 6-3 6-10 6-10-6-10-6z" />
          </svg>
          <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15l-4.586 4.586a2 2 0 01-2.828-2.828L9.172 12l-4.586-4.586a2 2 0 012.828-2.828L12 9.172l4.586-4.586a2 2 0 012.828 2.828L14.828 12l4.586 4.586a2 2 0 01-2.828 2.828L12 14.828l-4.586 4.586a2 2 0 01-2.828-2.828L9.172 12z" />
          </svg>
        </button>
      </div>
      
      
      
      <div class="text-red-600">{{ resetError }}</div>

      <button type="button" @click="verifySecurityCode" class="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">Update password</button>
    </template>

  <!-- Toggle visibility of send/reset buttons
  <a href="#" @click="showResetCode = !showResetCode">
    {{ showResetCode ? 'Back to Email' : 'Forgot Password?' }}

    
  </a> -->
  <br>
  <br>
  <a href="#" @click="back">Back</a>

</form>

      </div>
    </div>
  </div>
</template>




<script>


import axios from 'axios';

export default {
  created() {
    // Update the document title
    document.title = 'Sun Woods';
  },
  name: 'App',
 
  data() {
    return {
      activePage: "HOME",
      pages: ["CAMPING"],
      showLogin: false,
      showCreateAccount: false,
      loginForm: {
        email: '',
        password: ''
      },
      registerForm: { // Corrected from createAccountForm
      firstName: '',
      lastName: '',
      userName: '',
      email: '',
      hashedPassword: ''
    },
      createAccountForm: {
        firstName: '',
        lastName: '',
        userName: '',
        email: '',
        hashedPassword: '',
        confirmPassword: '' // Added confirmPassword

      },
      loginSuccess: false,
      loginError: false,
      loginStatus: null,
      loginStatusColor: '',
      user: JSON.parse(localStorage.getItem('user')) || null,
      isLoggedIn: localStorage.getItem('IsLoggedIn') === 'true' || false,
      showSubmenu: false,
      accountCreated: false,
      resetPasswordForm: {
        email: '',
        code: '',
        newPassword: '',
        confirmPassword: ''
      },
      showResetPassword: false,
      showResetCode: false,
      resetError: null,
      registerError: null,
      resetPasswordError: null,
      passwordFieldType: 'password' // Add this line

    };
  },
  computed: {
    userExists() {
      return this.user !== null;
    },
    isAuthenticated() {
      return this.$auth.isAuthenticated;
    },
    isAdmin() {
      return localStorage.getItem('isAdmin') === 'true';
    },
    isMobile() {
      return window.innerWidth <= 800;
    }
  },
  methods: {
    togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  },
    back() {
      this.loginStatus = '';
      this.loginForm.email = '';
      this.loginForm.password = '';
      if (this.showResetCode) {
        this.showResetCode = false;
        this.showResetPassword = true;
      } else {
        this.showResetPassword = false;
      }
    },
    async verifySecurityCode() {
      try {

        if(this.resetPasswordForm.newPassword !== this.resetPasswordForm.confirmPassword) {
      this.resetError = true;

      this.resetError = "Passwords do not match!";
      return;
    } 
    
    else if (!this.isPasswordStrong(this.resetPasswordForm.newPassword)) {
      this.resetError = true;


      this.resetError = "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
      return;
    } 
    
    else {
      this.resetError = false;

      this.resetError = ''; // Clear error message if passwords match
    }

    
        const response = await axios.post('https://localhost:43203/User/resetpassword/verify', {
          email: this.resetPasswordForm.email,
          code: this.resetPasswordForm.code
        });

        if (response.status === 200 && response.data === "Code is correct!") {
          this.resetError = null;
          await this.resetPassword();
          this.loginSuccess = true;
          this.loginError = false;

          this.loginStatus = "Password has been updated!";
          this.resetPasswordForm.email = '';
          this.resetPasswordForm.newPassword = '';
          this.showResetPassword = false;
          this.showResetCode = false;
          this.resetPasswordForm.code = '';
        } else {
          this.resetError = "Invalid security code. Please enter the correct code.";
        }
      } catch (error) {
        console.error('Error verifying security code:', error);
        this.resetError = "Invalid security code. Please enter the correct code.";
      }
    },
    showResetPasswordForm() {
      this.loginForm.email = '';
      this.loginForm.password = '';
      this.resetPasswordForm.email = '';
      this.loginStatus = '';
      this.showResetCode = false;
      this.showResetPassword = true;
    },
    async sendResetPasswordEmail() {
      try {
        const response = await axios.post('https://localhost:43203/User/resetpassword', { email: this.resetPasswordForm.email });
        console.log('Reset password email sent successfully:', response.data);
        this.showResetCode = true;
        this.resetError = null;
      } catch (error) {
        console.error('Error sending reset password email:', error);
        this.resetError = "An error occurred while sending the reset password email.";
      }
    },
    async resetPassword() {
      try {
        const response = await axios.post('https://localhost:43203/User/resetpassword/update', {
          email: this.resetPasswordForm.email,
          newPassword: this.resetPasswordForm.newPassword
        });
        console.log('Password reset successfully:', response.data);
      } catch (error) {
        console.error('Error resetting password:', error);
        this.resetError = "An error occurred while resetting the password.";
      }
    },
    showLoginPageM() {
      this.loginStatus = '';
      this.showCreateAccount = false;
      this.showLogin = true;
      this.showResetPassword = false;
      this.showResetCode = false;
      this.createAccountForm.firstName = '';
      this.createAccountForm.lastName = '';
      this.createAccountForm.userName = '';
      this.createAccountForm.email = '';
      this.createAccountForm.hashedPassword = '';
      this.createAccountForm.confirmPassword = '';
      this.resetPasswordForm.email = '';
    },
    showLoginM() {
      this.loginStatus = '';
      this.showCreateAccount = false;
      this.createAccountForm.firstName = '';
      this.createAccountForm.lastName = '';
      this.createAccountForm.userName = '';
      this.createAccountForm.email = '';
      this.createAccountForm.hashedPassword = '';
      this.createAccountForm.confirmPassword = '';

    },
    showRegisterM() {
      this.loginStatus = '';
      this.showCreateAccount = true;
      this.loginForm.email = '';
      this.loginForm.password = '';
    },
    changeActivePage(page, data) {
  if (page === 'BOOKCAMPERS') {
    this.campingDetails = data.camping;
    this.activePage = page;
  } else {
    this.activePage = page;
  }
  console.log('Active Page:', this.activePage); // Add this line to log the active page
  this.$router.push({ path: `/${page.toLowerCase()}` }).catch(err => {
    if (err.name !== 'NavigationDuplicated') {
      throw err;
    }
  });
},



    goToAccountPage() {
      console.log("testr");
      this.activePage = 'ACCOUNT';
    },
    handleBookingSuccess() {
      this.activePage = 'BOOKING-SUCCESS';
    },
    getActiveStyling(page) {
  const currentPath = this.$route.path;
  if (currentPath === `/${page.toLowerCase()}` || (currentPath === '/' && page === 'HOME')) {
    return "text-decoration: underline; font-weight: bold; color: white;";
  }
  return "";
},
    async login() {
      try {
        this.loginStatus = '';

        const response = await axios.post('https://localhost:43203/User/login', this.loginForm);
        
        if (response.data && response.data.roles) {
          if (response.data.roles === 1) {
            localStorage.setItem('isAdmin', 'true');
          } else {
            localStorage.removeItem('isAdmin');
          }
        }
        
        localStorage.setItem('user', JSON.stringify(response.data));
        localStorage.setItem('IsLoggedIn', 'true');
        this.user = response.data;
        
        this.isLoggedIn = true;
        this.loginForm.email = '';
        this.loginForm.password = '';
        this.showLogin = false;
       
        location.reload();

      } catch (error) {
        console.error('Login failed:', error);
        this.loginError = true;
        this.loginSuccess = false;
        if (error.response && error.response.data) {
          this.loginStatus = error.response.data.message || 'Login credentials are incorrect!';
        } else {
          this.loginStatus = 'Login credentials are incorrect!';
        }

        this.loginForm.email = '';
        this.loginForm.password = '';
      }
    },
    async createAccount() {
  try {
    if (this.createAccountForm.hashedPassword !== this.createAccountForm.confirmPassword) {
      this.loginError = true;
      this.loginSuccess = false;
      this.loginStatus = "Passwords do not match!";
      return;
    } else if (!this.isPasswordStrong(this.createAccountForm.hashedPassword)) {
      this.loginError = true;
      this.loginSuccess = false;

      this.loginStatus = "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
      return;
    } else {
      this.loginError = false;
      this.loginStatus = ''; // Clear error message if passwords match
    }

    this.loginStatus = '';
    await axios.post('https://localhost:43203/User', {
      firstName: this.createAccountForm.firstName,
      lastName: this.createAccountForm.lastName,
      userName: this.createAccountForm.userName,
      email: this.createAccountForm.email,
      hashedPassword: this.createAccountForm.hashedPassword
    });

    this.user = null;
    this.isLoggedIn = false;
    this.createAccountForm = {
      firstName: '',
      lastName: '',
      userName: '',
      email: '',
      hashedPassword: '',
      confirmPassword: '' // Reset confirmPassword field
    };
    this.loginSuccess = true;
    this.loginError = false;
    this.loginStatus = "Account is created, log in!";
  } catch (error) {
    this.loginError = true;
    this.loginSuccess = false;

    this.loginStatus = error.response.data; // Set loginStatus to the error message received from the server
  }
},
isPasswordStrong(password) {
  const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
  return strongRegex.test(password);
},
    logOut() {
      localStorage.removeItem('user');
      localStorage.removeItem('IsLoggedIn');
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('selectedCamping');

      this.user = null;
      this.isLoggedIn = false;

     

      this.$router.push({ path: `/` }).catch(err => {
    if (err.name !== 'NavigationDuplicated') {
      throw err;
    }     
  });
  window.location.reload();
    },
    loginWithAuth() {
      this.$auth.loginWithRedirect();
      localStorage.setItem('IsLoggedIn', 'true');

      this.$auth.$watch('user', (user) => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user, null, 2));
          localStorage.setItem('IsLoggedIn', 'true');
        }
      });
    },
    logoutWithAuth() {
      this.$auth.logout({
        logoutParams: {
          returnTo: window.location.origin
        }
      });
    }
  }
};
</script>

<style>
.active-link {
  @apply text-white font-bold hover:text-slate-400;
}
.active-link:hover {
  @apply text-slate-400;
}
</style>
