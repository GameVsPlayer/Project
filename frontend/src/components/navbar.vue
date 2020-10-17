<template>
  <mdb-container>
    <mdb-navbar color="navbar-dark nav-color" position="top">
      <mdb-navbar-brand class="brand" to="/">Gamu</mdb-navbar-brand>
      <mdb-navbar-toggler>
        <mdb-navbar-nav>
          <router-link class="navbar-link" to="/stats/">Stats</router-link>
          <router-link class="navbar-link" to="/commands/">Commands</router-link>
          <router-link class="navbar-link" to="/inv/">Invite</router-link>
          <router-link class="navbar-link" to="/langs/">Langs</router-link>
          <router-link class="navbar-link" to="/social/">Social</router-link>
          <router-link class="navbar-link" to="/serverstats/">Server Stats</router-link>
          <router-link class="navbar-link" to="/todo/">Todolist</router-link>
          <router-link class="navbar-link" rel="nofollow" to="/imprint/">Imprint</router-link>
          <template v-if="error">
            <router-link class="eActive" to="#">Error</router-link>
          </template>
        </mdb-navbar-nav>
      </mdb-navbar-toggler>
    </mdb-navbar>
  </mdb-container>
</template>
<script>
import {
  mdbNavbar,
  mdbContainer,
  mdbNavbarBrand,
  mdbNavbarToggler,
  mdbNavbarNav,
} from "mdbvue";
export default {
  name: "Navbar",
  components: {
    mdbNavbar,
    mdbNavbarBrand,
    mdbNavbarToggler,
    mdbNavbarNav,
    mdbContainer,
  },

  computed: {
    error: function () {
      return this.$store.state.error;
    },
  },
};
</script>
<style scoped>
.nav-color {
  background-color: rgb(0, 133, 241);
}

.navbar-dark .navbar-nav .nav-link.active {
  background-color: rgb(0, 155, 255);
  height: 100%;
}

.navbar {
  min-height: 2rem;
  padding: 0px;
  width: max-content;
  margin-left: 0;
}

.navbar-dark .navbar-nav .nav-link {
  padding-left: 16px;
}

.navbar {
  width: 100%;
}
.router-link-active {
  color: white;
  opacity: 1;
}

a,
a.nav-link {
  font-size: 0.9em;
  padding: 0.3rem;
  color: white;
  opacity: 0.5;
}
mdb-container {
  position: relative;
}
a.eActive {
  opacity: 1;
}
.brand {
  padding-left: 0.3rem;
}
</style>