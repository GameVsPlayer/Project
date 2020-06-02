<template>
  <div class="FBN">
    <h2>The Requested Page or File is forbidden be found</h2>
  </div>
</template>

<script>
  // @ is an alias to /src

  export default {
    name: "Forbidden",
    components: {},
    metaInfo() {
      return {
        meta: [{
            'name': 'description',
            content: 'This page is Forbidden',
            vmid: 'description'
          },
          {
          itemprop: "description",
          content: "This page is Forbidden",
          vmid: "itemprop:description"
        },
          {
            'property': 'og:description',
            content: 'This page is Forbidden',
            vmid: 'og:description'
          },
          {
            'property': 'og:title',
            content: document.title,
            'vmid': 'og:title'
          },
          {
            'property': 'og:url',
            content: 'https://gamu.tk' + window.location.pathname,
            'vmid': 'og:url'
          },
          {
            'name': 'twitter:title',
            content: document.title,
            vmid: 'twitter:title'
          },
          {
            'name': 'twitter:site',
            content: '@GameVsPlayer'
          },
          {
            'name': 'twitter:description',
            content: 'This page doesn\'t exist',
            vmid: 'og:description'
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
  .FBN {
    margin-top: 8rem;
  }
</style>