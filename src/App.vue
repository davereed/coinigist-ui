<template>
  <div id="app">

    <b-navbar toggleable="md" type="dark" variant="dark">

      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

      <b-navbar-brand><router-link class="navbar-brand" to="/home">Coinigist</router-link></b-navbar-brand>

      <b-collapse is-nav id="nav_collapse">

        <b-navbar-nav>
          <b-nav-item><router-link class="nav-link" to="/home">Dashboard</router-link></b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">

          <b-nav-item-dropdown right v-if="authenticated" :text="profile.name">
            <b-dropdown-item><router-link to="/profile">Profile</router-link></b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item><a href="#" @click="logout()">Logout</a></b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>

        <button
          id="qsLoginBtn"
          class="btn btn-primary btn-margin"
          v-if="!authenticated"
          @click="login()">
            Log In
        </button>

      </b-collapse>
    </b-navbar>

    <div class="mt-5">
      <router-view
        :auth="auth"
        :authenticated="authenticated"
        :profile="profile">
      </router-view>
    </div>

  </div>
</template>


<script>
import axios from 'axios';
import AuthService from './auth/AuthService';

const auth = new AuthService();

const {
  login, logout, authenticated, authNotifier, profile,
} = auth;

export default {
  name: 'app',
  data() {
    authNotifier.on('authChange', (authState) => {
      this.authenticated = authState.authenticated;
      this.profile = authState.profile;
      axios.defaults.headers.common.Authorization = 'Bearer ' + localStorage.getItem('id_token');
    });
    return {
      auth,
      authenticated,
      profile,
    };
  },
  methods: {
    login,
    logout,
  },
  mounted() {
    axios.defaults.headers.common.Authorization = 'Bearer ' + localStorage.getItem('id_token');
  },
};
</script>

<style>
</style>
