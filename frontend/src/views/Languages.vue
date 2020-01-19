<template>
  <div class="languages">
    <Table v-bind:vari="vari" v-bind:titles="titles"></Table>
  </div>
</template>

<script>
  // @ is an alias to /src
  import Table from "@/components/table.vue";

  export default {
    name: "languages",
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
            'description': 'description',
            content: 'This page lists all the languages supported by the translate command and their corresponding code',
            vmid: 'description'
          },
          {
            'property': 'og:description',
            content: 'This page lists all the languages supported by the translate command and their corresponding code',
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
            content: 'This page lists all the languages supported by the translate command and their corresponding code',
            vmid: 'twitter:description'
          },
        ]
      }
    },
    mounted() {
      this.metaInfo;
    }
  };

  let titles = ["Language", "Lang code"];
  let vari = [
    ["Automatic", "auto"],
    ["Afrikaans", "af"],
    ["Albanian", "sq"],
    ["Amharic", "am"],
    ["Arabic", "ar"],
    ["Armenian", "hy"],
    ["Azerbaijani", "az"],
    ["Basque", "eu"],
    ["Belarusian", "be"],
    ["Bengali", "bn"],
    ["Bosnian", "bs"],
    ["Bulgarian", "bg"],
    ["Catalan", "ca"],
    ["Cebuano", "ceb"],
    ["Chichewa", "ny"],
    ["Chinese (Simplified)", "zh-CN"],
    ["Chinese (Traditional)", "zh-TW"],
    ["Corsican", "co"],
    ["Croatian", "hr"],
    ["Czech", "cs"],
    ["Danish", "da"],
    ["Dutch", "nl"],
    ["English", "en"],
    ["Esperanto", "eo"],
    ["Estonian", "et"],
    ["Filipino", "tl"],
    ["Finnish", "fi"],
    ["French", "fr"],
    ["Frisian", "fy"],
    ["Galician", "gl"],
    ["Georgian", "ka"],
    ["German", "de"],
    ["Greek", "el"],
    ["Gujarati", "gu"],
    ["Haitian Creole", "ht"],
    ["Hausa", "ha"],
    ["Hawaiian", "haw"],
    ["Hebrew", "he"],
    ["Hebrew", "iw"],
    ["Hindi", "hi"],
    ["Hmong", "hmn"],
    ["Hungarian", "hu"],
    ["Icelandic", "is"],
    ["Igbo", "ig"],
    ["Indonesian", "id"],
    ["Irish", "ga"],
    ["Italian", "it"],
    ["Japanese", "ja"],
    ["Javanese", "jw"],
    ["Kannada", "kn"],
    ["Kazakh", "kk"],
    ["Khmer", "km"],
    ["Korean", "ko"],
    ["Kurdish (Kurmanji)", "ku"],
    ["Kyrgyz", "ky"],
    ["Lao", "lo"],
    ["Latin", "la"],
    ["Latvian", "lv"],
    ["Lithuanian", "lt"],
    ["Luxembourgish", "lb"],
    ["Macedonian", "mk"],
    ["Malagasy", "mg"],
    ["Malay", "ms"],
    ["Malayalam", "ml"],
    ["Maltese", "mt"],
    ["Maori", "mi"],
    ["Marathi", "mr"],
    ["Mongolian", "mn"],
    ["Myanmar (Burmese)", "my"],
    ["Nepali", "ne"],
    ["Norwegian", "no"],
    ["Pashto", "ps"],
    ["Persian", "fa"],
    ["Polish", "pl"],
    ["Portuguese", "pt"],
    ["Punjabi", "pa"],
    ["Romanian", "ro"],
    ["Russian", "ru"],
    ["Samoan", "sm"],
    ["Scots Gaelic", "gd"],
    ["Serbian", "sr"],
    ["Sesotho", "st"],
    ["Shona", "sn"],
    ["Sindhi", "sd"],
    ["Sinhala", "si"],
    ["Slovak", "sk"],
    ["Slovenian", "sl"],
    ["Somali", "so"],
    ["Spanish", "es"],
    ["Sundanese", "su"],
    ["Swahili", "sw"],
    ["Swedish", "sv"],
    ["Tajik", "tg"],
    ["Tamil", "ta"],
    ["Telugu", "te"],
    ["Thai", "th"],
    ["Turkish", "tr"],
    ["Ukrainian", "uk"],
    ["Urdu", "ur"],
    ["Uzbek", "uz"],
    ["Vietnamese", "vi"],
    ["Welsh", "cy"],
    ["Xhosa", "xh"],
    ["Yiddish", "yi"],
    ["Yoruba", "yo"],
    ["Zulu", "zu"]
  ];
</script>