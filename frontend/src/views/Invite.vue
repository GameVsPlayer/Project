<template>
    <div class="invite">
        <h3>If you'd like to invite my bot then click on the image bellow to get an invite link</h3>
        <a href=/invite>
          <img src="@/assets/invite.jpg" alt="invite" title="Invite"/>
        </a>
    </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "invite",
 metaInfo() {
      return {
      meta: [
            { 'description': 'description', content: 'This page lists an Invite link for my bot', vmid: 'description'},
            { 'property': 'og:description', content: 'This page lists an Invite link for my bot', vmid: 'og:description' },
            { 'property': 'og:title', content: document.title, 'vmid': 'og:title'},
            { 'property': 'og:url', content: 'https://gamu.tk' +  window.location.pathname, 'vmid': 'og:url'},
            { 'name': 'twitter:title', content: document.title, vmid: 'twitter:title'},
            { 'name': 'twitter:site', content: '@GameVsPlayer', vmid: 'twitter:site'},
            { 'name': 'twitter:description', content: 'This page lists an Invite link for my bot', vmid: 'twitter:description'},  
      ]
  }
},
  mounted() {
 this.metaInfo;
 }
}


</script>
<style scoped>
.invite {
  margin-top: 5rem;
  max-width: 100%;
}

  img {
    max-width: 100%;
  }

</style>