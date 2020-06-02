<template>
  <div class="Todo">
    <div v-if="todos === null">
      <div v-if="updateError.status === null" class="spinner-border text-primary" role="status">
        <span class="sr-only">Loading...</span>
      </div>
      <p v-if="updateError.status === null">Waiting for data</p>
      <p v-else>Something went wrong while getting the data look at the console for me info</p>
    </div>
    <div v-else-if="todos !== undefined">
      <div class="todo" v-for="(todo,i) in todos" :key="i">
        <mdb-Collapse
          :toggleTag="['button']"
          :togglers="2"
          :toggleClass="['btn btn-primary', 'btn-primary']"
          :toggleText="[todo.Category]"
        >
          <b-card>
            <p>
              description: {{ todo.content }}
              <br />
              Time: {{ todo.Date }}
              <br />
              Status: {{ todo.status }}
            </p>
            <p
              v-if="todo.Change !== null"
            >The last changes to the status where done at {{ todo.Change }}</p>
            ID: {{ todo._id }}
          </b-card>
        </mdb-Collapse>
      </div>
    </div>
    <div v-else>
      <p>No todos are currently set</p>
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
.Todo {
  margin-top: 2.8rem;
}
</style>
<script>
// @ is an alias to /src

import { mdbCollapse } from "mdbvue";
export default {
  name: "Todo",
  components: {
    mdbCollapse
  },
  mounted: function() {
    this.update();
    this.metaInfo;
  },
  methods: {
    update() {
      let source = new EventSource("/backend/todo/");

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
          if (document.getElementsByClassName("Todo").length === 0)
            return source.close();
          if (data.todos[0] === null) {
            return (this.todos = undefined);
          }
          for (let ii = 0; ii < data.todos.length; ii++) {
            let date = new Date(data.todos[ii].Date);

            let time = date.toLocaleTimeString(
              window.navigator.userLanguage ||
                window.navigator.language ||
                "en-US"
            );
            let dateTime = date.toLocaleDateString(
              window.navigator.userLanguage ||
                window.navigator.language ||
                "en-US"
            );
            data.todos[ii].Date = `${dateTime} ${time}`;
            date.toLocaleDateString(
              window.navigator.userLanguage ||
                window.navigator.language ||
                "en-US"
            );
            if (data.todos[ii].Change !== null) {
              let changeDate = new Date(data.todos[ii].Change);

              let cTime = changeDate.toLocaleTimeString(
                window.navigator.userLanguage ||
                  window.navigator.language ||
                  "en-US"
              );
              let cDate = changeDate.toLocaleDateString(
                window.navigator.userLanguage ||
                  window.navigator.language ||
                  "en-US"
              );
              data.todos[ii].Change = `${cDate} ${cTime}`;
            }
          }
          this.todos = data.todos;
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
      }, 4000);
    }
  },
  metaInfo() {
    return {
      meta: [
        {
          name: "description",
          content: "This page shows my current bot/website todo list",
          vmid: "description"
        },
        {
          itemprop: "description",
          content: "This page shows my current bot/website todo list",
          vmid: "itemprop:description"
        },
        {
          itemprop: "description",
          content: "This page shows my current bot/website todo list",
          vmid: "itemprop:description"
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
          content: "This page shows my current bot/website todo list",
          vmid: "twitter:description"
        }
      ]
    };
  },
  data() {
    return {
      todos: null,
      updateError: {
        status: null
      }
    };
  }
};
</script>