<template>
  <div class="stats">
    <div v-if="updateError.status === null" class="spinner-border text-primary" role="status">
      <span class="sr-only">Loading...</span>
    </div>
    <dl v-if="updateError.status === null | updateError.status === false">
      <dt>
        Users:
        <span id="users"></span>
      </dt>
      <dt>
        Servers:
        <span id="servers"></span>
      </dt>
      <dt>
        CPU Usage:
        <span id="cpuUsage"></span>
      </dt>
      <dt>
        Current Uptime is:
        <span id="uptime"></span>
      </dt>
      <dt>
        Current usage is:
        <span id="usage"></span>
      </dt>
    </dl>
    <p v-else>Something went wrong while getting the data look at the console for me info</p>
  </div>
</template>
<style scoped>
dt {
  color: white;
}

.stats {
  margin-top: 2.7rem;
}
</style>
<script>
// @ is an alias to /src

export default {
  name: "stats",
  mounted: function() {
    this.update();
    this.metaInfo;
  },
  data() {
    return {
      updateError: {
        status: null
      }
    };
  },
  methods: {
    update() {
      let source = new EventSource("/backend/statsUpdate/");
      source.addEventListener(
        "message",
        function(e) {
          let data = JSON.parse(e.data);
          if (document.getElementsByClassName("stats").length == 0)
            return source.close();
          document.getElementById("users").innerHTML = data.users;
          document.getElementById("servers").innerHTML = data.servers;
          document.getElementById("cpuUsage").innerHTML = data.cpuUsage;
          document.getElementById("uptime").innerHTML = data.uptime;
          document.getElementById("usage").innerHTML = data.usage;
        },
        false
      );
      source.addEventListener(
        "open",
        () => {
          return (this.updateError.status = false);
        },
        false
      );
      source.addEventListener(
        "error",
        event => {
          if (event.readyState == EventSource.CLOSED) {
            return (this.updateError.status = true);
          }
        },
        false
      );
      setTimeout(() => {
        if (this.updateError.status === null) {
          return (this.updateError.status = true);
        }
      }, 2000);
    }
  },
  metaInfo() {
    return {
      meta: [
        {
          description: "description",
          content: "This page shows some stats about my bot",
          vmid: "description"
        },
        {
          property: "og:description",
          content: "This page shows some stats about my bot",
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
          name: "twitter:title",
          content: document.title,
          vmid: "twitter:title"
        },
        {
          name: "twitter:site",
          content: "@GameVsPlayer",
          vmid: "twitter:site"
        },
        {
          name: "twitter:description",
          content: "This page shows some stats about my bot",
          vmid: "twitter:description"
        }
      ]
    };
  }
};
</script>