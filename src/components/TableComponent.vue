<template>
  <table class="table table-striped">
    <thead>
      <tr>
        <th v-for="(label, key) in headers" :key="key" :class="isCurrencyField(key) ? 'text-end' : ''">
          {{ label }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, index) in formattedData" :key="index">
        <td
          v-for="(_, key) in headers"
          :key="key"
          :class="isCurrencyField(key) ? 'text-end' : ''"
        >
          {{ row[key] }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
  export default {
    props: {
      data: Array,
      headers: Object // Custom headers mapping
    },
    computed: {
      formattedData() {
        return this.data.map(row => {
          const formattedRow = { ...row };
          if (formattedRow.sales_month) {
            formattedRow.sales_month = this.formatDate(formattedRow.sales_month);
          }
          if (formattedRow.total_revenue) {
            formattedRow.total_revenue = this.formatAmount(formattedRow.total_revenue);
          }
          if (formattedRow.average_revenue) {
            formattedRow.average_revenue = this.formatAmount(formattedRow.average_revenue);
          }
          return formattedRow;
        });
      }
    },
    methods: {
      formatDate(date) {
        const utcDate = new Date(date); // Create a Date object from the input
        const options = { year: 'numeric', month: '2-digit', timeZone: 'UTC' }; // Force UTC timezone
        return utcDate.toLocaleDateString('en-US', options);
      },
      formatAmount(amount) {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2
        }).format(amount / 100);
      },
      isCurrencyField(key) {
        // Define which fields should be treated as currency
        const currencyFields = ['total_revenue', 'average_revenue'];
        return currencyFields.includes(key);
      }
    }
  };
</script>