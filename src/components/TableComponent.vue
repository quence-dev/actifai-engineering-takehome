<template>
  <div>
    <!-- Text-based filter -->
    <div class="mb-3">
      <label for="filterInput" class="form-label">Filter by Name</label>
      <input
        v-model="filter"
        id="filterInput"
        class="form-control"
        placeholder="Enter name or group"
      />
    </div>

    <!-- Range-based filters -->
    <div class="mb-3">
      <label class="form-label">Filter by Total Revenue</label>
      <div class="d-flex gap-2">
        <input
          v-model.number="minTotalRevenue"
          type="number"
          class="form-control"
          placeholder="Min Total Revenue"
        />
        <input
          v-model.number="maxTotalRevenue"
          type="number"
          class="form-control"
          placeholder="Max Total Revenue"
        />
      </div>
    </div>
    <div class="mb-3">
      <label class="form-label">Filter by Average Revenue</label>
      <div class="d-flex gap-2">
        <input
          v-model.number="minAverageRevenue"
          type="number"
          class="form-control"
          placeholder="Min Average Revenue"
        />
        <input
          v-model.number="maxAverageRevenue"
          type="number"
          class="form-control"
          placeholder="Max Average Revenue"
        />
      </div>
    </div>

    <!-- Table -->
    <table class="table table-striped">
      <thead>
        <tr>
          <th v-for="(label, key) in headers" :key="key" :class="isCurrencyField(key) ? 'text-end' : ''">
            {{ label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in filteredData" :key="index">
          <td
            v-for="(_, key) in headers"
            :key="key"
            :class="isCurrencyField(key) ? 'text-end' : ''"
          >
            {{ formatCell(row[key], key) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  export default {
    props: {
      data: Array,
      headers: Object // Custom headers mapping
    },
    data() {
      return {
        filter: '', // Text-based filter
        minTotalRevenue: null, // Min filter for total revenue
        maxTotalRevenue: null, // Max filter for total revenue
        minAverageRevenue: null, // Min filter for average revenue
        maxAverageRevenue: null // Max filter for average revenue
      };
    },
    computed: {
      filteredData() {
        return this.data.filter(row => this.passesFilters(row));
      }
    },
    methods: {
      passesFilters(row) {
        // Text-based filtering for name fields
        const lowerFilter = this.filter.toLowerCase();
        const matchesTextFilter =
          !this.filter ||
          Object.entries(row).some(([key, value]) => {
            if (['user_name', 'group_name', 'group_names'].includes(key)) {
              return String(value).toLowerCase().includes(lowerFilter);
            }
            return false;
          });

        // Range-based filtering for numeric fields
        const matchesTotalRevenue =
          (!this.minTotalRevenue || (Number(row.total_revenue) >= this.minTotalRevenue * 100)) &&
          (!this.maxTotalRevenue || (Number(row.total_revenue) <= this.maxTotalRevenue * 100));

        const matchesAverageRevenue =
          (!this.minAverageRevenue || (Number(row.average_revenue) >= this.minAverageRevenue * 100)) &&
          (!this.maxAverageRevenue || (Number(row.average_revenue) <= this.maxAverageRevenue * 100));

        return matchesTextFilter && matchesTotalRevenue && matchesAverageRevenue;
      },
      formatCell(value, key) {
        if (key === 'sales_month') {
          return this.formatDate(value);
        }
        if (this.isCurrencyField(key)) {
          return this.formatAmount(value);
        }
        return value;
      },
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