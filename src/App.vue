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
    </nav>
    <router-view class="mt-5" />
  </div>
</template>

