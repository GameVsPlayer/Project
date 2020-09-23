<template>
  <div class="PNF">
    <h2>The Requested Page or File could <b>Not</b> be found</h2>
  </div>
</template>

<script>
  // @ is an alias to /src

  export default {
    name: "PageNotFound",
    components: {},
    metaInfo() {
      return {
        meta: [{
            name: "description",
            content: "This page doesn't exist",
            vmid: "description"
          },
          {
          itemprop: "description",
          content: "This page doesn't exist",
          vmid: "itemprop:description"
        },
          {
            property: "og:description",
            content: "This page doesn't exist",
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
            content: "@GameVsPlayer"
          },
          {
            name: "twitter:description",
            content: "This page doesn't exist",
            vmid: "og:description"
          },
        ]
      }
    },
    mounted() {
      this.metaInfo;
    }
  };
</script>
<style scoped>
  .PNF {
    margin-top: 8rem;
  }
</style>