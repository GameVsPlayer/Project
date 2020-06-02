<template>
<body>
  <div id="app">
    <router-view />
    <Navbar error="this.$store.state.error"></Navbar>
  </div>
  <particles></particles>
</body>
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap");

#app {
  font-family: "Roboto", Helvetica, Arial, sans-serif;
  margin-top: 2rem;
  text-align: center;
  color: white;
  margin-bottom: 5%;
  height: 100%;
  width: 100%;
  z-index: 1;
  position: relative;
}

html,
body {
  background-color: rgb(20, 20, 20);
  color: white !important;
  font-family: "Roboto Slab" !important;
  width: 80%;
  margin-left: auto;
  margin-right: auto;
}

* {
  font-size: 30px;

  h1,
  h2,
  h3,
  h4 {
    font-weight: bold;
  }

  h1 {
    font-size: 1.5em;
  }

  h2 {
    font-size: 1.3em;
  }

  h3 {
    font-size: 1.1em;
  }

  h4 {
    font-size: 1em;
  }
}

@media (max-width: 480px) {
  * {
    font-size: 15px;
  }
}

@import url("https://fonts.googleapis.com/css?family=Roboto+Slab");
</style>
<script>
import Navbar from "@/components/navbar.vue";
import particles from "@/components/particles.vue";

export default {
  name: "app",
  components: {
    Navbar,
    particles
  },
  metaInfo() {
    return {
      meta: [
        {
          name: "description",
          content: "This is my small website used for links and my bot",
          vmid: "description"
        },
        {
          name: "theme-color",
          content: "#0085f1",
          vmid: "theme-color"
        },
        {
          itemprop: "description",
          content: "This is my small website used for links and my bot",
          vmid: "itemprop:description"
        },
        {
          property: "og:description",
          content: "This is my small website used for links and my bot",
          vmid: "og:description"
        },
        {
          property: "og:title",
          content: document.title,
          vmid: "og:title"
        },
        {
          property: "og:url",
          content: "https://gamu.tk" + window.location.pathname,
          vmid: "og:url"
        },
        {
          property: "og:image",
          content: "https://gamu.tk/assets/android-chrome-512x512.png",
          vmid: "og:image"
        },
        {
          property: "og:site_name",
          content: "Gamu.tk",
          vmid: "og:site_name"
        },
        {
          property: "og:type",
          content: "website",
          vmid: "og:type"
        },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1.0"
        },
        {
          name: "Content-Language",
          content: "en-us"
        },
        {
          chartest: "UTF-8"
        },
        {
          name: "keywords",
          content:
            "Programming,Gaming,Streaming,Minecraft,LiveStreaming,custom,entertainment"
        },
        {
          name: "twitter:title",
          content: document.title
        },
        {
          name: "twitter:site",
          content: "@GameVsPlayer",
          vmid: "twitter:site"
        },
        {
          name: "twitter:description",
          content: "This is my small website used for links and my bot",
          vmid: "twitter:description"
        },
        {
          name: "twitter:card",
          content: "summary_large_image",
          vmid: "twitter:card"
        },
        {
          name: "twitter:image",
          content: "https://gamu.tk/assets/android-chrome-512x512.png",
          vmid: "twitter:image"
        }
      ]
    };
  },
  beforeCreate() {
    this.metaInfo;
  }
};
</script>