<template>
  <mdb-container>
    <input class="form-control" type="text" placeholder="Search" v-model="searchTerm" />
    <mdb-tbl responsive striped bordered hover :searching="true" color="white" class="dataTable">
      <mdb-tbl-head>
        <tr>
          <th v-for="(title,i) in titles" :key="i">{{ title }}</th>
        </tr>
      </mdb-tbl-head>
      <mdb-tbl-body>
        <tr v-for="(col,ii) in filteredTable" :key="ii">
          <td v-for="(n,length) in col" :key="length">{{ n }}</td>
        </tr>
      </mdb-tbl-body>
    </mdb-tbl>
  </mdb-container>
</template>
<script>
import { mdbTbl, mdbTblHead, mdbContainer, mdbTblBody } from "mdbvue";

export default {
  name: "Table",
  components: {
    mdbTbl,
    mdbTblHead,
    mdbTblBody,
    mdbContainer
  },
  props: ["vari", "titles"],
  methods: {},
  data() {
    return {
      searchTerm: ""
    };
  },
  computed: {
    filteredTable: function() {
      return this.vari.filter(col => {
        for (let i = 0; i < col.length; i++) {
          let COL = col[i].toUpperCase();
          if (COL.match(this.searchTerm.toUpperCase())) {
            return col;
          }
        }
      });
    }
  }
};
</script>

<style scoped>
.container {
  margin-top: 2.5rem;
}

table.table * {
  color: white;
  border-color: #ffffff;
}
.table-responsive > .table-bordered {
  border-top: 1px solid #ffffff;
  overflow-x: visible;
}

td {
  padding: 0.1rem;
  font-size: 0.6em;
}

@media (max-width: 480px) {
  td {
    padding: 0.3rem;
    font-size: 0.8em;
  }
  .container {
    width: 100vw;
    margin-left: -6em;
  }
}
input.form-control {
  border-radius: 0;
  background-color: #fff0;
  border-color: #ffffff;
  color: #ffffff;
}
</style>