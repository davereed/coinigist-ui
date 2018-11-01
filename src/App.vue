<template>
  <div id="app">
    <nav class="navbar navbar-expand-md fixed-top navbar-dark bg-dark">
      <router-link class="navbar-brand" to="/">Price Monitor</router-link>
      <button class="navbar-toggler p-0 border-0" type="button" data-toggle="offcanvas">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="navbar-collapse offcanvas-collapse" id="navbarsExampleDefault">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <router-link class="nav-link" to="/">Dashboard</router-link>
          </li>
        </ul>
      </div>
      <ul class="navbar-nav">
        <li class="nav-item float-right">
          <button
            id="qsLoginBtn"
            class="btn btn-primary btn-margin"
            v-if="!authenticated"
            @click="login()">
              Log In
          </button>

          <button
            id="qsLogoutBtn"
            class="btn btn-primary btn-margin"
            v-if="authenticated"
            @click="logout()">
              Log Out
          </button>
        </li>
      </ul>
    </nav>
    <div class="mt-5">
      <router-view
        :auth="auth"
        :authenticated="authenticated">
      </router-view>
    </div>

  </div>
</template>


<script>
import AuthService from './auth/AuthService';

const auth = new AuthService();

const {
  login, logout, authenticated, authNotifier,
} = auth;

export default {
  name: 'app',
  data() {
    authNotifier.on('authChange', (authState) => {
      this.authenticated = authState.authenticated;
    });
    return {
      auth,
      authenticated,
    };
  },
  methods: {
    login,
    logout,
  },
};
</script>

<style>

</style>
