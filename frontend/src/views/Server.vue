<template>
  <div class="Serverstats">
    <div v-if="servers === null">
      <div v-if="updateError.status === null" class="spinner-border text-primary" role="status">
        <span class="sr-only">Loading...</span>
      </div>
      <p v-if="updateError.status === null">Waiting for data (6 seconds to prevent spam)</p>
      <p v-else>Something went wrong while getting the data look at the console for me info</p>
    </div>
    <div v-else>
      <div class="servers" v-for="(server,i) in servers" :key="i">
        <mdb-Collapse
          :toggleTag="['button']"
          :togglers="2"
          :toggleClass="['btn btn-primary', 'btn-primary']"
          :toggleText="[server.Name]"
        >
          <b-card>
            <p>
              Usercount: {{ server.MemberCount }}
              <br />
              Owner: {{ server.Owner }}
            </p>
          </b-card>
        </mdb-Collapse>
      </div>
    </div>
  </div>
</template>
<style scoped>
dt {
  color: white;
}

dl {
  margin-top: 7rem;
}
.Serverstats {
  margin-top: 2.8rem;
}
</style>
<script>
// @ is an alias to /src

import { mdbCollapse } from "mdbvue";
export default {
  name: "Serverstats",
  components: {
    mdbCollapse
  },
  mounted: function() {
    this.update();
    this.metaInfo;
  },
  methods: {
    update() {
      let source = new EventSource("/backend/ServerUpdate/");

      source.addEventListener(
        "open",
        () => {
          return (this.updateError.status = false);
        },
        false
      );

      source.addEventListener(
        "message",
        e => {
          let data = JSON.parse(e.data);
          if (document.getElementsByClassName("Serverstats").length === 0)
            return source.close();
          this.servers = data.list;
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
      }, 7000);
    }
  },
  metaInfo() {
    return {
      meta: [
        {
          name: "description",
          content: "This page shows some stats about Servers my bot is in",
          vmid: "description"
        },
        {
          itemprop: "description",
          content: "This page shows some stats about Servers my bot is in",
          vmid: "itemprop:description"
        },
        {
          property: "og:description",
          content: "This page shows some stats about Servers my bot is in",
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
          content: "This page shows some stats about Servers my bot is in",
          vmid: "twitter:description"
        }
      ]
    };
  },
  data() {
    return {
      servers: null,
      updateError: {
        status: null
      }
    };
  }
};
</script>