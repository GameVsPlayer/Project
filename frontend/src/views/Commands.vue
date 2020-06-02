<template>
  <div class="commands">
    <Table v-bind:vari="vari" v-bind:titles="titles"></Table>
  </div>
</template>

<script>
  // @ is an alias to /src
  import Table from "@/components/table.vue";

  export default {
    name: "commands",
    components: {
      Table
    },
    computed: {
      vari: function () {
        return vari;
      },
      titles: function () {
        return titles;
      }
    },
    metaInfo() {
      return {
        meta: [{
            'name': 'description',
            content: 'This page shows a list of commands for my bot',
            vmid: 'description'
          },
          { 'itemprop': "description", content: "This page shows a list of commands for my bot", vmid: "itemprop:description"},
          {
            'property': 'og:description',
            content: 'This page shows a list of commands for my bot',
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
            content: '@GameVsPlayer',
            vmid: 'twitter:site'
          },
          {
            'name': 'twitter:description',
            content: 'This page shows a list of commands for my bot',
            vmid: 'twitter:description'
          },
        ]
      }
    },
    mounted() {
      this.metaInfo;
    }
  };



  let titles = ["Name", "Usage", "What it does"];
  let vari = [
    ["Avatar", "!!avatar | !!avatar @username || !!avatar username",
      "Returns the avatar of a specified user otherwise will show your own"
    ],
    ["osu/ctb/mania/taiko", "!!osu username", "Returns stats about the user in the gamemode specified"],
    ["Messages", "!!messages", "Shows the amount of messages you have send in servers that use the bot"],
    ["Urban", "!!urban word", "Returns a definition about the word you specified if there is one"],
    ["Serverinfo", "!!serverinfo", "Returns infos about the server its used in"],
    ["Randomurban", "!!randomurban", "Returns a random definition of a random word"],
    ["Nsfw", "!!nsfw",
      "posts a image that doesnt contain the save tag from yandere or konachan meaning it can be sfw(only works in a nsfw channel)"
    ],
    ["Kiss/Hug/Headpat", "!!kiss @username || !!hug Username",
      "Returns a kiss/hug/headpat gif and a counter for how often that command has been used on someone"
    ],
    ["Poll", "!!poll what the poll is about", "Returns a message with a ✅ 🚫 reaction"],
    ["Daily", "!!daily", "claim your daily cash (not used for anything yet)"],
    ["Botinfo", "!!botinfo", "Returns infos about the bot"],
    ["Clear", "!!clear amount", "Deletes the amount of specified messages to be deleted up to 100 at the time"],
    ["Calc", "!!calc 4/5", "Returns the calculated number"],
    ["Twitch", "!!twitch twitch", "Returns infos about that streamer"],
    ["Ping", "!!ping", "Returns the ping of the bot"],
    ["Play", "!!play (link) or text to search", "Addes a video to the queue and plays it if its first in the queue"],
    ["Skip", "!!skip",
      "Skip the currently playing song and plays the next one if 50% of the vc members typed this command"
    ],
    ["Stop", "!!stop", "Finishes the queue of songs instandly and makes bot leave the vc"],
    ["Translate", "!!translate (original lang) (lang it should be translated to) (text) available languages",
      "Trys to translate the text you specified"
    ],
    ["Queue", "!!queue", "Shows the current music queue including the current song"],
    ["Volume", "!!volume (volume)", "Changes the volume to the specified value 0-10"],
    ["Leaderboard", "!!leaderboard", "Returns the users with the most messages sent up to 10"],
    ["Userinfo", "!!userinfo", "Returns info about the current/specified user"],
    ["Level", "!!level", "Returns your level"],
    ["Source", "!!source", "Tries to return the source of an Link"],
    ["Invite", "!!invite", "Returns a link to invite the bot"]
  ];
</script>