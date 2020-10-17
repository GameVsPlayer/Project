<template>
  <div class="imprint">
    <button v-if="info === null" @click="recaptcha">reCAPTCHA</button>
    <dl v-if="info === null">
      <dt>To view my contact information pls verify using <b>reCAPTCHA</b></dt>
    </dl>
    <dl v-else>
      <dt v-for="(block,i) in message" :key="i" ><span v-html="block"/> </dt>
    </dl>
  </div>
</template>
<style scoped>
  dt {
    color: white;
    font-size: 1rem;
  }

  .imprint {
    margin-top: 7rem;
  }

  @media (max-width: 480px) {
    dt {
      font-size: 0.9rem;
    }
  }
</style>
<script>
  export default {
    name: "imprint",
    data() {
      return {
        info: null,
        message: null
      }
    },
    methods: {
      async recaptcha() {
        await this.$recaptchaLoaded();
        const recaptcha = this.$recaptchaInstance;
        recaptcha.hideBadge();
        const token = await this.$recaptcha('verify');
        this.axios.post('/backend/verify/', {
            token: token
          })
          .then(res => {
            this.message = JSON.parse(res.data.message);
            this.info = res.data;
          });
      },
    },
}
</script>