<template>
  <div id="app">
    <nav class="navbar navbar-expand-md fixed-top navbar-dark bg-dark">
      <router-link class="navbar-brand" to="/">Price Monitor</router-link>
      <button class="navbar-toggler p-0 border-0" type="button" data-toggle="offcanvas">
        <span class="navbar-toggler-icon"></span>
      </button>
    </nav>
    <router-view class="mt-5" />
  </div>
</template>

