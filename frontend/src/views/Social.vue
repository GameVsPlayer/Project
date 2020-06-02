<template>
  <div class="social">
    <h4>If you wish to visit any of my social media, you can do that by clicking on the corresponding image</h4>
    <a v-for="(icon,i) in media" :key="i" :href="icon[2]">
      <i :class="icon[1]" :alt="icon[0]" />
    </a>
    <p>
      There is also one for osu but awesomefont doesn't have a icon for it so
      <a href="/osu">here</a> you go
    </p>
  </div>
</template>

<script>
let mq = window.matchMedia("(max-width: 480px)");
// @ is an alias to /src

export default {
  name: "social",
  methods: {
    isMobile() {
      if (mq.matches) {
        return "2x";
      } else {
        return "3x";
      }
    }
  },
  computed: {
    media: function() {
      for (var ii in icons) {
        icons[ii][1] = icons[ii][1] + " fa-" + this.isMobile();
      }
      return icons;
    }
  },
  metaInfo() {
    return {
      meta: [
        {
          name: "description",
          content: "This page shows a list of all my general online accounts",
          vmid: "description"
        },
        {
          itemprop: "description",
          content: "This page shows a list of all my general online accounts",
          vmid: "itemprop:description"
        },
        {
          property: "og:description",
          content: "This page shows a list of all my general online accounts",
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
          content: "This page shows a list of all my general online accounts",
          vmid: "twitter:description"
        }
      ]
    };
  },
  mounted() {
    this.metaInfo;
  }
};
let icons = [
  ["discord", "fab fa-discord", "/discord"],
  ["twitch", "fab fa-twitch", "/twitch"],
  ["steam", "fab fa-steam", "/steam"],
  ["speedruns", "fas fa-hourglass-start", "/speedruns"],
  ["twitter", "fab fa-twitter", "/twitter"],
  ["youtube", "fab fa-youtube", "/youtube"],
  ["github", "fab fa-github", "/github"],
  ["donate", "fas fa-donate", "/donate"],
  ["xbox", "fab fa-xbox", "/xbox"]
];
</script>
<style scoped>
.social {
  margin-top: 5rem;
}

i {
  margin: 1.5rem;
}

h2 {
  margin-top: 5rem;
}

@media (max-width: 480px) {
  i {
    margin: 0.6rem;
  }
}
</style>